"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Home() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
const [items, setItems] = useState<any[]>([]);
const [currentView, setCurrentView] = useState("dashboard");
async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setItems(data || []);
}

useEffect(() => {
  fetchItems();
}, []);  
function getStatus(dueDate: string | null) {
  if (!dueDate) return "captured";

  const now = new Date();
  const due = new Date(dueDate);

  const diffTime = due.getTime() - now.getTime();

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 2) {
    return "critical";
  }

  if (diffDays <= 14) {
    return "active";
  }

  return "scheduled";
}
function getItemIcon(title: string) {
  const lower = title.toLowerCase();

  if (
    lower.includes("mot") ||
    lower.includes("car") ||
    lower.includes("garage")
  ) {
    return "🚗";
  }

  if (
    lower.includes("doctor") ||
    lower.includes("gp") ||
    lower.includes("hospital")
  ) {
    return "🩺";
  }

  if (lower.includes("dentist")) {
    return "🦷";
  }

  if (
    lower.includes("shop") ||
    lower.includes("milk") ||
    lower.includes("buy")
  ) {
    return "🛒";
  }

  if (lower.includes("passport")) {
    return "🛂";
  }

  if (lower.includes("insurance")) {
    return "🛡️";
  }

  if (
    lower.includes("call") ||
    lower.includes("phone")
  ) {
    return "📞";
  }

  if (
    lower.includes("flight") ||
    lower.includes("holiday")
  ) {
    return "✈️";
  }
  if (
    lower.includes("tax") ||
    lower.includes("hmrc") ||
    lower.includes("invoice") ||
    lower.includes("bill") ||
    lower.includes("payment") ||
    lower.includes("bank")
  ) {
    return "🧾";
  }

  if (
    lower.includes("boiler") ||
    lower.includes("plumber") ||
    lower.includes("electric") ||
    lower.includes("gas") ||
    lower.includes("water") ||
    lower.includes("internet") ||
    lower.includes("broadband")
  ) {
    return "🏠";
  }

  if (
    lower.includes("dog") ||
    lower.includes("cat") ||
    lower.includes("vet")
  ) {
    return "🐾";
  }

  if (
    lower.includes("school") ||
    lower.includes("nursery") ||
    lower.includes("parents")
  ) {
    return "🎒";
  }
  return "📝";
}
function getGreeting() {
  const hour = new Date(
  new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
  })
).getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 24) {
    return "Good afternoon";
  }

  return "Good evening";
}
async function completeItem(id: string) {
  const { error } = await supabase
    .from("items")
    .update({
      status: "completed",
      completed_at: new Date(),
    })
    .eq("id", id);

if (error) {
  alert(error.message);
  console.error(error);
  return;
}

  fetchItems();
}
async function addItem() {
    if (!title) return;

    const status = "active";

const { error } = await supabase.from("items").insert({
  title,
  due_date: dueDate || null,
  status,
});

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    alert("Item saved!");

    setTitle("");
    setDueDate("");
    fetchItems();
  }

  return (
  <main className="min-h-screen bg-[#f3f4f8] flex">

    {/* SIDEBAR */}
    <div className="w-24 bg-gradient-to-b from-indigo-950 to-purple-900 text-white flex flex-col items-center py-8 rounded-r-3xl shadow-2xl">

      <div className="bg-yellow-400 text-indigo-950 font-bold text-3xl w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-lg">
        O
      </div>

      <div className="flex flex-col gap-8 text-sm items-center">

        <button
  onClick={() => setCurrentView("dashboard")}
  className={`flex flex-col items-center gap-2 transition ${
    currentView === "dashboard"
      ? "text-yellow-300"
      : "opacity-80 hover:opacity-100"
  }`}
>
  <span className="text-2xl">📊</span>
  <span>Dashboard</span>
</button>
       
        <button
  onClick={() => setCurrentView("upcoming")}
  className={`flex flex-col items-center gap-2 transition ${
    currentView === "upcoming"
      ? "text-yellow-300"
      : "opacity-80 hover:opacity-100"
  }`}
>
  <span className="text-2xl">🗓️</span>
  <span>Upcoming</span>
</button>
      
        <button
  onClick={() => setCurrentView("inbox")}
  className={`flex flex-col items-center gap-2 transition ${
    currentView === "inbox"
      ? "text-yellow-300"
      : "opacity-80 hover:opacity-100"
  }`}
>
  <span className="text-2xl">📥</span>
  <span>Inbox</span>
</button>

        <button
  onClick={() => setCurrentView("settings")}
  className={`flex flex-col items-center gap-2 transition ${
    currentView === "settings"
      ? "text-yellow-300"
      : "opacity-80 hover:opacity-100"
  }`}
>
  <span className="text-2xl">⚙️</span>
  <span>Settings</span>
</button>

      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-800 px-12 py-10 text-white shadow-xl">

        <p className="text-indigo-100 text-xl">

  {currentView === "dashboard" &&
    "Here’s what’s in your orbit."}

  {currentView === "upcoming" &&
    "Upcoming tasks and scheduled items."}

  {currentView === "inbox" &&
    "Captured tasks waiting to be organised."}

  {currentView === "settings" &&
    "Manage your Orbit preferences."}

</p>

        <h1 className="text-6xl font-bold mb-3">

  {currentView === "dashboard" && "Orbit"}

  {currentView === "upcoming" && "Upcoming"}

  {currentView === "inbox" && "Inbox"}

  {currentView === "settings" && "Settings"}

</h1>

        <p className="text-indigo-100 text-xl">
          Here’s what’s in your orbit.
        </p>

      </div>

      {/* CONTENT WRAPPER */}
      <div className="max-w-6xl mx-auto -mt-10 pb-12 px-6">

        {/* INPUT PANEL */}
        <div className="bg-white rounded-3xl shadow-xl p-4 flex gap-3 items-center mb-8">

          <input
            type="text"
            placeholder="Add life admin..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-200 rounded-2xl p-4 text-lg outline-none"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-200 rounded-2xl p-4"
          />

          <button
            onClick={addItem}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 rounded-2xl transition"
          >
            Add
          </button>

        </div>

        

                {(currentView === "dashboard" || currentView === "upcoming") && (

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

        )}

        {(currentView === "dashboard" || currentView === "inbox") && (

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

        )}

      </div>

    </div>

  </main>
  );
}