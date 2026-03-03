import mongoose, { Schema, Document } from "mongoose";

export interface IUrl extends Document {
    shortId: string;
    longUrl: string;
    totalClicks: number;
}

const UrlSchema = new Schema<IUrl>(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        longUrl: {
            type: String,
            required: true,
        },
        totalClicks: {
            type: Number,
            default: 0,
            index: true,
        },
    },
    { timestamps: true }
);


export default mongoose.model<IUrl>("Url", UrlSchema);