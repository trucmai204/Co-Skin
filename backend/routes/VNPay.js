const express = require("express");
const router = express.Router();

router.post("/create_payment_url", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
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
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnParams = {};
  vnParams["vn_Version"] = "2.1.0";
  vnParams["vn_Command"] = "pay";
  vnParams["vn_TmnCode"] = tmnCode;
  vnParams["vn_Locale"] = locale;
  vnParams["vn_CurrCode"] = currCode;
  vnParams["vn_TxRef"] = orderId;
  vnParams["vn_OrderInfo"] = "Thanh toan cho ma GD: " + orderId;
  vnParams["vn_OrderType"] = "other";
  vnParams["vn_Amount"] = amount * 100;
  vnParams["vn_ReturnUrl"] = returnUrl;
  vnParams["vn_IPAddr"] = ipAddr;
  vnParams["vn_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnParams["vn_BankCode"] = bankCode;
  }
  vnParams = sortObject(vnParams);
  let querystring = require("qs");
  let signData = querystring.stringify(vnParams, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnParams["vn_SecureHash"] = signed;
  vnUrl += "?" + querystring.stringify(vnParams, { encode: false });
  res.send(vnpUrl);
});

module.exports = router;