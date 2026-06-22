import express from "express"
import { register, login, refresh, logout } from "../controllers/auth.js"
import { isLoggedIn, verifyToken } from "../middleware/authenticator.js"
import expressRateLimiter from "express-rate-limiter"

const router = express.Router()

const authLimiter = expressRateLimiter({
    windowMs: 60 * 60 * 1000, 
    limit: 15, 
    message: 'Too many login attempts. Please try again in a few moments.'
})

router.post('/register', isLoggedIn, authLimiter, register)
router.post('/login', isLoggedIn, authLimiter, login)
router.post('/refresh', isLoggedIn, refresh)
router.post('/logout', verifyToken, logout)

export default router