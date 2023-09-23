const express = require('express')
const router = express.Router()
const { getProducts, addProduct, updateProduct, } = require('../../controllers/merchant/index')
const check_auth = require('../../middleware/check_auth')


router.get('/', check_auth, getProducts);
router.post('/', check_auth, addProduct);
router.put('/:productId', check_auth, updateProduct);
module.exports = router