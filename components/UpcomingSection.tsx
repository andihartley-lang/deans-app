import TaskCard from "@/components/TaskCard";
import { Item } from "../types/item";

interface UpcomingSectionProps {
  currentView: string;
  items: Item[];
  getStatus: (dueDate: string | null) => string;
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
}

export default function UpcomingSection({
  currentView,
  items,
  getStatus,
  getItemIcon,
  completeItem,
}: UpcomingSectionProps) {
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });

  if (currentView === "today") {
    const overdueItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        item.due_date.slice(0, 10) < todayStr
    );

    const todayItems = items.filter(
      (item) =>
        item.status !== "completed" &&
        item.due_date &&
        item.due_date.slice(0, 10) === todayStr
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
                colour="red"
              />
            ))}
          </div>
        </div>

      </div>
    );
  }

  return currentView === "dashboard" || currentView === "upcoming" ? (

    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-indigo-950">
          Upcoming
        </h2>
        <span className="text-indigo-600">
          View all
        </span>
      </div>

      {/* SOON */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-950">
            Soon
          </h3>
          <span className="text-indigo-600 text-sm">
            View all
          </span>
        </div>
        <div className="space-y-4">
          {items
            .filter(
              (item) =>
                item.status !== "completed" &&
                item.due_date &&
                item.due_date.slice(0, 10) > todayStr &&
                getStatus(item.due_date) === "critical"
            )
            .map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                colour="red"
              />
            ))}
        </div>
      </div>

      {/* LATER */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-950">
            Later
          </h3>
          <span className="text-indigo-600 text-sm">
            View all
          </span>
        </div>
        <div className="space-y-4">
          {items
            .filter(
              (item) =>
                item.status !== "completed" &&
                item.due_date &&
                item.due_date.slice(0, 10) > todayStr &&
                getStatus(item.due_date) !== "critical"
            )
            .map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                getItemIcon={getItemIcon}
                completeItem={completeItem}
                colour="blue"
              />
            ))}
        </div>
      </div>

    </div>

  ) : null;
}
