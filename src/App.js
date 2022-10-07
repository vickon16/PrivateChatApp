import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import AuthLayout from "./pages/AuthLayout";
import { useAuth } from "./context/userAuthContext";
import Profile from "./pages/Profile";
import ChatContextProvider from "./context/chatContext";

const App = () => {
  const {state} = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          state.user === null ? <Navigate to="/auth/login" /> : <AppLayout />
          }>
          <Route index element={
            <ChatContextProvider>
              <Home />
            </ChatContextProvider>
          } />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/auth" element={
          state.user !== null ? <Navigate to="/" /> : <AuthLayout />
          }>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/*" element={<h1>Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
