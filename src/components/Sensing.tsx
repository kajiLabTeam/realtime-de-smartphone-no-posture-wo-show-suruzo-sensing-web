import styled from 'styled-components';
import { useSensor } from '@/hooks/useSensor';
import { fetchSensorData } from '@/fetcher';

const Container = styled.div`
  text-align: center;
`;

export default function Sensing() {
  const [sensorDataList, { revokePermission }] = useSensor(async (data) => {
    const res = await fetchSensorData(data);
    console.log(res);
  }, 500);

  const lastData = sensorDataList.at(-1);

  return (
    <Container>
      <div>
        <h2>加速度</h2>
        <p>x: {lastData?.acceleration.x}</p>
        <p>y: {lastData?.acceleration.y}</p>
        <p>z: {lastData?.acceleration.z}</p>
      </div>

      <div>
        <h2>角速度</h2>
        <p>x: {lastData?.gyroscope.x}</p>
        <p>y: {lastData?.gyroscope.y}</p>
        <p>z: {lastData?.gyroscope.z}</p>
      </div>

      <button onClick={revokePermission}>停止</button>
    </Container>
  );
}
