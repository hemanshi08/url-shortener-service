import express from "express";
import { rateLimiter } from "../middlewares/rateLimiter";
import { createShortUrl, getUrlAnalytics, getUrlHistory, redirectToLongUrl } from "../controllers";
export const router = express.Router();

router.post("/url", rateLimiter, createShortUrl);
router.get("/:shortId", rateLimiter, redirectToLongUrl);
router.get("/history/:shortId", rateLimiter, getUrlHistory);
router.get("/analytics/:shortId", rateLimiter, getUrlAnalytics);

