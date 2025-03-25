const Product = require('../models/product');
const { validationResult } = require('express-validator');

const GetAllProducts = async (req, res) => {
    try {
        let filter = {};

        if (req.query.bestseller === 'true') filter.isBestSeller = true;
        if (req.query.popular === 'true') filter.isMostPopular = true;
        if (req.query.latest === 'true') filter.isJustArrived = true;
        if (req.query.featured === 'true') filter.isFeatured = true;

        const products = await Product.find(filter);
        
        if (!products.length) {
            return res.status(404).json({ message: "No products found for the given filter." });
        }

        res.json(products);
    } catch (err) {
        console.error('Error fetching filtered products:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const NewProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.name || !req.body.price || !req.body.category) {
        return res.status(400).json({ errors: [{ msg: 'Name, Price, and Category are required' }] });
    }
    try {
        const product = new Product(req.body);
        const result = await product.save();
        res.status(201).send(result);
    } catch (err) {
        console.error('Error creating new product:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const GetProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('category');
        
        if (!product) {
            return res.status(404).send({ error: 'Product Not Found' });
        }

        res.status(200).send(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const UpdateProductById = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.name || !req.body.price || !req.body.category) {
        return res.status(400).json({ errors: [{ msg: 'Name, Price, and Category are required' }] });
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product Not Found' });
        }
        Object.assign(product, req.body);
        const result = await product.save();
        res.status(200).send(result);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const DeleteProductById = async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Product Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const GetProductByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const products = await Product.find({ category: categoryId }); 
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  };

module.exports = { GetAllProducts, NewProduct, GetProductById, UpdateProductById, DeleteProductById, GetProductByCategory };
