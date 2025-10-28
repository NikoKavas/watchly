import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
    const res = await fetch(`${API_BASE_URL}/movie/${id}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    });
    const data = await res.json();
    setMovie(data);
  }
    fetchMovie();
  }, [id]);

  if (!movie) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-100">
      <Link to="/" className="pagination-btn">← Back</Link>

      <div className="flex flex-col items-center justify-center text-center min-h-screen space-y-6 fade-in">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-lg max-w-[400px] w-full"
        />

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-gray-400 italic mb-4">{movie.tagline}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date}</span>
            <span>🎬 {movie.runtime} min</span>
            <span>💬 {movie.original_language?.toUpperCase()}</span>
          </div>

          <p className="leading-relaxed text-gray-200">{movie.overview}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gold">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 bg-[#1e1e28] rounded-full border border-[#3a3a4a]">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
