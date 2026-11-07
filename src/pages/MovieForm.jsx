import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { GENRE_LABELS } from "../components/MovieCard";
import { Field } from "../components/auth/Field";
import { FormMessage } from "../components/auth/AuthShell";
import NotFound from "./NotFound";

const empty = { title: "", genre: "", release: "", duration: "", rating: 7, summary: "", poster: "", };
const THIS_YEAR = new Date().getFullYear();

/** Add a movie, or edit one when an :id is in the address. */
export default function MovieForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [state, setState] = useState(editing ? "loading" : "ready"); // loading | ready | missing | forbidden
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [posterFailed, setPosterFailed] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!editing) return;
    let cancelled = false;
    api
      .get(`/movies/${id}`)
      .then((res) => {
        if (cancelled) return;
        const m = res.data.data;
        if (user && user.role !== "ADMIN" && m.addedBy?.id !== user.id) return setState("forbidden");
        setForm({ title: m.title, genre: m.genre, release: m.release, duration: m.duration, rating: m.rating, summary: m.summary, poster: m.poster });
        setState("ready");
      })
      .catch(() => !cancelled && setState("missing"));
    return () => {
      cancelled = true;
    };
  }, [id, editing, user]);

  useEffect(() => setPosterFailed(false), [form.poster]);

  if (state === "missing") return <NotFound />;
  if (state === "forbidden") {
    return (
      <div className="frame py-20 text-center" role="alert">
        <h1 className="display text-3xl">You can only edit movies you added</h1>
        <Link to={`/movies/${id}`} className="btn btn-primary mt-6">
          Back to the movie
        </Link>
      </div>
    );
  }
  if (state === "loading") {
    return (
      <div className="frame py-12" role="status" aria-label="Loading">
        <div className="skeleton h-[480px] max-w-3xl" />
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.genre) return setError("Please pick a genre.");
    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        genre: form.genre,
        release: Number(form.release),
        duration: Number(form.duration),
        rating: Number(form.rating),
        summary: form.summary.trim(),
        poster: form.poster.trim(),
      };
      const res = editing ? await api.patch(`/movies/${id}`, body) : await api.post("/movies", body);
      toast.success(editing ? "Movie updated" : "Movie added");
      navigate(`/movies/${res.data.data.id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not save the movie."));
      setSaving(false);
    }
  };

  const showPoster = form.poster && !posterFailed;

  return (
    <div className="frame pb-20 pt-8">
      <Link to={editing ? `/movies/${id}` : "/movies"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="display mt-4 text-[clamp(32px,4.4vw,52px)]">
        {editing ? "Edit " : "Add a "}
        <span className="accent">movie</span>
      </h1>
      {user?.isDemo && !editing && (
        <p role="note" className="mt-4 rounded-2xl border border-brand/25 bg-brand-soft p-3.5 text-sm">
          <b>Test account.</b> You can add up to 15 movies of your own and edit or delete those, but not the sample catalogue.
        </p>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <FormMessage error={error} />
          <Field label="Title" value={form.title} onChange={set("title")} required minLength={2} maxLength={100} placeholder="Movie title" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="genre" className="text-sm font-semibold">
                Genre
              </label>
              <select id="genre" value={form.genre} onChange={(e) => set("genre")(e.target.value)} required className="input">
                <option value="" disabled>
                  Choose a genre
                </option>
                {Object.entries(GENRE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Release year" type="number" value={String(form.release)} onChange={set("release")} required min={1888} max={THIS_YEAR + 3} placeholder={String(THIS_YEAR)} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Duration (minutes)" type="number" value={String(form.duration)} onChange={set("duration")} required min={30} max={400} placeholder="120" />
            <div className="space-y-1.5">
              <label htmlFor="rating" className="flex justify-between text-sm font-semibold">
                Your rating <span className="tabular-nums text-gold">{Number(form.rating).toFixed(1)} / 10</span>
              </label>
              <input id="rating" type="range" min={0} max={10} step={0.5} value={form.rating} onChange={(e) => set("rating")(e.target.value)} className="w-full accent-[var(--brand)]" />
            </div>
          </div>

          <Field label="Poster link" type="url" value={form.poster} onChange={set("poster")} required maxLength={500} placeholder="https://example.com/poster.jpg" hint="A direct link to an image (JPG, PNG or WebP)." />

          <div className="space-y-1.5">
            <label htmlFor="summary" className="flex justify-between text-sm font-semibold">
              Summary <span className="font-normal text-muted tabular-nums">{form.summary.length}/1000</span>
            </label>
            <textarea id="summary" value={form.summary} onChange={(e) => set("summary")(e.target.value)} required minLength={10} maxLength={1000} rows={6} className="input resize-y" placeholder="What is it about?" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? "Save changes" : "Add movie"}
            </button>
            <Link to={editing ? `/movies/${id}` : "/movies"} className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>

        <aside aria-label="Poster preview" className="order-first lg:order-none">
          <p className="mb-2 text-sm font-semibold">Preview</p>
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-2xl border border-line bg-brand-soft shadow-[var(--shadow)]">
            {showPoster ? (
              <img src={form.poster} alt="Poster preview" referrerPolicy="no-referrer" onError={() => setPosterFailed(true)} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center gap-2 p-6 text-center text-sm text-muted">
                <ImageOff className="h-8 w-8" />
                {form.poster ? "That link does not load as an image." : "Paste a poster link to see it here."}
              </div>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
