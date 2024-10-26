import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import TransactionHistory from './components/TransactionHistory';
import Login from './components/Login';
import Register from './components/Register';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);
  const [user, setUser] = useState(
    localStorage.getItem('token')
      ? { 
          token: localStorage.getItem('token'), 
          // is_admin: JSON.parse(localStorage.getItem('is_admin') || "false")  // Set default value if undefined
        }
      : null
  );

  const handleLogin = (token, is_admin) => {
    setUser({ token: token, is_admin: is_admin });
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    // localStorage.setItem('is_admin', JSON.stringify(is_admin));
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('is_admin');
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<AddProduct user={user} onProductAdded={() => {}} />} />
          <Route path="/inventory" element={<ProductList user={user} />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, onLogout }) {
  return (
    <header className="header">
      <div className="left">
        <h1><Link to="/">Store</Link></h1>
        
      </div>
      <div className="right">
        <Link to="/inventory">Inventory</Link>
        <Link to="/history">Transaction History</Link>
        {isLoggedIn ? (
          <button onClick={onLogout} className="logout-button">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default App;
