import redditIcon from '../assets/icons/reddit.png';
import columnsIcon from '../assets/icons/columns.png';
import dotIcon from '../assets/icons/dot.png';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import { ChevronDown, Ellipsis, Pin, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { fetchWithAuth,  formatDate, formatUsername, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { PostDisplay} from '../types/post';
import { useAuth } from '../contexts/AuthContext';
import { CommunityHeader } from './AboutCommunity';

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

const Community = ({sort='latest'}) => {
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
    console.log(`Hey, new sort --> ${sort}`);
    const fetchPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/posts/?sort=${sort}`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoopps, something went wrong.");
        else{
          const data = await response?.json();
          console.log(data);
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
    
  }, [sort])


  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/posts/?sort=${sort}`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoopps, something went wrong.");
        else{
          const data = await response?.json();
          console.log(data);
          setPosts(data.posts);
          setCommunity(data.community);
          setIsMember(data.community.is_member);
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
        className="bg-gray-white h-16 w-full overflow-hidden"
      ><img src={community?.banner} alt="" className="object-cover w-full h-full" /></div>
      <div className="grid grid-cols-1">
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
    </div>
  )
};

export default Community;