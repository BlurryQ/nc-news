import '../styles/header.css'
import { ThemeContext, UserContext } from "../contexts/Contexts"
import { useContext, useEffect } from 'react'

export default function Header() {
    const { theme, setTheme } = useContext(ThemeContext)
    const { user, setUser } = useContext(UserContext)

    const root = document.documentElement
    root.className = theme

    const themeHandler = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme);
        root.className = theme
    }

    const userHandler = () => {
        /* --- BELOW WORKING BUT UI NOT UPDATING WHEN USER SIGNED ON --- */
        // const userLoggedIn = user.username === "" ? {username: "weegembump"} : {username: ""}
        // const stringified = JSON.stringify(userLoggedIn)
        // setUser(stringified)
        // localStorage.setItem("user", stringified);

        user.username ? setUser({username: ""}) : setUser({username: "weegembump"})
    }

    return <header className="header">
            <h1 className="site-name"><a href="/articles"><span className="logo">/\</span> NC News</a></h1>
            <span className="header-controls">
                <div id="user-message" className="user-message">
                    <p className="welcome-message">Welcome {user.username ? "back" : null}</p>
                    {user.username ? <p onClick={userHandler} className="username">{user.username}</p> : <button className="log-on" onClick={userHandler}>Log on</button>}
                    {user.username ? <button className="log-off" onClick={userHandler}>Log off</button> : null}
                </div>
                <button className="theme-toggle" onClick={themeHandler}></button>
            </span>
        </header>
}