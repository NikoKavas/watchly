import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;