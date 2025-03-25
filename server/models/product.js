const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        minlength: 25,
        maxlength: 500
    },
    price: {
        type: Number,
        min:0,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        min:0,
        required: true
    },
    imageUrl: {
        type: String,
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isMostPopular: {
        type: Boolean,
        default: false
    },
    isJustArrived: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);