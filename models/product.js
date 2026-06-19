import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    lowStockThreshold: {
        type: Number,
        min: 0,
        default: 5
    }
})

export default mongoose.model('Product', productSchema)