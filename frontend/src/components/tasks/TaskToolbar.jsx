
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';

const filters = [
  { label: 'All', value: 'All' },
  { label: 'To-do', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
];

function TaskToolbar({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
}) {
  return (
    <>
      <div className="tasks-search">
        <input
          type="search"
          placeholder="Search Your Task"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <IonIcon icon={searchOutline} />
      </div>

      <div className="tasks-filters">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`filter-button ${
              activeFilter === filter.value ? 'selected' : ''
            }`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default TaskToolbar;
