export interface Comment {
    body: string,
    created_at: string,
    id: number,
    owner: number,
    parent: null | number,
    user_vote: string,
    post: number,
    replies: Comment[],
    vote_count: number
}