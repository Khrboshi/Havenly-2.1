"use client";

/*
  Havenly Transactions – Soft Blue Calm (v1.0)
  --------------------------------------------
  - Fully aligned with all updated pages (Landing, Upgrade, Premium, Billing)
  - Safe: works without backend, uses placeholder list
  - Supports "no data" case gracefully
  - Zero breaking changes
*/

import Link from "next/link";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  type: "reflection" | "tool" | "premium" | "other";
  creditsUsed: number;
  date: string; // ISO string
  description: string;
}

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Placeholder mock data for now (safe until backend is added)
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setTransactions([
        {
          id: "t1",
          type: "reflection",
          creditsUsed: 1,
          date: "2025-01-10",
          description: "AI deep reflection response",
        },
        {
          id: "t2",
          type: "tool",
          creditsUsed: 2,
          date: "2025-01-08",
          description: "Pattern analysis tool",
        },
        {
          id: "t3",
          type: "premium",
          creditsUsed: 0,
          date: "2025-01-01",
          description: "Monthly premium renewal",
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-gray-100">
      {/* HEADER */}
      <div className="mx-auto max-w-4xl mb-10 space-y-2">
        <h1 className="text-3xl font-semibold text-gray-50">
          Credit Transactions
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
          Review how your credits were used across reflections and supportive 
          tools. This helps you understand your rhythm and what you’re using 
          most often.
        </p>

        <Link
          href="/settings/billing"
          className="inline-block mt-2 text-[#7AB3FF] hover:text-[#adcfff] text-sm"
        >
          ← Back to Billing
        </Link>
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-700/40 bg-[#0B1020]/60 backdrop-blur p-6">

        {/* LOADING STATE */}
        {loading && (
          <p className="text-gray-400 text-sm">Loading your transactions…</p>
        )}

        {/* NO DATA */}
        {!loading && transactions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-300 text-sm">
              No transactions found yet.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Once you start using AI reflections and tools, your credit usage 
              will appear here.
            </p>
          </div>
        )}

        {/* TRANSACTION LIST */}
        {!loading && transactions.length > 0 && (
          <ul className="divide-y divide-gray-700/40">
            {transactions.map((tx) => (
              <li key={tx.id} className="py-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-100">
                    {tx.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-[#7AB3FF]">
                    {tx.creditsUsed} credits
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{tx.type}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
