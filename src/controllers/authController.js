const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        path: "/"
    });
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};


// Register User

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, mpin } = req.body;

        if (!name || !email || !password || !phone || !mpin) {
            return res.status(400).json({
                message: "Name, email, password, phone and MPIN are required"
            });
        }

        if (String(mpin).length !== 4) {
            return res.status(400).json({
                message: "MPIN must be 4 digits"
            });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        const existUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { phone }]
        });

        if (existUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedMpin = await bcrypt.hash(mpin, 10);

        const sanitizedEmail = normalizedEmail;
        const upiId = `${sanitizedEmail.split("@")[0]}@phonepe`;

        const user = await User.create({
            name,
            email: sanitizedEmail,
            password: hashedPassword,
            phone,
            upiId,
            mpin: hashedMpin
        });

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            upiId: user.upiId,
            balance: user.balance,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login User

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email).toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            upiId: user.upiId,
            balance: user.balance,
            hasMpinSet: !!user.mpin,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Setup MPIN

const setupMpin = async (req, res) => {
    try {
        const { mpin } = req.body;

        if (!mpin || mpin.length !== 4) {
            return res.status(400).json({
                message: "MPIN must be 4 digits"
            });
        }

        const hashedMpin = await bcrypt.hash(mpin, 10);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                mpin: hashedMpin
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "MPIN set successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get User Profile

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -mpin");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    setupMpin,
    getUserProfile
};