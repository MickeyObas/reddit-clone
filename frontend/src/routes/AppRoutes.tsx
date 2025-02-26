import { Routes, Route } from "react-router-dom";

// Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import EmailVerify from "../pages/EmailVerify";
import RegisterNoVerify from "../pages/RegisterNoVerify";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/register-no-verify" element={<RegisterNoVerify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
    </Routes>
  )
};

export default AppRoutes;