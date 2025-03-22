import redditIcon from '../assets/icons/reddit.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';

import type { Post } from '../types/post';
import { Comment } from '../types/comment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../utils';
import { BACKEND_URL } from '../config';

import VoteBar from '../components/ui/VoteBar';
import { AwardIcon, ChevronDown, Dot, Ellipsis, MessageCircle, ShareIcon } from 'lucide-react';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';
import { useAuth } from '../contexts/AuthContext';

type CommentHoverState = {
  id: number,
  type: string
}

type PostVote = {
  count: number,
  userVote: string | null
}

type CommentVote = {
  [id: number]: {
    count: number,
    userVote: string | null
  }
}

const Post = () => {

  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [postVote, setPostVote] = useState<PostVote>({count: 0, userVote: null});
  const [commentVotes, setCommentVotes] = useState<CommentVote>({});
  const [postLoading, setPostLoading] = useState(true);
  const { postId } = useParams();
  const [isHovered, setIsHovered] = useState<CommentHoverState | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetchWithAuth(`${BACKEND_URL}/posts/${postId}/`);
      try{
        if(!response?.ok){
          const error = await response?.json();
          console.error("Whoops, couldn't fetch post.", error);
        }else{
          const data = await response.json();
          setPost(data);
          setPostVote({count: data.vote_count, userVote: data.user_vote});
          setCommentVotes(
            data['comments'].reduce((acc: CommentVote, comment: Comment) => {
              acc[comment.id] = {count: comment.vote_count, userVote: comment.user_vote};
              return acc;
            }, {})
          )
        }
      }catch(err){
        console.error(err);
      }finally{
        setPostLoading(false);
      }
    }
    fetchPost();
  }, [postId])

  const handlePostVote = (type: string) => {
    
    const postVote = async () => {
      const dir = type === "upvote" ? 1 : -1; 
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${postId}&dir=${dir}&obj=p`, {
        method: 'POST'
      })
      if(!response?.ok){
        console.error("Whoops, something went wrong.")
      }else{
        const data = await response.json();
        console.log(data);

        setPostVote((prev) => {
          const { count, userVote: prevVote } = prev;
          let newCount = count;
          let newVote: string | null = type;

          if(type === "upvote"){
            if(prevVote === "upvote"){
              newCount -= 1;
              newVote = null;
            }else if(prevVote == "downvote"){
              newCount += 2;
            }else{
              newCount += 1
            }
          }else if(type === "downvote"){
            if(prevVote === "downvote"){
              newCount += 1;
              newVote = null;
            }else if(prevVote === "upvote"){
              newCount -= 2;
            }else{
              newCount -= 1;
            }
          };

          console.log(newVote, newCount)

          return {count: newCount, userVote: newVote}
        })
      }
    };
    postVote();
  }

  const handleCommentVote = async (commentId: number, type: string) => {
    const dir = type === "upvote" ? 1 : -1;
    const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
      method: 'POST'
    });

    if(!response?.ok){
      console.error("Whoops, something went wrong.");
    }else{
      const data = await response.json();
      console.log(data);

      setCommentVotes((prevVotes) => {
        const { count, userVote: prevVote } = prevVotes[commentId];
        let newCount = count;
        let newVote: string | null = type;
        
        if(type === "upvote"){
          if(prevVote === "upvote"){
            newCount -= 1;
            newVote = null;
          }else if(prevVote === "downvote"){
            newCount += 2
          }else{
            newCount += 1;
          }

        }else if(type === "downvote"){
          if(prevVote === "downvote"){
            newCount += 1;
            newVote = null;
          }else if(prevVote === "upvote"){
            newCount -= 2
          }else{
            newCount -= 1
          }
        };
        console.log(newCount);
        return {...prevVotes, [commentId]: {count: newCount, userVote: newVote}};
      })
    }
  }

  if(postLoading) return <h1>Loading...</h1>

  return (
    <div className="py-4 px-4 grid grid-cols-1 mb-60">
      <div className="flex items-center text-xs">
        <div className='w-8 h-8 me-2'>
          <img src={redditIcon} alt="" />
        </div>
        <div className='flex flex-col gap-y-0.5'>
          <div className='flex'>
            <span className='font-semibold me-2'>r/randomchannel</span>
            <span className='opacity-70'>1 day ago</span>
          </div>
          <a href='' className='text-blue-600 underline text-[11px]'>RandomUserIsMe</a>
        </div>
        <img src={ellipsisIcon} alt="" className='w-6 h-6 ms-auto'/>
      </div>
      <h1 className='font-semibold text-[17px] mt-1'>There's a bug in my system. A LITERAL BUG!</h1>
      <p className='text-xs leading-5 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat possimus ea laboriosam? Nam cupiditate assumenda culpa. Ipsa ducimus alias itaque adipisci et temporibus esse error voluptatum quasi blanditiis eum, minus quas amet, facere consequuntur fuga consectetur totam dignissimos explicabo aperiam tenetur excepturi vitae? Qui rerum inventore unde repellat. Laudantium iure, nostrum beatae eum facilis sit culpa. Dolor distinctio sint expedita tempore? Vero alias tempora error, quo doloribus illum impedit beatae.<br /><br />Sincerely, a concerned man.</p>
      <div className='bg-black flex justify-center py-5 mt-3'>
        <img src={redditIcon} alt="" className='w-[75%]'/>
      </div>
      <div className='flex items-center mt-2 gap-x-2.5 py-2'>
        <VoteBar 
          vote={postVote.userVote}
          onVote={handlePostVote}
          initialCount={postVote?.count}
        />
        <div className='bg-slate-200 flex items-center rounded-full px-3.5 gap-x-1.5'>
          <div className='h-full py-2 flex items-center'>
            <MessageCircle size={18}/>
          </div>
          <span>{post?.comment_count}</span>
        </div>
        <div className='bg-slate-200 flex items-center rounded-full px-3.5 gap-x-1.5'>
          <div className='h-full py-2 items-center'>
            <AwardIcon size={18}/>
          </div>
        </div>
        <div className='bg-slate-200 flex items-center rounded-full px-3.5 gap-x-1.5'>
          <div className='h-full py-2 items-center'>
            <ShareIcon size={18}/>
          </div>
        </div>
      </div>
      <button className='border border-slate-400 p-2 rounded-full text-sm mt-2 font-semibold'>Join the conversation</button>
      <div className='flex gap-x-2.5 text-xs mt-5'>
        <span>Sort by:</span>
        <div className='flex items-center'> 
          <span className='me-1'>Best</span>
          <ChevronDown size={14}/>
        </div>
      </div>

      {/* Comments */}
      <div className='flex flex-col mt-4'>
        {post?.comments && post.comments.map((comment: Comment, idx: number) => (
          <div key={idx} className='flex flex-col py-1.5'>
            <div className='flex items-center text-xs'>
              <div className='w-6 h-6 flex items-center justify-center me-2'>
                <img src={redditIcon} alt="" />
              </div>
              <span className='font-bold'>_Reddituzer_</span>
              <Dot size={16} />
              <span className='text-slate-500'>15h ago</span>
            </div>
            <div className='ps-10 flex flex-col'>
              <p className='text-[13px]'>{comment.body}</p>
              <div className='flex items-center text-slate-500 gap-x-2.5 mt-1 text-[13px] select-none'>
                <div className='flex items-center gap-x-1'>
                  <div
                    onClick={() => handleCommentVote(comment.id, "upvote")} 
                    className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                    <UpArrow 
                      height="16px" width="16px"
                      color={commentVotes[comment.id].userVote === "upvote" ? "red" : ""}
                      outlineColor={isHovered?.id === comment.id && isHovered.type === "up" ? 'red' : 'gray'}
                      onMouseEnter={() => setIsHovered({id: comment.id, type: 'up'})}
                      onMouseLeave={() => setIsHovered(null)}
                      />
                  </div>
                  <span>{commentVotes[comment.id].count}</span>
                  <div 
                    onClick={() => handleCommentVote(comment.id, "downvote")}
                    className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                    <DownArrow 
                      height="16px" width="16px" 
                      color={commentVotes[comment.id].userVote === "downvote" ? "blue" : ""}
                      outlineColor={isHovered?.id === comment.id && isHovered.type === "down" ? 'blue' : 'gray'}
                      onMouseEnter={() => setIsHovered({id: comment.id, type: 'down'})}
                      onMouseLeave={() => setIsHovered(null)}
                      />
                  </div>
                </div>
                <div className='flex items-center gap-x-1.5 px-2 py-2 hover:bg-slate-300 rounded-full cursor-pointer hover:text-black group'>
                  <MessageCircle size={16} className='group-hover:text-black'/>
                  <span>Reply</span>
                </div>
                <div className='flex items-center rounded-full py-2 px-2 hover:bg-slate-300 cursor-pointer group'>
                  <Ellipsis size={16} className='group-hover:text-black'/>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Post;