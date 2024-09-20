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
  const savedUserStr = localStorage.getItem("user");
  const savedUser = JSON.parse(savedUserStr)
  const [user, setUser] = useState(savedUser ? savedUser : {username: ""})

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};