import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ 
  theme, 
  toggleTheme, 
  currentPage, 
  setCurrentPage 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page, event) => {
    if (event) event.preventDefault();
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHashLink = (e, hashId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (hashId === 'checkout-section') {
      if (currentPage && currentPage.startsWith('product-')) {
        // We are on the funnel page, scroll to checkout
        document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // We are not on a product page, redirect to catalog to pick a product
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (hashId === 'catalog-section') {
      if (currentPage !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container header-container">
        {/* Brand Logo */}
        <a href="#" className="logo-link" onClick={(e) => navigateTo('home', e)}>
          <img src="assets/logo.png" alt="Novacare Limited Logo" className="logo-img" />
          <span className="logo-text">NOVACARE</span>
        </a>

        {/* Navigation Menu */}
        <nav>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a href="#" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={(e) => navigateTo('home', e)}>
                Home
              </a>
            </li>
            <li>
              <a href="#" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={(e) => navigateTo('about', e)}>
                About Us
              </a>
            </li>
            <li>
              <a href="#catalog-section" className="nav-link" onClick={(e) => handleHashLink(e, 'catalog-section')}>
                Our Products
              </a>
            </li>
            <li>
              <a href="#checkout-section" className="nav-link" onClick={(e) => handleHashLink(e, 'checkout-section')}>
                Order Now
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Mobile Hamburg Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="menu-toggle" 
            aria-label="Open Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
