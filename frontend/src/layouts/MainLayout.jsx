
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import NavBar from '../components/navigation/NavBar';

function MainLayout() {
  const isNative = Capacitor.isNativePlatform();
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed((previous) => !previous);
  };

  return (
    <div
      className={`main-layout ${
        isNative
          ? 'native-layout'
          : collapsed
            ? 'sidebar-collapsed'
            : 'sidebar-expanded'
      }`}
    >
      <NavBar
        isNative={isNative}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <main className="main-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
