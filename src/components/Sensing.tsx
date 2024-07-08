import styled from 'styled-components';
import { useSensor } from '@/hooks/useSensor';
import { fetchSensorData } from '@/fetcher';

const Container = styled.div`
  text-align: center;
`;

export default function Sensing() {
  const [sensorData, { revokePermission }] = useSensor(async (data) => {
    const res = await fetchSensorData(data);
  });

  return (
    <Container>
      <div>
        <h2>加速度</h2>
        <p>x: {sensorData?.acceleration.x}</p>
        <p>y: {sensorData?.acceleration.y}</p>
        <p>z: {sensorData?.acceleration.z}</p>
      </div>

      <div>
        <h2>角速度</h2>
        <p>x: {sensorData?.gyroscope.x}</p>
        <p>y: {sensorData?.gyroscope.y}</p>
        <p>z: {sensorData?.gyroscope.z}</p>
      </div>

      <button onClick={revokePermission}>停止</button>
    </Container>
  );
}
