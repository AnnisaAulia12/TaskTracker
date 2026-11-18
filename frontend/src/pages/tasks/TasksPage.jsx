
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  IonPage,
  IonContent,
  IonIcon,
} from '@ionic/react';

import { addOutline } from 'ionicons/icons';

import TaskToolbar from '../../components/tasks/TaskToolbar';
import TaskCard from '../../components/tasks/TaskCard';
import AddTaskModal from '../../components/tasks/AddTaskModal';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/taskService';

import './TasksPage.css';

const initialForm = {
  title: '',
  description: '',
  deadline: '',
  status: 'Todo',
  priority: '',
};

function sortTasks(taskList) {
  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  return [...taskList].sort((a, b) => {
    const deadlineComparison = (a.deadline || '').localeCompare(
      b.deadline || ''
    );

    if (deadlineComparison !== 0) {
      return deadlineComparison;
    }

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function TasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const result = await getTasks();

        if (isMounted) {
          setTasks(sortTasks(result));
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

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeFilter === 'All' || task.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setFormError('');
    setSaving(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        deadline: formData.deadline,
        status: formData.status,
        priority: formData.priority,
      };

      const newTask = await createTask(taskData);

      setTasks((previous) =>
        sortTasks([...previous, newTask])
      );

      setFormData(initialForm);
      setShowAddModal(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Update Task Status
  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    setError('');

    try {
      const updatedTask = await updateTask(taskId, {
        status: newStatus,
      });

      setTasks((previous) =>
        sortTasks(
          previous.map((task) =>
            task.id === taskId ? updatedTask : task
          )
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) return;

    setDeletingTaskId(taskId);
    setError('');

    try {
      await deleteTask(taskId);

      setTasks((previous) =>
        previous.filter((task) => task.id !== taskId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Close Add Task Modal
  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);
    setFormData(initialForm);
    setFormError('');
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="tasks-content"
        scrollY={false}
      >
        <main className="tasks-layout">

          <h1 className="tasks-title">My Task</h1>

          <TaskToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <h2 className="all-tasks-heading">All Task</h2>

          <section className="tasks-list-container">

            {loading ? (
              <div className="tasks-empty-state">
                Loading tasks...
              </div>
            ) : error && tasks.length === 0 ? (
              <div className="tasks-empty-state">
                {error}
              </div>
            ) : tasks.length === 0 ? (
              <div className="tasks-empty-state">
                No Task yet
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="tasks-empty-state">
                No tasks found
              </div>
            ) : (
              <div className="tasks-list">

                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    updatingTaskId={updatingTaskId}
                    deletingTaskId={deletingTaskId}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                  />
                ))}

              </div>
            )}

          </section>

          <button
            type="button"
            className="tasks-add-button"
            aria-label="Add new task"
            onClick={() => setShowAddModal(true)}
          >
            <IonIcon icon={addOutline} />
          </button>

        </main>
      </IonContent>

      <AddTaskModal
        showAddModal={showAddModal}
        closeAddModal={closeAddModal}
        formData={formData}
        handleFormChange={handleFormChange}
        handleCreateTask={handleCreateTask}
        formError={formError}
        saving={saving}
      />

    </IonPage>
  );
}

export default TasksPage;
