import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import PreLoader from "../components/PreLoader";
import { useGeneralContext } from "../context/generalContext";

const AppLayout = () => {
  const { darkMode } = useGeneralContext();
  const [preLoading, setPreLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper className={`${darkMode ? "dark-mode" : ""}`}>
      {preLoading ? (
        <PreLoader />
      ) : (
        <>
          <Navbar />
          <Main><Outlet /></Main>
        </>
      )}
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
