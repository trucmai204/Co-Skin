const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // Đường dẫn đến file định nghĩa mô hình Order

const router = express.Router();

// Lấy tất cả đơn hàng
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('UserID'); // `populate` để lấy thông tin người dùng nếu cần
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error });
    }
});

// Xóa đơn hàng theo ID
router.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng với ID này' });
        }

        res.status(200).json({ message: 'Đã xóa đơn hàng thành công', deletedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error });
    }
});



module.exports = router;
