// Assets
import hamburgerIcon from '../../assets/icons/hamburger.png';
import redditIcon from '../../assets/icons/reddit.png';
import searchIcon from '../../assets/icons/magnifying-glass.png';
import plusIcon from '../../assets/icons/plus.png';
import notificationIcon from '../../assets/icons/bell.png';
import defaultRedditProfileIcon from '../../assets/icons/reddit-profile.png';

interface HeaderProps {
  isSidebarOpen: boolean,
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react';


const Header: React.FC<HeaderProps> = ({isSidebarOpen, setIsSidebarOpen}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <header
    className='z-40 sticky top-0 flex items-center py-3 ps-6 pe-4.5 border-b border-b-slate-300 bg-white shadow'
    >
      <div className='flex w-full justify-between'>
        <div className='flex items-center'>
          <img
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            src={hamburgerIcon} alt="Menu icon" className='h-5 w-5 cursor-pointer xl:hidden'/>
          <img 
            src={redditIcon}
            alt="Reddit icon" 
            className='h-9 w-9 ms-5 xl:ms-0 cursor-pointer'
            onClick={() => navigate('/')}
            />
        </div>
        <div className='hidden lg:flex items-center bg-gray-white rounded-full px-4 w-[560px] hover:bg-gray-300 cursor-pointer'>
          <div className=''>
            <Search size={16}/>
          </div>
          <input 
            className='border-0 outline-0 ms-3 w-full'
            placeholder='Search Reddit'
          />
        </div>
        <div 
          className='flex items-center'>
          <img src={searchIcon} alt="Search icon" className='h-7 w-7 ms-3 cursor-pointer'/>
          <div 
            onClick={() => navigate('create-post/')}
            className='flex items-center justify-center gap-x-2 cursor-pointer'>
            <img 
            src={plusIcon}
            alt="Plus icon" 
            className='h-[18px] w-[18px] ms-5'
            />
            <span className='hidden lg:block'>Create</span>
          </div>
          
          <img src={notificationIcon} alt="Plus icon" className='w-6 ms-5 cursor-pointer'/>
          <div className='w-8 h-8 rounded-full ms-2 overflow-hidden cursor-pointer'>
            {/* Ignore this, temp patch  */}
            <img onClick={() => navigate(`/user/${user?.id}/`)} src={user?.avatar ? user.avatar : defaultRedditProfileIcon} alt="" className='w-full h-full object-cover'/>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;