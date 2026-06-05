import { Item } from "../types/item";
interface InboxSectionProps {
    
  currentView: string;
  items: Item[];
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
}

export default function InboxSection({
  currentView,
  items,
  getItemIcon,
  completeItem,
}: InboxSectionProps) {
  return currentView === "dashboard" ||
    currentView === "upcoming" ||
    currentView === "inbox" ? (
 <div className="bg-white rounded-3xl shadow-lg p-8">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-4xl font-bold text-indigo-950">
                Inbox
              </h2>

              <span className="text-indigo-600">
                View all
              </span>

            </div>

            <div className="space-y-4">

              {items
                .filter(
                  (item) =>
                    item.status !== "completed" &&
                    !item.due_date
                )
                .map((item) => (

                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-3xl p-5 flex items-center justify-between shadow-sm"
                  >

                    <div className="flex items-center gap-4">

                      <div className="bg-yellow-100 text-3xl w-16 h-16 rounded-2xl flex items-center justify-center">
                        {getItemIcon(item.title)}
                      </div>

                      <div className="text-2xl font-semibold text-indigo-950">
                        {item.title}
                      </div>

                    </div>

                    <button
                      onClick={() => completeItem(item.id)}
                      className="border border-yellow-200 rounded-full w-14 h-14 text-xl hover:bg-yellow-50"
                    >
                      ✓
                    </button>

                  </div>

                ))}

            </div>

          </div>
  ) : null;
}