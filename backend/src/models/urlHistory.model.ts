import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUrlHistory extends Document {
    urlId: Types.ObjectId;
    shortId: string;
    ipAddress: string;
    userAgent: string;
    os: string;
    browser: string;
    device: string;
    createdAt: Date;
}

const UrlHistorySchema = new Schema<IUrlHistory>(
    {
        urlId: {
            type: Schema.Types.ObjectId,
            ref: "Url",
            required: true,
            index: true,
        },
        shortId: {
            type: String,
            required: true,
            index: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        os: {
            type: String,
            required: true,
        },
        browser: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

UrlHistorySchema.index({ shortId: 1, createdAt: -1 });
UrlHistorySchema.index({ urlId: 1, createdAt: -1 });
UrlHistorySchema.index({ urlId: 1, ipAddress: 1 });
UrlHistorySchema.index({ urlId: 1, browser: 1 });
UrlHistorySchema.index({ urlId: 1, os: 1 });

UrlHistorySchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 }
);
export default mongoose.model<IUrlHistory>(
    "UrlHistory",
    UrlHistorySchema
);