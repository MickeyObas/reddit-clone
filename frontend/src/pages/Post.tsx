import redditIcon from '../assets/icons/reddit.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';

import type { Post } from '../types/post';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../utils';
import { BACKEND_URL } from '../config';

import VoteBar from '../components/ui/VoteBar';
import { AwardIcon, MessageCircle, ShareIcon } from 'lucide-react';

const Post = () => {

  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const { postId } = useParams();

  const handleVote = (type: string) => {
    if(type === "upvote"){
      console.log("Upvoted!!!")
    }else if(type == "downvote"){
      console.log("downvote");
    }
  }

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetchWithAuth(`${BACKEND_URL}/posts/${postId}/`);
      try{
        if(!response?.ok){
          const error = await response?.json();
          console.error("Whoops, couldn't fetch post.", error);
        }else{
          const data = await response.json();
          console.log(data);
          setPost(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setPostLoading(false);
      }
    }
    fetchPost();
  }, [postId])

  if(postLoading) return <h1>Loading...</h1>

  return (
    <div className="py-4 px-3.5 grid grid-cols-1">
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
          vote={post?.user_vote}
          onVote={handleVote}
          initialCount={post?.vote_count}
        />
        <div className='bg-slate-200 flex items-center rounded-full px-3.5 gap-x-1.5'>
          <div className='h-full py-2 flex items-center'>
            <MessageCircle size={18}/>
          </div>
          <span>99</span>
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
    </div>
  )
}

export default Post;