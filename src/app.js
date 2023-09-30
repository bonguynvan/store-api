require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const productRouter = require('./routes/products')
const loginRouter = require('./routes/login')

const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.use(express.json())

app.get('/', (req, res, next) => {
  res.status(200).json({ msg: 'home page' })
})

// use router
app.use('/api/v1', loginRouter)
app.use('/api/v1/products', productRouter)

// use middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000
const connectDB = require('./db/connectdb')
const mongoURI = process.env.MONGO_URI
const start = async () => {
  try {
    // connect DB
    await connectDB(mongoURI)
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
