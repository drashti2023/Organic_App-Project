const Blog = require('../models/blog');
const { validationResult } = require('express-validator');

const GetAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author');
        res.status(200).send(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const NewBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.title || !req.body.content || !req.body.author) {
        return res.status(400).json({ errors: [{ msg: 'All fields are required' }] });
    }
    try {
        const blog = new Blog(req.body);
        const result = await blog.save();
        res.status(201).send(result);
    } catch (err) {
        console.error('Error creating new blog:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const GetBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author');
        if (!blog) {
            return res.status(404).send({ error: 'Blog Not Found' });
        }
        res.status(200).send(blog);
    } catch (err) {
        console.error('Error fetching blog by ID:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const UpdateBlogById = async (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({ errors: [{ msg: 'Title and Content are required' }] });
    }
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send({ error: 'Blog Not Found' });
        }
        Object.assign(blog, req.body);  
        const result = await blog.save();
        res.status(200).send(result);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const DeleteBlogById = async (req, res) => {
    try {
        const result = await Blog.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Blog Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { GetAllBlogs, NewBlog, GetBlogById, UpdateBlogById, DeleteBlogById };
