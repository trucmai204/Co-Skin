const express = require("express");
const Order = require("../models/Order"); // Đường dẫn đến file định nghĩa mô hình Order

const router = express.Router();

// Lấy tất cả đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().exec();

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng" });
  }
});

// API tạo đơn hàng
router.post("/create", async (req, res) => {
  try {
    const { UserID, TotalAmount, ShippingAddress, PaymentMethod } = req.body;
    const newOrder = new Order({
      UserID,
      TotalAmount,
      ShippingAddress,
      PaymentMethod,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    // Trả về orderId và status
    return res.status(201).json({
      orderId: savedOrder._id, // MongoDB tự động tạo _id
      status: "success",
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({
      status: "failure",
      error: error.message,
    });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).exec();
    if (!order) {
      res.status(404).json({ message: "Đơn hàng không tồn tại" });
    } else {
      res.json(order);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng" });
  }
});

// PUT /api/orders/:id
router.put("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).exec();
    if (!order) {
      res.status(404).json({ message: "Đơn hàng không tồn tại" });
    } else {
      order.Status = req.body.Status;
      await order.save();
      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi sửa đơn hàng" });
  }
});

// Xóa đơn hàng theo ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndRemove(id).exec();
    res.json({ message: "Đơn hàng đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa đơn hàng" });
  }
});

module.exports = router;
