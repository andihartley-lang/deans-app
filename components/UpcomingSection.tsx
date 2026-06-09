import TaskCard from "@/components/TaskCard";
import { Item } from "../types/item";

interface UpcomingSectionProps {
  currentView: string;
  items: Item[];
  getStatus: (dueDate: string | null) => string;
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
  completeItemWithRecurring: (id: string, title: string, newDueDate: string) => void;
}

export default function UpcomingSection({
  currentView,
  items,
  getStatus,
  getItemIcon,
  completeItem,
  completeItemWithRecurring,
}: UpcomingSectionProps) {
  const now = new Date();
  const ty = now.getFullYear();
  const tm = now.getMonth();
  const td = now.getDate();

  function dayOf(due: string) {
    const d = new Date(due);
    return { y: d.getFullYear(), m: d.getMonth(), day: d.getDate() };
  }

  function isToday(due: string) {
    const { y, m, day } = dayOf(due);
    return y === ty && m === tm && day === td;
  }

  function isBeforeToday(due: string) {
    const { y, m, day } = dayOf(due);
    if (y !== ty) return y < ty;
    if (m !== tm) return m < tm;
    return day < td;
  }

  function isAfterToday(due: string) {
    const { y, m, day } = dayOf(due);
    if (y !== ty) return y > ty;
    if (m !== tm) return m > tm;
    return day > td;
  }

  if (currentView === "today") {
    const overdueItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isBeforeToday(item.due_date)
    );

    const todayItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isToday(item.due_date)
    );

    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-950 mb-6">
            Still to do
          </h2>
          <div className="space-y-4">
            {overdueItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="red"
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-indigo-950 mb-6">
            On your plate today
          </h2>
          <div className="space-y-4">
            {todayItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="red"
              />
            ))}
          </div>
        </div>

      </div>
    );
  }

  if (currentView === "dashboard" || currentView === "upcoming") {
    const overdueItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isBeforeToday(item.due_date)
    );

    const todayItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isToday(item.due_date)
    );

    const soonItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isAfterToday(item.due_date) &&
        getStatus(item.due_date) === "critical"
    );

    const laterItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        isAfterToday(item.due_date) &&
        getStatus(item.due_date) !== "critical"
    );

    return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-indigo-950">
          Upcoming
        </h2>
        <span className="text-indigo-600">
          View all
        </span>
      </div>

      {/* OVERDUE */}
      {overdueItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-indigo-950 mb-4">
            Still to do
          </h3>
          <div className="space-y-4">
            {overdueItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="red"
              />
            ))}
          </div>
        </div>
      )}

      {/* TODAY */}
      {todayItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-indigo-950 mb-4">
            On your plate today
          </h3>
          <div className="space-y-4">
            {todayItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="red"
              />
            ))}
          </div>
        </div>
      )}

      {/* SOON */}
      {soonItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-indigo-950">
              Soon
            </h3>
          </div>
          <div className="space-y-4">
            {soonItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="red"
              />
            ))}
          </div>
        </div>
      )}

      {/* LATER */}
      {laterItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-indigo-950">
              Later
            </h3>
          </div>
          <div className="space-y-4">
            {laterItems.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                completeItemWithRecurring={completeItemWithRecurring}
                colour="blue"
              />
            ))}
          </div>
        </div>
      )}

    </div>
    );
  }

  return null;
}
