# RE-GEN: Innovation DNA

> **RE:GEN — From Failed Innovations to New Possibilities**

What if a failed innovation is not truly a failure, but a solution that was applied to the wrong problem, environment, or industry? Across industries, countless projects are abandoned because of high costs, technical constraints, limited markets, lack of data, changing requirements, or unsuitable environments. Yet many of these projects contain valuable technologies, capabilities, and ideas that may still have relevance elsewhere. Innovation DNA explores this overlooked space between failure and possibility. It focuses on understanding what valuable elements remain within failed innovations and discovering whether they could open entirely new directions for solving problems in other contexts. The idea challenges the conventional approach of always starting from a blank page to create something new. Instead, it asks: “What can we rediscover from what has already failed?” Innovation DNA uncovers the hidden potential of failed innovations and explores how they can inspire new possibilities across problems, environments, and industries.

---

## Innovation DNA — Frontend

A standalone Next.js + React + TypeScript frontend prototype based on the supplied Innovation DNA build specification.

## Included

- Polished landing page
- How It Works workflow
- Dashboard
- Analyze workflow: Upload / Manual / Public Sources
- Projects and project detail
- Innovation DNA view
- Gap analysis
- Cross-domain opportunities
- Opportunity intelligence report
- Evidence map + evidence review drawer
- Experiment generator UI + save state
- Problem explorer
- Source library
- Experiments list
- Admin shell
- Responsive layout
- Demo data clearly labeled as demo

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

This is frontend-only. It currently uses deterministic demo data and simulated UI actions. Backend API calls, authentication, database persistence, jobs, source ingestion, embeddings, and real LLM providers should be wired to the backend described in the specification.
