"use client";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface DatePickerHandle {
  open: () => void;
}

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

export default forwardRef<DatePickerHandle, DatePickerProps>(function DatePicker(
  { value, onChange, disabled },
  ref
) {
  const today = new Date().toLocaleDateString("en-CA");

  const initialDate = value ? new Date(value + "T12:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // When a value is set externally, sync the view to that month
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T12:00:00");
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    const iso = new Date(viewYear, viewMonth, day).toLocaleDateString("en-CA");
    onChange(iso);
    setOpen(false);
  }

  // Build calendar grid (week starts Monday)
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const displayLabel = value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className="border border-gray-200 rounded-2xl px-4 py-4 bg-white text-sm outline-none disabled:opacity-50 min-w-[152px] text-left flex items-center gap-2"
      >
        <span className="text-gray-400">📅</span>
        {displayLabel ? (
          <>
            <span className="flex-1 text-gray-700">{displayLabel}</span>
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="text-gray-300 hover:text-gray-500 cursor-pointer leading-none"
            >
              ✕
            </span>
          </>
        ) : (
          <span className="text-gray-400">Pick a date</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-3xl shadow-xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-indigo-950">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const iso = new Date(viewYear, viewMonth, day).toLocaleDateString("en-CA");
              const isSelected = iso === value;
              const isToday = iso === today;
              return (
                <button
                  key={i}
                  onClick={() => selectDay(day)}
                  className={[
                    "w-full aspect-square rounded-xl text-sm flex items-center justify-center transition",
                    isSelected
                      ? "bg-yellow-400 text-black font-semibold"
                      : "hover:bg-gray-100 text-indigo-950",
                    isToday && !isSelected ? "font-bold text-indigo-500" : "",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
