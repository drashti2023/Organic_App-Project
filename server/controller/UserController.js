const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure .env variables are loaded

// Get all users
const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("orderHistory");
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Register new user
const RegisterUser = async (req, res) => {
    const { username, name, email, password, role, address } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Username, email, and password are required." });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Username or Email already in use." });
        }

        // const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            name,
            email: email.toLowerCase(),
            password,
            role: role || "customer",
            address: address || []
        });

        await newUser.save();

        res.status(201).json({ 
            msg: "User registered successfully.",
            user: { username, name, email, role, address }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const LoginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
        });

        if (!user) {
            return res.status(401).json({ isvalid: false, msg: "Invalid Username/Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ isvalid: false, msg: "Invalid Username/Email or Password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env file");
            return res.status(500).json({ isvalid: false, msg: "Server Error: JWT_SECRET missing" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            isvalid: true, 
            msg: "Login successful", 
            token,
            user: { 
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ isvalid: false, msg: "Internal Server Error" });
    }
};


// Get user by ID
const GetUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("orderHistory");
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update user
const UpdateUser = async (req, res) => {
    try {
        if (!req.body.username || !req.body.email) {
            return res.status(400).json({ msg: "Username and Email are required." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        Object.assign(user, req.body);
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(400).json({ error: "Bad Request" });
    }
};

// Delete user
const DeleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.status(200).json({ msg: "User deleted successfully." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    GetAllUsers,
    RegisterUser,
    LoginUser,
    GetUserById,
    UpdateUser,
    DeleteUser,
};