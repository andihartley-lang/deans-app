import Image from "next/image";
import { supabase } from "@/lib/supabase";
interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
}: SidebarProps) {
  return (
    <>
    <div className="hidden md:flex w-32 min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 text-white flex-col items-center py-8 rounded-r-3xl shadow-2xl">

      <div className="mb-10">
        <Image src="/orbit-icon.png" alt="Orbit" width={64} height={64} />
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
          onClick={() => setCurrentView("today")}
          className={`flex flex-col items-center gap-2 transition ${
            currentView === "today"
              ? "text-yellow-300"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <span className="text-2xl">☀️</span>
          <span>Today</span>
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
          <span>Help &amp; Settings</span>
        </button>

      </div>

      <div className="mt-8 text-center text-xs text-indigo-200">


        <button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }}
  className="bg-red-500 px-3 py-2 rounded-xl text-white"
>
  Logout
</button>
      </div>

    </div>

    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-indigo-950 to-purple-900 text-white flex items-center justify-evenly shadow-2xl">

      <button
        onClick={() => setCurrentView("dashboard")}
        className={`flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 transition ${
          currentView === "dashboard"
            ? "text-yellow-300"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-xl">📊</span>
        <span className="text-xs">Dashboard</span>
      </button>

      <button
        onClick={() => setCurrentView("today")}
        className={`flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 transition ${
          currentView === "today"
            ? "text-yellow-300"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-xl">☀️</span>
        <span className="text-xs">Today</span>
      </button>

      <button
        onClick={() => setCurrentView("upcoming")}
        className={`flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 transition ${
          currentView === "upcoming"
            ? "text-yellow-300"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-xl">🗓️</span>
        <span className="text-xs">Upcoming</span>
      </button>

      <button
        onClick={() => setCurrentView("inbox")}
        className={`flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 transition ${
          currentView === "inbox"
            ? "text-yellow-300"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-xl">📥</span>
        <span className="text-xs">Inbox</span>
      </button>

      <button
        onClick={() => setCurrentView("settings")}
        className={`flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 transition ${
          currentView === "settings"
            ? "text-yellow-300"
            : "opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-xl">⚙️</span>
        <span className="text-xs">Help</span>
      </button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
        className="flex flex-col items-center justify-center gap-1 min-h-[44px] flex-1 py-2 text-red-400 opacity-90 hover:opacity-100 transition"
      >
        <span className="text-xl">🚪</span>
        <span className="text-xs">Logout</span>
      </button>

    </div>
    </>
  );
}