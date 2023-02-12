const notFound = (req, res) => {
    res.status(404).json({msg: 'Not found for this route'})
}

module.exports = notFound