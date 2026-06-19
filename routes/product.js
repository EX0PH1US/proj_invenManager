import express from "express"
import Category from "../models/category.js"
import Product from "../models/product.js"

const router = express.Router()

router.post('/add/category', async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ error: "Bad Request", message: "Server could not process your request." })
    }

    try {
        
    }
})