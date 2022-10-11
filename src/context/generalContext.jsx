/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState } from "react";

const GeneralContext = createContext();

const initialState = {
  darkMode : true,
  navOpen : false,
};

const GeneralContextProvider = ({ children }) => {
  const [{navOpen, darkMode}, setState] = useState(initialState);

  // set Navbar open or close
  const setNavOpen = (data) =>
    setState((prev) => ({ ...prev, navOpen: data }));

    // toggle Light or Dark mode
  const toggleMode = () =>
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));

  return (
    <GeneralContext.Provider
      value={{
        navOpen,
        darkMode,
        setNavOpen,
        toggleMode
      }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => useContext(GeneralContext);

export default GeneralContextProvider;
