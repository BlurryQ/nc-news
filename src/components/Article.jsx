import "../styles/article.css"
import { useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import { format } from "date-fns";
import getArticles from "../APIs/getArticleAPI"


export default function Article() {
    const [article, setArticle] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

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
    </div>
}