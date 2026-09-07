const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

// @desc    Add Money
// @route   POST /api/wallet/add-money
// @access  Private

const addMoney = async (req, res) => {
    try {
        const { amount, mpin } = req.body;
        const userId = req.user?._id || req.user?.id;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.mpin) {
            return res.status(400).json({
                message: "MPIN is not set yet"
            });
        }

        // Verify MPIN
        const isMatch = await bcrypt.compare(String(mpin), user.mpin);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid MPIN"
            });
        }

        // Add balance
        user.balance += Number(amount);

        await user.save();

        // Save transaction
        const transaction = await Transaction.create({
            sender: user._id,
            receiver: user._id,
            amount,
            type: "ADD_MONEY",
            status: "SUCCESS"
        });

        res.status(200).json({
            success: true,
            message: "Money added successfully",
            balance: user.balance,
            transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const payBill = async (req, res) => {
    try {
        const { billerName, amount, mpin } = req.body;
        const userId = req.user?._id || req.user?.id;

        if (!billerName) {
            return res.status(400).json({
                message: "Biller name is required"
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.mpin) {
            return res.status(400).json({
                message: "MPIN is not set yet"
            });
        }

        const isMatch = await bcrypt.compare(String(mpin), user.mpin);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid MPIN"
            });
        }

        if (user.balance < Number(amount)) {
            return res.status(400).json({
                message: "Insufficient Balance"
            });
        }

        user.balance -= Number(amount);
        await user.save();

        const transaction = await Transaction.create({
            sender: user._id,
            receiver: user._id,
            billerName,
            amount: Number(amount),
            type: "BILL_PAYMENT",
            status: "SUCCESS",
            note: `Bill payment to ${billerName}`
        });

        res.status(200).json({
            success: true,
            message: "Bill paid successfully",
            balance: user.balance,
            transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addMoney,
    payBill
};