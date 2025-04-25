import { User } from "./user"

export interface CommentType {
    body: string,
    created_at: string,
    id: number,
    owner: {
        id: number,
        username: string,
        email: string,
        avatar: string | null
    },
    parent?: null | number,
    user_vote: string,
    post: number,
    replies: CommentType[],
    vote_count: number
}

export interface CommentFeed {
    id: number,
    parent: {
        owner: User,
    },
    post: {
        id: number,
        title: string,
        owner: User,
        community: {
            id: number,
            avatar: string,
            name: string
        }
    },
    body: string,
    created_at: string,
    vote_count: number,
    user_vote: string | null,
    type: "comment" | "post"
}