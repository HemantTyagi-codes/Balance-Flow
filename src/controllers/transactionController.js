const Transaction = require("../models/Transaction");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// @desc    Send Money
// @route   POST /api/transactions/send
// @access  Private
// ==========================================

const sendMoney = async (req, res) => {
    try {
        const { receiverUpiId, amount, mpin } = req.body;
        const senderId = req.user._id;

        // Validate MPIN
        if (!mpin) {
            return res.status(400).json({
                message: "MPIN is required"
            });
        }

        // Validate Amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        // Find Sender
        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({
                message: "Sender not found"
            });
        }

        // Verify MPIN
        const isMatch = await bcrypt.compare(mpin, sender.mpin);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid MPIN"
            });
        }

        // Find Receiver
        const receiver = await User.findOne({
            upiId: receiverUpiId
        });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        // Prevent Self Transfer
        if (sender._id.toString() === receiver._id.toString()) {
            return res.status(400).json({
                message: "You cannot send money to yourself"
            });
        }

        // Check Balance
        if (sender.balance < amount) {
            return res.status(400).json({
                message: "Insufficient Balance"
            });
        }

        // Update Balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // Create Transaction
        const transaction = await Transaction.create({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: "TRANSFER",
            status: "SUCCESS"
        });

        res.status(200).json({
            success: true,
            message: "Money sent successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// @desc    Get Transaction History
// @route   GET /api/transactions/history
// @access  Private
// ==========================================

const getTransactionHistory = async (req, res) => {
    try {

        const userId = req.user._id;

        const transactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .populate("sender", "name email phone upiId")
            .populate("receiver", "name email phone upiId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendMoney,
    getTransactionHistory
};