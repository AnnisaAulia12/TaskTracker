
function MonthlyProgress({ tasks = [] }) {
  const today = new Date();

  const monthlyTasks = tasks.filter((task) => {
    if (!task.created_at) return false;

    const createdDate = new Date(task.created_at);

    return (
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getFullYear() === today.getFullYear()
    );
  });

  const todoCount = monthlyTasks.filter(
    (task) => task.status === 'Todo'
  ).length;

  const inProgressCount = monthlyTasks.filter(
    (task) => task.status === 'In Progress'
  ).length;

  const completedCount = monthlyTasks.filter(
    (task) => task.status === 'Done'
  ).length;

  return (
    <section className="monthly-progress">

      <h2 className="progress-heading">
        Monthly Progress
      </h2>

      <div className="progress-grid">

        <div className="progress-card">
          <h3>{todoCount}</h3>
          <span>To do</span>
        </div>

        <div className="progress-card">
          <h3>{inProgressCount}</h3>
          <span>In Progress</span>
        </div>

        <div className="progress-card">
          <h3>{completedCount}</h3>
          <span>Completed</span>
        </div>

      </div>
    </section>
  );
}

export default MonthlyProgress;
