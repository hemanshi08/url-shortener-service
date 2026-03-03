import { Request, Response } from "express";
import { Url, UrlHistory } from "../models";
import mongoose from "mongoose";

export const getUrlAnalytics = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;

        if (!shortId) {
            return res.status(400).json({
                success: false,
                message: "Short ID is required",
            });
        }

        const url = await Url.findOne({ shortId }).lean();

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found",
            });
        }

        const urlObjectId = new mongoose.Types.ObjectId(url._id);

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const [
            totalClicks,
            uniqueVisitorsAgg,
            browserStats,
            osStats,
            recentClicks,
            dailyTimeline,
        ] = await Promise.all([
            UrlHistory.countDocuments({ urlId: urlObjectId }),

            UrlHistory.aggregate([
                { $match: { urlId: urlObjectId } },
                { $group: { _id: "$ipAddress" } },
                { $count: "uniqueVisitors" },
            ]),

            UrlHistory.aggregate([
                { $match: { urlId: urlObjectId } },
                {
                    $group: {
                        _id: { $ifNull: ["$browser", "Unknown"] },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),

            UrlHistory.aggregate([
                { $match: { urlId: urlObjectId } },
                {
                    $group: {
                        _id: { $ifNull: ["$os", "Unknown"] },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),

            UrlHistory.find({ urlId: urlObjectId })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("ipAddress browser os createdAt -_id")
                .lean(),

            UrlHistory.aggregate([
                {
                    $match: {
                        urlId: urlObjectId,
                        createdAt: { $gte: last30Days },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },
                        clicks: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        return res.status(200).json({
            success: true,
            shortId,
            originalUrl: url.longUrl,

            summary: {
                totalClicks,
                uniqueVisitors: uniqueVisitorsAgg[0]?.uniqueVisitors || 0,
            },

            browsers: browserStats,
            operatingSystems: osStats,
            timeline: dailyTimeline,
            recentActivity: recentClicks,
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};