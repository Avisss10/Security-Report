import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BiHome, 
  BiShieldAlt, 
  BiBuilding, 
  BiArchive, 
  BiLogOut 
} from 'react-icons/bi';
import "../styles/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className='menu'>
      <div className="logo">
        <BiShieldAlt className='logo-icon' />
        <h2>Security Report</h2>
      </div>

      <div className="menu--list">
        <Link to="/dashboard" className={`item ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}>
          <BiHome className='icon' />
          Dashboard
        </Link> 
        <Link to="/security" className={`item ${location.pathname === '/security' ? 'active' : ''}`}>
          <BiShieldAlt className='icon' />
          Security
        </Link> 
        <Link to="/cabang" className={`item ${location.pathname === '/cabang' ? 'active' : ''}`}>
          <BiBuilding className='icon' />
          Cabang
        </Link> 
        <Link to="/archive" className={`item ${location.pathname === '/archive' ? 'active' : ''}`}>
          <BiArchive className='icon' />
          Archive
        </Link>

        <Link to="/logout" className="item logout">
          <BiLogOut className='icon' />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;