// Assets
import hamburgerIcon from '../assets/icons/hamburger.png';
import redditIcon from '../assets/icons/reddit.png';
import searchIcon from '../assets/icons/magnifying-glass.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import dotIcon from '../assets/icons/dot.png';
import upvoteIcon from '../assets/icons/upvote.png';
import downVote from '../assets/icons/downvote.png';
import caretDownIcon from '../assets/icons/caret-down.png';
import columnsIcon from '../assets/icons/columns.png';
import plusIcon from '../assets/icons/plus.png';
import notificationIcon from '../assets/icons/bell.png';
import defaultRedditProfileIcon from '../assets/icons/reddit-profile.png';
import homeIcon from '../assets/icons/home.png';
import popularIcon from '../assets/icons/popular.png';
import exploreIcon from '../assets/icons/explore.png';
import allIcon from '../assets/icons/chart-up.png';
import chatIcon from '../assets/icons/chat.png';
import starIcon from '../assets/icons/star.png';
import redditOutlineIcon from '../assets/icons/reddit-outline.png';
import advertiseIcon from '../assets/icons/advertise.png';
import helpIcon from '../assets/icons/help.png';
import blogIcon from '../assets/icons/blog.png';
import careersIcon from '../assets/icons/wrench.png';
import pressIcon from '../assets/icons/microphone.png';
import rulesIcon from '../assets/icons/rules.png';
import privacyPolicyIcon from '../assets/icons/balance.png';
import userAgreementIcon from '../assets/icons/agreement.png';

// Components
import { LinkButton } from '../components/LinkButton';
import { useEffect, useState } from 'react';


const Home: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      <header
      className='z-[60] sticky top-0 flex items-center py-3 ps-6 pe-4.5 border-b border-b-slate-300 bg-white shadow'
      >
        <div className='flex w-full justify-between'>
          <div className='flex items-center'>
            <img
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              src={hamburgerIcon} alt="Menu icon" className='h-5 w-5'/>
            <img src={redditIcon} alt="Reddit icon" className='h-9 w-9 ms-5'/>
          </div>
          <div className='flex items-center'>
            {/* <LinkButton 
              href=''
              label='Log In'
              className='text-xs ms-auto'
            /> */}
            <img src={searchIcon} alt="Search icon" className='h-7 w-7 ms-3'/>
            <img src={plusIcon} alt="Plus icon" className='h-[18px] w-[18px] ms-5'/>
            <img src={notificationIcon} alt="Plus icon" className='w-6 ms-5'/>
            {/* <img src={ellipsisIcon} alt="Ellipsis icon" className='h-7 w-7 ms-3'/> */}
            <img src={defaultRedditProfileIcon} alt="" className='w-8 h-8 rounded-full ms-2'/>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`border-t-0 z-50 overflow-y-scroll fixed top-[60px] left-0 h-[calc(100vh-61px)] w-[69%] bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Content */}
        <nav className="mt-2 px-6 flex flex-col pb-3">
          <ul className="space-y-0 border-b border-b-gray-200 py-3">
            <li className='flex items-center px-4 py-0.5 bg-gray-200'>
              <img className="w-5 h-5" src={homeIcon} alt="Home Icon" />
              <a href="#" className="ms-2.5 block p-2 hover:bg-gray-800">Home</a>
            </li>
            <li className='flex items-center px-4 py-0.5 '>
              <img className="w-5 h-5" src={popularIcon} alt="Home Icon" />
              <a href="#" className="ms-2.5 block p-2 hover:bg-gray-800">Popular</a>
            </li>
            <li className='flex items-center px-4 py-0.5 '>
              <img className="w-5 h-5" src={exploreIcon} alt="Home Icon" />
              <a href="#" className="ms-2.5 block p-2 hover:bg-gray-800">Explore</a>
            </li>
            <li className='flex items-center px-4 py-0.5 '>
              <img className="w-5 h-5" src={allIcon} alt="Home Icon" />
              <a href="#" className="ms-2.5 block p-2 hover:bg-gray-800">All</a>
            </li>
            <li className='flex items-center px-4 py-0.5 '>
              <img className="w-5 h-5" src={chatIcon} alt="Home Icon" />
              <a href="#" className="ms-2.5 block p-2 hover:bg-gray-800">Chat</a>
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
            <li className='flex px-2 py-1 items-center'> 
              <div className='w-8 h-8 flex justify-center items-center'>
                <img src={plusIcon} alt="" className='w-5 h-5'/>
              </div>
              <span className='ms-2.5'>Create a community</span>
            </li>
            {Array(20).fill('').map((_, idx) => (
              <li key={idx} className='flex px-2 py-1 items-center justify-between'> 
                <div className='w-8 h-8'>
                  <img src={redditIcon} alt="" className='w-full h-full'/>
                </div>
                <span className='w-[65%] ms-3.5'>r/Skypeia</span>
                <div className='w-[15%] flex justify-center items-center'>
                  <img src={starIcon} alt="" className='w-4 h-4'/>
                </div>
              </li>
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

      <header className='flex text-[13px] px-5 py-3 border-b border-b-slate-200'>
        <div className='flex items-center'>
          <span>Best</span>
          <img src={caretDownIcon} className='w-4 h-4 ms-0.5' />
        </div>
        <div className='flex items-center ms-4'>
          <img src={columnsIcon} className='w-6 h-6 ms-0.5' />
          <img src={caretDownIcon} className='w-4 h-4' />
        </div>
      </header>
      <main className="homepage grid grid-cols-1">
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center pe-1.5'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
        <article className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-4 h-4 rounded-full bg-green-700'></div>
              <span className='ms-2 font-medium'>r/siuuuuu</span>
              <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
              <span>1h ago</span>
            </div>
            <a 
              className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
            >Join</a>
          </div>
          <div className='flex justify-between py-1.5'>
            <div className='w-[75%] font-semibold text-slate-800'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi sequi dolorem sunt quaerat in at!</div>
            <div className='bg-blue-300 w-20 h-16 rounded-xl'></div>
          </div>
          <div className='flex justify-between text-xs items-center'>
            <div className='bg-slate-200 px-2 py-1.5 items-center rounded-full flex text-black mt-1'>
              <img src={upvoteIcon} alt="" className='w-5 h-5' />
              <span className='mx-2'>99K</span>
              <img src={downVote} alt="" className='w-5 h-5'/>
            </div>
            <div>4.9k comments</div>
            <div>Share</div>
            <div>Report</div>
            <img src={ellipsisIcon} className='w-6 h-6'/>
          </div>
        </article>
      </main>
    </>
  )
}

export default Home