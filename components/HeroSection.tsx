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
    <div className="bg-gradient-to-r from-indigo-950 to-purple-800 px-4 md:px-12 pt-6 pb-12 md:py-10 text-white shadow-xl">

      <p className="text-indigo-100 text-base md:text-xl">

        {currentView === "today" &&
          "Focus on what matters today."}

        {currentView === "upcoming" &&
          "What’s on the horizon."}

        {currentView === "inbox" &&
          "The everyday stuff, all in one place."}

        {currentView === "settings" &&
          "Manage your Orbit preferences and get help."}

      </p>

      <h1 className="text-3xl md:text-6xl font-bold mb-3">

        {currentView === "dashboard" && (displayName ? `${greeting}, ${displayName}` : greeting)}

{currentView === "settings" && "Help & Settings"}

      </h1>

      {currentView === "dashboard" && (
        <p className="text-indigo-100 text-base md:text-xl">
          Here’s what’s in your orbit.
        </p>
      )}

    </div>
  );
}