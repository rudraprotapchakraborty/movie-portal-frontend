import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, RefreshCw } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { useFavorites } from "../context/FavoritesContext";
import { MovieGrid, MovieGridSkeleton } from "../components/MovieCard";

export default function Favorites() {
  const { ids } = useFavorites();
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get("/favorites")
      .then((res) => !cancelled && setMovies(res.data.data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Could not load your favorites.")));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // A heart that was un-tapped on this page leaves the list straight away
  const visible = movies?.filter((m) => ids.has(m.id));

  return (
    <div className="frame pb-20 pt-10">
      <span className="eyeline">Your list</span>
      <h1 className="display mt-3 text-[clamp(32px,4.4vw,52px)]">
        My <span className="accent">favorites</span>
      </h1>

      {error ? (
        <div role="alert" className="card mt-10 grid place-items-center gap-4 p-10 text-center">
          <p className="text-muted">{error}</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn btn-primary btn-sm">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : !movies ? (
        <div className="mt-8">
          <MovieGridSkeleton count={6} />
        </div>
      ) : visible.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-4 p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
            <Heart className="h-6 w-6" />
          </span>
          <p className="text-lg font-bold">Nothing here yet</p>
          <p className="max-w-sm text-sm text-muted">Tap the heart on any movie to save it to your list.</p>
          <Link to="/movies" className="btn btn-primary">
            Browse movies
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm font-semibold text-muted">
            {visible.length} {visible.length === 1 ? "movie" : "movies"}
          </p>
          <div className="mt-5">
            <MovieGrid movies={visible} />
          </div>
        </>
      )}
    </div>
  );
}
