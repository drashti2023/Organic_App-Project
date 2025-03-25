const Wishlist = require('../models/wishlist');

const GetAllWishLists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find().populate('user products');
        res.status(200).json(wishlists);
    } catch (err) {
        console.error('Error fetching wishlists:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const GetWishListByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
        if (!wishlist) {
            return res.status(200).json({ products: [] }); // ✅ Return empty array if no wishlist
        }

        res.status(200).json(wishlist);
    } catch (err) {
        console.error('Error fetching wishlist by user ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const NewWishList = async (req, res) => {
    try {
        const { user, products } = req.body;
        if (!user || !products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'User and Products (array) are required' });
        }

        let wishlist = await Wishlist.findOne({ user });

        if (!wishlist) {
            wishlist = new Wishlist({ user, products });
        } else {
            const productSet = new Set(wishlist.products.map(p => p.toString()));
            const newProducts = products.filter(prodId => !productSet.has(prodId));

            if (newProducts.length === 0) {
                return res.status(200).json({ message: 'No new products added', wishlist });
            }

            wishlist.products.push(...newProducts);
        }

        await wishlist.save();
        const updatedWishlist = await Wishlist.findOne({ user }).populate('products'); // ✅ Populate products
        res.status(200).json({ message: 'Wishlist updated', wishlist: updatedWishlist });
    } catch (err) {
        console.error('Error updating wishlist:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const RemoveProductFromWishlist = async (req, res) => {
    try {
        const { user, productId } = req.body;

        if (!user || !productId) {
            return res.status(400).json({ error: 'User and Product ID are required' });
        }

        const wishlist = await Wishlist.findOne({ user });

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        const initialLength = wishlist.products.length;
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);

        if (wishlist.products.length === initialLength) {
            return res.status(400).json({ error: 'Product not found in wishlist' });
        }

        await wishlist.save();
        const updatedWishlist = await Wishlist.findOne({ user }).populate('products'); // ✅ Populate products
        res.status(200).json({ message: 'Product removed from wishlist', wishlist: updatedWishlist });
    } catch (err) {
        console.error('Error removing product from wishlist:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteWishListById = async (req, res) => {
    try {
        const result = await Wishlist.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Wishlist Not Found' });
        }
        res.status(200).json({ message: 'Wishlist deleted', result });
    } catch (err) {
        console.error('Error deleting wishlist:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { 
    GetAllWishLists, 
    GetWishListByUserId,
    NewWishList, 
    RemoveProductFromWishlist,
    DeleteWishListById
};