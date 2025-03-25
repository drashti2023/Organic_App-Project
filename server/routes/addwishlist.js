const express = require('express');
const { GetAllWishLists, GetWishListByUserId, NewWishList, DeleteWishListById, RemoveProductFromWishlist } = require('../controller/WishlistController');

const router = express.Router();
router.use(express.json());

router.get('/', GetAllWishLists);

router.get('/user/:userId', GetWishListByUserId);

router.post('/', NewWishList);

router.post('/remove', RemoveProductFromWishlist);

router.delete('/:id', DeleteWishListById);

module.exports = router;