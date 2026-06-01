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
    return currentView === "dashboard" ||
  currentView === "upcoming" ||
  currentView === "today" ? (


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