import redditIcon from '../../assets/icons/reddit.png';
import { Dot, Ellipsis, MessageCircle, MinusCircle, PlusCircle } from 'lucide-react';
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { fetchWithAuth, timeAgo } from '../../utils';
import { BACKEND_URL } from '../../config';
import { CommentType } from '../../types/comment';


type CommentHoverState = {
  id: number,
  type: string
} | null;

interface CommentProps {
  comment: CommentType,
  isHovered: CommentHoverState,
  setIsHovered: React.Dispatch<React.SetStateAction<CommentHoverState>>
}

type CommentVote = {
    count: number,
    userVote: string | null
  }


const Comment = ({comment, isHovered, setIsHovered}: CommentProps) => {
  const { user } = useAuth();
  const [commentVote, setCommentVote] = useState<CommentVote>({count: comment.vote_count, userVote: comment.user_vote})
  const [showReplies, setShowReplies] = useState(false);

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
  
        setCommentVote((prev) => {
          const { count, userVote: prevVote } = prev;
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
          return {...prev, count: newCount, userVote: newVote};
        })
      }
    }


  return (
    <div className='flex flex-col py-1.5'>
      <div className='flex items-center text-xs'>
        <div className='w-6 h-6 flex items-center justify-center me-2'>
          <img src={redditIcon} alt="" />
        </div>
        <span className='font-bold'>{comment.owner.username}</span>
        <Dot size={16} />
        <span className='text-slate-500'>{timeAgo(comment.created_at)}</span>
      </div>
      <div className='border-l border-slate-300 ml-3 '>
        <div className='ps-7 flex flex-col'>
          <p className='text-[13px]'>{comment.body}</p>
          <div className='flex items-center text-slate-500 gap-x-2.5 mt-1 text-[13px] select-none'>
            <div className='flex items-center gap-x-1'>
              <div
                onClick={() => handleCommentVote(comment.id, "upvote")} 
                className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                <UpArrow 
                  height="16px" width="16px"
                  color={commentVote.userVote === "upvote" ? "red" : ""}
                  outlineColor={isHovered?.id === comment.id && isHovered.type === "up" ? 'red' : 'gray'}
                  onMouseEnter={() => setIsHovered({id: comment.id, type: 'up'})}
                  onMouseLeave={() => setIsHovered(null)}
                  />
              </div>
              <span>{commentVote.count}</span>
              <div 
                onClick={() => handleCommentVote(comment.id, "downvote")}
                className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                <DownArrow 
                  height="16px" width="16px" 
                  color={commentVote.userVote === "downvote" ? "blue" : ""}
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
          {comment.replies.length > 0 && (
            <div 
              className='flex items-center ms-2 hover:underline w-fit'
              onClick={() => setShowReplies(!showReplies)}
              >
              {!showReplies ? <PlusCircle size={15} color='#90a1b9'/> : <MinusCircle size={15} color='#90a1b9'/>}
              <span 
                className='text-[11px] ms-1.5 text-slate-500 cursor-pointer select-none'
                >{showReplies ? "Less Replies" : " More Replies"}</span>
            </div>
          )}
        </div>
        {(showReplies && comment.replies.length > 0) && (
          comment.replies.map((reply, idx) => (
            <div className='ml-8' key={idx}>
              <Comment comment={reply} isHovered={isHovered} setIsHovered={setIsHovered} />
            </div>
          ))
        )}
      </div>
    </div>
  )
};

export default Comment;