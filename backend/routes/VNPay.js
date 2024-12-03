const express = require("express");
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const config = require("config");
const querystring = require("querystring");

const router = express.Router();
process.env.TZ = "Asia/Ho_Chi_Minh";

// Hàm sắp xếp object theo thứ tự alphabet
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

// API tạo URL thanh toán
router.post("/create_payment_url", (req, res) => {
  try {
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("config");

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    console.log(bankCode);

    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ paymentUrl: vnpUrl });
  } catch (error) {
    console.error("Error in create_payment_url:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// API xử lý kết quả trả về từ VNPay
router.get("/vnpay_return", (req, res) => {
  try {
    let vnp_Params = req.query; // Sử dụng query cho GET

    // Lấy SecureHash từ tham số
    let secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa SecureHash và SecureHashType để chuẩn bị ký lại dữ liệu
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp các tham số theo thứ tự
    vnp_Params = sortObject(vnp_Params);

    // Log các tham số sau khi sắp xếp để kiểm tra
    console.log("Sorted vnp_Params:", vnp_Params);

    // Lấy thông tin từ file config
    const secretKey = config.get("vnp_HashSecret");

    // Ký lại dữ liệu bằng secretKey
    const querystring = require("qs");
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // So sánh SecureHash gửi về và SecureHash tính toán
    console.log("Calculated signed:", signed); // Log để kiểm tra chữ ký tính toán
    if (secureHash === signed) {
      const responseCode = vnp_Params["vnp_ResponseCode"];
      if (responseCode === "00") {
        return res
          .status(200)
          .json({ success: true, message: "Giao dịch thành công." });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Giao dịch thất bại." });
      }
    } else {
      console.log("Secure hash mismatch!");
      return res
        .status(400)
        .json({ success: false, message: "Chữ ký không hợp lệ." });
    }
  } catch (error) {
    console.error("Error in vnpay_return:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
