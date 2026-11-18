
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';

import HomeHeader from '../../components/home/HomeHeader';
import MonthlyProgress from '../../components/home/MonthlyProgress';
import TodayTasks from '../../components/home/TodayTasks';

import {
  getTasks,
  updateTask,
} from '../../services/taskService';

import { getCurrentUser } from '../../services/authService';

import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Load Home Data
  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const [userData, tasksData] = await Promise.all([
          getCurrentUser(),
          getTasks(),
        ]);

        if (isMounted) {
          setUser(userData);
          setTasks(tasksData);
          setError('');
        }
      } catch (err) {
        if (!isMounted) return;

        if (err.status === 401) {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('token_type');

          navigate('/login', { replace: true });
        } else {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Update Task Status
  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    setActionError('');

    try {
      const updatedTask = await updateTask(taskId, {
        status: newStatus,
      });

      setTasks((previous) =>
        previous.map((task) =>
          task.id === taskId
            ? updatedTask
            : task
        )
      );
    } catch (err) {
      if (err.status === 401) {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('token_type');

        navigate('/login', { replace: true });
      } else {
        setActionError(err.message);
      }
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="home-content"
        scrollY={false}
      >
        <main className="home-page">

          <HomeHeader
            userName={user?.name || 'there'}
          />

          <MonthlyProgress tasks={tasks} />

          {actionError && (
            <p className="home-action-error">
              {actionError}
            </p>
          )}

          <TodayTasks
            tasks={tasks}
            loading={loading}
            error={error}
            onStatusChange={handleStatusChange}
            updatingTaskId={updatingTaskId}
          />

        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
