// Assets
import ellipsisIcon from '../assets/icons/ellipsis.png';
import dotIcon from '../assets/icons/dot.png';
import columnsIcon from '../assets/icons/columns.png';
import redditIcon from '../assets/icons/reddit.png';
import { ChevronDown, Columns2, Columns3 } from 'lucide-react';

import { useEffect, useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';

import { Post } from '../types/post';
import { useAuth } from '../contexts/AuthContext';


type hoverState = {
  id: number,
  hovered: string
}

type PostVotes = {
  [id: number]: {
    count: number,
    userVote: string | null
  }
}

const Home: React.FC = () => {

  const location = useLocation();
  console.log(location.pathname);
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);
  const [votes, setVotes] = useState<PostVotes>({})
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortFilter = searchParams.get('sort') || 'new';

  const toggleDropdown = (option: string) => {
    setOpenDropdown((prev) => prev === option ? null : option);
  }

  const handleChangeFilter = (newFilter: string) => {
    searchParams.set('sort', newFilter);
    setSearchParams(searchParams);
  }

  console.log(posts);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/posts/feed/?sort=${sortFilter}`, {
          method: 'GET'
        });
        if(response?.ok && isMounted){
          const data = await response.json();
          setPosts(data);
          setVotes(
            data.reduce((acc: PostVotes, post: Post) => {
              acc[post.id] = {count: post.vote_count, userVote: post.user_vote};
              return acc;
            }, {})
          );
        }else{
          console.log("Whoops, bad response.");
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsLoading(false);
      }
    };
    fetchPosts();

    return () => isMounted = false;
  }, [sortFilter])

  // Handlers
  const handleVote = (postId: number, type: string) => {
    
    const postVote = async () => {
      const dir = type === 'upvote' ? 1 : -1; 

      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${postId}&dir=${dir}&obj=p`, {
        method: 'POST'
      });
      if(!response?.ok){
        console.log("Whoops, something went wrong during voting.");
      }else{
        setVotes((prevVotes) => {
          const { count, userVote: prevVote } = prevVotes[postId];
    
          let newCount = count;
          let newVote: string | null = type;
    
          if(type === 'upvote'){
            if(prevVote === 'upvote'){
              newCount -= 1;
              newVote = null;
            }else if(prevVote === 'downvote'){
              newCount += 2;
            }else{
              newCount += 1;
            }
          }else if(type === 'downvote'){
            if(prevVote === 'downvote'){
              newCount += 1;
              newVote = null;
            }else if(prevVote === 'upvote'){
              newCount -= 2;
            }else{
              newCount -= 1;
            }
          }

          return {...prevVotes, [postId]: {count: newCount, userVote: newVote}}
        })
      }
    };
    postVote();
  }

  const handleJoinCommunity = (communityId: number) => {
    const joinCommunity = async () => {
      try {
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/join/`, {
          method: 'POST'
        });
        if(!response?.ok){
          console.error("Whoops, bad response.");
        }else{
          const data = await response?.json();
          console.log(data);
        }
      }catch(err){
        console.error(err);
      }
    };
    joinCommunity();
  }

  if(isLoading || posts.length === 0) {
    return (
      <main className="p-4">
        <p className="text-center text-slate-500">Loading feed...</p>
      </main>
    );
  }

  if(!isLoading &&posts.length > 0){
    return (
      <>
        {/* <header className='flex text-[13px] px-5 py-3 border-b border-b-slate-200'>
          <div className='flex items-center'>
            <span>Best</span>
            <img src={caretDownIcon} className='w-4 h-4 ms-0.5' />
          </div>
          <div className='flex items-center ms-4'>
            <img src={columnsIcon} className='w-6 h-6 ms-0.5' />
            <img src={caretDownIcon} className='w-4 h-4' />
          </div>
        </header> */}

        <header className='border-b border-b-slate-200 py-2'>
          <div className='flex items-center px-2 text-xs'>
            <div
              className="flex flex-col relative cursor-pointer rounded-2xl select-none" 
              onClick={() => toggleDropdown('sort')}>
              <div 
                className={`flex items-center gap-x-1 rounded-full px-3 py-2 hover:bg-gray-white`}>
                <span>{sortFilter !== "none" ? sortFilter.charAt(0).toUpperCase() + sortFilter.slice(1) : 'Sort by'}</span>
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
                    className={`px-4 py-4 hover:bg-gray-white ${!sortFilter || searchParams.get('sort') === opt && 'bg-gray-white'}`}
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
        </header>
        
    
        <main className="homepage grid grid-cols-1">
          {posts && posts.map((post) => (
            <article key={post?.id} className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
              {/* sfldfh */}
              <div className="cursor-pointer" onClick={() => navigate(`post/${post.id}/`)}>
                <div className='flex'>
                  <div className='left-of-panel flex text-xs items-center'>
                    <div className='w-4 h-4 rounded-full overflow-hidden'>
                      <img src={post.community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/community/${post.community.id}/`)
                      }}
                      className='ms-2 font-medium cursor-pointer hover:underline'
                      >{formatCommunity(post?.community.name)}</span>
                    <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
                    <span>{timeAgo(post?.created_at)}</span>
                  </div>
                  {!post.is_member && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinCommunity(post.community.id);
                      }}
                      className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center cursor-pointer'
                  >Join</button>
                  )}
                </div>
                <div className='flex justify-between py-1.5 min-h-16'>
                  <div className='w-[75%] font-semibold text-slate-800'>{post.title}</div>
                  {post.thumbnail && (
                      <div className='w-20 h-16 rounded-xl overflow-hidden'>
                      <img 
                        src={getImage(post.thumbnail)} 
                        alt="" 
                        className='w-full h-full object-cover border-0 outline-0'
                        />
                    </div>
                  )}
                </div>
              </div>
              {/* sfldfh */}
              <div className='flex justify-between text-xs items-center select-none'>
                <div className={`items-center rounded-full flex justify-between text-black mt-1 overflow-hidden
                ${votes[post.id].userVote === 'upvote' ? 'bg-deep-red text-white' :
                  votes[post.id].userVote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
                  `}>
                  <div className={`rounded-full h-full py-2 px-2 cursor-pointer ${!votes[post.id].userVote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                    <UpArrow
                      height="16px"
                      width="16px"
                      color={`${votes[post.id].userVote === 'upvote' ? 'white' : ''}`}
                      onClick={() => handleVote(post.id, "upvote")}
                      onMouseEnter={() => setIsHovered({
                        id: post.id,
                        hovered: "up"
                      })}
                      onMouseLeave={() => setIsHovered(null)}
                      outlineColor={
                        (isHovered?.hovered === "up" && isHovered.id == post.id) 
                          ? 'red' 
                          : `${votes[post.id].userVote === null ? 'black' : 'white'}`
                        }
                      />
                  </div>
                  <span className='flex justify-center min-w-3'>{votes[post.id].count}</span>
                  <div className={`rounded-full h-full py-2 px-2 cursor-pointer  ${!votes[post.id].userVote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                    <DownArrow
                      height={"16px"}
                      width={"16px"}
                      color={`${votes[post.id].userVote === 'downvote' ? 'white' : ''}`}
                      onClick={() => handleVote(post.id, "downvote")}
                      onMouseEnter={() => setIsHovered({
                        id: post.id,
                        hovered: "down"
                      })}
                      onMouseLeave={() => setIsHovered(null)}
                      outlineColor={
                        (isHovered?.hovered === "down" && isHovered.id == post.id) 
                          ? 'blue' 
                          : `${votes[post.id].userVote === null ? 'black' : 'white'}`
                        }
                    />
                  </div>
                </div>
                <div>{post.comment_count} comments</div>
                <div>Share</div>
                <div>Report</div>
                <img src={ellipsisIcon} className='w-6 h-6'/>
              </div>
            </article>
          ))}
        </main>
      </>
    )
  }
}

export default Home