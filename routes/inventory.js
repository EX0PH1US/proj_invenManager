import express from "express"
import { registerCategory, registerProduct, getProduct, editProduct, deleteProduct, getLowStockProducts } from "../controllers/products.js"
import { verifyToken } from "../middleware/authenticator.js"
import { validateCategory, validateProduct } from "../middleware/validator.js"
const router = express.Router()

router.get('/products', getProduct)
router.post('/add/category', validateCategory, verifyToken, registerCategory)
router.post('/add/product', validateProduct, verifyToken, registerProduct)
router.put('/edit/product/:id', validateProduct, verifyToken, editProduct)
router.delete('/delete/:id', verifyToken, deleteProduct)
router.get('/low-stock', getLowStockProducts)

export default router