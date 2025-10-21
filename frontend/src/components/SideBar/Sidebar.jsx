import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  faPlus,
  faBuilding,
  faUsers,
  faCalendarCheck,
  faUserPlus,
  faSignOutAlt,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const links = [
    { to: '/admin/add-venue', label: 'Add Venue', icon: faPlus },
    { to: '/admin/add-owner', label: 'Add Owner', icon: faUserPlus },
    { to: '/admin/all-venues', label: 'All Venues', icon: faBuilding },
    { to: '/admin/all-owners', label: 'All Owners', icon: faUsers },
    { to: '/admin/assign-owner', label: 'Assign Owner', icon: faAdd },
    { to: '/admin/all-booking', label: 'All Booking', icon: faCalendarCheck },
    { to: '/admin/approve-venue', label: 'Approve Venue', icon: faCalendarCheck },
  ];


  const handleGoToAdminPage = ()=>{
    navigate('/admin')
  }
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 shadow-xl fixed top-0 left-0 flex flex-col">
      <div className="py-6 px-6 text-center font-bold text-3xl text-rose-800 border-b border-rose-300 tracking-wide cursor-pointer" onClick={handleGoToAdminPage}>
        Admin Panel
      </div>

      <nav className="flex flex-col flex-grow mt-6 gap-2 px-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-rose-800 rounded-xl transition-all duration-200 
              hover:bg-rose-100 hover:shadow-md 
              ${isActive ? 'bg-white shadow-lg border border-rose-300 font-semibold' : 'bg-transparent'}`
            }
          >
            <FontAwesomeIcon icon={icon} className="text-rose-500" />
            <span className="text-lg">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-5 py-3 bg-transparent text-rose-800 hover:bg-rose-100 hover:shadow-md rounded-xl transition-all duration-200 cursor-pointer"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-rose-500" />
          <span className="text-lg">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
