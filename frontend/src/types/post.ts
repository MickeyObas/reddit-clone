import { Comment } from "./comment"

export type Post = {
    id: number,
    title: string,
    body: string,
    community: {
        id: number,
        name: string,
        avatar: string
    },
    owner: {
        id: number,
        email: string,
        username: string
    },
    thumbnail: string,
    vote_count: number,
    comments: Comment[],
    comment_count: number,
    created_at: string,
    user_vote: string | null
}