import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export default function MonthYearNavigator({ onChange }) {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const triggerChange = (newMonth, newYear) => {
    const newDate = new Date(newYear, newMonth, 1);
    if (onChange) onChange(newMonth, newYear, newDate);
  };

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => {
        const newYear = prev - 1;
        triggerChange(11, newYear);
        return newYear;
      });
    } else {
      setMonth((prev) => {
        const newMonth = prev - 1;
        triggerChange(newMonth, year);
        return newMonth;
      });
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => {
        const newYear = prev + 1;
        triggerChange(0, newYear);
        return newYear;
      });
    } else {
      setMonth((prev) => {
        const newMonth = prev + 1;
        triggerChange(newMonth, year);
        return newMonth;
      });
    }
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    triggerChange(month, newYear);
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border rounded-2xl p-3 shadow-sm w-full max-w-[320px]">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-gray-500" />
        <div className="flex flex-col items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            {months[month]}
          </span>
          <select
            value={year}
            onChange={handleYearChange}
            className="text-xs bg-transparent border-none focus:ring-0 outline-none text-gray-500 dark:text-gray-400 cursor-pointer"
          >
            {Array.from({ length: 11 }, (_, i) => year - 5 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
