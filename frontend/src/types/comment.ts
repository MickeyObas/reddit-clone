export interface CommentType {
    body: string,
    created_at: string,
    id: number,
    owner: {
        id: number,
        username: string,
        email: string
    },
    parent?: null | number,
    user_vote: string,
    post: number,
    replies: CommentType[],
    vote_count: number
}