import "../styles/articles.css"
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Articles() {
    const [articles, setArticles] = useState([])
    const [pageName, setPageName] = useState(["Articles"])

    useEffect(() => {
        axios.get("https://nc-news-lbn1.onrender.com/api/articles")
        .then(({data})=>{
            const [newPageName] = Object.keys(data);
            setPageName(newPageName);
            setArticles(data.articles)
        })
    },[])
    
    return <>
    <h2 className="page-title">Currently displaying {pageName}</h2>
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