import { useParams, useLocation, Link, useSearchParams } from "react-router-dom";

import { MessageCircleMore, Ellipsis, ChevronDown, Columns3, Columns2, Shirt, Shield, ScrollIcon } from "lucide-react";
import columnsIcon from '../../assets/icons/columns.png';
import { useState } from "react";
import redditIcon from '../../assets/icons/reddit-outline.png';
import { useAuth } from "../../contexts/AuthContext";
import { Profile } from "../../types/profile";


const UserProfileHeader = ({profile}: {profile: Profile | null}) => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const sortFilter = searchParams.get('sort') || 'new';
  const isOwner = userId == user?.id;
  console.log(isOwner);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (option: string) => {
    setOpenDropdown((prev) => prev === option ? null : option);
  }

  const handleChangeFilter = (newFilter: string) => {
    searchParams.set('sort', newFilter);
    setSearchParams(searchParams);
  }

  return (
    <>
      <div className="bg-gray-white h-20">
        {profile?.banner && (<img src={profile?.banner} alt="" className="object-cover w-full h-full" />)}
      </div>
      <div className="p-4">
        <div className="flex relative justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-center justify-center bg-gray-white w-28 h-[150px] rounded-xl mb-2 absolute -top-11 overflow-hidden ring-1 ring-gray-300">
              {profile?.avatar ? (<img src={profile.avatar} alt="" className="w-full h-full object-cover"/>) : <span className="text-xs">No avatar</span>}
            </div>
            <div className="w-28 h-[105px]"></div>
          </div>
          <div className="flex self-start gap-2">
            {userId !== user?.id.toString() && (
              <button className="bg-blue-800 text-white py-2 px-2.5 rounded-full text-xs font-semibold">Follow</button>
            )}
            <button className="bg-gray-white py-2 px-2.5 rounded-full text-xs font-semibold">
              <MessageCircleMore size={18}/>
            </button>
            <button className="bg-gray-white py-2 px-2.5 rounded-full text-xs font-semibold">
              <Ellipsis size={16}/>
            </button>
          </div>
        </div>
        <h1 className="font-bold text-2xl">{profile?.user.username}</h1>
        <p className="text-xs text-gray-500 mb-3">{"u/" + profile?.user.username}</p>
        {profile?.about_description && (
          <div className="bg-gray-100 rounded-2xl text-gray-500 p-3 leading-5 mt-2.5 mb-4">
          <p>{profile?.about_description}</p>
        </div>
        )}
        <div className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 ${isAboutExpanded ? 
          isOwner
            ? 'h-[565px]' 
            : 'h-[290px]'
          : 'h-14'}`}>
          <div
            className="cursor-pointer"
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
          >
            <div className="bg-gray-100 text-gray-500 px-3 py-4.5 leading-5 flex items-center justify-between">
              <p>About</p>
              <ChevronDown size={16} stroke="black" className={`transition-all duration-200 ${isAboutExpanded ? 'rotate-180' : ''}`}/>
            </div>
          </div>
          <div className="grid grid-cols-1  pt-4.5 px-3 bg-gray-100 rounded-b-2xl">
            <div className="grid grid-cols-2 pb-3 gap-y-5">
              <div className="flex flex-col gap-y-1">
                <h3 className="font-semibold">1</h3>
                <span className="text-xs text-gray-500">Post karma</span>
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="font-semibold">0</h3>
                <span className="text-xs text-gray-500">Comment karma</span>
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="font-semibold">Jan 24, 2024</h3>
                <span className="text-xs text-gray-500">Cake day</span>
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="font-semibold">1</h3>
                <span className="text-xs text-gray-500">Gold earned</span>
              </div>
            </div>
            {/* Only for owner */}
            {isOwner && (
              <>
                <hr className="border-gray-300 my-4"/>
                <p className="uppercase mb-5">Settings</p>
                <div className="grid grid-cols-1 ps-1.5">
                  <div className="flex items-center py-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <img src={redditIcon} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col ms-3">
                      <span className="font-medium">Profile</span>
                      <p className="text-xs text-gray-500">Customize your profile</p> 
                    </div>
                    <Link
                      to={`/settings/profile/`} 
                      className="bg-gray-white font-bold px-2.5 text-xs rounded-full ms-auto py-2">Update</Link>
                  </div>  
                  <div className="flex items-center py-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Shirt strokeWidth={1.5}/>
                    </div>
                    <div className="flex flex-col ms-3">
                      <span className="font-medium">Avatar</span>
                      <p className="text-xs text-gray-500">Customize and style</p> 
                    </div>
                    <button className="bg-gray-white font-bold px-2.5 text-xs rounded-full ms-auto py-2">Style Avatar</button>
                  </div>  
                  <div className="flex items-center py-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Shield strokeWidth={1.5}/>
                    </div>
                    <div className="flex flex-col ms-3">
                      <span className="font-medium">Moderation</span>
                      <p className="text-xs text-gray-500">Moderation tools</p> 
                    </div>
                    <button className="bg-gray-white font-bold px-2.5 text-xs rounded-full ms-auto py-2">Update</button>
                  </div>   
                </div>
              </>
            )}
          {/* End of settings for owner */}
          <hr className="border-gray-300 mb-4"/>
            <p className="uppercase">Trophy case</p>
            <div className="flex items-center py-4">
              <div className="bg-blue-500 rounded-md w-8 h-8 flex justify-center items-center">
                <ScrollIcon fill="white" stroke="black"/>
              </div>
              <p className="ms-3 font-medium">Newbies Club</p> 
            </div> 
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            to={`/user/${userId}/`}
            className={`py-2.5 px-3.5 rounded-full font-semibold ${location.pathname === `/user/${userId}/` ? 'bg-slate-300' : ''}`}>
            Overview</Link>
          <Link
            to={`/user/${userId}/submitted/`}
            className={`py-2.5 px-3.5 rounded-full font-semibold ${location.pathname === `/user/${userId}/submitted/` ? 'bg-slate-300' : ''}`}>
            Posts</Link>
          <Link
            to={`/user/${userId}/comments/`}
            className={`py-2.5 px-3.5 rounded-full font-semibold ${location.pathname === `/user/${userId}/comments/` ? 'bg-slate-300' : ''}`}>
            Comments</Link>
        </div>
      </div>  
      <div className='flex items-center px-2 text-xs'>
        <div
          className="flex flex-col relative cursor-pointer rounded-2xl select-none" 
          onClick={() => toggleDropdown('sort')}>
          <div 
            className='flex items-center gap-x-1 rounded-full px-3 py-2 hover:bg-gray-white'>
            <span>{sortFilter ? sortFilter.charAt(0).toUpperCase() + sortFilter.slice(1) : 'Sort by'}</span>
            <span><ChevronDown size={14}/></span>
          </div>
          <div className={`cursor-pointer absolute bg-white z-50 top-10 flex-col shadow-[0_0_7px_1px_rgba(0,0,0,0.25)] rounded-lg w-20 ${openDropdown === 'sort' ? 'flex' : 'hidden'}`}>
            <span className="px-4 py-4">Sort by</span>
            {['best', 'new', 'hot'].map((opt, idx) => (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeFilter(opt);
                  setOpenDropdown(null)
                }} 
                key={idx} 
                className="px-4 py-4 hover:bg-gray-white"
                >{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
            ))}
          </div>
        </div>
        <div
          className="flex flex-col relative cursor-pointer rounded-2xl select-none"
          onClick={() => toggleDropdown('view')}>
          <div
            className='flex items-center px-3 py-1 hover:bg-gray-white rounded-full'>
            <img src={columnsIcon} className='w-6 h-6' />
            <span><ChevronDown size={14}/></span>
          </div>
          <div className={`cursor-pointer absolute bg-white z-50 top-10 right-0 flex-col shadow-[0_0_7px_1px_rgba(0,0,0,0.25)] rounded-lg w-32 ${openDropdown === 'view' ? 'flex' : 'hidden'}`}>
            <span className="px-4 py-4">View</span>
            <div className="flex items-center hover:bg-gray-white px-4 py-3 gap-x-2">
              <Columns2 strokeWidth={1} transform="rotate(90)"/>
              <span>Card</span>
            </div>
            <div className="flex items-center hover:bg-gray-white px-4 py-3 gap-x-2">
              <Columns3 fill="black" stroke="white" transform="rotate(90)"/>
              <span>Compact</span>
            </div>
          </div>
        </div>
      </div>  
      <hr className="mt-2.5 border-gray-200"/>
    </>
  )
}

export default UserProfileHeader;