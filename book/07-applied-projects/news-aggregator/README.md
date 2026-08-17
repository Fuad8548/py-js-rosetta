# Capstone Project: Bangla News Aggregator & Summarizer

This is an **optional full-stack capstone** — a place to see the concepts
from Parts 1–6 combined into one real, deployable app, once you've learned
them individually through the focused subsection examples. It is not
required reading; each chapter/subsection stands on its own without it.

## What it does

Fetches articles from Bangla news RSS feeds, cleans and deduplicates them,
summarizes each with the Claude API, stores them in SQLite, serves them via
a FastAPI backend, and displays them in a Next.js frontend — with an
English/Bangla toggle.

## How it maps back to what you learned

| Concept from... | Used here for |
|---|---|
| Part 1 — Foundations | The basic fetch script this project starts from |
| Part 2 — Data & Collections | Parsing multiple feeds into structured records |
| Part 3 — Functional Programming | The fetch → clean → dedupe → summarize pipeline, as composed pure functions |
| Part 4 — OOP | `Source`, `Article`, `Summarizer` classes + SQLite persistence |
| Part 5 — Paradigm Synthesis | Pydantic models wrapping the FP pipeline |
| Part 6 — Advanced Patterns | Async concurrent fetching, retries, caching/rate-limit decorators |

## Following along with git tags

Each build stage is tagged, so you can check out this project exactly as it
should look at any point:

```bash
git checkout capstone-01   # CLI script only
git checkout capstone-04   # OOP layer added
git checkout main          # latest / final
```

## Setup

### Backend
```bash
cd project/backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Frontend (from Chapter 7 onward)
```bash
cd project/frontend
npm install
npm run dev
```

## Why this project

- Forces genuine **FP** (the fetch → clean → dedupe → summarize pipeline) and genuine **OOP** (stateful entities: sources, articles, summarizer client) — not contrived examples of either.
- Matches the target stack: **FastAPI + Next.js**, the exact freelance-relevant combination.
- Bilingual (Bangla/English) content handling is a genuine differentiator for a portfolio piece.
- Naturally needs async, error handling, caching, and rate-limiting by Chapter 6 — no forced examples needed.
