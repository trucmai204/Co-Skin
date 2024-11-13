// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// API: Lấy toàn bộ giỏ hàng của người dùng
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ UserID: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API: Thêm sản phẩm vào giỏ hàng
router.post('/add/:userId', async (req, res) => {
    console.log('Req body:', req.body);
    console.log('UserID:', req.params.userId);

    try {

        const { ProductID, Quantity, Price } = req.body;
        let cart = await Cart.findOne({ UserID: req.params.userId });

        if (!cart) {
            // Nếu giỏ hàng chưa tồn tại cho user này, tạo mới
            cart = new Cart({
                UserID: req.params.userId,
                Products: [{ ProductID, Quantity, Price }]
            });
        } else {
            // Kiểm tra nếu sản phẩm đã tồn tại, cập nhật số lượng
            const productIndex = cart.Products.findIndex(p => p.ProductID === ProductID);
            if (productIndex > -1) {
                cart.Products[productIndex].Quantity += Quantity;
            } else {
                cart.Products.push({ ProductID, Quantity, Price });
            }
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API: Cập nhật sản phẩm trong giỏ hàng
router.put('/:userId/update', async (req, res) => {
    try {
        const { ProductID, Quantity } = req.body;
        const cart = await Cart.findOne({ UserID: req.params.userId });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.Products.findIndex(p => p.ProductID === ProductID);
        if (productIndex > -1) {
            // Cập nhật số lượng
            cart.Products[productIndex].Quantity = Quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API: Xóa sản phẩm khỏi giỏ hàng
router.delete('/:userId/remove', async (req, res) => {
    try {
        const { ProductID } = req.body;
        const cart = await Cart.findOne({ UserID: req.params.userId });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.Products = cart.Products.filter(p => p.ProductID !== ProductID);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
