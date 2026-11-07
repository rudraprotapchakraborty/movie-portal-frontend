import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

/** The signed-in person's favorite movie ids, shared by every card and page. */
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [ids, setIds] = useState(() => new Set());

  useEffect(() => {
    if (!user) {
      setIds(new Set());
      return;
    }
    let cancelled = false;
    api
      .get("/favorites/ids")
      .then((res) => !cancelled && setIds(new Set(res.data.data)))
      .catch(() => {
        /* hearts simply start empty */
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  /** Adds or removes a favorite. Signed-out visitors are sent to sign in first. */
  const toggle = useCallback(
    async (movieId) => {
      if (!user) {
        navigate(`/login?from=${encodeURIComponent(location.pathname + location.search)}`);
        return false;
      }
      const had = ids.has(movieId);
      const apply = (add) =>
        setIds((prev) => {
          const next = new Set(prev);
          if (add) next.add(movieId);
          else next.delete(movieId);
          return next;
        });
      apply(!had); // instant feedback, rolled back if the request fails
      try {
        if (had) await api.delete(`/favorites/${movieId}`);
        else await api.put(`/favorites/${movieId}`);
        toast.success(had ? "Removed from favorites" : "Added to favorites");
        return true;
      } catch (err) {
        apply(had);
        toast.error(getErrorMessage(err, "Could not update your favorites."));
        return false;
      }
    },
    [user, ids, navigate, location]
  );

  const value = useMemo(() => ({ ids, toggle, isFavorite: (id) => ids.has(id) }), [ids, toggle]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
