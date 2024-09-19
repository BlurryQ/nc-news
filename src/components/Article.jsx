import "../styles/article.css"
import { useEffect, useState } from 'react'
import { RingLoader, GridLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import { format } from "date-fns";
import getArticles from "../APIs/getArticleAPI"


export default function Article() {
    const [article, setArticle] = useState([])
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isLoadingComments, setIsLoadingComments] = useState(true)
    const [hasCommentsErrored, setHasCommentsErrored] = useState(false)

    const {article_id} = useParams()

    useEffect(() => {
        setIsLoading(true)
        setHasError(false)
        getArticles(`${article_id}`)
        .then((data)=>{
            setIsLoading(false)
            setHasError(false)
            setArticle(data.article)
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

return <div className="article-container">
        <h2 className="page-title">{article.title}</h2>
        <img className="article-img" src={article.article_img_url} alt={article.title} />
        <div className="article-details">
            <p>{article.topic}</p>
            <p>{format((article.created_at), "EEEE do MMMM yyyy")}</p>
            <p className="article-author">~ {article.author}</p>
        </div>
            <div className="likes-comments">
                <button className="like-button">{article.votes}</button>
                <a href="#comments" className="comment-tally">{article.comment_count}</a>
                <button className="dislike-button"></button>
            </div>
        <section>{article.body}</section>

        {hasCommentsErrored ? <p>Error loading comments...</p> : null}

        {isLoadingComments ? <GridLoader
            color="red"
            size={20}
            margin={20}
            cssOverride={{margin: "auto"}}
            aria-label="Loading Spinner"/> : null}

        <section id="comments" className="comments-section">
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