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

const app = express()

app.use(cors({
    origin: process.env.FRONT || 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true
}))

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use(morgon('common'))

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
    console.log("Working...")
})