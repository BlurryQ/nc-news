import "../styles/articles.css"
import { useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import getArticles from "../APIs/getArticleAPI"

export default function Articles() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setHasError(false)
        getArticles("?sort_by=created_at")
        .then((data)=>{
            setIsLoading(false)
            setHasError(false)
            setArticles(data.articles)
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false)
            setHasError(true)
        })
    },[])
      
    if(isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
    />

    if(hasError) return <section className="page-not-found"></section>
      
    const articleHandler = (e) => {
        let data = ""
        if(e.target.children.length === 4) data = e.target.attributes[1].nodeValue
        else data = e.target.parentElement.attributes[1].nodeValue
    }

    return <>
    <h2 className="page-title">Currently displaying all recent articles</h2>
    <article className="articles">
        {articles.map(article => {
            return <a href={`/articles/${article.article_id}`} className="article-card" onClick={articleHandler} key={article.article_id}>
                <h3 className="article-title">{article.title}</h3>
                <img src={article.article_img_url} alt={article.title} />
                <p className="article-author">~ {article.author}</p>
                <div className="likes-comments-box">
                    {article.votes >= 0 
                        ? <button className="like-button">{article.votes}</button> 
                        : <button className="dislike-button"></button>}
                    <span className="comment-tally">{article.comment_count}</span>
                </div>
            </a>
        })}
    </article>
    </>
}