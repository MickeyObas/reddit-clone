import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils';
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { PostFeed } from '../types/post';
import PostItem from '../components/ui/PostItem';
import CommentItem from '../components/ui/CommentItem';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { CommentFeed } from '../types/comment';
import { Profile } from '../types/profile';
import Skeleton from 'react-loading-skeleton';


const UserProfile = () => {
  const [feed, setFeed] = useState<(PostFeed | CommentFeed)[]>([]);
  const { user } = useAuth();
  const { userId } = useParams();
  const profile: {profile: Profile} = useOutletContext();
  const [searchParams] = useSearchParams();
  const sortFilter = searchParams.get('sort') || 'new';
  const isOwner = user?.id == userId;
  const [isLoading, setIsLoading] = useState(true);

  console.log(profile);


  useEffect(() => {
    const fetchOverview = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/overview/?sort=${sortFilter}`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          console.log(data);
          setFeed(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, [userId, sortFilter])

  const handlePostVote = async (postId: number, voteType: "upvote" | "downvote" | null) => {
    const dir = voteType === 'upvote' ? 1 : -1;
    const updatedFeedItems = [...feed];
    const post = updatedFeedItems.find((p) => p.id === postId);

    if(!post) return;

    const previousVoteType = post?.user_vote;
    const previousVoteCount = post?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticVoteUpdate(post as PostFeed, voteType);
    post.user_vote = newVoteType;
    post.vote_count = newVoteCount;
    setFeed(updatedFeedItems);

    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${post.id}&dir=${dir}&obj=p`, {
        method: 'POST'
      });

      if(!response?.ok){
        post.user_vote = previousVoteType;
        post.vote_count = previousVoteCount;
        setFeed([...updatedFeedItems]);
        console.log("Something went wrong during voting.");
      }else{
        const data = await response?.json();
        console.log(data);
        post.vote_count = data.count;
        setFeed([...updatedFeedItems]);
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

  const getOptimisticCommentVoteUpdate = (comment: CommentFeed, voteType: "upvote" | "downvote" | null) => {
    const previousVoteType = comment.user_vote;
    let newVoteType = voteType;
    let newVoteCount = comment.vote_count;

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

  const handleCommentVote = async (commentId: number, type: "upvote" | "downvote" | null) => {
    const dir = type === "upvote" ? 1 : -1;
    const updatedFeedItems = [...feed];
    const comment = updatedFeedItems.find((c) => c.id === commentId);
    
    if(!comment) return;

    const previousVoteType = comment?.user_vote;
    const previousVoteCount = comment?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticCommentVoteUpdate(comment as CommentFeed, type);
    comment.user_vote = newVoteType;
    comment.vote_count = newVoteCount;
    setFeed(updatedFeedItems);

    const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
      method: 'POST'
    });

    if(!response?.ok){
      comment.user_vote = previousVoteType;
      comment.vote_count = previousVoteCount;
      setFeed([...updatedFeedItems]);
      console.log("Something went wrong during voting");
    }else{
      const data = await response?.json();
      console.log(data);
      comment.vote_count = data.count;
      setFeed([...updatedFeedItems]);
    }

  }

  if(isLoading) {
      return (
        <div>
          <Skeleton height={140} count={3} style={{ }} />
        </div>
      );
    }

  return (
    <div className="grid grid-cols-1">
      {feed && feed.length > 0 ? feed.map((feedItem, idx) => {
        if(feedItem.type === 'post'){
          return (
            <PostItem 
              key={idx} 
              post={feedItem as PostFeed} 
              onVote={handlePostVote}
              />
            )
        }else if(feedItem.type === 'comment'){
          return (
            <CommentItem 
              key={idx} 
              comment={feedItem as CommentFeed} 
              onVote={handleCommentVote}
              profile={profile}
              />
            )
        }
      }) : (
        isOwner 
        ? <h1 className="px-4 py-3">You haven't really been active here yet. Make a post or comment :)</h1>
        : <h1 className="px-4 py-3">This user hasn't really been active here yet.</h1>
      )}
    </div>
  )
}

export default UserProfile;