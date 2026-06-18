import math
from typing import List, Dict, Any

# Extensive repository of trending real-world placement vacancies
PRESETS_JOB_VACANCIES = [
    {
        "id": 1,
        "title": "FastAPI Backend Developer",
        "company": "Stripe",
        "location": "San Francisco, CA (Hybrid)",
        "salary": "$145,000 - $185,000",
        "required_skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git", "Linux"],
        "description": "Formulate highly scalable distributed payment APIs, manage database connections efficiently, and handle secure client payload schemas."
    },
    {
        "id": 2,
        "title": "Frontend React Architect",
        "company": "Vercel",
        "location": "Remote (Global)",
        "salary": "$150,000 - $190,000",
        "required_skills": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git", "Next.js"],
        "description": "Pioneer responsive user-centric interactive interfaces, optimize rendering pipelines, and spearhead state-dependent client caches."
    },
    {
        "id": 3,
        "title": "Full Stack Software Engineer",
        "company": "Linear",
        "location": "Remote (US/Europe)",
        "salary": "$130,000 - $170,000",
        "required_skills": ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "Git"],
        "description": "Take end-to-end ownership of highly interactive productivity features from custom UI states to optimized backend databases."
    },
    {
        "id": 4,
        "title": "Cloud DevOps Orchestrator",
        "company": "HashiCorp",
        "location": "Seattle, WA (Hybrid)",
        "salary": "$160,000 - $210,000",
        "required_skills": ["Kubernetes", "Docker", "AWS", "GCP", "Linux", "Git", "Go"],
        "description": "Manage hybrid cloud infrastructure layers, build automated pipeline deployments, and configure fault-tolerant system monitoring."
    },
    {
        "id": 5,
        "title": "Generative AI Systems Engineer",
        "company": "Hugging Face",
        "location": "Paris, FR (Remote)",
        "salary": "$155,000 - $205,000",
        "required_skills": ["Python", "PyTorch", "TensorFlow", "Docker", "GCP", "Git", "TypeScript"],
        "description": "Deploy state-of-the-art transformer systems to high-concurrency clusters and fine-tune modern LLMs for real-world utilities."
    },
    {
        "id": 6,
        "title": "Data Platform Specialist",
        "company": "Snowflake",
        "location": "San Mateo, CA",
        "salary": "$140,000 - $180,000",
        "required_skills": ["SQL", "Python", "Java", "PostgreSQL", "MySQL", "AWS", "Linux"],
        "description": "Construct high-bandwidth distributed ingest pipelines and fine-tune structured relational storage components for lightning analytics."
    }
]

# Actionable bridge steps map for missing technological keywords
BRIDGE_RECOMMENDATIONS_MAP = {
    "GCP": "Complete GCP Cloud Run or GKE core labs. Practice deploying containerized routes using IAM service accounts.",
    "AWS": "Build modular AWS VPC architectures. Practice deploying containerized services on ECS Fargate under elastic load balances.",
    "Docker": "Master multi-stage containerization. Reduce container footprint size and isolate environment variables using dotenv configs.",
    "Kubernetes": "Study microservice networking. Write custom manifests that define pod replicasets, ingress rules, and readiness probes.",
    "FastAPI": "Develop APIRouter schemas. Practice utilizing dependencies for token decoding, and implement unit-tests using TestClient.",
    "Next.js": "Implement Server Component paradigms. Study layouts nesting structure and use stale-while-revalidate route strategies.",
    "React": "Hone reactivity. Master clean custom hooks lifecycle boundaries and eliminate wasteful re-renders on expensive canvas updates.",
    "TypeScript": "Enforce strict compilation settings. Replace raw types with explicit generic parameter typing, enums, and utility interfaces.",
    "PyTorch": "Fine-tune pretrained Hugging Face models using PyTorch training loops. Implement optimization pipelines using Adam.",
    "TensorFlow": "Deploy convolutional networks using TensorFlow. Utilize TensorBoard monitoring charts to evaluate performance boundaries.",
    "PostgreSQL": "Master database tuning. Learn indexing rules, analyze EXPLAIN execution sequences, and implement composite primary keys.",
    "Go": "Explore concurrency. Construct pipelines leveraging Go channels and waitgroups to resolve network data streams in parallel.",
    "Rust": "Study ownership guidelines. Learn lifetime validations, cargo benchmarking utilities, and build high-performance WebAssembly routines.",
    "SQL": "Compose complex analytical queries using window functions (e.g. DENSE_RANK, PARTITION BY) and verify subquery efficiency."
}

class JobRecommenderService:
    @staticmethod
    def calculate_fit_analysis(candidate_skills: List[str], candidate_education: List[Dict[str, Any]], candidate_projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Processes candidate credentials against a comprehensive database of job roles.
        Implements an advanced profile-fit and technology-gap classification algorithm.
        """
        # Convert candidate's skills list to lowercase for token parity check
        cand_skills_set = {s.lower() for s in candidate_skills}
        
        calculated_recommendations = []
        
        for job in PRESETS_JOB_VACANCIES:
            required_skills_set = {s.lower() for s in job["required_skills"]}
            
            # Map matched & missing technology arrays
            matched_skills = []
            missing_skills = []
            
            for s in job["required_skills"]:
                if s.lower() in cand_skills_set:
                    matched_skills.append(s)
                else:
                    missing_skills.append(s)
            
            # 1. Compute foundational tech overlap percentage (60% weight)
            total_req = len(job["required_skills"])
            skills_ratio = len(matched_skills) / total_req if total_req > 0 else 1.0
            
            # 2. Compute project keywords overlap (30% weight)
            project_match_points = 0.0
            project_matched_keywords = set()
            for prog in candidate_projects or []:
                desc_lower = prog.get("description", "").lower()
                title_lower = prog.get("title", "").lower()
                # Check if required job skills are written inside descriptions
                for s in job["required_skills"]:
                    if s.lower() in desc_lower or s.lower() in title_lower:
                        project_matched_keywords.add(s)
            
            # Limit project match boost to maximum 30 points
            project_score = min(len(project_matched_keywords) * 8.0, 30.0)
            
            # 3. Academic credential check (10% weight)
            academic_score = 0.0
            for edu in candidate_education or []:
                deg_lower = edu.get("degree", "").lower()
                institution_lower = edu.get("institution", "").lower()
                # Match technology fields (CS, IT, Engineering)
                if any(x in deg_lower or x in institution_lower for x in ["computer", "cs", "software", "technology", "b.tech", "b.e."]):
                    academic_score = 10.0
                    break
            
            # Combine composite fit metrics
            baseline_match_score = (skills_ratio * 60.0) + project_score + academic_score
            final_match_percentage = round(min(max(baseline_match_score, 18.0), 100.0), 1)
            
            # Generate actionable bridging steps specifically custom-tailored to the gaps
            bridge_roadmaps = []
            for missed in missing_skills:
                tip = BRIDGE_RECOMMENDATIONS_MAP.get(missed)
                if tip:
                    bridge_roadmaps.append({
                        "skill": missed,
                        "action_step": tip
                    })
            
            # Fallback advice if perfect match
            if not bridge_roadmaps:
                bridge_roadmaps.append({
                    "skill": "All Merged",
                    "action_step": "You fulfill 100% of the tech requirements. Build tailored developer portfolios emphasizing high throughput capabilities."
                })
                
            calculated_recommendations.append({
                "job_id": job["id"],
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "salary": job["salary"],
                "required_skills": job["required_skills"],
                "description": job["description"],
                "match_percentage": final_match_percentage,
                "fit_index": "High" if final_match_percentage >= 80 else "Medium" if final_match_percentage >= 50 else "Low",
                "matched_skills": sorted(matched_skills),
                "missing_skills": sorted(missing_skills),
                "bridge_roadmaps": bridge_roadmaps
            })
            
        # Sort recommendations in descending order of compatibility percentages
        calculated_recommendations.sort(key=lambda j: j["match_percentage"], reverse=True)
        return calculated_recommendations
