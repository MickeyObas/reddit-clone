import redditIcon from '../assets/icons/reddit-outline.png';
import ellipsisIcon from '../assets/icons/ellipsis.png';
import defaultRedditProfileIcon from '../assets/icons/reddit-profile.png';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/virtual'

import { Navigation, Virtual } from 'swiper/modules';

import type { Post, PostDisplay } from '../types/post';
import { CommentType } from '../types/comment';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { fetchWithAuth, formatCommunity, formatDate, formatUsername, getCommentCountLabel, getVoteCountLabel, timeAgo, useMediaQuery } from '../utils';
import { BACKEND_URL } from '../config';

import VoteBar from '../components/ui/VoteBar';
import { AwardIcon, CakeSlice, ChevronDown, Dot, Globe, MessageCircle, ShareIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Comment from '../components/ui/Comment';
import Sidebar from '../components/layouts/Sidebar';
import { Community } from '../types/community';
import { RuleItem } from './AboutCommunity';


type PostVote = {
  count: number,
  userVote: string | null
}

type LayoutContextType = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommunityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Post = () => {
  const navigate = useNavigate();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [postVote, setPostVote] = useState<PostVote>({count: 0, userVote: null});
  const [postLoading, setPostLoading] = useState(true);
  const { postId } = useParams();
  const formattedTimeAgo = useMemo(() => timeAgo(post?.created_at ?? ''), [post?.created_at]);
  const {setIsSidebarOpen, setIsCommunityModalOpen} = useOutletContext<LayoutContextType>();
  const isBiggerScreen = useMediaQuery('(min-width: 768px');
  const [community, setCommunity] = useState<Community | null>(null);
  const [popularPosts, setPopularPosts] = useState<PostDisplay[]>([]);
  const [isCommunityMember, setIsCommunityMember] = useState<boolean | null>(null)
  const formattedDate = useMemo(() => {
    const dateStr = community?.created_at;
    if(!dateStr) return "N/A";
    return formatDate(dateStr);
  }, [community?.created_at])

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
          setIsCommunityMember(data.is_member);
          setPostVote({count: data.vote_count, userVote: data.user_vote});
        }
      }catch(err){
        console.error(err);
      }finally{
        setPostLoading(false);
      }
    };

    fetchPost();
    
  }, [postId])

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [postId]);

  useEffect(() => {
    const fetchCommunity = async () => {
      if(!post?.community.id) return;
      const response = await fetchWithAuth(`${BACKEND_URL}/communities/${post?.community.id}/`);

      try{
        if(!response?.ok){
          const error = await response?.json();
          console.error("Whoops, couldn't fetch community.", error);
        }else{
          const data = await response.json();
          setCommunity(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        // setPostLoading(false);
      }
    }

    const fetchPopularPosts = async () => {
      if(!post?.community.id) return;
      const response = await fetchWithAuth(`${BACKEND_URL}/communities/${post?.community.id}/popular-posts/`);

      try{
        if(!response?.ok){
          const error = await response?.json();
          console.error("Whoops, couldn't fetch community's popular posts.", error);
        }else{
          const data = await response.json();
          console.log("Popular posts: ", data);
          setPopularPosts(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        // setPostLoading(false);
      }
    }

  if(isBiggerScreen){
    fetchCommunity();
    fetchPopularPosts();
  };
  }, [post?.community.id, isBiggerScreen])

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

   const handleJoin = async () => {
    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/communities/${community?.id}/join/`, {
        method: 'POST'
      });
      if(!response?.ok){
        console.error("Whoops, something went wrong.");
      }else{
        setIsCommunityMember(true);
      }
    }catch(err){
      console.error(err);
    }
  };

  if(postLoading) return <h1>Loading...</h1>

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
      <div className='hidden xl:block'>
        <Sidebar 
          isSidebarOpen={true}
          setIsCommunityModalOpen={setIsCommunityModalOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] md:gap-4 max-w-[1000px] mx-auto w-full'>
        <div className='xl:px-4 w-full py-3 px-4'>
          <div className="flex items-center text-xs">
            <div className='w-8 h-8 me-2 overflow-hidden rounded-full'>
              <img src={post?.community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
            </div>
            <div className='flex flex-col gap-y-0.5'>
              <div className='flex'>
                {/* TODO: Find fixes for such TS errors */}
                <Link 
                  to={`/community/${post?.community.id}/`}
                  className='font-semibold me-2 hover:text-blue-900'>{post?.community.name && formatCommunity(post?.community.name)}</Link>
                <span className='opacity-70'>{formattedTimeAgo}</span>
              </div>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${post?.owner.id}/`)
                }}
                className='text-blue-600 underline text-[11px] cursor-pointer'>{formatUsername(post?.owner.username ?? "Unknown User")}</span>
            </div>
            <img src={ellipsisIcon} alt="" className='w-6 h-6 ms-auto'/>
          </div>
          <h1 className='font-semibold text-[17px] mt-1'>{post?.title}</h1>
          <p className='text-xs leading-5 mt-3'>{post?.body}</p>
          {post?.media && post.media.length > 0 && (
            <div className='bg-black aspect-[4/3] mt-3 max-h-[100vw] overflow-hidden w-full max-w-full md:rounded-lg select-none'>
              <Swiper
                modules={[Navigation, Virtual]}
                className='w-full h-full'
                navigation={true}
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {post.media.map((mediaItem, idx) => (
                  <SwiperSlide key={idx} className='w-full h-full'>
                    <div className='w-full h-full overflow-hidden'>
                      <img src={mediaItem} alt="" className='w-full h-full object-contain' />
                    </div>
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
              className='border border-slate-400 p-2 rounded-full text-sm mt-2 font-semibold w-full cursor-pointer'
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
                  className='py-1.5 px-2 bg-blue-600 rounded-full text-white cursor-pointer'
                  onClick={handleCommentClick}
                  >Comment</button>
                <button 
                  className='py-1.5 px-2 bg-gray-white rounded-full cursor-pointer'
                  onClick={() => setShowCommentBox(false)}
                  >Cancel</button>
              </div>
            </div>
          )}
          {post?.comments && post?.comments?.length > 0 && (
            <div className='flex gap-x-2.5 text-xs mt-5'>
            <span>Sort by:</span>
            <div className='flex items-center'> 
              <span className='me-1'>Best</span>
              <ChevronDown size={14}/>
            </div>
          </div>
          )}

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
        <div className='hidden md:flex flex-col w-full py-3 px-3'>
          {community && (
            <div className='flex flex-col bg-gray-100'>
              <div className='py-4 px-2.5 border-b border-b-slate-300'>
                <div className='flex items-center justify-between mb-2'>
                  <h2
                    onClick={() => navigate(`/community/${community.id}/`)} 
                    className='hover:text-blue-900 cursor-pointer text-lg font-bold'>{community.name && formatCommunity(community.name)}</h2>
                  {isCommunityMember ? (
                    <button className='flex items-center justify-center text-xs py-2 border px-3  rounded-full'>
                    <span>Joined</span>
                  </button>
                  ): (
                    <button 
                      onClick={handleJoin}
                      className='flex items-center justify-center text-xs py-2 border px-3  rounded-full bg-blue-700 text-white cursor-pointer'>
                    <span>Join</span>
                  </button>
                  )}
                </div>
                <p className='font-bold text-slate-600'>Welcome!</p>
                <p>{community.description}</p>
                <div className='flex gap-x-1 items-center mt-1.5'>
                  <CakeSlice transform='scale(-1,1)' size={22} strokeWidth={1} />
                  <span className='text-xs'>Created {formattedDate}</span>
                </div>
                <div className='flex gap-x-1 items-center mt-1.5'>
                  <Globe size={18} color='gray'/>
                  <span className='text-gray-500 text-xs'>Public</span>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col mt-2.5'>
                    <span className='font-bold text-black'>{community.member_count}</span>
                    <span className='text-xs'>Members</span>
                  </div>
                  <div className='flex flex-col mt-2.5'>
                    <div className='font-bold text-black'>6</div>
                    <div className='flex items-center'>
                      <div className='bg-green-600 w-2 h-2 rounded-full me-1'></div>
                      <span className='text-xs'>Online</span>
                    </div>
                  </div>
                  <div className='flex flex-col mt-2.5'>
                    <span className='font-bold text-black'>Top 1%</span>
                    <span className='text-xs'>Rank by size</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='px-3 py-6 border-b border-b-slate-300'>
                  <h3 className='uppercase font-semibold mb-3'>User Flair</h3>
                  <div className='flex items-center gap-x-2.5'>
                    <div className='rounded-full overflow-hidden w-8 h-8'>
                      <img src={defaultRedditProfileIcon} alt="" />
                    </div>
                    <h3>{user?.username}</h3>
                  </div>            
                </div>
              </div>
              {community.rules.length > 0 && (
                <div className='flex flex-col'>
                  <div className='px-3 py-6 border-b border-b-slate-300'>
                    <h3 className='uppercase font-semibold mb-3'>Rules</h3>
                    {community && community?.rules?.length > 0 ? (
                    <ol className='list-decimal px-7 flex flex-col'>
                      {community?.rules.map((rule, idx) => (
                        <RuleItem key={idx} rule={rule} idx={idx}/>
                      ))}
                    </ol>                
                    ) : (
                      <h1>No specific rules set. The community expects members to follow general Reddit guidelines.</h1>
                    )}
                  </div>
                </div>
              )}
              {popularPosts.length > 0 && (
                <div className='mt-4 px-3'>
                  <h3 className='uppercase font-semibold mb-3'>Top posts</h3>
                  {popularPosts.map((post, idx) => {
                    if(post.thumbnail){
                      return (
                        <div key={idx} className='flex flex-col border-b border-b-slate-200 py-2.5 last-of-type:border-b-0 last-of-type:pb-1'>
                          <div className='flex gap-x-2 justify-between'>
                            <div className='flex flex-col w-2/3'>
                              <div
                                onClick={() => navigate(`/community/${community.id}/`)} 
                                className='flex gap-x-2.5 items-center group cursor-pointer'>
                                <div className='w-6 h-6 rounded-full overflow-hidden flex items-center justify-center'>
                                  <img src={community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
                                </div>
                                <span className='text-gray-500 text-xs flex items-center group-hover:underline'>{formatCommunity(community.name)}</span>
                              </div>
                              <p 
                                onClick={() => navigate(`/post/${post.id}/`)}
                                className='line-clamp-2 text-gray-500 font-medium mt-2 leading-5 cursor-pointer hover:underline'>{post.title}</p>
                            </div>
                            <div className='bg-red-400 w-18 h-18 rounded-lg max-w-25 overflow-hidden'>
                              <img src={post.thumbnail} alt="" className='w-full h-full object-cover'/>
                            </div>
                          </div>
                          <div className='flex items-center gap-x-1 mt-2.5 text-xs text-slate-500'>
                            <span>{Math.abs(post.vote_count)} {getVoteCountLabel(post.vote_count)}</span>
                            <Dot size={10}/>
                            <span>{post.comment_count} {getCommentCountLabel(post.comment_count)}</span>
                          </div>
                        </div>
                      )
                    }else{
                      return (
                        <div key={idx} className='flex flex-col border-b border-b-slate-200 py-2.5'>
                          <div 
                            onClick={() => navigate(`/community/${community.id}/`)}
                            className='flex gap-x-2.5 items-center group cursor-pointer'>
                            <div className='w-6 h-6 rounded-full overflow-hidden flex items-center justify-center'>
                              <img src={community.avatar ?? redditIcon} alt="" className='w-full h-full object-cover'/>
                            </div>
                            <span className='text-gray-500 text-xs flex items-center group-hover:underline'>{formatCommunity(community.name)}</span>
                          </div>
                          <p 
                            onClick={() => navigate(`/post/${post.id}/`)}
                            className='line-clamp-2 text-gray-500 font-medium mt-2 leading-5 cursor-pointer hover:underline'>{post.title}</p>
                          <div className='flex items-center gap-x-1 mt-2.5 text-xs text-slate-500'>
                            <span>{post.vote_count} {getVoteCountLabel(post.vote_count)}</span>
                            <Dot size={10}/>
                            <span>{post.comment_count} {getCommentCountLabel(post.comment_count)}</span>
                          </div>
                        </div>
                      )}
                    })}
                  </div>
                  )}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export default Post;