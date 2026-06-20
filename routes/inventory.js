import express from "express"
import { registerCategory, registerProduct, getProduct } from "../controllers/products.js"
const router = express.Router()

router.get('/products', getProduct)
router.post('/add/category', registerCategory)
router.post('/add/product', registerProduct)

export default router