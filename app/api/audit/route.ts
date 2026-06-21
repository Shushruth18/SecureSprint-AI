import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "SecureSprint AI API Working",
  });
}

export async function POST() {
  return NextResponse.json({
    score: 72,
    repository: "vulnerable-python-demo",
    language: "Python",
    framework: "Flask",
    findings: [
      {
       title: "Hardcoded API Key",
       severity: "High",
       file: "config.py",
       risk: "An attacker could steal and reuse the exposed API key.",
       fix: "Move the key to an environment variable."
      },
      {
       title: "SQL Injection",
       severity: "Critical",
       file: "app.py",
       risk: "User input may directly modify the SQL query.",
       fix: "Use parameterized queries instead of string formatting."
      }
    ],
  });
}