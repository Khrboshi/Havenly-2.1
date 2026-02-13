"use client";

export default function ToastMessage({
  message,
}: {
  message: string;
}) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
