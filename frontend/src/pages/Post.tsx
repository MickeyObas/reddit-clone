import redditIcon from '../assets/icons/reddit.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual'

import { Navigation, Virtual } from 'swiper/modules';

import type { Post } from '../types/post';
import { CommentType } from '../types/comment';
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWithAuth, formatCommunity, formatUsername, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';

import VoteBar from '../components/ui/VoteBar';
import { AwardIcon, ChevronDown, MessageCircle, ShareIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Comment from '../components/ui/Comment';


type PostVote = {
  count: number,
  userVote: string | null
}

const Post = () => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [postVote, setPostVote] = useState<PostVote>({count: 0, userVote: null});
  const [postLoading, setPostLoading] = useState(true);
  const { postId } = useParams();

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

          return {count: newCount, userVote: newVote}
        })
      }
    };
    postVote();
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }

  const handleCommentClick = async () => {
    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/posts/${postId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({
          owner: user?.id,
          body: comment
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response?.ok) console.error("Whoops, something went wrong.");
      else{
        const data = await response.json();
        setPost((prev) => (prev ? {...prev, comments: [data, ...prev.comments]} : prev));
        setShowCommentBox(false);
      }
    }catch(err){
      console.error(err);
    }
  }

  if(postLoading) return <h1>Loading...</h1>

  return (
    <div className="py-4 px-4 grid grid-cols-1 mb-60">
      <div className="flex items-center text-xs">
        <div className='w-8 h-8 me-2 overflow-hidden rounded-full'>
          <img src={post?.community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
        </div>
        <div className='flex flex-col gap-y-0.5'>
          <div className='flex'>
            {/* TODO: Find fixes for such TS errors */}
            <Link 
              to={`/community/${post?.community.id}/`}
              className='font-semibold me-2'>{post?.community.name && formatCommunity(post?.community.name)}</Link>
            <span className='opacity-70'>{timeAgo(post?.created_at)}</span>
          </div>
          <a href='' className='text-blue-600 underline text-[11px]'>{formatUsername(post?.owner.username ?? "Unknown User")}</a>
        </div>
        <img src={ellipsisIcon} alt="" className='w-6 h-6 ms-auto'/>
      </div>
      <h1 className='font-semibold text-[17px] mt-1'>{post?.title}</h1>
      <p className='text-xs leading-5 mt-3'>{post?.body}</p>
      <p>{post?.id}</p>
      {post?.media && post.media.length > 0 && (
        <div className='bg-blue-300 aspect-[4/3]'>
          <Swiper
            modules={[Navigation, Virtual]}
            className='w-full h-full object-contain'
            navigation={true}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {post.media.map((mediaItem, idx) => (
              <SwiperSlide key={idx}>
                <img src={mediaItem} alt="" className='w-full h-full object-cover' />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
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
      {!showCommentBox ? (
        <button 
          className='border border-slate-400 p-2 rounded-full text-sm mt-2 font-semibold'
          onClick={() => setShowCommentBox(true)}
          >Join the conversation</button>
      ) : (
        <div className='border border-slate-300 rounded-2xl px-2.5 py-2 mt-1.5'>
          <textarea
            ref={textAreaRef}
            className='w-full outline-0 border-0 overflow-hidden resize-none' 
            onChange={handleCommentChange}
            placeholder='Join the conversation'
            rows={4}
            name="" 
            id=""></textarea>
          <div className='flex text-xs flex-row-reverse gap-x-2 font-medium pt-2'>
            <button 
              className='py-1.5 px-2 bg-blue-600 rounded-full text-white'
              onClick={handleCommentClick}
              >Comment</button>
            <button 
              className='py-1.5 px-2 bg-gray-white rounded-full'
              onClick={() => setShowCommentBox(false)}
              >Cancel</button>
          </div>
        </div>
      )}
      <div className='flex gap-x-2.5 text-xs mt-5'>
        <span>Sort by:</span>
        <div className='flex items-center'> 
          <span className='me-1'>Best</span>
          <ChevronDown size={14}/>
        </div>
      </div>

      {/* Comments */}
      <div className='flex flex-col mt-4'>
        {post?.comments && post.comments.map((comment: CommentType) => (
          <Comment 
            key={comment.id}
            comment={comment}
            setPost={setPost}
          />
        ))}
      </div>
    </div>
  )
}

export default Post;