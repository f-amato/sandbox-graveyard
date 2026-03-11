import { notFound } from "next/navigation";
import Link from "next/link";
import { companies, getCompanyById } from "@/lib/data";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // We need to resolve the params synchronously for metadata, but since this is
  // a static page with generateStaticParams, Next.js handles this properly.
  return params.then((p) => {
    const company = getCompanyById(p.id);
    if (!company) return { title: "Not Found" };
    return {
      title: `${company.name} — Sandbox Graveyard`,
      description: company.description,
    };
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompanyById(id);
  if (!company) notFound();

  // Find peers from same year
  const peers = companies.filter(
    (c) => c.year === company.year && c.id !== company.id
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-accent mb-6 inline-block"
        >
          &larr; Back to all companies
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
              ISB {company.year}
            </span>
            {company.winner && (
              <span className="text-sm font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-0.5 rounded">
                Winner
              </span>
            )}
            <span
              className={`text-sm px-3 py-0.5 rounded border ${
                STATUS_COLORS[company.status]
              }`}
            >
              {STATUS_LABELS[company.status]}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {company.name}
          </h1>
          <div className="text-sm text-accent mb-4">{company.category}</div>
          <p className="text-gray-300 text-lg leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {company.founded && (
            <div className="bg-card-bg border border-card-border rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Founded
              </div>
              <div className="text-foreground font-medium">{company.founded}</div>
            </div>
          )}
          <div className="bg-card-bg border border-card-border rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              ISB Year
            </div>
            <div className="text-foreground font-medium">{company.year}</div>
          </div>
        </div>

        {/* Outcome */}
        {(company.acquisitionDetails ||
          company.ipoDetails ||
          company.shutdownDetails) && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Outcome
            </h2>
            {company.acquisitionDetails && (
              <div className="mb-3">
                <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">
                  Acquisition
                </div>
                <p className="text-gray-300">{company.acquisitionDetails}</p>
              </div>
            )}
            {company.ipoDetails && (
              <div className="mb-3">
                <div className="text-xs text-green-400 uppercase tracking-wider mb-1">
                  IPO
                </div>
                <p className="text-gray-300">{company.ipoDetails}</p>
              </div>
            )}
            {company.shutdownDetails && (
              <div className="mb-3">
                <div className="text-xs text-red-400 uppercase tracking-wider mb-1">
                  Shutdown
                </div>
                <p className="text-gray-300">{company.shutdownDetails}</p>
              </div>
            )}
            {company.notes && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Notes
                </div>
                <p className="text-gray-400">{company.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Lesson Learned */}
        {company.lessonLearned && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-accent mb-3">
              Lesson Learned
            </h2>
            <p className="text-gray-300 leading-relaxed italic">
              {company.lessonLearned}
            </p>
          </div>
        )}

        {/* Peers from same year */}
        {peers.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Other {company.year} Finalists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {peers.map((peer) => (
                <Link
                  key={peer.id}
                  href={`/company/${peer.id}`}
                  className="bg-card-bg border border-card-border rounded-lg p-3 hover:border-accent/40 block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {peer.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        STATUS_COLORS[peer.status]
                      }`}
                    >
                      {STATUS_LABELS[peer.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {peer.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-accent hover:underline"
          >
            &larr; Back to all companies
          </Link>
        </div>
      </div>
    </main>
  );
}
