import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GuestOnly, Protected } from "./components/RouteGuards";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Movies = lazy(() => import("./pages/Movies"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const MovieForm = lazy(() => import("./pages/MovieForm"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
const Legal = lazy(() => import("./pages/Legal"));

const AUTH_PATHS = /^\/(login|register|verify-email|forgot-password)$/;

const Loading = () => (
  <div role="status" className="frame grid gap-4 py-12">
    <span className="sr-only">Loading…</span>
    <div className="skeleton" style={{ height: 38, width: "38%" }} />
    <div className="skeleton" style={{ height: 150 }} />
    <div className="skeleton" style={{ height: 90, width: "70%" }} />
  </div>
);

// Addresses from the first version of the site keep working
const OldMovieDetails = () => <Navigate to={`/movies/${useParams().id}`} replace />;
const OldUpdateMovie = () => <Navigate to={`/movies/${useParams().id}/edit`} replace />;

export default function App() {
  const { pathname, hash } = useLocation();
  const bare = AUTH_PATHS.test(pathname); // auth screens bring their own header

  // Fade sections in as they scroll into view. Sections that only appear once their
  // data has loaded (such as the genre list) are picked up as they are added to the page.
  useEffect(() => {
    document.documentElement.classList.add("js");
    const pending = () => document.querySelectorAll("[data-reveal]:not(.in-view)");
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("in-view"));
      return;
    }
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const watch = () =>
      pending().forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById("root"), { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  // New pages start at the top; "/#about" style links scroll to their section
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      {!bare && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <div key={pathname} className="page-enter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/new" element={<Protected><MovieForm /></Protected>} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/movies/:id/edit" element={<Protected><MovieForm /></Protected>} />
              <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
              <Route path="/verify-email" element={<GuestOnly><VerifyEmail /></GuestOnly>} />
              <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
              <Route path="/settings" element={<Protected><Settings /></Protected>} />
              <Route path="/admin" element={<Protected role="ADMIN"><Admin /></Protected>} />
              <Route path="/privacy" element={<Legal page="privacy" />} />
              <Route path="/terms" element={<Legal page="terms" />} />
              {/* old addresses */}
              <Route path="/allMovies" element={<Navigate to="/movies" replace />} />
              <Route path="/addMovie" element={<Navigate to="/movies/new" replace />} />
              <Route path="/movieDetails/:id" element={<OldMovieDetails />} />
              <Route path="/updateMovie/:id" element={<OldUpdateMovie />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      {!bare && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 14, fontSize: 14 },
        }}
      />
    </div>
  );
}
