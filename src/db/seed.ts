import type { Prisma } from "@prisma/client";
import { fetchDiscoverMovies, fetchMovieDetails, upsertCast, upsertGenres, upsertMovie } from "../lib/utills";
import { client } from "./db";
import type { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import dotenv from "dotenv";
import axiosRetry from "axios-retry";
import axios from "axios";

dotenv.config();



axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000, 
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response !== undefined &&
        typeof error.response.status === "number" &&
        error.response.status >= 500)
    );
  },
});


const seed = async () => {
  try {
    for (let page = 1; page <= 25; page++) {
      console.log(`Fetching page ${page}`);
      const movies = await fetchDiscoverMovies(page);
      for (const movie of movies) {
        try {
          const { details, cast } = await fetchMovieDetails(movie.id);
          const genres = await upsertGenres(details.genres || []);
          const castRefs = await upsertCast(cast || []);
          await upsertMovie(details, genres, castRefs);
          console.log(`Seeded movie: ${details.title}`);
        } catch (err) {
            //@ts-ignore
          if (err instanceof PrismaClientUnknownRequestError) {
          console.error(`Error seeding movie ID ${movie.id}:`, err.message);
          }
        }
      }
    }
    console.log('✅ Done seeding 500 movies');
  } catch (err : unknown ) {

    console.log('error', err);
    // @ts-ignore
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await client.$disconnect();
  }
};



seed()