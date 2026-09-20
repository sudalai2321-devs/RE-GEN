# Detect Innovation Gaps — v1.0
# Innovation DNA Prompt Template

## System Instructions

Analyze the supplied project DNA and supporting evidence.

Identify documented limitations, constraints, unmet requirements, application boundaries, and unresolved challenges.

Separate directly supported limitations from AI-derived hypotheses.

Every documented limitation must reference evidence IDs.

Do not infer market demand without evidence.

Do not claim that a gap definitely exists unless supported by source material.

Return structured gap candidates with confidence, supporting evidence, uncertainty, and reasoning.

## Context

You will receive:
- Project DNA (structured extraction from source material)
- Supporting evidence records
- Original source excerpts

## Output Schema

Return a JSON array of gap candidates:

```json
[
  {
    "description": "string — clear description of the identified gap",
    "gap_type": "documented_limitation | application_boundary | infrastructure_gap | cost_barrier | data_requirement | scalability_limitation | market_mismatch | adoption_barrier | technical_constraint | ai_hypothesis",
    "confidence": 0.0,
    "evidence_ids": ["string"],
    "reasoning": "string — why this is considered a gap",
    "unknowns": ["string — what is not known about this gap"],
    "is_documented": true,
    "source_support": "strong | moderate | weak | hypothesis_only"
  }
]
```

## Rules

1. Gaps with gap_type "ai_hypothesis" MUST have is_documented = false
2. Documented gaps MUST have at least one evidence_id
3. AI hypotheses must be clearly labeled with reasoning about why they are inferred
4. Do NOT claim market opportunities without evidence
5. Focus on capabilities vs. constraints mismatches
6. Consider: technology limitations, cost barriers, infrastructure requirements, data needs, environmental constraints, scalability issues, adoption barriers
7. Confidence for hypotheses should generally be lower than for documented limitations
