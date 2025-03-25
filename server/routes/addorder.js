const express = require('express');
const { GetAllOrders, NewOrder, GetOrderById, UpdateOrderById, DeleteOrderById } = require('../controller/OrderController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllOrders);

router.post('/', NewOrder);

router.get('/:id', GetOrderById);

router.put('/:id', UpdateOrderById);

router.delete('/:id', DeleteOrderById);

module.exports = router;