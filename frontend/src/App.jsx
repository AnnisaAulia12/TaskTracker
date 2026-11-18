
import {
  IonApp,
  setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import HomePage from './pages/home/HomePage';
import TasksPage from './pages/tasks/TasksPage';
import SchedulePage from './pages/schedule/SchedulePage';
import AccountPage from './pages/account/AccountPage';

import MainLayout from './layouts/MainLayout';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route element={<MainLayout />}>
            <Route
              path="/home"
              element={<HomePage />}
            />

            <Route
              path="/schedule"
              element={<SchedulePage />}
            />

            <Route
              path="/tasks"
              element={<TasksPage />}
            />

            <Route
              path="/account"
              element={<AccountPage />}
            />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
