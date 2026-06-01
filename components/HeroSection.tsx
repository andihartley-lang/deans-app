interface HeroSectionProps {
  currentView: string;
}

export default function HeroSection({
  currentView,
}: HeroSectionProps) {
  return (
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
  );
}