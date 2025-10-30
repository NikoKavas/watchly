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
    <div className="md-page">
      <div className="md-topbar">
        <Link to="/" className="md-back">
          <span className="md-back-icon">←</span>
          <span>Back</span>
        </Link>
      </div>

      <div className="md-card">
        <div className="md-hero">
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="md-poster"
            />
          </div>
          <div>
            <div className="md-title-row">
              <h1 className="md-title">{movie.title}</h1>
              <span className="md-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            </div>
            <div className="md-meta">
              <span className="md-chip">📅 {movie.release_date}</span>
              <span className="md-chip">⏱ {movie.runtime} min</span>
              <span className="md-chip">🌐 {movie.original_language?.toUpperCase()}</span>
            </div>

            {movie.tagline && <p className="md-tagline">“{movie.tagline}”</p>}

            <p className="md-overview">{movie.overview}</p>

            <div className="md-genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="md-genre-chip">{g.name}</span>
              ))}
            </div>
          </div>
        </div>

        {trailerKey && (
          <div className="md-trailer">
            <div className="md-section-title">
              <span className="md-section-icon">🎬</span>
              <h3>Watch Trailer</h3>
            </div>
            <div className="md-trailer-frame">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Movie Trailer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="md-info-grid">
          <div className="md-info-item"><span>Release date</span><b>{movie.release_date}</b></div>
          <div className="md-info-item"><span>Status</span><b>{movie.status}</b></div>
          <div className="md-info-item"><span>Budget</span><b>${movie.budget?.toLocaleString() || 'N/A'}</b></div>
          <div className="md-info-item"><span>Revenue</span><b>${movie.revenue?.toLocaleString() || 'N/A'}</b></div>
        </div>
      </div>
    </div>
  );
}
