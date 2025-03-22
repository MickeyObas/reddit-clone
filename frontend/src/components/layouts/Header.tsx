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


const Header: React.FC<HeaderProps> = ({isSidebarOpen, setIsSidebarOpen}) => {
  const navigate = useNavigate();
  return (
    <header
    className='z-[60] sticky top-0 flex items-center py-3 ps-6 pe-4.5 border-b border-b-slate-300 bg-white shadow'
    >
      <div className='flex w-full justify-between'>
        <div className='flex items-center'>
          <img
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            src={hamburgerIcon} alt="Menu icon" className='h-5 w-5 cursor-pointer'/>
          <img 
            src={redditIcon}
            alt="Reddit icon" 
            className='h-9 w-9 ms-5'
            onClick={() => navigate('/')}
            />
        </div>
        <div className='flex items-center'>
          {/* <LinkButton 
            href=''
            label='Log In'
            className='text-xs ms-auto'
          /> */}
          <img src={searchIcon} alt="Search icon" className='h-7 w-7 ms-3'/>
          <img 
            src={plusIcon}
            alt="Plus icon" 
            className='h-[18px] w-[18px] ms-5'
            onClick={() => navigate('create-post/')}
            />
          <img src={notificationIcon} alt="Plus icon" className='w-6 ms-5'/>
          {/* <img src={ellipsisIcon} alt="Ellipsis icon" className='h-7 w-7 ms-3'/> */}
          <img src={defaultRedditProfileIcon} alt="" className='w-8 h-8 rounded-full ms-2'/>
        </div>
      </div>
    </header>
  )
}

export default Header;