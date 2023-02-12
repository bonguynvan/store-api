require('dotenv').config()

const express = require('express')
const app = express()
const router = require('./routes/products')

//middleware
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.use(express.json())

app.get('/', (req, res, next) => {
  res.status(200).json({ msg: 'home page' })
})

app.use('/api/v1/products', router)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT
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
