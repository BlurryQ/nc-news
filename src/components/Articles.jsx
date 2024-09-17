import "../styles/articles.css"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { RingLoader } from "react-spinners"


export default function Articles() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setHasError(false)
        axios.get("https://nc-news-lbn1.onrender.com/api/articles?sort_by=created_at")
        .then(({data})=>{
            setIsLoading(false)
            setHasError(false)
            console.log(data.articles);
            setArticles(data.articles)
        })
        .catch(err => {
            console.error(err);
            setHasError(true)
            setIsLoading(false)
        })
    },[])
      
    if(isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
      />

      if(hasError) return <section className="page-not-found"></section>
      


    return <>
    <h2 className="page-title">Currently displaying all recent articles</h2>
    <article className="articles">
        {articles.map(article => {
            return <div className="article-card" key={article.article_id}>
                <h3 className="article-title">{article.title}</h3>
                <img src={article.article_img_url} alt={article.title} />
                <p className="article-author">~ {article.author}</p>
                <div className="likes-comments-box">
                    <button className="like-button">{article.votes}</button>
                    <button className="comment-button">{article.comment_count}</button>
                </div>
            </div>
        })}
    </article>
    </>
}