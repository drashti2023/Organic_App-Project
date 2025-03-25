const express = require('express');
const { GetAllBlogs, NewBlog, GetBlogById, UpdateBlogById, DeleteBlogById } = require('../controller/BlogController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllBlogs);

router.post('/', NewBlog);

router.get('/:id', GetBlogById);

router.put('/:id', UpdateBlogById);

router.delete('/:id', DeleteBlogById);

module.exports = router;