"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import UpcomingSection from "@/components/UpcomingSection";
import InboxSection from "@/components/InboxSection";
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
<Sidebar
  currentView={currentView}
  setCurrentView={setCurrentView}
/>

    {/* MAIN CONTENT */}
    <div className="flex-1">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-800 px-12 py-10 text-white shadow-xl">

        <p className="text-indigo-100 text-xl">

  {currentView === "dashboard" &&
    "Here’s what’s in your orbit."}
    {currentView === "today" &&
  "Focus only on what matters today."}

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

        
{(
  currentView === "dashboard" ||
  currentView === "upcoming" ||
  currentView === "today"
) && (
<UpcomingSection
  currentView={currentView}
  items={items}
  getStatus={getStatus}
  getItemIcon={getItemIcon}
  completeItem={completeItem}
/>
)}
<InboxSection
  currentView={currentView}
  items={items}
  getItemIcon={getItemIcon}
  completeItem={completeItem}
/>
  

      </div>

    </div>

  </main>
  );
}