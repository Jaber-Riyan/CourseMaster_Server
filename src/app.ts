import express, { type Application, type Request, type Response } from "express"
import morgan from 'morgan'
import cors from "cors"
import cookieParser from 'cookie-parser'
import expressSession from "express-session"
import { envVars } from './app/config/env'
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import { notFound } from "./app/middlewares/notFound"
import { router } from "./app/routes"


export const app: Application = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Necessary Middleware
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1", router)

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Course Master System Backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)
