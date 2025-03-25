const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        minlength: 25, 
        maxlength: 500
    },
    image: {
        url: {
            type: String,
            required: true // URL of the image
        },
        altText: {
            type: String,
            maxlength: 100 // Alt text for accessibility
        }
    }
},{timestamps:true});

module.exports = mongoose.model('Category', categorySchema);