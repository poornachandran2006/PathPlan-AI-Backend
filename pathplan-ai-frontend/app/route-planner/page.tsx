"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RoutePlannerPage() {
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [displayRole, setDisplayRole] = useState<string>("");
  const [roleSource, setRoleSource] = useState<
    "selected" | "inferred" | "fallback"
  >("fallback");

  useEffect(() => {
    try {
      const storedSpecificRoadmap = sessionStorage.getItem("roadmapResult");
      const storedInitialRoadmap = sessionStorage.getItem("initial_roadmap");

      const selectedRole = sessionStorage.getItem("selected_role");
      const fallbackRole = sessionStorage.getItem("target_role");

      let parsed: any = null;

      // 1️⃣ Pick roadmap source
      if (storedSpecificRoadmap) {
        parsed = JSON.parse(storedSpecificRoadmap);
      } else if (storedInitialRoadmap) {
        parsed = JSON.parse(storedInitialRoadmap);
      }

      if (!parsed) return;

      // 2️⃣ Normalize roadmap shape
      const finalRoadmap = parsed.roadmap ?? parsed;

      if (!finalRoadmap || !finalRoadmap.sections) return;

      // 3️⃣ Resolve role (CORRECT priority)
      if (selectedRole) {
        setDisplayRole(selectedRole);
        setRoleSource("selected");
      } else if (finalRoadmap.target_role) {
        setDisplayRole(finalRoadmap.target_role);
        setRoleSource("inferred");
      } else if (fallbackRole) {
        setDisplayRole(fallbackRole);
        setRoleSource("fallback");
      }

      setRoadmap(finalRoadmap);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
    }
  }, []);

  /* ================= EMPTY STATE ================= */

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1022] to-[#05070f] px-6">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-12 max-w-md text-center shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          <h2 className="text-3xl font-extrabold text-red-400 mb-4">
            Roadmap Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            Please complete capability analysis before generating a roadmap.
          </p>
          <Link
            href="/capability"
            className="inline-block px-10 py-4 rounded-2xl text-lg font-bold text-white
                       bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:scale-105 hover:shadow-[0_0_35px_rgba(99,102,241,0.6)]
                       transition"
          >
            Go to Analysis →
          </Link>
        </div>
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0b1022] to-[#05070f] px-6 py-20 text-gray-200">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ================= HEADER ================= */}
        <header className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Career Roadmap
            </h1>

            <div className="flex items-center gap-3">
              <p className="text-indigo-400 font-semibold">
                🎯 Target Role: {displayRole}
              </p>

              {roleSource === "inferred" && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300">
                  AI-Inferred
                </span>
              )}

              {roleSource === "selected" && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-400/30 text-green-300">
                  User-Selected
                </span>
              )}
            </div>
          </div>

          <div className="px-8 py-5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-center">
            <p className="text-xs uppercase tracking-widest text-indigo-300 mb-1">
              Estimated Timeline
            </p>
            <p className="text-3xl font-black text-indigo-400">
              {roadmap.timeline_months ?? "3"} Months
            </p>
          </div>
        </header>

        {/* ================= TIMELINE ================= */}
        <section className="relative space-y-20">
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/40 via-indigo-500/10 to-transparent hidden md:block" />

          {roadmap.sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="relative">
              <div className="flex items-center gap-6 mb-8">
                <div className="hidden md:flex w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-400/40 items-center justify-center text-xl font-black text-indigo-400">
                  {sIdx + 1}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {section.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:ml-20">
                {section.nodes.map((node: any, nIdx: number) => (
                  <div
                    key={nIdx}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6
                               hover:scale-[1.02]
                               hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]
                               transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-white">
                        {node.skill}
                      </h3>
                      <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300">
                        {node.level}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(node.resources || []).map((res: string, rIdx: number) => (
                        <span
                          key={rIdx}
                          className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full"
                        >
                          #{res}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="relative bg-black/40 border border-white/10 rounded-3xl p-12 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
          <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">
            AI Strategy Overview
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed italic relative z-10">
            “{roadmap.roadmap_title ??
              "A structured, realistic path generated from your actual profile and readiness."}”
          </p>

          <div className="mt-8 relative z-10">
            <Link
              href="/capability"
              className="inline-block bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold transition"
            >
              Start New Analysis
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}