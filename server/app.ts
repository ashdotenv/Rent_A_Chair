import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorMiddleware } from "./middleware/error"
import fileUpload from "express-fileupload"
import indexRoutes from "./routes/index.routes"

dotenv.config()

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
)
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
)
app.use("/api/v1", indexRoutes)
app.use(errorMiddleware)
