import { Dot, Ellipsis, Forward, MessageCircle } from "lucide-react"
import UpArrow from "../../assets/svgs/UpArrow"
import DownArrow from "../../assets/svgs/DownArrow"
import { fetchWithAuth, timeAgo } from "../../utils"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"


const CommentItem = ({comment}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCommentVote = async (commentId: number, type: string) => {
      const dir = type === "upvote" ? 1 : -1;
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
        method: 'POST'
      });
  
      if(!response?.ok){
        console.error("Whoops, something went wrong.");
      }else{
        /* 
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
        */
      }
    }

  return (
    <>
      <article className='grid grid-cols-1 px-4 py-3 border-b border-b-slate-200'>
        <div className='flex flex-col gap-y-1.5'>
          <div className='flex gap-x-2 items-center text-xs'>
            <div className="w-5 h-5">
              <div className='w-5 h-5 rounded-full bg-green-500 self-center'></div>
            </div>
            <div className="flex items-center flex-wrap gap-y-1.5">
              <span className="font-semibold">{"r/" + comment.post.community.name}</span>
              <Dot size={20}/>
              <span className=''>{comment.post.title}</span>
            </div>
          </div>
          <p className='text-xs flex gap-x-1 text-gray-500 ms-7 flex-wrap gap-y-1.5'>
            <span className='font-bold text-black'>{user?.username}</span>
            {comment.parent ? (
              <>
                {comment.post.owner.id === user?.id && (
                  <span className='text-blue-500 font-bold'>OP</span>
                )}
                <span>replied to{' '}
                  <span className='font-bold text-black'>
                    {comment.parent.owner.username}
                  </span>
                </span>
              </>
            ) : (
              <span>commented</span>
            )}
              <span>{timeAgo(comment.created_at)}</span>
          </p>
        </div>
        <div className='text-sm mt-3 leading-5 ms-7'>
          <p className="break-words whitespace-normal">{comment.body}</p>
        </div>
        <div className='ms-5 flex items-center text-slate-500 gap-x-1 text-xs select-none'>
          <div className='flex items-center gap-x-1'>
            <div
              onClick={() => handleCommentVote(comment.id, "upvote")} 
              className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
              <UpArrow 
                height="14px" width="14px"
                color={""}
                outlineColor={'gray'}
                onMouseEnter={() => console.log("Entered")}
                onMouseLeave={() => console.log("Left")}
                />
            </div>
            <span className='text-xs'>{comment.vote_count}</span>
            <div 
              onClick={() => console.log("Voted")}
              className='rounded-full h-full py-2 px-2 cursor-pointer hover:bg-slate-300'>
              <DownArrow 
                height="14px" width="14px" 
                color={""}
                outlineColor={'gray'}
                onMouseEnter={() => console.log("Entered")}
                onMouseLeave={() => console.log("Left")}
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