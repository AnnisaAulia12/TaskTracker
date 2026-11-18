
import TaskCard from './TaskCard';

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function TodayTasks({
  tasks = [],
  loading,
  error,
  onStatusChange,
  updatingTaskId,
}) {
  const today = getTodayDate();

  const todayTasks = tasks.filter(
    (task) => task.deadline === today
  );

  return (
    <section className="today-tasks">

      <h2 className="today-heading">
        Today's Tasks
      </h2>

      {loading ? (
        <div className="empty-task-card">
          <p>Loading tasks...</p>
        </div>

      ) : error ? (
        <div className="empty-task-card">
          <p>{error}</p>
        </div>

      ) : tasks.length === 0 ? (
        <div className="empty-task-card">
          <p>No Task yet</p>
        </div>

      ) : todayTasks.length === 0 ? (
        <div className="empty-task-card">
          <p>No Tasks for Today</p>
        </div>

      ) : (
        <div className="today-task-list">
          {todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              updating={updatingTaskId === task.id}
            />
          ))}
        </div>
      )}

    </section>
  );
}

export default TodayTasks;
