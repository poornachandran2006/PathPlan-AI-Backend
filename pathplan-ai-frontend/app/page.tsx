"use client";

import { useRouter } from "next/navigation";

export default function RoutePlannerEntry() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0b1022] to-[#05070f] px-6 py-24 text-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">

        {/* ================= HERO ================= */}
        <section className="text-center space-y-10">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full 
                            bg-indigo-500/10 border border-indigo-400/30 
                            text-indigo-300 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Agentic Career Decision Engine
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 
                             bg-clip-text text-transparent">
              PathPlan AI
            </span>
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            A multi-agent system that understands your profile, debates career decisions,
            and generates adaptive roadmaps based on real-world readiness —
            <span className="text-indigo-400 font-semibold"> not hype.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
            <button
              onClick={() => router.push("/capability")}
              className="px-14 py-5 rounded-2xl text-lg font-bold text-white
                         bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:scale-105 hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]
                         transition-all duration-300"
            >
              Start Capability Analysis →
            </button>

            <button
              className="px-14 py-5 rounded-2xl text-lg font-bold text-gray-200
                         bg-white/5 border border-white/15
                         hover:bg-white/10 hover:border-white/25
                         transition-all duration-300"
            >
              View System Demo
            </button>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="relative space-y-16">
          <h2 className="text-4xl font-extrabold text-center text-white">
            How PathPlan AI Works
          </h2>

          {/* Flow Line */}
          <div className="absolute top-[55%] left-0 right-0 hidden md:block">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            {[
              { step: "Step 1", title: "Upload Resume", desc: "Your profile becomes structured capability signals." },
              { step: "Step 2", title: "Capability Analysis", desc: "Readiness is scored against real market expectations." },
              { step: "Step 3", title: "Agent Debate", desc: "Planner vs Learning agents argue before decisions." },
              { step: "Step 4", title: "Adaptive Roadmap", desc: "A realistic, evolving career path is generated." },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-black/40 border border-white/10 rounded-3xl p-8
                           backdrop-blur transition-all duration-300
                           hover:scale-105 hover:border-indigo-400/40
                           hover:shadow-[0_0_45px_rgba(99,102,241,0.35)]"
              >
                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
                  {item.step}
                </p>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Connector Arrow */}
                {i < 3 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 
                                  text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= KEY FEATURES ================= */}
        <section className="space-y-14">
          <h2 className="text-4xl font-extrabold text-center text-white">
            Key Highlighted Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Explainable Agent Reasoning",
                desc: "Every decision is traceable. You see why an action was chosen.",
              },
              {
                title: "Rejection-Aware Learning",
                desc: "Silence and rejection feed back into strategy refinement.",
              },
              {
                title: "Ethical Realism Engine",
                desc: "Unrealistic timelines are detected and corrected automatically.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white/5 border border-white/10 rounded-3xl p-8
                           transition-all duration-300
                           hover:-translate-y-2 hover:border-indigo-400/30
                           hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]"
              >
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="space-y-14">
          <h2 className="text-4xl font-extrabold text-center text-white">
            Why Choose PathPlan AI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Most tools suggest careers. PathPlan reasons about them.",
              "You see internal debates, not black-box outputs.",
              "Optimizes for readiness, not motivation.",
              "Built for explainable, ethical AI demos.",
            ].map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6
                           transition hover:border-indigo-400/30 hover:bg-white/10"
              >
                <span className="mt-2 w-2 h-2 rounded-full bg-indigo-400" />
                <p className="text-gray-300 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FOOTER CTA ================= */}
        <section className="text-center space-y-6 pt-10">
          <h3 className="text-2xl font-bold text-white">
            Ready to see agentic intelligence in action?
          </h3>
          <button
            onClick={() => router.push("/capability")}
            className="px-16 py-5 rounded-2xl text-lg font-bold text-white
                       bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:scale-105 hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]
                       transition"
          >
            Begin Your Path →
          </button>

          <p className="text-sm text-gray-500 uppercase tracking-widest pt-8">
            Powered by Large Language Models • Deterministic Agent Logic • Ethical AI
          </p>
        </section>
      </div>
    </main>
  );
}