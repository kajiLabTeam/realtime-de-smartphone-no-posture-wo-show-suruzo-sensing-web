import { SensorData } from '@/hooks/useSensor';

export const fetchSensorData = async (sensorDataList: SensorData[]) => {
  const url = new URL('/api/raw', import.meta.env.VITE_API_BASE_URL);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sensorDataList),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
