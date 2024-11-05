const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();

// Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const {
      ProductName,
      CategoryID,
      Price,
      Stock,
      Description,
      ImageURL,
      Status,
    } = req.body;

    // Tìm ProductID lớn nhất hiện tại
    const lastProduct = await Product.findOne({}, "ProductID")
      .sort({ ProductID: -1 })
      .limit(1);
    const newProductID = lastProduct ? lastProduct.ProductID + 1 : 1; // Nếu không có sản phẩm nào, bắt đầu từ 1

    // Kiểm tra CategoryID hợp lệ
    const category = await Category.findOne({ CategoryID });
    if (!category) {
      return res.status(400).json({ message: "CategoryID không hợp lệ." });
    }

    // Tạo đối tượng sản phẩm mới
    const newProduct = new Product({
      ProductID: newProductID, // Sử dụng ProductID tự động tăng
      ProductName,
      CategoryID, // Sử dụng CategoryID từ danh mục đã kiểm tra
      Price,
      Stock,
      Description,
      ImageURL,
      CreatedAt: new Date(), // Thời gian tạo sản phẩm
      Status: Status || "Available", // Mặc định là 'Available' nếu không có trạng thái được cung cấp
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thêm sản phẩm" });
  }
});

// Lấy thông tin sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật thông tin sản phẩm
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ProductID từ URL
  const updates = req.body; // Lấy dữ liệu cần cập nhật từ body request

  try {
    // Tìm sản phẩm theo ProductID và cập nhật dữ liệu
    const updatedProduct = await Product.findOneAndUpdate(
      { ProductID: id },
      updates,
      { new: true } // Trả về sản phẩm đã cập nhật sau khi update
    );

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    // Trả về sản phẩm đã cập nhật
    res.json({
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm.', error });
  }
});

// Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await Product.findOneAndDelete({ ProductID: productId });
    if (!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
