import { Request, Response } from "express";
import { generateShortId } from "../service/url.service";
import { Url } from "../models";

export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const shortId = await generateShortId();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const storeUrl = await Url.create({ shortId, longUrl: url })
        return res.status(201).json({ shortUrl: `${baseUrl}/${shortId}` });
    } catch (error) {
        console.log("Error creating short URL", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}