import "../styles/article.css"
import { useContext, useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import { format } from "date-fns";
import { UserContext } from "../contexts/Contexts"
import getArticles from "../APIs/getArticleAPI"
import patchArticles from "../APIs/patchArticlesAPI";
import Comments from "./Comments";


export default function Article() {
    const [article, setArticle] = useState([])
    const [articleVotes, setArticleVotes] = useState(0)
    const [articleVotedOn, setArticleVotedOn] = useState(false)
    const [articleVoteError, setArticleVoteError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
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

    if(isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
        cssOverride={{margin: "auto"}}
    />

    if(hasError) return <section className="page-not-found"></section>

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

    const likeHandler = (e) => {
        setArticleVoteError(false)
        if(!user.username) {
            setArticleVoteError("Please sign in to vote")
            return
        }
        const button = e.target
        const buttonPressed = button.classList[0]
        const alreadyVoted = button.classList[1]
        setVoteClass(button, buttonPressed, alreadyVoted)
        const adjust = articleVoteAdjustment(buttonPressed, alreadyVoted)
        setArticleVotes(articleVotes + adjust)
        patchArticles(`--${article_id}`,{ inc_votes: adjust })
        .then(() => {
            setArticleVoteError(false)
        })
        .catch(err => {
            setVoteClass(button, buttonPressed, alreadyVoted)
            const voteButtons = document.getElementsByName("vote")
            voteButtons.forEach(button => button.classList.remove("voted"))
            console.error(err);
            setArticleVoteError("Error has occured, please try again later")
            setArticleVotes(articleVotes)

        })
    }


    return <div className="article-container">
        <h2 className="page-title">{article.title}</h2>
        <img className="article-img" src={article.article_img_url} alt={article.title} />
        <div className="article-details">
            <p>Topic: {article.topic}</p>
            <p>{format((article.created_at), "EEEE do MMMM yyyy")}</p>
            <p className="article-author">~ {article.author}</p>
        </div>
            <div className="likes-comments">
                <button onClick={likeHandler} name="vote" id="like-button" className="like-button">{articleVotes}</button>
                <a href="#comments" className="comment-tally">{article.comment_count}</a>
                <button onClick={likeHandler} name="vote" id="dislike-button" className="dislike-button"></button>
            </div>
            {articleVoteError ? <p className="article-vote-error">{articleVoteError}</p> : null}
        <section>{article.body}</section>

        <Comments />
    </div>
}