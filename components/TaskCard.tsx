interface TaskCardProps {
  item: any;
  getItemIcon: (title: string) => string;
  completeItem: (id: string) => void;
  colour: "red" | "blue";
}

export default function TaskCard({
  item,
  getItemIcon,
  completeItem,
  colour,
}: TaskCardProps) {
  const styles =
    colour === "red"
      ? {
          card: "bg-gradient-to-r from-red-50 to-white border border-red-100",
          icon: "bg-red-100",
          title: "text-red-900",
          date: "text-red-700",
          button: "border-red-200 hover:bg-red-50",
        }
      : {
          card: "bg-gradient-to-r from-blue-50 to-white border border-blue-100",
          icon: "bg-blue-100",
          title: "text-indigo-950",
          date: "text-blue-700",
          button: "border-blue-200 hover:bg-blue-50",
        };

  return (
    <div
      className={`${styles.card} rounded-3xl p-5 flex items-center justify-between shadow-sm`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`${styles.icon} text-3xl w-16 h-16 rounded-2xl flex items-center justify-center`}
        >
          {getItemIcon(item.title)}
        </div>

        <div>
          <div className={`text-2xl font-semibold ${styles.title}`}>
            {item.title}
          </div>

          <div className={styles.date}>
            Due: {new Date(item.due_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <button
        onClick={() => completeItem(item.id)}
        className={`border rounded-2xl px-6 py-3 ${styles.button}`}
      >
        Complete
      </button>
    </div>
  );
}