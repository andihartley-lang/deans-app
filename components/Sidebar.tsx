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
    <div className="w-32 min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 text-white flex flex-col items-center py-8 rounded-r-3xl shadow-2xl">

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
          <span>Settings</span>
        </button>

      </div>

      <div className="mt-8 text-center text-xs text-indigo-200">
        <div className="mb-2">👤 Andy</div>

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
  );
}