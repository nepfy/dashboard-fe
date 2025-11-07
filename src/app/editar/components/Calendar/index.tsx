"use client";

import { useState, useEffect } from "react";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
}

const MONTH_NAMES_PT = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

const DAY_NAMES_PT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

export default function Calendar({
  selectedDate,
  onDateSelect,
  minDate,
}: CalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    return selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  });

  const [displayYear, setDisplayYear] = useState(() => {
    return selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
  });

  useEffect(() => {
    if (selectedDate) {
      setDisplayMonth(selectedDate.getMonth());
      setDisplayYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(displayYear, displayMonth, day);
    onDateSelect(newDate);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;

    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const currentDay = new Date(displayYear, displayMonth, day);
    return selectedDay.getTime() === currentDay.getTime();
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(displayYear, displayMonth, day);
    return date < minDate;
  };

  const isWeekend = (dayIndex: number) => {
    return dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const firstDay = getFirstDayOfMonth(displayMonth, displayYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = (firstDay + day - 1) % 7;
      const isSelected = isDateSelected(day);
      const isDisabled = isDateDisabled(day);
      const isWeekendDay = isWeekend(dayIndex);

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(day)}
          disabled={isDisabled}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
            isSelected
              ? "bg-purple-600 text-white"
              : isDisabled
                ? "cursor-not-allowed text-gray-300"
                : isWeekendDay
                  ? "text-white-neutral-light-600 hover:bg-gray-100"
                  : "text-white-neutral-light-800 hover:bg-gray-100"
          } `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col">
      {/* Month/Year Header */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-primary-light-300 font-bold">
          {MONTH_NAMES_PT[displayMonth]}, {displayYear}
        </span>
        <div className="flex">
          <button
            onClick={handlePreviousMonth}
            className="text-white-neutral-light-800 flex h-6 w-6 items-center justify-center rounded text-[20px] hover:bg-gray-100"
          >
            &lt;
          </button>
          <button
            onClick={handleNextMonth}
            className="text-white-neutral-light-800 flex h-6 w-6 items-center justify-center rounded text-[20px] hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_NAMES_PT.map((day) => (
          <div
            key={day}
            className="text-white-neutral-light-500 flex items-center justify-center text-xs font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
}
