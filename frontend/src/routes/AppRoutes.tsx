import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "../utils";

// Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import MainLayout from "../components/layouts/MainLayout";
import CreatePost from "../pages/CreatePost";
import Post from "../pages/Post";
import Community from "../pages/Community";
import { AboutCommunity } from "../pages/AboutCommunity";
import UserProfile from "../pages/UserProfile";
import UserProfileLayout from "../components/layouts/UserProfileLayout";
import UserPosts from "../pages/UserPosts";
import UserComments from "../pages/UserComments";
import SettingsLayout from "../components/layouts/SettingsLayout";
import Settings from "../pages/SettingsAccount";
import SettingsAccount from "../pages/SettingsAccount";
import SettingsProfile from "../pages/SettingsProfile";


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
          <Route path="create-post/" element={<CreatePost />} />
          <Route path="post/:postId/" element={<Post />} />
          <Route path="community/:communityId/" element={<Community />} />
          <Route path="community/:communityId/best/" element={<Community sort={'best'}/>} />
          <Route path="community/:communityId/hot/" element={<Community sort={'hot'}/>} />
          <Route path="community/:communityId/latest/" element={<Community sort={'latest'}/>} />
          <Route path="community/:communityId/about/" element={<AboutCommunity />} />
          <Route path="community/:communityId/create-post/" element={<CreatePost />} />

          <Route path="user/:userId/" element={<UserProfileLayout />}>
            <Route index path="" element={<UserProfile />} />
            <Route path="submitted/" element={<UserPosts />} />
            <Route path="comments/" element={<UserComments />} />
          </Route>

          <Route path="settings/" element={<SettingsLayout />}>
            <Route index path="account/" element={<SettingsAccount />} />
            <Route index path="profile/" element={<SettingsProfile />} />
            <Route index path="privacy/" element={<Settings />} />
            <Route index path="preferences/" element={<Settings />} />
            <Route index path="notifications/" element={<Settings />} />
            <Route index path="email/" element={<Settings />} />
          </Route>

        </Route>
      </Route>
  
    </Routes>
  )
};

export default AppRoutes;