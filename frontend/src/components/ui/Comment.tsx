// Assets 
import redditIcon from '../../assets/icons/reddit.png';
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';
import { Dot, Ellipsis, MessageCircle, MinusCircle, PlusCircle } from 'lucide-react';

import { useState, useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchWithAuth, timeAgo } from '../../utils';
import { CommentType } from '../../types/comment';
import { Post } from '../../types/post';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../config';


interface CommentProps {
  comment: CommentType,
  setPost: React.Dispatch<React.SetStateAction<Post | null>>,
}

type CommentVote = {
    count: number,
    userVote: string | null
  }


const Comment = ({comment, setPost}: CommentProps) => {
  const { postId } = useParams();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const [commentVote, setCommentVote] = useState<CommentVote>({count: comment.vote_count, userVote: comment.user_vote})
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState('');
  const formattedTimeAgo = useMemo(() => timeAgo(comment.created_at), [comment.created_at])
  
  const handleCommentVote = async (commentId: number, type: string) => {
      const dir = type === "upvote" ? 1 : -1;
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
        method: 'POST'
      });
  
      if(!response?.ok){
        console.error("Whoops, something went wrong.");
      }else{
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
          return {...prev, count: newCount, userVote: newVote};
        })
      }
    }

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
  }

  const handleReplyCommentClick = async (parentId: number) => {
    if(!parent) return; // If parent is null/undefined, something is clearly wrong somewhere lmao

    const updateComments = (comments: CommentType[], parentID: number, newComment: CommentType): CommentType[] => {
      return comments.map((comment) => {
        if(comment.id === parentID){
          return {...comment, replies: [...comment.replies, newComment]}
        };
        return {...comment, replies: updateComments(comment.replies, parentId, newComment)}
      })
    };

    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/posts/${postId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({
          owner: user?.id,
          body: reply,
          parent: parentId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response?.ok){
        const error = await response?.json();
        console.error(error);
      }else{
        const data = await response.json();
        setPost((prev) => {
          if(!prev) return prev;
          return {...prev, comments: updateComments(prev?.comments, parentId, data)}
        })
        setShowReplies(true);
        setShowReplyBox(false);
      }
    }catch(err){
      console.error(err);
    }
  } 

  return (
    <div className='flex flex-col py-1.5'>
      <div className='flex items-center text-xs'>
        <div className='w-6 h-6 flex items-center justify-center me-2 rounded-full overflow-hidden'>
          <img src={comment.owner.avatar ?? redditIcon} alt="" className='w-full h-full object-cover' />
        </div>
        <span className='font-bold'>{comment.owner.username}</span>
        <Dot size={16} />
        <span className='text-slate-500'>{formattedTimeAgo}</span>
      </div>
      <div className='border-l border-slate-300 ml-3 '>
        <div className='ps-7 flex flex-col'>
          <p className='text-[13px] break-words whitespace-normal'>{comment.body}</p>
          <div className='flex items-center text-slate-500 gap-x-2.5 mt-1 text-[13px] select-none'>
            <div className='flex items-center gap-x-1'>
              <div
                onClick={() => handleCommentVote(comment.id, "upvote")} 
                className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                <UpArrow 
                  height="16px" width="16px"
                  color={commentVote.userVote === "upvote" ? "red" : ""}
                  outlineColor={isHovered === "up" ? 'red' : 'gray'}
                  onMouseEnter={() => setIsHovered('up')}
                  onMouseLeave={() => setIsHovered(null)}
                  />
              </div>
              <span className='text-xs'>{!commentVote.userVote && commentVote.count == 0 ? 'Vote' : commentVote.count}</span>
              <div 
                onClick={() => handleCommentVote(comment.id, "downvote")}
                className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
                <DownArrow 
                  height="16px" width="16px" 
                  color={commentVote.userVote === "downvote" ? "blue" : ""}
                  outlineColor={isHovered === "down" ? 'blue' : 'gray'}
                  onMouseEnter={() => setIsHovered('down')}
                  onMouseLeave={() => setIsHovered(null)}
                  />
              </div>
            </div>
            <div 
              className='flex items-center gap-x-1.5 px-2 py-2 hover:bg-slate-300 rounded-full cursor-pointer hover:text-black group'
              onClick={() => setShowReplyBox(true)}
              >
              <MessageCircle size={16} className='group-hover:text-black'/>
              <span>Reply</span>
            </div>
            <div className='flex items-center rounded-full py-2 px-2 hover:bg-slate-300 cursor-pointer group'>
              <Ellipsis size={16} className='group-hover:text-black'/>
            </div>
          </div>
          {showReplyBox && (
            <div className='border border-slate-300 rounded-2xl px-2.5 py-2 mt-1.5'>
              <textarea
                ref={textAreaRef}
                className='w-full outline-0 border-0 overflow-hidden resize-none' 
                onChange={handleReplyChange}
                placeholder='Join the conversation'
                rows={4}
                name="" 
                id=""></textarea>
              <div className='flex text-xs flex-row-reverse gap-x-2 font-medium pt-2'>
                <button 
                  className='py-1.5 px-2 bg-blue-600 rounded-full text-white'
                  onClick={() => handleReplyCommentClick(comment.id)}
                  >Comment</button>
                <button 
                  className='py-1.5 px-2 bg-gray-white rounded-full'
                  onClick={() => setShowReplyBox(false)}
                  >Cancel</button>
              </div>
            </div>
          )}
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
              <Comment
                comment={reply} 
                setPost={setPost}
                />
            </div>
          ))
        )}
      </div>
    </div>
  )
};

export default Comment;