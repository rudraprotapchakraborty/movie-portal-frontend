import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Heart, Pencil, Star, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { GENRE_LABELS, Poster, formatRuntime } from "../components/MovieCard";
import NotFound from "./NotFound";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | missing | error
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    api
      .get(`/movies/${id}`)
      .then((res) => {
        if (cancelled) return;
        setMovie(res.data.data);
        setState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setState(err?.response?.status === 404 || err?.response?.status === 400 ? "missing" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state === "missing") return <NotFound />;
  if (state === "error") {
    return (
      <div className="frame py-20 text-center" role="alert">
        <p className="text-muted">Could not load this movie.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-primary btn-sm mt-4">
          Try again
        </button>
      </div>
    );
  }
  if (state === "loading" || !movie) {
    return (
      <div className="frame grid gap-10 py-12 md:grid-cols-[320px_1fr]" role="status" aria-label="Loading movie">
        <div className="skeleton aspect-[2/3] !rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-40" />
        </div>
      </div>
    );
  }

  const canEdit = user && (user.role === "ADMIN" || movie.addedBy?.id === user.id);
  const favorite = isFavorite(movie.id);

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/movies/${movie.id}`);
      toast.success("Movie deleted");
      navigate("/movies", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete the movie."));
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="frame pb-20 pt-8">
      <Link to="/movies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All movies
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(240px,320px)_1fr] lg:gap-14">
        <div className="mx-auto w-full max-w-[320px] md:mx-0">
          <div className="overflow-hidden rounded-3xl border border-line shadow-[var(--shadow)]">
            <Poster movie={movie} eager />
          </div>
        </div>

        <div>
          <span className="chip bg-brand-soft text-brand">{GENRE_LABELS[movie.genre] ?? movie.genre}</span>
          <h1 className="display mt-4 text-[clamp(32px,4.6vw,58px)]">{movie.title}</h1>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <dt className="sr-only">Released</dt>
              <dd className="font-semibold text-ink">{movie.release}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <dt className="sr-only">Runtime</dt>
              <dd className="font-semibold text-ink">{formatRuntime(movie.duration)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[var(--gold)] text-gold" />
              <dt className="sr-only">Rating</dt>
              <dd className="font-semibold text-ink">
                {movie.rating.toFixed(1)}
                <span className="font-normal text-muted"> / 10</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-line" role="presentation">
            <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${movie.rating * 10}%` }} />
          </div>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted">Summary</h2>
          <p className="mt-2 max-w-[62ch] whitespace-pre-line text-[16px] leading-relaxed text-ink/90">{movie.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => toggle(movie.id)} aria-pressed={favorite} className={`btn ${favorite ? "btn-primary" : "btn-ink"}`}>
              <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} /> {favorite ? "In your favorites" : "Add to favorites"}
            </button>
            {canEdit && (
              <>
                <Link to={`/movies/${movie.id}/edit`} className="btn btn-ghost">
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost !text-danger hover:!bg-[var(--danger-soft)]">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </>
            )}
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            {movie.addedBy && !movie.isSeed && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Added by {movie.addedBy.name}
              </span>
            )}
            {movie.source && (
              <a href={movie.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-ink">
                <ExternalLink className="h-3.5 w-3.5" /> Details from Wikipedia
              </a>
            )}
          </p>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete this movie?"
          message={`"${movie.title}" will be removed from the shelf and from everyone's favorites. This cannot be undone.`}
          busy={deleting}
          onConfirm={remove}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
