const express = require('express');
const { GetAllCart, NewAddToCart, UpdateCartById, DeleteCartById, GetCartByUserId, RemoveCartItem } = require('../controller/CartController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllCart);

router.get('/user/:userId', GetCartByUserId); 

router.post('/add', NewAddToCart);

router.put('/:id', UpdateCartById);

router.delete('/:userId', DeleteCartById);

router.delete('/:userId/product/:productId', RemoveCartItem);


module.exports = router;