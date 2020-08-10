import React from "react";
import getDaysInMonth from "date-fns/getDaysInMonth";

function CalendarDay({ onClick, isCurrent, children }) {
  return (
    <div onClick={onClick} className={isCurrent ? "bg-lightRed" : ""}>
      {children}
    </div>
  );
}

function Calendar({ onClickDay, isDisplayedDate, ...props }) {
  const currentDate = new Date();
  const dayCount = getDaysInMonth(currentDate);

  return (
    <div {...props}>
      <h2>Calendar</h2>
      <div className="grid-container">
        {[...new Array(dayCount).keys()].map((dayIndex) => {
          return (
            <CalendarDay
              key={dayIndex}
              onClick={() => onClickDay(dayIndex + 1)}
              isCurrent={isDisplayedDate(dayIndex + 1)}
            >
              {dayIndex + 1}
            </CalendarDay>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
