
const WEEKDAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

function ScheduleCalendar({
  calendarDays,
  selectedDate,
  todayKey,
  onDateSelect,
}) {
  return (
    <div className="schedule-calendar">
      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day) => {
          const isSelected = day.key === selectedDate;
          const isToday = day.key === todayKey;

          return (
            <button
              key={day.key}
              type="button"
              className={[
                'calendar-day',
                !day.isCurrentMonth ? 'outside-month' : '',
                isSelected ? 'selected' : '',
                isToday ? 'today' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDateSelect(day.key)}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ScheduleCalendar;
