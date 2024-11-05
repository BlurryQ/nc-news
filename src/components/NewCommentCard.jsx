import "../styles/comments.css"
import { useContext, useEffect, useState } from 'react'
import { UserContext } from "../contexts/Contexts"
import postArticles from "../APIs/postArticlesAPI";
import CommentCard from "./CommentCard";

export default function NewCommentCard({ comments, article_id, setComments }) {
    const [hasPostingCommentError, setHasPostingCommentError] = useState(false)
    const [commentBody, setCommentBody] = useState("")
    const { user } = useContext(UserContext)

    let comment = {}

    const commentHandler = (e) => {
        setHasPostingCommentError(false)
        const buttonType = e.target.type
        if (buttonType === "submit") {
            e.preventDefault()
            e.target.disabled = true
            if (!commentBody) {
                console.log(commentBody, "error L19")
                e.target.disabled = false
                return setHasPostingCommentError("No message found, please try again")
            }
            postArticles(`${article_id}/comment`,
                { username: user.username, body: commentBody }
            )
                .then((data) => {
                    e.target.disabled = false
                    setHasPostingCommentError(false)
                    comments.unshift(data.comment)
                    console.table(comments)
                    console.log(data.comment)
                    setCommentBody("")
                    comment = data.comment
                })
                .catch(err => {
                    e.target.disabled = false
                    console.error(err);
                    setHasPostingCommentError("Error posting comment, please try again later")
                })
        }
        else setCommentBody(e.target.value)
    }

    return <>
        {user.username ? <form className="comment-form" action="patch">
            <label htmlFor="comment-body">Comment:</label>
            {hasPostingCommentError ? <span className="comment-error">{hasPostingCommentError}</span> : null}
            <textarea onChange={commentHandler} name="comment" cols="50" rows="5" value={commentBody} />
            <button onClick={commentHandler}>Post</button>
        </form> : <p className="comment-form">Sign in to post a comment</p>}

        {/* <CommentCard comment={comment} comments={comments} setComments={setComments} /> */}
    </>
}