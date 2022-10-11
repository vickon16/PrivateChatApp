import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import AuthLayout from "./pages/AuthLayout";
import { useAuth } from "./context/userAuthContext";
import MyProfile from "./pages/MyProfile";
import SelectedUserProfile from "./pages/SelectedUserProfile";
import GlobalCSS from "./globalCSS";
import { ThemeProvider } from "styled-components";
import { useGeneralContext } from "./context/generalContext";
import {darkTheme, lightTheme} from "./themes";

const App = () => {
  const {state} = useAuth();
  const { darkMode } = useGeneralContext();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalCSS />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            // if user doesnt exist, navigate to login page
            state.user === null ? <Navigate to="/auth/login" /> : <AppLayout />
            }>
            <Route index element={<Home />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/selected-user-profile" element={<SelectedUserProfile />} />
          </Route>
          <Route path="/auth" element={
            // if user exist, navigate to home page
            state.user !== null ? <Navigate to="/" /> : <AuthLayout />
            }>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/*" element={<h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
