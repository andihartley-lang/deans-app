interface HeroSectionProps {
  currentView: string;
  greeting: string;
  displayName: string;
}

export default function HeroSection({
  currentView,
  greeting,
  displayName,
}: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-950 to-purple-800 px-12 py-10 text-white shadow-xl">

      <p className="text-indigo-100 text-xl">

        {currentView === "dashboard" &&
          "Here’s what’s in your orbit."}

        {currentView === "today" &&
          "Focus on what matters today."}

        {currentView === "upcoming" &&
          "What's on the horizon."}

        {currentView === "inbox" &&
          "The everyday stuff, all in one place."}

        {currentView === "settings" &&
          "Manage your Orbit preferences."}

      </p>

      <h1 className="text-6xl font-bold mb-3">

        {currentView === "dashboard" && (displayName ? `${greeting}, ${displayName}` : greeting)}

{currentView === "settings" && "Settings"}

      </h1>

    </div>
  );
}