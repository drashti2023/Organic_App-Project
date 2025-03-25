const express = require('express');
const { GetAllProducts, NewProduct, GetProductById, UpdateProductById, DeleteProductById, GetProductByCategory } = require('../controller/ProductController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllProducts);

router.post('/', NewProduct);

router.get('/:productId', GetProductById); //change to productId

router.put('/:id', UpdateProductById);

router.delete('/:id', DeleteProductById);

router.get("/categories/:categoryId", GetProductByCategory);

module.exports = router;