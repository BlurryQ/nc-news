import "../styles/comments.css"
import { useContext, useEffect, useRef, useState } from 'react'
import { GridLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import { format } from "date-fns";
import { UserContext } from "../contexts/Contexts"
import getArticles from "../APIs/getArticleAPI"
import postArticles from "../APIs/postArticlesAPI";
import deleteArticles from "../APIs/deleteComment";
import patchComment from "../APIs/patchCommentAPI";
import voteAdjustment from "../utils/voteAdjustment"

export default function Comments() {
    const [comments, setComments] = useState([])
    const [isLoadingComments, setIsLoadingComments] = useState(true)
    const [hasCommentsErrored, setHasCommentsErrored] = useState(false)
    const [hasPostingCommentError, setHasPostingCommentError] = useState(false)
    const [commentBody, setCommentBody] = useState("")
    const [checkDeleteComment, setCheckDeleteComment] = useState(false)
    const [deleteComment, setDeleteComment] = useState(false)
    const [deleteCommentError, setDeleteCommentError] = useState(false)
    const {user} = useContext(UserContext)
    const {article_id} = useParams()

    useEffect(() => {
        setIsLoadingComments(true)
        setHasCommentsErrored(false)
        getArticles(`${article_id}/comments`)
        .then((data) => {
            setIsLoadingComments(false)
            setHasCommentsErrored(false)
            setComments(data.comments)
        })
        .catch(err => {
            console.error(err);
            setIsLoadingComments(false)
            setHasCommentsErrored(true)
        })
    },[user])

    const commentHandler = (e) => {
        setHasPostingCommentError(false)
        const buttonType = e.target.type
        if(buttonType === "submit") {
            e.preventDefault()
            e.target.disabled = true
            if(!commentBody){
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
                setCommentBody("")
            })
            .catch(err => {
                e.target.disabled = false
                console.error(err);
                setHasPostingCommentError("Error posting comment, please try again later")
            })
        }
        else setCommentBody(e.target.value)
    }

    let commentID = useRef(0)

    const selectDeleteComment = (e) => {
        commentID.current = e.target.value
        setCheckDeleteComment(!checkDeleteComment)
        setDeleteCommentError(false)
    }

    const confirmDeletion = (e) => {
        const result = e.target.textContent
        if(result === "no") return setCheckDeleteComment(false)
        e.preventDefault()
        setDeleteComment(true)
    }

    useEffect(() => {
        setDeleteCommentError(false)
        if(!commentID.current || !deleteComment) return
        deleteArticles(commentID.current)
        .then(() => {
            setDeleteComment(false)
            setDeleteCommentError(false)
            setCheckDeleteComment(false)
            const updatedComments = comments.filter(comment => Number(commentID.current) !== comment.comment_id)
            updatedComments.unshift(  {
                body: "Comment successfully deleted",
                votes: 0,
                author: "admin",
                article_id: commentID.current,
                created_at: Date.now(),
              })
            setComments(updatedComments)
            commentID.current = 0
        })
        .catch((err =>{
            console.log(err);
            setDeleteComment("Error deleting comment, please try again later")
            setDeleteCommentError(true)
            setCheckDeleteComment(false)
        }))
    },[deleteComment])



    const [commentVotes, setCommentVotes] = useState(0)
    const [commentVotedOn, setArticleVotedOn] = useState(false)
    const [commentVoteError, setCommentVoteError] = useState(false)
    
    //setCommentVotes//need to get votes for comment 

    /* can we import the below func? */
    const setVoteClass = (button, buttonPressed, alreadyVoted) => {
        if(alreadyVoted) {
            button.classList.remove("voted")
            setArticleVotedOn(false)
        }
        else {
            button.classList.add("voted")
            setArticleVotedOn(buttonPressed)
        }
    }

    console.log(commentID.current);

    const likeHandler = (e) => {
        const IDandVotes = e.target.value 
        let [currentCommentID, commentVotes] = IDandVotes.split(" ")
        currentCommentID = Number(currentCommentID)
        commentVotes = Number(commentVotes)
        commentID.current = currentCommentID
        setCommentVotes(commentVotes)
        setCommentVoteError(false)
        if(!user.username) {
            setCommentVoteError("Please sign in to vote")
            return
        }
        const button = e.target
        const buttonPressed = button.classList[0]
        const alreadyVoted = button.classList[1]
        setVoteClass(button, buttonPressed, alreadyVoted)
        const adjust = voteAdjustment(buttonPressed, alreadyVoted, commentVotedOn)
        setCommentVotes(commentVotes + adjust)
        patchComment(`${commentID.current}`,{ inc_votes: adjust })
        .then(() => {
            setCommentVoteError(false)
        })
        .catch(err => {
            setVoteClass(button, buttonPressed, alreadyVoted)
            const voteButtons = document.getElementsByName(`comment-vote-${commentID.current}`)
            voteButtons.forEach(button => button.classList.remove("voted"))
            console.error(err);
            setCommentVoteError("Error has occured, please try again later")
            setCommentVotes(commentVotes)
        })
    }


    return <>
        {hasCommentsErrored ? <p>Error loading comments...</p> : null}

        {isLoadingComments ? <GridLoader
            color="red"
            size={20}
            margin={20}
            cssOverride={{margin: "auto"}}
            aria-label="Loading Spinner"/> : null}

        <section id="comments" className="comments-section">
            {user.username ? <form className="comment-form" action="patch">
                <label htmlFor="comment-body">Comment:</label>
                {hasPostingCommentError ? <span className="comment-error">{hasPostingCommentError}</span> : null}
                <textarea onChange={commentHandler} name="comment" cols="50" rows="5" value={commentBody}/>
                <button onClick={commentHandler}>Post</button>
            </form> : <p className="comment-form">Sign in to post a comment</p>}

            {comments < 1 ? <div className="comment-container">
                    <p className="comment-body">"No comments yet. Be the first to share your thoughts!"</p>
                </div> 
                : null} 
            {comments.map(comment=>{
                return <div key={`${comment.comment_id}`} className="comment-container">
                    <p className={`comment-body ${comment.author === "admin" ? "successful-deletion" : null}` }>"{comment.body}"</p>
                    <div className="comment-details">
                        <p className={`article-author ${comment.author === "admin" ? "successful-deletion" : null}` }>~ {comment.author}</p>
                        
                        {user.username === comment.author ? <>
                            {checkDeleteComment && comment.comment_id === Number(commentID.current) ? 
                            <>
                                <div className="confirm">
                                    <button onClick={confirmDeletion} className="yes">yes</button>
                                    <button onClick={confirmDeletion} className="no">no</button>
                                </div>
                                <div></div>
                            </>
                            : <>
                                <button onClick={selectDeleteComment} value={comment.comment_id} className="delete-comment"></button> 
                                <div></div>
                            </>}
                        </>
                        : comment.author === "admin" ? <>
                        <div></div>
                        <div></div>
                        </> :
                            <>
                            {/* need a check for if commentID.currrent === comment pressed then do the like */}
                            <button onClick={likeHandler} value={`${comment.comment_id} ${comment.votes}`} name="vote" className="like-button">{comment.votes}</button>
                            <button onClick={likeHandler} value={`${comment.comment_id} ${comment.votes}`} name="vote" className="dislike-button"></button>
                            {commentVoteError ? <p className="comment-vote-error">{commentVoteError}</p> : null}
                        </>
                        }
                        <p>{format((comment.created_at), "HH:mm, dd MMM yy")}</p>
                        {checkDeleteComment && comment.comment_id === Number(commentID.current) ? <p className="confirm-comment-delete">Are you sure you want to delete this?</p> : null}
                        {deleteCommentError && comment.comment_id === Number(commentID.current) ? <p className="confirm-comment-delete">Comment failed to be delete, try again later</p> : null}
                    </div>
                </div>
            })}
        </section>
    </>
}