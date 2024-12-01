import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#fb6f92' }}> 
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    color: 'white', 
                }}
            >
                <Button color="inherit" component={Link} to="/admin/management">Co-Skin</Button>
                <Button color="inherit" component={Link} to="/products">Quản lý Sản phẩm</Button>
                <Button color="inherit" component={Link} to="/categories">Quản lý Danh mục</Button>
                <Button color="inherit" component={Link} to="">Quản lý Đơn Hàng</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
