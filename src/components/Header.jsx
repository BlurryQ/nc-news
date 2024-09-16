import '../styles/header.css'
import {ThemeContext, UserContext } from "../contexts/Contexts"
import { useContext } from 'react'

export default function Header() {
    const {theme, setTheme } = useContext(ThemeContext)
    const {user } = useContext(UserContext)

    const root = document.documentElement
    root.className = theme
    

    const themeHandler = () => {
        setTheme(theme === "dark" ? "light" : "dark")
        root.className = theme
    }

    return <header className="header">
            <h1 className="site-name"><span className="logo">/\</span> NC News</h1>
            <span className="header-controls">
                <div className="user-message">
                    <p className="welcome-message">Welcome back</p>
                    <p className="username">{user}</p>
                </div>
                <button className="theme-toggle" onClick={themeHandler}></button>
            </span>
        </header>
}