"use client";
import { useState } from "react";
import { Item } from "../types/item";
import DatePicker from "./DatePicker";
import { nextYearFromDate } from "../lib/itemUtils";

interface TaskCardProps {
  item: Item;
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
  completeItemWithRecurring: (id: string, title: string, newDueDate: string) => void;
  colour: "red" | "blue";
}

export default function TaskCard({
  item,
  getItemIcon,
  completeItem,
  completeItemWithRecurring,
  colour,
}: TaskCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [addReminder, setAddReminder] = useState(true);
  const [reminderDate, setReminderDate] = useState(nextYearFromDate(item.due_date));

  const styles =
    colour === "red"
      ? {
          card: "bg-gradient-to-r from-red-50 to-white border border-red-100",
          icon: "bg-red-100",
          title: "text-red-900",
          date: "text-red-700",
          button: "border-red-200 hover:bg-red-50",
          divider: "border-red-100",
        }
      : {
          card: "bg-gradient-to-r from-blue-50 to-white border border-blue-100",
          icon: "bg-blue-100",
          title: "text-indigo-950",
          date: "text-blue-700",
          button: "border-blue-200 hover:bg-blue-50",
          divider: "border-blue-100",
        };

  function handleCompleteClick() {
    if (item.is_recurring) {
      setReminderDate(nextYearFromDate(item.due_date));
      setAddReminder(true);
      setShowPrompt(true);
    } else {
      completeItem(item.id);
    }
  }

  function handleConfirm() {
    setShowPrompt(false);
    if (addReminder) {
      completeItemWithRecurring(item.id, item.title, reminderDate || nextYearFromDate(item.due_date));
    } else {
      completeItem(item.id);
    }
  }

  return (
    <div className={`${styles.card} rounded-3xl p-3 md:p-5 shadow-sm`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className={`${styles.icon} text-3xl w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            {getItemIcon(item.title)}
          </div>

          <div className="min-w-0 flex-1">
            <div className={`text-2xl font-semibold ${styles.title} truncate`}>
              {item.title}
            </div>
            <div className={styles.date}>
              Due:{" "}
              {item.due_date
                ? new Date(item.due_date).toLocaleDateString()
                : "No due date"}
            </div>
          </div>
        </div>

        {!showPrompt && (
          <button
            onClick={handleCompleteClick}
            className={`w-full md:w-auto border rounded-2xl px-6 py-3 min-h-[44px] min-w-[44px] flex-shrink-0 ${styles.button}`}
          >
            Complete
          </button>
        )}
      </div>

      {showPrompt && (
        <div
          className={`mt-4 pt-4 border-t ${styles.divider} flex flex-wrap items-center gap-3`}
        >
          <label className="flex items-center gap-2 text-sm text-indigo-950 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={addReminder}
              onChange={(e) => setAddReminder(e.target.checked)}
              className="w-4 h-4 rounded accent-yellow-400"
            />
            Add a reminder for next year
          </label>

          {addReminder && (
            <DatePicker
              value={reminderDate}
              onChange={setReminderDate}
            />
          )}

          <button
            onClick={handleConfirm}
            className="ml-auto bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2 rounded-2xl text-sm transition"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
