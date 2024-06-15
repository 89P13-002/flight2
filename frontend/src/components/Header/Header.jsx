import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <header className="app-bar">
      <div className="toolbar">
        <div className="logo">
          <i className="fas fa-plane flight-icon"></i>
        </div>
        <div className="tabs">
          <nav>
            <ul>
              <li className={activeTab === '/' ? 'active' : ''}>
                <Link to="/">Home</Link>
              </li>
              <li className={activeTab === '/admin/login' ? 'active' : ''}>
                <Link to="/admin/login">Admin</Link>
              </li>
              <li className={activeTab === '/flight' ? 'active' : ''}>
                <Link to="/flight">Flight</Link>
              </li>
              <li className={activeTab === 'user/login' ? 'active' : ''}>
                <Link to="user/login">User</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
