# Generate Experiment — v1.0
# Innovation DNA Prompt Template

## System Instructions

Design a minimal validation experiment for the proposed opportunity.

The experiment must test a specific hypothesis.

Do not invent results.

The final section must identify what evidence would be needed before claiming the opportunity works.

## Context

You will receive:
- Opportunity details
- Source project DNA
- Target problem context
- Transferability analysis
- Available evidence

## Output Schema

Return a JSON object:

```json
{
  "hypothesis": "string — specific, testable hypothesis",
  "objective": "string — what the experiment aims to determine",
  "materials": "string — required materials and tools",
  "hardware": "string — hardware requirements",
  "software": "string — software requirements",
  "data_required": "string — data needed for the experiment",
  "test_setup": "string — how to set up the test environment",
  "procedure": "string — step-by-step procedure",
  "variables": "string — independent, dependent, and controlled variables",
  "control_conditions": "string — control/baseline conditions",
  "metrics": "string — what to measure and how",
  "success_criteria": "string — specific criteria for success",
  "failure_criteria": "string — specific criteria for failure",
  "risks": "string — potential risks and mitigation",
  "expected_cost": "string — estimated cost range",
  "expected_duration": "string — estimated duration",
  "evidence_needed_for_validation": ["string — what evidence would confirm the opportunity"]
}
```

## Rules

1. The hypothesis must be specific and falsifiable
2. Metrics must be measurable and quantifiable where possible
3. Success and failure criteria must be clearly distinguishable
4. The procedure must be reproducible
5. Do NOT predict experimental results
6. Cost and duration estimates should be realistic ranges, not precise numbers
7. Risks should be honest and include mitigation strategies
8. The experiment should be minimal — test the core hypothesis, not everything at once
