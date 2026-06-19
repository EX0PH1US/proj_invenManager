import mongoose from "mongoose"
import slugify from "slugify"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
})

export default mongoose.model('Category', categorySchema)