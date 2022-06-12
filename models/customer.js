const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    callingCode: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: String
    },
    operator: {
        required: true,
        type: String
    }

})

module.exports = mongoose.model('Customer', dataSchema)