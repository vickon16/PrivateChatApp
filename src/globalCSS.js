import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Ubuntu", sans-serif;
    user-select: none;
  }

  html {
    scroll-behavior: smooth;
  }

  :root {
    font-size: 16px;
    --color1-Bg : ${(props) => props.theme.color1Bg} ;
    --color2-White : ${(props) => props.theme.color2White};
    --color3-Blue : ${(props) => props.theme.color3Blue};
    --color4-Gray: ${(props) => props.theme.color4Gray};
    --color5-Red : ${(props) => props.theme.color5Red};
    --color6-Dark : ${(props) => props.theme.color6Dark};
    --color7-Dark2 : ${(props) => props.theme.color7Dark2};
    --color8-Blue2 : ${(props) => props.theme.color8Blue2};
    --color9-Bg2 : ${(props) => props.theme.color9Bg2};
    --active : ${(props) => props.theme.active};
    --shadow : ${(props) => props.theme.shadow};
  }

  ::-webkit-scrollbar {
    display: none;
  }

  body, #root {
    width: 100%;
    min-height: 100vh;
    background-color: var(--color1-Bg);
    color: var(--color2-White);
  }

  a {
    text-decoration: none;
    color: var(--color2-White);
  }

  input {
    outline: none;
    border-radius: 5px;
  }

  ul {
    list-style: none;
  }

  input::placeholder {
    color: var(--lightGray);
  }

  img {
    width: 100%;
    object-fit: cover;
    display: block;
  }

  .btn {
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid var(--color4-Gray);
    color: var(--color2-White);
    background-color: var(--color1-Bg);
    cursor: pointer;
    transition: 0.3s ease-in-out;
    font-size: 1rem;
  }

  .btn:hover {
    scale: 1.05;
  }
  .btn:hover:disabled {
    scale: none;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .error {
    text-align: center;
    color: var(--color5-Red);
    font-size: .92rem;
    width: min(100%, 300px);
    margin: 0 auto;
    padding: 1rem .5rem 0rem;
    word-wrap: break-word;
  }

  .loader-wrapper {
    width: fit-content;
    margin: 1rem auto 0rem;
  }
`;
