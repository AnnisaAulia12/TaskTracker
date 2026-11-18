
import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  IonPage,
  IonContent,
  IonIcon,
} from '@ionic/react';

import {
  chevronDownOutline,
  calendarOutline,
} from 'ionicons/icons';

import { getTasks } from '../../services/taskService';

import ScheduleCalendar from '../../components/schedule/ScheduleCalendar';
import ScheduleTaskCard from '../../components/schedule/ScheduleTaskCard';
import MonthPicker from '../../components/schedule/MonthPicker';

import './SchedulePage.css';

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonthKey(date) {
  return getDateKey(date).slice(0, 7);
}

function getCalendarDays(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);

  const firstDay = new Date(year, month - 1, 1);
  const startOffset = firstDay.getDay();

  const daysInMonth = new Date(year, month, 0).getDate();

  const totalCells =
    Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(
      year,
      month - 1,
      1 - startOffset + index
    );

    return {
      key: getDateKey(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month - 1,
    };
  });
}

function formatDate(dateString) {
  if (!dateString) return 'No deadline';

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SchedulePage() {
  const navigate = useNavigate();

  const today = new Date();
  const todayKey = getDateKey(today);

  const [monthKey, setMonthKey] = useState(
    getMonthKey(today)
  );

  const [selectedDate, setSelectedDate] = useState(todayKey);

  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [draftYear, setDraftYear] = useState(
    today.getFullYear()
  );

  const [draftMonth, setDraftMonth] = useState(
    today.getMonth()
  );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calendarDays = useMemo(
    () => getCalendarDays(monthKey),
    [monthKey]
  );

  const [year, month] = monthKey.split('-').map(Number);

  const currentMonthLabel = new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelectedDate = formatDate(selectedDate);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const result = await getTasks();

        if (isMounted) {
          setTasks(result);
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
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const selectedTasks = tasks.filter(
    (task) => task.deadline === selectedDate
  );


  const openMonthPicker = () => {
    const [selectedYear, selectedMonth] =
      monthKey.split('-').map(Number);

    setDraftYear(selectedYear);
    setDraftMonth(selectedMonth - 1);
    setShowMonthPicker(true);
  };

  const handleApplyMonth = () => {
    const newMonthKey =
      `${draftYear}-${String(draftMonth + 1).padStart(2, '0')}`;

    setMonthKey(newMonthKey);
    setSelectedDate(`${newMonthKey}-01`);
    setShowMonthPicker(false);
  };

  // Select Calendar Date
  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
    setMonthKey(dateKey.slice(0, 7));
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="schedule-content"
        scrollY={false}
      >
        <main className="schedule-layout">

          <h1 className="schedule-title">
            Schedule
          </h1>

          <button
            type="button"
            className="schedule-month-selector"
            onClick={openMonthPicker}
          >
            <span>{currentMonthLabel}</span>

            <IonIcon icon={chevronDownOutline} />
          </button>

          <section className="schedule-card">

            <ScheduleCalendar
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              todayKey={todayKey}
              onDateSelect={handleDateSelect}
            />

            <div className="schedule-tasks-section">

              <div className="schedule-selected-date">
                <IonIcon icon={calendarOutline} />

                <span>{formattedSelectedDate}</span>
              </div>

              {loading ? (
                <div className="schedule-empty">
                  Loading tasks...
                </div>
              ) : error && tasks.length === 0 ? (
                <div className="schedule-empty schedule-error">
                  {error}
                </div>
              ) : selectedTasks.length === 0 ? (
                <div className="schedule-empty">
                  No tasks for this date
                </div>
              ) : (
                <div className="schedule-task-list">
                  {selectedTasks.map((task) => (
                    <ScheduleTaskCard
                      key={task.id}
                      task={task}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>
        </main>
      </IonContent>

      <MonthPicker
        show={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        draftYear={draftYear}
        setDraftYear={setDraftYear}
        draftMonth={draftMonth}
        setDraftMonth={setDraftMonth}
        onApply={handleApplyMonth}
      />
    </IonPage>
  );
}

export default SchedulePage;
