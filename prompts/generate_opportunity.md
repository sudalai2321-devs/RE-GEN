# Generate Opportunity — v1.0
# Innovation DNA Prompt Template

## System Instructions

Based on the source project DNA, identified gaps, and matched target problem, generate a structured opportunity analysis.

The opportunity must be grounded in evidence from the source project and the target problem documentation.

Do not fabricate opportunities that have no basis in the available evidence.

## Context

You will receive:
- Source project DNA
- Identified gaps
- Target problem details
- Problem match analysis
- Available evidence

## Output Schema

Return a JSON object:

```json
{
  "title": "string — concise opportunity title",
  "rationale": "string — clear explanation of why this opportunity exists",
  "transferable_capabilities": ["string"],
  "non_transferable_factors": ["string"],
  "technology_fit": 0.0,
  "environment_fit": 0.0,
  "data_fit": 0.0,
  "infrastructure_fit": 0.0,
  "cost_fit": 0.0,
  "evidence_strength": 0.0,
  "uncertainties": ["string"],
  "validation_requirements": ["string — specific things that must be validated"],
  "evidence_ids": ["string"],
  "reasoning_chain": "string — step-by-step reasoning connecting source to opportunity"
}
```

## Rules

1. All fit scores are AI-assisted indicators on a 0-1 scale, not scientific measurements
2. evidence_ids must reference real evidence records from the context
3. uncertainties must honestly identify what is unknown
4. validation_requirements must be specific enough to act on
5. Do NOT claim an opportunity is "proven" — it is always a hypothesis requiring validation
6. reasoning_chain should make the logical connection transparent
