import axios from "axios";
import { BASE_URL } from "./url";
import { client } from "../db/db";
import type { Cast, Movie } from "@prisma/client";
import type { AllMovieType, Genre, MovieType, MyCastType } from "../types";



export const fetchDiscoverMovies = async (page : number) => {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    headers : {
        Authorization: `Bearer ${process.env.API_READ_KEY}`,
        "Accept": "application/json",
    },
    params : {
        page : page
    }
  });

  const data: AllMovieType = res.data;
  return data.results;
};




export const fetchMovieDetails = async (id : number) => {
  const [details, credits] = await Promise.all([
    axios.get(`${BASE_URL}/movie/${id}`, { 
        headers: {
            Authorization: `Bearer ${process.env.API_READ_KEY}`,
            "Content-Type": "application/json",
        }
     }),
    axios.get(`${BASE_URL}/movie/${id}/credits`, { 
        headers : {
            Authorization: `Bearer ${process.env.API_READ_KEY}`,
            "Content-Type": "application/json",
        }
     }),
  ]);
  return {
    details: details.data as MovieType,
    cast: credits.data.cast?.slice(0, 5) || [] as Cast[],
  };
};



export const upsertGenres = async (genres : Genre[]) => {
  return Promise.all(genres.map(async (g) => {
    await client.genre.upsert({
      where: { id: g.id },
      update: {},
      create: { id: g.id, name: g.name },
    });
    return { id: g.id };
  }));
};


export const upsertCast = async (castList : MyCastType[]) => {
  return Promise.all(castList.map(async (c) => {
    await client.cast.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        characters: c.character,
        profilePath: c.profile_path,
      },
    });
    return { id: c.id };
  }));
};



export const upsertMovie = async (movie : MovieType, genres : {
    id: number;
}[], cast : {
    id: number
}[]) => {
  await client.movie.upsert({
    where: { id: movie.id },
    update: {},
    create: {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date ? new Date(movie.release_date) : null,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      revenue: movie.revenue,
      runtime: movie.runtime,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      genres: { connect: genres },
      cast: { connect: cast },
    },
  });
};