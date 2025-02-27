import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import EmailVerify from "../pages/EmailVerify";
import RegisterNoVerify from "../pages/RegisterNoVerify";
import RegisterTwo from "../pages/RegisterTwo";


const AppRoutes = () => {
  const { isVerified, isRegistered } = useAuth();
  

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route 
        path="/email-verify" 
        element={isVerified 
          ? isRegistered
            ? <Navigate to={'/login/'} />
            : <RegisterTwo />
          : <EmailVerify/>}
      />
      <Route 
        path="/register-2" 
        element={isVerified ? <RegisterTwo /> : <Navigate to={'/register/'}/>} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register-no-verify" element={<RegisterNoVerify />} />
    </Routes>
  )
};

export default AppRoutes;