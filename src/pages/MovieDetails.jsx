import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`${API_BASE_URL}/movie/${id}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await res.json();
        setMovie(data);

        const videoRes = await fetch(`${API_BASE_URL}/movie/${id}/videos`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const videoData = await videoRes.json();

        const trailer = videoData.results.find(
          (v) => ['Trailer', 'Teaser'].includes(v.type) && v.site === 'YouTube'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      }
    }

    fetchMovie();
  }, [id]);

  if (!movie) return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  return (
    <div className="movie-details">
      <Link to="/" className="pagination-btn">← Back</Link>

      <div className="movie-details-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="movie-content">
          <h1 className="movie-title">{movie.title}</h1>

          <div className="movie-meta">
            <span><img src="/star.svg" alt="Star" /> {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date}</span>
            <span>🎬 {movie.runtime} min</span>
            <span>💬 {movie.original_language?.toUpperCase()}</span>
          </div>

          {movie.tagline && (
            <p className="movie-tagline">“{movie.tagline}”</p>
          )}

          <p className="movie-overview">{movie.overview}</p>

          <div className="genre-tags">
            {movie.genres?.map((g) => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>
        </div>
      </div>

      {trailerKey && (
        <div className="trailer-section">
          <h3>🎬 Watch Trailer</h3>
          <div className="trailer-frame">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}

      <div className="movie-info">
        <p><span>Release Date:</span> {movie.release_date}</p>
        <p><span>Status:</span> {movie.status}</p>
        <p><span>Budget:</span> ${movie.budget?.toLocaleString() || 'N/A'}</p>
        <p><span>Revenue:</span> ${movie.revenue?.toLocaleString() || 'N/A'}</p>
      </div>
    </div>
  );
}
