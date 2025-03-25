const express = require('express');
const { GetAllReviews, NewReview, GetReviewById, UpdateReviewById, DeleteReviewById } = require('../controller/ReviewController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllReviews);

router.post('/', NewReview);

router.get('/:id', GetReviewById);

router.put('/:id', UpdateReviewById);

router.delete('/:id', DeleteReviewById);

module.exports = router;
