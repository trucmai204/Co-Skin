import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import axios from 'axios';
import api from '../api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    try {
      await api.delete(`/orders/${selectedOrder._id}`);
      fetchOrders();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Open detail dialog
  const handleOpenDetailDialog = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (order) => {
    setSelectedOrder(order);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Đơn Hàng</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.UserID ? order.UserID.name : 'Khách vãng lai'}</TableCell>
                <TableCell>{order.TotalAmount.toLocaleString()} VND</TableCell>
                <TableCell>{order.Status}</TableCell>
                <TableCell>
                  <Tooltip title="Xem Chi Tiết">
                    <IconButton onClick={() => handleOpenDetailDialog(order)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa Đơn Hàng">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa Đơn Hàng">
                    <IconButton onClick={() => handleOpenDeleteDialog(order)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chi Tiết Đơn Hàng Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <p>Mã Đơn Hàng: {selectedOrder._id}</p>
              <p>Khách Hàng: {selectedOrder.UserID ? selectedOrder.UserID.name : 'Khách vãng lai'}</p>
              <p>Tổng Tiền: {selectedOrder.totalAmount.toLocaleString()} VND</p>
              <p>Trạng Thái: {selectedOrder.status}</p>
              {/* Thêm các thông tin chi tiết khác của đơn hàng */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Xác Nhận Xóa Đơn Hàng Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác Nhận Xóa Đơn Hàng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa đơn hàng này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDeleteOrder}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderManagement;