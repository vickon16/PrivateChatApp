import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { flexCenter } from "../globalFunctions";

const AuthLayout = () => {
  return (
    <Wrapper>
      <Main><Outlet /></Main>
    </Wrapper>
  );
};

export default AuthLayout;

const Wrapper = styled.main`
  width: 100%;
`;

const Main = styled.div`
  width: min(100%, 1300px);
  margin: 0 auto;
  padding: 0 20px;
  ${flexCenter("center", "", "flex-start")};
  height: 100vh;

  > section {
    width: min(100%, 500px);
    box-shadow: var(--shadow);
    padding: 30px 20px;
    border-radius: 5px;
    margin-top: 5rem;
    ${flexCenter("", "column")};
    row-gap: 1.8rem;

    h3 {
      font-weight: 500;
      font-size: 1.2rem;
    }

    form {
      user-select: none;
      width: 100%;

      > article {
        margin-top: 20px;

        input {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border: 1px solid var(--color6-Dark);
          border-radius: 5px;
          font-size: 1rem;
        }
      }

      button {
        margin: 2rem 0 1rem;
      }

      .form-msg {
        font-size: clamp(0.9rem, 1vw, 1rem);
        text-align: center;

        a {
          color: var(--color3-Blue);
          margin-left: 0.2rem;
        }
      }
    }
  }

  @media screen and (max-width: 425px) {
      padding: 0;
  } ;
`;
