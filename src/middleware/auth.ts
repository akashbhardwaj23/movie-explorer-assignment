import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";



export function authMiddleware(req: Request, res : Response, next : NextFunction) {

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token is missing from the authorization header" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)

    if(typeof decodedToken === "string" || !decodedToken || !decodedToken.sub || !decodedToken.sub) {
        return res.status(401).json({ error: "Invalid token" });
    }

    req.email = decodedToken.sub

    next()

}