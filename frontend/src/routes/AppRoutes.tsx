import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "../utils";

// Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import MainLayout from "../components/layouts/MainLayout";
import CreatePost from "../pages/CreatePost";
import Post from "../pages/Post";


const AppRoutes = () => {

  return (

    <Routes>

      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route index path="" element={<Home />} />
          <Route index path="create-post/" element={<CreatePost />} />
          <Route path="post/:postId/" element={<Post />} />
        </Route>
      </Route>
  
    </Routes>
  )
};

export default AppRoutes;