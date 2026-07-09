import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProductFunnel from './pages/ProductFunnel';
import AdminDashboard from './components/AdminDashboard';
import { ToastContainer } from './components/Toast';
import { dbService } from './services/dbService';

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('novacare_theme') || 'light');
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'admin', 'product-{id}'
  const [toasts, setToasts] = useState([]);
  const [secretClicks, setSecretClicks] = useState(0);

  // Initialize and load data
  useEffect(() => {
    fetchInitialData();
    // Set theme
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const fetchInitialData = async () => {
    try {
      const prodList = await dbService.getProducts();
      setProducts(prodList);
      const ordList = await dbService.getOrders();
      setOrders(ordList);
    } catch (e) {
      console.error("Error loading database initial tables:", e);
    }
  };

  // --------------------------------------------------------------------------
  // THEME MANAGEMENT
  // --------------------------------------------------------------------------
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('novacare_theme', newTheme);
    addToast(newTheme === 'light' ? 'Light mode enabled' : 'Dark mode enabled');
  };

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // --------------------------------------------------------------------------
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --------------------------------------------------------------------------
  // SECRET ADMIN DASHBOARD TRIGGER
  // --------------------------------------------------------------------------
  const handleSecretClick = () => {
    setSecretClicks(prev => {
      const nextClicks = prev + 1;
      if (nextClicks >= 3) {
        if (currentPage === 'admin') {
          setCurrentPage('home');
          addToast("Closed Admin Dashboard");
        } else {
          setCurrentPage('admin');
          addToast("Admin dashboard opened!");
          // Scroll dashboard into view
          setTimeout(() => {
            document.getElementById('admin-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        return 0;
      }
      return nextClicks;
    });
    // Reset clicks after 1.5s
    setTimeout(() => {
      setSecretClicks(0);
    }, 1500);
  };



  // --------------------------------------------------------------------------
  // RENDER ROUTED PAGES
  // --------------------------------------------------------------------------
  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <Home 
          products={products} 
          setCurrentPage={setCurrentPage} 
        />
      );
    }

    if (currentPage === 'about') {
      return <About />;
    }

    if (currentPage === 'admin') {
      return (
        <AdminDashboard 
          onClose={() => setCurrentPage('home')}
          addToast={addToast}
          products={products}
          setProducts={setProducts}
          orders={orders}
          setOrders={setOrders}
        />
      );
    }

    if (currentPage.startsWith('product-')) {
      const prodId = currentPage.split('product-')[1];
      return (
        <ProductFunnel 
          productId={prodId}
          setCurrentPage={setCurrentPage}
          addToast={addToast}
          onOrderSuccess={(order) => {
            fetchInitialData(); // reload orders in state
          }}
        />
      );
    }

    return <div>Page not found</div>;
  };

  return (
    <>
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navigation Header */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Routed Body */}
      {renderPage()}


      {/* FOOTER */}
      <footer style={{ backgroundColor: 'var(--panel-bg)', borderTop: '1px solid var(--panel-border)', padding: '40px 0', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <div className="container">
          <img 
            src="assets/logo.png" 
            alt="Novacare Limited Logo" 
            style={{ height: '36px', margin: '0 auto 16px auto', cursor: 'pointer' }}
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
          <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>&copy; 2026 Novacare Limited. All Rights Reserved.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Certified Herbal Formulations - Distributed All Over the 36 States of Nigeria</p>
          
          {/* Secret Admin Toggle Trigger */}
          <div className="admin-trigger-container">
            <button onClick={handleSecretClick} className="btn-admin-trigger">
              System Version 1.1.0 (Secure Server)
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
