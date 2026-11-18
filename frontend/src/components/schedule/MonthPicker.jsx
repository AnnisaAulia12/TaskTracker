
import { IonIcon } from '@ionic/react';

import {
  chevronUpOutline,
  chevronDownOutline,
} from 'ionicons/icons';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
];

function MonthPicker({
  show,
  onClose,
  draftYear,
  setDraftYear,
  draftMonth,
  setDraftMonth,
  onApply,
}) {
  if (!show) return null;

  return (
    <div
      className="month-picker-overlay"
      onClick={onClose}
    >
      <section
        className="month-picker-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="month-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="month-picker-header">
          <h2 id="month-picker-title">
            {draftYear}
          </h2>

          <div className="year-controls">
            <button
              type="button"
              aria-label="Previous year"
              onClick={() =>
                setDraftYear((previous) => previous - 1)
              }
            >
              <IonIcon icon={chevronUpOutline} />
            </button>

            <button
              type="button"
              aria-label="Next year"
              onClick={() =>
                setDraftYear((previous) => previous + 1)
              }
            >
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
        </div>

        <div className="month-grid">
          {MONTHS.map((monthName, index) => (
            <button
              key={monthName}
              type="button"
              className={`month-option ${
                draftMonth === index ? 'selected' : ''
              }`}
              onClick={() => setDraftMonth(index)}
            >
              {monthName}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="month-apply-button"
          onClick={onApply}
        >
          APPLY
        </button>
      </section>
    </div>
  );
}

export default MonthPicker;
