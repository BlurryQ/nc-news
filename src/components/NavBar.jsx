import '../styles/navBar.css'
import { useContext } from 'react'
import { ThemeContext } from "../contexts/Contexts"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BarLoader } from "react-spinners"

export default function NavBar() {
    const { theme, setTheme } = useContext(ThemeContext)
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const burgerHandler = (e) => {
        const classes = e.target.classList;
        const navBar = document.getElementById("nav-bar")
        const themeToggle = document.getElementById("theme-toggle")
        const userMessage = document.getElementById("user-message")
        if(classes.contains("open")) {
            e.target.classList.remove("open")
            themeToggle.classList.remove("open")
            navBar.classList.remove("open")
            userMessage.classList.remove("open")
        } else {
            e.target.classList.add("open")
            themeToggle.classList.add("open")
            navBar.classList.add("open")
            userMessage.classList.add("open")
        }
    }

    useEffect(()=>{
        setIsLoading(true)
        setHasError(false)
        axios.get("https://nc-news-lbn1.onrender.com/api/topics")
        .then(({data}) => {
            setIsLoading(false)
            setHasError(false)
            setTopics(data.topics) //limit to 10 most recent
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false)
            setHasError(true)
        })
    }, [])

    const themeHandler = () => {
        setTheme(theme === "dark" ? "light" : "dark")
        root.className = theme
    }

    if(isLoading) return <BarLoader
        color="red"
        aria-label="Loading Spinner"
        cssOverride={{margin: "auto",
                    width: "90%"
        }}
      />

    if(hasError) return <span>Error loading topics...</span>

    return <>
        <button className='burger-menu' onClick={burgerHandler}></button>
        <button id="theme-toggle" className="theme-toggle" onClick={themeHandler}></button>
        <nav id='nav-bar'>
            {topics.map(topic => <a href={`/articles?topic=${topic.slug}`} key={topic.slug}>{topic.description}</a>)}
        </nav>
    </>
}