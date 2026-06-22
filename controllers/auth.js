import User from "../models/user.js"
import RefreshToken from "../models/refreshToken.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import fs from "node:fs"
import path from "node:path"

const priv_key = fs.readFileSync('./secrets/priv.pem', 'utf-8')
const pub_key = fs.readFileSync('./pub.pem')

export const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: "Invalid Request", message: "Username or Password is missing" })
    }

    const user = await User.findOne({ username })
    if (!user) {
       return res.status(401).json({ error: "Incorrect Credentials", message: "Username or Password is incorrect." })
    }

    const verified = await bcrypt.compare(password, user.password)

    if (!verified) {
        return res.status(401).json({ error: "Incorrect Credentials", message: "Username or Password is incorrect." })
    }

    const payload = {
        username: user.username,
        role: user.role
    }

    const token = jwt.sign(payload, priv_key, { algorithm: 'RS256', expiresIn: '15m', issuer: 'inven-api' })
    const refreshToken = jwt.sign(payload, priv_key, { algorithm: 'RS256', expiresIn: '7d', issuer: 'inven-api' })

    const rtoken = await RefreshToken.create({ token: refreshToken })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 604800
    })

    res.json({ status: "Success", message: "Successfully Logged In", token: token })
}

export const register = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: "Invalid Request", message: "Username or Password is missing" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ username, password: hashedPassword })
    res.status(201).json({ status: "Success", message: `User ${user.username} successfully created!` })
}

export const refresh = async (req, res) => {
    const { refreshToken } = req.cookie

    if (!refreshToken) {
        return res.status(401).json({ error: "Missing Token", message: "Refresh Token is missing!" })
    }

    const rtoken = await RefreshToken.findOne({ token: refreshToken })

    const result = jwt.verify(rtoken.token, pub_key, { algorithms: ['RS256'] })

    const payload = {
        username: result.username,
        role: result.role
    }

    const newToken = jwt.sign(payload, priv_key, { algorithm: 'RS256', expiresIn: '15m', issuer: 'inven-api' })

    res.json({ token: newToken })
}

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies

    if (refreshToken) {
        const rToken = await RefreshToken.findOneAndDelete({ token: refreshToken })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })
    }

    res.json({ status: "Success", message: "Successfully logged out." })

}