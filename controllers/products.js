const Product = require('../models/products')

const getAllProductsStatic = async (req, res, next) => {
  const products = await Product.find({})
  res.status(200).json({ products, nbHits: products.length, msg: 'success' })
}

const getAllProducts = async (req, res, next) => {
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
}

module.exports = {
  getAllProducts,
  getAllProductsStatic,
}
