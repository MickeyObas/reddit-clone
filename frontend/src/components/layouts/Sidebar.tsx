// Assets
import homeIcon from '../../assets/icons/home.png';
import popularIcon from '../../assets/icons/popular.png';
import exploreIcon from '../../assets/icons/explore.png';
import allIcon from '../../assets/icons/chart-up.png';
import chatIcon from '../../assets/icons/chat.png';
import communityIcon from '../../assets/icons/community.png';
import starIcon from '../../assets/icons/star.png';
import redditOutlineIcon from '../../assets/icons/reddit-outline.png';
import advertiseIcon from '../../assets/icons/advertise.png';
import helpIcon from '../../assets/icons/help.png';
import blogIcon from '../../assets/icons/blog.png';
import careersIcon from '../../assets/icons/wrench.png';
import pressIcon from '../../assets/icons/microphone.png';
import rulesIcon from '../../assets/icons/rules.png';
import privacyPolicyIcon from '../../assets/icons/balance.png';
import userAgreementIcon from '../../assets/icons/agreement.png';
import caretDownIcon from '../../assets/icons/caret-down.png';
import plusIcon from '../../assets/icons/plus.png';

import { SetStateAction } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCommunities } from '../../contexts/CommunityContext';


type SidebarProps = {
  isSidebarOpen: boolean,
  setIsSidebarOpen: React.Dispatch<SetStateAction<boolean>>,
  setIsCommunityModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  setIsCommunityModalOpen
}) => {

  const { communities } = useCommunities();
  const location = useLocation();

  return (
    <div
    className={`border-t-0 z-30 overflow-y-scroll fixed top-[60px] left-0 h-[calc(100vh-61px)] w-[69%] bg-white shadow-lg transform ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 ease-in-out`}
    >
    {/* Sidebar Content */}
    <nav className="mt-2 px-6 flex flex-col pb-3">
      <ul className="space-y-0 border-b border-b-gray-200 py-3">
        <li className={`flex items-center px-4 py-0.5 hover:bg-gray-200 ${location.pathname === "/" ? "bg-gray-200" : ""}`}>
          <img className="w-5 h-5" src={homeIcon} alt="Home Icon" />
          <a href="/" className="ms-2.5 block p-2">Home</a>
        </li>
        <li className='flex items-center px-4 py-0.5 hover:bg-gray-200'>
          <img className="w-5 h-5" src={popularIcon} alt="Home Icon" />
          <a href="#" className="ms-2.5 block p-2">Popular</a>
        </li>
        <li className='flex items-center px-4 py-0.5 hover:bg-gray-200'>
          <img className="w-5 h-5" src={exploreIcon} alt="Home Icon" />
          <a href="#" className="ms-2.5 block p-2">Explore</a>
        </li>
        <li className='flex items-center px-4 py-0.5 hover:bg-gray-200'>
          <img className="w-5 h-5" src={allIcon} alt="Home Icon" />
          <a href="#" className="ms-2.5 block p-2">All</a>
        </li>
        <li className='flex items-center px-4 py-0.5 hover:bg-gray-200'>
          <img className="w-5 h-5" src={chatIcon} alt="Home Icon" />
          <a href="#" className="ms-2.5 block p-2">Chat</a>
        </li>
      </ul>
      <ul className="space-y-0 border-b border-b-gray-200 py-3">
        <div className='flex items-center justify-between px-2 py-2'>
          <h1 className='uppercase text-[12px] tracking-wider'>Custom Feeds</h1>
          <img src={caretDownIcon} alt="" className='w-6 h-6'/>
        </div>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex justify-center items-center'>
            <img src={plusIcon} alt="" className='w-5 h-5'/>
          </div>
          <span className='ms-2.5'>Create a custom feed</span>
        </li>
      </ul>
      <ul className="space-y-0 border-b border-b-gray-200 py-3">
        <div className='flex items-center justify-between px-2 py-2'>
          <h1 className='uppercase text-[12px] tracking-wider'>Communities</h1>
          <img src={caretDownIcon} alt="" className='w-6 h-6'/>
        </div>
        <li 
          onClick={() => setIsCommunityModalOpen(true)}
          className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex justify-center items-center'>
            <img src={plusIcon} alt="" className='w-5 h-5'/>
          </div>
          <span className='ms-2.5'>Create a community</span>
        </li>
        {communities && communities.map((community, idx) => (
          <Link key={idx} to={`community/${community.id}/`} onClick={() => setIsSidebarOpen(false)}>
            <li className='flex px-2 py-1 items-center justify-between'> 
              <div className='w-8 h-8 rounded-full overflow-hidden'>
                <img src={community.avatar ?? communityIcon} alt="" className='w-full h-full object-cover'/>
              </div>
              <span className='w-[65%] ms-3.5'>r/{community.name}</span>
              <div className='w-[15%] flex justify-center items-center'>
                <img src={starIcon} alt="" className='w-4 h-4'/>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <ul className="space-y-0 border-b border-b-gray-200 py-3">
        <div className='flex items-center justify-between px-2 py-2'>
          <h1 className='uppercase text-[12px] tracking-wider'>Resources</h1>
          <img src={caretDownIcon} alt="" className='w-6 h-6'/>
        </div>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={redditOutlineIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>About Reddit</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={advertiseIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Advertise</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={helpIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Help</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={blogIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Blog</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={careersIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Careers</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={pressIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Press</span>
        </li>
      </ul>
      <ul className="space-y-0  py-3">
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={rulesIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Reddit Rules</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={privacyPolicyIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>Privacy Policy</span>
        </li>
        <li className='flex px-2 py-1 items-center'> 
          <div className='w-8 h-8 flex items-center justify-center'>
            <img src={userAgreementIcon} alt="" className='w-6 h-6'/>
          </div>
          <span className='ms-3.5'>User Agreement</span>
        </li>
      </ul>
      <span className='text-[10px] text-center mt-6'>Reddit, Inc. &copy;2025. All rights reserved.</span>
    </nav>
  </div>
  )
}

export default Sidebar;