import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";
import PostItem from "../components/ui/PostItem";
import { PostFeed } from "../types/post";
import Skeleton from "react-loading-skeleton";
import redditIcon from '../assets/icons/reddit.png';

const UserPosts = () => {
  const [posts, setPosts] = useState<PostFeed[]>([]);
  const { user } = useAuth()
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const sortFilter = searchParams.get('sort') || 'new';
  const isOwner = user?.id == userId;
  const [isLoading, setIsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const observer = useRef<IntersectionObserver>(null);
  const loaderRef = useRef(null);
  const [nextUrl, setNextUrl] = useState('');
  const loadingRef = useRef<boolean>(false);

  console.log("NEXT URL: ", nextUrl);

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/posts/?sort=${sortFilter}`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          // console.log(data);
          setPosts(data.results);
          setNextUrl(data.next);
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsLoading(false);
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [userId, sortFilter])

  const handleVote = async (postId: number, voteType: "upvote" | "downvote" | null) => {
    const dir = voteType === 'upvote' ? 1 : -1;
    const updatedPosts = [...posts];
    const post = updatedPosts.find((post) => post.id === postId);

    if(!post) return;

    const previousVoteType = post?.user_vote;
    const previousVoteCount = post?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticVoteUpdate(post, voteType);
    post.user_vote = newVoteType;
    post.vote_count = newVoteCount;
    setPosts(updatedPosts);
    
    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${post.id}&dir=${dir}&obj=p`, {
        method: 'POST'
      });

      if(!response?.ok){
        post.user_vote = previousVoteType;
        post.vote_count = previousVoteCount;
        setPosts([...updatedPosts]);
        console.log("Something went wrong during voting.");
      }else{
        const data = await response?.json();
        console.log(data);
        post.vote_count = data.count;
        setPosts([...updatedPosts]);
      }
    }catch(err){
      console.error(err);
    }
  }

   const getOptimisticVoteUpdate = (post: PostFeed, voteType: "upvote" | "downvote" | null) => {
      const previousVoteType = post.user_vote;
      let newVoteType = voteType;
      let newVoteCount = post.vote_count;
  
      if(voteType === 'upvote'){
        if(previousVoteType === 'upvote'){
          newVoteCount -= 1;
          newVoteType = null;
        }else if(previousVoteType === 'downvote'){
          newVoteCount += 2;
        }else{
          newVoteCount += 1;
        }
      }else if(voteType === 'downvote'){
        if(previousVoteType === 'downvote'){
          newVoteCount += 1;
          newVoteType = null;
        }else if(previousVoteType === 'upvote'){
          newVoteCount -= 2;
        }else{
          newVoteCount -= 1;
        }
      };
  
      return {newVoteType, newVoteCount};
  
    }

  const loadMore = useCallback(async () => {
    if (!nextUrl || loadingRef.current) return;
  
    setPostsLoading(true);
    loadingRef.current = true;
    const response = await fetchWithAuth(nextUrl);
  
    if (!response?.ok) {
      console.error("Something went wrong while trying to fetch more posts.");
    } else {
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.results]);
      setNextUrl(data.next);
      setPostsLoading(false);
      loadingRef.current = false;
    }
  }, [nextUrl]);

  useEffect(() => {
    if(observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        loadMore();
      }
    })

    if(loaderRef.current){
      observer.current.observe(loaderRef.current);
    }

    return () => observer.current?.disconnect();

  }, [postsLoading, nextUrl, loadMore])

  if (isLoading) {
    return (
      <div>
        <Skeleton height={140} count={6} style={{ }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1">
      {posts && posts.length > 0 ? (
        <>
          {posts.map((post, idx) => (
            <PostItem
              key={idx}
              post={post}
              onVote={handleVote}
            />
          ))}
          <div>{nextUrl && (
            <div ref={loaderRef} className="flex justify-center iteme-center p-5">
              <div className="animate-pulse">
                <img src={redditIcon} alt="" className="w-8 h-8"/>
              </div>
            </div>
          )}
          </div>
        </>
      ) : (
        isOwner
          ? <h1 className="px-4 py-3">You haven't made any posts yet. Find/create a community and make a post :)</h1>
          : <h1 className="px-4 py-3">This user hasn't made any posts yet.</h1>
      )}
    </div>
  )
}

export default UserPosts;