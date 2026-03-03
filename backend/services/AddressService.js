const Address = require("../models/Address");

const getUserAddresses = async (userId) => {
    try {
        const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
        return addresses;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getUserAddresses,
};
