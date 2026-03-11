"use client";

import { Company } from "@/lib/types";

export function StatsBar({ companies }: { companies: Company[] }) {
  const acquired = companies.filter((c) => c.status === "acquired").length;
  const ipo = companies.filter((c) => c.status === "ipo").length;
  const active = companies.filter((c) => c.status === "active").length;
  const shutdown = companies.filter((c) => c.status === "shutdown").length;
  const unknown = companies.filter((c) => c.status === "unknown").length;
  const winners = companies.filter((c) => c.winner).length;
  const total = companies.length;

  const stats = [
    { label: "Total", value: total, color: "text-foreground" },
    { label: "Acquired", value: acquired, color: "text-blue-400" },
    { label: "IPO", value: ipo, color: "text-green-400" },
    { label: "Active", value: active, color: "text-emerald-400" },
    { label: "Shutdown", value: shutdown, color: "text-red-400" },
    { label: "Unknown", value: unknown, color: "text-gray-400" },
    { label: "Winners", value: winners, color: "text-yellow-400" },
  ];

  // Outcome bar percentages
  const segments = [
    { pct: total ? (acquired / total) * 100 : 0, color: "bg-blue-500" },
    { pct: total ? (ipo / total) * 100 : 0, color: "bg-green-500" },
    { pct: total ? (active / total) * 100 : 0, color: "bg-emerald-500" },
    { pct: total ? (shutdown / total) * 100 : 0, color: "bg-red-500" },
    { pct: total ? (unknown / total) * 100 : 0, color: "bg-gray-500" },
  ];

  return (
    <section className="border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Stat numbers */}
        <div className="flex flex-wrap gap-6 mb-3">
          {stats
            .filter((s) => s.value > 0)
            .map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
        </div>

        {/* Outcome bar */}
        <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
          {segments
            .filter((s) => s.pct > 0)
            .map((s, i) => (
              <div
                key={i}
                className={`${s.color} h-full`}
                style={{ width: `${s.pct}%` }}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
