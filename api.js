import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import inventoryRouter from "./routes/inventory.js"
import cors from "cors"
import morgon from "morgan"
import errorHandler from "./middleware/errorHandler.js"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(morgon('dev'))

app.use('/', inventoryRouter)

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