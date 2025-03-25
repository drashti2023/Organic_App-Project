const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { validationResult } = require('express-validator');

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
    return items.reduce((sum, item) => {
        // Ensure product is populated and has a price
        const productPrice = item.product?.price || 0;
        return sum + item.quantity * productPrice;
    }, 0);
};

// Get all carts
const GetAllCart = async (req, res) => {
    try {
        const carts = await Cart.find().populate('user items.product');
        res.status(200).json(carts);
    } catch (err) {
        console.error('❌ Error fetching carts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get cart by User ID
const GetCartByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        let cart = await Cart.findOne({ user: userId }).populate('user items.product');

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user: userId, items: [], totalAmount: 0 });
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error('❌ Error fetching cart by User ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add items to cart
const NewAddToCart = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       // console.error("❌ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    //console.log("🔍 Received add-to-cart request:", req.body);

    const { user, product, quantity } = req.body;
    if (!user || !product || !quantity) {
        //console.error("❌ Missing required fields");
        return res.status(400).json({ error: 'User, product, and quantity are required' });
    }

    try {
        const productId = new mongoose.Types.ObjectId(product);
        const userId = new mongoose.Types.ObjectId(user);

        // Fetch product details
        const productData = await Product.findById(productId);
        if (!productData) {
            //console.error("❌ Product not found!");
            return res.status(404).json({ error: 'Product not found' });
        }

        //console.log("✅ Product fetched:", productData);

        // Find or create cart for the user
        //let cart = await Cart.findOne({ user: userId });
        let cart = await Cart.findOne({ user: req.body.user }).populate('items.product');

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({
                //user: userId,
                //items: [{ product: productId, quantity }],
                //totalAmount: productData.price * quantity
                user: req.body.user,
                items: [{ product: req.body.product, quantity: req.body.quantity }],
                totalAmount: product.price * req.body.quantity
            });
        } else {
            // Check if the product already exists in the cart
            // const existingItem = cart.items.find(item => item.product.toString() === productId.toString());

            // if (existingItem) {
            //     existingItem.quantity += quantity;
            // } else {
            //     cart.items.push({ product: productId, quantity });
            // }
            const existingItem = cart.items.find(item => item.product._id.toString() === req.body.product);
            if (existingItem) {
                existingItem.quantity += req.body.quantity;
            } else {
                cart.items.push({ product: req.body.product, quantity: req.body.quantity });
            }

            // Recalculate totalAmount
            cart.totalAmount = calculateTotalAmount(cart.items);

            // Prevent NaN issues
            if (isNaN(cart.totalAmount)) {
                console.error("❌ totalAmount calculation failed, setting to 0");
                cart.totalAmount = 0;
            }
        }

        // Save the updated cart
        const result = await cart.save();
        //console.log("✅ Cart updated successfully:", result);
        res.status(201).json({ message: 'Cart updated successfully', cart: result });
    } catch (err) {
        console.error("❌ Error adding to cart:", err);
        res.status(400).json({ error: 'Bad Request' });
    }
};

// Update cart by ID
const UpdateCartById = async (req, res) => {
    const { user, items } = req.body;

    // ✅ Log the request body
    console.log("Received Update Request:", req.body);

    // ✅ Validate input
    if (!user || !items || !Array.isArray(items) || items.length === 0) {
        console.error("❌ Missing required fields in update request");
        return res.status(400).json({ error: 'User ID and at least one item are required' });
    }

    try {
        // ✅ Find the cart by user ID
        let cart = await Cart.findOne({ user }).populate('items.product');

        if (!cart) {
            console.error("❌ Cart not found for user:", user);
            return res.status(404).json({ error: 'Cart not found' });
        }

        // ✅ Log the existing cart
        console.log("Existing Cart Before Update:", cart);

        // ✅ Update the cart items
        cart.items = items;

        // ✅ Fix: Ensure we get product prices correctly before calculating totalAmount
        let totalAmount = 0;
        for (let item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                console.error("❌ Product not found:", item.product);
                return res.status(404).json({ error: 'Product not found' });
            }
            totalAmount += item.quantity * product.price;
        }

        cart.totalAmount = totalAmount;

        // ✅ Save the updated cart
        const updatedCart = await cart.save();

        console.log("✅ Cart updated successfully:", updatedCart);

        res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (err) {
        console.error("❌ Error updating cart:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Delete cart by id
const DeleteCartById = async (req, res) => {
    try {
        console.log("Delete request received for user:", req.params.userId); // Debugging

        const userId = req.params.userId; // Ensure userId is extracted correctly

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await Cart.findOneAndDelete({ user: userId });

        if (!result) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const RemoveCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Find the user's cart and populate the product details
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

        // Recalculate the total amount after removal
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { GetAllCart, GetCartByUserId, NewAddToCart, UpdateCartById, DeleteCartById, RemoveCartItem };
