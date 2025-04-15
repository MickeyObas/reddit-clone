import { Outlet } from "react-router-dom"
import UserProfileHeader from "./UserProfileHeader"

const UserProfileLayout = () => {
  return (
    <div>
      <UserProfileHeader />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default UserProfileLayout;