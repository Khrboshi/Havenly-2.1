interface Props {
  title: string;
  price: string;
  description: string;
}

export default function PricingCard({ title, price, description }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-200">
      <h3 className="text-xl font-semibold text-emerald-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{price}</p>
      <p className="text-slate-400 text-sm mt-4">{description}</p>

      <button className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-medium hover:bg-emerald-400 transition">
        Choose Plan
      </button>
    </div>
  );
}
