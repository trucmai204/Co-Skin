import React from "react";
import { Box, Typography } from "@mui/material";

function SearchResults({ filteredProducts, loading }) {
  return (
    <Box sx={{ padding: "100px 20px" }}>
      {loading ? (
        <Typography align="center" variant="h6" color="#888">
          Đang tải dữ liệu...
        </Typography>
      ) : filteredProducts.length > 0 ? (
        <Box>
          {filteredProducts.map((product) => (
            <Box
              key={product.id}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6">{product.ProductName}</Typography>
              <Typography variant="body2">{product.Description}</Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ marginTop: "20px", color: "#888" }}
        >
          Không tìm thấy sản phẩm nào.
        </Typography>
      )}
    </Box>
  );
}

export default SearchResults;
