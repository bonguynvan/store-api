const { StatusCodes } = require('http-status-codes')
const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not found for this route' })
}

module.exports = notFound
