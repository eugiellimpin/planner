import React, { useRef } from "react";
import c from "classnames";
import getDaysInMonth from "date-fns/getDaysInMonth";
import format from "date-fns/format";

import './Calendar.css'
import { useEffect } from "react";
import Column from "./Column";

function CalendarDay({ onClick, isCurrent, children }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.getBoundingClientRect().width;
      ref.current.style.height = `${width}px`;
    }
  }, [])

  return (
    <div
      onClick={onClick}
      className={c('p-1 text-xs hover:bg-gray-200 cursor-pointer border', isCurrent && "bg-green-200")}
      ref={ref}
    >
      {children}
    </div>
  );
}

function Calendar({ onClickDay, isDisplayedDate }) {
  const currentDate = new Date();
  const dayCount = getDaysInMonth(currentDate);

  return (
    <Column className="hidden lg:block">
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
    </Column>
  );
}

export default Calendar;
