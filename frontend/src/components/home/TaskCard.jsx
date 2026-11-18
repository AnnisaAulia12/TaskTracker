
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';

function TaskCard({ task, onStatusChange, updating }) {
  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';

    const date = new Date(`${deadline}T00:00:00`);

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <article className="task-card">

      <div className="task-card-header">

        <div className="task-card-title">
          <h3>{task.title}</h3>

          <p>
            {task.description || 'No description provided.'}
          </p>
        </div>

        <span className="priority-badge">
          {task.priority || 'Medium'}
        </span>

      </div>

      <div className="task-card-footer">

        <div className="task-deadline">
          <span>Due date</span>
          <strong>{formatDeadline(task.deadline)}</strong>
        </div>

        <div className="home-task-status-wrap">
          <select
            className="home-task-status"
            value={task.status}
            disabled={updating}
            aria-label={`Change status of ${task.title}`}
            onChange={(event) =>
              onStatusChange(task.id, event.target.value)
            }
          >
            <option value="Todo">To-do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <IonIcon icon={chevronDownOutline} />
        </div>

      </div>

    </article>
  );
}

export default TaskCard;
