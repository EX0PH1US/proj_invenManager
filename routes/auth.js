import express from "express"
import { register, login, refresh, logout } from "../controllers/auth.js"
import { isLoggedIn, verifyToken } from "../middleware/authenticator.js"
import { rateLimit } from "express-rate-limiter"

const router = express.Router()

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    keyGenerator: (req, res) => req.body.username || req.ip,
    handler: (req, res, next, options) => {
        res.status(429).json({ error: "Too Many Attempts", message: "Too many login/registration attempts, try again later in a few moments." })
    }
})

router.post('/register', isLoggedIn, authLimiter, register)
router.post('/login', isLoggedIn, authLimiter, login)
router.post('/refresh', isLoggedIn, refresh)
router.post('/logout', verifyToken, logout)

export default router