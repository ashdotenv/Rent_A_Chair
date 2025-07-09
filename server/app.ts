import express from "express"
import dotnev from "dotenv"
import cookieParser = require("cookie-parser")
import { errorMiddleware } from "./middleware/error"
dotnev.config()
import fileUpload from "express-fileupload"
import indexRoutes from "./routes/index.routes"
export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
)
app.use("/api/v1", indexRoutes)
app.use(errorMiddleware)
