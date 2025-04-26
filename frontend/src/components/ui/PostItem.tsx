// Assets
import ellipsisIcon from '../../assets/icons/ellipsis.png';
import dotIcon from '../../assets/icons/dot.png';
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';

import { useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../../utils';
import { BACKEND_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

import { PostFeed } from '../../types/post';
import redditIcon from '../../assets/icons/reddit-outline.png';

type hoverState = {
  id: number,
  hovered: string
}

type PostItemProps = {
  post: PostFeed,
  onVote: (postId: number, voteType: "upvote" | "downvote" | null) => void
}

const PostItem = ({post, onVote}: PostItemProps) => {

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);

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

  return (
    <>
      <article className="feed grid grid-cols-1 px-4 py-3 border-b border-b-slate-200">
        <div className="cursor-pointer" onClick={() => navigate(`/post/${post.id}/`)}>
          <div className='flex'>
            <div className='left-of-panel flex text-xs items-center'>
              <div className='w-5 h-5 rounded-full overflow-hidden'>
                {post?.community.avatar ? (
                  <img 
                  className='w-full h-full object-cover'
                  src={post?.community.avatar}/>
                ) : (
                  <img 
                  className='w-full h-full object-cover'
                  src={redditIcon}/>
                )}
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
                  src={post.thumbnail} 
                  alt="" 
                  className='w-full h-full object-cover border-0 outline-0'
                  />
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-between text-xs items-center select-none'>
          <div className={`items-center rounded-full flex justify-between text-black mt-1 overflow-hidden
          ${post?.user_vote === 'upvote' ? 'bg-deep-red text-white' :
            post?.user_vote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
            `}>
            <div className={`rounded-full h-full py-2 px-2 cursor-pointer ${!
              post?.user_vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
              <UpArrow
                height="16px"
                width="16px"
                color={`${post?.user_vote === 'upvote' ? 'white' : ''}`}
                onClick={() => onVote(post.id, "upvote")}
                onMouseEnter={() => setIsHovered({
                  id: post.id,
                  hovered: "up"
                })}
                onMouseLeave={() => setIsHovered(null)}
                outlineColor={
                  (isHovered?.hovered === "up" && isHovered.id == post.id) 
                    ? 'red' 
                    : `${post?.user_vote === null ? 'black' : 'white'}`
                  }
                />
            </div>
            <span className='flex justify-center min-w-3'>{post?.vote_count}</span>
            <div className={`rounded-full h-full py-2 px-2 cursor-pointer  ${!post?.user_vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
              <DownArrow
                height={"16px"}
                width={"16px"}
                color={`${post?.user_vote === 'downvote' ? 'white' : ''}`}
                onClick={() => onVote(post.id, "downvote")}
                onMouseEnter={() => setIsHovered({
                  id: post.id,
                  hovered: "down"
                })}
                onMouseLeave={() => setIsHovered(null)}
                outlineColor={
                  (isHovered?.hovered === "down" && isHovered.id == post.id) 
                    ? 'blue' 
                    : `${post?.user_vote === null ? 'black' : 'white'}`
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
    </>
  )
}

export default PostItem;