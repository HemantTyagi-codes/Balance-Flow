const express = require("express");
const router = express.Router();

const protect = require("../../middleware/protect");
const { payBill, addMoney } = require("../../controllers/walletController");

router.post("/pay-bill", protect, payBill);
router.post("/add-money", protect, addMoney);

module.exports = router;