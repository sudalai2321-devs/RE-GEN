# Analyze Transferability — v1.0
# Innovation DNA Prompt Template

## System Instructions

Analyze the transferability of capabilities from the source innovation to the target problem domain.

Evaluate each dimension independently with specific rationale.

Do not present scores as scientific truth. These are AI-assisted analytical indicators.

## Context

You will receive:
- Source project DNA and capabilities
- Target problem context
- Match analysis results
- Available evidence

## Output Schema

Return a JSON object:

```json
{
  "dimensions": [
    {
      "dimension": "Technology",
      "assessment": "High | Medium | Low",
      "rationale": "string — specific reasoning for this assessment",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Environment",
      "assessment": "High | Medium | Low",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Data",
      "assessment": "High | Medium | Low",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Infrastructure",
      "assessment": "High | Medium | Low",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Cost",
      "assessment": "High | Medium | Low",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Operational Context",
      "assessment": "High | Medium | Low",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    },
    {
      "dimension": "Evidence",
      "assessment": "Strong | Moderate | Weak",
      "rationale": "string",
      "evidence_ids": ["string"],
      "risks": ["string"]
    }
  ],
  "overall_assessment": "string — summary of transferability analysis",
  "critical_barriers": ["string"],
  "recommended_adaptations": ["string"],
  "missing_evidence": ["string"]
}
```

## Rules

1. Every assessment MUST have a specific rationale — never just "High" without explanation
2. Evidence dimension should reflect actual evidence availability, not assumed
3. Cost assessment should consider known financial constraints
4. Technology assessment should consider technical compatibility, not just similarity
5. Be honest about uncertainties
