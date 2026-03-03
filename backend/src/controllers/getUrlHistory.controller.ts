import { Request, Response } from "express";
import { UrlHistory } from "../models";
import mongoose from "mongoose";

export const getUrlHistory = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const cursor = req.query.cursor as string | undefined;

        if (!shortId) {
            return res.status(400).json({ message: "Short ID is required" });
        }

        const query: any = { shortId };

        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({ message: "Invalid cursor" });
            }

            query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
        }

        const docs = await UrlHistory.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1)
            .select("-__v")
            .lean();

        const hasMore = docs.length > limit;
        const history = hasMore ? docs.slice(0, limit) : docs;
        const nextCursor = hasMore ? history[history.length - 1]?._id?.toString() : null;

        return res.status(200).json({
            success: true,
            limit,
            count: history.length,
            hasMore,
            nextCursor,
            history,
        });
    } catch (error) {
        console.log("Error fetching URL history", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};