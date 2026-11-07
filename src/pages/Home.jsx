import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clapperboard, Heart, Loader2, PlusCircle, Search, Send, Star } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import MovieCard, { GENRE_LABELS, MovieGrid, MovieGridSkeleton, Poster } from "../components/MovieCard";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/newsletter", { email });
      setDone(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not subscribe. Please try again."));
    }
    setBusy(false);
  };

  return (
    <section className="frame pb-24" data-reveal>
      <div className="grid-panel rounded-[32px] border border-line px-6 py-14 text-center sm:px-12">
        <h2 className="display mx-auto max-w-[620px] text-[clamp(28px,4vw,46px)]">
          New picks, straight to your <span className="accent">inbox</span>.
        </h2>
        <p className="mx-auto mt-3 max-w-[460px] text-muted">One short email now and then with what was added to the shelf. No spam.</p>
        {done ? (
          <p role="status" className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--done-soft)] px-5 py-3 font-semibold text-done">
            Thanks for subscribing!
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-[460px] flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="input !rounded-full" />
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [top, setTop] = useState(null);
  const [latest, setLatest] = useState(null);
  const [genres, setGenres] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/movies/top").then((r) => setTop(r.data.data)).catch(() => setTop([]));
    api.get("/movies/latest").then((r) => setLatest(r.data.data)).catch(() => setLatest([]));
    api.get("/movies/genres").then((r) => setGenres(r.data.data)).catch(() => {});
    api.get("/public/stats").then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/movies?q=${encodeURIComponent(query.trim())}` : "/movies");
  };

  const hero = (top ?? []).slice(0, 3);

  return (
    <>
      <section className="frame grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20">
        <div className="hero-stagger">
          <span className="eyeline">Movie Portal</span>
          <h1 className="display mt-5 text-[clamp(42px,6.4vw,84px)]">
            Every movie. One <span className="accent">shelf</span>.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted">
            Browse a catalogue of movies from Marvel, Star Wars and Pixar to timeless classics. Keep a favorites list and add the movies you love.
          </p>
          <form onSubmit={search} className="mt-8 flex max-w-[520px] items-center gap-2 rounded-full border border-line bg-surface p-1.5 shadow-[var(--shadow)] focus-within:border-brand">
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted" />
            <label className="sr-only" htmlFor="hero-search">
              Search movies
            </label>
            <input id="hero-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title" className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15px] outline-none placeholder:text-muted/70" />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/movies" className="btn btn-ink">
              Browse all movies <ArrowRight className="h-4 w-4" />
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-ghost">
                Try a test account
              </Link>
            )}
          </div>
          {stats && stats.movies > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-9 gap-y-4">
              {[
                ["Movies", stats.movies],
                ["Members", stats.members],
                ["Favorites saved", stats.favorites],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="text-3xl font-bold tracking-tight tabular-nums">{value.toLocaleString()}</dd>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="grid-panel relative mx-auto aspect-[5/4] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-line" aria-hidden={hero.length === 0}>
          {hero.length === 3 ? (
            hero.map((m, i) => (
              <Link
                key={m.id}
                to={`/movies/${m.id}`}
                tabIndex={i === 1 ? 0 : -1}
                aria-label={m.title}
                className={`absolute w-[34%] overflow-hidden rounded-2xl border-2 border-surface shadow-2xl transition hover:z-20 hover:scale-105 ${
                  ["left-[8%] top-[18%] -rotate-[9deg]", "float-b left-[33%] top-[8%] z-10", "left-[58%] top-[20%] rotate-[8deg]"][i]
                }`}
              >
                <Poster movie={m} eager />
              </Link>
            ))
          ) : (
            <div className="grid h-full place-items-center">
              <Clapperboard className="h-10 w-10 text-brand/60" />
            </div>
          )}
          <div className="float-a absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold text-ink shadow-lg ring-1 ring-line">
            <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-gold" /> Top rated
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16" data-reveal>
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyeline">Top rated</span>
              <h2 className="display mt-4 text-[clamp(28px,4vw,46px)]">
                The <span className="accent">best</span> on the shelf
              </h2>
            </div>
            <Link to="/movies?sort=rating" className="btn btn-ghost btn-sm">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8">{top === null ? <MovieGridSkeleton count={6} /> : <MovieGrid movies={top} />}</div>
        </div>
      </section>

      {genres.length > 0 && (
        <section className="pb-16" data-reveal>
          <div className="frame">
            <span className="eyeline">Genres</span>
            <h2 className="display mt-4 text-[clamp(28px,4vw,46px)]">
              Find your <span className="accent">mood</span>
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {genres.map((g) => (
                <li key={g.genre}>
                  <Link to={`/movies?genre=${g.genre}`} className="btn btn-ghost btn-sm">
                    {GENRE_LABELS[g.genre] ?? g.genre} <span className="text-muted">{g.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-surface/40 py-16" data-reveal>
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyeline">Just added</span>
              <h2 className="display mt-4 text-[clamp(28px,4vw,46px)]">
                Fresh on the <span className="accent">shelf</span>
              </h2>
            </div>
            <Link to="/movies?sort=newest" className="btn btn-ghost btn-sm">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8">
            {latest === null ? (
              <MovieGridSkeleton count={8} />
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4">
                {latest.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="py-20" data-reveal>
        <div className="frame">
          <span className="eyeline">About</span>
          <h2 className="display mt-4 max-w-[640px] text-[clamp(30px,4.4vw,52px)]">
            A shelf that <span className="accent">belongs</span> to everyone.
          </h2>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Clapperboard, "A real catalogue", "Dozens of well known movies with accurate years, runtimes and synopses, ready to browse by genre or search by title."],
              [Heart, "Favorites that stay with you", "Tap the heart on any movie. Your list is saved to your account and follows you across devices."],
              [PlusCircle, "Add your own", "Missing a movie? Add it with a poster link, genre and your rating. You can edit or remove your additions at any time."],
            ].map(([Icon, title, text]) => (
              <li key={title} className="card p-7 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[var(--shadow)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
