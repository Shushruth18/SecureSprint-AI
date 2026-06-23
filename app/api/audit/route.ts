import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

  const localRepoPath = `C:\\Users\\lenovo\\OneDrive\\Desktop\\${repoName}`;

  try {
    let stdout = "";

    try {
      const result = await execAsync(
        `python -m bandit -r "${localRepoPath}" -f json`,
        { maxBuffer: 1024 * 1024 * 10 }
      );

      stdout = result.stdout;
    } catch (error: any) {
      // Bandit returns exit code 1 when it FINDS issues.
      // So we still read stdout.
      stdout = error.stdout;
    }

    const banditReport = JSON.parse(stdout);

    const findings = banditReport.results.map((item: any) => ({
      title: item.issue_text,
      severity:
        item.issue_severity.charAt(0).toUpperCase() +
        item.issue_severity.slice(1).toLowerCase(),
      file: item.filename.split("\\").pop(),
      risk: item.issue_text,
      fix: `Review Bandit rule ${item.test_id}: ${item.test_name}`,
    }));

    return NextResponse.json({
      score: Math.max(100 - findings.length * 15, 0),
      repository: repoName,
      language: "Python",
      framework: "Flask",
      scanners: ["Bandit"],
      findings,
    });
  } catch (error: any) {
    return NextResponse.json({
      score: 0,
      repository: repoName,
      language: "Unknown",
      framework: "Unknown",
      scanners: ["Bandit"],
      findings: [
        {
          title: "Bandit scan failed",
          severity: "High",
          file: "Backend API",
          risk: String(error),
          fix: "Check that the repository exists locally and Bandit is installed.",
        },
      ],
    });
  }
}