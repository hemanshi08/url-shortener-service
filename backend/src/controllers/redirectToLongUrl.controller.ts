import { Request, Response } from "express";
import { Url, UrlHistory } from "../models";
import { UAParser } from "ua-parser-js";

export const redirectToLongUrl = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;
        console.log(shortId);
        if (!shortId) {
            return res.status(400).json({ message: "Short ID is required" });
        }
        const shortIdStr = shortId as string;
        const fetchUrl = await Url.findOne({ shortId: shortIdStr });
        if (!fetchUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        await Url.updateOne(
            { _id: fetchUrl._id },
            { $inc: { totalClicks: 1 } }
        );

        const xForwardedFor = req.headers["x-forwarded-for"];
        const ipAddress =
            (typeof xForwardedFor === "string"
                ? xForwardedFor.split(",")[0]
                : Array.isArray(xForwardedFor)
                    ? xForwardedFor[0]
                    : req.socket.remoteAddress || req.ip) ?? "";

        const userAgentRaw = req.get("User-Agent") || "";
        const parser = new UAParser(userAgentRaw);
        const result = parser.getResult();

        await UrlHistory.create({
            urlId: fetchUrl._id,
            shortId: fetchUrl.shortId,
            ipAddress,
            userAgent: userAgentRaw,
            os: result.os.name || "Unknown",
            browser: result.browser.name || "Unknown",
            device: result.device.model || result.device.type || "desktop",
        });
        return res.redirect(fetchUrl.longUrl);
    } catch (error) {
        console.log("Error redirecting to long URL", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};