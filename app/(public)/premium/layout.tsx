export const metadata = {
  title: "Havenly Premium — Unlock Pattern Insights",
  description: "Upgrade to Premium for unlimited reflections, full pattern insights across all your entries, and a weekly personal summary written just for you.",
  openGraph: {
    title: "Havenly Premium",
    description: "Unlimited reflections, full pattern insights, and a weekly personal summary.",
    url: "https://havenly-2-1.vercel.app/premium",
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
