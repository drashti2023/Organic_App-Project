const express = require('express');
const { GetAllUsers, GetUserById, UpdateUser, DeleteUser, LoginUser, RegisterUser } = require('../controller/UserController');
const router = express.Router();
router.use(express.json());

//CRUD routes  
router.post('/signup', RegisterUser);
router.post('/login',LoginUser);

router.get('/', GetAllUsers);
router.get('/:id', GetUserById);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);


module.exports = router;