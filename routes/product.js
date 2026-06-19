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
        const category = await Category.create({ name })
        res.status(201).json({ status: "Success", message: `Category ${ category.name } has been created` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server Error", message: "Creation of Category faild." })
    }
})

router.post('/add/product', async (req, res) => {
    const { name, sku, quantity, category, lowStockThreshold } = req.body 

    try {
        const _category = await Category.findOne({ name: category })
        if (!_category) {
            return res.status(400).json({ error: "Category Invalid", message: "Category was not found! Ask admin to add the category." })
        }
        const product = await Product.create({ name, sku, quantity, lowStockThreshold })
        res.status(201).json({ status: "Success", message: `Product ${ product.name }, SKU: ${ product.sku } has been added to inventory.` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server Error", message: "Creation of Product failed." })
    }
})