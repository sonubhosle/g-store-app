const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID || "rzp_test_GR8VGnp5RV96I3",
  key_secret: process.env.KEY_SECRET || "sNYYdi29SUE4PB7jGtZaP7gl",
});

module.exports = razorpay;
