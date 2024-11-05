// src/App.jsx
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Paper>
      </Container>
    </Router>
  );
};

export default App;
