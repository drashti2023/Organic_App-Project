const Review = require('../models/review');
const { validationResult } = require('express-validator');

const GetAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('product user');
        res.status(200).send(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const NewReview = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.product || !req.body.user || !req.body.rating) {
        return res.status(400).json({ errors: [{ msg: 'Product, User, and Rating are required' }] });
    }
    try {
        const review = new Review(req.body);
        const result = await review.save();
        res.status(201).send(result);
    } catch (err) {
        console.error('Error creating new review:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const GetReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('product user');
        if (!review) {
            return res.status(404).send({ error: 'Review Not Found' });
        }
        res.status(200).send(review);
    } catch (err) {
        console.error('Error fetching review by ID:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

const UpdateReviewById = async (req, res) => {
    const errors = validationResult(req);
    if (!req.body.product || !req.body.user || !req.body.rating) {
        return res.status(400).json({ errors: [{ msg: 'Product, User, and Rating are required' }] });
    }
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).send({ error: 'Review Not Found' });
        }
        Object.assign(review, req.body);
        const result = await review.save();
        res.status(200).send(result);
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(400).send({ error: 'Bad Request' });
    }
};

const DeleteReviewById = async (req, res) => {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Review Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = { GetAllReviews, NewReview, GetReviewById, UpdateReviewById, DeleteReviewById };
