"use client";

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  if (!show) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-medium"
      style={{ animation: "toast-fade 2s ease forwards" }}
    >
      {message}
    </div>
  );
}
