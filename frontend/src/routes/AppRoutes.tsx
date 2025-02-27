import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "../utils";

// Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";


const AppRoutes = () => {

  return (

    <Routes>

      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/">
          <Route index path="" element={<Home />} />
        </Route>
      </Route>
  
    </Routes>
  )
};

export default AppRoutes;