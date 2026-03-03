const PaymentService = require("../services/PaymentService.js");
const Payment = require('../models/Payment.js')
const OrderService = require('../services/OrderService.js')
const createPaymentLink = async (req, res) => {
  try {
    const result = await PaymentService.createPaymentLink(req.params.orderId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("PAYMENT ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updatePaymentInformation = async (req, res) => {
  try {

    // Update Payment and Order
    const result = await PaymentService.updatePaymentInformation(req.query);

    // Fetch updated order and payment info
    const order = await OrderService.findOrderById(req.query.orderId);

    // Redirect to frontend success page
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/order-success?order_id=${order._id}`);
  } catch (error) {
    console.error("PAYMENT CALLBACK ERROR 👉", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createPaymentLink,
  updatePaymentInformation
};
