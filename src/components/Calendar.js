import React from "react";
import c from "classnames";
import getDaysInMonth from "date-fns/getDaysInMonth";
import format from "date-fns/format";

import './Calendar.css'

function CalendarDay({ onClick, isCurrent, children }) {
  return (
    <div
      onClick={onClick}
      className={c("calendar--day", isCurrent ? "bg-lightRed" : "")}
    >
      {children}
    </div>
  );
}

function Calendar({ onClickDay, isDisplayedDate, ...props }) {
  const currentDate = new Date();
  const dayCount = getDaysInMonth(currentDate);

  return (
    <div {...props}>
      <h2 className="column--header">{format(currentDate, 'MMMM yyyy')}</h2>

      <div className="calendar grid-container">
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
