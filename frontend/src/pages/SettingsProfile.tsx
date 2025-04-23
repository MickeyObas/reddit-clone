import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import DisplayNameModal from "../components/modals/DisplayNameModal";
import AboutModal from "../components/modals/AboutModal";
import AvatarModal from "../components/modals/AvatarModal";
import BannerModal from "../components/modals/BannerModal";

const SettingsProfile = () => {

  const { user } = useAuth();
  const { showModal, hideModal } = useModal();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${user?.id}/`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          setProfile(data);
          console.log(data);
        }
      }catch(err){
        console.error(err);
      }
    };

    fetchProfile();

  }, [user?.id])

  const updateProfile = async (field: string, newvalue) => {
    const updateProfileForm = new FormData();

    updateProfileForm.append(field, newvalue);

    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${user?.id}/`, {
        method: 'PATCH',
        body: updateProfileForm
      });
      if(!response?.ok){
        console.log("Could not update profile");
      }else{
        setProfile((prev) => ({...prev, [field]: URL.createObjectURL(newvalue)}))
        const data = await response?.json();
        console.log(data);
        console.log(field, newvalue);
      }
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-1 pt-6 ps-4 pe-6">
      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">General</h1>
        <div className="flex flex-col gap-y-6">
          <div 
            onClick={() => 
              showModal(<DisplayNameModal hideModal={hideModal} updateProfile={updateProfile} currentDisplayName={profile?.display_name}/>
              )}
            className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Display name</span>
              <span className="text-xs text-gray-500">Changing your display name won't change your username</span>
            </div>
            <div 
              className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div 
            onClick={() => showModal(<AboutModal hideModal={hideModal} updateProfile={updateProfile} currentAbout={profile?.about_description}/>)}
            className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">About description</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div
            onClick={() => showModal(<AvatarModal hideModal={hideModal} updateProfile={updateProfile} currentAvatar={profile?.avatar}/>)} 
            className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Avatar</span>
              <span className="text-xs text-gray-500">Edit your avatar or upload an image</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div 
            onClick={() => showModal(<BannerModal hideModal={hideModal} updateProfile={updateProfile} currentBanner={profile?.banner}/>)}
            className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Banner</span>
              <span className="text-xs text-gray-500">Upload a profile background image</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Social links</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Mark as mature (18+)</span>
              <span className="text-xs text-gray-500">Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div className="flex justify-between gap-y-6">
            <div className="flex flex-col">
              <span className="text-[14px]">Show active communities</span>
              <span className="text-xs text-gray-500">Show what communities you're most active in on your profile</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">Advanced</h1>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-0.5">
              <span className="font-medium">Profile moderation</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <SquareArrowOutUpRight size={18}/>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SettingsProfile;