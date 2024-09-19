import { useState, createContext } from 'react'


export const ThemeContext = createContext();
export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState("dark")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const UserContext = createContext();
export const UserProvider = ({children}) => {
  const [user, setUser] = useState({username: ""})

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};