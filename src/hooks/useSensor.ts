import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define an extended interface for DeviceOrientationEvent including requestPermission
interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface GyroscopeState {
  x: number | null;
  y: number | null;
  z: number | null;
}

interface AccelerometerState {
  x: number | null;
  y: number | null;
  z: number | null;
}

export interface SensorData {
  timestamp: number;
  acceleration: AccelerometerState;
  gyroscope: GyroscopeState;
}

const isPermissionGrantedAtom = atom(
  typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventExtended).requestPermission !== 'function',
);

type Callback = (data: SensorData[]) => void;
type CallbackPromise = (data: SensorData[]) => Promise<void>;

export function useSensor(callack?: Callback & CallbackPromise, intervalMs = 500) {
  const isSupported = typeof window.DeviceOrientationEvent !== 'undefined';
  const [isPermissionGranted, setIsPermissionGranted] = useAtom(isPermissionGrantedAtom);

  const sensorDataListRef = useRef<SensorData[]>([]);
  const [sensorDataList, setSensorDataList] = useState<SensorData[]>([]);

  const handleMotion = useCallback((e: DeviceMotionEvent) => {
    const { accelerationIncludingGravity, rotationRate } = e;
    const now = Date.now();
    const tmpData: SensorData = {
      timestamp: now,
      acceleration: {
        x: accelerationIncludingGravity?.x ?? null,
        y: accelerationIncludingGravity?.y ?? null,
        z: accelerationIncludingGravity?.z ?? null,
      },
      gyroscope: {
        x: rotationRate?.alpha ?? null,
        y: rotationRate?.beta ?? null,
        z: rotationRate?.gamma ?? null,
      },
    };
    const clonedSensorDataList = structuredClone(sensorDataListRef.current);
    clonedSensorDataList.push(tmpData);
    sensorDataListRef.current = clonedSensorDataList;
  }, []);

  useEffect(() => {
    if (!isPermissionGranted) return;

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isPermissionGranted, handleMotion]);

  useEffect(() => {
    if (!isPermissionGranted) return;

    const interval = setInterval(() => {
      const clonedSensorDataList = structuredClone(sensorDataListRef.current);
      sensorDataListRef.current = [];
      setSensorDataList(clonedSensorDataList);
      if (callack) callack(clonedSensorDataList);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [callack, intervalMs, isPermissionGranted, sensorDataListRef]);

  const requestPermission = useCallback(async () => {
    const deviceOrientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

    if (typeof deviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await deviceOrientationEvent.requestPermission();
        setIsPermissionGranted(permissionState === 'granted');
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
      }
    }
  }, [setIsPermissionGranted]);

  const revokePermission = useCallback(() => {
    setIsPermissionGranted(false);
  }, [setIsPermissionGranted]);

  return [sensorDataList, { requestPermission, isPermissionGranted, isSupported, revokePermission }] as const;
}
