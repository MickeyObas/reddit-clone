import { CommentType } from "./comment"

export type Post = {
    id: number,
    title: string,
    body: string | null,
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
    comments: CommentType[],
    comment_count: number,
    created_at: string,
    user_vote: string | null,
    is_member: boolean,
    media: string[]
}

export type PostDisplay = {
    id: number,
    title: string,
    body: string | null,
    community: string,
    thumbnail: string,
    vote_count: number,
    comment_count: number,
    created_at: string,
    user_vote: string | null,
    is_member: boolean,
    owner: {
        id: number,
        email: string,
        username: string,
        avatar: string | null
    },
}

export type PostFeed = {
    id: number,
    title: string,
    body: string | null,
    community: {
        id: number,
        avatar: string,
        name: string
    },
    thumbnail: string | null,
    vote_count: number,
    comment_count: number,
    created_at: string,
    user_vote: string | null,
    is_member: boolean,
    type: string
}

export type RecentPostDisplay = {
    id: number,
    post_id: number,
    title: string,
    thumbnail: string | null,
    community_name: string,
    community_id: number,
    community_avatar: string | null,
    comment_count: number,
    vote_count: number
}