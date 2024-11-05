import "../styles/articles.css"
import { useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import getArticles from "../APIs/getArticleAPI"
import { useSearchParams } from "react-router-dom"
import ArticleCard from "./ArticleCards"
import Filters from "./Filters"

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
        if (topic_slug) searchTerm += `topic=${topic_slug}&`
        if (sortFilter) searchTerm += `sort_by=${sortFilter}&`
        if (orderFilter) searchTerm += `order=${orderFilter}&`
        getArticles(searchTerm)
            .then((data) => {
                setIsLoading(false)
                setHasError(false)
                setArticles(data.articles)
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false)
                setHasError(true)
            })
    }, [sortFilter, orderFilter])

    if (isLoading) return <RingLoader
        color="red"
        size={320}
        aria-label="Loading Spinner"
        cssOverride={{ margin: "auto" }}
    />

    if (hasError) return <section className="page-not-found"></section>

    return <>
        <h2 className="page-title">Currently displaying all recent {topic_slug ? topic_slug : null} articles</h2>

        <Filters sortFilter={sortFilter} setSortFilter={setSortFilter} orderFilter={orderFilter} setOrderFilter={setOrderFilter} />

        <article className="articles">
            {articles.map(article => {
                return <ArticleCard key={article.article_id} article={article} />
            })}
        </article >
    </>
}