import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --background: #F4EEF8;
    --purple: #824DF4;
    --white: #FFFFFF;
    --black: #000000;
    --green: #27AE60;
    --orange: #F2994A;
    --warning: #cc3300;
    --yellow-light: #F2F8EE;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: var(--background);
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  input {
    border: 0;
    outline: none;
  }
`;