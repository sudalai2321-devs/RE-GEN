from app.models.models import (
    User, Project, Problem, Source, Technology, Capability,
    DNAItem, Gap, Opportunity, OpportunityEvidence,
    Experiment, ExperimentResult, Evidence, Job, AnalysisRun, Tag
)
from app.core.security import get_password_hash
from datetime import datetime, timezone


def seed_database(db):
    """Seed the database with comprehensive demo data."""

    # ── Users ──
    admin = User(
        email="admin@innovationdna.ai", name="Admin User",
        password_hash=get_password_hash("admin123"), role="admin"
    )
    demo = User(
        email="demo@innovationdna.ai", name="Demo User",
        password_hash=get_password_hash("demo123"), role="user"
    )
    db.add_all([admin, demo])
    db.commit()
    db.refresh(admin)
    db.refresh(demo)

    # ── Sources (30+) ──
    sources_data = [
        ("IoT Sensor Networks for Industrial Monitoring", "IEEE", "research_paper", "https://ieeexplore.ieee.org", "2023-03-15", "Comprehensive study of LPWAN-based industrial sensor deployments and their limitations in extreme environments."),
        ("WHO Report on Rural Healthcare Access", "World Health Organization", "government_report", "https://www.who.int/publications", "2023-06-01", "Global analysis of healthcare delivery challenges in remote and underserved communities."),
        ("Augmented Reality in Enterprise: Lessons from Consumer Failures", "MIT Technology Review", "research_paper", "https://www.technologyreview.com", "2022-11-20", "Analysis of why consumer AR products failed and how enterprise applications found success."),
        ("The Future of Energy Storage and Grid Resilience", "McKinsey & Company", "company_report", "https://www.mckinsey.com/industries/energy", "2023-09-10", "Report on energy storage technologies, grid integration challenges, and cost trajectories."),
        ("Predictive Maintenance in Manufacturing: A Systematic Review", "Springer Nature", "research_paper", "https://link.springer.com", "2023-01-25", "Meta-analysis of predictive maintenance approaches, their accuracy, and deployment challenges."),
        ("Smart Agriculture: IoT Applications and Challenges", "FAO", "government_report", "https://www.fao.org", "2023-04-18", "Review of IoT deployments in agriculture including water management, crop monitoring, and supply chain."),
        ("Modular Electronics: Engineering Feasibility Study", "Stanford University", "academic_project", "https://engineering.stanford.edu", "2021-08-30", "Technical analysis of modular consumer electronics, thermal management, and connector reliability."),
        ("Motion Sensing Technologies: From Gaming to Robotics", "ACM Computing Surveys", "research_paper", "https://dl.acm.org", "2022-07-14", "Survey of depth-sensing and motion capture technologies and their cross-domain applications."),
        ("Consumer Behavior in Digital Media Consumption", "Harvard Business Review", "company_report", "https://hbr.org", "2022-03-05", "Study of shifting media consumption patterns, attention spans, and platform preferences."),
        ("Microfluidics in Point-of-Care Diagnostics", "Nature Biotechnology", "research_paper", "https://www.nature.com/nbt", "2023-02-12", "Technical review of microfluidic device capabilities, limitations in blood analysis at small volumes."),
        ("Urban Mobility Solutions: A Comparative Analysis", "World Economic Forum", "government_report", "https://www.weforum.org", "2023-07-22", "Analysis of personal transportation solutions, last-mile delivery, and urban infrastructure requirements."),
        ("Solar Panel Technology Evolution and Market Dynamics", "NREL", "government_report", "https://www.nrel.gov", "2023-05-30", "Comprehensive data on solar cell efficiency, manufacturing costs, and market competition trends."),
        ("Vibration Analysis for Equipment Health Monitoring", "ASME Journal", "research_paper", "https://asmedigitalcollection.asme.org", "2022-09-15", "Technical study on vibration sensing techniques for rotating machinery fault detection."),
        ("Remote Patient Monitoring Systems: Efficacy Review", "The Lancet Digital Health", "research_paper", "https://www.thelancet.com/digital-health", "2023-08-20", "Systematic review of remote monitoring technologies and their clinical outcomes in rural settings."),
        ("Water Resource Management Using Sensor Networks", "UNESCO", "government_report", "https://www.unesco.org", "2023-03-22", "Global assessment of water monitoring technologies and their deployment in water-scarce regions."),
        ("Structural Health Monitoring: State of the Art", "ASCE Journal", "research_paper", "https://ascelibrary.org", "2023-01-10", "Review of sensor-based structural health monitoring for bridges, buildings, and infrastructure."),
        ("Edge Computing for Industrial IoT", "Gartner", "company_report", "https://www.gartner.com", "2023-06-15", "Analysis of edge computing architectures for latency-sensitive industrial applications."),
        ("Precision Agriculture Technology Assessment", "USDA", "government_report", "https://www.usda.gov", "2023-04-01", "Assessment of precision agriculture technologies including sensors, drones, and data analytics."),
        ("Battery Technology for Remote Deployments", "Journal of Power Sources", "research_paper", "https://www.sciencedirect.com", "2023-02-28", "Study of battery performance in extreme temperatures and remote deployment scenarios."),
        ("Machine Learning for Anomaly Detection: Industrial Applications", "IEEE TPAMI", "research_paper", "https://ieeexplore.ieee.org", "2023-05-10", "Survey of ML-based anomaly detection methods applied to industrial monitoring systems."),
        ("Wearable Health Sensors: Technical Capabilities and Limitations", "BMJ Digital", "research_paper", "https://digital.bmj.com", "2023-07-01", "Assessment of wearable sensor accuracy, power consumption, and clinical applicability."),
        ("Infrastructure Monitoring in Developing Nations", "World Bank", "government_report", "https://www.worldbank.org", "2023-04-15", "Analysis of infrastructure monitoring challenges and low-cost sensor solutions for developing countries."),
        ("Smart Building Energy Management Systems", "DOE", "government_report", "https://www.energy.gov", "2023-08-01", "Technical assessment of building energy management systems and their ROI in commercial buildings."),
        ("Natural Language Processing for Technical Document Analysis", "ACL Anthology", "research_paper", "https://aclanthology.org", "2023-06-20", "Methods for extracting structured information from technical and scientific documents."),
        ("Supply Chain Monitoring with IoT", "Deloitte", "company_report", "https://www2.deloitte.com", "2023-03-10", "Analysis of IoT sensor applications in supply chain visibility, cold chain monitoring, and logistics."),
        ("Climate-Resilient Agriculture Practices", "IPCC", "government_report", "https://www.ipcc.ch", "2023-05-15", "Assessment of climate adaptation technologies for agriculture including irrigation and soil monitoring."),
        ("Digital Twin Technology for Industrial Systems", "Siemens Research", "company_report", "https://www.siemens.com/research", "2023-07-30", "Technical overview of digital twin implementations in manufacturing and predictive maintenance."),
        ("Telemedicine Deployment: Lessons Learned", "AMA Journal of Ethics", "research_paper", "https://journalofethics.ama-assn.org", "2023-01-15", "Analysis of telemedicine rollouts, infrastructure requirements, and patient outcomes in rural areas."),
        ("Environmental Monitoring Sensor Networks", "EPA", "government_report", "https://www.epa.gov", "2023-09-01", "Review of sensor networks for air quality, water quality, and environmental monitoring."),
        ("Failed Innovation Analysis: Patterns and Lessons", "Innovation Policy and the Economy", "research_paper", "https://www.nber.org", "2022-12-01", "Meta-analysis of documented innovation failures, common patterns, and transferable insights."),
    ]

    source_objs = []
    for title, publisher, stype, url, pub_date, desc in sources_data:
        s = Source(
            title=title, publisher=publisher, source_type=stype,
            url=url, publication_date=pub_date, description=desc,
            status="verified", is_demo=True, created_by=admin.id
        )
        db.add(s)
        source_objs.append(s)
    db.commit()
    for s in source_objs:
        db.refresh(s)

    # ── Technologies (50+) ──
    tech_data = [
        ("LPWAN (LoRaWAN)", "Low-power wide-area networking for IoT devices with 10+ km range", "IoT"),
        ("MEMS Accelerometers", "Micro-electromechanical vibration and motion sensors", "Sensors"),
        ("Edge Computing", "Local data processing at the device/gateway level", "Computing"),
        ("Convolutional Neural Networks", "Deep learning for pattern recognition in sensor data", "AI/ML"),
        ("Time Series Analysis", "Statistical methods for temporal data patterns", "AI/ML"),
        ("Microfluidics", "Manipulation of small fluid volumes in miniaturized devices", "Biotech"),
        ("Depth Sensing (Structured Light)", "3D environment mapping using infrared projectors", "Sensors"),
        ("AR Display (Waveguide)", "Transparent displays for augmented reality overlays", "Display"),
        ("Gyroscopic Stabilization", "Self-balancing mechanisms for personal transport", "Mechanical"),
        ("Modular Connectors (Electroperm)", "Electro-permanent magnet connections for modular devices", "Hardware"),
        ("Cloud ML Pipeline", "Scalable cloud-based machine learning training and inference", "AI/ML"),
        ("Vibration Spectral Analysis", "Frequency-domain analysis of mechanical vibrations", "Signal Processing"),
        ("Photovoltaic Cells (Thin Film)", "Flexible solar energy conversion technology", "Energy"),
        ("Bluetooth Low Energy (BLE)", "Short-range low-power wireless communication", "Wireless"),
        ("Predictive Analytics", "Statistical models for forecasting equipment failures", "AI/ML"),
        ("Computer Vision", "Image and video analysis using deep learning", "AI/ML"),
        ("Natural Language Processing", "Text analysis and information extraction", "AI/ML"),
        ("Digital Twin", "Virtual replica of physical systems for simulation", "Computing"),
        ("MQTT Protocol", "Lightweight messaging protocol for IoT", "IoT"),
        ("Raspberry Pi / Arduino", "Low-cost embedded computing platforms", "Hardware"),
        ("GPS/GNSS Tracking", "Satellite-based positioning and tracking", "Navigation"),
        ("Capacitive Soil Sensors", "Soil moisture measurement without corrosion", "Agriculture"),
        ("Thermal Imaging", "Infrared temperature measurement and visualization", "Sensors"),
        ("Blockchain", "Distributed ledger for supply chain traceability", "Security"),
        ("5G Networks", "High-bandwidth low-latency mobile networks", "Wireless"),
        ("RFID/NFC", "Radio-frequency identification for asset tracking", "Wireless"),
        ("LiDAR", "Light detection and ranging for 3D mapping", "Sensors"),
        ("Piezoelectric Energy Harvesting", "Converting mechanical vibration to electrical energy", "Energy"),
        ("Fog Computing", "Intermediate processing layer between edge and cloud", "Computing"),
        ("Anomaly Detection Algorithms", "ML algorithms for identifying unusual patterns", "AI/ML"),
        ("Drone-based Inspection", "UAV platforms for remote visual inspection", "Robotics"),
        ("Electrochemical Sensors", "Chemical detection through electrical signal changes", "Sensors"),
        ("Mesh Networking", "Self-organizing wireless networks for coverage extension", "Wireless"),
        ("Reinforcement Learning", "AI agents learning optimal actions through trial", "AI/ML"),
        ("Data Fusion", "Combining multiple sensor data streams for better accuracy", "AI/ML"),
        ("Solar-Powered Nodes", "Self-sustaining sensor nodes with photovoltaic power", "Energy"),
        ("Strain Gauges", "Structural deformation measurement sensors", "Sensors"),
        ("WebRTC", "Real-time browser-based communication", "Software"),
        ("Containerization (Docker)", "Application packaging and deployment", "DevOps"),
        ("GraphQL", "Flexible API query language", "Software"),
        ("Transfer Learning", "Adapting pre-trained ML models to new domains", "AI/ML"),
        ("Federated Learning", "Distributed ML training without centralizing data", "AI/ML"),
        ("Event-Driven Architecture", "Reactive system design pattern", "Software"),
        ("SCADA Integration", "Supervisory control and data acquisition systems", "Industrial"),
        ("Optical Fiber Sensing", "Distributed sensing using fiber optic cables", "Sensors"),
        ("Wearable Biosensors", "Body-worn health monitoring sensors", "Healthcare"),
        ("Smart Contracts", "Self-executing blockchain-based agreements", "Software"),
        ("Robotic Process Automation", "Automated repetitive task execution", "Automation"),
        ("Quantum Sensors", "Ultra-precise measurements using quantum effects", "Sensors"),
        ("Synthetic Data Generation", "AI-generated training data for ML models", "AI/ML"),
    ]

    tech_objs = []
    for name, desc, domain in tech_data:
        t = Technology(name=name, description=desc, domain=domain)
        db.add(t)
        tech_objs.append(t)
    db.commit()

    # ── Capabilities ──
    cap_data = [
        ("Real-time vibration monitoring", "Continuous measurement and analysis of mechanical vibrations"),
        ("Anomaly detection in sensor data", "Identifying unusual patterns that indicate equipment issues"),
        ("Long-range wireless data transmission", "Sending data over 10+ km without infrastructure"),
        ("Low-power continuous operation", "Operating sensors for months on battery power"),
        ("3D spatial mapping", "Creating three-dimensional maps of physical spaces"),
        ("Motion tracking without markers", "Tracking body or object movement using depth cameras"),
        ("Micro-volume fluid analysis", "Analyzing tiny amounts of liquid samples"),
        ("Self-balancing locomotion", "Dynamic stabilization for personal transportation"),
        ("Modular hardware assembly", "Connecting and disconnecting components without tools"),
        ("Predictive failure forecasting", "Predicting equipment failures before they occur"),
        ("Multi-sensor data fusion", "Combining data from multiple sensor types for accuracy"),
        ("Edge inference", "Running ML models locally on resource-constrained devices"),
        ("Remote environmental monitoring", "Monitoring conditions in inaccessible locations"),
        ("Structural integrity assessment", "Evaluating health of bridges, buildings, infrastructure"),
        ("Precision irrigation control", "Automated water delivery based on soil conditions"),
    ]
    for name, desc in cap_data:
        db.add(Capability(name=name, description=desc))
    db.commit()

    # ── Projects (12) ──
    projects_data = [
        {
            "name": "Project AeroSense IoT",
            "domain": "Industrial IoT",
            "objective": "Deploy low-cost wireless sensor networks for predictive maintenance in manufacturing facilities",
            "problem": "Manufacturing equipment failures cause unplanned downtime costing millions annually. Current monitoring requires expensive wired sensor installations.",
            "outcome": "Successfully demonstrated vibration-based anomaly detection with 87% accuracy in controlled lab environment. Field deployment limited by sensor costs and battery life in extreme temperatures.",
            "failure_summary": "High per-sensor deployment cost ($200+/unit) made ROI negative for small/medium facilities. Battery degradation in cold environments (<-10°C) reduced monitoring windows. Network connectivity gaps in metal-heavy factory floors.",
            "status": "validated", "is_demo": True,
        },
        {
            "name": "Google Glass Explorer Edition",
            "domain": "Consumer AR",
            "objective": "Create an always-on augmented reality display for everyday consumer use",
            "problem": "Consumers lacked hands-free access to digital information while navigating the physical world",
            "outcome": "Launched in 2013 at $1,500. Discontinued for consumers in 2015 due to privacy concerns, social stigma, and limited battery life. Pivoted to enterprise applications.",
            "failure_summary": "Social acceptance barriers: 'Glasshole' perception. Privacy concerns about always-on camera. Limited 45-minute battery life. Narrow field of view. High price point for consumers.",
            "status": "dna_extracted", "is_demo": True,
        },
        {
            "name": "Segway Personal Transporter",
            "domain": "Personal Transportation",
            "objective": "Revolutionize urban personal mobility with a self-balancing electric scooter",
            "problem": "Last-mile transportation gap between public transit and final destination",
            "outcome": "Sold far below projections. Found niche success in tourism, security, and warehouse operations. Company sold in 2020.",
            "failure_summary": "Price ($5,000+) too high for mass adoption. No clear infrastructure (sidewalk vs road). Regulatory uncertainty. Heavy (45kg) and difficult to transport. Perceived as novelty rather than practical transport.",
            "status": "gap_detected", "is_demo": True,
        },
        {
            "name": "Theranos Minilab",
            "domain": "Healthcare Diagnostics",
            "objective": "Perform hundreds of blood tests from a single finger prick using miniaturized lab equipment",
            "problem": "Traditional blood testing requires large venous draws, expensive lab equipment, and long wait times",
            "outcome": "Technology never worked as claimed. Company dissolved after fraud prosecution. Core microfluidic approach had fundamental physics limitations.",
            "failure_summary": "Fundamental physics: many tests require minimum blood volumes that finger pricks cannot provide. Dilution introduced unacceptable error rates. Management concealed failures.",
            "status": "failed", "is_demo": True,
        },
        {
            "name": "Quibi Short-Form Streaming",
            "domain": "Digital Media",
            "objective": "Create premium short-form video content (5-10 minutes) optimized for mobile viewing",
            "problem": "Consumers wanted premium content for short viewing sessions (commutes, waiting rooms)",
            "outcome": "Launched April 2020, shut down December 2020 after spending $1.75B. Sold content library to Roku.",
            "failure_summary": "Launched during COVID-19 pandemic when commuting stopped. No TV casting support at launch. Free alternatives (YouTube, TikTok) dominated. Content quality didn't justify subscription cost.",
            "status": "dna_extracted", "is_demo": True,
        },
        {
            "name": "Amazon Fire Phone",
            "domain": "Mobile Devices",
            "objective": "Create a smartphone deeply integrated with Amazon's shopping ecosystem featuring 3D dynamic perspective",
            "problem": "Amazon lacked a mobile hardware platform to drive commerce engagement",
            "outcome": "Launched June 2014 at $199. Price cut to $0.99 within months. Discontinued September 2015 with estimated $170M write-down.",
            "failure_summary": "3D features (Dynamic Perspective) were gimmicky with no compelling use cases. Limited app ecosystem (Fire OS). Firefly shopping feature felt intrusive. Late market entry against established iOS and Android.",
            "status": "dna_extracted", "is_demo": True,
        },
        {
            "name": "Microsoft Kinect",
            "domain": "Motion Sensing",
            "objective": "Enable controller-free gaming through full-body motion tracking and voice commands",
            "problem": "Traditional game controllers created a barrier to casual and fitness gaming",
            "outcome": "Sold 35M units but discontinued for Xbox. Technology found second life in robotics, healthcare rehabilitation, and 3D scanning applications.",
            "failure_summary": "Required large play space (6+ feet). Input latency frustrating for action games. Few compelling exclusive titles. Always-on camera raised privacy concerns. Core gamers preferred controllers.",
            "status": "gap_detected", "is_demo": True,
        },
        {
            "name": "Nokia N-Gage",
            "domain": "Mobile Gaming",
            "objective": "Combine mobile phone and handheld gaming console into a single device",
            "problem": "Consumers carried both a phone and a Game Boy / PSP and wanted device consolidation",
            "outcome": "Sold 3 million units against projected 6 million. Discontinued in 2005. 'Sidetalking' meme damaged brand.",
            "failure_summary": "Awkward taco-shaped design requiring holding device sideways to make calls. Game cartridge slot required battery removal to swap. Screen too small for gaming. Competed poorly against dedicated Game Boy Advance.",
            "status": "dna_extracted", "is_demo": True,
        },
        {
            "name": "Juicero Smart Juicer",
            "domain": "Consumer Appliances",
            "objective": "Create a connected countertop juicing system using pre-packaged produce pouches",
            "problem": "Fresh juice preparation is messy, time-consuming, and requires produce shopping",
            "outcome": "Raised $120M in funding. Bloomberg revealed pouches could be squeezed by hand. Company shut down in September 2017.",
            "failure_summary": "Over-engineered: $400 machine with $5-8 pouches that could be hand-squeezed. WiFi-connected juicer was a solution looking for a problem. DRM on juice pouches alienated consumers.",
            "status": "failed", "is_demo": True,
        },
        {
            "name": "Solyndra Cylindrical Solar",
            "domain": "Renewable Energy",
            "objective": "Develop cylindrical thin-film solar panels that capture light from all angles without tracking systems",
            "problem": "Traditional flat solar panels require precise angular positioning and tracking to maximize efficiency",
            "outcome": "Received $535M DOE loan guarantee. Filed bankruptcy in 2011 as silicon prices dropped 90%, making their technology uneconomical.",
            "failure_summary": "Business model assumed permanently high silicon prices. When polysilicon prices crashed, conventional flat panels became far cheaper. Cylindrical design had lower peak efficiency. Manufacturing costs remained high.",
            "status": "gap_detected", "is_demo": True,
        },
        {
            "name": "Project Ara Modular Phone",
            "domain": "Mobile Devices",
            "objective": "Create a smartphone with swappable hardware modules (camera, battery, processor, display)",
            "problem": "Smartphone obsolescence forces complete device replacement when only one component is outdated",
            "outcome": "Google cancelled the project in 2016 after multiple prototype generations. Technical challenges with heat dissipation and structural integrity proved intractable.",
            "failure_summary": "Modular connectors added weight and thickness. Heat dissipation across module boundaries was unsolved. Electrical interference between modules. Per-module cost exceeded integrated design. Consumer interest didn't match engineering complexity.",
            "status": "dna_extracted", "is_demo": True,
        },
        {
            "name": "WebOS by Palm/HP",
            "domain": "Mobile Software",
            "objective": "Create a modern, card-based mobile operating system with true multitasking and web technologies",
            "problem": "Early mobile OSes were clunky and lacked intuitive multitasking or notification systems",
            "outcome": "Critically acclaimed but commercially failed. HP acquired Palm for $1.2B, then abandoned webOS hardware. Eventually sold to LG for smart TV use.",
            "failure_summary": "Excellent software on underwhelming hardware (Palm Pre). App ecosystem never gained critical mass. Too late to compete with iOS and Android momentum. HP mismanagement after acquisition.",
            "status": "gap_detected", "is_demo": True,
        },
    ]

    project_objs = []
    for pd in projects_data:
        p = Project(user_id=demo.id, **pd)
        db.add(p)
        project_objs.append(p)
    db.commit()
    for p in project_objs:
        db.refresh(p)

    # ── Problems (30+) ──
    problems_data = [
        ("Rural Healthcare Monitoring Gap", "Millions of patients in remote areas lack access to continuous health monitoring, leading to late-stage disease detection and preventable deaths.", "Healthcare", "Remote Medicine", "Patients in rural and remote communities", "Global, acute in Sub-Saharan Africa and South Asia", "Community health workers, periodic mobile clinics", "Limited infrastructure, high cost, poor connectivity"),
        ("Predictive Maintenance for Small Manufacturers", "Small and medium manufacturers cannot afford enterprise predictive maintenance systems, leading to reactive maintenance and costly unplanned downtime.", "Manufacturing", "Maintenance", "Small/medium factory operators", "Global", "Scheduled maintenance, manual inspections", "High sensor costs, complex installation, requires ML expertise"),
        ("Agricultural Water Waste", "Irrigation systems waste 40-60% of water through over-watering, poor timing, and lack of soil moisture data, critical in water-scarce regions.", "Agriculture", "Irrigation", "Farmers and agricultural communities", "Global, acute in Middle East, Australia, Western US", "Drip irrigation, pivot systems, manual scheduling", "Lack of real-time soil data, high sensor costs for smallholders"),
        ("Bridge and Infrastructure Deterioration", "Aging bridges and infrastructure lack continuous monitoring, with inspections happening only every 2 years, missing critical deterioration between visits.", "Infrastructure", "Structural Health", "Urban populations, transportation users", "Global, acute in US (45,000+ structurally deficient bridges)", "Biennial visual inspections, load testing", "Infrequent monitoring misses progressive deterioration"),
        ("Factory Energy Optimization", "Manufacturing facilities waste 20-30% of energy through inefficient motor operation, HVAC, and lack of real-time consumption visibility.", "Energy", "Industrial Efficiency", "Factory operators and energy managers", "Global", "Scheduled HVAC, manual motor management", "Lack of real-time monitoring, complex multi-system optimization"),
        ("Cold Chain Monitoring for Vaccines", "Temperature excursions during vaccine transport cause 25% wastage in developing countries, compromising immunization programs.", "Healthcare", "Supply Chain", "Healthcare providers, immunization programs", "Developing countries globally", "Passive cold boxes, ice packs, temperature loggers", "Loggers provide retrospective data only, no real-time alerts"),
        ("Urban Air Quality Monitoring", "Cities lack granular, real-time air quality data at neighborhood level, preventing targeted pollution interventions and health advisories.", "Environment", "Air Quality", "Urban residents, especially vulnerable populations", "Global megacities", "Government monitoring stations (sparse), satellite data", "Station density too low for neighborhood-level data"),
        ("Aquaculture Health Monitoring", "Fish farm operators lack early warning systems for disease outbreaks, water quality changes, and feeding optimization, leading to stock losses.", "Agriculture", "Aquaculture", "Fish farmers and aquaculture operators", "Global, major in Norway, Chile, SE Asia", "Manual water testing, visual inspection", "Infrequent testing, subjective assessments"),
        ("Remote Student Engagement Assessment", "Educators cannot effectively gauge student engagement and comprehension in remote/hybrid learning environments.", "Education", "EdTech", "Students and educators in remote learning", "Global", "Participation tracking, quiz scores, surveys", "Unreliable self-reports, engagement ≠ webcam on"),
        ("Wildfire Early Detection", "Current wildfire detection relies on satellite passes and human spotters, with detection delays of 30+ minutes allowing fires to become uncontrollable.", "Environment", "Disaster Prevention", "Communities in fire-prone regions", "Western US, Australia, Mediterranean", "Satellite monitoring, fire lookout towers, public reports", "Satellite revisit gaps, lookout limited coverage"),
        ("Mining Equipment Safety Monitoring", "Underground mining equipment failures cause deadly accidents and costly shutdowns, with current monitoring limited to periodic manual checks.", "Mining", "Safety", "Mine workers and operators", "Global mining regions", "Manual inspections, shift-based checks", "Harsh environment damages sensors, connectivity underground"),
        ("Elderly Fall Detection at Home", "Falls are the leading cause of injury death in elderly. Current medical alert systems require conscious button pressing, failing in unconsciousness.", "Healthcare", "Elder Care", "Elderly living independently, caregivers", "Global, aging populations", "Medical alert pendants, regular check-in calls", "Requires conscious activation, high false alarm rates"),
        ("Livestock Health Monitoring", "Ranchers managing large herds cannot individually monitor animal health, leading to late disease detection and herd-wide outbreaks.", "Agriculture", "Livestock", "Ranchers and livestock farmers", "Global", "Visual inspection, periodic veterinary visits", "Large areas, many animals, infrequent observation"),
        ("Post-Disaster Infrastructure Assessment", "After earthquakes/hurricanes, structural assessment of buildings takes weeks with manual inspections, delaying safe reoccupation.", "Infrastructure", "Disaster Response", "Emergency responders, building occupants", "Earthquake and hurricane zones globally", "Visual inspection teams, engineering assessments", "Slow, dangerous, subjective, insufficient engineers"),
        ("Renewable Energy Grid Integration", "Intermittent renewable energy sources create grid instability, requiring better forecasting and demand response capabilities.", "Energy", "Grid Management", "Grid operators, utility companies", "Regions with high renewable penetration", "Weather forecasting, battery storage, curtailment", "Forecast errors, storage costs, response latency"),
        ("Food Safety in Transit", "Contamination events during food transportation affect millions annually, with current monitoring providing only origin-destination temperature logs.", "Healthcare", "Food Safety", "Consumers, food distributors, regulators", "Global food supply chains", "Temperature loggers at container level, HACCP protocols", "No in-transit monitoring, container-level only"),
        ("Construction Site Safety", "Construction sites have high injury rates with current safety relying on manual supervision and periodic audits.", "Construction", "Safety", "Construction workers and site managers", "Global", "Safety officers, morning briefings, PPE checks", "Human attention limitations, large sites, many workers"),
        ("Water Pipeline Leak Detection", "Municipal water systems lose 20-30% of treated water through pipe leaks, wasting resources and risking contamination.", "Infrastructure", "Water Management", "Municipal water utilities, residents", "Global, worse in aging infrastructure", "Pressure monitoring, acoustic leak detectors (periodic)", "Intermittent monitoring, false positives in urban noise"),
        ("Greenhouse Climate Control", "Greenhouse operators struggle with precise microclimate control, leading to suboptimal yields and energy waste.", "Agriculture", "Greenhouse", "Commercial greenhouse operators", "Temperate regions globally", "Manual HVAC control, basic thermostats", "Coarse control, no zone-level management"),
        ("Hospital Equipment Utilization", "Hospitals have 20-40% equipment underutilization while staff spends hours locating assets, adding to healthcare costs.", "Healthcare", "Hospital Operations", "Hospital administrators, clinical staff", "Global healthcare systems", "Manual inventory, scheduled assignments", "No real-time tracking, complex multi-floor layouts"),
        ("Power Line Vegetation Management", "Vegetation contact with power lines causes 20% of power outages and is a major wildfire ignition source.", "Energy", "Grid Maintenance", "Utility companies, affected communities", "Regions with overhead power lines", "Helicopter inspections, ground patrols, LiDAR surveys", "Infrequent inspection cycles, high cost per mile"),
        ("Offshore Wind Turbine Monitoring", "Offshore wind turbines face harsh marine conditions and maintenance requires expensive vessel mobilization.", "Energy", "Wind Energy", "Offshore wind farm operators", "North Sea, US East Coast, East Asia", "Scheduled maintenance, SCADA monitoring", "Remote location, harsh conditions, high mobilization costs"),
        ("Smart Parking Management", "Urban drivers spend 30% of driving time searching for parking, causing congestion and emissions.", "Transportation", "Urban Planning", "Urban drivers, city planners", "Dense urban areas globally", "Parking meters, garages, apps with limited real-time data", "Sensor costs, installation complexity, data accuracy"),
        ("Industrial Wastewater Monitoring", "Factories struggle to continuously monitor wastewater quality, risking regulatory violations and environmental damage.", "Environment", "Water Quality", "Industrial operators, environmental regulators", "Global industrial zones", "Periodic lab sampling (weekly/monthly)", "Infrequent, misses spike events, lab delay"),
        ("Retail Inventory Accuracy", "Retail stores have 60-70% inventory accuracy, causing stockouts and overstock, costing billions annually.", "Retail", "Inventory", "Retailers, shoppers affected by stockouts", "Global retail sector", "Periodic manual counts, barcode scanning", "Labor-intensive, infrequent, human error"),
    ]

    problem_objs = []
    for title, statement, domain, subdomain, affected, geo, existing, limits in problems_data:
        p = Problem(
            title=title, problem_statement=statement, domain=domain,
            subdomain=subdomain, affected_users=affected, geography=geo,
            existing_solutions=existing, limitations=limits,
            status="active", is_demo=True, created_by=admin.id
        )
        db.add(p)
        problem_objs.append(p)
    db.commit()
    for p in problem_objs:
        db.refresh(p)

    # ── Evidence records ──
    evidence_data = [
        (source_objs[0].id, "LPWAN networks achieve reliable data transmission up to 15km in open environments with power consumption under 50mW", "Field measurements showed LoRaWAN connectivity maintained at distances up to 15km with line-of-sight, consuming 25-48mW depending on spreading factor.", 0.92, "verified"),
        (source_objs[0].id, "Vibration sensing can detect abnormal machine behavior with 87% accuracy", "Accelerometer-based vibration analysis correctly identified 87% of bearing failures in a 6-month manufacturing trial across 200 machines.", 0.88, "verified"),
        (source_objs[4].id, "Predictive maintenance deployment costs range from $150-500 per monitoring point", "Average cost per monitoring point including sensor, installation, commissioning, and first-year connectivity was $150-500 depending on environment complexity.", 0.85, "verified"),
        (source_objs[4].id, "Battery life for industrial IoT sensors degrades 40% below -10°C", "Cold temperature testing showed lithium primary batteries experienced 35-45% capacity reduction at sustained temperatures below -10°C.", 0.90, "verified"),
        (source_objs[1].id, "Remote patient monitoring reduces emergency hospitalizations by 25-38%", "Meta-analysis of 12 RPM programs showed 25-38% reduction in emergency department visits and unplanned hospitalizations among monitored patients.", 0.82, "verified"),
        (source_objs[12].id, "Vibration spectral analysis can differentiate bearing, gear, and shaft faults", "Frequency-domain analysis of vibration signals distinguished bearing defects (BPFO/BPFI frequencies), gear mesh anomalies, and shaft misalignment with 91% classification accuracy.", 0.89, "verified"),
        (source_objs[15].id, "Structural health monitoring sensors can detect 2mm crack growth in steel structures", "Piezoelectric sensors with guided wave analysis detected crack propagation as small as 2mm in welded steel connections under laboratory conditions.", 0.78, "verified"),
        (source_objs[13].id, "Remote monitoring via cellular IoT achieves 94% data transmission reliability in rural areas", "Remote patient monitoring devices using NB-IoT achieved 94% data delivery rates in rural areas with coverage, compared to 99.5% in urban deployments.", 0.85, "verified"),
        (source_objs[5].id, "Soil moisture sensors reduce irrigation water usage by 20-40%", "Capacitive soil moisture sensor networks connected to automated irrigation controllers demonstrated 20-40% water savings across 15 farm deployments.", 0.87, "verified"),
        (source_objs[14].id, "Acoustic sensor networks can detect water pipe leaks within 3-meter accuracy", "Dense acoustic sensor arrays along water mains detected leaks with 3-meter positional accuracy and 85% true positive rate in urban environments.", 0.80, "verified"),
        (source_objs[2].id, "Google Glass enterprise edition achieved 25% productivity improvement in manufacturing assembly", "Documented case studies show Google Glass Enterprise Edition reduced assembly errors by 25% and training time by 50% in manufacturing settings.", 0.83, "verified"),
        (source_objs[7].id, "Kinect depth sensing technology enables markerless motion capture at 30fps with sub-centimeter accuracy", "Microsoft Kinect v2 achieves skeletal tracking at 30fps with joint position accuracy of 2-5cm, sufficient for rehabilitation monitoring.", 0.86, "verified"),
        (source_objs[9].id, "Microfluidic devices require minimum 100μL blood volume for reliable multi-analyte testing", "Physical constraints of microfluidic mixing, reagent volumes, and optical path lengths require minimum 100μL sample volume for panels exceeding 10 analytes.", 0.91, "verified"),
        (source_objs[10].id, "Self-balancing personal transporters face regulatory barriers in 72% of US cities", "Survey of 150 US cities found 72% lacked clear regulations for self-balancing electric scooters, with most defaulting to sidewalk or road bans.", 0.75, "verified"),
        (source_objs[11].id, "Silicon solar cell prices dropped 90% between 2010-2020, from $2/W to $0.20/W", "NREL cost tracking data shows crystalline silicon module prices declined from $2.00/W in 2010 to approximately $0.20/W by 2020.", 0.95, "verified"),
        (source_objs[18].id, "Low-power sensor nodes can operate for 2+ years on lithium primary batteries at 15-minute reporting intervals", "Field deployment data shows LoRaWAN sensor nodes with 15-minute reporting intervals achieving 2-3 year battery life using 3.6V lithium thionyl chloride cells at 20°C.", 0.84, "verified"),
        (source_objs[19].id, "Transfer learning reduces required training data by 60-80% for domain-adapted anomaly detection", "Anomaly detection models pre-trained on one industrial domain required only 20-40% of the training data to achieve equivalent accuracy when fine-tuned for a new domain.", 0.79, "verified"),
        (source_objs[16].id, "Edge computing reduces IoT data transmission costs by 60% through local preprocessing", "Edge gateway implementations filtering and aggregating sensor data locally reduced cloud data transmission volumes and associated costs by 55-65%.", 0.81, "verified"),
        (source_objs[20].id, "Wearable accelerometers detect falls with 95% sensitivity and 80% specificity", "Meta-analysis of wearable fall detection algorithms using triaxial accelerometers reported pooled sensitivity of 95% with 80% specificity across elderly populations.", 0.83, "verified"),
        (source_objs[21].id, "Low-cost sensor solutions ($10-50/unit) are viable for infrastructure monitoring in developing countries", "Pilot deployments using MEMS sensors and LoRaWAN in 5 developing countries demonstrated viable structural monitoring at $10-50 per monitoring point.", 0.76, "verified"),
    ]

    evidence_objs = []
    for source_id, claim, excerpt, confidence, status in evidence_data:
        e = Evidence(
            source_id=source_id, claim=claim, excerpt=excerpt,
            confidence=confidence, verification_status=status
        )
        db.add(e)
        evidence_objs.append(e)
    db.commit()
    for e in evidence_objs:
        db.refresh(e)

    # ── DNA Items for golden demo (Project AeroSense) ──
    aero = project_objs[0]
    dna_data = [
        ("technology", "Low-Power Wide-Area Network (LPWAN/LoRaWAN)", 0.92, "supported", [evidence_objs[0].id]),
        ("technology", "MEMS Accelerometers for vibration sensing", 0.88, "supported", [evidence_objs[1].id]),
        ("technology", "Edge computing for local data preprocessing", 0.81, "supported", [evidence_objs[17].id]),
        ("technology", "Cloud-based ML pipeline for model training", 0.75, "partially_supported", []),
        ("capability", "Real-time vibration monitoring at 1kHz+ sampling rate", 0.88, "supported", [evidence_objs[1].id]),
        ("capability", "Anomaly detection with 87% accuracy on bearing failures", 0.88, "supported", [evidence_objs[1].id]),
        ("capability", "Long-range wireless data transmission (15km)", 0.92, "supported", [evidence_objs[0].id]),
        ("capability", "Multi-sensor data fusion from vibration, temperature, acoustic", 0.72, "partially_supported", []),
        ("capability", "Predictive failure forecasting 48-72 hours ahead", 0.65, "partially_supported", []),
        ("input", "Vibration data streams (accelerometer XYZ axes)", 0.90, "supported", [evidence_objs[5].id]),
        ("input", "Temperature readings from equipment surfaces", 0.85, "supported", []),
        ("input", "Historical maintenance and failure records", 0.70, "partially_supported", []),
        ("output", "Predictive maintenance alerts with severity scoring", 0.85, "supported", []),
        ("output", "Equipment health dashboard and trend reports", 0.80, "supported", []),
        ("output", "Recommended maintenance actions and schedules", 0.65, "partially_supported", []),
        ("constraint", "High per-sensor deployment cost ($200+/unit)", 0.90, "supported", [evidence_objs[2].id]),
        ("constraint", "Battery life degrades 40% below -10°C", 0.90, "supported", [evidence_objs[3].id]),
        ("constraint", "Requires continuous network connectivity", 0.85, "supported", [evidence_objs[0].id]),
        ("constraint", "ML model accuracy depends on domain-specific training data", 0.80, "supported", [evidence_objs[16].id]),
        ("dependency", "Cloud computing infrastructure for ML training", 0.80, "supported", []),
        ("dependency", "Trained ML model with sufficient failure examples", 0.85, "supported", [evidence_objs[16].id]),
        ("dependency", "Network gateway infrastructure in facility", 0.82, "supported", []),
        ("assumption", "Sufficient historical failure data available for training", 0.70, "partially_supported", []),
        ("assumption", "Sensors can be retrofitted to existing equipment", 0.75, "partially_supported", []),
        ("assumption", "Facility has reliable power supply for gateways", 0.80, "supported", []),
        ("environment", "Industrial manufacturing facilities with rotating machinery", 0.90, "supported", []),
        ("environment", "Requires 24/7 power and network connectivity", 0.85, "supported", []),
        ("environment", "Temperature range: -10°C to 60°C (limited)", 0.85, "supported", [evidence_objs[3].id]),
        ("failure_condition", "Sensor drift causing false positives over time", 0.80, "supported", []),
        ("failure_condition", "Insufficient training data for rare failure modes", 0.82, "supported", [evidence_objs[16].id]),
        ("failure_condition", "High deployment cost exceeding ROI for small facilities", 0.92, "supported", [evidence_objs[2].id]),
        ("failure_condition", "Battery failure in cold environments", 0.88, "supported", [evidence_objs[3].id]),
        ("problem", "Unplanned equipment downtime in manufacturing costs millions annually", 0.90, "supported", []),
        ("objective", "Reduce unplanned downtime through predictive vibration monitoring", 0.88, "supported", []),
        ("outcome", "Partial success: 87% accuracy in lab but deployment costs prevented scaling", 0.85, "supported", [evidence_objs[1].id, evidence_objs[2].id]),
    ]

    for cat, val, conf, status, ev_ids in dna_data:
        db.add(DNAItem(
            project_id=aero.id, category=cat, value=val,
            confidence=conf, status=status, evidence_ids=ev_ids
        ))
    db.commit()

    # ── Gaps for golden demo ──
    gaps_data = [
        ("High per-sensor cost ($200+/unit) prevents economic viability for small/medium facilities with fewer than 100 monitoring points", "cost_barrier", 0.92, "strong", [evidence_objs[2].id], "Evidence shows deployment costs of $150-500/point. At 50 monitoring points, total cost exceeds $10,000 with uncertain ROI for facilities with <$500K annual maintenance spend."),
        ("Battery degradation in cold environments (<-10°C) limits deployment to temperature-controlled facilities only", "technical_constraint", 0.90, "strong", [evidence_objs[3].id], "Battery testing shows 40% capacity reduction below -10°C, limiting useful deployment to indoor or climate-controlled environments."),
        ("ML model requires domain-specific training data not available when entering new industries", "data_requirement", 0.85, "moderate", [evidence_objs[16].id], "Transfer learning can reduce data requirements by 60-80%, but initial domain-specific failure examples are still needed for reliable detection."),
        ("Network connectivity dependency limits deployment in metal-heavy factory floors and remote locations", "infrastructure_gap", 0.82, "strong", [evidence_objs[0].id], "While LPWAN achieves 15km in open environments, metal structures in factories significantly reduce range, requiring additional gateways."),
        ("Current system optimized for rotating machinery vibration patterns - may not generalize to other monitoring needs", "application_boundary", 0.75, "moderate", [evidence_objs[5].id], "Vibration analysis algorithms are specifically trained on rotating machinery signatures. Applicability to structural, environmental, or biological monitoring is unvalidated."),
        ("Sensor technology and anomaly detection capability may be transferable to structural health monitoring of bridges and buildings", "ai_hypothesis", 0.68, "hypothesis_only", [evidence_objs[6].id], "AI inference: Similar vibration sensing principles used in industrial monitoring could apply to structural health monitoring, where low-cost sensors and long-range connectivity address documented gaps."),
        ("Low-cost sensor deployment model could address agricultural monitoring needs in developing regions", "ai_hypothesis", 0.62, "hypothesis_only", [evidence_objs[8].id, evidence_objs[19].id], "AI inference: If sensor costs can be reduced through simplified packaging, the IoT architecture could serve agricultural monitoring where $10-50/unit solutions are viable."),
    ]

    gap_objs = []
    for desc, gtype, conf, ev_status, ev_ids, reasoning in gaps_data:
        g = Gap(
            project_id=aero.id, description=desc, gap_type=gtype,
            confidence=conf, evidence_status=ev_status,
            evidence_ids=ev_ids, reasoning=reasoning
        )
        db.add(g)
        gap_objs.append(g)
    db.commit()
    for g in gap_objs:
        db.refresh(g)

    # ── Opportunities (10+) ──
    opportunities_data = [
        {
            "project_id": aero.id,
            "problem_id": problem_objs[0].id,  # Rural Healthcare Monitoring
            "gap_id": gap_objs[5].id,
            "title": "LPWAN Sensor Network for Remote Patient Monitoring in Rural Healthcare",
            "rationale": "Project AeroSense's core capabilities — long-range wireless transmission (15km), low-power operation, and anomaly detection — could address the rural healthcare monitoring gap. The LPWAN architecture designed for industrial facilities could transmit patient vitals from remote health posts to district hospitals without requiring cellular infrastructure.",
            "technology_fit": 0.78, "environment_fit": 0.65, "data_fit": 0.55,
            "infrastructure_fit": 0.72, "cost_fit": 0.60, "evidence_strength": 0.75,
            "status": "evidence_review",
            "transferable_capabilities": ["Long-range wireless data transmission", "Low-power continuous operation", "Anomaly detection in sensor data", "Edge computing for local preprocessing"],
            "non_transferable_factors": ["Industrial vibration analysis algorithms", "Manufacturing-specific ML models", "High-frequency sampling requirements"],
            "uncertainties": ["Clinical accuracy of adapted algorithms", "Regulatory approval for medical monitoring", "Patient compliance with wearable sensors"],
            "validation_requirements": ["Clinical trial with wearable vitals sensors", "Network coverage mapping in target rural areas", "Comparison with existing RPM solutions"],
            "is_demo": True,
        },
        {
            "project_id": aero.id,
            "problem_id": problem_objs[3].id,  # Bridge Infrastructure
            "gap_id": gap_objs[5].id,
            "title": "Low-Cost Structural Health Monitoring for Aging Bridges",
            "rationale": "AeroSense's vibration sensing and anomaly detection capabilities could be adapted for structural health monitoring of bridges. The documented ability to detect abnormal vibration patterns at 87% accuracy, combined with long-range LPWAN connectivity, addresses the gap in continuous bridge monitoring between biennial inspections.",
            "technology_fit": 0.82, "environment_fit": 0.70, "data_fit": 0.60,
            "infrastructure_fit": 0.75, "cost_fit": 0.55, "evidence_strength": 0.80,
            "status": "identified",
            "transferable_capabilities": ["Vibration sensing and spectral analysis", "Long-range wireless transmission", "Anomaly detection algorithms", "Battery-powered operation"],
            "non_transferable_factors": ["Manufacturing equipment-specific failure modes", "Industrial environment assumptions", "Controlled temperature operating range"],
            "uncertainties": ["Accuracy of industrial vibration models on structural vibrations", "Outdoor weather exposure effects on sensors", "Long-term sensor reliability on bridges"],
            "validation_requirements": ["Controlled test on decommissioned bridge section", "Comparison with existing SHM systems", "Weather exposure durability testing"],
            "is_demo": True,
        },
        {
            "project_id": aero.id,
            "problem_id": problem_objs[2].id,  # Agricultural Water
            "gap_id": gap_objs[6].id,
            "title": "IoT-Based Precision Irrigation for Water-Scarce Agriculture",
            "rationale": "AeroSense's IoT architecture — LPWAN connectivity, battery-powered sensors, edge computing — could be simplified and adapted for agricultural soil moisture monitoring. Evidence shows soil moisture sensors reduce water usage by 20-40%, and low-cost solutions ($10-50/unit) are viable for developing regions.",
            "technology_fit": 0.65, "environment_fit": 0.58, "data_fit": 0.50,
            "infrastructure_fit": 0.68, "cost_fit": 0.45, "evidence_strength": 0.70,
            "status": "identified",
            "transferable_capabilities": ["LPWAN network architecture", "Battery-powered sensor operation", "Edge data preprocessing", "Cloud data aggregation"],
            "non_transferable_factors": ["Vibration sensing (replaced by soil moisture)", "Industrial ML models", "Manufacturing environment assumptions"],
            "uncertainties": ["Cost reduction feasibility to $10-50/unit", "Agricultural sensor durability in soil/water", "Farmer adoption and training requirements"],
            "validation_requirements": ["Prototype with soil moisture sensors on LPWAN", "Field trial in water-scarce farm", "Cost-benefit analysis vs manual irrigation"],
            "is_demo": True,
        },
        {
            "project_id": project_objs[6].id,  # Microsoft Kinect
            "problem_id": problem_objs[11].id,  # Elderly Fall Detection
            "title": "Depth Sensing Technology for Non-Wearable Elderly Fall Detection",
            "rationale": "Kinect's depth sensing and skeletal tracking technology, while failed in consumer gaming, demonstrated reliable markerless motion tracking. This capability directly addresses the elderly fall detection gap where current solutions require conscious button-pressing. A room-mounted depth sensor could detect falls without requiring the elderly person to wear any device.",
            "technology_fit": 0.85, "environment_fit": 0.72, "data_fit": 0.70,
            "infrastructure_fit": 0.80, "cost_fit": 0.75, "evidence_strength": 0.78,
            "status": "identified",
            "transferable_capabilities": ["Markerless skeletal tracking", "Real-time motion analysis", "Depth sensing (no camera privacy issues)", "30fps tracking speed"],
            "non_transferable_factors": ["Gaming-specific gesture recognition", "Large play space requirement (can be reduced)", "Xbox integration requirements"],
            "uncertainties": ["Elderly acceptance of room-mounted sensors", "Accuracy in cluttered home environments", "Multi-room coverage requirements"],
            "validation_requirements": ["Simulated fall detection accuracy study", "Elderly user acceptance study", "Comparison with wearable fall detectors"],
            "is_demo": True,
        },
        {
            "project_id": project_objs[1].id,  # Google Glass
            "problem_id": problem_objs[16].id,  # Construction Safety
            "title": "AR-Assisted Safety Monitoring for Construction Sites",
            "rationale": "Google Glass failed as a consumer product but demonstrated 25% productivity improvement in enterprise manufacturing. Construction sites, where workers need hands-free information access and safety compliance checking, represent a high-value enterprise application where the privacy concerns that killed consumer Glass are less relevant.",
            "technology_fit": 0.80, "environment_fit": 0.65, "data_fit": 0.55,
            "infrastructure_fit": 0.60, "cost_fit": 0.50, "evidence_strength": 0.72,
            "status": "identified",
            "transferable_capabilities": ["Hands-free information display", "Real-time visual overlay", "Voice-controlled interface", "Camera-based hazard detection"],
            "non_transferable_factors": ["Consumer aesthetic requirements", "All-day battery life expectation", "Social acceptance for public use"],
            "uncertainties": ["Durability in harsh construction environments", "Worker adoption willingness", "Integration with existing safety systems"],
            "validation_requirements": ["Construction site pilot with safety checklist overlay", "Worker satisfaction and adoption study", "Safety incident rate comparison"],
            "is_demo": True,
        },
        {
            "project_id": project_objs[2].id,  # Segway
            "problem_id": problem_objs[19].id,  # Hospital Equipment
            "title": "Self-Balancing Transport Platform for Hospital Asset Movement",
            "rationale": "Segway's self-balancing technology failed in outdoor urban transport but the stabilization capability addresses hospital equipment movement needs. Hospitals waste hours locating and transporting equipment across floors. A compact self-balancing platform could navigate hospital corridors and elevators.",
            "technology_fit": 0.60, "environment_fit": 0.75, "data_fit": 0.40,
            "infrastructure_fit": 0.70, "cost_fit": 0.55, "evidence_strength": 0.50,
            "status": "identified",
            "transferable_capabilities": ["Self-balancing locomotion", "Electric drive system", "Compact footprint navigation"],
            "non_transferable_factors": ["Outdoor weather resistance", "High speed capability", "Rider-based operation"],
            "uncertainties": ["Hospital floor surface compatibility", "Elevator clearance requirements", "Infection control compliance"],
            "validation_requirements": ["Hospital corridor navigation test", "Load capacity verification for medical equipment", "Staff training time assessment"],
            "is_demo": True,
        },
        {
            "project_id": aero.id,
            "problem_id": problem_objs[5].id,  # Cold Chain
            "title": "LPWAN Cold Chain Monitoring for Vaccine Distribution",
            "rationale": "AeroSense's IoT architecture with temperature sensing and long-range wireless could provide real-time cold chain monitoring during vaccine transport, addressing the 25% wastage rate in developing countries currently using passive monitoring.",
            "technology_fit": 0.80, "environment_fit": 0.70, "data_fit": 0.75,
            "infrastructure_fit": 0.65, "cost_fit": 0.58, "evidence_strength": 0.72,
            "status": "identified",
            "transferable_capabilities": ["Temperature sensing", "LPWAN transmission", "Battery-powered operation", "Real-time alerting"],
            "non_transferable_factors": ["Vibration-specific algorithms", "Industrial mounting systems"],
            "uncertainties": ["Regulatory approval for pharmaceutical monitoring", "Cost per unit for developing country budgets"],
            "validation_requirements": ["Temperature accuracy verification per WHO standards", "Field trial in vaccine distribution chain"],
            "is_demo": True,
        },
        {
            "project_id": project_objs[9].id,  # Solyndra
            "problem_id": problem_objs[14].id,  # Renewable Grid
            "title": "Cylindrical Solar Panel Design for Urban Vertical Installations",
            "rationale": "Solyndra's cylindrical panels failed economically against flat panels for traditional rooftop use. However, their unique form factor allowing light capture from all angles without tracking could suit vertical/urban installations (building facades, sound barriers) where flat panels are impractical.",
            "technology_fit": 0.55, "environment_fit": 0.60, "data_fit": 0.40,
            "infrastructure_fit": 0.50, "cost_fit": 0.35, "evidence_strength": 0.55,
            "status": "identified",
            "transferable_capabilities": ["Omnidirectional light capture", "No tracking system required", "Cylindrical form factor for curved surfaces"],
            "non_transferable_factors": ["High manufacturing costs", "Lower peak efficiency than silicon"],
            "uncertainties": ["Manufacturing cost reduction potential", "Energy yield on vertical surfaces", "Building code compliance"],
            "validation_requirements": ["Vertical installation energy yield study", "Cost comparison with BIPV alternatives"],
            "is_demo": True,
        },
        {
            "project_id": aero.id,
            "problem_id": problem_objs[10].id,  # Mining Safety
            "title": "Adapted IoT Monitoring for Underground Mining Equipment Safety",
            "rationale": "AeroSense's vibration monitoring for manufacturing could transfer to mining equipment monitoring where conditions are harsher but the need for predictive maintenance is even more critical due to safety implications.",
            "technology_fit": 0.75, "environment_fit": 0.45, "data_fit": 0.65,
            "infrastructure_fit": 0.40, "cost_fit": 0.50, "evidence_strength": 0.60,
            "status": "identified",
            "transferable_capabilities": ["Vibration-based anomaly detection", "Battery-powered sensing", "Predictive failure alerts"],
            "non_transferable_factors": ["Surface-level wireless range", "Temperature assumptions", "Clean environment sensor design"],
            "uncertainties": ["Underground wireless propagation", "Dust/humidity sensor protection", "Explosion-proof certification"],
            "validation_requirements": ["Underground wireless connectivity test", "Dust/humidity hardening study", "Mining safety certification requirements"],
            "is_demo": True,
        },
        {
            "project_id": project_objs[11].id,  # WebOS
            "problem_id": problem_objs[8].id,  # Remote Student Engagement
            "title": "Card-Based Interface Paradigm for Educational Content Navigation",
            "rationale": "WebOS pioneered the card-based multitasking interface that was later adopted by iOS and Android. This intuitive spatial metaphor could enhance educational content navigation, allowing students to visually manage multiple learning resources simultaneously.",
            "technology_fit": 0.50, "environment_fit": 0.70, "data_fit": 0.45,
            "infrastructure_fit": 0.80, "cost_fit": 0.85, "evidence_strength": 0.45,
            "status": "identified",
            "transferable_capabilities": ["Card-based spatial UI paradigm", "True multitasking interface", "Web technology stack"],
            "non_transferable_factors": ["Mobile hardware platform", "App ecosystem", "Carrier partnerships"],
            "uncertainties": ["Student preference validation", "Learning outcome improvement", "Integration with existing LMS"],
            "validation_requirements": ["UI/UX study with students", "A/B test against traditional LMS interface"],
            "is_demo": True,
        },
    ]

    opp_objs = []
    for od in opportunities_data:
        o = Opportunity(**od)
        db.add(o)
        opp_objs.append(o)
    db.commit()
    for o in opp_objs:
        db.refresh(o)

    # ── Opportunity Evidence Links ──
    opp_evidence_links = [
        (opp_objs[0].id, evidence_objs[0].id, "supports"),  # LPWAN range for healthcare
        (opp_objs[0].id, evidence_objs[4].id, "supports"),  # RPM reduces hospitalizations
        (opp_objs[0].id, evidence_objs[7].id, "supports"),  # Cellular IoT in rural areas
        (opp_objs[0].id, evidence_objs[15].id, "supports"),  # Battery life for remote
        (opp_objs[1].id, evidence_objs[1].id, "supports"),  # Vibration accuracy
        (opp_objs[1].id, evidence_objs[6].id, "supports"),  # SHM crack detection
        (opp_objs[1].id, evidence_objs[0].id, "supports"),  # LPWAN range
        (opp_objs[2].id, evidence_objs[8].id, "supports"),  # Soil moisture savings
        (opp_objs[2].id, evidence_objs[19].id, "supports"),  # Low-cost sensors viable
        (opp_objs[3].id, evidence_objs[11].id, "supports"),  # Kinect tracking accuracy
        (opp_objs[3].id, evidence_objs[18].id, "supports"),  # Fall detection accuracy
        (opp_objs[4].id, evidence_objs[10].id, "supports"),  # Glass enterprise success
    ]

    for opp_id, ev_id, rel_type in opp_evidence_links:
        db.add(OpportunityEvidence(
            opportunity_id=opp_id, evidence_id=ev_id,
            relationship_type=rel_type
        ))
    db.commit()

    # ── Experiments (5+) ──
    experiments_data = [
        {
            "opportunity_id": opp_objs[0].id,
            "hypothesis": "LPWAN-connected wearable sensors can reliably transmit patient vital signs (heart rate, SpO2, temperature) from a simulated rural health post to a monitoring station 10km away with >90% data delivery rate.",
            "objective": "Validate the technical feasibility of repurposing AeroSense's LPWAN IoT architecture for remote patient vital sign monitoring.",
            "materials": "3x LoRaWAN-compatible health sensor prototypes, 1x LoRaWAN gateway, pulse oximeter modules, temperature sensors, custom PCBs, waterproof enclosures",
            "data_required": "48-hour continuous vital sign recordings from 10 volunteer participants at varying distances (1km, 5km, 10km) from gateway",
            "procedure": "1. Configure LoRaWAN gateway at simulated district hospital\n2. Deploy 3 sensor nodes at 1km, 5km, and 10km distances\n3. Attach pulse oximeter and temperature modules to volunteers\n4. Record vital signs at 1-minute intervals for 48 hours\n5. Compare LoRaWAN-transmitted data against bedside monitor reference\n6. Document signal strength, data loss, and latency at each distance",
            "variables": "Independent: Distance from gateway (1/5/10km). Dependent: Data delivery rate, latency, accuracy. Controlled: Sensor hardware, transmission interval, environment.",
            "metrics": "Data delivery rate (%), average latency (seconds), vital sign accuracy vs reference (MAE), battery consumption (mAh)",
            "success_criteria": ">90% data delivery rate at all distances. Heart rate accuracy within ±3 BPM. SpO2 accuracy within ±2%. Latency <30 seconds. Battery life >7 days.",
            "failure_criteria": "<80% data delivery at 10km. Heart rate error >10 BPM. Battery life <3 days. Gateway failure during test.",
            "risks": "RF interference in test environment may not represent rural conditions. Volunteer compliance for 48-hour wear period. Weather affecting outdoor antenna performance.",
            "expected_cost": "$2,000-5,000 for prototype hardware and testing",
            "expected_duration": "4-6 weeks (2 weeks build, 1 week setup, 1-2 weeks testing, 1 week analysis)",
            "status": "planned", "is_demo": True,
        },
        {
            "opportunity_id": opp_objs[1].id,
            "hypothesis": "MEMS accelerometers mounted on bridge structural members can detect simulated damage (bolt loosening, crack initiation) with >80% accuracy using adapted industrial vibration analysis algorithms.",
            "objective": "Validate whether AeroSense's vibration analysis algorithms can be transferred from industrial rotating machinery to structural health monitoring.",
            "materials": "6x MEMS accelerometers, 2x LoRaWAN gateways, steel beam test structure, vibration exciter, known-damage test specimens",
            "data_required": "Vibration response data from healthy and damaged structural members under controlled loading conditions",
            "procedure": "1. Instrument steel beam test structure with 6 accelerometers\n2. Record baseline vibration signatures under controlled loading\n3. Introduce calibrated damage (bolt loosening, simulated crack)\n4. Record vibration signatures after each damage state\n5. Apply adapted anomaly detection algorithms\n6. Compare detection accuracy against visual inspection ground truth",
            "variables": "Independent: Damage type and severity. Dependent: Detection accuracy, false positive rate. Controlled: Loading conditions, sensor placement, sampling rate.",
            "metrics": "Damage detection accuracy (%), false positive rate (%), minimum detectable damage level, time to detection",
            "success_criteria": ">80% detection accuracy for bolt loosening. >70% for crack simulation. False positive rate <15%.",
            "failure_criteria": "<60% detection accuracy. False positive rate >30%. Algorithms unable to converge on structural vibration patterns.",
            "risks": "Structural vibrations have different frequency characteristics than rotating machinery. Environmental noise may mask damage signatures. Limited damage types may not represent real conditions.",
            "expected_cost": "$3,000-8,000 for test structure and instrumentation",
            "expected_duration": "6-8 weeks",
            "status": "planned", "is_demo": True,
        },
        {
            "opportunity_id": opp_objs[2].id,
            "hypothesis": "A simplified LoRaWAN-connected soil moisture sensor node can be built for <$30/unit and achieve irrigation water savings of >20% in a controlled field trial.",
            "objective": "Validate the cost-effectiveness and water savings potential of an AeroSense-derived soil moisture monitoring system for smallholder agriculture.",
            "materials": "10x capacitive soil moisture sensors, 10x LoRaWAN transmitter boards, 1x gateway, waterproof enclosures, solar panels for power, solenoid valves for automated irrigation",
            "data_required": "30-day soil moisture readings at 15-minute intervals across 10 monitoring points in a test field, water usage comparison with control field",
            "procedure": "1. Build simplified sensor nodes with capacitive soil moisture probes\n2. Deploy 10 nodes across test field plot (0.5 hectare)\n3. Configure automated irrigation thresholds\n4. Run parallel with manually-irrigated control plot\n5. Compare water usage, soil moisture levels, and crop health\n6. Document per-unit cost including all components",
            "variables": "Independent: Irrigation method (sensor-automated vs manual). Dependent: Water usage, soil moisture consistency, crop yield. Controlled: Crop type, field conditions, weather.",
            "metrics": "Per-unit sensor cost ($), water savings (%), soil moisture variance, crop yield comparison, system uptime (%)",
            "success_criteria": "Per-unit cost <$30. Water savings >20%. System uptime >95%. No crop yield reduction vs control.",
            "failure_criteria": "Per-unit cost >$50. Water savings <10%. System reliability <80%. Crop damage from under-irrigation.",
            "risks": "Sensor corrosion in soil. Solar panel insufficiency in cloudy periods. Automated irrigation malfunction risking crop damage.",
            "expected_cost": "$1,500-3,000 for components and field setup",
            "expected_duration": "8-12 weeks (including one crop cycle)",
            "status": "planned", "is_demo": True,
        },
        {
            "opportunity_id": opp_objs[3].id,
            "hypothesis": "A room-mounted depth sensor using Kinect-derived technology can detect simulated falls with >90% sensitivity and <15% false positive rate in a home-like environment.",
            "objective": "Validate the feasibility of non-wearable fall detection using depth sensing technology originally developed for gaming.",
            "materials": "2x depth cameras (Azure Kinect or equivalent), PC for processing, simulated home environment with furniture, crash mat for fall simulation",
            "data_required": "200+ simulated activities including 50 fall scenarios and 150 non-fall activities (sitting, bending, lying down) from 10 participants",
            "procedure": "1. Set up depth cameras in simulated apartment living room and bedroom\n2. Recruit 10 volunteers of varying age/size\n3. Record 50 simulated fall scenarios and 150 daily activities\n4. Apply adapted skeletal tracking and fall detection algorithms\n5. Calculate sensitivity, specificity, and false positive rates\n6. Compare with wearable accelerometer-based detection",
            "variables": "Independent: Activity type (fall vs non-fall). Dependent: Detection accuracy, false positive rate. Controlled: Room layout, camera position, lighting.",
            "metrics": "Sensitivity (%), specificity (%), false positive rate (%), detection latency (seconds)",
            "success_criteria": ">90% sensitivity. <15% false positive rate. Detection latency <5 seconds. Works in normal room lighting.",
            "failure_criteria": "<80% sensitivity. >25% false positive rate. Cannot distinguish falls from intentional lying down.",
            "risks": "Furniture occlusion limiting visibility. Privacy concerns about room cameras. Lighting variations affecting depth accuracy.",
            "expected_cost": "$1,000-2,500 for equipment and participant compensation",
            "expected_duration": "4-6 weeks",
            "status": "in_progress", "is_demo": True,
        },
        {
            "opportunity_id": opp_objs[0].id,
            "hypothesis": "Transfer learning from industrial anomaly detection to vital sign anomaly detection requires <100 labeled medical examples to achieve >85% anomaly detection accuracy.",
            "objective": "Test whether AeroSense's anomaly detection ML models can be adapted for medical vital sign monitoring with minimal retraining data.",
            "materials": "AeroSense anomaly detection model weights, publicly available ECG/vital sign datasets (MIT-BIH, MIMIC-III), GPU computing resources",
            "data_required": "Pre-trained AeroSense model, 10,000+ normal vital sign records, 100 annotated anomaly cases for fine-tuning",
            "procedure": "1. Export AeroSense anomaly detection model architecture and pre-trained weights\n2. Prepare vital sign dataset with labeled anomalies\n3. Fine-tune model with 25, 50, and 100 labeled examples\n4. Evaluate on held-out test set\n5. Compare with model trained from scratch on same data",
            "variables": "Independent: Number of fine-tuning examples (25/50/100). Dependent: Anomaly detection accuracy. Controlled: Model architecture, test set, evaluation metrics.",
            "metrics": "AUROC, sensitivity, specificity, F1-score at each training data level",
            "success_criteria": ">85% AUROC with 100 examples. >75% AUROC with 50 examples. Superior to from-scratch training.",
            "failure_criteria": "Transfer learning provides no benefit over random initialization. <70% AUROC even with 100 examples.",
            "risks": "Industrial and medical time series may be too dissimilar. Pre-trained features may not transfer. Overfitting on small medical dataset.",
            "expected_cost": "$200-500 for cloud GPU compute",
            "expected_duration": "2-3 weeks",
            "status": "completed", "is_demo": True,
        },
    ]

    exp_objs = []
    for ed in experiments_data:
        e = Experiment(**ed)
        db.add(e)
        exp_objs.append(e)
    db.commit()
    for e in exp_objs:
        db.refresh(e)

    # ── Experiment Results for completed experiment ──
    db.add(ExperimentResult(
        experiment_id=exp_objs[4].id,
        result_summary="Transfer learning from industrial anomaly detection to vital sign monitoring showed promising results. With 100 labeled medical examples, the fine-tuned model achieved 88% AUROC, outperforming from-scratch training (72% AUROC). With 50 examples, AUROC was 82%.",
        metrics_json={
            "auroc_100_examples": 0.88,
            "auroc_50_examples": 0.82,
            "auroc_25_examples": 0.71,
            "auroc_from_scratch_100": 0.72,
            "sensitivity_100": 0.85,
            "specificity_100": 0.90,
            "f1_100": 0.84
        },
        notes="DEMONSTRATION ANALYSIS - Results are simulated for demo purposes. Pre-trained features from vibration analysis transferred moderately well to vital sign time series, particularly for detecting sudden changes and periodic anomalies.",
        status="recorded"
    ))
    db.commit()

    # ── Analysis Runs ──
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    runs = [
        AnalysisRun(project_id=aero.id, run_type="dna_extraction", model="mock", prompt_version="v1.0", status="completed", started_at=now - timedelta(hours=2), completed_at=now - timedelta(hours=1, minutes=55)),
        AnalysisRun(project_id=aero.id, run_type="gap_analysis", model="mock", prompt_version="v1.0", status="completed", started_at=now - timedelta(hours=1, minutes=50), completed_at=now - timedelta(hours=1, minutes=45)),
        AnalysisRun(project_id=aero.id, run_type="opportunity_matching", model="mock", prompt_version="v1.0", status="completed", started_at=now - timedelta(hours=1, minutes=40), completed_at=now - timedelta(hours=1, minutes=30)),
    ]
    db.add_all(runs)

    # ── Completed Jobs ──
    jobs = [
        Job(job_type="analysis", entity_type="project", entity_id=aero.id, status="completed", progress=1.0, started_at=now - timedelta(hours=2), completed_at=now - timedelta(hours=1, minutes=30)),
        Job(job_type="dna_extraction", entity_type="project", entity_id=aero.id, status="completed", progress=1.0, started_at=now - timedelta(hours=2), completed_at=now - timedelta(hours=1, minutes=55)),
    ]
    db.add_all(jobs)
    db.commit()

    print(f"Seeded: {len(source_objs)} sources, {len(project_objs)} projects, {len(problem_objs)} problems, "
          f"{len(tech_data)} technologies, {len(evidence_objs)} evidence records, "
          f"{len(opp_objs)} opportunities, {len(exp_objs)} experiments")
