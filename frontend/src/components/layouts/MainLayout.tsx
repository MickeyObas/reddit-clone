import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header"
import Sidebar from "./Sidebar"
import CreateCommunityModal from "../ui/CreateCommunityModal";
import { CommunityFormData } from "../../types/community";


const MainLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityFormData>({
    name: '',
    description: '',
    bannerFile: null,
    iconFile: null,
    topics: [],
    bannerPreview: '',
    iconPreview: '',
    type: 'public',
    isForMature: false
  })

  useEffect(() => {
    if(isSidebarOpen){
      document.body.classList.add('overflow-hidden');
    }else{
      document.body.classList.remove('overflow-hidden');
    };
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen])

  return (
    <>
      {isCommunityModalOpen && (
        <CreateCommunityModal 
          setIsCommunityModalOpen={setIsCommunityModalOpen}
          formData={communityData}
          setFormData={setCommunityData}
        />
      )}
      <Header 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setIsCommunityModalOpen={setIsCommunityModalOpen}
      />
      <Outlet />
    </>
  )
};

export default MainLayout;