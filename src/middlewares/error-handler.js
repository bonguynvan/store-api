const { CustomError} = require('../error/CustomError')
const errorHandlerMiddleware = async (err, req, res, next) => {
    if(err instanceof CustomError) {
        return res.status(err.status).json({msg: err.message})
    }
    return res.status(500).json({msg: `Something went wrong, please try again!`})
}

module.exports = errorHandlerMiddleware