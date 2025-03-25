const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {              
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled', 'processing'],
        default: 'pending',
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'COD',
        required: true
    },
    
},{timestamps:true});

module.exports = mongoose.model('Order', orderSchema);