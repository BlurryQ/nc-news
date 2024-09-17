import {ThemeProvider, UserProvider } from './contexts/Contexts'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Articles from './components/Articles'

function App() {

  return <>
    <ThemeProvider>
      <UserProvider>
        <Header />
        <NavBar />
        <Articles />
      </UserProvider>
    </ThemeProvider>
    </>

}

export default App
