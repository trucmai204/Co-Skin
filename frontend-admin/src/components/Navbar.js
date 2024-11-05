import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#FFB6C1' }}> 
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    color: '#C71585' 
                }}
            >
                <Button color="inherit" component={Link} to="/admin/management">Co-Skin</Button>
                <Button color="inherit" component={Link} to="/products">Quản lý Sản phẩm</Button>
                <Button color="inherit" component={Link} to="/categories">Quản lý Danh mục</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
