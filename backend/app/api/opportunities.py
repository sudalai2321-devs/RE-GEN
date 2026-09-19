from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Opportunity, Project, Problem, Evidence, OpportunityEvidence, Experiment
from app.dependencies import get_current_user
from app.schemas.opportunities import OpportunityResponse, OpportunityDetailResponse
from app.schemas.experiments import ExperimentResponse

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

@router.get("", response_model=List[OpportunityResponse])
def list_opportunities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    opps = db.query(Opportunity).all()
    for o in opps:
        p = db.query(Project).filter(Project.id == o.project_id).first()
        pr = db.query(Problem).filter(Problem.id == o.problem_id).first()
        o.project_name = p.name if p else ""
        o.problem_title = pr.title if pr else ""
        o.evidence_count = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == o.id).count()
    return opps

@router.get("/{id}", response_model=OpportunityResponse)
def get_opportunity(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    p = db.query(Project).filter(Project.id == o.project_id).first()
    pr = db.query(Problem).filter(Problem.id == o.problem_id).first()
    o.project_name = p.name if p else ""
    o.problem_title = pr.title if pr else ""
    o.evidence_count = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == o.id).count()
    return o

@router.get("/{id}/evidence")
def get_evidence_for_opp(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    links = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == id).all()
    evidence_ids = [l.evidence_id for l in links]
    return db.query(Evidence).filter(Evidence.id.in_(evidence_ids)).all()

def _synthesize_experiment_data(o: Opportunity) -> dict:
    caps = o.transferable_capabilities or []
    reqs = o.validation_requirements or []
    uncerts = o.uncertainties or []
    
    cap_str = caps[0] if caps else "stabilization and locomotion subsystem"
    req_str = reqs[0] if reqs else "benchmark operational performance against baseline thresholds"
    uncert_str = uncerts[0] if uncerts else "environmental boundary constraints"
    
    hypothesis = (
        f"Adapting {cap_str} to address '{o.title}' will fulfill target domain criteria ({req_str}) "
        f"with >85% operational efficiency while mitigating boundary risks ({uncert_str})."
    )
    objective = (
        f"Empirically validate whether {o.title} functions reliably in the target operating domain "
        f"under real-world environmental, mechanical, and load conditions."
    )
    materials = (
        f"Prototype test unit equipped with instrumentation sensors; embedded telemetry data acquisition logger; "
        f"calibrated test environment fixture; multi-channel data recorder."
    )
    data_required = (
        f"Continuous operational telemetry logs (sampling rate >= 50Hz); power consumption profiles; "
        f"environmental baseline metrics; boundary stress anomaly logs."
    )
    procedure = (
        f"1. Setup instrumentation rig and verify sensor calibration zero-points.\n"
        f"2. Execute 30 baseline calibration cycles under static controlled conditions.\n"
        f"3. Run continuous multi-stage stress trials according to protocol requirement: {req_str}.\n"
        f"4. Record dynamic response curves, latency, error margins, and thermal/power draw.\n"
        f"5. Compare performance against industry benchmarks and evaluate refutation criteria."
    )
    variables = (
        f"Independent: Operational load levels, ambient environmental conditions, operating duration.\n"
        f"Dependent: Response accuracy, stability margin, energy efficiency, error rate.\n"
        f"Controlled: Sensor calibration parameters, data sampling rate, test fixture geometry."
    )
    metrics = (
        f"System transferability response time, mean time between errors, dynamic error margin (< 3.0%), "
        f"energy efficiency metric, validation compliance score."
    )
    success_criteria = (
        f"Statistically significant improvement over baseline (> 20% margin); "
        f"zero unhandled fault conditions across 50 consecutive test cycles; satisfies requirement: {req_str}."
    )
    failure_criteria = (
        f"Performance degradation > 15% under peak stress; persistent uncompensated boundary errors; "
        f"inability to outperform conventional solutions in the target domain."
    )
    risks = (
        f"Boundary interface mismatch; unforeseen domain-specific environmental wear; "
        f"sensor telemetry drift during extended test cycles."
    )
    expected_cost = "$2,000 - $5,000 (Instrumentation & prototype test cycles)"
    expected_duration = "3-5 weeks"

    return {
        "hypothesis": hypothesis,
        "objective": objective,
        "materials": materials,
        "data_required": data_required,
        "procedure": procedure,
        "variables": variables,
        "metrics": metrics,
        "success_criteria": success_criteria,
        "failure_criteria": failure_criteria,
        "risks": risks,
        "expected_cost": expected_cost,
        "expected_duration": expected_duration,
        "status": "planned"
    }

@router.post("/{id}/experiment", response_model=ExperimentResponse)
def create_experiment(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    existing = db.query(Experiment).filter(Experiment.opportunity_id == id).first()
    if existing:
        return existing

    exp_data = _synthesize_experiment_data(o)
    e = Experiment(opportunity_id=id, **exp_data)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

@router.get("/{id}/experiment", response_model=List[ExperimentResponse])
def get_experiments(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    experiments = db.query(Experiment).filter(Experiment.opportunity_id == id).all()
    if not experiments:
        o = db.query(Opportunity).filter(Opportunity.id == id).first()
        if o:
            exp_data = _synthesize_experiment_data(o)
            e = Experiment(opportunity_id=id, **exp_data)
            db.add(e)
            db.commit()
            db.refresh(e)
            return [e]
    return experiments
