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

    const product = await Product.create({ name, sku, quantity, lowStockThreshold, category: _category })
    res.status(201).json({ status: "Success", message: `Product ${ product.name }, SKU: ${ product.sku } has been added to inventory.` })
}

export const getProduct = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.limit) || 10

    
    const skipIdx = (page - 1) * size

    const query = {}
    const { category } = req.query
    if (category) {
        const _category = await Category.findOne({ slug: category })
        if (_category) {
            query.category = _category._id
        } else {
            query.category = null
        }
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 }).skip(skipIdx).limit(size)
    const totalDocuments = await Product.countDocuments(query)
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

export const editProduct = async (req, res) => {
    const { id } = req.params 
    const { category, name, quantity, sku, lowStockThreshold } = req.body

    if (!id) {
        return res.status(400).json({ error: "Empty Parameter", message: "ID parameter is empty!" })
    }

    const _category = await Category.findOne({ name: category })
    if (!_category) {
        return res.status(400).json({ error: "Category Invalid", message: "Category was not found! Ask admin to add the category." })
    }

    const product = await Product.findByIdAndUpdate(id, { name, quantity, sku, lowStockThreshold, category: _category._id }, { returnDocument: 'before', runValidators: true })
    if (!product) {
        return res.status(404).json({ error: "Cannot Find Product", message: "Product does not exist in inventory." })
    }
    res.json({ status: "Success", message: `Product ${ product.name }, SKU: ${ product.sku } has been updated.` })
}

export const deleteProduct = async (req, res) => {

    const { role } = req.user

    if (role !== 'admin') {
        return res.status(403).json({ error: "Forbidden", message: "Current User does not have privelages for deleting a product." })
    }

    const { id } = req.params
    
    if (!id) {
        return res.status(400).json({ error: "ID Not Found", message: "Product ID was not sent in the request." })
    }

    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        return res.status(404).json({ error: "Cannot Find Product", message: "Product does not exist in inventory." })
    }
    res.json({ status: "Success", message: `Product ${ product.name }, SKU: ${ product.sku } has been deleted.` })
}

export const getLowStockProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.limit) || 10

    
    const skipIdx = (page - 1) * size

    const query = { "$expr": { "$lte": [ "$quantity", "$lowStockThreshold" ] } }
    const { category } = req.query
    if (category) {
        const _category = await Category.findOne({ slug: category })
        if (_category) {
            query.category = _category._id
        } else {
            query.category = null
        }
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 }).skip(skipIdx).limit(size)
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