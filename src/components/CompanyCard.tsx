"use client";

import Link from "next/link";
import { Company, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/company/${company.id}`}
      className="group block bg-card-bg border border-card-border rounded-xl p-5 hover:border-accent/40 hover:bg-card-bg/80"
    >
      {/* Top row: year badge + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
            {company.year}
          </span>
          {company.winner && (
            <span className="text-xs font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
              Winner
            </span>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[company.status]}`}
        >
          {STATUS_LABELS[company.status]}
        </span>
      </div>

      {/* Company name */}
      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent mb-1">
        {company.name}
      </h3>

      {/* Category */}
      <div className="text-xs text-gray-500 mb-2">{company.category}</div>

      {/* Description */}
      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
        {company.description}
      </p>

      {/* Outcome details */}
      {company.acquisitionDetails && (
        <p className="text-xs text-blue-400/80 line-clamp-1">
          {company.acquisitionDetails}
        </p>
      )}
      {company.ipoDetails && (
        <p className="text-xs text-green-400/80 line-clamp-1">
          {company.ipoDetails}
        </p>
      )}
      {company.shutdownDetails && (
        <p className="text-xs text-red-400/80 line-clamp-1">
          {company.shutdownDetails}
        </p>
      )}

      {/* Lesson teaser */}
      {company.lessonLearned && (
        <div className="mt-3 pt-3 border-t border-card-border">
          <p className="text-xs text-accent/70 line-clamp-2 italic">
            {company.lessonLearned}
          </p>
        </div>
      )}
    </Link>
  );
}
