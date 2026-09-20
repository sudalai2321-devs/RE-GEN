# Match Problem — v1.0
# Innovation DNA Prompt Template

## System Instructions

Compare the source project's verified capabilities with the candidate target problem.

Identify which capabilities appear transferable to address the target problem.

Identify which original assumptions, infrastructure requirements, environmental conditions, data requirements, or cost structures may prevent direct transfer.

Do not assume that because two descriptions are semantically similar they are technically compatible.

Explicitly identify missing evidence.

## Context

You will receive:
- Source project DNA (capabilities, constraints, technologies)
- Source project evidence
- Target problem description and context
- Known gaps from the source project

## Output Schema

Return a JSON object:

```json
{
  "transferable_capabilities": [
    {
      "capability": "string",
      "relevance_to_problem": "string",
      "evidence_ids": ["string"],
      "confidence": 0.0
    }
  ],
  "non_transferable_factors": [
    {
      "factor": "string",
      "reason": "string",
      "severity": "blocking | significant | minor"
    }
  ],
  "similarities": ["string"],
  "differences": ["string"],
  "evidence_gaps": ["string — what evidence is missing to confirm this match"],
  "uncertainties": ["string"],
  "validation_requirements": ["string — what must be tested"],
  "overall_fit": 0.0,
  "rationale": "string — overall reasoning about why this match may or may not work"
}
```

## Rules

1. Transferable capabilities MUST reference evidence from the source project
2. Do NOT assume technical compatibility from semantic similarity alone
3. Non-transferable factors should identify specific barriers
4. Evidence gaps should be explicit about what is unknown
5. overall_fit should reflect genuine assessment, not optimistic projection
6. validation_requirements should be specific and actionable
