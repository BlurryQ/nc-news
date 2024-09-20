import "../styles/articles.css"
import { useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import getArticles from "../APIs/getArticleAPI"
import { useSearchParams } from "react-router-dom"

export default function Articles() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [sortFilter, setSortFilter] = useState("created_at")
    const [orderFilter, setOrderFilter] = useState("desc")
    const [searchParams] = useSearchParams();
    const topic_slug = searchParams.get("topic");

    useEffect(() => {
        setIsLoading(true)
        setHasError(false)
        let searchTerm = "?"
        if(topic_slug) searchTerm += `topic=${topic_slug}&`
        if(sortFilter) searchTerm += `sort_by=${sortFilter}&`
        if(orderFilter) searchTerm += `order=${orderFilter}&`
        getArticles(searchTerm)
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
    },[sortFilter, orderFilter])


    const filterHandler = (e) => {
        const filter = e.target.value
        if(filter === "asc" || filter === "desc") return setOrderFilter(filter)
        setSortFilter(filter)
    }
      
    if(isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
    />

    if(hasError) return <section className="page-not-found"></section>
      
    const optionNames = {
        created_at: "Created at",
        votes: "Votes",
        comment_count: "Comments",
        asc: sortFilter === "created_at" ? "Oldest first" : "Smallest first",
        desc: sortFilter === "created_at" ? "Most recent first" : "Largest first",
    }

    return <>
    <h2 className="page-title">Currently displaying all recent {topic_slug ? topic_slug : null} articles</h2>
    
    <div className="filters">
        <div className="sort-filter">
            <label  htmlFor="sort">Sort by:</label>
                <select onClick={filterHandler} id="sort">
                <option value={sortFilter}>Current: {optionNames[sortFilter]}</option>
                <option value="created_at">Created at</option>
                <option value="votes">Votes</option>
                <option value="comment_count">Comments</option>
                </select>
        </div>
        <div className="order-filter">
            <label htmlFor="order">Ordered by:</label>
                <select onClick={filterHandler} id="order">
                <option value={orderFilter}>Current: {optionNames[orderFilter]}</option>
                <option value="desc">{sortFilter === "created_at" ? "Most recent first" : "Largest first"}</option>
                <option value="asc">{sortFilter === "created_at" ? "Oldest first" : "Smallest first"}</option>
                </select>
        </div>
    </div>

    <article className="articles">
        {articles.map(article => {
            return <a href={`/articles/${article.article_id}`} className="article-card" key={article.article_id}>
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