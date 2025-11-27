export default function PremiumBadge() {
  return (
    <span className="inline-flex items-center text-xs px-2 py-1 border border-gray-600 rounded-lg text-gray-400 ml-2">
      <svg
        width="12"
        height="12"
        fill="currentColor"
        className="mr-1 opacity-70"
      >
        <path d="M6 0L7.8 3.6 12 4.4 9 7.2 9.6 12 6 10 2.4 12 3 7.2 0 4.4 4.2 3.6z" />
      </svg>
      Premium
    </span>
  );
}
