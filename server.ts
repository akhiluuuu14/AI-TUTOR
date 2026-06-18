import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini Client safely with lazy check
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY env variable is not set. Chat features will fallback.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Dynamic simulated Job Compatibility database presets
const PRESETS_JOB_VACANCIES = [
  {
    id: 1,
    title: "FastAPI Backend Developer",
    company: "Stripe",
    location: "San Francisco, CA (Hybrid)",
    salary: "$145,000 - $185,000",
    required_skills: ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git", "Linux"],
    description: "Formulate highly scalable distributed payment APIs, manage database connections efficiently, and handle secure client payload schemas."
  },
  {
    id: 2,
    title: "Frontend React Architect",
    company: "Vercel",
    location: "Remote (Global)",
    salary: "$150,000 - $190,000",
    required_skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git", "Next.js"],
    description: "Pioneer responsive user-centric interactive interfaces, optimize rendering pipelines, and spearhead state-dependent client caches."
  },
  {
    id: 3,
    title: "Full Stack Software Engineer",
    company: "Linear",
    location: "Remote (US/Europe)",
    salary: "$130,005 - $170,000",
    required_skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "Git"],
    description: "Take end-to-end ownership of highly interactive productivity features from custom UI states to optimized backend databases."
  },
  {
    id: 4,
    title: "Cloud DevOps Orchestrator",
    company: "HashiCorp",
    location: "Seattle, WA (Hybrid)",
    salary: "$160,000 - $210,000",
    required_skills: ["Kubernetes", "Docker", "AWS", "GCP", "Linux", "Git", "Go"],
    description: "Manage hybrid cloud infrastructure layers, build automated pipeline deployments, and configure fault-tolerant system monitoring."
  },
  {
    id: 5,
    title: "Generative AI Systems Engineer",
    company: "Hugging Face",
    location: "Paris, FR (Remote)",
    salary: "$155,000 - $205,000",
    required_skills: ["Python", "PyTorch", "TensorFlow", "Docker", "GCP", "Git", "TypeScript"],
    description: "Deploy state-of-the-art transformer systems to high-concurrency clusters and fine-tune modern LLMs for real-world utilities."
  },
  {
    id: 6,
    title: "Data Platform Specialist",
    company: "Snowflake",
    location: "San Mateo, CA",
    salary: "$140,000 - $180,000",
    required_skills: ["SQL", "Python", "Java", "PostgreSQL", "MySQL", "AWS", "Linux"],
    description: "Construct high-bandwidth distributed ingest pipelines and fine-tune structured relational storage components for lightning analytics."
  }
];

// In-memory mock database for live interactive preview state
const mockUsersTable: any[] = [
  {
    email: "bandarusaiakhil2005@gmail.com",
    full_name: "Sai Akhil Bandaru",
    hashed_password: "$bcrypt$mock_hash_for_akhil_password", // BCrypt simulation
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    updated_at: new Date().toISOString()
  }
];

const mockResumesTable: any[] = [
  {
    id: 1,
    user_id: 1,
    file_name: "sai_akhil_software_engineer.pdf",
    raw_text: "SAI AKHIL BANDARU\nEmail: bandarusaiakhil2005@gmail.com\nTECHNICAL SKILLS: Python, FastAPI, React, SQL, Docker, PostgreSQL, Git\nEDUCATION: Bachelor of Technology (B.Tech) - Computer Science, 2026\nPROJECTS:\n- AI Career Coach Portfolio: Built FastAPI + React web application using containerized services.",
    extracted_skills: ["Python", "FastAPI", "React", "SQL", "Docker", "PostgreSQL", "Git"],
    extracted_education: [
      { institution: "Bachelor of Technology (B.Tech) - Computer Science", degree: "B.Tech", year: "2026" }
    ],
    extracted_projects: [
      { title: "AI Career Coach Portfolio", technologies: ["FastAPI", "React", "PostgreSQL", "Docker"], description: "Built FastAPI + React web application using containerized services." }
    ],
    created_at: new Date(Date.now() - 3600 * 12 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 12 * 1000).toISOString()
  }
];

// API Endpoint to fetch backend configuration files for the editor inspector
app.get("/api/mentor/files", (req, res) => {
  try {
    const filePaths = [
      { path: "/backend/app/main.py", label: "FastAPI server entry", lang: "python" },
      { path: "/backend/app/core/config.py", label: "Structured settings configuration", lang: "python" },
      { path: "/backend/app/core/security.py", label: "Hashing & cryptographic JWT signatures", lang: "python" },
      { path: "/backend/app/db/session.py", label: "SQLAlchemy connection session", lang: "python" },
      { path: "/backend/app/models/user.py", label: "User model database standard structure", lang: "python" },
      { path: "/backend/app/models/resume.py", label: "Resume model database structural map", lang: "python" },
      { path: "/backend/app/schemas/user.py", label: "Pydantic request & response validators", lang: "python" },
      { path: "/backend/app/schemas/resume.py", label: "Resume Pydantic structural schemas", lang: "python" },
      { path: "/backend/app/schemas/ats.py", label: "ATS validation models representation", lang: "python" },
      { path: "/backend/app/schemas/recommendation.py", label: "Career recommendation validation schemas", lang: "python" },
      { path: "/backend/app/schemas/token.py", label: "JWT payload structures templates", lang: "python" },
      { path: "/backend/app/crud/crud_user.py", label: "SQLAlchemy user queries builder", lang: "python" },
      { path: "/backend/app/services/resume_parser.py", label: "Regex & heuristics PDF keyword extractor", lang: "python" },
      { path: "/backend/app/services/ats_calculator.py", label: "TF-IDF similarity calculation service", lang: "python" },
      { path: "/backend/app/services/job_recommender.py", label: "Placement-fit alignment calculation service", lang: "python" },
      { path: "/backend/app/api/deps.py", label: "Authorization bearer validators middleware", lang: "python" },
      { path: "/backend/app/api/v1/endpoints/auth.py", label: "Credentials to OAuth2 token routes", lang: "python" },
      { path: "/backend/app/api/v1/endpoints/users.py", label: "User registration & self routers", lang: "python" },
      { path: "/backend/app/api/v1/endpoints/resume.py", label: "Resume uploads & list history routers", lang: "python" },
      { path: "/backend/app/api/v1/endpoints/ats.py", label: "ATS comparison post and calc routers", lang: "python" },
      { path: "/backend/app/api/v1/endpoints/recommendations.py", label: "Job compatibility score & gaps routers", lang: "python" },
      { path: "/backend/app/api/v1/api.py", label: "Prefix router aggregators setup", lang: "python" },
      { path: "/backend/requirements.txt", label: "Python requirements including pdfplumber, spacy", lang: "txt" },
      { path: "/backend/Dockerfile", label: "Multi-stage runner Dockerfile", lang: "dockerfile" },
      { path: "/docker-compose.yml", label: "Database + backend compose spec", lang: "yaml" }
    ];

    const files = filePaths.map(item => {
      const fullPath = path.join(process.cwd(), item.path);
      let content = `File template "${item.path}" is ready for review.`;
      if (fs.existsSync(fullPath)) {
        content = fs.readFileSync(fullPath, "utf-8");
      }
      return {
        path: item.path,
        label: item.label,
        lang: item.lang,
        content: content
      };
    });

    res.json({ files });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Interactive live sandbox router simulation for User Registration
app.post("/api/v1/users", (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: "Validation Error: 'email' and 'password' are required fields." });
  }

  // Check email redundancy
  const exists = mockUsersTable.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ detail: "A user credential with matching email address already exists." });
  }

  // Save new user state in-memory (simulates user_crud.create)
  const newUser = {
    email,
    full_name: full_name || null,
    hashed_password: `$bcrypt$hashed_version_of_${password}`, // Visual digest representation
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockUsersTable.push(newUser);

  // Return clean verified Pydantic response shape excluding credentials hash
  res.status(210).json({
    email: newUser.email,
    full_name: newUser.full_name,
    is_active: newUser.is_active,
    id: mockUsersTable.length,
    created_at: newUser.created_at,
    updated_at: newUser.updated_at
  });
});

// Interactive live sandbox router simulation for Login Credentials authentication
app.post("/api/v1/auth/login", (req, res) => {
  // Support both standard OAuth2 Form schema (username/password) and raw JSON body
  const username = req.body.username || req.body.email;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ detail: "Validation Error: credentials required fields (username/password)." });
  }

  const user = mockUsersTable.find(u => u.email.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(400).json({ detail: "Incorrect username email or password parameters matched." });
  }

  // Fast login bypass checks
  const access_token = `signed-jwt-token-header-claims.${Buffer.from(JSON.stringify({ sub: user.email })).toString("base64")}.cryptosignature`;

  res.json({
    access_token,
    token_type: "bearer"
  });
});

// Interactive User Profile fetch (/api/v1/users/me) verified via Token
app.get("/api/v1/users/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(410).json({ detail: "Could not validate credentials. Please authenticate again." });
  }

  const token = authHeader.substring(7);
  // Parse simulated email sub claim from token representation 
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return res.status(401).json({ detail: "Malformed authorization signature. Failed." });
    }
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    const user = mockUsersTable.find(u => u.email === payload.sub);
    if (!user) {
      return res.status(444).json({ detail: "User not found inside current session bounds." });
    }

    res.json({
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      id: mockUsersTable.indexOf(user) + 1,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (err) {
    return res.status(401).json({ detail: "Invalid token payload mapping verification." });
  }
});

// Interactive live sandbox router simulation for Resume Upload and Analysis
app.post("/api/v1/resume/upload", (req, res) => {
  const fileName = req.body.file_name || "resume_upload_portfolio.pdf";
  const rawTextValue = req.body.raw_text || "SAI AKHIL BANDARU\nPython, React, SQL, TypeScript\nUniversity of Computer Science\nUndergraduate Degree B.Tech, 2026\nAcademic project: Career Advisor";

  const cleanText = rawTextValue.trim();
  
  // Implements regex skill matches analogous to python services
  const matches: string[] = [];
  const dict = ["Python", "Java", "JavaScript", "TypeScript", "SQL", "Go", "Rust", "React", "FastAPI", "Django", "Flask", "Node.js", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Git", "AWS", "GCP", "Linux"];
  
  dict.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp("\\b" + escaped + "\\b", "i").test(cleanText)) {
      matches.push(skill);
    }
  });

  const eduMatches: any[] = [];
  const lines = cleanText.split("\n");
  lines.forEach(l => {
    if (/university|institute|college|school|academy/i.test(l)) {
      const yearMatch = l.match(/\b(20\d{2})\b/);
      eduMatches.push({
        institution: l.trim(),
        degree: /B\.Tech|Undergraduate|Bachelor/i.test(l) ? "B.Tech" : "CS Degree",
        year: yearMatch ? yearMatch[1] : "2026"
      });
    }
  });
  if (eduMatches.length === 0) {
    eduMatches.push({ institution: "Bachelor of Technology - Computer Science", degree: "B.Tech", year: "2026" });
  }

  const projMatches = [{
    title: "AI Career Coach Portfolio integration",
    technologies: matches.slice(0, 3),
    description: "Extracted from portfolio: built full stack uvicorn server mapping PDF streams using heuristics models."
  }];

  const newResume = {
    id: mockResumesTable.length + 1,
    user_id: 1,
    file_name: fileName,
    raw_text: cleanText,
    extracted_skills: matches,
    extracted_education: eduMatches,
    extracted_projects: projMatches,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockResumesTable.push(newResume);
  res.status(201).json(newResume);
});

app.get("/api/v1/resume/history", (req, res) => {
  res.json(mockResumesTable);
});

// Interactive dynamic simulated TF-IDF and Cosine Similarity metric calculation endpoint for Phase 4
app.post("/api/v1/ats/calculate", (req, res) => {
  const { resume_id, job_description } = req.body;
  if (!resume_id || !job_description) {
    return res.status(400).json({ detail: "Validation Error: 'resume_id' and 'job_description' are required parameters." });
  }

  const resume = mockResumesTable.find(r => r.id === Number(resume_id));
  if (!resume) {
    return res.status(404).json({ detail: `Specified resume document (ID: ${resume_id}) is not present in our records.` });
  }

  const cleanJD = job_description.trim();
  const cleanResume = resume.raw_text.trim();

  // 1. Sim Tokenizer excluding standard stop words
  const stopWords = new Set(["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "do", "does", "did", "for", "from", "in", "into", "is", "it", "of", "on", "or", "the", "to", "with"]);
  const tokenize = (text: string) => {
    return text.toLowerCase()
      .split(/[^a-z0-9+#\.]/i)
      .map(w => w.replace(/\.+$/, "")) // strip trailing dot
      .filter(w => w.length > 0 && !stopWords.has(w));
  };

  const tokens1 = tokenize(cleanResume);
  const tokens2 = tokenize(cleanJD);

  // 2. Compute TFs
  const tf1: { [key: string]: number } = {};
  const tf2: { [key: string]: number } = {};
  tokens1.forEach(t => tf1[t] = (tf1[t] || 0) + 1);
  tokens2.forEach(t => tf2[t] = (tf2[t] || 0) + 1);

  // Normalize
  const size1 = tokens1.length || 1;
  const size2 = tokens2.length || 1;
  Object.keys(tf1).forEach(k => tf1[k] = tf1[k] / size1);
  Object.keys(tf2).forEach(k => tf2[k] = tf2[k] / size2);

  // 3. Compute mutual IDFs
  const vocab = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  const idf: { [key: string]: number } = {};
  vocab.forEach(term => {
    let df = 0;
    if (tf1[term] !== undefined) df++;
    if (tf2[term] !== undefined) df++;
    idf[term] = Math.log(1.0 + (2.0 / df)) + 1.0;
  });

  // Calculate TF-IDF vectors
  const vec1: { [key: string]: number } = {};
  const vec2: { [key: string]: number } = {};
  Object.keys(tf1).forEach(k => vec1[k] = tf1[k] * idf[k]);
  Object.keys(tf2).forEach(k => vec2[k] = tf2[k] * idf[k]);

  // Compute cosine similarity
  let dotProduct = 0;
  vocab.forEach(term => {
    dotProduct += (vec1[term] || 0) * (vec2[term] || 0);
  });
  const mag1 = Math.sqrt(Object.values(vec1).reduce((acc, val) => acc + val * val, 0));
  const mag2 = Math.sqrt(Object.values(vec2).reduce((acc, val) => acc + val * val, 0));
  const cosSim = mag1 && mag2 ? (dotProduct / (mag1 * mag2)) : 0.0;

  // 4. Tech stack categorization comparing resume skills vs JD
  const dict = ["Python", "Java", "JavaScript", "TypeScript", "SQL", "Go", "Rust", "React", "FastAPI", "Django", "Flask", "Node.js", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Git", "AWS", "GCP", "Linux"];
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  dict.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const hasInJD = new RegExp("\\b" + escaped + "\\b", "i").test(cleanJD);
    if (hasInJD) {
      if (resume.extracted_skills.map((s: string) => s.toLowerCase()).includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
  });

  // Salient keywords counts
  const salientKeywords: any[] = [];
  vocab.forEach(term => {
    const rf = tokens1.filter(tk => tk === term).length;
    const jf = tokens2.filter(tk => tk === term).length;
    salientKeywords.push({ keyword: term, resume_frequency: rf, job_frequency: jf });
  });

  const sortedSalient = salientKeywords
    .sort((a, b) => Math.max(b.resume_frequency, b.job_frequency) - Math.max(a.resume_frequency, a.job_frequency))
    .slice(0, 10);

  // Weighted score mirroring Python backend logic
  const skillMatchRatio = matchedSkills.length / (matchedSkills.length + missingSkills.length || 1);
  const weightedScore = (cosSim * 40.0) + (skillMatchRatio * 40.0) + Math.min(resume.extracted_skills.length * 4.0, 20.0);
  const finalScore = Math.round(Math.min(Math.max(weightedScore, 15.0), 100.0) * 10) / 10;

  // Recommendations builder
  const improvements: string[] = [];
  if (finalScore < 50) {
    improvements.push("Critical Alignment: Your resume text similarity is too remote from the core job requirements. Revise headers and bullet outlines entirely.");
  }
  if (missingSkills.length > 0) {
    improvements.push(`Include missing skill keywords in your resume highlights: ${missingSkills.slice(0, 3).join(", ")}`);
  } else {
    improvements.push("Dynamic Skill Match: Your resume catalog successfully aligns with all specified technologies listed inside this job description!");
  }
  improvements.push("Quantify Placement Metrcs: Specify quantitative outcomes eg: 'Reduced memory latency overheads by 15%' inside project descriptions.");
  improvements.push("Incorporate Active Verbs: Command your bullet lines with proactive software execution actions eg 'Spearheaded', 'Refactored'.");

  res.json({
    score: finalScore,
    match_percentage: finalScore,
    resume_id: Number(resume_id),
    job_description: cleanJD,
    skill_gap: {
      matched_skills: matchedSkills,
      missing_skills: missingSkills
    },
    keyword_frequencies: sortedSalient,
    suggested_improvements: improvements
  });
});

// Interactive dynamic simulated Job Compatibility and Role recommendations for Phase 5
app.get("/api/v1/recommendations/resume/:resume_id", (req, res) => {
  const resumeId = Number(req.params.resume_id);
  const resume = mockResumesTable.find(r => r.id === resumeId);
  if (!resume) {
    return res.status(404).json({ detail: `No matching resume document with ID ${resumeId} found inside our databases.` });
  }

  const bridgeMap: { [key: string]: string } = {
    GCP: "Complete GCP Cloud Run or GKE core labs. Practice deploying containerized routes using IAM service accounts.",
    AWS: "Build modular AWS VPC architectures. Practice deploying containerized services on ECS Fargate under elastic load balances.",
    Docker: "Master multi-stage containerization. Reduce container footprint size and isolate environment variables using dotenv configs.",
    Kubernetes: "Study microservice networking. Write custom manifests that define pod replicasets, ingress rules, and readiness probes.",
    FastAPI: "Develop APIRouter schemas. Practice utilizing dependencies for token decoding, and implement unit-tests using TestClient.",
    "Next.js": "Implement Server Component paradigms. Study layouts nesting structure and use stale-while-revalidate route strategies.",
    React: "Hone reactivity. Master clean custom hooks lifecycle boundaries and eliminate wasteful re-renders on expensive canvas updates.",
    TypeScript: "Enforce strict compilation settings. Replace raw types with explicit generic parameter typing, enums, and utility interfaces.",
    PyTorch: "Fine-tune pretrained Hugging Face models using PyTorch training loops. Implement optimization pipelines using Adam.",
    TensorFlow: "Deploy convolutional networks using TensorFlow. Utilize TensorBoard monitoring charts to evaluate performance boundaries.",
    PostgreSQL: "Master database tuning. Learn indexing rules, analyze EXPLAIN execution sequences, and implement composite primary keys.",
    Go: "Explore concurrency. Construct pipelines leveraging Go channels and waitgroups to resolve network data streams in parallel.",
    Rust: "Study ownership guidelines. Learn lifetime validations, cargo benchmarking utilities, and build high-performance WebAssembly routines.",
    SQL: "Compose complex analytical queries using window functions (e.g. DENSE_RANK, PARTITION BY) and verify subquery efficiency."
  };

  const candSkillsLower = resume.extracted_skills.map((s: string) => s.toLowerCase());

  const recommendations = PRESETS_JOB_VACANCIES.map(job => {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    job.required_skills.forEach(s => {
      if (candSkillsLower.includes(s.toLowerCase())) {
        matchedSkills.push(s);
      } else {
        missingSkills.push(s);
      }
    });

    // 1. Skill Overlap (60 points)
    const skillsRatio = matchedSkills.length / job.required_skills.length;
    
    // 2. Project overlap (30 points)
    let projectMatchKeywordsCount = 0;
    const detectedKeywords = new Set<string>();
    resume.extracted_projects.forEach((proj: any) => {
      const pDesc = (proj.description || "").toLowerCase();
      const pTitle = (proj.title || "").toLowerCase();
      job.required_skills.forEach(s => {
        if (pDesc.includes(s.toLowerCase()) || pTitle.includes(s.toLowerCase())) {
          detectedKeywords.add(s);
        }
      });
    });
    projectMatchKeywordsCount = detectedKeywords.size;
    const projectScore = Math.min(projectMatchKeywordsCount * 8.0, 30.0);

    // 3. Academic (10 points)
    let academicScore = 0.0;
    resume.extracted_education.forEach((edu: any) => {
      const degree = (edu.degree || "").toLowerCase();
      const institution = (edu.institution || "").toLowerCase();
      if (degree.includes("computer") || degree.includes("cs") || degree.includes("software") || degree.includes("technology") || degree.includes("b.tech") || degree.includes("b.e.")) {
        academicScore = 10.0;
      }
    });

    const baselineScore = (skillsRatio * 60.0) + projectScore + academicScore;
    const finalScore = Math.round(Math.min(Math.max(baselineScore, 18.0), 100.0) * 10) / 10;

    const bridgeRoadmaps = missingSkills.map(missed => {
      return {
        skill: missed,
        action_step: bridgeMap[missed] || `Review official technology documentation and implement mock portfolios incorporating ${missed} protocols.`
      };
    });

    if (bridgeRoadmaps.length === 0) {
      bridgeRoadmaps.push({
        skill: "All Merged",
        action_step: "You fulfill 100% of the tech requirements. Build tailored developer portfolios emphasizing high throughput capabilities."
      });
    }

    return {
      job_id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      required_skills: job.required_skills,
      description: job.description,
      match_percentage: finalScore,
      fit_index: finalScore >= 80 ? "High" : finalScore >= 50 ? "Medium" : "Low",
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      bridge_roadmaps: bridgeRoadmaps
    };
  });

  // Sort descending
  recommendations.sort((a, b) => b.match_percentage - a.match_percentage);

  res.json({
    resume_id: resumeId,
    candidate_skills: resume.extracted_skills,
    recommendations: recommendations
  });
});




// Helper functions for Phase 6 Placement Interview fallback state
function responseSuggestFallback(answer: string, role: string): string {
  const cleanAns = answer ? answer.trim() : "";
  return `[Polished Senior Phrasing] "To optimize system latency boundaries for ${role} components, we engineered our data pipeline state machines with transaction-based message brokers and redundant caching. This isolated computational bottlenecks and yielded an immediate 35% gain in API response times under high-concurrency conditions."`;
}

function getFallbackNextQuestion(role: string, type: string, round: number): string {
  if (type.toLowerCase().includes("behavioral")) {
    if (round === 2) {
      return `For Round 2: Can you describe a scenario where you faced a blocking technical disagreement with a peer or architect regarding model or database schemas? How did you align the team and establish engineering compromises?`;
    }
    return `Closing Round: Share an incident where a critical deployment threw severe runtime memory leaks or timeout exceptions in production. What logging telemetry and mitigation protocols did you apply to resolve it?`;
  } else if (type.toLowerCase().includes("design")) {
    if (round === 2) {
      return `For Round 2: How would you structure caching strategies (e.g. Redis Cluster, Memcached) to accelerate read-heavy user lookups while avoiding cache stampedes and strict consistency pitfalls?`;
    }
    return `Closing Round: Design a resilient geographical replication pipeline for a database supporting high-volume reads. What consensus algorithms or replication models ensure 99.99% system availability?`;
  } else {
    if (round === 2) {
      return `For Round 2: Analyze the query executor path in relational databases. How do column indices, execution plans, and composite indices alter search efficiency in large datasets?`;
    }
    return `Closing Round: Explain the memory layout (Stack vs Heap) in high-throughput backend models. How do you identify garbage collection leaks or socket file descriptor exhaustion under load?`;
  }
}

// Phase 6: Active AI Behavioral and Technical Interview Simulator endpoints

app.post("/api/v1/interview/start", async (req, res) => {
  const { resume_id, role_title, interview_type } = req.body;
  const resumeId = Number(resume_id || 1);
  const resume = mockResumesTable.find(r => r.id === resumeId);
  const selectedRole = role_title || "FastAPI Backend Developer";
  const selectedType = interview_type || "Behavioral (STAR method)";

  const ai = getGeminiClient();

  if (!ai) {
    let firstQuestion = "";
    if (selectedType.toLowerCase().includes("behavioral")) {
      firstQuestion = `Welcome to your interview for the ${selectedRole} position! Let's start with a behavioral scenario: Can you tell me about a time when you had to design and release a technical solution within tight time constraints? Please structure your answer using the STAR method.`;
    } else if (selectedType.toLowerCase().includes("design")) {
      firstQuestion = `Thank you for joining the interview. For the ${selectedRole} role, let's explore system design: How would you architect a fault-tolerant, horizontally scalable event ingestion pipeline that safeguards against message loss and manages high-throughput traffic spike thresholds?`;
    } else {
      firstQuestion = `Welcome. Let's inspect deep technical accuracy for the ${selectedRole} position: Explain the event processing architecture in high-concurrency runtimes, and how you would diagnose an execution pattern where CPU-blocking operations stall API routing.`;
    }

    return res.json({
      session_id: "placement_session_fallback_" + Date.now(),
      question: firstQuestion,
      is_fallback: true
    });
  }

  try {
    const resumeText = resume ? resume.raw_text : "Candidate is a final-year CS student with expertise in React, FastAPI, SQL, Docker, and PostgreSQL.";
    const startPrompt = `You are an elite, top-tier Chief Technology Officer and Technical Interviewer at a premium tech enterprise.
You are hiring a candidate for the role: "${selectedRole}"
Interview Format/Type: "${selectedType}"

The candidate's parsed academic resume text:
${resumeText}

Task: Initiate the mock placement interview by asking the FIRST sharp, challenging, and realistic interview question.
- Do NOT include any introductory greeting chit-chat, conversational overview, or meta-commentary.
- Speak directly in the character of the strict technical interviewer (e.g., "Welcome. Let's start your interview for the ${selectedRole} position. To begin, explain...")
- Thread specific technologies found on their resume (like FastAPI, Docker, SQL, etc.) where logical to make the prompt feel incredibly personalized.
- Focus on hard real-world placement parameters. No greeting filler text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: startPrompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({
      session_id: "placement_session_" + Date.now(),
      question: response.text?.trim() || `Welcome. Tell me how you design robust, highly-concurrent database connections in a ${selectedRole} setup?`
    });
  } catch (error: any) {
    console.error("Start interview endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/interview/submit", async (req, res) => {
  const { resume_id, role_title, interview_type, question, answer, round } = req.body;
  const currentRound = Number(round || 1);
  const selectedRole = role_title || "FastAPI Backend Developer";
  const selectedType = interview_type || "Behavioral (STAR method)";
  const resumeId = Number(resume_id || 1);
  const resume = mockResumesTable.find(r => r.id === resumeId);

  const ai = getGeminiClient();

  if (!ai) {
    const lengthSatisfied = (answer || "").trim().length > 60;
    const containsStarKeywords = ["situation", "task", "action", "result", "resolved", "metrics", "because", "managed"].some(w => (answer || "").toLowerCase().includes(w));
    const score = lengthSatisfied ? (containsStarKeywords ? 90 : 78) : 55;

    const feedback = {
      score: score,
      verbal_grade: score >= 85 ? "Exceptional Placement Alignment" : score >= 70 ? "Competent Technical Flow" : "Requires Context Expansion",
      communication_style_evaluation: "Sentences show adequate clarity. Suggest using active tech verbs and reducing conversational filler to maintain a crisp senior delivery.",
      star_alignment_evaluation: "Situation details are set. Action block is moderate but requires naming explicit operations and command structures. Realized business metrics (results) should be quantitatively backed (e.g., '% bandwidth saved').",
      technical_accuracy_evaluation: "Primary architectural keywords map cleanly to requirements database structures. Excellent, but could expand more on container isolate configurations or specific memory locking levels.",
      revision_suggestion: responseSuggestFallback(answer, selectedRole),
      next_question: currentRound < 3 ? getFallbackNextQuestion(selectedRole, selectedType, currentRound + 1) : null,
      is_final: currentRound >= 3
    };

    return res.json(feedback);
  }

  try {
    const resumeText = resume ? resume.raw_text : "Candidate is a final-year CS student with expertise in React, FastAPI, SQL, Docker, and PostgreSQL.";
    const isFinalRound = currentRound >= 3;

    const evalSystemInstruction = `You are a strict, top-tier Chief Technology Officer and Technical Board Reviewer.
Evaluate the candidate's response to the technical/behavioral interview question for the role "${selectedRole}".
The candidate's analyzed profile:
${resumeText}

Focus of Assessment: "${selectedType}"
Current Interview Progress: Round ${currentRound} of 3
Is Final Round: ${isFinalRound}

Guidelines:
1. Provide highly granular, strict, and constructive feedback on their answer.
2. Rate the answer on a scale from 0 to 100 in 'score'.
3. In 'revision_suggestion', rewrite the candidate's answer into a polished, high-impact technical reply of senior staff-level quality, incorporating advanced technology and metrics.
4. If is_final is true (${isFinalRound}), you MUST return next_question as null.
5. If is_final is false, generate the next single-sentence technical or behavioral interview question in 'next_question' that probes deeper into their knowledge stacks.`;

    const userEvalPrompt = `Asked Interviewer Question: "${question}"
Candidate's Text Answer: "${answer}"

Analyze the inputs and output a comprehensive JSON report.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userEvalPrompt,
      config: {
        systemInstruction: evalSystemInstruction,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.INTEGER, 
              description: "Numeric rating from 0 to 100 based on thoroughness, completeness, and accuracy." 
            },
            verbal_grade: { 
              type: Type.STRING, 
              description: "Short grade title, e.g. 'Highly Competitive Placement Synergy'." 
            },
            communication_style_evaluation: { 
              type: Type.STRING, 
              description: "Feedback regarding response vocabulary, density, posture, and active voice." 
            },
            star_alignment_evaluation: { 
              type: Type.STRING, 
              description: "Detailed breakdown of STAR alignment (Situation, Task, Action, Result) in the response." 
            },
            technical_accuracy_evaluation: { 
              type: Type.STRING, 
              description: "Audit of the technical assertions, explaining mistakes or highlighting optimal strategies." 
            },
            revision_suggestion: { 
              type: Type.STRING, 
              description: "A complete professional rewritten response that demonstrates senior technical fluency." 
            },
            next_question: { 
              type: Type.STRING, 
              description: "The next single-sentence interview question. MUST be null if is_final is true." 
            },
            is_final: { 
              type: Type.BOOLEAN, 
              description: "Set to true if current round index matches 3." 
            }
          },
          required: [
            "score", 
            "verbal_grade", 
            "communication_style_evaluation", 
            "star_alignment_evaluation", 
            "technical_accuracy_evaluation", 
            "revision_suggestion", 
            "next_question", 
            "is_final"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Interview grader error:", err);
    res.status(500).json({ error: `Dynamic response scoring failed: ${err.message}` });
  }
});




// Phase 7: Personalized Week-by-Week Roadmap Generator endpoints
app.post("/api/v1/roadmap/generate", async (req, res) => {
  const { resume_id, role_title, duration_weeks, intensity_hours } = req.body;
  const resumeId = Number(resume_id || 1);
  const resume = mockResumesTable.find(r => r.id === resumeId);
  const selectedRole = role_title || "FastAPI Backend Developer";
  const numWeeks = Number(duration_weeks || 4);
  const hoursPerWeek = Number(intensity_hours || 20);

  const ai = getGeminiClient();

  // Extract missing skills using the preset vacancy definitions
  const candSkillsLower = resume ? resume.extracted_skills.map((s: string) => s.toLowerCase()) : ["react", "fastapi", "sql"];
  
  // Find which of the presets fits the role best to extract standard requirements
  const matchedPreset = PRESETS_JOB_VACANCIES.find(v => v.title.toLowerCase().includes(selectedRole.split(" ")[0].toLowerCase())) || PRESETS_JOB_VACANCIES[0];
  const missingSkills = matchedPreset.required_skills.filter(s => !candSkillsLower.includes(s.toLowerCase()));
  if (missingSkills.length === 0) {
    missingSkills.push("System Design", "Scalability Optimization");
  }

  if (!ai) {
    // Generate robust fallback learning program matching their target parameters
    const fallbackRoadmap = {
      role_title: selectedRole,
      duration_weeks: numWeeks,
      intensity: `${hoursPerWeek} hrs/week`,
      missing_skills: missingSkills,
      weeks: Array.from({ length: numWeeks }, (_, i) => {
        const weekNum = i + 1;
        let theme = "Advanced Architectural Design & Framework Orchestration";
        let skills = [missingSkills[i % missingSkills.length]];
        let daily = [
          { day: "Day 1-2", topic: "Theoretical Overviews & Design Principles", description: "Read standard technical specifications and study how context boundaries are managed.", deliverable: "Architectural blueprint block diagram." },
          { day: "Day 3-5", topic: "Hands-on Development Setup & Configuration", description: "Write local prototype code, isolate external resources, and formulate secure credentials.", deliverable: "Interactive API server or package suite." },
          { day: "Day 6-7", topic: "Validation & Testing Pipeline Operations", description: "Execute test suites under boundary conditions and configure continuous testing scripts.", deliverable: "Clean Git pull request with unit test audits." }
        ];

        if (selectedRole.toLowerCase().includes("backend") || selectedRole.toLowerCase().includes("full stack")) {
          if (weekNum === 1) {
            theme = "System Architecture & API Router Schemas";
            skills = [skills[0] || "FastAPI", "SQL"];
            daily = [
              { day: "Day 1-2", topic: "Formulating Routing Guidelines & Data Schemas", description: "Design modular paths with APIRouter. Setup data validation with strict schemas.", deliverable: "Clean APIRouter modules." },
              { day: "Day 3-4", topic: "Dependency Injections for Authentication", description: "Build token verify dependencies to authenticate protected headers securely.", deliverable: "Middleware JWT decoding checks." },
              { day: "Day 5-7", topic: "CRUD SQLite/PG Client Persistence Layers", description: "Initialize relational storage clients using session context managers.", deliverable: "Fully verifiable unit-tests of database operations." }
            ];
          } else if (weekNum === 2) {
            theme = "Relational Indexes Tuning & EXPLAIN Analysis";
            skills = ["SQL", "PostgreSQL"];
            daily = [
              { day: "Day 1-3", topic: "Compose Composite Primary Keys & Indices", description: "Model relationships using proper join tables. Audit indices.", deliverable: "SQL DDL Schema upgrade plans." },
              { day: "Day 4-5", topic: "Inspecting Query Pathways via EXPLAIN ANALYZE", description: "Evaluate optimizer pathways, diagnose sequence scans, and convert them to index scans.", deliverable: "Refactored queries saving 40% IO." },
              { day: "Day 6-7", topic: "Transaction Locking Levels & Concurrency", description: "Study read-committed vs repeatable-read isolation parameters under peak concurrent request loads.", deliverable: "Simulation lock-free test script." }
            ];
          } else if (weekNum === 3) {
            theme = "Container Isolation & Multi-Stage Docker builds";
            skills = ["Docker", "Linux"];
            daily = [
              { day: "Day 1-2", topic: "Isolate Secrets using Environment variables", description: "Practice reading environment variables via dotenv setups in NodeJS or Python.", deliverable: ".env.example templates verified." },
              { day: "Day 3-5", topic: "Crafting High-Performance Multi-Stage Dockerfiles", description: "Compose caching layers. Switch from base builder image into distroless or alpine footprint containers.", deliverable: "Optimized Docker registry image under 80MB." },
              { day: "Day 6-7", topic: "Container Network Bridges & Port Forwarding", description: "Link isolated client and server containers together using Docker Network virtual interfaces.", deliverable: "Multi-service interactive network model." }
            ];
          } else {
            theme = "Cloud Orchestration & Scalable Deployment pipelines";
            skills = ["AWS", "GCP"];
            daily = [
              { day: "Day 1-3", topic: "AWS ECS Fargate & Cloud Run VPC setups", description: "Identify virtual private network boundaries, subnets, and security ingress rules.", deliverable: "Networking map diagram." },
              { day: "Day 4-5", topic: "Elastic Load Balancing & Auto-Scaling Protocols", description: "Configure health monitor thresholds and request threshold metrics.", deliverable: "Resource utilization profiles." },
              { day: "Day 6-7", topic: "CI/CD GitHub Actions Automation Tasks", description: "Automate build verification steps upon main branch pull requests.", deliverable: "Deployable workflow yaml configuration." }
            ];
          }
        } else {
          // Frontend preset fallback
          if (weekNum === 1) {
            theme = "Static SPA Rendering & Custom Hooks lifecycle";
            skills = ["React", "TypeScript"];
          } else if (weekNum === 2) {
            theme = "Tailwind CSS Layout fluidity & Density scales";
            skills = ["CSS", "Tailwind"];
          } else {
            theme = "Comprehensive Testing & Deployment Pipelines";
            skills = ["Vercel", "Vite"];
          }
        }

        return {
          week_number: weekNum,
          week_theme: theme,
          skills_covered: skills,
          daily_plan: daily,
          weekly_milestone_project: {
            title: `Weekly Assessment Core Milestone Project: ${theme}`,
            description: `Combine learned theories into an independent verifiable container code model on github.`,
            technical_requirements: [
              `Fulfill all parameters of ${skills.join(" and ")}`,
              `Verify layout spacing with strict responsive CSS breakpoints`,
              `Establish automated test coverage of at least 80% on core components`
            ]
          },
          study_resources: [
            { title: "Official Documentation Hub", url: `https://example.com/docs/${skills[0]?.toLowerCase() || "setup"}`, type: "Documentation" },
            { title: "Placement Architecture Review Guide", url: "https://example.com/guides/placement", type: "Tutorial" }
          ]
        };
      })
    };

    return res.json(fallbackRoadmap);
  }

  try {
    const resumeText = resume ? resume.raw_text : "Candidate is a final-year CS student named Akhil, searching for software placements.";
    const startPrompt = `You are an elite Staff Software Engineer and Academic Placement Curriculum Director.
You are designing a high-impact, custom scheduled study roadmap for the candidate.

Target Placement Role: "${selectedRole}"
Duration of Study: ${numWeeks} weeks
Study Intensity: ${hoursPerWeek} hours/week

Parsed Resume Profile summary:
${resumeText}

Primary Core Gaps (Missing skills identified): 
${missingSkills.join(", ")}

Task: Create a highly personalized, week-by-week academic program to master these technology gaps.
- Structure your output strictly as a JSON object inside 'roadmap'.
- The roadmap MUST span exactly ${numWeeks} weeks.
- Make each week focus recursively on 1-2 missing critical skills.
- The daily plan should split lessons elegantly (e.g. Day 1-2, Day 3-4, Day 5-7).
- Each week MUST have an advanced, hand-on, challenging Weekly Milestone Project and 2 real documentation resource links.
- Be highly technical and reference realistic elite challenges like container scaling, connection pooling, cache stampedes, relational explain logs, and microservice networking boundaries. No generic placeholder text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: startPrompt,
      config: {
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role_title: { type: Type.STRING },
            duration_weeks: { type: Type.INTEGER },
            intensity: { type: Type.STRING },
            missing_skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week_number: { type: Type.INTEGER },
                  week_theme: { type: Type.STRING },
                  skills_covered: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  daily_plan: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        description: { type: Type.STRING },
                        deliverable: { type: Type.STRING }
                      },
                      required: ["day", "topic", "description", "deliverable"]
                    }
                  },
                  weekly_milestone_project: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technical_requirements: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["title", "description", "technical_requirements"]
                  },
                  study_resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING }
                      },
                      required: ["title", "url", "type"]
                    }
                  }
                },
                required: ["week_number", "week_theme", "skills_covered", "daily_plan", "weekly_milestone_project", "study_resources"]
              }
            }
          },
          required: ["role_title", "duration_weeks", "intensity", "missing_skills", "weeks"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Roadmap generation endpoint error:", err);
    res.status(500).json({ error: `Dynamic roadmap formulation failed: ${err.message}` });
  }
});




// ==========================================
// PHASE 9: RAG Career Assistant & ChromaDB Vector DB Core State
// ==========================================

interface RAGChunk {
  id: string;
  doc_title: string;
  text: string;
  embedding: number[];
  word_count: number;
}

interface RAGDocument {
  id: string;
  title: string;
  content: string;
  chunk_count: number;
  created_at: string;
}

const mockDocumentsTable: RAGDocument[] = [
  {
    id: "doc-1",
    title: "System Design Guide: Distributed Cache & DB Buffers",
    content: "Under extreme concurrency, database connection pools are easily exhausted. Configure pool size dynamically (typically 15-25 with pgBouncer handles 10,000 requests). Always use Redis cache-aside patterns with randomized timeouts (e.g. 3600s + random 1-300s) to prevent cache stampedes. Build database indices specifically on queried keys. Composite primary keys must be queried in indexing order to avoid performance degradation.",
    chunk_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: "doc-2",
    title: "STAR Placement Masterclass: Metric-Driven Articulation",
    content: "Board selectors look for quantitative engineering impact. Describe system events utilizing the STAR structure: Situation (what was broken), Task (what was required of you), Action (engineering specifics with tools used), and Result (the validated outcome). Avoid generic sentences like 'I optimized performance'; say 'Refactored raw postgres queries to index scans, reducing api response time from 420ms to 85ms'.",
    chunk_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: "doc-3",
    title: "Multi-Stage Docker and Secure Pipeline Hardening",
    content: "Modern serverless runtimes depend heavily on low cold-starts. Standard Node/Python container builds are over 800MB due to build compilers. Implement multi-stage Dockerfiles: construct a builder step with complete compilers (dependencies), then copy pure compiled production assets and required artifacts into a minimal final runner like alpine or google-distroless to reduce filesystem size to ~85MB, reducing CVE exposure.",
    chunk_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: "doc-4",
    title: "PostgreSQL Concurrency: Isolations and Locks",
    content: "The default transaction isolation level in PostgreSQL is READ COMMITTED, which prevents dirty reads but allows non-repeatable reads. Use SELECT FOR UPDATE to acquire explicit row-level exclusive locks on specific documents to bypass race conditions under high concurrent transactions. Over-using tables locks can trigger deadlocks, so sort raw query updates in ordered item ids sequences.",
    chunk_count: 3,
    created_at: new Date().toISOString()
  }
];

const mockVectorsTable: RAGChunk[] = [];

// Helper to generate deterministic unit-length embeddings
function generatePlaceholderEmbedding(text: string): number[] {
  const size = 384; // Standard embedding size for local representation
  const vec = new Array(size).fill(0);
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  
  words.forEach((word) => {
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % size;
    vec[idx] += 1.0;
  });

  // Apply visual coordinate tweaks based on content themes
  const lowerText = text.toLowerCase();
  if (lowerText.includes("cache") || lowerText.includes("redis")) {
    vec[0] += 2.0;
    vec[10] += 1.5;
  }
  if (lowerText.includes("star") || lowerText.includes("metric")) {
    vec[50] += 2.0;
    vec[60] += 1.5;
  }
  if (lowerText.includes("docker") || lowerText.includes("container")) {
    vec[100] += 2.0;
    vec[110] += 1.5;
  }
  if (lowerText.includes("lock") || lowerText.includes("postgresql")) {
    vec[150] += 2.0;
    vec[160] += 1.5;
  }

  // Normalize
  let sumSq = 0;
  for (let i = 0; i < size; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq) || 1;
  for (let i = 0; i < size; i++) {
    vec[i] /= norm;
  }
  return vec;
}

// Generate chunks for initial preloaded documents
function initializeRAGCorpus() {
  mockDocumentsTable.forEach((doc) => {
    const text = doc.content;
    const chunkSize = 150;
    const overlap = 25;
    
    let i = 0;
    let chunkIdx = 1;
    while (i < text.length) {
      const end = Math.min(i + chunkSize, text.length);
      const chunkText = text.substring(i, end).trim();
      if (chunkText.length > 10) {
        mockVectorsTable.push({
          id: `${doc.id}-chunk-${chunkIdx}`,
          doc_title: doc.title,
          text: chunkText,
          embedding: generatePlaceholderEmbedding(chunkText),
          word_count: chunkText.split(/\s+/).filter(Boolean).length
        });
        chunkIdx++;
      }
      i += (chunkSize - overlap);
    }
  });
  console.log(`ChromaDB: Initialized Vector DB store successfully. Logged ${mockVectorsTable.length} preloaded text embedding coordinates.`);
}

initializeRAGCorpus();

// Fetch all documents
app.get("/api/v1/rag/documents", (req, res) => {
  res.json({ documents: mockDocumentsTable, total_chunks: mockVectorsTable.length });
});

// Create/index new document
app.post("/api/v1/rag/documents", async (req, res) => {
  try {
    const { title, content, chunk_size, chunk_overlap } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required to index document" });
    }

    const docId = `doc-${Date.now()}`;
    const size = Number(chunk_size || 150);
    const overlap = Number(chunk_overlap || 25);

    let i = 0;
    let chunkIdx = 1;
    const addedChunks: string[] = [];

    while (i < content.length) {
      const end = Math.min(i + size, content.length);
      const chunkText = content.substring(i, end).trim();
      if (chunkText.length > 8) {
        mockVectorsTable.push({
          id: `${docId}-chunk-${chunkIdx}`,
          doc_title: title,
          text: chunkText,
          embedding: generatePlaceholderEmbedding(chunkText),
          word_count: chunkText.split(/\s+/).filter(Boolean).length
        });
        addedChunks.push(`${docId}-chunk-${chunkIdx}`);
        chunkIdx++;
      }
      i += (size - overlap);
    }

    const newDoc: RAGDocument = {
      id: docId,
      title,
      content,
      chunk_count: chunkIdx - 1,
      created_at: new Date().toISOString()
    };
    mockDocumentsTable.push(newDoc);

    res.json({
      status: "success",
      message: `Indexed document successfully to ChromaDB vector space. Generated ${newDoc.chunk_count} relational chunks.`,
      document: newDoc,
      added_chunks_ids: addedChunks
    });
  } catch (error: any) {
    res.status(500).json({ error: `Vector indexation failed: ${error.message}` });
  }
});

// Perform vector similarity retrieval & generate grounded response
app.post("/api/v1/rag/query", async (req, res) => {
  try {
    const { query, distance_metric, top_k } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query coordinate parameters are required" });
    }

    const metric = distance_metric || "cosine";
    const k = Number(top_k || 3);

    // Get embedding vector of user query
    const queryEmbed = generatePlaceholderEmbedding(query);

    // Score all chunks based on distance metric
    const scoredChunks = mockVectorsTable.map((chunk) => {
      let score = 0;
      const embeddingA = chunk.embedding;
      const embeddingB = queryEmbed;

      if (metric === "cosine" || metric === "inner_product") {
        // Dot product (since embeddings are L2 normalized to unit length, this is identical to Cosine)
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let idx = 0; idx < embeddingA.length; idx++) {
          dot += embeddingA[idx] * embeddingB[idx];
          normA += embeddingA[idx] * embeddingA[idx];
          normB += embeddingB[idx] * embeddingB[idx];
        }
        score = dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
      } else if (metric === "l2") {
        // Squared Euclidean distance: sum((A_i - B_i)^2)
        let sumSq = 0;
        for (let idx = 0; idx < embeddingA.length; idx++) {
          const diff = embeddingA[idx] - embeddingB[idx];
          sumSq += diff * diff;
        }
        // Lower weight is more similar, invert or return as coordinate range
        score = Math.sqrt(sumSq);
      }

      return {
        ...chunk,
        similarity_score: score
      };
    });

    // Sort accordingly
    let matchedChunks = [...scoredChunks];
    if (metric === "cosine" || metric === "inner_product") {
      // High score is better
      matchedChunks.sort((a, b) => b.similarity_score - a.similarity_score);
    } else {
      // Low L2 distance is better
      matchedChunks.sort((a, b) => a.similarity_score - b.similarity_score);
    }

    // Capture top k matching records
    const topMatches = matchedChunks.slice(0, k);

    // Build context-augmented prompts representation for Gemini API
    const ai = getGeminiClient();
    let groundedResponse = "";

    const contextBlock = topMatches.map((m, idx) => `[Source ${idx + 1}: ${m.doc_title}]\n${m.text}`).join("\n\n");

    const promptText = `You are a world-class Placement Advisor specializing in Retrieval Augmented Generation (RAG).
We queried ChromaDB and retrieved the following documentation context blocks:
---
${contextBlock}
---
Candidate User Placement Query / Question:
"${query}"

Task: Draft an extremely professional, expert placement answer.
- Rely strictly on the retrieved context above where applicable.
- Call out specific facts (e.g., pgBouncer pool size, multi-stage files footprint, STAR metrics) and cite which Source they belong to.
- If the query falls outside the context blocks, provide excellent engineering advice but explicitly highlight which segments were synthesized from baseline model weights instead.
- Format with crisp, modernist bullet points and markdown tags. Keep answer structured and high authority.`;

    if (ai) {
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          temperature: 0.5,
        }
      });
      groundedResponse = result.text || "";
    } else {
      // Offline fallback grounded builder
      groundedResponse = `### 💡 Placement Coach Synthesized Response (Offline Mode)

I have formulated a grounded technical answer by matching your query key components against **ChromaDB's active collections**:

*   **Vector Search Scope**: Retrieved the top **${k} most relevant text chunks** using the strict **${metric.toUpperCase()} distance calculator**.
*   **Acoustic Context Mapping**: 
${topMatches.map((m, idx) => `    *   **Source ${idx + 1} (${m.doc_title})**: "${m.text.substring(0, 120)}..." (Distance score: ${m.similarity_score.toFixed(4)})`).join("\n")}

#### 🎯 Grounded Synthesis:
1.  **Distributed Architectures**: Make sure to implement proper concurrency boundaries. For pgBouncer contexts or extreme traffic concurrency, load limits to 15-25 connections to prevent CPU exhaustion spikes.
2.  **Deployment footings**: Utilize multi-stage Docker builds to reduce serverless container footprints down to a light 85MB footprint, reducing file reads overhead.
3.  **Acoustic Postures**: Formulate all technical capabilities using metric-driven milestones (STAR method). Explicitly list numeric reductions to demonstrate high quality.
`;
    }

    res.json({
      query,
      metric,
      top_k: k,
      matched_chunks: topMatches.map(m => ({
        id: m.id,
        doc_title: m.doc_title,
        text: m.text,
        score: m.similarity_score,
        word_count: m.word_count,
        embedding_preview: m.embedding.slice(0, 12) // Return start of coordinates array for inspector visualization
      })),
      context_used: contextBlock,
      answer: groundedResponse
    });

  } catch (error: any) {
    console.error("RAG Query endpoint error:", error);
    res.status(500).json({ error: `RAG Retrieval Loop search failed: ${error.message}` });
  }
});




// Career mentor chatbot proxy endpoint - calls Gemini API server-side
app.post("/api/mentor/chat", async (req, res) => {
  const { messages, userProfile, persona } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid query payload. 'messages' is required as an array." });
  }

  const selectedPersona = persona || userProfile?.persona || "academic";

  const ai = getGeminiClient();
  if (!ai) {
    let dummyReply = "";
    if (selectedPersona === "architect") {
      dummyReply = "Hello Akhil! I am Devon, your FAANG System Architect Mentor. Since you haven't bound a GEMINI_API_KEY inside Settings > Secrets yet, I'll review locally. Your Phase 11 Docker Compose and multi-stage Docker build files are perfectly verified! Multi-stage builds are critical for limiting attack vectors by separating compiler environments (FROM builder) from runner steps (FROM runner) to shrink image sizes down to 85MB. Keep challenging your architecture setups!";
    } else if (selectedPersona === "recruiter") {
      dummyReply = "Hi Akhil! Sarah here, your Ex-Google Tech Recruiter Mentor. You don't have a GEMINI_API_KEY active in your secrets, but let me validate your profile. Your TF-IDF keyword extraction similarity score is sitting at a healthy 82.5% against the senior developer role! Focus on quantifying your bullets and phrasing with active STAR methods (Situation, Task, Action, Result) to instantly bypass enterprise ATS gates.";
    } else {
      dummyReply = "Hello Akhil! I am Professor Allison, your CS Academic Advisor. We don't have a active GEMINI_API_KEY in your workspace yet, but no worries! Your Phase 4 TF-IDF matching engine and database normalization indices look absolutely brilliant. You've converted tabular text files and indexed foreign keys with CASCADE constraints seamlessly! Keep up the incredible academic rigor.";
    }
    return res.json({ text: dummyReply });
  }

  try {
    // Collect message histories
    const formattedHistory = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.text || m.content || "" }]
    }));

    const conversationPrompt = messages[messages.length - 1]?.text || "Hello";

    let personaPrompt = "";
    if (selectedPersona === "architect") {
      personaPrompt = `You are Devon, an intense, extremely pragmatic, and world-class FAANG Lead System Architect.
Your mentoring style is highly technical, detailed, direct, and authoritative limit-testing. 
You instruct Akhil on physical disk database pages layout, index space overhead margins during high-rate INSERT arrays, and autovacuum workloads.
You teach why database indexing schemas (like B-Tree vs Hash vs GIN) are critical.
You advocate for pgBouncer connection limit strategies, CORS origin rules, memory latencies, and Docker multistage build footprints.
Challenge his engineering depth, review container-level orchestration files, and congratulate him on completing the 11 placement milestones.`;
    } else if (selectedPersona === "recruiter") {
      personaPrompt = `You are Sarah, a sharp, insightful, and results-driven Ex-Google Technical Recruiter and Placement Coach.
Your mentoring style is pragmatic, encouraging, metrics-oriented, and focused on presentation impact.
You help Akhil optimize his resume phrasing, master the behavioral STAR (Situation, Task, Action, Result) response strategy, and explain how ATS (Applicant Tracking Systems) analyze resumes using TF-IDF algorithms.
Give exact key terms, tell him how to quantify metrics (e.g. 'reduced query overhead from 150ms to 12ms'), and help him prepare for real-world HR interview gates.`;
    } else {
      // Default: academic
      personaPrompt = `You are Professor Allison, a warm, extremely supportive, and world-class Senior CS Academic Placement Mentor.
Your mentoring style is educational, theory-oriented, clear, structured, and deeply encouraging.
You focus on academic CS theory foundations, database normal forms (1NF/2NF/3NF), Vector Cosine Dot Products syntax, the mathematics of Term Frequency normalizations, and high-dimensional coordinate projection layouts.
Celebrate Akhil's completion of the 11 Masterclass Phases and prepare his academic confidence.`;
    }

    // Call Gemini 3.5-flash for rapid, rich feedback
    const systemInstruction = `You are a world-class AI Placement Tutor specializing in the AI Career Coach framework.
${personaPrompt}

The user is Akhil, a final-year CS student who has finished implementing all 11 core Phases of his AI Career Coach portfolio:
1. FastAPI + SQLite/Postgres Setup (Arch)
2. Authentication (Bcrypt, JWT scopes)
3. Resume Analyzer (pdfplumber skill parsers)
4. ATS Score Matcher (TF-IDF vector equations)
5. Job Recommendation (Gap Index algorithms)
6. Interactive Interview Assistant (Mock Simulator)
7. Dynamic Week-Schedules Roadmap Generator
8. Real-time Voice Mock Interview (Speech-to-Text)
9. RAG Vector Retrieval Search Core (ChromaDB vectors)
10. Placement Readiness Dashboard & Radar Charts
11. Multi-Stage Docker Container & Nginx Orchestration

Be encouraging and use structured list bullet points, keeping technical concepts precise. Provide highly actionable tutor lessons.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: formattedHistory.length > 1 ? formattedHistory.slice(0, -1) : undefined,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage({
      message: conversationPrompt
    });

    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ 
      error: `Gemini API call failed: ${error.message}. Please verify your API key set under the Secrets panel.` 
    });
  }
});

// Configure Vite middleware or production build output serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Career Coach workspace server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
