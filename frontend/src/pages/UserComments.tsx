import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";
import CommentItem from "../components/ui/CommentItem";
import { CommentFeed } from "../types/comment";
import { Profile } from "../types/profile";
import Skeleton from "react-loading-skeleton";

const UserComments = () => {
  const [comments, setComments] = useState<CommentFeed[]>([]);
  const { user } = useAuth()
  const { userId } = useParams();
  const profile: {profile: Profile} = useOutletContext();
  const [searchParams] = useSearchParams();
  const sortFilter = searchParams.get('sort') || 'new';
  const isOwner = user?.id == userId;
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchComments = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/comments/?sort=${sortFilter}`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          console.log(data);
          setComments(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [userId, sortFilter])

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
      const updatedComments = [...comments];
      const comment = updatedComments.find((c) => c.id === commentId);
       
      if(!comment) return;
  
      const previousVoteType = comment?.user_vote;
      const previousVoteCount = comment?.vote_count;
  
      const { newVoteType, newVoteCount } = getOptimisticCommentVoteUpdate(comment as CommentFeed, type);
      comment.user_vote = newVoteType;
      comment.vote_count = newVoteCount;
      setComments(updatedComments);
  
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
        method: 'POST'
      });
  
      if(!response?.ok){
        comment.user_vote = previousVoteType;
        comment.vote_count = previousVoteCount;
        setComments([...updatedComments]);
        console.log("Something went wrong during voting");
      }else{
        const data = await response?.json();
        console.log(data);
        comment.vote_count = data.count;
        setComments([...updatedComments]);
      }
  
    }

  if (isLoading) {
    return (
      <div>
        <Skeleton height={140} count={6} style={{ }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1">
      {comments && comments.length > 0 ? comments.map((comment, idx) => (
        <CommentItem 
          key={idx}
          comment={comment}
          profile={profile}
          onVote={handleCommentVote}
        />
      )): (
        isOwner
        ? <h1 className="px-4 py-3">You haven't made any comments yet. Find an interesting post and make a comment :)</h1>
        : <h1 className="px-4 py-3">This user hasn't made any comment yet.</h1>
      )}
    </div>
  )

}

export default UserComments;