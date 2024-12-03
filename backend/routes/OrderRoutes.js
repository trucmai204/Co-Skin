const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // Đường dẫn đến file định nghĩa mô hình Order

const router = express.Router();

// Lấy tất cả đơn hàng
router.get('/', async (req, res) => {
    try {
      const orders = await Order.find().exec();
      
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi lấy đơn hàng' });
    }
  });

  // GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const order = await Order.findById(id).exec();
      if (!order) {
        res.status(404).json({ message: 'Đơn hàng không tồn tại' });
      } else {
        res.json(order);
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' });
    }
  });

  // PUT /api/orders/:id
router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const order = await Order.findById(id).exec();
      if (!order) {
        res.status(404).json({ message: 'Đơn hàng không tồn tại' });
      } else {
        order.UserID = req.body.UserID;
        order.TotalAmount = req.body.TotalAmount;
        order.OrderDate = req.body.OrderDate;
        order.Status = req.body.Status;
        order.ShippingAddress = req.body.ShippingAddress;
        order.PaymentMethod = req.body.PaymentMethod;
        await order.save();
        res.json(order);
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi sửa đơn hàng' });
    }
  });

// Xóa đơn hàng theo ID
router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await Order.findByIdAndRemove(id).exec();
      res.json({ message: 'Đơn hàng đã được xóa' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi xóa đơn hàng' });
    }
  });



module.exports = router;
