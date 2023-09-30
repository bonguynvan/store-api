const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  getAllProductsStatic,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products')

router.route('/static').get(getAllProductsStatic)
router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getSingleProduct).put(updateProduct).delete(deleteProduct)

module.exports = router
