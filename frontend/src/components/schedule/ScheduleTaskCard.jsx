
function formatDate(dateString) {
  if (!dateString) return 'No deadline';

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ScheduleTaskCard({ task }) {
  const priorityClass = (
    task.priority || 'Medium'
  ).toLowerCase();

  const status = task.status || 'Todo';

  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, '-');

  const displayStatus =
    status === 'Todo' ? 'To-do' : status;

  return (
    <article className="schedule-task-item">
      <div className="schedule-task-main">
        <div className="schedule-task-info">
          <h3>{task.title}</h3>

          <p>
            {task.description || 'No description'}
          </p>
        </div>

        <span
          className={`schedule-priority-badge ${priorityClass}`}
        >
          {task.priority || 'Medium'}
        </span>
      </div>

      <div className="schedule-task-divider" />

      <div className="schedule-task-footer">
        <div className="schedule-task-date">
          <span>Due date</span>

          <strong>
            {formatDate(task.deadline)}
          </strong>
        </div>

        <span
          className={`schedule-task-status ${statusClass}`}
        >
          {displayStatus}
        </span>
      </div>
    </article>
  );
}

export default ScheduleTaskCard;
