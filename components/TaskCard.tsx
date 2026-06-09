"use client";
import { useState } from "react";
import { Item } from "../types/item";
import DatePicker from "./DatePicker";
import { nextYearISO } from "../lib/itemUtils";

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
  const [reminderDate, setReminderDate] = useState(nextYearISO());

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
      setReminderDate(nextYearISO());
      setAddReminder(true);
      setShowPrompt(true);
    } else {
      completeItem(item.id);
    }
  }

  function handleConfirm() {
    setShowPrompt(false);
    if (addReminder) {
      completeItemWithRecurring(item.id, item.title, reminderDate || nextYearISO());
    } else {
      completeItem(item.id);
    }
  }

  return (
    <div className={`${styles.card} rounded-3xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`${styles.icon} text-3xl w-16 h-16 rounded-2xl flex items-center justify-center`}
          >
            {getItemIcon(item.title)}
          </div>

          <div>
            <div className={`text-2xl font-semibold ${styles.title}`}>
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
            className={`border rounded-2xl px-6 py-3 ${styles.button}`}
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

          <DatePicker
            value={reminderDate}
            onChange={setReminderDate}
          />

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
