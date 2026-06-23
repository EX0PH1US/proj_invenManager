import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import inventoryRouter from "./routes/inventory.js"
import cors from "cors"
import morgon from "morgan"
import errorHandler from "./middleware/errorHandler.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"

const app = express()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 250, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 64, 
    handler: (req, res, next, options) => {
        res.status(429).json({ error: "Too Many Requests", message: "Too many requests were sent to the server, try again in a few moments." })
    }
})

app.use(cors({
    origin: process.env.FRONT || 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true
}))

app.use(limiter)
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use(morgon('common'))

app.get('/', (req, res) => {
    res.json({ ping: "pong" })
})

app.use('/', inventoryRouter)
app.use('/', authRouter)

try {
    await mongoose.connect(process.env.URL)
    console.log('Connected to Database')
} catch (err) {
    console.error(err)
}

app.use ((req, res, next) => {
    res.status(404).json({ error: "Not Found", message: `Cannot ${req.method} ${req.originalUrl} on this server.` })
})

app.use(errorHandler)

app.listen(3000, () => {
    console.log("Working...")
})