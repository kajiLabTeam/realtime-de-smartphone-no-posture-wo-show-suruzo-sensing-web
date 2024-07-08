import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 16px;
  }

  * {
    margin: unset;
    padding: unset;
    box-sizing: border-box;
  }
`;
