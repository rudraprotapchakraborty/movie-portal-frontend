import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Search, X } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { GENRE_LABELS, MovieGrid, MovieGridSkeleton } from "../components/MovieCard";

const SORTS = [
  ["rating", "Top rated"],
  ["newest", "Recently added"],
  ["year", "Release year"],
  ["title", "Title A to Z"],
];

export default function Movies() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const sort = params.get("sort") ?? "rating";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [text, setText] = useState(q);
  const [data, setData] = useState(null);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const top = useRef(null);

  const update = (patch, { keepPage = false } = {}) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!keepPage) next.delete("page");
    setParams(next, { replace: true });
  };

  useEffect(() => {
    api.get("/movies/genres").then((r) => setGenres(r.data.data)).catch(() => {});
  }, []);

  // Typing updates the search a moment after the last keystroke
  useEffect(() => {
    if (text.trim() === q) return;
    const id = setTimeout(() => update({ q: text.trim() }), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Back/forward and links such as /movies?q=dune change the box too
  useEffect(() => setText(q), [q]);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    api
      .get("/movies", { params: { q: q || undefined, genre: genre || undefined, sort, page, limit: 24 }, signal: controller.signal })
      .then((res) => setData(res.data.data))
      .catch((err) => {
        if (!controller.signal.aborted) setError(getErrorMessage(err, "Could not load movies."));
      });
    return () => controller.abort();
  }, [q, genre, sort, page, attempt]);

  const go = (p) => {
    update({ page: p > 1 ? String(p) : "" }, { keepPage: true });
    top.current?.scrollIntoView({ behavior: "instant" });
  };

  const filtered = Boolean(q || genre);

  return (
    <div className="frame pb-20 pt-10" ref={top}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyeline">Catalogue</span>
          <h1 className="display mt-3 text-[clamp(32px,4.4vw,52px)]">
            All <span className="accent">movies</span>
          </h1>
        </div>
        <Link to="/movies/new" className="btn btn-primary">
          <Plus className="h-4 w-4" /> Add a movie
        </Link>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search by title" aria-label="Search movies by title" className="input !rounded-full !py-2.5 pl-10" />
        </div>
        <label className="sr-only" htmlFor="sort">
          Sort movies
        </label>
        <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === "rating" ? "" : e.target.value })} className="input !w-auto !rounded-full !py-2.5 pr-8 text-sm font-semibold">
          {SORTS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {filtered && (
          <button type="button" onClick={() => { setText(""); setParams(new URLSearchParams(), { replace: true }); }} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter by genre">
        <button type="button" aria-pressed={!genre} onClick={() => update({ genre: "" })} className={`btn btn-sm shrink-0 ${!genre ? "btn-primary" : "btn-ghost"}`}>
          All
        </button>
        {genres.map((g) => (
          <button key={g.genre} type="button" aria-pressed={genre === g.genre} onClick={() => update({ genre: genre === g.genre ? "" : g.genre })} className={`btn btn-sm shrink-0 ${genre === g.genre ? "btn-primary" : "btn-ghost"}`}>
            {GENRE_LABELS[g.genre] ?? g.genre}
          </button>
        ))}
      </div>

      {error ? (
        <div role="alert" className="card mt-10 grid place-items-center gap-4 p-10 text-center">
          <p className="text-muted">{error}</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn btn-primary btn-sm">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : !data ? (
        <div className="mt-8">
          <MovieGridSkeleton />
        </div>
      ) : data.movies.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-3 p-12 text-center">
          <p className="text-lg font-bold">No movies match that search.</p>
          <p className="text-sm text-muted">Try a different title or clear the filters.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm font-semibold text-muted" aria-live="polite">
            {data.total.toLocaleString()} {data.total === 1 ? "movie" : "movies"}
            {genre ? ` in ${GENRE_LABELS[genre] ?? genre}` : ""}
            {q ? ` matching "${q}"` : ""}
          </p>
          <div className="mt-5">
            <MovieGrid movies={data.movies} />
          </div>
          {data.pages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
              <button type="button" disabled={page <= 1} onClick={() => go(page - 1)} className="btn btn-ghost btn-sm">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-sm text-muted tabular-nums">
                Page {data.page} of {data.pages}
              </span>
              <button type="button" disabled={page >= data.pages} onClick={() => go(page + 1)} className="btn btn-ghost btn-sm">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
