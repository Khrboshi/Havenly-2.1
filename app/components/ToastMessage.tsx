"use client";

interface ToastMessageProps {
  message: string;
}

export default function ToastMessage({ message }: ToastMessageProps) {
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-2 text-slate-100 shadow-lg">
      {message}
    </div>
  );
}
