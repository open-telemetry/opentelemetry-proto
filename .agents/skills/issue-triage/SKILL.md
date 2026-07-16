---
name: issue-triage
description: This project skill defines a systematic workflow to harvest, categorize, cluster, and prioritize open issues in the `open-telemetry/opentelemetry-proto` repository.
---

# Step-by-Step Triage Instructions

## Phase 1: Tool-Agnostic Harvesting

* **Goal**: Download all open issues into a unified JSON dataset (`.agents/triage/open_issues.json`) to serve as the single source of truth.
* **Agent Guidelines**:
  - Do not force specific helper modules. Harvest using whatever interface is active:
    - Use the provided `harvest_issues.py` script if python is available.
    - **GitHub CLI**: `gh issue list --state open --limit 100 --json number,title,body,labels,comments,createdAt,updatedAt,author`
    - **GitHub REST/GraphQL API**: Query the endpoint directly, filtering by state = open.
    - **Local File System**: If a local data backup exists, parse it directly using standard library parsers.
    - Using the Github MCP tool
  - Mandatory dataset properties: Issue number, title, body markdown, tags/labels, comments count, creation date, and author username.

## Phase 2: Semantic Similarity Clustering

* **Goal**: Scan the active dataset to detect duplicates, tracking epics, and overlapping problem clusters.
* **Target Convergence Clusters**:
  - **Cluster A: Profiles Serialization & Merging**: Group feedback on the experimental profiling signal spec (e.g. issues concerning `ProfilesDictionary` optimization, global vs resource-level dictionaries, attribute units reinvention, sample length validation).
  - **Cluster B: Bazel, Build, & BCR Publishing**: Group build integration issues (e.g. broken Bazel Central Registry tagging releases, lack of version identification in archives, Renovate dashboards).
  - **Cluster C: OTLP Transport, Responses, & Retries**: Group network recovery feedback (e.g. OTLP/HTTP failure decoding crashes, infinite Retry-After loops, log partial-success indexes).

## Phase 3: Multidimensional Categorization Schema

* **Goal**: Map every harvested issue precisely along three independent technical axes:

| Classification Axis | Permitted Categories | Mapping Rules |
| :--- | :--- | :--- |
| **1. Telemetry Signal** | `Traces`, `Metrics`, `Logs`, `Profiles`, `Common` | Map to `Common` if it concerns general protocol features (attributes, failure formats, retries) sharing multiple signal types. |
| **2. Technical Area** | `Core Protocol/Schema`, `Build Systems & CI/CD`, `Documentation & Examples`, `Ecosystem Integration` | Map to `Core Protocol` if it targets `.proto` file declarations, and `Build Systems` if it concerns compilers, make files, or module packaging. |
| **3. Issue Nature** | `Bug Fix`, `Enhancement`, `Specification Clarification`, `Chore/Cleanup`, `Invalid` | Map to `Clarification` if it targets documentation ambiguities or TODO items, and `Invalid` if it is spam. |

## Phase 4: Strategic Theme Synthesis (Signal Insulation)

* **Goal**: Synthesize individual categories into unified epic initiatives.
* **Agent Guideline**:
  - **Insulate Profiling Spec Work**: The experimental **Profiles** signal spec is under active development by a dedicated Special Interest Group (SIG). Keep all Profiling issues bundled under a single tracking track to prevent experimental layout details from bleeding into stable telemetry signals (Traces, Metrics, Logs).

## Phase 5: Dynamic Roadmap Prioritization Engine

* **Goal**: Score, sort, and prioritize categorized themes and issues dynamically on the fly, avoiding hardcoded mappings. Priorities MUST be drawn from live ecosystem states.

### Ecosystem Priority Discovery & Search Pathways

AI agents MUST dynamically harvest priority milestones at runtime:

1. **Local Repository Audit**:
   - Check the repository root context for a `ROADMAP.md` or `.github/ROADMAP.md` manifest if available.
2. **Global Community Registry Query**:
   - Query the central standard open-source repository `open-telemetry/community` on GitHub:
     - Pull and parse the live central project roadmap from `roadmap.md` on the main branch (served raw at `https://raw.githubusercontent.com/open-telemetry/community/main/roadmap.md`).
     - Query and index active GitHub Projects or Milestones inside `open-telemetry/community` repository if available.
3. **Execution Safety Rule**:
   - Since GitHub API file fetching tools (such as `get_file_contents` or `search_code`) may return file metadata rather than inline string content, or can place downloaded files outside the workspace search path, the agent MUST fallback to a direct Python programmatic fetch (via `urllib.request`) if local workspace searches for `roadmap.md` return empty.

### Dynamic Semantic Reconciliation Rules

Audit the categorized themes and issues against the fetched community priorities (e.g. OTel central P0, P1, P2 tiers):

- **OTel P0: Existing Artifacts Maintenance & Stabilizations**:
  - *Mapping target*: Direct priority targets to issues affecting baseline build stability, core dependency upgrades, tagging workflows (Bazel/BCR/VERSION), and multi-architecture compiler runner bugs blocking Collector/SDK developers.
- **OTel P1: Core Reliability (OTLP Logs, Transport & Semantic conventions)**:
  - *Mapping target*: Direct priority targets to critical transport recovers (HTTP failure body decoding crashes, Retry-After lockups, Logs partial success indexes).
- **OTel P2: New Capabilities & Subsystems (Profiling SIG, Client/RUM)**:
  - *Mapping target*: Direct priority targets to experimental signal specification blocks (Profiles signal dictionary merges, sample mapping arrays) or browser/client performance improvements.
- **OTel Backlog (Dynamic logging, CI/CD signals)**:
  - *Mapping target*: Defer to lowest priority category; prioritize minor doc Hugo edits or legacy TODO comment cleanups.

### Prioritized Roadmap Matrix Generation

Output the finalized prioritized roadmap matrix sorted dynamically by these live mapped categories: OTel P0 (P1 Local), OTel P1 (P2 Local), OTel P2 (P3 Local), and OTel Backlog (P4 Local).

The matrix MUST be delivered to the `ISSUE_TRIAGE.md` file.
