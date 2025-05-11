import { Outlet, useOutletContext, useParams } from "react-router-dom"
import UserProfileHeader from "./UserProfileHeader"
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils";
import { BACKEND_URL } from "../../config";
import { Profile } from "../../types/profile";
import Sidebar from "./Sidebar";

type LayoutContextType = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommunityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserProfileLayout = () => {
  const {setIsSidebarOpen, setIsCommunityModalOpen} = useOutletContext<LayoutContextType>();
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [userId]);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/`, {
        method: 'GET'
      });
      if(!response?.ok){
        console.log("Profile fetching failed.");
      }else{
        const data = await response?.json();
        setProfile(data);
        console.log(data);
      }
    };
    fetchProfile();
  }, [userId])


  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
      <div className='hidden xl:block'>
        <Sidebar 
          isSidebarOpen={true}
          setIsCommunityModalOpen={setIsCommunityModalOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />      
      </div>
      <div className="md:p-6">
        <UserProfileHeader profile={profile}/>
        <div>
          <Outlet context={{profile}}/>
        </div>
      </div>
    </div>
    
  )
}

export default UserProfileLayout;