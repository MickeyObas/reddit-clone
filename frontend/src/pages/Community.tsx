// Assets
import dotIcon from '../assets/icons/dot.png';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import redditIcon from '../assets/icons/reddit-outline.png';

import { CakeSlice, ChevronDown, Globe, Mail, NotepadTextIcon, Pin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { fetchWithAuth, formatCommunity, formatDate, formatUsername, getCommentCountLabel, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { Post, PostDisplay} from '../types/post';
import { useAuth } from '../contexts/AuthContext';
import { CommunityHeader, RuleItem } from './AboutCommunity';
import type { Community } from '../types/community';
import toast from 'react-hot-toast';
import Sidebar from '../components/layouts/Sidebar';
import defaultRedditProfileIcon from '../assets/icons/reddit-profile.png';


type PostVotes = {
  [id: number]: {
    count: number,
    userVote: string | null
  }
}

type hoverState = {
  id: number,
  hovered: string
}

type LayoutContextType = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommunityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


const Community = ({sort='latest'}) => {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const {setIsSidebarOpen, setIsCommunityModalOpen} = useOutletContext<LayoutContextType>();
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);
  const [votes, setVotes] = useState<PostVotes>({})
  const { communityId } = useParams();
  const navigate = useNavigate();
  const formattedDate = useMemo(() => {
      const dateStr = community?.created_at;
      if(!dateStr) return "N/A";
      return formatDate(dateStr);
    }, [community?.created_at])

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/posts/?sort=${sort}`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoopps, something went wrong.");
        else{
          const data = await response?.json();
          setPosts(data.posts);
          setVotes(
            data.posts.reduce((acc: PostVotes, post: Post) => {
              acc[post.id] = {count: post.vote_count, userVote: post.user_vote};
              return acc;
            }, {})
          )}
      }catch(err){
        console.error(err);
      };
    };

    fetchPosts();
    
  }, [sort, communityId])

  const processedPosts = useMemo(() => {
    return posts.map(post => ({
      ...post,
      timeAgoText: timeAgo(post.created_at)
    }))
  }, [posts])

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/posts/?sort=${sort}`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoopps, something went wrong.");
        else{
          const data = await response?.json();
          setPosts(data.posts);
          setCommunity(data.community);
          setVotes(
            data.posts.reduce((acc: PostVotes, post: Post) => {
              acc[post.id] = {count: post.vote_count, userVote: post.user_vote};
              return acc;
            }, {})
          )}
      }catch(err){
        console.error(err);
      };
    };
    fetchCommunityPosts();
  }, [sort, communityId])

    // Handlers
    const handleVote = (postId: number, type: string) => {
      
      // TODO: Change this. Much cleaner/proper way to do this per component (Post)
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

  if(!community) return <h1></h1>

  return (
    <div className='pb-5 grid grid-cols-1 xl:grid-cols-[280px_1fr]'>
      <div className='hidden xl:block'>
        <Sidebar 
          isSidebarOpen={true}
          setIsCommunityModalOpen={setIsCommunityModalOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className='grid grid-cols-1'>
        <div>
          <div
            className="bg-gray-white h-16 md:h-18 lg:h-20 w-full overflow-hidden">
            {community?.banner && (<img src={community?.banner} alt="" className="object-cover w-full h-full" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
            <div>
              <CommunityHeader community={community} />
            <div className='flex mt-5 items-center justify-between px-4.5'>
              <div className='flex items-center gap-x-2'>
                <Pin size={18} transform='rotate(45)' color='gray'/>
                <span className='text-[13px]'>Community highlights</span>
              </div>
              <span><ChevronDown size={14}/></span>
            </div>
            <hr className='border-none h-[1px] bg-slate-300 opacity-50 mt-3'/>
            {/* Feed */}
            <div className='grid grid-cols-1'>
              {processedPosts && processedPosts.length > 0 ? processedPosts.map((post) => (
                <div className='flex border-b border-b-slate-200 hover:bg-gray-50'>
                  <div className='hidden md:flex bg-gray-100 border border-gray-200 w-32 h-20 rounded-lg mt-3 ms-6 overflow-hidden items-center justify-center'>
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" className='w-full h-full object-cover '/>
                    ): (
                      <><NotepadTextIcon color='gray'/></>
                    )}
                  </div>
                  <article key={post?.id} className="feed grid grid-cols-1 px-5 py-3 w-full hover:bg-gray-50">
                  {/* sfldfh */}
                    <div className="cursor-pointer" onClick={() => navigate(`/post/${post.id}/`)}>
                      <div className='flex'>
                        <div className='left-of-panel flex text-xs items-center'>
                          <div className='w-4 h-4 rounded-full overflow-hidden'>
                            <img src={community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
                          </div>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/community/${community.id}/`)
                            }}
                            className='ms-2 font-medium cursor-pointer hover:underline'
                            >{formatCommunity(community.name)}</span>
                            {!post.is_member && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinCommunity(community.id);
                                navigate(`/community/${community.id}/`);
                                toast.success(`Welcome, you have joined ${"r/" + post.community.name}!`, {
                                  position: 'top-right',
                                  duration: 10000
                                })
                              }}
                              className='hidden md:block ms-2 bg-blue-900 text-white px-3 py-1 rounded-full self-center cursor-pointer'
                          >Join</button>
                          )}
                          <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
                          <span>{timeAgo(post?.created_at)}</span>
                        </div>
                        {!post.is_member && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinCommunity(community.id);
                              navigate(`/community/${community.id}/`);
                              toast.success(`Welcome, you have joined ${"r/" + community.name}!`, {
                                  position: 'top-right',
                                  duration: 10000
                                })
                              }}
                            className='md:hidden ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center cursor-pointer'
                        >Join</button>
                        )}
                      </div>
                      <div className='flex justify-between py-2.5 md:py-1.5'>
                        <div className={`${post.thumbnail && 'w-[72%] md:w-full'}`}>
                          <p className='font-semibold text-slate-800 lg:text-[1rem] line-clamp-2'>{post.title}</p>
                        </div>
                        {post.thumbnail && (
                          <div className='w-20 lg:w-24 h-16 lg:h-20 rounded-xl overflow-hidden md:hidden'>
                          <img 
                            src={post.thumbnail} 
                            alt="" 
                            className='w-full h-full object-cover border-0 outline-0'
                            />
                        </div>
                        )}
                      </div>
                    </div>
                  {/* sfldfh */}
                    <div className='flex text-xs items-center select-none gap-x-3 justify-between'>
                      <div 
                        className={`min-w-[76px] items-center rounded-full flex justify-between text-black mt-1 overflow-hidden
                        ${votes[post.id].userVote === 'upvote' ? 'bg-deep-red text-white' :
                          votes[post.id].userVote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
                        `}>
                        <div 
                          className={`rounded-full h-full py-2 px-2 cursor-pointer ${!votes[post.id].userVote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
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
                      <div className='flex items-center w-full gap-x-4 [@media(min-width:600px)]:justify-normal px-1 [@media(min-width:600px)]:gap-x-5'>
                        <div>{post.comment_count} {getCommentCountLabel(post.comment_count)}</div>
                        <div>Share</div>
                        <div>Report</div>
                        <div className='hidden [@media(min-width:400px)]:block'>Save</div>
                        <div className='hidden [@media(min-width:500px)]:block'>Award</div>
                        <div className='hidden [@media(min-width:600px)]:block'>Hide</div>
                        <img src={ellipsisIcon} className='w-6 h-6 [@media(min-width:600px)]:hidden'/>
                      </div>
                    </div>
                  </article>
                </div>
              )) : (
                <h1 className='px-4 py-3'>There are no posts in this community, yet. Why not be the first poster? XD</h1>
              )}
            </div>
            </div>
            <div className='hidden lg:flex flex-col w-full py-3 px-3'>
            {community && (
              <div className='flex flex-col bg-gray-100 rounded-2xl'>
                <div className='py-4 px-2.5 border-b border-b-slate-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h2
                      onClick={() => navigate(`/community/${community.id}/`)} 
                      className='hover:text-blue-900 cursor-pointer text-lg font-bold'>{community.name && formatCommunity(community.name)}</h2>
                  </div>
                  <p className='font-bold text-slate-600 my-1'>Welcome!</p>
                  <p>{community.description}</p>
                  <div className='flex gap-x-1 items-center mt-1.5'>
                    <CakeSlice transform='scale(-1,1)' size={22} strokeWidth={1} />
                    <span className='text-xs'>Created {formattedDate}</span>
                  </div>
                  <div className='flex gap-x-1 items-center mt-1.5'>
                    <Globe size={18} color='gray'/>
                    <span className='text-gray-500 text-xs'>Public</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col mt-2.5'>
                      <span className='font-bold text-black'>{community.member_count}</span>
                      <span className='text-xs'>Members</span>
                    </div>
                    <div className='flex flex-col mt-2.5'>
                      <div className='font-bold text-black'>6</div>
                      <div className='flex items-center'>
                        <div className='bg-green-600 w-2 h-2 rounded-full me-1'></div>
                        <span className='text-xs'>Online</span>
                      </div>
                    </div>
                    <div className='flex flex-col mt-2.5'>
                      <span className='font-bold text-black'>Top 1%</span>
                      <span className='text-xs'>Rank by size</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='px-3 py-6 border-b border-b-slate-300'>
                    <h3 className='uppercase font-semibold mb-3'>User Flair</h3>
                    <div className='flex items-center gap-x-2.5'>
                      <div className='rounded-full overflow-hidden w-8 h-8'>
                        <img src={defaultRedditProfileIcon} alt="" />
                      </div>
                      <h3>{user?.username}</h3>
                    </div>            
                  </div>
                </div>
                {community.rules.length > 0 && (
                  <div className='flex flex-col'>
                    <div className='px-3 py-6 border-b border-b-slate-300'>
                      <h3 className='uppercase font-semibold mb-3'>Rules</h3>
                      {community && community?.rules?.length > 0 ? (
                      <ol className='list-decimal px-7 flex flex-col'>
                        {community?.rules.map((rule, idx) => (
                          <RuleItem key={idx} rule={rule} idx={idx}/>
                        ))}
                      </ol>                
                      ) : (
                        <h1>No specific rules set. The community expects members to follow general Reddit guidelines.</h1>
                      )}
                    </div>
                  </div>
                )}
              <div className='flex flex-col'>
                <div className='px-3 py-6'>
                  <h3 className='uppercase font-semibold mb-3'>Moderators</h3>
                  {community?.moderators && community?.moderators?.length > 0 ? (
                    <div className='flex flex-col gap-y-2.5'>
                      {community?.moderators && community?.moderators.map((moderator, idx) => (
                        <div key={idx} className='flex items-center gap-x-2'>
                          <div className='h-8 w-8'>
                            <img src={redditIcon} alt="" />
                          </div>
                          <div className='flex flex-col'>
                            <div className='flex gap-x-2'>
                              <h2>{formatUsername(moderator.username)}</h2>
                              <div className='bg-black text-white rounded-full px-1.5 '>
                                CREATOR
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <h1 className='text-center'>No moderators.</h1>
                  )}
                </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>       
    </div>
  )
};

export default Community;