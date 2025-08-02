import express from "express";
import { authMiddleware } from "./middleware/auth";
import dotenv from "dotenv";
import { AuthInputs, MoviesInput } from "./zod/zod";
import { client } from "./db/db";
import type { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());


// I have defined only sigin route which could act as both signin and signup route
app.get("/signin", (req, res) => {
    const parsedData = AuthInputs.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.message });
    }

    const { email, password } = parsedData.data;

    const token = jwt.sign( { sub : email}, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
    });

    res.json({ token });

});



app.get("/movies", authMiddleware, async (req, res) => {
    try {
        const inputData = MoviesInput.safeParse(req.query);
        console.log(inputData.success, inputData.data);
        if (!inputData.success) {
            return res.status(400).json({ error: inputData.error.message });
        }

       const where: Prisma.MovieWhereInput = {};

        if (inputData.data.year) {
            const start = new Date(`${inputData.data.year}-01-01`);
            const end = new Date(`${Number(inputData.data.year) + 1}-01-01`);
            where.releaseDate = { gte: start, lt: end };
        }

        if (inputData.data.search) {
            where.OR = [
                { title: { contains: inputData.data.search, mode: 'insensitive' } },
                { cast: { some: { name: { contains: inputData.data.search, mode: 'insensitive' } } } },
            ];
        }

        if (inputData.data.genres) {
            const genreIds = inputData.data.genres.split(',').map(Number);
            where.genres = { some: { id: { in: genreIds } } };
        }

        if (inputData.data.without_genres) {
            const genreIds = inputData.data.without_genres.split(',').map(Number);
            where.genres = { none: { id: { in: genreIds } } };
        }

        const skip = (inputData.data.page - 1) * inputData.data.perPage;
        const orderBy : Prisma.MovieOrderByWithRelationInput = {
            [inputData.data.sort_by]: inputData.data.order.toLowerCase() === 'asc' ? 'asc' : 'desc',
        };

        const movies = await client.movie.findMany({
            where : {
                
            },
            skip: Number(skip),
            take: Number(inputData.data.perPage),
            orderBy,
            include: {
                genres: true,
                cast: true,
            },
        });

        res.json(movies);
    } catch (err) {
        //@ts-ignore
        console.error('Error fetching movies:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});