
import { IonIcon } from '@ionic/react';
import {
  home,
  calendar,
  checkbox,
  personCircle,
  chevronBack,
  chevronForward,
} from 'ionicons/icons';

import { NavLink } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import './NavBar.css';

const navItems = [
  {
    path: '/home',
    label: 'Home',
    icon: home,
  },
  {
    path: '/schedule',
    label: 'Schedule',
    icon: calendar,
  },
  {
    path: '/tasks',
    label: 'My Task',
    icon: checkbox,
  },
  {
    path: '/account',
    label: 'Profile',
    icon: personCircle,
  },
];

function NavBar({ collapsed, onToggle }) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>

      <div className="sidebar-header">

        <div className="sidebar-brand">
          <img src={Logo} alt="Tododish" />
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IonIcon
            icon={collapsed ? chevronForward : chevronBack}
          />
        </button>

      </div>

      <nav className="sidebar-navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <IonIcon
              icon={item.icon}
              className="sidebar-icon"
            />

            <span className="sidebar-label">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

export default NavBar;
