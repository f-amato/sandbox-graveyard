import { notFound } from "next/navigation";
import Link from "next/link";
import { companies, getCompanyById } from "@/lib/data";
import { STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS, SOURCE_COLORS } from "@/lib/types";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
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

  // Show peers from same year AND same source program
  const peers = companies.filter(
    (c) =>
      c.year === company.year &&
      c.id !== company.id &&
      (company.source === "yc"
        ? c.source === "yc" || c.source === "both"
        : company.source === "rsac"
        ? c.source === "rsac" || c.source === "both"
        : true)
  );

  const yearsToExit =
    company.founded && company.yearAcquired
      ? company.yearAcquired - company.founded
      : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-accent mb-6 inline-block"
        >
          &larr; Back to all companies
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`text-sm px-3 py-0.5 rounded border ${SOURCE_COLORS[company.source]}`}>
              {SOURCE_LABELS[company.source]}
            </span>
            {company.ycBatch && (
              <span className="text-sm font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                YC {company.ycBatch}
              </span>
            )}
            <span className="text-sm font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
              {company.source === "yc" ? company.year : `ISB ${company.year}`}
            </span>
            {company.winner && (
              <span className="text-sm font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-0.5 rounded">
                Winner
              </span>
            )}
            <span
              className={`text-sm px-3 py-0.5 rounded border ${STATUS_COLORS[company.status]}`}
            >
              {STATUS_LABELS[company.status]}
            </span>
            {company.bootstrapped && (
              <span className="text-sm text-orange-300 bg-orange-900/30 px-3 py-0.5 rounded">
                Bootstrapped
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {company.name}
          </h1>
          <div className="text-sm text-accent mb-4">{company.category}</div>
          <p className="text-gray-300 text-lg leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {company.founded && (
            <div className="bg-card-bg border border-card-border rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Founded</div>
              <div className="text-foreground font-bold text-lg">{company.founded}</div>
            </div>
          )}
          <div className="bg-card-bg border border-card-border rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ISB Year</div>
            <div className="text-foreground font-bold text-lg">{company.year}</div>
          </div>
          {company.totalFunding && (
            <div className="bg-card-bg border border-card-border rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Raised</div>
              <div className="text-foreground font-bold text-lg">{company.totalFunding}</div>
            </div>
          )}
          {company.acquisitionPrice && (
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
              <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Exit Price</div>
              <div className="text-blue-300 font-bold text-lg">{company.acquisitionPrice}</div>
            </div>
          )}
          {yearsToExit !== null && (
            <div className="bg-card-bg border border-card-border rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Years to Exit</div>
              <div className="text-foreground font-bold text-lg">{yearsToExit} years</div>
            </div>
          )}
          {company.yearAcquired && (
            <div className="bg-card-bg border border-card-border rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Year Acquired</div>
              <div className="text-foreground font-bold text-lg">{company.yearAcquired}</div>
            </div>
          )}
        </div>

        {/* Funding Details */}
        {(company.totalFunding || company.fundingRounds || company.keyInvestors) && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Funding & Investors
            </h2>
            {company.totalFunding && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Funding</div>
                <p className="text-gray-300 font-medium">{company.totalFunding}</p>
              </div>
            )}
            {company.fundingRounds && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rounds</div>
                <p className="text-gray-300">{company.fundingRounds}</p>
              </div>
            )}
            {company.keyInvestors && company.keyInvestors.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Key Investors</div>
                <div className="flex flex-wrap gap-2">
                  {company.keyInvestors.map((investor) => (
                    <span
                      key={investor}
                      className="text-xs bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded-md"
                    >
                      {investor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Outcome */}
        {(company.acquisitionDetails || company.ipoDetails || company.shutdownDetails) && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Outcome</h2>
            {company.acquisitionDetails && (
              <div className="mb-3">
                <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Acquisition</div>
                <p className="text-gray-300">{company.acquisitionDetails}</p>
              </div>
            )}
            {company.ipoDetails && (
              <div className="mb-3">
                <div className="text-xs text-green-400 uppercase tracking-wider mb-1">IPO</div>
                <p className="text-gray-300">{company.ipoDetails}</p>
              </div>
            )}
            {company.shutdownDetails && (
              <div className="mb-3">
                <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Shutdown</div>
                <p className="text-gray-300">{company.shutdownDetails}</p>
              </div>
            )}
            {company.notes && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</div>
                <p className="text-gray-400">{company.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Lesson Learned */}
        {company.lessonLearned && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-accent mb-3">Lesson Learned</h2>
            <p className="text-gray-300 leading-relaxed italic">{company.lessonLearned}</p>
          </div>
        )}

        {/* Peers from same year */}
        {peers.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Other {company.year} {company.source === "yc" ? "YC Security" : "ISB"} Companies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {peers.map((peer) => (
                <Link
                  key={peer.id}
                  href={`/company/${peer.id}`}
                  className="bg-card-bg border border-card-border rounded-lg p-3 hover:border-accent/40 block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{peer.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS_COLORS[peer.status]}`}>
                      {STATUS_LABELS[peer.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{peer.description}</p>
                  {peer.totalFunding && (
                    <p className="text-xs text-gray-600 mt-1">Raised {peer.totalFunding}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-accent hover:underline">
            &larr; Back to all companies
          </Link>
        </div>
      </div>
    </main>
  );
}
