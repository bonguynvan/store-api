const Product = require('../models/products')
const asyncWrapper = require('../middlewares/async')
const { NotFound, CustomError } = require('../error')
const getAllProductsStatic = asyncWrapper(async (req, res, next) => {
  const products = await Product.find({})
  res.status(200).json({ products, nbHits: products.length, msg: 'success' })
})

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const { featured, title, owner, sort, fields, numericFilters } = req.query
  const queryObject = {}
  if (featured) {
    queryObject.featured = featured
  }
  if (title) {
    queryObject.title = { $regex: title, $options: 'i' }
  }
  if (owner) {
    queryObject.owner = owner
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regex = /\b(>|>=|=|<=|<)\b/g
    const options = ['price', 'rating']
    let filters = numericFilters.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    )
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
    console.log(queryObject)
  }
  let products = Product.find(queryObject)
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    products = products.select(fieldsList)
  }
  if (sort) {
    const sortList = sort.split(',').join(' ')
    products = products.sort(sortList)
  } else {
    products = products.sort('createdAt')
  }

  //pagination

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  products = products.skip(skip).limit(limit)

  const results = await products
  res.status(200).json({ nbHits: results.length, results, msg: 'success' })
})

const createProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(200).json({ msg: 'Success', product })
})
const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id })
  if (!product) {
    return next(new CustomError(`Not found the task with id ${req.params.id}`))
  }
  res.status(200).json({ msg: 'Success', product })
})
const updateProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  })
  if (!product) {
    throw new NotFound(`Not found the task with id ${req.params.id}`)
  }
  res.status(200).json({ msg: 'Success' })
})
const deleteProduct = asyncWrapper(async (req, res, next) => {
  let product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    throw new NotFound(`Not found the task with id ${req.params.id}`)
  }
  res.status(200).json({ msg: 'Success', product })
})

module.exports = {
  getAllProducts,
  getAllProductsStatic,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
}
