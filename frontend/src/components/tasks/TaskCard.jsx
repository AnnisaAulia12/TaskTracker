
import { IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

import TaskStatusSelect from './TaskStatusSelect';

function formatDeadline(deadline) {
  if (!deadline) return 'No deadline';

  const date = new Date(`${deadline}T00:00:00`);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function TaskCard({
  task,
  updatingTaskId,
  deletingTaskId,
  onStatusChange,
  onDelete,
}) {
  return (
    <article className="all-task-card" key={task.id}>
      <div className="all-task-main">
        <div className="all-task-info">
          <h3>{task.title}</h3>

          <p>
            {task.description || 'No description'}
          </p>
        </div>

        <TaskStatusSelect
          task={task}
          updating={updatingTaskId === task.id}
          onStatusChange={onStatusChange}
        />
      </div>

      <div className="all-task-footer">
        <span className="all-task-deadline">
          {formatDeadline(task.deadline)}
        </span>

        <button
          type="button"
          className="task-delete-button"
          aria-label={`Delete ${task.title}`}
          disabled={deletingTaskId === task.id}
          onClick={() => onDelete(task.id)}
        >
          <IonIcon icon={trashOutline} />
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
