import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  faHome,
  faPlus,
  faBuilding,
  faSignOutAlt,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const navItems = [
  { to: '/owner', label: 'Dashboard', icon: faHome },
  { to: '/owner/add-venue', label: 'Create Venue', icon: faPlus },
  { to: '/owner/own-venues', label: 'My Venues', icon: faBuilding },
  { to: '/owner/all-booking', label: 'All Booking', icon: faCalendarCheck },
  { to: '/login', label: 'Logout', icon: faSignOutAlt },
];

const OwnerSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-pink-100 shadow-lg p-5 fixed top-0 left-0 hidden md:block">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">Owner Panel</h2>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/owner'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-pink-600 text-white' : 'text-pink-800 hover:bg-pink-200'
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="text-pink-600" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default OwnerSidebar;
