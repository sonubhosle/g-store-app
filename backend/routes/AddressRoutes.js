const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/AddressController");
const Authenticate = require("../middleware/Authenticate");

router.get("/user/addresses", Authenticate, AddressController.getUserAddresses);

module.exports = router;
