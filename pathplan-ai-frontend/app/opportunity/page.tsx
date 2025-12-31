"use client";

import { useEffect, useState } from "react";
import { analyzeOpportunities } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OpportunityPage() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const storedCapabilities = sessionStorage.getItem("capabilities");
        const storedInitialOpportunities =
          sessionStorage.getItem("initial_opportunities");

        if (!storedCapabilities) {
          setError("No profile data found. Please upload your resume first.");
          setLoading(false);
          return;
        }

        const capabilities = JSON.parse(storedCapabilities);

        if (storedInitialOpportunities) {
          setResult({
            opportunities: JSON.parse(storedInitialOpportunities),
          });
        } else {
          const data = await analyzeOpportunities(capabilities);
          setResult(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to sync career opportunities with the AI agent.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleSelectRole = (role: string) => {
    sessionStorage.setItem("selected_role", role);
    router.push("/route-planner");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0b1022] to-[#05070f] px-6 py-20 text-gray-200">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ================= HEADER ================= */}
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Career Opportunities
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
            Based on your evaluated capabilities, the system has identified
            realistic career pathways.
            <span className="text-indigo-400 font-semibold">
              {" "}Select one to generate a focused roadmap.
            </span>
          </p>
        </header>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-400 mb-6" />
            <p className="text-gray-400 font-medium">
              Mapping skills to market demand…
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400 mb-3">{error}</p>
            <Link
              href="/capability"
              className="text-red-300 underline font-semibold"
            >
              Return to capability assessment →
            </Link>
          </div>
        )}

        {/* ================= RESULTS ================= */}
        {result && (
          <div className="space-y-20">

            <OpportunitySection
              title="Safe Opportunities"
              subtitle="Strong alignment. You are ready to apply now."
              roles={result.opportunities?.safe_opportunities || []}
              onSelect={handleSelectRole}
              glow="rgba(34,197,94,0.25)"
              accent="from-green-400 to-emerald-500"
            />

            <OpportunitySection
              title="Stretch Opportunities"
              subtitle="High potential roles requiring minor skill upgrades."
              roles={result.opportunities?.stretch_opportunities || []}
              onSelect={handleSelectRole}
              glow="rgba(99,102,241,0.28)"
              accent="from-indigo-400 to-violet-500"
            />

            <OpportunitySection
              title="Aspirational Opportunities"
              subtitle="Long-term, high-impact growth paths."
              roles={result.opportunities?.aspirational_opportunities || []}
              onSelect={handleSelectRole}
              glow="rgba(168,85,247,0.28)"
              accent="from-purple-400 to-fuchsia-500"
            />

            {/* ================= STRATEGIC ADVICE ================= */}
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 blur-xl" />
              <div className="relative bg-black/40 border border-amber-400/30 rounded-3xl p-10">
                <h2 className="text-xl font-bold text-amber-300 mb-4">
                  AI Strategic Insight
                </h2>
                <p className="text-gray-300 italic leading-relaxed text-[15.5px]">
                  “{result.opportunities?.application_advice ||
                    "Review these opportunities and select a path aligned with your current readiness and long-term goals."}”
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ================= OPPORTUNITY SECTION ================= */

function OpportunitySection({
  title,
  subtitle,
  roles,
  onSelect,
  accent,
  glow,
}: any) {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-gray-100">
          {title}
        </h2>
        <p className="text-gray-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(roles || []).map((role: string, idx: number) => (
          <div
            key={idx}
            onClick={() => onSelect(role)}
            style={{ boxShadow: `0 0 0 transparent` }}
            className={`
              group cursor-pointer rounded-2xl p-6
              bg-gradient-to-br from-white/5 to-white/[0.02]
              border border-white/10 backdrop-blur
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-[0_0_45px_${glow}]
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${accent}`} />
                <span className="text-lg font-bold text-gray-100 group-hover:text-white">
                  {role}
                </span>
              </div>

              <span className="text-indigo-400 font-semibold text-sm flex items-center gap-1 transition group-hover:translate-x-1">
                Build Roadmap
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}