# TMDB Movie Seeder with Prisma & PostgreSQL

This project fetches and stores 500 movie records from [The Movie Database (TMDB)](https://www.themoviedb.org/) into a PostgreSQL database using Prisma ORM. It also includes robust fallback logic using local JSON files in case the TMDB API is unavailable.


## New Architecture

This is a New Architecture for this application.

![architecture](/public//architecture.png)

---

## 📦 Features

- ✅ Fetches 500 movies from TMDB using the `/discover/movie` endpoint.
- ✅ Fetches detailed movie data and top 5 cast members.
- ✅ Stores movies, genres, and cast in a PostgreSQL database using Prisma.
- ✅ Uses local fallback JSON files for:
  - Discover API
  - Movie details API
  - Movie credits (cast)
- ✅ Idempotent seed logic (via Prisma `upsert`).

---

## 🛠️ Technologies

- Node.js
- Prisma ORM
- PostgreSQL
- Axios
- dotenv

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-repo/movie-seeder
cd movie-seeder
