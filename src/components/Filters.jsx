import "../styles/articles.css"
import { useEffect, useState } from 'react'
import { RingLoader } from "react-spinners"
import getArticles from "../APIs/getArticleAPI"
import { useSearchParams } from "react-router-dom"
import ArticleCard from "./ArticleCards"

export default function Filters({ sortFilter, setSortFilter, orderFilter, setOrderFilter }) {

    const filterHandler = (e) => {
        const filter = e.target.value
        if (filter === "asc" || filter === "desc") return setOrderFilter(filter)
        setSortFilter(filter)
    }

    const optionNames = {
        created_at: "Created at",
        votes: "Votes",
        comment_count: "Comments",
        asc: sortFilter === "created_at" ? "Oldest first" : "Smallest first",
        desc: sortFilter === "created_at" ? "Most recent first" : "Largest first",
    }

    return <div className="filters">
        <div className="sort-filter">
            <label htmlFor="sort">Sort by:</label>
            <select onChange={filterHandler} id="sort">
                <option value={sortFilter}>Current: {optionNames[sortFilter]}</option>
                <option value="created_at">Created at</option>
                <option value="votes">Votes</option>
                <option value="comment_count">Comments</option>
            </select>
        </div>
        <div className="order-filter">
            <label htmlFor="order">Ordered by:</label>
            <select onChange={filterHandler} id="order">
                <option value={orderFilter}>Current: {optionNames[orderFilter]}</option>
                <option value="desc">{sortFilter === "created_at" ? "Most recent first" : "Largest first"}</option>
                <option value="asc">{sortFilter === "created_at" ? "Oldest first" : "Smallest first"}</option>
            </select>
        </div>
    </div>
}