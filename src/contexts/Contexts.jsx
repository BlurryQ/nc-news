import { useState, createContext } from 'react'


export const ThemeContext = createContext();
export const ThemeProvider = ({children}) => {
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(savedTheme ? savedTheme : "dark")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const UserContext = createContext();
export const UserProvider = ({children}) => {
/* --- BELOW WORKING BUT UI NOT UPDATING WHEN USER SIGNED ON --- */
  // const savedUserStr = localStorage.getItem("user");
  // const savedUser = JSON.parse(savedUserStr)
  // const [user, setUser] = useState(savedUser ? savedUser : {username: ""})

  const [user, setUser] = useState({username: ""})

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};