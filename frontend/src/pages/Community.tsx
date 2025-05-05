// Assets
import dotIcon from '../assets/icons/dot.png';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import redditIcon from '../assets/icons/reddit-outline.png';

import { ChevronDown, Pin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWithAuth, formatUsername, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { Post, PostDisplay} from '../types/post';
import { useAuth } from '../contexts/AuthContext';
import { CommunityHeader } from './AboutCommunity';
import type { Community } from '../types/community';


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
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);
  const [votes, setVotes] = useState<PostVotes>({})
  const { communityId } = useParams();

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

  if(!community) return <h1></h1>

  return (
    <div className='pb-5'>
      {/* Community Header */}
      <div
        className="bg-gray-white h-16 w-full overflow-hidden">
        {community?.banner && (<img src={community?.banner} alt="" className="object-cover w-full h-full" />)}
      </div>
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
        {processedPosts && processedPosts.length > 0 ? processedPosts.map((post) => (
          <article key={post.id} className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
          <Link to={`/post/${post.id}/`}>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <div className='left-of-panel flex text-xs items-center'>
                  <div className='w-4 h-4 rounded-full flex items-center justify-center overflow-hidden'>
                    <img src={post.owner.avatar ?? redditIcon} alt="" className='w-full h-full object-cover' />
                  </div>
                  <span className='ms-2 font-medium'>{formatUsername(post?.owner.username)}</span>
                  <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
                  <span>{post.timeAgoText}</span>
                </div>
                <div className='w-[75%] font-semibold text-slate-800 mt-2'>{post.title}</div>
              </div>
              <div className='flex py-1.5 min-h-16'>
              {post.thumbnail && (
                  <div className='w-20 h-14 rounded-xl overflow-hidden'>
                  <img 
                    src={post.thumbnail} 
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
        )) : (
          <h1 className='px-4 py-3'>There are no posts in this community, yet. Why not be the first poster? XD</h1>
        )}
      </div>      
    </div>
  )
};

export default Community;