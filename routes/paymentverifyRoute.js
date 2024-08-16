const crypto = require("crypto");
const express = require("express");
const Payment = require("../models/paymentModel");

const router = express.Router();

router.post("/pay", async (req, res) => {
  // res.status(200).json({
  //       success: true,
  // });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    console.log(error.message);
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
