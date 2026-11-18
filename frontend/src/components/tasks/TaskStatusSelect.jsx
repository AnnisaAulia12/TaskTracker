
function TaskStatusSelect({
  task,
  updating,
  onStatusChange,
}) {
  return (
    <select
      className="task-status-select"
      value={task.status}
      disabled={updating}
      aria-label={`Status for ${task.title}`}
      onChange={(event) =>
        onStatusChange(task.id, event.target.value)
      }
    >
      <option value="Todo">To-do</option>

      <option value="In Progress">
        In Progress
      </option>

      <option value="Done">Done</option>
    </select>
  );
}

export default TaskStatusSelect;
