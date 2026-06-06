"use client";


import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import UpcomingSection from "@/components/UpcomingSection";
import InboxSection from "@/components/InboxSection";
import HeroSection from "../../components/HeroSection";
import AuthSection from "@/components/AuthSection";
import ProfileSection from "@/components/ProfileSection";
import DatePicker, { DatePickerHandle } from "@/components/DatePicker";
import { Item } from "../../types/item";
import {
  getStatus,
  getItemIcon,
} from "../../lib/itemUtils";
export default function Home() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showDateNudge, setShowDateNudge] = useState(false);
  const [pendingTitle, setPendingTitle] = useState("");
  const datePickerRef = useRef<DatePickerHandle>(null);
const [items, setItems] = useState<Item[]>([]);
const [currentView, setCurrentView] = useState("dashboard");
const [displayName, setDisplayName] = useState("");
const [showToast, setShowToast] = useState(false);

useEffect(() => {
  if (!showToast) return;
  const timer = setTimeout(() => setShowToast(false), 2000);
  return () => clearTimeout(timer);
}, [showToast]);
async function fetchItems() {
  const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setItems([]);
  return;
}
  const { data, error } = await supabase
  .from("items")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setItems(data || []);
}

useEffect(() => {
  fetchItems();
  fetchDisplayName();
}, []);

async function fetchDisplayName() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .single();

  if (profile?.display_name) {
    setDisplayName(profile.display_name);
  }
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
async function saveItem(itemTitle: string, itemDueDate: string | null) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in.");
      return false;
    }

    const { error } = await supabase.from("items").insert({
      title: itemTitle,
      due_date: itemDueDate,
      status: "active",
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      console.error(error);
      return false;
    }

    setShowToast(true);
    setTitle("");
    setDueDate("");
    setShowDateNudge(false);
    setPendingTitle("");
    fetchItems();
    return true;
  }

  async function addItem() {
    if (!title.trim() || isAdding) return;

    setIsAdding(true);

    let parsedTitle = title;

    if (title.trim().split(/\s+/).length > 6) {
      try {
        const res = await fetch("/api/parse-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: title }),
        });
        const parsed = await res.json();
        parsedTitle = parsed.title || title;
      } catch {
        // Fall back to original input if AI parsing fails
      }
    }

    const finalDueDate = dueDate || null;

    const timeSensitiveKeywords = /\b(mot|insurance|passport|appointment|renewal|booking)\b/i;
    if (!finalDueDate && timeSensitiveKeywords.test(parsedTitle)) {
      setPendingTitle(parsedTitle);
      setShowDateNudge(true);
      setIsAdding(false);
      return;
    }

    await saveItem(parsedTitle, finalDueDate);
    setIsAdding(false);
  }

  async function saveWithNoDate() {
    await saveItem(pendingTitle, null);
  }

  function handleAddDate() {
    setTitle(pendingTitle);
    setPendingTitle("");
    setShowDateNudge(false);
    setTimeout(() => datePickerRef.current?.open(), 0);
  }

  return (
  <main className="min-h-screen bg-[#f3f4f8] flex">
<Sidebar
  currentView={currentView}
  setCurrentView={setCurrentView}
/>

    {/* MAIN CONTENT */}
    <div className="flex-1">

     <HeroSection currentView={currentView} greeting={getGreeting()} displayName={displayName} />

      {/* CONTENT WRAPPER */}
      <div className="max-w-6xl mx-auto -mt-10 pb-12 px-6">

        {/* INPUT PANEL */}
        {currentView !== "settings" && (
  <div className="bg-white rounded-3xl shadow-xl p-4 flex gap-3 items-center mb-8">

    <input
      type="text"
      placeholder="Add life admin..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addItem()}
      disabled={isAdding}
      className="flex-1 border border-gray-200 rounded-2xl p-4 text-lg outline-none disabled:opacity-50"
    />

    <DatePicker
      ref={datePickerRef}
      value={dueDate}
      onChange={setDueDate}
      disabled={isAdding}
    />

    <button
      onClick={addItem}
      disabled={isAdding}
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? "Adding..." : "Add"}
    </button>

  </div>
)}

{showDateNudge && currentView !== "settings" && (
  <div className="bg-amber-50 border border-amber-100 rounded-3xl shadow-lg px-8 py-6 flex items-center justify-between mb-8 -mt-4">
    <p className="text-indigo-950 text-base font-medium">
      This one might need a date — want to add one?
    </p>
    <div className="flex gap-3">
      <button
        onClick={handleAddDate}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-2xl transition"
      >
        Add a date
      </button>
      <button
        onClick={saveWithNoDate}
        className="bg-white border border-amber-200 hover:bg-amber-100 text-indigo-950 font-medium px-6 py-3 rounded-2xl transition"
      >
        No date needed
      </button>
    </div>
  </div>
)}

{currentView === "settings" && <ProfileSection />}
        
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

      {showToast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-medium"
          style={{ animation: 'toast-fade 2s ease forwards' }}
        >
          Item saved
        </div>
      )}

  </main>
  );
}