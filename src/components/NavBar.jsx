import '../styles/NavBar.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function NavBar() {
    const [topics, setTopics] = useState([])

    useEffect(()=>{
        axios.get("https://nc-news-lbn1.onrender.com/api/topics")
        .then(({data}) => {
            setTopics(data.topics)
        })
    }, [])

    return <nav className='nav-bar'>
        {topics.map(topic => <button key={topic.slug}>{topic.description}</button>)}
    </nav>
}