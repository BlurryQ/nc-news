import {ThemeProvider, UserProvider } from './contexts/Contexts'
import { Routes, Route } from "react-router-dom";
import Header from './components/Header'
import NavBar from './components/NavBar'
import Articles from './components/Articles'
import Article from './components/Article';


export default function App() {

  return <>
    <ThemeProvider>
      <UserProvider>
        <Header />
        <NavBar />
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:article_id" element={<Article />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  </>

}
