import { useRef, useState } from "react"
import { CloudUpload } from "lucide-react";
import redditIcon from '../../assets/icons/reddit.png';

interface AvatarModalProps {
  hideModal: () => void,
  updateProfile: (field: string, newValue: string | File) => void,
  currentAvatar: string
}


const AvatarModal = ({hideModal, updateProfile, currentAvatar}: AvatarModalProps) => {
  console.log(currentAvatar);
  const [avatar, setAvatar] = useState(currentAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChangeClick = () => {
    if(!fileInputRef.current) return;
    fileInputRef.current?.click();
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file && file.type.startsWith("image/")){
      const iconPreview = URL.createObjectURL(file);
      setAvatar(iconPreview);
      setAvatarFile(file);
      // setFormData((prev) => ({...prev, iconFile: file, iconPreview: iconPreview}));
    }
  }

  return (
    <>
      <h2 className="text-lg font-bold">Avatar image</h2>
      <input className="hidden" type="file" ref={fileInputRef} onChange={handleAvatarChange}/>
      <div className="flex items-center flex-col mt-6">
        <div className="flex justify-center items-center w-40 h-40 rounded-full border-2 border-dashed border-gray-white overflow-hidden">
          <img src={avatar ?? redditIcon} alt="" className="w-full h-full object-cover"/>
        </div>
        <div 
          onClick={handleAvatarChangeClick}
          className="w-full flex items-center justify-center border border-dashed h-10 rounded-2xl border-gray-400 mt-5 gap-x-2">
          <p>Select a new image</p>
          <CloudUpload strokeWidth={1} size={16} color="black" className="mt-1" />
        </div>
      </div>
      <button
        onClick={hideModal} 
        className="bg-gray-white w-full py-2.5 rounded-full font-semibold mt-6">Cancel</button>
      <button 
        onClick={() => {
          if(!avatarFile) return;
          updateProfile('avatar', avatarFile);
          hideModal();
        }}
        className="text-white w-full py-2.5 rounded-full font-semibold mt-3 bg-blue-900">Save</button>
    </>
  )
}

export default AvatarModal;