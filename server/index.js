const express = require('express');
const mongoose = require('mongoose');
require ('dotenv').config();
const cors = require('cors');

const addblog = require('./routes/addblog');
const addcart = require('./routes/addcart');
const addcategory = require('./routes/addcategory');                                                                
const addorder = require('./routes/addorder');
const addproduct = require('./routes/addproduct');
const addreview = require('./routes/addreview');
const adduser = require('./routes/adduser');
const addwishlist = require('./routes/addwishlist');
const bodyParser = require ('body-parser');
const path = require('path');


if (!process.env.dbUrl || !process.env.PORT) {
    console.error('Error: Missing required environment variables (dbUrl or PORT)');
    process.exit(1);
}

mongoose.connect(process.env.dbUrl).then(()=>{
    console.log('Connected to db');
    
    const app=express();
    app.use(cors());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(express.json());
    app.use('/products-images', express.static(path.join(__dirname, 'products-images')));
    
    app.use('/categories',addcategory);
    app.use('/users',adduser);
    app.use('/blogs',addblog);
    app.use('/carts',addcart);
    app.use('/orders',addorder);
    app.use('/products',addproduct);
    app.use('/reviews',addreview);
    app.use('/wishlists',addwishlist);
    
    const port = process.env.PORT || 5500;

    app.listen(port,()=>{
        console.log('Server is running on port 5500');
    });

}).catch((err)=>{
    console.error('Database connection error:',err);
    process.exit(1);
});