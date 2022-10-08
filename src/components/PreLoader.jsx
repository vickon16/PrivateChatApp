import Typewriter from "typewriter-effect";
import styled, { keyframes } from "styled-components";
import { flexCenter } from "../globalFunctions";

const PreLoader = () => {
  return (
    <Container>
      <Content>
        <Typewriter
          options={{
            strings: ["Cyril's ChatApp💬"],
            autoStart: true,
            loop: false,
            deleteSpeed: 40,
            delay: 45,
          }}
        />
        <img src="/LogoC.svg" alt="logo" />
      </Content>
    </Container>
  );
};

export default PreLoader;

const Container = styled.section`
  width: min(100%, 800px);
  margin: 0 auto;
  ${flexCenter("center", "column", "center")};
  height: calc(100vh - 350px);
`;

const animate = keyframes`
  from {width: 0% ; left: 0%};
  to {width: 100% ; left: 50%};
`;

const animateImg = keyframes`
  0% {opacity: 0};
  25% {opacity: 1};
  50% {opacity: 1};
  75% {opacity: 1};
  100% {opacity: 0}
`;

const Content = styled.article`
  ${flexCenter("", "column")};
  gap: 30px;

  .Typewriter {
    font-size: clamp(1.4rem, 1.7vw, 1.7rem);
    padding-bottom: 0.7rem;
    position: relative;
    font-family: "Space Grotesk", sans-serif;

    &::after {
      content: "";
      position: absolute;
      background: var(--color7-Dark2);
      height: 2px;
      bottom: 0;
      left: 50%;
      width: 0%;
      transform: translate(-50%);
      animation: ${animate} 1s 1s forwards linear;
    }
  }

  img {
    width: 50px;
    height: 50px;
    opacity: 0;
    animation: ${animateImg} 2.5s 0.5s forwards linear;
  }
`;
