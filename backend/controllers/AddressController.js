const AddressService = require("../services/AddressService");

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await AddressService.getUserAddresses(userId);
        return res.status(200).json({ success: true, data: addresses });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getUserAddresses,
};
