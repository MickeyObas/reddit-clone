// Assets
import hamburgerIcon from '../assets/icons/hamburger.png';
import redditIcon from '../assets/icons/reddit.png';
import searchIcon from '../assets/icons/magnifying-glass.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import dotIcon from '../assets/icons/dot.png';
import upvoteIcon from '../assets/icons/upvote.png';
import downVote from '../assets/icons/downvote.png';

// Components
import { LinkButton } from '../components/LinkButton';


const Home: React.FC = () => {
  return (
    <>
      <header
      className='sticky top-0 flex items-center py-3 px-6 border-b border-b-slate-300 bg-white shadow'
      >
        <img src={hamburgerIcon} alt="Menu icon" className='h-5 w-5'/>
        <img src={redditIcon} alt="Reddit icon" className='h-9 w-9 ms-5'/>
        <LinkButton 
          href=''
          label='Log In'
          className='text-xs ms-auto'
        />
        <img src={searchIcon} alt="Search icon" className='h-7 w-7 ms-3'/>
        <img src={ellipsisIcon} alt="Ellipsis icon" className='h-7 w-7 ms-3'/>
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