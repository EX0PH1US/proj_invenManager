import express from "express"
import { register, login, refresh, logout } from "../controllers/auth.js"
import { isLoggedIn, verifyToken } from "../middleware/authenticator.js"

const router = express.Router()

router.post('/register', isLoggedIn, register)
router.post('/login', isLoggedIn, login)
router.post('/refresh', isLoggedIn, refresh)
router.post('/logout', verifyToken, logout)

export default router