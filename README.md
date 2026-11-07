<div align="center">

# 🎬 Movie Portal

**Movie catalogue with search, genres, favorites and member-added movies.**

[**Live demo**](https://movie-portal-frontend-tau.vercel.app/) · [Backend API](https://github.com/rudraprotapchakraborty/movie-portal-backend) · [Portfolio](https://rudraprotapchakraborty.com/projects)

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb) ![Vite](https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite&logoColor=ffffff) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0f172a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=ffffff)

<a href="https://movie-portal-frontend-tau.vercel.app/"><img src="https://i.ibb.co/fhbYrFV/movie-portal.webp" alt="Movie Portal: home page" width="880"></a>

</div>

> The web app of **Movie Portal**.
>
> - 88 titles with posters, runtimes and synopses from Wikipedia
> - Search, genre filters, sorting and paging without an account
> - Members save favourites and add their own movies
> - Owners and admins can edit or delete what they added

A movie catalogue with 88 titles across Marvel, Star Wars, The Lord of the Rings, Harry Potter, Pixar and many classics, with real titles, runtimes, release years, posters and synopses taken from Wikipedia. Visitors can search by title, filter by genre, sort and page through the shelf without signing in. Members save favorites with a heart, and add their own movies with a poster link and a rating, which only they (or an admin) can edit or delete. Sign-in works with email and password, confirmed with a one-time email code, or with Google, with password reset, an account settings page and an admin area for managing members. Shared test accounts for each role make it easy to try, and the interface supports light and dark themes.

## Features

- 88 sample movies across Marvel, Star Wars, The Lord of the Rings, Harry Potter, Pixar, classics and more, with real titles, runtimes, release years, posters and synopses from Wikipedia
- Search by title, filter by genre, sort (top rated, recently added, year, title) and paginate. The state lives in the address bar, so every view can be linked or reloaded
- Movie details with rating, runtime, summary and a link to the source article
- Favorites: tap the heart on any card. Saved to your account, never duplicated
- Add movies with a live poster preview. Only the person who added a movie (or an admin) can edit or delete it
- Email and password sign-in with a six digit email code, Google sign-in, forgot-password reset
- Account settings: name, photo, email (confirmed by code), password, sign-in methods, delete account
- Admin area: member list with search, block, role change and delete, plus site statistics
- Newsletter sign-up, light and dark mode, responsive down to phones
- Shared test accounts (Admin and User) on the sign-in page, locked so settings and the sample catalogue cannot be changed
- Links from the first version of the site (`/allMovies`, `/addMovie`, `/movieDetails/:id`, `/updateMovie/:id`) still work

## Stack

React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, lucide-react.

## Run it locally

You need the [backend](https://github.com/rudraprotapchakraborty/movie-portal-backend) running on port 5000.

```bash
npm install
cp .env.example .env.local   # then fill in GOOGLE_CLIENT_ID
npm run dev                  # http://localhost:3000
```

In development the dev server proxies `/api` to `http://127.0.0.1:5000`.

## Environment

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Public Google OAuth client id. The button is hidden when it is empty. |
| `VITE_API_URL` | Optional override of the API origin including `/api`. Production defaults to `https://movie-portal-backend-chi.vercel.app/api`. |

## Deploying

The project deploys as a static site (Vercel config included, with a rewrite to `index.html` for client side routing). Set `GOOGLE_CLIENT_ID` in the host's environment, and add the site's origin to the Google client's authorized JavaScript origins. The API origin defaults to the deployed backend in `src/lib/api.js` (override with `VITE_API_URL`), and the backend's `CLIENT_URL` must list this site's origin.

## Credits

Sample movie details come from Wikipedia and Wikidata. Posters belong to their respective studios and are shown to identify the films.

---

<div align="center">

Made by **[Rudra Protap Chakraborty](https://rudraprotapchakraborty.com)** · [Portfolio](https://rudraprotapchakraborty.com) · [GitHub](https://github.com/rudraprotapchakraborty)

</div>
