import { Outlet, useParams } from "react-router-dom"
import UserProfileHeader from "./UserProfileHeader"
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils";
import { BACKEND_URL } from "../../config";
import { Profile } from "../../types/profile";

const UserProfileLayout = () => {

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
    <div>
      <UserProfileHeader profile={profile}/>
      <div>
        <Outlet context={{profile}}/>
      </div>
    </div>
  )
}

export default UserProfileLayout;