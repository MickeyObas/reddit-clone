import redditIcon from '../assets/icons/reddit.png';
import columnsIcon from '../assets/icons/columns.png';
import dotIcon from '../assets/icons/dot.png';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import { CakeIcon, CakeSlice, ChevronDown, ChevronUp, Ellipsis, Globe, Mail, Pin, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { fetchWithAuth, formatCommunity, formatDate, formatUsername, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { PostDisplay} from '../types/post';
import { useAuth } from '../contexts/AuthContext';
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

const RuleItem = ({rule, idx}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li
      onClick={() => setIsExpanded(!isExpanded)} 
      className='flex flex-col cursor-pointer py-3'>
      <div className='flex justify-between'>
        <div className='flex gap-x-4'>
          <span>{idx+1}</span>
          <span>{rule.title}</span>
        </div>
        {isExpanded ? (
          <span><ChevronUp size={18} /></span>
        ) : (
          <span><ChevronDown size={18} /></span>
        )}
      </div>
      <div className={`ms-4 mt-2 overflow-hidden transition-max-height duration-200 ease-in-out ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>{rule.description}</div>
    </li> 
  )

}

const Community = () => {
  const { user } = useAuth();
  const [community, setCommunity] = useState();
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);
  const [votes, setVotes] = useState<PostVotes>({})
  const { communityId } = useParams();
  const [isMember, setIsMember] = useState(false);
  const location = useLocation();

  const formattedDate = useMemo(() => {
    const dateStr = community?.created_at;
    if(!dateStr) return "N/A";
    return formatDate(dateStr);
  }, [community?.created_at])


  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/posts/`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoopps, something went wrong.");
        else{
          const data = await response?.json();
          console.log(data);
          setPosts(data.posts);
          setCommunity(data.community);
          setIsMember(data.community.is_member)
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
  }, [communityId])

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
          const data = await response?.json();
          console.log(data);
  
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
            console.log(newCount);
            console.log(votes)
            return {...prevVotes, [postId]: {count: newCount, userVote: newVote}}
          })
        }
      };
      postVote();
    }

    const handleJoin = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/join/`, {
          method: 'POST'
        });
        if(!response?.ok){
          console.error("Whoops, something went wrong.");
        }else{
          const data = await response.json();
          console.log(data);
          setIsMember(true);
        }
      }catch(err){
        console.error(err);
      }
    };

  if(!community) return <h1></h1>

  return (
    <div className='pb-5'>
      {/* Community Header */}
      <div
        className="bg-gray-white p-5"
      >Banner</div>
      <div className="grid grid-cols-1">
        <div className="flex gap-x-6 mx-4.5 py-5">
          <div className='h-8 w-8'>
            <img src={redditIcon} alt="" />
          </div>
          <div className='flex flex-col'>
            <h3 className='font-bold text-[16px]'>{community.name}</h3>
            <div className='flex text-xs text-slate-500 items-center gap-x-1.5'>
              <span>146k members</span>
              <div className='flex items-center gap-x-1.5'>
                <span className='bg-green-500 w-2 h-2 rounded-full'></span>
                <span>20 online</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex gap-x-2 items-center mt-1 mx-4.5'>
          <button className='flex items-center text-xs py-1 border ps-1.5 pe-2.5 gap-x-1 rounded-full'>
            <span><PlusIcon size={20}/></span>
            <span>Create Post</span>
          </button>
          {isMember ? (
            <button className='flex items-center justify-center text-xs py-2 border px-3  rounded-full cursor-pointer'>
            <span>Joined</span>
          </button>
          ): (
            <button 
              onClick={handleJoin}
              className='flex items-center justify-center text-xs py-2 border px-3  rounded-full bg-blue-700 text-white cursor-pointer'>
            <span>Join</span>
          </button>
          )}
          
          <button className='flex items-center justify-center text-xs border p-1.5 rounded-full'>
            <span className='flex items-center justify-center'><Ellipsis size={16}/></span>
          </button>
        </div>
        <div className='flex items-center text-xs font-medium mt-3 justify-between mx-4.5'>
          <div className='flex items-center gap-x-2'>
            <Link
              to={`/community/${communityId}/`}
              className={`py-2.5 px-3.5 rounded-full ${location.pathname === `/community/${communityId}/` ? 'bg-slate-300' : ''}`}>
              Feed
            </Link>
            <Link
              to={`/community/${communityId}/about/`}
              className={`py-2.5 px-3.5 rounded-full ${location.pathname.includes('about') ? 'bg-slate-300' : ''}`}>
              About
            </Link>
          </div>
          <div className='flex items-center'>
            <div className='flex items-center gap-x-1'>
              <span>Best</span>
              <span><ChevronDown size={14}/></span>
            </div>
            <div className='flex items-center ms-4'>
              <img src={columnsIcon} className='w-6 h-6 ms-0.5' />
              <span><ChevronDown size={14}/></span>
            </div>
          </div>
        </div>

        <div className='flex mt-5 items-center justify-between px-4.5'>
          <div className='flex items-center gap-x-2'>
            <Pin size={18} transform='rotate(45)' color='gray'/>
            <span className='text-[13px]'>Community highlights</span>
          </div>
          <span><ChevronDown size={14}/></span>
        </div>
        <hr className='border-none h-[1px] bg-slate-300 opacity-50 mt-3'/>
        {/* Feed */}
        {posts.length > 0 && posts.map((post) => (
          <article key={post.id} className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <Link to={`/post/${post.id}/`}>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <div className='left-of-panel flex text-xs items-center'>
                  <div className='w-4 h-4 rounded-full bg-green-700'></div>
                  <span className='ms-2 font-medium'>{formatUsername(post?.owner.username)}</span>
                  <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
                  <span>{timeAgo(post?.created_at)}</span>
                </div>
                <div className='w-[75%] font-semibold text-slate-800 mt-2'>{post.title}</div>
              </div>
              <div className='flex py-1.5 min-h-16'>
              {post.thumbnail && (
                  <div className='w-20 h-14 rounded-xl overflow-hidden'>
                  <img 
                    src={getImage(post.thumbnail)} 
                    alt="" 
                    className='w-full h-full object-cover border-0 outline-0'
                    />
                </div>
              )}
            </div>
            </div>
          </Link>
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
      </div>
      {/* About */}
      <div>
        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-3 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold'>About Community</h3>
            {community?.subtitle && (
              <h3 className='font-bold mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, odit?</h3>
            )}
            <p className='mt-1 leading-6 mb-2.5'>{community?.description}</p>
            <div className='text-sm flex gap-x-1.5 mb-2'>
              <CakeSlice transform='scale(-1 1)' size={22} strokeWidth={1} />
              <span>Created {formattedDate}</span>
            </div>
            <div className='text-sm flex gap-x-1.5'>
              <Globe size={22} strokeWidth={1} />
              <span>Public</span>
            </div>
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
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

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Community Bookmarks</h3>
            <div className='flex flex-col gap-y-2.5'>
              {Array.from({length: 5}).map((_, index) => (
                <Link key={index} to='' className='bg-gray-white rounded-full text-center p-2 font-semibold cursor-pointer hover:bg-gray-300 hover:underline'>Lorem, ipsum.</Link>
              ))}
            </div>            
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Rules</h3>
            {community.rules && (
            <ol className='list-decimal px-7 flex flex-col'>
              {community.rules.map((rule, idx) => (
                <RuleItem key={idx} rule={rule} idx={idx}/>
              ))}
            </ol>                
            )}
   
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Moderators</h3>
            <div className='bg-gray-white rounded-full text-center p-2 font-semibold cursor-pointer hover:bg-gray-300 hover:underline flex justify-center gap-x-2 items-center mb-4'>
              <Mail size={20} />
              <span>Message Mods</span>
            </div>
            {community.moderators.length > 0 ? (
              <div className='flex flex-col gap-y-2.5'>
                {community.moderators && community.moderators.map((moderator, idx) => (
                  <div className='flex items-center gap-x-2'>
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
              <h1>No moderators.</h1>
            )}
          </div>
        </div>
      
      </div>
    </div>
  )
};

export default Community;