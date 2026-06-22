import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'staff'
    }
})

export default mongoose.model('User', userSchema)