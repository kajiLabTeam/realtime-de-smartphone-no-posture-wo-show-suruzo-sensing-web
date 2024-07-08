import styled from 'styled-components';
import Sensing from './components/Sensing';
import { useSensor } from './hooks/useSensor';

const Main = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const { isPermissionGranted, requestPermission } = useSensor()[1];

  return <Main>{isPermissionGranted ? <Sensing /> : <button onClick={requestPermission}>開始</button>}</Main>;
}
