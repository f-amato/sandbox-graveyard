"use client";

import { useState, useMemo } from "react";
import { companies, getYears } from "@/lib/data";
import { CompanyStatus, STATUS_LABELS, STATUS_COLORS, CATEGORIES } from "@/lib/types";
import { CompanyCard } from "@/components/CompanyCard";
import { StatsBar } from "@/components/StatsBar";

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CompanyStatus | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWinnersOnly, setShowWinnersOnly] = useState(false);

  const years = getYears();

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (selectedYear && c.year !== selectedYear) return false;
      if (selectedStatus && c.status !== selectedStatus) return false;
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (showWinnersOnly && !c.winner) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedYear, selectedStatus, selectedCategory, searchQuery, showWinnersOnly]);

  const clearFilters = () => {
    setSelectedYear(null);
    setSelectedStatus(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setShowWinnersOnly(false);
  };

  const hasFilters = selectedYear || selectedStatus || selectedCategory || searchQuery || showWinnersOnly;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-accent">Sandbox</span> Graveyard
              </h1>
              <p className="mt-2 text-gray-400 max-w-2xl">
                20 years of RSAC Innovation Sandbox companies — the acquired, the IPO&apos;d,
                the shutdown, and the survivors. Every startup is a lesson.
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-3xl font-bold text-accent">{companies.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Companies Tracked</div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <StatsBar companies={filtered} />

      {/* Filters */}
      <section className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search companies, descriptions, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-bg border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Filter rows */}
          <div className="space-y-3">
            {/* Year filter */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Year</div>
              <div className="flex flex-wrap gap-1.5">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                      selectedYear === year
                        ? "bg-accent/20 text-accent border-accent/50"
                        : "bg-card-bg text-gray-400 border-card-border hover:border-gray-600"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_LABELS) as CompanyStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                    className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                      selectedStatus === status
                        ? STATUS_COLORS[status]
                        : "bg-card-bg text-gray-400 border-card-border hover:border-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
                <button
                  onClick={() => setShowWinnersOnly(!showWinnersOnly)}
                  className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                    showWinnersOnly
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-card-bg text-gray-400 border-card-border hover:border-gray-600"
                  }`}
                >
                  Winners Only
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Category</div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-accent/20 text-accent border-accent/50"
                        : "bg-card-bg text-gray-400 border-card-border hover:border-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filters summary */}
          {hasFilters && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Showing {filtered.length} of {companies.length} companies
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-accent hover:text-accent-hover underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Company Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No companies match your filters. Try adjusting your criteria.
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border py-8 text-center text-xs text-gray-600">
        <p>
          Data compiled from RSAC Conference archives, press releases, and public sources.
        </p>
        <p className="mt-1">
          Inspired by{" "}
          <a href="https://startups.rip" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
            startups.rip
          </a>
          {" "}| Not affiliated with RSA Conference.
        </p>
      </footer>
    </main>
  );
}
