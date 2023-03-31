import { createGlobalStyle } from 'styled-components';
import './reset.css';

const GlobalStyle = createGlobalStyle`
  * {
    outline: none;
    box-sizing: border-box;
  }

  body {
    background-color: #53caf2;
    font-family: 'Pretendard Variable', Pretendard, -apple-system,
      BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI',
      'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
  }

  #root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }

  #root > div {
    @media all and (min-width: 1024px) {
      width: 600px;
    }
    @media all and (min-width: 768px) and (max-width: 1023px) {
      width: 600px;
    }
    @media all and (max-width: 767px) {
      width: 100%;
    }
  }
`;

export default GlobalStyle;