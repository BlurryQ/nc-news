import '../styles/header.css'
import { ThemeContext, UserContext } from "../contexts/Contexts"
import { useContext } from 'react'

export default function Header() {
    const { theme, setTheme } = useContext(ThemeContext)
    const { user, setUser } = useContext(UserContext)

    const root = document.documentElement
    root.className = theme

    const themeHandler = () => {
        setTheme(theme === "dark" ? "light" : "dark")
        root.className = theme
    }

    const userHandler = () => {
        user ? setUser("") : setUser("weegembump")
    }

    return <header className="header">
            <h1 className="site-name"><a href="/articles"><span className="logo">/\</span> NC News</a></h1>
            <span className="header-controls">
                <div id="user-message" className="user-message">
                    <p className="welcome-message">Welcome {user ? "back" : null}</p>
                    {user ? <p onClick={userHandler} className="username">{user}</p> : <button className="sign-on" onClick={userHandler}>sign in</button>}
                </div>
                <button className="theme-toggle" onClick={themeHandler}></button>
            </span>
        </header>
}