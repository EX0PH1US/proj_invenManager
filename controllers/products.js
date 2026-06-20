import Product from "../models/product.js"
import Category from "../models/category.js"
import slugify from "slugify"

export const registerCategory = async (req, res) => {
    const { name } = req.body
    
    if (!name) {
        return res.status(400).json({ error: "Invalid Request", message: "You did not provide a name for the category" })
    }

    const slug = slugify(name, { lower: true, strict: true })
    const category = await Category.create({ name, slug })
    res.status(201).json({ status: "Success", message: `Category ${ category.name } has been created. Slug: ${ category.slug }` })
}

export const registerProduct = async (req, res) => {
    const { name, sku, quantity, category, lowStockThreshold } = req.body 

    const _category = await Category.findOne({ name: category })
    if (!_category) {
        return res.status(400).json({ error: "Category Invalid", message: "Category was not found! Ask admin to add the category." })
    }

    const product = await Product.create({ name, sku, quantity, lowStockThreshold })
    res.status(201).json({ status: "Success", message: `Product ${ product.name }, SKU: ${ product.sku } has been added to inventory.` })
}

export const getProduct = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.limit) || 10
    const category = req.query.category 
    
    const skipIdx = (page - 1) * size

    const categoryObj = await Category.find({ slug: category })

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
}