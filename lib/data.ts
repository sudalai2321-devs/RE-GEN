export const projects = [
  { id:'p1', name:'Predictive Maintenance Pilot', domain:'Industrial IoT', status:'DNA Extracted', evidence:12, opportunities:4, updated:'12 min ago' },
  { id:'p2', name:'Low-Power Vision Node', domain:'Computer Vision', status:'Gap Detected', evidence:9, opportunities:2, updated:'1 hr ago' },
  { id:'p3', name:'Remote Water Stress Monitor', domain:'AgriTech', status:'Opportunity Discovery', evidence:16, opportunities:3, updated:'3 hrs ago' },
  { id:'p4', name:'Thermal Routing Prototype', domain:'Mobility', status:'Evidence Review', evidence:7, opportunities:0, updated:'Yesterday' }
];

export const dna = [
  { cat:'Technology', value:'Edge vibration sensing + anomaly classifier', confidence:'High', evidence:4 },
  { cat:'Capability', value:'Detects deviations in machine behavior from time-series signals', confidence:'High', evidence:6 },
  { cat:'Constraint', value:'Sensor deployment cost and calibration overhead', confidence:'Medium', evidence:3 },
  { cat:'Input', value:'Vibration measurements sampled over operating cycles', confidence:'High', evidence:5 },
  { cat:'Output', value:'Anomaly score and maintenance trigger', confidence:'High', evidence:4 },
  { cat:'Dependency', value:'Stable sensor placement + baseline operating profile', confidence:'Medium', evidence:2 },
  { cat:'Assumption', value:'Operating signatures remain sufficiently repeatable', confidence:'Medium', evidence:1 },
  { cat:'Environment', value:'Fixed industrial equipment with network access', confidence:'High', evidence:3 },
  { cat:'Failure Condition', value:'Noisy signals and infrequent labeled failures reduce reliability', confidence:'Medium', evidence:3 }
];

export const opportunities = [
  { id:'o1', source:'Predictive Maintenance Pilot', target:'Early defect detection for distributed cold-chain assets', targetDomain:'Cold Chain', capability:'Anomaly detection from vibration signals', limitation:'Requires robust calibration across device variants', evidence:8, status:'Candidate' },
  { id:'o2', source:'Low-Power Vision Node', target:'Wildlife corridor monitoring with sparse connectivity', targetDomain:'Conservation', capability:'On-device visual event filtering', limitation:'Battery + weather constraints need validation', evidence:6, status:'Evidence Review' },
  { id:'o3', source:'Remote Water Stress Monitor', target:'Smallholder irrigation leak localization', targetDomain:'Water Systems', capability:'Stress signal detection from remote observations', limitation:'Needs ground-truth alignment', evidence:5, status:'Candidate' }
];

export const evidence = [
  { id:'ev-104', claim:'Vibration sensing can identify changes in machine behavior.', source:'Research publication', publisher:'Demo source record', date:'2026-09-18', status:'Verified', confidence:'High', excerpt:'...changes in vibration patterns can be used as an input signal for detecting abnormal operating conditions...' },
  { id:'ev-105', claim:'The prototype depends on stable baseline operating profiles.', source:'Project report', publisher:'Uploaded project document', date:'2026-09-18', status:'Needs Review', confidence:'Medium', excerpt:'...the baseline signature is collected under expected operating conditions and used as a reference...' },
  { id:'ev-106', claim:'Deployment cost rises with additional sensing points.', source:'Project budget note', publisher:'User-provided evidence', date:'2026-09-17', status:'Verified', confidence:'High', excerpt:'...additional sensor positions increase installation and calibration effort...' }
];
