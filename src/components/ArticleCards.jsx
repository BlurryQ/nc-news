import "../styles/articles.css"

export default function ArticleCard({ article }) {

    return <a href={`/articles/${article.article_id}`} className="article-card">
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
}