import Joi from "joi"

const productSchema = Joi.object({
    name: Joi.string().min(3).max(50).alphanum().required(),
    sku: Joi.string().alphanum().required(),
    quantity: Joi.number().min(0).required(),
    lowStockThreshold: Joi.number().min(0),
    category: Joi.string().min(1).max(30),
}).required()

const categorySchema = Joi.object({
    name: Joi.string().min(1).max(30).required()
}).required()

export const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body)

    if (error) {
        const err_message = error.details.map((err) => err.message).join(',')
        const err = new Error(err_message)
        err.name = 'ValidationError'
        throw err
    } else {
        next()
    }
}

export const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body)

    if (error) {
        const err_message = error.details.map((err) => err.message).join('-')
        const err = new Error(err_message)
        err.name = 'ValidationError'
        throw err
    } else {
        next()
    }
}