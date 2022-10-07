import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../components/Navbar';
import { useGeneralContext } from '../context/generalContext';

const AppLayout = () => {
  const { darkMode } = useGeneralContext();

  return (
    <Wrapper className={`${darkMode && "dark-mode"}`}>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

export default AppLayout

const Wrapper = styled.div`
  width: 100%;
`

const Main = styled.main`
  width: min(100%, 1300px);
  margin: 0 auto;
  box-shadow: var(--shadow);
  min-height: 90vh;
`