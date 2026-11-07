import { useState } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, Heart, Star } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

export const GENRE_LABELS = {
  action: "Action",
  adventure: "Adventure",
  animation: "Animation",
  comedy: "Comedy",
  crime: "Crime",
  drama: "Drama",
  fantasy: "Fantasy",
  horror: "Horror",
  romance: "Romance",
  "sci-fi": "Sci-Fi",
  thriller: "Thriller",
};

export const formatRuntime = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;

/** Poster image with a title card shown when the picture is missing or fails to load. */
export function Poster({ movie, className = "", eager = false }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const failed = failedUrl === movie.poster;
  return (
    <div className={`relative aspect-[2/3] overflow-hidden bg-brand-soft ${className}`}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center gap-2 p-4 text-center text-muted">
          <Clapperboard className="h-8 w-8 text-brand" />
          <span className="text-sm font-semibold">{movie.title}</span>
        </div>
      ) : (
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(movie.poster)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export function FavoriteButton({ movie, className = "" }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(movie.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(movie.id);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
      className={`grid h-9 w-9 place-items-center rounded-full bg-paper/85 text-ink shadow backdrop-blur transition hover:scale-110 ${className}`}
    >
      <Heart className={`h-[18px] w-[18px] transition-colors ${active ? "fill-brand text-brand" : ""}`} />
    </button>
  );
}

export function RatingBadge({ rating, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-xs font-bold text-gold ${className}`}>
      <Star className="h-3 w-3 fill-current" /> {Number(rating).toFixed(1)}
    </span>
  );
}

export default function MovieCard({ movie, eager = false }) {
  return (
    <article className="group relative">
      <Link to={`/movies/${movie.id}`} className="block rounded-2xl focus-visible:outline-offset-4">
        <div className="relative overflow-hidden rounded-2xl border border-line shadow-[var(--shadow)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-brand group-hover:shadow-xl">
          <Poster movie={movie} eager={eager} className="transition duration-500 group-hover:scale-[1.04]" />
          <RatingBadge rating={movie.rating} className="absolute left-2.5 top-2.5 !bg-paper/90 backdrop-blur" />
        </div>
        <h3 className="mt-3 line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-ink">{movie.title}</h3>
        <p className="mt-0.5 text-xs font-medium text-muted">
          {movie.release} · {GENRE_LABELS[movie.genre] ?? movie.genre}
        </p>
      </Link>
      <FavoriteButton movie={movie} className="absolute right-2.5 top-2.5" />
    </article>
  );
}

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" role="status" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[2/3] !rounded-2xl" />
          <div className="skeleton mt-3 h-4 w-4/5" />
          <div className="skeleton mt-2 h-3 w-2/5" />
        </div>
      ))}
    </div>
  );
}

export function MovieGrid({ movies, eagerCount = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((m, i) => (
        <MovieCard key={m.id} movie={m} eager={i < eagerCount} />
      ))}
    </div>
  );
}
