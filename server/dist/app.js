import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import indexRoute from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
}));
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
app.use("/api/v1", indexRoute);
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
    });
});
app.use(errorMiddleware);
app.listen(port, () => console.log("Server is working on Port:" + port + " in " + envMode + " Mode."));
