const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    CartID: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        required: true
    },
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
