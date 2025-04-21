import { Outlet } from "react-router-dom"
import SettingsHeader from "./SettingsHeader"

const SettingsLayout = () => {
  return (
    <>
      <SettingsHeader />
      <Outlet />
    </>
  )
}

export default SettingsLayout;