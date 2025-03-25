const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true // URL of the image
        },
        altText: {
            type: String,
            maxlength: 100 // Alt text for accessibility
        }
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        minlength: 20,
        maxlength: 200,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true});

module.exports = mongoose.model('Blog', blogSchema);