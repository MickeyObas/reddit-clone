import { Outlet, useOutletContext } from "react-router-dom"
import SettingsHeader from "./SettingsHeader"
import Sidebar from "./Sidebar";

type LayoutContextType = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommunityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingsLayout = () => {
  const {setIsSidebarOpen, setIsCommunityModalOpen} = useOutletContext<LayoutContextType>();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
      <div className='hidden xl:block'>
        <Sidebar 
          isSidebarOpen={true}
          setIsCommunityModalOpen={setIsCommunityModalOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />      
      </div>
      <div className="md:py-1 md:px-2">
        <SettingsHeader />
          <Outlet />
      </div>
    </div>
  )
}

export default SettingsLayout;