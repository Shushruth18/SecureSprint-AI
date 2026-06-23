import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "SecureSprint AI API Working",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const repoUrl = body.repoUrl || "";

  const repoName =
    repoUrl.replace(/\/$/, "").split("/").pop() || "unknown-repository";

  let language = "Unknown";
  let framework = "Unknown";
  let scanners = ["Semgrep"];

  if (
    repoName.toLowerCase().includes("react") ||
    repoName.toLowerCase().includes("next")
  ) {
    language = "TypeScript";
    framework = "React / Next.js";
    scanners = ["npm audit", "Semgrep"];
  } else if (
    repoName.toLowerCase().includes("flask") ||
    repoName.toLowerCase().includes("django")
  ) {
    language = "Python";
    framework = "Flask / Django";
    scanners = ["Bandit", "pip-audit", "Semgrep"];
  } else {
    language = "Python";
    framework = "Flask";
    scanners = ["Bandit", "pip-audit", "Semgrep"];
  }

  return NextResponse.json({
    score: 72,
    repository: repoName,
    language,
    framework,
    scanners,
    findings: [
      {
        title: "Hardcoded API Key",
        severity: "High",
        file: "config.py",
        risk: "An attacker could steal and reuse the exposed API key.",
        fix: "Move the key to an environment variable.",
      },
      {
        title: "SQL Injection",
        severity: "Critical",
        file: "app.py",
        risk: "User input may directly modify the SQL query.",
        fix: "Use parameterized queries instead of string formatting.",
      },
    ],
  });
}