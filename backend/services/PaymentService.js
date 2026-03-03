const Payment = require("../models/Payment.js");
const razorpay = require("../config/PAYMENT.js");
const OrderService = require("./OrderService.js");

const createPaymentLink = async (orderId) => {
  const order = await OrderService.findOrderById(orderId);

  if (!order) throw new Error("Order not found");
  if (!order.user) throw new Error("User not found");

  const customerName = `${order.user.name || "Customer"} ${order.user.surname || ""}`.trim();

  const amountInPaise = Math.round((order.totalDiscountPrice || 0) * 100);
  if (!amountInPaise || amountInPaise <= 0) {
    throw new Error("Order amount is invalid or zero");
  }

  // Build customer object — only include contact if a valid 10-digit mobile exists.
  // Razorpay rejects numbers with recurring digits (e.g. 9999999999).
  const customer = {
    name: customerName,
    email: order.user.email,
    ...(order.user.mobile && String(order.user.mobile).length === 10
      ? { contact: String(order.user.mobile) }
      : {})
  };

  const paymentLink = await razorpay.paymentLink.create({
    amount: amountInPaise,
    currency: "INR",
    customer,
    notify: { sms: false, email: false },
    reminder_enable: false,
    callback_url: `${process.env.BACKEND_URL || "http://localhost:8585"}/api/v1/callback?orderId=${orderId}`,
    callback_method: "get"
  });

  await Payment.create({
    orderId,
    paymentLinkId: paymentLink.id,
    amount: order.totalDiscountPrice,
    status: "PENDING",
    shortUrl: paymentLink.short_url
  });

  return {
    paymentLinkId: paymentLink.id,
    payment_link_url: paymentLink.short_url
  };
};

const updatePaymentInformation = async (query) => {
  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_status,
    orderId
  } = query;

  if (!orderId) throw new Error("Order ID missing in callback");

  if (razorpay_payment_link_status !== "paid") {
    return { success: false, message: "Payment not completed" };
  }

  // 1️⃣ Update Payment collection
  await Payment.findOneAndUpdate(
    {
      orderId: orderId,
      paymentLinkId: razorpay_payment_link_id
    },
    {
      paymentId: razorpay_payment_id,
      status: "COMPLETED"
    }
  );

  // 2️⃣ Update Order
  const order = await OrderService.findOrderById(orderId);

  order.orderStatus = "CONFIRMED";
  order.paymentDetails = {
    paymentId: razorpay_payment_id,
    paymentStatus: "SUCCESS"   // 🔥 FIXED FIELD NAME
  };

  await order.save();

  return { success: true, message: "Payment successful" };
};


module.exports = {
  createPaymentLink,
  updatePaymentInformation
};
