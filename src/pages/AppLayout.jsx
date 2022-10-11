import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import PreLoader from "../components/PreLoader";
import ChatContextProvider from "../context/chatContext";

const AppLayout = () => {
  const [preLoading, setPreLoading] = useState(true);

  //a timer for my app preloader, 4seconds before displaying app
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      {preLoading ? (
        <PreLoader />
      ) : (
        <>
          <Navbar />
          <ChatContextProvider>
            <Main><Outlet /></Main>
          </ChatContextProvider>
        </>)}
    </Wrapper>
  );
};

export default AppLayout;

const Wrapper = styled.main`
  width: 100%;
`;

const Main = styled.div`
  width: min(100%, 1300px);
  margin: 0 auto;
  box-shadow: var(--shadow);
  min-height: 90vh;
`;
