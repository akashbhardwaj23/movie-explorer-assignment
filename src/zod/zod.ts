import { z } from 'zod';


export const AuthInputs = z.object({
    email : z.string(),
    password: z.string()
})



export const MoviesInput = z.object({
    year: z.string().optional(),
    genres: z.string().optional(),
    without_genres: z.string().optional(),
    sort_by: z.string().default('popularity'),
    order: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    page: z.coerce.number().default(1),
    perPage: z.coerce.number().default(10),
});
