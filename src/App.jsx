import './App.css'
import PokemonList from './components/PokemonList'
import PokemonDetail from './components/PokemonDetail'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'



function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<PokemonList/>}/>
        <Route path='/pokemon/:id' element={<PokemonDetail/>}/>
      </Routes>
    </Router>
  ) 
}

export default App
