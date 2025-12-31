"use client";

import { useState } from "react";
import { uploadResume } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CapabilityPage() {
  const router = useRouter();

  const [resume, setResume] = useState<File | null>(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [targetRole, setTargetRole] = useState(""); // ✅ correct

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!resume) {
      setError("Please upload your resume to continue.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await uploadResume(resume, targetRole);

      if (data.result) {
        sessionStorage.setItem("capabilities", JSON.stringify(data.result.capabilities));
        sessionStorage.setItem("initial_opportunities", JSON.stringify(data.result.opportunities));
        sessionStorage.setItem("initial_roadmap", JSON.stringify(data.result.roadmap));
        sessionStorage.setItem("target_role", targetRole);

        setResult(data.result);
      }
    } catch (err) {
      setError("Capability analysis failed. Backend may be offline.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1324] to-[#090d17] px-6 py-16 text-gray-200">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* ================= HEADER ================= */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Capability Assessment
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your resume and optionally specify a target role — or let the system infer it.
          </p>
        </header>

        {/* ================= INPUT ================= */}
        {!result && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-10">

            {/* Target Role */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Target Career Role (Optional)
              </label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4"
                placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">
                Leave blank to let AI infer suitable roles.
              </p>
            </div>

            {/* Resume */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3">
                Resume (Required)
              </label>
              <div className="relative border-2 border-dashed border-indigo-400/40 rounded-2xl p-10 text-center cursor-pointer hover:bg-indigo-500/10 transition">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
                <p className="text-lg font-semibold text-indigo-300">
                  {resume ? resume.name : "Click to upload resume (PDF)"}
                </p>
              </div>
            </div>

            {/* Optional Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="GitHub (optional)"
                className="bg-black/40 border border-white/10 rounded-xl px-5 py-4"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
              <input
                placeholder="LinkedIn (optional)"
                className="bg-black/40 border border-white/10 rounded-xl px-5 py-4"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-5 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] transition"
            >
              {loading ? "Analyzing…" : "Analyze My Profile"}
            </button>

            {error && <p className="text-red-400 text-center">{error}</p>}
          </div>
        )}

        {/* ================= RESULT ================= */}
        {result && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-10">

            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <h2 className="text-2xl font-bold">Capability Report</h2>

              <div className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-center">
                <p className="text-xs uppercase tracking-widest text-green-400">
                  Career Readiness
                </p>
                <p className="text-2xl font-black text-green-400">
                  {result.capabilities?.career_readiness_score || 0}/100
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-semibold mb-4">Technical Capability</h3>
                <div className="flex flex-wrap gap-2">
                  {(result.capabilities?.technical_skills || []).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Professional Strengths</h3>
                <ul className="space-y-2">
                  {(result.capabilities?.soft_skills || []).map((skill: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
              <p className="text-gray-300">
                <span className="text-indigo-400 font-semibold">AI Summary:</span>{" "}
                {result.capabilities?.summary}
              </p>
            </div>

            {/* CTA */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => router.push("/opportunity")}
                className="px-10 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105 transition"
              >
                View Opportunities →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}