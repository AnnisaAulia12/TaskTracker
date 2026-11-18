
import {
  IonModal,
  IonIcon,
} from '@ionic/react';

import { closeOutline } from 'ionicons/icons';

function AddTaskModal({
  showAddModal,
  closeAddModal,
  formData,
  handleFormChange,
  handleCreateTask,
  formError,
  saving,
}) {
  return (
    <IonModal
      isOpen={showAddModal}
      onDidDismiss={closeAddModal}
      className="add-task-modal"
    >
      <div className="add-task-modal-content">

        <div className="add-task-modal-header">
          <h2>Add New Task</h2>

          <button
            type="button"
            className="modal-close-button"
            onClick={closeAddModal}
            disabled={saving}
            aria-label="Close modal"
          >
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <form
          className="add-task-form"
          onSubmit={handleCreateTask}
        >
          <div className="add-task-field">
            <label htmlFor="task-title">Task Title</label>

            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleFormChange}
              minLength={5}
              maxLength={100}
              required
            />
          </div>

          <div className="add-task-field">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              placeholder="Describe your task..."
              value={formData.description}
              onChange={handleFormChange}
              rows={3}
            />
          </div>

          <div className="add-task-field">
            <label htmlFor="task-deadline">Deadline</label>

            <input
              id="task-deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="add-task-field">
            <label htmlFor="task-priority">Priority</label>

            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleFormChange}
              required
            >
              <option value="" disabled>
                Select priority
              </option>

              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="add-task-field">
            <label htmlFor="task-status">Status</label>

            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              required
            >
              <option value="Todo">To-do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {formError && (
            <p className="add-task-error">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="add-task-submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add Task'}
          </button>
        </form>
      </div>
    </IonModal>
  );
}

export default AddTaskModal;
