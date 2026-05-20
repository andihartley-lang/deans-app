"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Home() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
const [items, setItems] = useState<any[]>([]);
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
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        Dean's App
      </h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Add life admin..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded w-full max-w-md"
        />
<input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
  className="border p-3 rounded"
/>
        <button
          onClick={addItem}
          className="bg-black text-white px-4 rounded"
        >
          Add
        </button>
      </div>
    <div>
  <h2 className="text-2xl font-semibold mb-4">
    Saved Items
  </h2>

  <div className="space-y-2">
  {items
.filter((item) => item.status !== "completed")
  .map((item) => (
      <div
        key={item.id}
      className={`border p-3 rounded ${
  getStatus(item.due_date) === "critical"
    ? "border-red-500 bg-red-50"
    : "border-yellow-500 bg-yellow-50"
}`}
      ><div className="flex flex-col gap-2">
 {item.title} — {getStatus(item.due_date)}

  {item.due_date && (
    <div className="text-sm text-gray-500">
     Due: {new Date(item.due_date).toLocaleDateString()}

    </div>
  )}
  <button
 
  onClick={() => completeItem(item.id)}
  className="mt-2 text-sm bg-black text-white px-3 py-1 rounded"
>
  Complete
</button>
</div>

      </div>
    ))}
  </div>
</div></main>
  );
}