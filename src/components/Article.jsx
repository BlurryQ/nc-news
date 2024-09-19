import "../styles/article.css"
import { useContext, useEffect, useState } from 'react'
import { GridLoader, RingLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import { format } from "date-fns";
import { UserContext } from "../contexts/Contexts"
import getArticles from "../APIs/getArticleAPI"
import postArticles from "../APIs/postArticlesAPI";
import patchArticles from "../APIs/patchArticlesAPI";


export default function Article() {
    const [article, setArticle] = useState([])
    const [articleVotes, setArticleVotes] = useState(0)
    const [articleVotedOn, setArticleVotedOn] = useState(false)
    const [articleVoteError, setArticleVoteError] = useState(false)
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isLoadingComments, setIsLoadingComments] = useState(true)
    const [hasCommentsErrored, setHasCommentsErrored] = useState(false)
    const [hasPostingCommentError, setHasPostingCommentError] = useState(false)
    const [commentBody, setCommentBody] = useState("")
    const {user} = useContext(UserContext)
    const {article_id} = useParams()

    useEffect(() => {
        setIsLoading(true)
        setHasError(false)
        getArticles(article_id)
        .then((data)=>{
            setIsLoading(false)
            setHasError(false)
            setArticle(data.article)
            setArticleVotes(data.article.votes)
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false)
            setHasError(true)
        })
    }, [])

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
    },[])

    if(isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
        cssOverride={{margin: "auto"}}
    />

    if(hasError) return <section className="page-not-found"></section>

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

    const articleVoteAdjustment = (buttonPressed, alreadyVoted) => {
        let adjust = 1
        if(buttonPressed === "dislike-button") adjust = -1;
        if(alreadyVoted) {
            adjust = -1
            if(buttonPressed === "dislike-button") adjust = 1;
        }
        if(articleVotedOn && buttonPressed !== articleVotedOn) {
            const oppositeButton = document.getElementById(articleVotedOn)
            oppositeButton.classList.remove("voted")
            adjust = adjust === 1 ? 2 : -2
        }
        return adjust
    }

    const likeHandler = (e) => {
        setArticleVoteError(false)
        if(!user.username) {
            setArticleVoteError("Please sign in to vote")
            return
        }
        const buttonPressed = e.target.classList[0]
        const alreadyVoted = e.target.classList[1]
        const adjust = articleVoteAdjustment(buttonPressed, alreadyVoted)
        setArticleVotes(articleVotes + adjust)
        patchArticles(`${article_id}`,{ inc_votes: adjust })
        .then(() => {
            setArticleVoteError(false)
            if(alreadyVoted) {
                e.target.classList.remove("voted")
                setArticleVotedOn(false)
            }
            else {
                e.target.classList.add("voted")
                setArticleVotedOn(buttonPressed)
            }
        })
        .catch(err => {
            console.error(err);
            setArticleVoteError("Error has occured, please try again later")
            setArticleVotes(articleVotes)
        })
    }


    return <div className="article-container">
        <h2 className="page-title">{article.title}</h2>
        <img className="article-img" src={article.article_img_url} alt={article.title} />
        <div className="article-details">
            <p>{article.topic}</p>
            <p>{format((article.created_at), "EEEE do MMMM yyyy")}</p>
            <p className="article-author">~ {article.author}</p>
        </div>
            <div className="likes-comments">
                <button onClick={likeHandler} id="like-button" className="like-button">{articleVotes}</button>
                <a href="#comments" className="comment-tally">{article.comment_count}</a>
                <button onClick={likeHandler} id="dislike-button" className="dislike-button"></button>
            </div>
            {articleVoteError ? <p className="article-vote-error">{articleVoteError}</p> : null}
        <section>{article.body}</section>

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
                    <p className="comment-body">"{comment.body}"</p>
                    <div className="comment-details">
                        <p className="article-author">~ {comment.author}</p>
                        <button className="like-button">{comment.votes >= 0 
                                    ? comment.votes 
                                    : comment.votes}</button>
                        <button className="dislike-button"></button>
                        <p>{format((comment.created_at), "HH:mm, dd MMM yy")}</p>
                    </div>
                </div>
            })}
        </section>
    </div>
}