import { useParams, useLocation, Link, useNavigate, useSearchParams } from "react-router-dom";

import { MessageCircleMore, Ellipsis, ChevronDown, Columns3, Columns2 } from "lucide-react";
import columnsIcon from '../../assets/icons/columns.png';
import { useState } from "react";


const UserProfileHeader = ({profile}) => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const sortFilter = searchParams.get('sort');

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
      <div className="bg-green-300 h-20">
        {profile?.banner && (<img src={profile?.banner} alt="" className="object-cover w-full h-full" />)}
      </div>
      <div className="p-4">
        <div className="flex relative mb-3">
          <div className="flex flex-col">
            <div className="flex bg-red-400 w-28 h-[150px] rounded-xl mb-2 absolute -top-11 overflow-hidden ring-1 ring-gray-300">
              {profile?.avatar && (<img src={profile.avatar} alt="" className="w-full h-full object-cover"/>)}
            </div>
            <div className="w-25 h-[105px] mb-2"></div>
            <h1 className="font-bold text-2xl">{profile?.user.username}</h1>
            <p className="text-xs text-gray-500">{"u/" + profile?.user.username}</p>
          </div>
          <div className="flex self-start gap-2 ms-auto">
            <button className="bg-blue-800 text-white py-2 px-2.5 rounded-full text-xs font-semibold">Follow</button>
            <button className="bg-gray-white py-2 px-2.5 rounded-full text-xs font-semibold">
              <MessageCircleMore size={18}/>
            </button>
            <button className="bg-gray-white py-2 px-2.5 rounded-full text-xs font-semibold">
              <Ellipsis size={16}/>
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl text-gray-500 p-3 leading-5 mb-4">
          <p>Who lives in a pineapple under the sea? Exactly. So never give up.</p>
        </div>
        <div className="bg-gray-100 rounded-2xl text-gray-500 p-3 leading-5 mb-4 flex items-center justify-between">
          <p>About</p>
          <ChevronDown size={16} stroke="black"/>
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
            {['best', 'latest', 'hot'].map((opt, idx) => (
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