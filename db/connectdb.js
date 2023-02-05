const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async (url) => mongoose.connect(url).then(() => {
    console.log('DB connected')
})

module.exports = connectDB

