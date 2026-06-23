"use client";

import { useState } from "react";

const scanSteps = [
  "Repository cloned inside Daytona sandbox",
  "Repository type detected: Python web app",
  "Bandit scan completed",
  "Semgrep scan completed",
  "Dependency audit completed",
  "Hermes generated final security report",
];

type Finding = {
  title: string;
  severity: string;
  file: string;
  risk?: string;
  fix?: string;
};

type Report = {
  score: number;
  repository: string;
  language: string;
  framework: string;
  scanners: string[];
  findings: Finding[];
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const handleScan = async () => {
  if (!repoUrl.trim()) {
    alert("Please enter a GitHub repository URL");
    return;
  }

  setScanned(false);
  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 2500));

  const response = await fetch("/api/audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repoUrl,
    }),
  });

  const data = await response.json();

  setReport(data);

  setLoading(false);
  setScanned(true);
};

  const criticalCount =
    report?.findings.filter((f) => f.severity === "Critical").length ?? 0;
  const highCount =
    report?.findings.filter((f) => f.severity === "High").length ?? 0;
  const mediumCount =
    report?.findings.filter((f) => f.severity === "Medium").length ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          Hermes-powered AI SOC inside Daytona sandboxes
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          SecureSprint AI
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
          Audit GitHub repositories safely, detect vulnerabilities, and generate
          developer-friendly security reports with risks and fixes.
        </p>

        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Paste GitHub repository URL..."
            className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <button
            onClick={handleScan}
            className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {loading ? "Scanning..." : "Run Security Audit"}
          </button>
        </div>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Critical</p>
            <h2 className="mt-2 text-4xl font-bold text-red-400">
              {scanned ? criticalCount : 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">High</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-400">
              {scanned ? highCount : 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Medium</p>
            <h2 className="mt-2 text-4xl font-bold text-yellow-400">
              {scanned ? mediumCount : 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Security Score</p>
            <h2 className="mt-2 text-4xl font-bold text-cyan-400">
              {scanned ? report?.score : "--"}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-cyan-300">
              SecureSprint AI Analysis
            </h2>

            <div className="space-y-3 text-slate-300">
              <p>🔍 Cloning Repository...</p>
              <p>🔎 Analyzing Repository Structure...</p>
              <p>🛡️ Selecting Security Scanners...</p>
              <p>⚡ Running Vulnerability Analysis...</p>
              <p>🤖 Hermes Generating Security Report...</p>
            </div>
           </div>
        )}
        
        {scanned && report && (
          <div className="mt-12">
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-6 text-2xl font-bold text-cyan-300">
                Repository Intelligence
              </h2>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Repository</p>
                  <p className="mt-2 font-semibold text-white">
                    {report.repository}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Language</p>
                  <p className="mt-2 font-semibold text-white">
                    {report.language}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Framework</p>
                  <p className="mt-2 font-semibold text-white">
                    {report.framework}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Scanners</p>
                  <p className="mt-2 font-semibold text-white">
                    {report?.scanners?.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 text-left md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-6 text-2xl font-bold text-cyan-300">
                  Live Scan Progress
                </h2>

                <div className="space-y-4">
                  {scanSteps.map((step) => (
                    <div
                      key={step}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-300"
                    >
                      ✅ {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-6 text-2xl font-bold text-cyan-300">
                  AI Security Report
                </h2>

                <div className="space-y-4">
                  {report.findings.map((finding) => (
                    <div
                      key={finding.title}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {finding.title}
                        </h3>

                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">
                          {finding.severity}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400">
                        File: {finding.file}
                      </p>

                      <p className="mt-3 text-sm text-slate-300">
                        <span className="font-semibold text-white">Risk:</span>{" "}
                        {finding.risk ?? "Risk explanation will be generated by Hermes."}
                      </p>

                      <p className="mt-2 text-sm text-slate-300">
                        <span className="font-semibold text-white">Fix:</span>{" "}
                        {finding.fix ?? "Remediation guidance will be generated by Hermes."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}