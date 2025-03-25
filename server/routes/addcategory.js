const express = require('express');
const {GetAllCategories, NewCategory, GetCategoryById, UpdateCategoryById, DeleteCategoryById} = require("../controller/CategoryController")

const router = express.Router();
router.use(express.json());

router.get('/', GetAllCategories);

router.post('/', NewCategory);

router.get('/:id', GetCategoryById);

router.put('/:id', UpdateCategoryById);

router.delete('/:id', DeleteCategoryById);

module.exports = router;