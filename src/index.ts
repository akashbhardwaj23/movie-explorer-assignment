import express from "express";
import { authMiddleware } from "./middleware/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(authMiddleware);

app.get("/movies", async(req, res) => {
  
});
