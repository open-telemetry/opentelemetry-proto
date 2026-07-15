#!/usr/bin/env python3
"""Mechanical Data Harvester for OpenTelemetry Protocol Issue Triage.

This script performs ONLY deterministic, tool-agnostic data harvesting:
1. Downloads open issues into `.agents/triage/open_issues.json`.
2. Downloads the live community roadmap into `.agents/triage/community_roadmap.md`.

All classification, clustering, prioritization, and synthesis decisions are left
entirely to the LLM agent during execution of the `/issue-triage` skill.
"""

import json
import subprocess
import urllib.request
from pathlib import Path

REPO_OWNER = "open-telemetry"
REPO_NAME = "opentelemetry-proto"
ROADMAP_URL = "https://raw.githubusercontent.com/open-telemetry/community/main/roadmap.md"


def harvest_open_issues(output_path: Path) -> list[dict]:
    """Fetch open issues from GitHub CLI or REST API into JSON dataset."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 1. Try gh CLI first
    try:
        cmd = [
            "gh",
            "issue",
            "list",
            "--state",
            "open",
            "--limit",
            "100",
            "--json",
            "number,title,body,labels,comments,createdAt,updatedAt,author",
        ]
        result = subprocess.run(
            cmd, capture_output=True, text=True, check=True
        )
        raw_issues = json.loads(result.stdout)
        formatted = []
        for iss in raw_issues:
            formatted.append(
                {
                    "number": iss.get("number"),
                    "title": iss.get("title"),
                    "body": iss.get("body"),
                    "labels": [
                        lbl["name"] if isinstance(lbl, dict) else lbl
                        for lbl in iss.get("labels", [])
                    ],
                    "comments": (
                        len(iss["comments"])
                        if isinstance(iss.get("comments"), list)
                        else iss.get("comments", 0)
                    ),
                    "createdAt": iss.get("createdAt"),
                    "author": (
                        iss.get("author", {}).get("login")
                        if isinstance(iss.get("author"), dict)
                        else str(iss.get("author"))
                    ),
                }
            )
        output_path.write_text(json.dumps(formatted, indent=2))
        return formatted
    except Exception:
        pass

    # 2. Fallback to urllib public REST API
    api_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues?state=open&per_page=100"
    req = urllib.request.Request(
        api_url, headers={"User-Agent": "OTel-Harvester"}
    )
    with urllib.request.urlopen(req) as resp:
        raw_issues = json.loads(resp.read().decode("utf-8"))

    formatted = []
    for iss in raw_issues:
        if "pull_request" in iss:
            continue
        formatted.append(
            {
                "number": iss.get("number"),
                "title": iss.get("title"),
                "body": iss.get("body"),
                "labels": [
                    lbl["name"] if isinstance(lbl, dict) else lbl
                    for lbl in iss.get("labels", [])
                ],
                "comments": iss.get("comments", 0),
                "createdAt": iss.get("created_at"),
                "author": (
                    iss.get("user", {}).get("login")
                    if isinstance(iss.get("user"), dict)
                    else str(iss.get("user"))
                ),
            }
        )

    output_path.write_text(json.dumps(formatted, indent=2))
    return formatted


def harvest_community_roadmap(output_path: Path):
    """Fetch live roadmap markdown from open-telemetry/community repository."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(
        ROADMAP_URL, headers={"User-Agent": "OTel-Harvester"}
    )
    with urllib.request.urlopen(req) as resp:
        text = resp.read().decode("utf-8")
    output_path.write_text(text)


def main():
    root = Path(__file__).resolve().parents[4]
    issues_file = root / ".agents" / "triage" / "open_issues.json"
    roadmap_file = root / ".agents" / "triage" / "community_roadmap.md"

    issues = harvest_open_issues(issues_file)
    harvest_community_roadmap(roadmap_file)

    print(f"Harvested {len(issues)} open issues -> {issues_file.relative_to(root)}")
    print(f"Harvested community roadmap -> {roadmap_file.relative_to(root)}")
    print("Ready for LLM semantic clustering, categorization, and prioritization.")


if __name__ == "__main__":
    main()
