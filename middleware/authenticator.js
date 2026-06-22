import jwt from "jsonwebtoken"
import fs from "node:fs"

const pub_key = await fs.readFileSync('./pub.pem', 'utf-8')

export const verifyToken = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(404).json({ error: "Unauthorized", message: "You must be logged in, in order to conduct this action." })
    }

    const authHeader = req.headers.authorization.split(' ')
    if (authHeader[0] !== 'Bearer' || !authHeader[1]) {
        return res.status(404).json({ error: "Unauthorized", message: "You must be logged in, in order to conduct this action." })
    }

    const token = authHeader[1]

    const verified = await jwt.verify(token, pub_key, { algorithms: ['RS256'] })

    req.user = { username: verified.username, role: verified.role }

    next()
}

export const isLoggedIn = async (req, res, next) => {

    if (!req.headers.authorization) {
        return next()
    }

    const authHeader = req.headers.authorization.split(' ')
    if (authHeader[0] !== 'Bearer' || !authHeader[1]) {
        return next()
    }

    const token = authHeader[1]

    try {
        const result = await jwt.verify(token, pub_key, { algorithms: ['RS256'] })
        return res.status(400).json({ error: "Already Logged In", message: `User ${ result.username } is already logged in!` })
    } catch (err) {
        next()
    }
}