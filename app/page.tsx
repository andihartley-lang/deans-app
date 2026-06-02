"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import UpcomingSection from "@/components/UpcomingSection";
import InboxSection from "@/components/InboxSection";
import HeroSection from "../components/HeroSection";
import AuthSection from "@/components/AuthSection";
import { Item } from "../types/item";
import {
  getStatus,
  getItemIcon,
} from "../lib/itemUtils";
export default function Home() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
const [items, setItems] = useState<Item[]>([]);
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

     <HeroSection currentView={currentView} />

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
<AuthSection />
        
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