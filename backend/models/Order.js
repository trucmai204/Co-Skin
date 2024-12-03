const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    OrderID: {
        type: mongoose.Schema.Types.Number,
        auto: true,
        required: true
    },
    UserID: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    },
    OrderDate: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Processing', 'Completed', 'Cancelled'],
        default: 'Processing'
    },
    ShippingAddress: {
        type: String,
        required: true
    },
    PaymentMethod: {
        type: String,
        enum: ['COD', 'Online Payment'],
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
