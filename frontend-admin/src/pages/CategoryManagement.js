import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import api from "../api";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isAddMode, setIsAddMode] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        setError("Không thể tải danh sách danh mục.");
      }
    };
    fetchCategories();
  }, []);

  const addCategory = async () => {
    try {
      const response = await api.post("/categories/add", {
        CategoryName: newCategoryName,
        Description: newDescription,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
      setNewDescription("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Không thể thêm danh mục.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.CategoryID !== id));
      setOpenDeleteDialog(false);
    } catch (error) {
      setError("Không thể xóa danh mục.");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedCategoryId(id);
    setOpenDeleteDialog(true);
  };

  const editCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.CategoryID === id);
    setNewCategoryName(categoryToEdit.CategoryName);
    setNewDescription(categoryToEdit.Description);
    setEditingCategoryId(id);
    setIsAddMode(false);
    setOpenDialog(true);
  };

  const updateCategory = async () => {
    try {
      const response = await api.put(`/categories/${editingCategoryId}`, {
        CategoryName: newCategoryName,
        Description: newDescription,
      });
      setCategories(categories.map((category) => category.CategoryID === editingCategoryId ? response.data : category));
      setNewCategoryName("");
      setNewDescription("");
      setEditingCategoryId(null);
      setOpenDialog(false);
    } catch (error) {
      setError("Không thể cập nhật danh mục.");
    }
  };

  const handleDialogClose = () => {
    setNewCategoryName("");
    setNewDescription("");
    setEditingCategoryId(null);
    setOpenDialog(false);
    setIsAddMode(true);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setIsAddMode(true);
          setOpenDialog(true);
        }}
        color="primary"
      >
        Thêm
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="center">Sửa</TableCell>
              <TableCell align="center">Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.CategoryID}>
                <TableCell>{category.CategoryName}</TableCell>
                <TableCell>{category.Description}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => editCategory(category.CategoryID)}
                    color="primary"
                  >
                    Sửa
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleDeleteClick(category.CategoryID)}
                    color="secondary"
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {isAddMode ? "Thêm mới danh mục" : "Sửa danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            margin="dense"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="dense"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          <Button
            onClick={isAddMode ? addCategory : updateCategory}
            color="primary"
          >
            {isAddMode ? "Thêm mới" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hộp thoại xác nhận xóa danh mục */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa danh mục này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Hủy</Button>
          <Button onClick={() => deleteCategory(selectedCategoryId)} color="primary">Xóa</Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Typography color="error" align="center" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export default CategoryManagement;
