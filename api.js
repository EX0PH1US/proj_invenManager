import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors"

const app = express()

try {
    await mongoose.connect(process.env.URL)
    console.log('Connected to Database')
} catch (err) {
    console.error(err)
}

app.listen(3000, () => {
    console.log("http://localhost:3000")
})