import Link from "next/link";
import { blogArticles } from "./posts";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium mb-6">
          Havenly Journal
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Gentle articles for overloaded minds.
        </h1>

        <p className="max-w-xl text-slate-300 mb-10">
          These reflections are written for people who are doing their best 
          with a lot on their plate—no productivity hacks, no performance 
          pressure. Just softer ways to understand what you’re feeling.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition"
            >
              <div className="text-xs text-emerald-300 font-semibold mb-2">
                {a.category.toUpperCase()}
              </div>

              <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{a.description}</p>

              <div className="flex justify-between text-xs text-slate-500">
                <span>{a.readTime} min read</span>
                <span className="text-emerald-300">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Havenly 2.1. All rights reserved.  
        <Link href="/privacy" className="ml-4 hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
