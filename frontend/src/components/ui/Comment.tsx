import redditIcon from '../../assets/icons/reddit.png';
import { Dot, Ellipsis, MessageCircle } from 'lucide-react';
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';


const Comment = () => {
  return (
    <div className='flex flex-col py-1.5'>
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
  )
};

export default Comment;