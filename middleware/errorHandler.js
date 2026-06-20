export default (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || "Internal Error"

    if (err.code === 11000) {
        statusCode = 400
        message = `Duplicate Entry Error! Category is already present.`
    }

    else if (err.name === "ValidationError") {
        statusCode = 400,
        messgae = "Your input is not valid!"
    }

    res.status(statusCode).json({
        error: err.name,
        message: message,
    })
}