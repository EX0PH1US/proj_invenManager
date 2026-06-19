import express from "express"
import Category from "../models/category.js"
import Product from "../models/product.js"
import slugify from "slugify"

const router = express.Router()

router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.limit) || 10
    
    const skipIdx = (page - 1) * size

    try {
        const products = await Product.find().sort({ createdAt: -1 }).skip(skipIdx).limit(size)
        const totalDocuments = await Product.countDocuments()
        const totalCount = Math.ceil(totalDocuments / size)
        res.json({ data: products, 
            meta: {
                totalItems: totalDocuments,
                currentPage: page,
                totalPages: totalCount,
                limit: size
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "GET Error", message: "Error fetching products" })
    }
})

router.post('/add/category', async (req, res) => {
    const { name } = req.body
    
    if (!name) {
        return res.status(400).json({ error: "Invalid Request", message: "You did not provide a name for the category" })
    }

    try {
        const slug = slugify(name, { lower: true, strict: true })
        const category = await Category.create({ name, slug })
        res.status(201).json({ status: "Success", message: `Category ${ category.name } has been created. Slug: ${ category.slug }` })
    } catch (err) {

        if (err.code === 11000) {
            console.error(err.message)
            return res.status(400).json({ error: "Duplicate Found", message: "Category already exists!" })
        }

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

export default router