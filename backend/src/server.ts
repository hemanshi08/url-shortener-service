import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/url.routes";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);
app.use(express.json());
connectDB();
app.use("/", router)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});