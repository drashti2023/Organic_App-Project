const Category = require('../models/category');
const { validationResult } = require('express-validator');

const GetAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).send(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const NewCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ errors: [{ msg: 'Name and Description are required' }] });
    }
    try {
        const category = new Category(req.body);
        const result = await category.save();
        res.status(201).send(result);
    } catch (err) {
        console.error('Error creating new category:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const GetCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({ error: 'Category Not Found' });
        }
        res.status(200).send(category);
    } catch (err) {
        console.error('Error fetching category by ID:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const UpdateCategoryById = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ errors: [{ msg: 'Name and Description are required' }] });
    }
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({ error: 'Category Not Found' });
        }
        Object.assign(category, req.body);
        const result = await category.save();
        res.status(200).send(result);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const DeleteCategoryById = async (req, res) => {
    try {
        const result = await Category.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Category Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { GetAllCategories, NewCategory, GetCategoryById, UpdateCategoryById, DeleteCategoryById };
