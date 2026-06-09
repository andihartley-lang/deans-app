"use client";
import { useState } from "react";
import { Item } from "../types/item";
import DatePicker from "./DatePicker";
import { nextYearFromDate } from "../lib/itemUtils";

interface InboxSectionProps {
  currentView: string;
  items: Item[];
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
  completeItemWithRecurring: (id: string, title: string, newDueDate: string) => void;
}

function InboxCard({
  item,
  getItemIcon,
  completeItem,
  completeItemWithRecurring,
}: {
  item: Item;
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
  completeItemWithRecurring: (id: string, title: string, newDueDate: string) => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [addReminder, setAddReminder] = useState(true);
  const [reminderDate, setReminderDate] = useState(nextYearFromDate(item.due_date));

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
    <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 text-3xl w-16 h-16 rounded-2xl flex items-center justify-center">
            {getItemIcon(item.title)}
          </div>
          <div className="text-2xl font-semibold text-indigo-950">
            {item.title}
          </div>
        </div>

        {!showPrompt && (
          <button
            onClick={handleCompleteClick}
            className="border border-yellow-200 rounded-full w-14 h-14 text-xl hover:bg-yellow-50"
          >
            ✓
          </button>
        )}
      </div>

      {showPrompt && (
        <div className="mt-4 pt-4 border-t border-yellow-100 flex flex-wrap items-center gap-3">
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

export default function InboxSection({
  currentView,
  items,
  getItemIcon,
  completeItem,
  completeItemWithRecurring,
}: InboxSectionProps) {
  return currentView === "dashboard" || currentView === "inbox" ? (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-indigo-950">Inbox</h2>
        <span className="text-indigo-600">View all</span>
      </div>

      <div className="space-y-4">
        {items
          .filter((item) => item.status !== "completed" && !item.due_date)
          .map((item) => (
            <InboxCard
              key={item.id}
              item={item}
              getItemIcon={getItemIcon}
              completeItem={completeItem}
              completeItemWithRecurring={completeItemWithRecurring}
            />
          ))}
      </div>
    </div>
  ) : null;
}
