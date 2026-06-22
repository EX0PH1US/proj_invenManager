import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import inventoryRouter from "./routes/inventory.js"
import cors from "cors"
import morgon from "morgan"
import errorHandler from "./middleware/errorHandler.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser"
import expressRateLimiter from "express-rate-limiter"

const app = express()

const rateLimit = expressRateLimiter({
    windowsMs: 15 * 60 * 1000,
    limit: 100, 
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: 'draft-8', 
    legacyHeaders: false
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(rateLimit)


app.use(morgon('dev'))

app.use('/', inventoryRouter)
app.use('/', authRouter)

try {
    await mongoose.connect(process.env.URL)
    console.log('Connected to Database')
} catch (err) {
    console.error(err)
}

app.use(errorHandler)

app.listen(3000, () => {
    console.log("http://localhost:3000")
})