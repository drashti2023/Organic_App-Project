const Order = require('../models/order');
const { validationResult } = require('express-validator');

const GetAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user products.product');
        res.status(200).send(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const NewOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.user || !req.body.products || !req.body.totalAmount) {
        return res.status(400).json({ errors: [{ msg: 'All fields are required' }] });
    }
    try {
        const order = new Order(req.body);
        const result = await order.save();
        res.status(201).send(result);
    } catch (err) {
        console.error('Error creating new order:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const GetOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user products.product');
        if (!order) {
            return res.status(404).send({ error: 'Order Not Found' });
        }
        res.status(200).send(order);
    } catch (err) {
        console.error('Error fetching order by ID:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const UpdateOrderById = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.user || !req.body.products || !req.body.totalAmount) {
        return res.status(400).json({ errors: [{ msg: 'User, Products, and Total Amount are required' }] });
    }
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ error: 'Order Not Found' });
        }
        Object.assign(order, req.body);
        const result = await order.save();
        res.status(200).send(result);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const DeleteOrderById = async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Order Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { GetAllOrders, NewOrder, GetOrderById, UpdateOrderById, DeleteOrderById };
