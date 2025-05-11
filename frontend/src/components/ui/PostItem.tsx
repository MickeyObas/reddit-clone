// Assets
import ellipsisIcon from '../../assets/icons/ellipsis.png';
import dotIcon from '../../assets/icons/dot.png';
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';

import { useState } from 'react';
import { fetchWithAuth, formatCommunity, getCommentCountLabel, timeAgo } from '../../utils';
import { BACKEND_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

import { PostFeed } from '../../types/post';
import redditIcon from '../../assets/icons/reddit-outline.png';
import { NotepadTextIcon } from 'lucide-react';
import toast from 'react-hot-toast';

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
                  {!post.is_member && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinCommunity(post.community.id);
                      navigate(`/community/${post.community.id}/`);
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
                    handleJoinCommunity(post.community.id);
                    navigate(`/community/${post.community.id}/`);
                    toast.success(`Welcome, you have joined ${"r/" + post.community.name}!`, {
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
              ${post.user_vote === 'upvote' ? 'bg-deep-red text-white' :
                post.user_vote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
              `}>
              <div 
                className={`rounded-full h-full py-2 px-2 cursor-pointer ${!post.user_vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                <UpArrow
                  height="16px"
                  width="16px"
                  color={`${post.user_vote === 'upvote' ? 'white' : ''}`}
                  onClick={() => onVote(post.id, "upvote")}
                  onMouseEnter={() => setIsHovered({
                    id: post.id,
                    hovered: "up"
                  })}
                  onMouseLeave={() => setIsHovered(null)}
                  outlineColor={
                    (isHovered?.hovered === "up" && isHovered.id == post.id) 
                      ? 'red' 
                      : `${post.user_vote === null ? 'black' : 'white'}`
                    }
                  />
              </div>
              <span className='flex justify-center min-w-3'>{post.vote_count}</span>
              <div className={`rounded-full h-full py-2 px-2 cursor-pointer  ${!post.user_vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                <DownArrow
                  height={"16px"}
                  width={"16px"}
                  color={`${post.user_vote === 'downvote' ? 'white' : ''}`}
                  onClick={() => onVote(post.id, "downvote")}
                  onMouseEnter={() => setIsHovered({
                    id: post.id,
                    hovered: "down"
                  })}
                  onMouseLeave={() => setIsHovered(null)}
                  outlineColor={
                    (isHovered?.hovered === "down" && isHovered.id == post.id) 
                      ? 'blue' 
                      : `${post.user_vote === null ? 'black' : 'white'}`
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
    </>
  )
}

export default PostItem;