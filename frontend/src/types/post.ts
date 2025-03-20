export type Post = {
    id: number,
    title: string,
    community: string,
    thumbnail: string,
    vote_count: number,
    comment_count: number,
    created_at: string,
    user_vote: string | null
}