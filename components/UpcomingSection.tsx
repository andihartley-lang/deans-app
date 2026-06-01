interface UpcomingSectionProps {
  currentView: string;
  items: any[];
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

                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-3xl p-5 flex items-center justify-between shadow-sm"
                    >

                      <div className="flex items-center gap-4">

                        <div className="bg-red-100 text-3xl w-16 h-16 rounded-2xl flex items-center justify-center">
                          {getItemIcon(item.title)}
                        </div>

                        <div>
                          <div className="text-2xl font-semibold text-red-900">
                            {item.title}
                          </div>

                          <div className="text-red-700">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </div>
                        </div>

                      </div>

                      <button
                        onClick={() => completeItem(item.id)}
                        className="border border-red-200 rounded-2xl px-6 py-3 hover:bg-red-50"
                      >
                        Complete
                      </button>

                    </div>

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

                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-3xl p-5 flex items-center justify-between shadow-sm"
                    >

                      <div className="flex items-center gap-4">

                        <div className="bg-blue-100 text-3xl w-16 h-16 rounded-2xl flex items-center justify-center">
                          {getItemIcon(item.title)}
                        </div>

                        <div>
                          <div className="text-2xl font-semibold text-indigo-950">
                            {item.title}
                          </div>

                          <div className="text-blue-700">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </div>
                        </div>

                      </div>

                      <button
                        onClick={() => completeItem(item.id)}
                        className="border border-blue-200 rounded-2xl px-6 py-3 hover:bg-blue-50"
                      >
                        Complete
                      </button>

                    </div>

                  ))}

              </div>

            </div>

          </div>

        ) : null;
}