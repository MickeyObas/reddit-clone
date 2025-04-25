import { Dot, Ellipsis, Forward, MessageCircle } from "lucide-react"
import UpArrow from "../../assets/svgs/UpArrow"
import DownArrow from "../../assets/svgs/DownArrow"
import { timeAgo } from "../../utils"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import redditIcon from '../../assets/icons/reddit-outline.png';
import { CommentFeed } from "../../types/comment"
import { Profile } from "../../types/profile"

interface CommentItemProps {
  comment: CommentFeed,
  onVote: (commentId: number, type: "upvote" | "downvote" | null) => void,
  profile: {
    profile: Profile
  }
}

const CommentItem = ({comment, onVote, profile}: CommentItemProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const formattedTimeAgo = useMemo(() => timeAgo(comment.created_at), [comment.created_at])

  return (
    <>
      <article 
        onClick={() => navigate(`/post/${comment.post.id}/`)}
        className='grid grid-cols-1 px-4 py-3 border-b border-b-slate-200 cursor-pointer'>
        <div 
          className='flex flex-col gap-y-1.5'>
          <div className='flex gap-x-2 items-center text-xs'>
            <div className="w-6 h-6">
              {comment.post.community.avatar ? (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={comment.post.community.avatar} alt="" className="w-full h-full object-cover"/>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={redditIcon} alt="" className="w-full h-full object-cover"/>
                </div>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-y-1.5">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/community/${comment.post.community.id}/`)
                }} 
                className="font-semibold cursor-pointer hover:text-blue-700">{"r/" + comment.post.community.name}</span>
              <Dot size={20}/>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${comment.post.id}/`)
                }} 
                className='hover:text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis'>{comment.post.title}</span>
            </div>
          </div>
          <p className='text-xs flex gap-x-1 text-gray-500 ms-7 flex-wrap gap-y-1.5'>
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user/${user?.id}/`)
              }} 
              className='font-bold text-black cursor-pointer hover:text-blue-700'>{profile?.profile?.user?.username}</span>
            {comment.parent ? (
              <>
                {comment.post.owner.id === profile.profile.user.id && (
                  <span className='text-blue-500 font-bold'>OP</span>
                )}
                <span>replied to{' '}
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Clicked other user")
                      navigate(`/user/${comment.parent.owner.id}/`)
                    }}
                    className='font-bold text-black cursor-pointer hover:text-blue-700'>
                    {comment.parent.owner.username}
                  </span>
                </span>
              </>
            ) : (
              <span>commented</span>
            )}
              <span>{formattedTimeAgo}</span>
          </p>
        </div>
        <div className='text-sm mt-3 leading-5 ms-7'>
          <p className="break-words whitespace-normal">{comment.body}</p>
        </div>
        <div className='ms-5 flex items-center text-slate-500 gap-x-1 text-xs select-none'>
          <div className='flex items-center gap-x-1'>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onVote(comment.id, "upvote")
              }} 
              className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
              <UpArrow 
                height="14px" width="14px"
                color={comment.user_vote === "upvote" ? "red" : ""}
                outlineColor={isHovered === "up" ? 'red' : 'gray'}
                onMouseEnter={() => setIsHovered('up')}
                onMouseLeave={() => setIsHovered(null)}
                />
            </div>
            <span className='text-xs'>{comment.vote_count}</span>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onVote(comment.id, "downvote")
              }}
              className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
              <DownArrow 
                height="14px" width="14px" 
                color={comment.user_vote === "downvote" ? "blue" : ""}
                outlineColor={isHovered === "down" ? 'blue' : 'gray'}
                onMouseEnter={() => setIsHovered('down')}
                onMouseLeave={() => setIsHovered(null)}
                />
            </div>
          </div>
          <div 
            className='flex items-center gap-x-1.5 px-2 py-2 hover:bg-slate-300 rounded-full cursor-pointer hover:text-black group'
            onClick={() => navigate(`/post/${comment.post.id}/`)}
            >
            <MessageCircle size={16} className='group-hover:text-black'/>
            <span>Reply</span>
          </div>
          <div className='flex items-center gap-x-1.5 px-2 py-2 hover:bg-slate-300 rounded-full cursor-pointer hover:text-black group'>
            <Forward size={20} />
            <span>Share</span>
          </div>
          <div className='flex items-center rounded-full py-2 px-2 hover:bg-slate-300 cursor-pointer group'>
            <Ellipsis size={16} className='group-hover:text-black'/>
          </div>
        </div>
      </article>
    </>
  )
}

export default CommentItem;