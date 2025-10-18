import React, { useState, useEffect, useRef } from 'react'
import Search from './components/search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  const [movieList, setMovieList] = useState([])

  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [trendingMovies, setTrendingMovies] = useState([])

  const allMoviesRef = useRef(null)

  // Debounce the search term input to limit API calls
  useDebounce(() => { setDebouncedSearchTerm(searchTerm) }, 1000, [searchTerm])

  // Function to fetch movies from the API
  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()
      console.log(data)
      
      if (data.results.length === 0) {
        setErrorMsg('Failed to fetch movies. Please try again later.')
        setMovieList([])
        return;
      }
      setMovieList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.error('Error fetching movies:', error)
      setErrorMsg('Failed to fetch movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()

      setTrendingMovies(movies)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, page)
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    loadTrendingMovies()
  }, []);



  return (
    <main>
      <div className='pattern'/>
      
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy 
          Without A Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
        <section className='trending'>
          <h2>Trending Movies</h2>

          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
            ))}
          </ul>
        </section>
        )}

        <section className='all-movies' ref={allMoviesRef}>
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className='text-red-500'>{errorMsg}</p>
          ) : (
            <>
            <ul>
            {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
            </ul>

             <div className='flex justify-center items-center gap-4 mt-8'>
            <button
              className='pagination-btn'
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className='text-light-200'>Page {page}</span>
            <button
              className='pagination-btn'
              onClick={() => {
                setPage((prev) => prev + 1)
                allMoviesRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Next
            </button>
          </div>
        </>

      )}
        </section>

      </div>
      
    </main>
  )
}

export default App
