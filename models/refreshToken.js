import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true
    }
})

export default mongoose.model('RefreshToken', refreshTokenSchema)