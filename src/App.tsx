import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Code2, 
  Database, 
  Cpu, 
  Terminal, 
  Send, 
  Sparkles, 
  Server, 
  Layers, 
  AlertCircle, 
  GitBranch, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Lock, 
  User, 
  Mail, 
  ChevronRight, 
  ClipboardCheck, 
  Check, 
  MessagesSquare, 
  LockKeyhole,
  CheckCircle,
  HelpCircle,
  UploadCloud,
  Layers3,
  Calendar,
  Layers2,
  Trash2,
  BookmarkCheck,
  Search,
  CheckCircle2,
  BadgeAlert,
  Briefcase,
  GraduationCap,
  BarChart3
} from "lucide-react";
import RoadmapGenerator from "./components/RoadmapGenerator";
import VoiceMockHelper from "./components/VoiceMockHelper";
import InterviewVideoProctor from "./components/InterviewVideoProctor";
import RagCareerAssistant from "./components/RagCareerAssistant";
import DashboardAnalytics from "./components/DashboardAnalytics";
import ProductionDeployment from "./components/ProductionDeployment";
import AITutorStudio from "./components/AITutorStudio";

interface ScriptFile {
  path: string;
  label: string;
  lang: string;
  content: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function App() {
  // Phase roadmap state modified for Phase 11 (Production Deployment fully completed!)
  const roadmapPhases = [
    { id: 1, name: "Project Setup & Arch", progress: "Completed", status: "completed", subtitle: "FastAPI + PG Setup" },
    { id: 2, name: "Authentication System", progress: "Completed", status: "completed", subtitle: "Bcrypt hash, JWT token logic" },
    { id: 3, name: "Resume Analyzer", progress: "Completed", status: "completed", subtitle: "pdfplumber NLP skill extraction" },
    { id: 4, name: "ATS Score Calculator", progress: "Completed", status: "completed", subtitle: "TF-IDF similarity calculation" },
    { id: 5, name: "Job Recommendation", progress: "Completed", status: "completed", subtitle: "Gap Analysis & Profile fit algorithm" },
    { id: 6, name: "Interview Assistant", progress: "Completed", status: "completed", subtitle: "Gemini behavioral interview simulator" },
    { id: 7, name: "Roadmap Generator", progress: "Completed", status: "completed", subtitle: "Personalized week schedules" },
    { id: 8, name: "Voice Mock Interview", progress: "Completed", status: "completed", subtitle: "Real-time speech to text advisor & coach" },
    { id: 9, name: "RAG Career Assistant", progress: "Completed", status: "completed", subtitle: "ChromaDB vector retrieval loop" },
    { id: 10, name: "Dashboard Analytics", progress: "Completed", status: "completed", subtitle: "Overall performance charts panel" },
    { id: 11, name: "Production Deployment", progress: "Completed", status: "completed", subtitle: "Docker Compose cloud automation" },
  ];

  // Tab State supporting Phase 11 Production Deployment
  const [activeTab, setActiveTab] = useState<"dashboard-hub" | "resume-analyzer" | "ats-calculator" | "job-recommender" | "architecture" | "files" | "endpoints" | "interview" | "roadmap" | "rag" | "analytics" | "deployment" | "chat">("dashboard-hub");
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [hasEnteredPortal, setHasEnteredPortal] = useState<boolean>(false);


  // Files state fetched from server
  const [files, setFiles] = useState<ScriptFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(true);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  
  // Interactive testing terminal states
  const [terminalOutput, setTerminalOutput] = useState<string>(
    "// Interactive Sandbox Terminal initialized.\n// Choose an active workspace tab or upload a PDF to scan logs in real-time here..."
  );

  // Live JWT state and credentials simulation
  const [sessionToken, setSessionToken] = useState<string | null>(() => localStorage.getItem("career_coach_jwt_token") || "mock-jwt-token-header-claims.eyJzdWIiOiJiYW5kYXJ1c2FpYWtoaWwyMDA1QGdtYWlsLmNvbSJ9.cryptosignature");
  const [currentUserProfile, setCurrentUserProfile] = useState<any>({
    email: "bandarusaiakhil2005@gmail.com",
    full_name: "Sai Akhil Bandaru",
    is_active: true,
    id: 1,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  });

  // Resume Analyzer States
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Interactive PDF Form/Pasted values for immediate playground trials!
  const [pastedResumeText, setPastedResumeText] = useState<string>(
    "SAI AKHIL BANDARU\n" +
    "Email: bandarusaiakhil2005@gmail.com\n" +
    "University of Software Engineering, Class of 2026\n" +
    "Degree: Bachelor of Technology (B.Tech) - Computer Science & Eng\n\n" +
    "TECHNICAL ACQUIRED SKILLS:\n" +
    "Languages: Python, C++, SQL, JavaScript, HTML, CSS\n" +
    "Frameworks: FastAPI, Django, React, Express, Node.js\n" +
    "Infrastructure: Docker, PostgreSQL, MongoDB, Git\n\n" +
    "RECENT PROJECT SUBMISSIONS:\n" +
    "- Job Board Gateway: Constructed containerized REST servers leveraging pyjwt auth layers.\n" +
    "- Realtime AI Mentorship Suite: Built dynamic UI with React hooks for automated placement advice."
  );
  const [simulationFileName, setSimulationFileName] = useState<string>("akhil_software_engineer_cv.pdf");
  const [activeResumeAnalysis, setActiveResumeAnalysis] = useState<any | null>({
    id: 1,
    file_name: "sai_akhil_software_engineer.pdf",
    raw_text: "SAI AKHIL BANDARU\nEmail: bandarusaiakhil2005@gmail.com\nTECHNICAL SKILLS: Python, FastAPI, React, SQL, Docker, PostgreSQL, Git\nEDUCATION: Bachelor of Technology (B.Tech) - Computer Science, 2026\nPROJECTS:\n- AI Career Coach Portfolio: Built FastAPI + React web application using containerized services.",
    extracted_skills: ["Python", "FastAPI", "React", "SQL", "Docker", "PostgreSQL", "Git"],
    extracted_education: [
      { institution: "Bachelor of Technology (B.Tech) - Computer Science", degree: "B.Tech", year: "2026" }
    ],
    extracted_projects: [
      { title: "AI Career Coach Portfolio", technologies: ["FastAPI", "React", "PostgreSQL", "Docker"], description: "Built FastAPI + React web application using containerized services." }
    ],
    created_at: new Date(Date.now() - 1000 * 3600 * 12).toISOString()
  });

  // PDF Parsing states for browser uploads
  const [pdfParsingStatus, setPdfParsingStatus] = useState<string | null>(null);
  const [pdfDragActive, setPdfDragActive] = useState<boolean>(false);
  const [pdfParsingError, setPdfParsingError] = useState<string | null>(null);

  // ATS PDF upload and parsing states
  const [atsPdfParsingStatus, setAtsPdfParsingStatus] = useState<string | null>(null);
  const [atsPdfDragActive, setAtsPdfDragActive] = useState<boolean>(false);
  const [atsPdfParsingError, setAtsPdfParsingError] = useState<string | null>(null);

  // ATS SCORE CALCULATOR STATE CAPABILITIES
  const [jobDescriptionText, setJobDescriptionText] = useState<string>(
    "We are hiring a Junior FastAPI Backend Developer to build scalable enterprise APIs. Required tech stack:\n" +
    "- Strong coding experience in Python, FastAPI, and SQL.\n" +
    "- Database knowledge of postgreSQL or PostgreSQL relational services.\n" +
    "- Microservices deployment using Docker, GCP or Docker containers, and Git commands."
  );
  const [isCalculatingAts, setIsCalculatingAts] = useState<boolean>(false);
  const [atsScoreResult, setAtsScoreResult] = useState<any | null>({
    score: 82.5,
    match_percentage: 82.5,
    resume_id: 1,
    job_description: "We are hiring a Junior FastAPI Backend Developer... Python, FastAPI, PostgreSQL, Docker, Git",
    skill_gap: {
      matched_skills: ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git"],
      missing_skills: ["GCP"]
    },
    keyword_frequencies: [
      { keyword: "fastapi", resume_frequency: 3, job_frequency: 2 },
      { keyword: "python", resume_frequency: 4, job_frequency: 1 },
      { keyword: "postgresql", resume_frequency: 2, job_frequency: 1 },
      { keyword: "docker", resume_frequency: 3, job_frequency: 1 },
      { keyword: "git", resume_frequency: 1, job_frequency: 1 },
      { keyword: "gcp", resume_frequency: 0, job_frequency: 1 }
    ],
    suggested_improvements: [
      "Include missing skill keywords in your resume highlights: GCP",
      "Quantify Placement Metrics: Specify quantitative outcomes e.g. 'Reduced latency overheads by 15%' inside project descriptions.",
      "Incorporate Active Verbs: Command your bullet lines with proactive software execution actions."
    ]
  });

  // Selected Resume reference for ATS Matching
  const [selectedResumeId, setSelectedResumeId] = useState<number>(1);

  // UI state managers
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  // Helper trigger to compute ATS Score via API or local secure vector maps
  const handleCalculateAts = async () => {
    if (!jobDescriptionText?.trim()) {
      showError("Please enter or select a job description to calculate similarities!");
      return;
    }
    
    setIsCalculatingAts(true);
    const resumeIdToUse = selectedResumeId || (uploadHistory.length > 0 ? uploadHistory[0].id : 1);
    const logPrefix = `[HTTP POST /api/v1/ats/calculate] Timestamp: ${new Date().toLocaleTimeString()}\n`;
    
    setTerminalOutput(
      `${logPrefix}>> Payload: { resume_id: ${resumeIdToUse}, jd_length: ${jobDescriptionText.length} characters }\n` +
      `>> Fetching target resume content coordinates from active PostgreSQL database...\n` +
      `>> Loading TF-IDF Vectorizer Similarity Engine...\n` +
      `>> Tokenizing job profile vocabulary & stripping stop words...\n` +
      `>> Calculating dot product of matching features...`
    );

    try {
      const response = await fetch("/api/v1/ats/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resume_id: resumeIdToUse,
          job_description: jobDescriptionText
        })
      });
      const data = await response.json();

      if (response.ok) {
        setAtsScoreResult(data);
        setTerminalOutput(
          `${logPrefix}<< Response Code: 200 OK\n` +
          `<< Score match calculated: ${data.score}% similarity metrics\n` +
          `<< Body Output Data Structure:\n${JSON.stringify(data, null, 2)}\n\n` +
          `// TRANSACTION COMPLETED:\n` +
          `// TF-IDF cosine-vector mapping verified against database schema.`
        );
        showNotice(`ATS Similarity Score computed successfully: ${data.score}% Match!`);
      } else {
        showError("ATS calculation failed: " + (data.detail || "Query error"));
      }
    } catch (err: any) {
      console.error("Similarity Calculation Error:", err);
      showError("Connection to backend calculation service failed: " + err.message);
    } finally {
      setIsCalculatingAts(false);
    }
  };

  // JOB RECOMMENDATIONS & GAP ANALYSIS MATRICES STATE (Phase 5)
  const [recommendationsResult, setRecommendationsResult] = useState<any | null>({
    resume_id: 1,
    candidate_skills: ["Python", "FastAPI", "React", "SQL", "Docker", "PostgreSQL", "Git"],
    recommendations: [
      {
        job_id: 1,
        title: "FastAPI Backend Developer",
        company: "Stripe",
        location: "San Francisco, CA (Hybrid)",
        salary: "$145,000 - $185,000",
        required_skills: ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git", "Linux"],
        description: "Formulate highly scalable distributed payment APIs, manage database connections efficiently, and handle secure client payload schemas.",
        match_percentage: 85.7,
        fit_index: "High",
        matched_skills: ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git"],
        missing_skills: ["Linux"],
        bridge_roadmaps: [
          {
            skill: "Linux",
            action_step: "Master Linux shell operations, examine system logs, and optimize deployment variables safely inside virtual run environments."
          }
        ]
      },
      {
        job_id: 3,
        title: "Full Stack Software Engineer",
        company: "Linear",
        location: "Remote (US/Europe)",
        salary: "$130,005 - $170,000",
        required_skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "Git"],
        description: "Take end-to-end ownership of highly interactive productivity features from custom UI states to optimized backend databases.",
        match_percentage: 71.4,
        fit_index: "Medium",
        matched_skills: ["React", "PostgreSQL", "Docker", "Git"],
        missing_skills: ["TypeScript", "Node.js", "Express"],
        bridge_roadmaps: [
          {
            skill: "TypeScript",
            action_step: "Enforce strict compilation settings. Replace raw types with explicit generic parameter typing, enums, and utility interfaces."
          },
          {
            skill: "Node.js",
            action_step: "Unpack standard event execution structures, establish stream pipes, and process heavy cryptographic buffers on the main thread safely."
          },
          {
            skill: "Express",
            action_step: "Configure REST controllers, register global error capture middlewares, and isolate route prefixes within clean modular routing blocks."
          }
        ]
      },
      {
        job_id: 2,
        title: "Frontend React Architect",
        company: "Vercel",
        location: "Remote (Global)",
        salary: "$150,000 - $190,000",
        required_skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git", "Next.js"],
        description: "Pioneer responsive user-centric interactive interfaces, optimize rendering pipelines, and spearhead state-dependent client caches.",
        match_percentage: 57.1,
        fit_index: "Medium",
        matched_skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        missing_skills: ["TypeScript", "Next.js"],
        bridge_roadmaps: [
          {
            skill: "TypeScript",
            action_step: "Enforce strict compilation settings. Replace raw types with explicit generic parameter typing, enums, and utility interfaces."
          },
          {
            skill: "Next.js",
            action_step: "Implement Server Component paradigms. Study layouts nesting structure and use stale-while-revalidate route strategies."
          }
        ]
      }
    ]
  });
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);

  const handleFetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    const resumeIdToUse = selectedResumeId || (uploadHistory.length > 0 ? uploadHistory[0].id : 1);
    const logPrefix = `[HTTP GET /api/v1/recommendations/resume/${resumeIdToUse}] Timestamp: ${new Date().toLocaleTimeString()}\n`;
    
    setTerminalOutput(
      `${logPrefix}>> Querying placement fit metrics across available database vacancies...\n` +
      `>> Locating extracted resume records (ID: ${resumeIdToUse}) inside PostgreSQL state...\n` +
      `>> Mapping candidate skills profile overlaps...\n` +
      `>> Commencing technology-gap action roadmap formulation...`
    );

    try {
      const response = await fetch(`/api/v1/recommendations/resume/${resumeIdToUse}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionToken ? `Bearer ${sessionToken}` : ""
        }
      });
      const data = await response.json();

      if (response.ok) {
        setRecommendationsResult(data);
        setTerminalOutput(
          `${logPrefix}<< Response Code: 200 OK\n` +
          `<< Recommendations list formulated successfully! Compiled ${data.recommendations?.length || 0} matching target roles.\n` +
          `<< Output Data Payload:\n${JSON.stringify(data, null, 2)}\n\n` +
          `// PLACEMENT MATCH COMPLETE:\n` +
          `// Custom bridge tutorials mapped to candidate skill gaps.`
        );
        showNotice(`Job Recommendations matched successfully for Resume ID ${resumeIdToUse}!`);
      } else {
        showError("Recommendations matching failed: " + (data.detail || "Query error"));
      }
    } catch (err: any) {
      console.error("Recommendations matching Error:", err);
      showError("Connection to backend recommendation services failed: " + err.message);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // PHASE 6: INTERACTIVE AI PLACEMENT INTERVIEW SIMULATOR STATE
  const [interviewRole, setInterviewRole] = useState<string>("FastAPI Backend Developer");
  const [interviewType, setInterviewType] = useState<string>("Behavioral (STAR method)");
  const [interviewActive, setInterviewActive] = useState<boolean>(false);
  const [interviewRound, setInterviewRound] = useState<number>(1);
  const [currentInterviewQuestion, setCurrentInterviewQuestion] = useState<string>("");
  const [candidateAnswerInput, setCandidateAnswerInput] = useState<string>("");
  const [isStartingInterview, setIsStartingInterview] = useState<boolean>(false);
  const [isSubmittingInterview, setIsSubmittingInterview] = useState<boolean>(false);
  const [interviewFeedbackList, setInterviewFeedbackList] = useState<any[]>([]);
  const [lastInterviewReport, setLastInterviewReport] = useState<any | null>(null);

  const handleStartInterview = async () => {
    setIsStartingInterview(true);
    setTerminalOutput("");
    const resumeIdToUse = selectedResumeId || (uploadHistory.length > 0 ? uploadHistory[0].id : 1);
    const logPrefix = `[HTTP POST /api/v1/interview/start] Timestamp: ${new Date().toLocaleTimeString()}\n`;
    
    setTerminalOutput(
      `${logPrefix}>> Handshaking placement evaluation session...\n` +
      `>> Mapping alignment context (Role: ${interviewRole} | Focus: ${interviewType})\n` +
      `>> Prompting interview simulation matrix engine...\n` +
      `>> Extracting tailored target question coefficients...`
    );

    try {
      const response = await fetch("/api/v1/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionToken ? `Bearer ${sessionToken}` : ""
        },
        body: JSON.stringify({
          resume_id: resumeIdToUse,
          role_title: interviewRole,
          interview_type: interviewType
        })
      });
      const data = await response.json();

      if (response.ok) {
        setInterviewActive(true);
        setInterviewRound(1);
        setCurrentInterviewQuestion(data.question);
        setCandidateAnswerInput("");
        setInterviewFeedbackList([]);
        setLastInterviewReport(null);

        setTerminalOutput(
          `${logPrefix}<< Response Code: 200 OK\n` +
          `<< Session successfully initialized! Question delivered for Round 1.\n\n` +
          `// INTERVIEWER PROMPT:\n` +
          `// [${interviewType} focus]\n` +
          `// "${data.question}"`
        );
        showNotice("Placement board interview began successfully! Round 1 of 3 active.");
      } else {
        showError("Failed initializing interview session: " + (data.error || "Connection error"));
      }
    } catch (err: any) {
      console.error("Start interview error:", err);
      showError("Connection to interview services failed: " + err.message);
    } finally {
      setIsStartingInterview(false);
    }
  };

  const handleSubmitInterviewResponse = async () => {
    if (!candidateAnswerInput.trim()) {
      showError("Please enter your response before submitting.");
      return;
    }

    setIsSubmittingInterview(true);
    const resumeIdToUse = selectedResumeId || (uploadHistory.length > 0 ? uploadHistory[0].id : 1);
    const logPrefix = `[HTTP POST /api/v1/interview/submit] Round ${interviewRound} | Timestamp: ${new Date().toLocaleTimeString()}\n`;

    setTerminalOutput(
      `${logPrefix}>> Uploading answer metrics (Size: ${candidateAnswerInput.trim().length} chars)...\n` +
      `>> Syncing technical keywords dictionary...\n` +
      `>> Analyzing grammar density, vocabulary posture, and STAR method coefficients...\n` +
      `>> Simulating CTO evaluation review panel parameters...`
    );

    try {
      const response = await fetch("/api/v1/interview/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionToken ? `Bearer ${sessionToken}` : ""
        },
        body: JSON.stringify({
          resume_id: resumeIdToUse,
          role_title: interviewRole,
          interview_type: interviewType,
          question: currentInterviewQuestion,
          answer: candidateAnswerInput,
          round: interviewRound
        })
      });
      const data = await response.json();

      if (response.ok) {
        const nextRoundFeedback = {
          round: interviewRound,
          question: currentInterviewQuestion,
          answer: candidateAnswerInput,
          score: data.score,
          verbal_grade: data.verbal_grade,
          communication_style_evaluation: data.communication_style_evaluation,
          star_alignment_evaluation: data.star_alignment_evaluation,
          technical_accuracy_evaluation: data.technical_accuracy_evaluation,
          revision_suggestion: data.revision_suggestion
        };

        const updatedHistory = [...interviewFeedbackList, nextRoundFeedback];
        setInterviewFeedbackList(updatedHistory);

        setTerminalOutput(
          `${logPrefix}<< Response Code: 200 OK\n` +
          `<< Round ${interviewRound} evaluated successfully! Alignment Score: ${data.score}/100 [${data.verbal_grade}]\n` +
          `<< Output Payload Summary:\n${JSON.stringify(data, null, 2)}\n\n` +
          `// CTO REWRITE RECOMMENDED ACTION:\n` +
          `// "${data.revision_suggestion}"`
        );

        if (interviewRound >= 3 || data.is_final) {
          // Interview complete! Compile report and end session.
          setLastInterviewReport(updatedHistory);
          setInterviewActive(false);
          showNotice("Simulated interview completed! Placement Executive Report compiled.");
        } else {
          setInterviewRound(prev => prev + 1);
          setCurrentInterviewQuestion(data.next_question);
          setCandidateAnswerInput("");
          showNotice(`Round ${interviewRound} complete. Escalating to Round ${interviewRound + 1}!`);
        }
      } else {
        showError("Evaluation submission failed: " + (data.error || "Connection error"));
      }
    } catch (err: any) {
      console.error("Submit response error:", err);
      showError("Connection to evaluation services failed: " + err.message);
    } finally {
      setIsSubmittingInterview(false);
    }
  };

  const handleResetInterview = () => {
    setInterviewActive(false);
    setInterviewRound(1);
    setCurrentInterviewQuestion("");
    setCandidateAnswerInput("");
    setInterviewFeedbackList([]);
    setLastInterviewReport(null);
    showNotice("Placement assessment session reset smoothly.");
  };


  // Load history & files on mount
  useEffect(() => {
    // Sync file inspector
    fetch("/api/mentor/files")
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
          const resumeParserIdx = data.files.findIndex((f: any) => f.path.includes("resume_parser.py"));
          if (resumeParserIdx !== -1) {
            setSelectedFileIndex(resumeParserIdx);
          } else {
            setSelectedFileIndex(0);
          }
        }
        setIsLoadingFiles(false);
      })
      .catch(err => {
        console.error("Failed loading file tree indices", err);
        setIsLoadingFiles(false);
      });

    // Sync mock resume database list
    fetchHistory();
  }, []);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([
      { 
        role: "assistant", 
        text: "Hello Akhil! Welcome to **Phase 4: ATS Score Matching & TF-IDF Similarity Calculator** of your portfolio project! \n\nWe have successfully engineered **Term Frequency Inverse Document Frequency (TF-IDF)** and **Vector Cosine Similarity** mathematics inside custom robust Python services! This allows us to compare candidate resumes with any complex employer job specifications, highlighting technology skill gaps and suggesting exact actionable optimizations.\n\nAsk me queries about: \n- How TF-IDF normalizes term occurrences by document sparsity.\n- The mathematical formula of cosine vector dot products.\n- How we avoid index issues when matching keywords like 'C++' or '.NET'.\n- Interactive playground calculations!\n\nWhen you are satisfied with your tests, type **'Proceed to Phase 5'** to advance!" 
      }
    ]);
  }, []);

  const fetchHistory = () => {
    setIsLoadingHistory(true);
    fetch("/api/v1/resume/history")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUploadHistory(data);
          if (data.length > 0 && !activeResumeAnalysis) {
            setActiveResumeAnalysis(data[data.length - 1]);
          }
        }
        setIsLoadingHistory(false);
      })
      .catch(err => {
        console.error("Failed loading history logs", err);
        setIsLoadingHistory(false);
      });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(label);
    showNotice(`Copied code context of ${label.split("/").pop()}!`);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const showNotice = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 3500);
  };

  // Dynamically load PDF.js from CDN to parse uploaded file in-browser
  const loadPdfJS = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
      script.onload = () => {
        // Init global worker path as well
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        resolve((window as any).pdfjsLib);
      };
      script.onerror = () => reject(new Error("Failed to load PDF.js engine from cloud delivery networks. Please confirm web accessibility."));
      document.head.appendChild(script);
    });
  };

  const handlePdfUploadAndExtract = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      showError("Draft error: The uploaded scanner entity is not a PDF file.");
      return;
    }

    setPdfParsingStatus("Initializing PDF.js stream parser...");
    setPdfParsingError(null);
    setSimulationFileName(file.name);

    try {
      const pdfjsLib = await loadPdfJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setPdfParsingStatus(`Extracting text chunks from ${pdf.numPages} layout page(s)...`);
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str);
        fullText += textItems.join(" ") + "\r\n";
        setPdfParsingStatus(`Extracted ${i} / ${pdf.numPages} layout pages...`);
      }

      if (!fullText.trim()) {
        throw new Error("Extracted document layout text came back empty. Verify that PDF isn't a non-OCR image scan.");
      }

      setPastedResumeText(fullText.trim());
      showNotice(`Successfully processed and loaded your PDF with ${pdf.numPages} page(s)! Click below to Dispatch Parse.`);
      
      setTerminalOutput(
        (prev) => `${prev}\n\n[FILE READER UPLOAD RECEIVED]\nFile: "${file.name}"\nPayload weight: ${fullText.length} characters parsed\nAuto-populated text matrix editor view. Ready for relational model insert.`
      );
    } catch (err: any) {
      console.error("In-browser PDF reader crash:", err);
      const errMsg = err.message || "Unreadable PDF metadata payload standard.";
      setPdfParsingError(errMsg);
      showError(`In-browser reader crash: ${errMsg}`);
    } finally {
      setPdfParsingStatus(null);
    }
  };

  const handleAtsPdfUploadAndExtract = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      showError("Draft error: The uploaded scanner entity is not a PDF file.");
      return;
    }

    setAtsPdfParsingStatus("Initializing PDF.js stream parser...");
    setAtsPdfParsingError(null);

    try {
      const pdfjsLib = await loadPdfJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setAtsPdfParsingStatus(`Extracting text from ${pdf.numPages} layout page(s)...`);
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str);
        fullText += textItems.join(" ") + "\r\n";
        setAtsPdfParsingStatus(`Extracted ${i} / ${pdf.numPages} layout pages...`);
      }

      if (!fullText.trim()) {
        throw new Error("Extracted document layout text came back empty. Verify that PDF isn't a non-OCR image scan.");
      }

      setAtsPdfParsingStatus("Uploading & analyzing database entry...");
      
      const response = await fetch("/api/v1/resume/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          raw_text: fullText.trim()
        })
      });
      const data = await response.json();

      if (response.ok) {
        setTerminalOutput(
          (prev) => `${prev}\n\n[ATS DIRECT PDF PARSER RECEIVED]\nFile: "${file.name}"\nPayload weight: ${fullText.trim().length} characters parsed & analyzed\nAuto-populated relational model insert with ID: ${data.id}. Ready for ATS match comparison.`
        );
        setSelectedResumeId(data.id);
        setActiveResumeAnalysis(data);
        showNotice(`Successfully uploaded "${file.name}" directly to ATS matcher!`);
        
        // Fetch new history to populate the list and ensure it's selected properly
        setIsLoadingHistory(true);
        const histRes = await fetch("/api/v1/resume/history");
        const histData = await histRes.json();
        if (Array.isArray(histData)) {
          setUploadHistory(histData);
          setSelectedResumeId(data.id);
        }
        setIsLoadingHistory(false);
      } else {
        throw new Error(data.detail || "Database extraction upload failed.");
      }
    } catch (err: any) {
      console.error("Direct ATS PDF reader crash:", err);
      const errMsg = err.message || "Unreadable PDF metadata payload.";
      setAtsPdfParsingError(errMsg);
      showError(`Direct ATS reader crash: ${errMsg}`);
    } finally {
      setAtsPdfParsingStatus(null);
    }
  };

  // Simulated & Live upload trigger combined
  const handleAnalyzeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedResumeText.trim()) {
      showError("Please paste or provide resume text to execute analyzer pipeline!");
      return;
    }
    setIsAnalyzing(true);
    const logPrefix = `[HTTP POST /api/v1/resume/upload] Timestamp: ${new Date().toLocaleTimeString()}\n`;
    setTerminalOutput(
      `${logPrefix}>> Payload: { file_name: "${simulationFileName}", text_length: ${pastedResumeText.length} characters }\n` +
      `>> Stream Initialized. Initiating in-memory PDF parse blocks via pdfplumber...\n` +
      `>> Spawning regex scanner to catalog matched technical skills categorizations...\n\nProcessing...`
    );

    try {
      const response = await fetch("/api/v1/resume/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: simulationFileName,
          raw_text: pastedResumeText
        })
      });
      const data = await response.json();

      if (response.ok) {
        setTerminalOutput(
          `${logPrefix}<< Response Code: 201 Created\n` +
          `<< Extracted Skills counts: ${data.extracted_skills?.length || 0} entities matches\n` +
          `<< Body Output Data Shape:\n${JSON.stringify(data, null, 2)}\n\n` +
          `// POSTGRES DB STATE UPDATE:\n` +
          `// INSERT INTO resumes (user_id, file_name, raw_text, extracted_skills, extracted_education, extracted_projects) VALUES (1, '${data.file_name}', ..., '${JSON.stringify(data.extracted_skills)}', ...);\n` +
          `// Transaction committed complete. Integrity constraints passed.`
        );
        setActiveResumeAnalysis(data);
        showNotice("Resume parsed successfully and stored in PostgreSQL history logs!");
        fetchHistory();
      } else {
        showError("Extraction validation failed: " + (data.detail || "Malformed structure"));
      }
    } catch (err: any) {
      showError("Connection to API failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsSendingChat(true);

    // Check if transition to Phase 4 matches text
    const transitionTrigger = userMsg.toLowerCase().includes("phase 4") || userMsg.toLowerCase().includes("proceed to phase 4");

    try {
      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", text: userMsg }],
          userProfile: { name: "Akhil", phase: 3 }
        })
      });
      const data = await response.json();
      if (response.ok) {
        let assistantReply = data.text;
        if (transitionTrigger) {
          assistantReply += `\n\n🌟 **PLACEMENT MENTOR UPDATE:** Standard Phase 3 verification is complete! I've received your instruction to transition to **Phase 4: ATS Score & NLP TF-IDF Matcher**. Please request your AI Coder to implement Phase 4 updates in the main workspace! Let's build your placement credentials together.`;
        }
        setChatMessages(prev => [...prev, { role: "assistant", text: assistantReply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", text: `Warning: ${data.error || "Communication failure"}` }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: "assistant", text: `Error: Unable to reach Mentor AI server. (Detail: ${err.message})` }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const executeConsoleCommand = (cmd: string) => {
    setTerminalOutput(`$ ${cmd}\nProcessing transaction queries on postgres microservice...`);
    setTimeout(() => {
      if (cmd.includes("history")) {
        setTerminalOutput(
          `$ curl -i http://localhost:8000/api/v1/resume/history\n\n` +
          `HTTP/1.1 200 OK\n` +
          `Content-Type: application/json\n\n` +
          JSON.stringify(uploadHistory, null, 2)
        );
      } else if (cmd.includes("dt resumes")) {
        setTerminalOutput(
          `$ psql -h localhost -U postgres -d ai_career_coach\n` +
          `ai_career_coach=# \\d resumes\n` +
          `                                        Table "public.resumes"\n` +
          `       Column        |           Type           | Collation | Nullable |               Default                \n` +
          `---------------------+--------------------------+-----------+----------+--------------------------------------\n` +
          ` id                  | integer                  |           | not null | nextval('resumes_id_seq'::regclass)\n` +
          ` user_id             | integer                  |           | not null | \n` +
          ` file_name           | character varying(255)   |           | not null | \n` +
          ` raw_text            | text                     |           | not null | \n` +
          ` extracted_skills    | json                     |           | not null | \n` +
          ` extracted_education | json                     |           | not null | \n` +
          ` extracted_projects  | json                     |           | not null | \n` +
          ` created_at          | timestamp with time zone |           |          | \n` +
          ` updated_at          | timestamp with time zone |           |          | \n` +
          `Indexes:\n` +
          `    "resumes_pkey" PRIMARY KEY, btree (id)\n` +
          `Foreign-key constraints:\n` +
          `    "fk_resumes_user_id" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
        );
      } else {
        setTerminalOutput(
          `$ docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"\n\n` +
          `NAMES                  STATUS              PORTS\n` +
          `coach-postgres-db      Up 2 hours          0.0.0.0:5432->5432/tcp\n` +
          `coach-fastapi-backend  Up 2 hours (healthy)0.0.0.0:8000->8000/tcp\n\n` +
          `// All microservices are active on development subnets.`
        );
      }
    }, 550);
  };

  // Flipcards for Academic placement exams
  const interviewQuestions = [
    {
      q: "Why is 'pdfplumber' preferred for extracting tabular and structural data from PDF resumes over 'PyPDF'?",
      a: "pdfplumber is built on top of pdfminer.six and offers meticulous positioning controls. It allows you to inspect precise coordinates of text segments, characters, and structural line containers. Unlike simple readers, it extracts tabular layouts and spacing boundaries perfectly, which prevents words from blending together under complex double-column resume layouts."
    },
    {
      q: "Explain how regular expressions verify skill tokens like 'C++' or 'Next.js' without crashing on pattern boundary limits.",
      a: "In regex, the standard '\\b' designates a word boundary. Characters like '+', '#', or '.' are not considered alphanumeric word characters by default. If we search rf'\\bC++\\b', word margins fail to match. To resolve this, we write lookbehind patterns or custom boundary captures, e.g. '(?:^|\\s)C\\+\\+(?:\\s|$|,|\\.)' ensuring bullet points matches succeed perfectly."
    },
    {
      q: "How does SQLAlchemy mapping serialize nested JSON fields (extracted_skills/projects) to PostgreSQL?",
      a: "SQLAlchemy provides the 'Column(JSON)' property matching PostgreSQL's binary JSONB/JSON formats. Pydantic validators output standard List[str] models, which FastAPI serializes to JSON. SQLAlchemy automatically encodes these Python vectors to standard JSON tables format indexes during commit executions."
    },
    {
      q: "Why should we use 'ondelete=\"CASCADE\"' on 'resumes.user_id' foreign keys inside database servers?",
      a: "It guarantees relational database integrity. When a student's profile account (inside the users table) is requested for deletion or purged, cascade parameters command the postgres daemon to clean up in-sync all dependent linked tables rows (all resumes linked to user_id) preventing orphan record leaks."
    }
  ];

  if (!hasEnteredPortal) {
    return (
      <div className="bg-[#02040a] text-slate-200 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-sky-500 selection:text-white relative justify-center items-center p-4 sm:p-6 lg:p-12">
        {/* Decorative AI Tutor Ambient Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[5%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-[25%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-sky-500/5 blur-[100px] animate-pulse duration-[10000ms]" />
          <div className="absolute bottom-[10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-violet-600/10 blur-[150px] animate-pulse duration-[12000ms]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#38bdf8 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(to right, #4338ca 1px, transparent 1px), linear-gradient(to bottom, #4338ca 1px, transparent 1px)", backgroundSize: "96px 96px" }} />

          {/* Animated Floating Neural Network Particle Nodes */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-sky-400/40 blur-[1px]"
            animate={{
              x: [0, 100, -80, 0],
              y: [0, -180, 80, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "25%", left: "12%" }}
          />
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-indigo-500/30 blur-[1px]"
            animate={{
              x: [0, -120, 60, 0],
              y: [0, 150, -100, 0],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ bottom: "30%", right: "15%" }}
          />
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-violet-400/40 blur-[0.5px]"
            animate={{
              x: [0, 80, -100, 0],
              y: [0, 120, -160, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{ top: "60%", left: "25%" }}
          />
          <motion.div
            className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500/15 blur-[2px]"
            animate={{
              x: [0, -60, 120, 0],
              y: [0, -100, 120, 0],
            }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ top: "15%", right: "30%" }}
          />
        </div>

        <motion.div 
          className="max-w-4xl w-full relative z-10 flex flex-col items-center gap-8 text-center my-auto py-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
              }
            }
          }}
        >
          {/* Header Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[10px] font-bold tracking-widest uppercase rounded-full select-none"
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin duration-1000" />
            <span>AI Tutor Strategic Portal Live</span>
          </motion.div>

          {/* Logo & Headline */}
          <div className="space-y-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center font-bold text-slate-950 tracking-wide shadow-2xl shadow-sky-500/20 mx-auto"
              variants={{
                hidden: { scale: 0, rotate: -30, opacity: 0 },
                visible: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 12 } }
              }}
              whileHover={{ rotate: 12, scale: 1.1, cursor: "pointer" }}
            >
              <Cpu className="w-9 h-9 text-slate-950" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              Hired <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-400">AI</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed"
              variants={{
                hidden: { y: 15, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              Your Autonomous B.Tech CS Placement Strategic Engine & AI Tutor Studio
            </motion.p>
            <motion.p 
              className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-normal"
              variants={{
                hidden: { y: 10, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              Unlock real-time PDF resume analysis, smart ATS scores, predictive skill path recommendations, and fine-tuned mock placement interview stimulators.
            </motion.p>
          </div>

          {/* Feature Showcase Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left mt-4"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div 
              className="bg-slate-950/40 backdrop-blur-md border border-slate-900 hover:border-[#1e293b] p-5 rounded-2xl transition duration-300 group cursor-pointer relative overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(56, 189, 248, 0.15)",
                borderColor: "rgba(56, 189, 248, 0.3)"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/[0.02] rounded-bl-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-900/10 flex items-center justify-center text-sky-400 font-bold mb-3.5 group-hover:scale-110 transition duration-300">
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-sky-350 transition-colors">ATS PDF Resume Scanner</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Upload real-world resumes directly to score matching capabilities, verify keywords, and get instant bullet optimizer feedback.
              </p>
            </motion.div>

            <motion.div 
              className="bg-slate-950/40 backdrop-blur-md border border-slate-900 hover:border-[#312e81] p-5 rounded-2xl transition duration-300 group cursor-pointer relative overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)",
                borderColor: "rgba(99, 102, 241, 0.3)"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] rounded-bl-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-900/10 flex items-center justify-center text-indigo-400 font-bold mb-3.5 group-hover:scale-110 transition duration-300">
                <MessagesSquare className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-350 transition-colors">Interactive AI Tutor Studio</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect directly to model-guided mock evaluations with simulated voice chat pipelines and personalized coding round diagnostics.
              </p>
            </motion.div>

            <motion.div 
              className="bg-slate-950/40 backdrop-blur-md border border-slate-900 hover:border-[#0d9488] p-5 rounded-2xl transition duration-300 group cursor-pointer relative overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.15)",
                borderColor: "rgba(20, 184, 166, 0.3)"
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/[0.02] rounded-bl-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-teal-950/40 border border-teal-900/10 flex items-center justify-center text-teal-400 font-bold mb-3.5 group-hover:scale-110 transition duration-300">
                <Layers className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-teal-350 transition-colors">11-Chapter Academic Suite</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Certified curriculum chapters covering FastAPI backends, database schema, TF-IDF similarities, and secure cloud deploys.
              </p>
            </motion.div>
          </motion.div>

          {/* Quick Metrics Live Teaser */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 px-6 py-3.5 bg-slate-950/30 border border-slate-900/60 rounded-2xl text-[11px] font-mono font-medium text-slate-400 w-full max-w-2xl justify-around"
            variants={{
              hidden: { scale: 0.95, opacity: 0 },
              visible: { scale: 1, opacity: 1 }
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span>11 Chapters Active</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-slate-900/80 pl-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              <span>Gemini Engine Ready</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-slate-900/80 pl-6">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
              <span>JWT Authentication Active</span>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div 
            className="space-y-4 w-full sm:w-auto"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
          >
            <motion.button
              onClick={() => {
                setHasEnteredPortal(true);
                showNotice("Welcome to Hired AI! Platform initialized successfully.");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4 bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white font-bold font-display rounded-xl shadow-[0_0_35px_rgba(56,189,248,0.25)] hover:shadow-[0_0_50px_rgba(56,189,248,0.45)] cursor-pointer text-sm tracking-wide"
              whileHover={{ 
                scale: 1.03,
                backgroundImage: "linear-gradient(to right, #38bdf8, #4f46e5)",
                y: -1
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>ENTER PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase select-none">
              Student Workspace ID: <span className="text-slate-400">SAI_AKHIL_2026</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#02040a] text-slate-200 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-sky-500 selection:text-white relative">
      
      {/* Decorative AI Tutor Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glowing Neural Node Blobs */}
        <div className="absolute top-[-10%] left-[5%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[25%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-sky-500/5 blur-[100px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-violet-600/10 blur-[150px] animate-pulse duration-[12000ms]" />
        <div className="absolute top-[60%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-teal-500/5 blur-[90px] animate-pulse duration-[9000ms]" />

        {/* Matrix/Neural Dot Grid Blueprint Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{ 
            backgroundImage: "radial-gradient(#38bdf8 1.5px, transparent 1.5px)", 
            backgroundSize: "32px 32px" 
          }} 
        />
        
        {/* Neural synapse pattern laser line vectors */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: "linear-gradient(to right, #4338ca 1px, transparent 1px), linear-gradient(to bottom, #4338ca 1px, transparent 1px)",
            backgroundSize: "96px 96px"
          }}
        />

        {/* Binary Floating Nodes / IA Synapses Line paths code-based representation */}
        <div className="absolute top-20 left-12 font-mono text-[8.5px] text-indigo-400/25 select-none leading-relaxed hidden lg:block">
          <div>NEURAL_NET_CONN: ACTIVE</div>
          <div>WEIGHTS: GD_STOCHASTIC</div>
          <div>SYS_PROMPT: PLACEMENT_TUTOR_V4_EMBED</div>
          <div>VAL_LOSS: 0.0024</div>
        </div>

        <div className="absolute top-36 right-12 font-mono text-[8.5px] text-sky-400/25 select-none leading-relaxed text-right hidden lg:block">
          <div>EMBEDDING_SPACE: COSINE</div>
          <div>DIMENSIONS: 1536</div>
          <div>TEMPERATURE: 0.15</div>
          <div>ACTIVE_LEARNER: SAI_AKHIL</div>
        </div>
      </div>
      
      {/* Toast Popups notifications */}
      {successToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0f172a] border-l-4 border-emerald-500 text-emerald-300 text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 border border-slate-800 animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0f172a] border-l-4 border-rose-500 text-rose-300 text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 border border-slate-800 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Main Bar Top Page Banner */}
      <header className="h-16 border-b border-slate-850 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 active:opacity-85 transition select-none"
          onClick={() => {
            setHasEnteredPortal(false);
            showNotice("Returned to welcome portal.");
          }}
          title="Return to Welcome Portal"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-sky-450 to-teal-400 rounded-lg flex items-center justify-center font-bold text-slate-950 tracking-wide shadow-lg shadow-sky-500/10 group-hover:scale-105 transition-transform duration-250 select-none">
            <Cpu className="w-4.5 h-4.5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2 font-display">
              Hired <span className="text-sky-400 font-extrabold group-hover:text-sky-300 transition-colors">AI</span>
              <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800 font-bold select-none">
                B.Tech CS Placement certified
              </span>
            </h1>
          </div>
        </div>

        {/* Dynamic Meta Indicators and Toggle Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-semibold">
              Sai Akhil Bandaru • Class of 2026
            </span>
            <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
              Strategic Placement Engine Active
            </span>
          </div>

          {/* Interactive Diagnostics Console switch! */}
          <button
            onClick={() => {
              setShowDiagnostics(prev => {
                const newVal = !prev;
                showNotice(newVal ? "Diagnostics Sandbox Console enabled! Double-sidebar active." : "Diagnostics console dismissed. Single screen layout optimized!");
                return newVal;
              });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition duration-150 cursor-pointer flex items-center gap-2 border select-none ${
              showDiagnostics 
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-400" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showDiagnostics ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`}></span>
            <span>Diagnostics {showDiagnostics ? "ACTIVE" : "OFF"}</span>
          </button>
          

        </div>
      </header>

      {/* Workspace Frame Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Content Workspace Area - Main centered canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-transparent z-10 flex flex-col gap-6 overflow-y-auto w-full max-w-7xl mx-auto relative">
          
          {/* Hired AI Unified Segmented Selector */}
          <div className="bg-[#0b0f19] border border-slate-800/85 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold text-sky-455 uppercase tracking-widest text-sky-400">
                  Hired AI System Console Selector
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-[10px] text-slate-350 text-slate-300 font-medium">Click any tab to render immediate outcome</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("dashboard-hub")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "dashboard-hub"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🏠 Hub Overview
                </button>
                <div className="h-4 w-px bg-slate-800"></div>
                <div className="text-[10px] text-slate-500 font-mono">Sai Akhil Bandaru (CS, 2026)</div>
              </div>
            </div>

            {/* Core Placement Tooling Selector Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
              <button
                onClick={() => setActiveTab("resume-analyzer")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "resume-analyzer"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate font-sans font-bold">📄 Resume Parser</span>
              </button>

              <button
                onClick={() => setActiveTab("ats-calculator")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "ats-calculator"
                    ? "bg-sky-500/10 border-sky-500 text-sky-300 shadow-md shadow-sky-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
                <span className="truncate font-sans font-bold">🎯 ATS Matcher</span>
              </button>

              <button
                onClick={() => setActiveTab("job-recommender")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "job-recommender"
                    ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-md shadow-amber-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate font-sans font-bold">💼 Role Matcher</span>
              </button>

              <button
                onClick={() => setActiveTab("roadmap")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "roadmap"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate font-sans font-bold">🗺️ Study Path</span>
              </button>

              <button
                onClick={() => setActiveTab("interview")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "interview"
                    ? "bg-pink-500/10 border-pink-500 text-pink-300 shadow-md shadow-pink-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="truncate font-sans font-bold">🎤 Vocal Coach</span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer border ${
                  activeTab === "chat"
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/5 font-extrabold"
                    : "bg-[#101524] border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]"
                }`}
              >
                <MessagesSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate font-sans font-bold">💬 Career Tutor</span>
              </button>
            </div>

            {/* Sub-bar for Metrics and Dev tools in a highly sanitized disclosure block */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-900 pt-3 gap-2">
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeTab === "analytics"
                      ? "bg-purple-950/45 text-purple-400 border border-purple-900/40"
                      : "text-slate-500 hover:text-slate-350 hover:bg-slate-900/10"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>📊 Placement Graphs</span>
                </button>

                <button
                  onClick={() => setActiveTab("rag")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeTab === "rag"
                      ? "bg-teal-950/40 text-teal-400 border border-teal-500/20"
                      : "text-slate-500 hover:text-slate-350 hover:bg-slate-900/10"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>🔍 Semantic RAG</span>
                </button>

                <button
                  onClick={() => setActiveTab("files")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeTab === "files"
                      ? "bg-teal-950/40 text-teal-400 border border-teal-500/20"
                      : "text-slate-500 hover:text-slate-350 hover:bg-slate-900/10"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>🐍 Python Source</span>
                </button>

                <button
                  onClick={() => setActiveTab("endpoints")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeTab === "endpoints"
                      ? "bg-rose-950/40 text-rose-400 border border-rose-500/20"
                      : "text-slate-500 hover:text-slate-350 hover:bg-slate-900/10"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>📟 SQL Console</span>
                </button>

                <button
                  onClick={() => setActiveTab("deployment")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                    activeTab === "deployment"
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-500 hover:text-slate-350 hover:bg-slate-900/10"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🧬 Deployment Cluster</span>
                </button>
              </div>

              {/* Verified Certificate indicator */}
              <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-950/60 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono font-bold uppercase select-none">
                <Check className="w-3 h-3 animate-pulse" />
                <span>ALL SYSTEMS PASSED</span>
              </div>
            </div>
          </div>

          {/* Header Dashboard section */}
          {activeTab === "dashboard-hub" ? (
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-500/20">
                    PORTFOLIO VERIFIED
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">All 11 Placement Chapters Live & Fully Integrated</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white font-display">
                  Hired AI Academic Suite
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Excellent work, Sai Akhil! Your unified CS mentor application is fully-hardened. Launch any tool card below or use the AI Tutor on the side to run placement diagnostic simulations.
                </p>
              </div>

              {/* Quick action triggers */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 lg:mt-0 select-none">
                <button 
                  onClick={() => setActiveTab("deployment")}
                  className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg text-slate-305 text-slate-300 hover:bg-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  Container Fleet
                </button>
                <button 
                  onClick={() => {
                    setActiveTab("chat");
                    setChatInput("Review production architecture and finalize mentor graduation!");
                    showNotice("Prompt configured. Click send in chat to conclude!");
                  }}
                  className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-sky-500 text-xs font-bold rounded-xl text-slate-950 hover:bg-sky-400 transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Graduation System Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/85">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button 
                  onClick={() => setActiveTab("dashboard-hub")}
                  className="hover:text-white transition font-semibold"
                >
                  Hired AI Suite
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-sky-405 text-sky-400 font-bold capitalize font-mono flex items-center gap-1.5 bg-sky-950/35 px-2 py-0.5 rounded border border-sky-900/30">
                  {activeTab === "resume-analyzer" && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                  {activeTab === "ats-calculator" && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
                  {activeTab === "job-recommender" && <Briefcase className="w-3.5 h-3.5 text-amber-500" />}
                  {activeTab === "interview" && <HelpCircle className="w-3.5 h-3.5 text-amber-400" />}
                  {activeTab === "roadmap" && <GraduationCap className="w-3.5 h-3.5 text-sky-450" />}
                  {activeTab === "rag" && <Database className="w-3.5 h-3.5 text-teal-400" />}
                  {activeTab === "files" && <Code2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {activeTab === "endpoints" && <Terminal className="w-3.5 h-3.5 text-rose-400" />}
                  {activeTab === "deployment" && <Layers className="w-3.5 h-3.5 text-emerald-400" />}
                  {activeTab === "analytics" && <BarChart3 className="w-3.5 h-3.5 text-sky-400" />}
                  {activeTab === "architecture" && <Layers3 className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{activeTab.replace("-", " ")}</span>
                </span>
              </div>
              <motion.button 
                onClick={() => {
                  setActiveTab("dashboard-hub");
                  showNotice("Dispatched to central Hub");
                }}
                className="text-xs text-sky-400 hover:text-sky-305 font-mono font-bold transition-all px-4 py-2 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-900/30 hover:border-sky-500/50 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/5 select-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>&larr; JUMP BACK TO HUB</span>
              </motion.button>
            </div>
          )}

          {/* Interactive tabs hidden for a premium, single-focused Hired AI layout */}
          <div className="hidden flex-wrap items-center gap-1.5 border-b border-slate-800 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab("job-recommender")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "job-recommender" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Career Role Matchmaker</span>
            </button>

            <button
              onClick={() => setActiveTab("ats-calculator")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "ats-calculator" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>2. ATS Score Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab("resume-analyzer")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "resume-analyzer" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Resume Parser Library</span>
            </button>


            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "architecture" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>3. PDF Pipeline Flow</span>
            </button>
            
            <button
              onClick={() => setActiveTab("files")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "files" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Python Code Explorer ({files.length || 21})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("endpoints")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "endpoints" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>5. Database & SQL Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab("interview")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "interview" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>6. Interview Prep & Vocal Coach</span>
            </button>

            <button
              onClick={() => setActiveTab("roadmap")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "roadmap" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              <span>7. Adaptive Study Roadmaps</span>
            </button>

            <button
              onClick={() => setActiveTab("rag")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "rag" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>8. RAG Search & Vector DB</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "analytics" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-450" />
              <span>9. Dashboard Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("deployment")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "deployment" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>10. Production Deployment</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer relative whitespace-nowrap ${
                activeTab === "chat" 
                  ? "border-sky-500 text-white bg-slate-900/50" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessagesSquare className="w-3.5 h-3.5 text-sky-400 font-semibold" />
              <span>11. Mentor Conversations</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </button>
          </div>

          {/* Interactive Screen Grid panels split */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LHS Section depending on Active Tab */}
            <div className={`${activeTab === "chat" || activeTab === "dashboard-hub" || !showDiagnostics ? "xl:col-span-3" : "xl:col-span-2"} space-y-6`}>
              
              {/* BACK TO HUB INTEGRATED NAVIGATION ASSISTANCE BAR FOR ALL SUB-PAGES */}
              {activeTab !== "dashboard-hub" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-sky-950/30 to-slate-950/50 border border-slate-900 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        setActiveTab("dashboard-hub");
                        showNotice("Welcome back to Academic Suit Overview Dashboard!");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-550 to-indigo-600 bg-sky-600 font-mono font-bold text-[11px] rounded-lg border border-sky-450/40 hover:border-sky-400 transition-all cursor-pointer shadow-lg hover:shadow-sky-500/10 group text-white"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform inline-block font-sans">&larr;</span>
                      <span>BACK TO HUB OVERVIEW DETECTOR</span>
                    </button>
                    <span className="text-slate-800 text-xs hidden sm:inline">|</span>
                    <span className="text-slate-455 text-slate-400 text-xs font-mono select-none">
                      Focus: <span className="text-sky-400 font-bold capitalize">{activeTab.replace("-", " ")}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono select-none">
                    <span>sai akhil system console portal</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                </motion.div>
              )}
              
              {/* TAB Dashboard Hub: SYSTEMATIC OUTCOMES PORTAL */}
              {activeTab === "dashboard-hub" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Welcome Greeting Hero Board */}
                  <div className="relative overflow-hidden bg-gradient-to-tr from-[#0f172a] via-[#111c44] to-[#010822] rounded-3xl border border-slate-850 p-6 sm:p-8 shadow-2xl">
                    <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl select-none pointer-events-none"></div>
                    <div className="absolute right-4 top-4 select-none">
                      <span className="text-[9px] tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono uppercase font-bold">
                        Academic Grade: A+
                      </span>
                    </div>

                    <div className="relative z-10 max-w-3xl space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold text-xs font-mono">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Core Placement Ready Portfolio certified</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                        Welcome back, Sai Akhil! Your B.Tech Placement Workspace is fully hardened.
                      </h3>
                      
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl text-slate-400">
                        A systematic suite designed strictly for B.Tech CS students. Each tool acts as a dedicated microservice. Select any card below to launch its specific placement-accelerating features.
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <div className="bg-slate-950/60 border border-slate-855 px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-medium text-slate-300">
                          <span className="text-slate-500 mr-1.5 font-sans">Streak:</span>
                          <span className="text-amber-400 font-bold font-mono">🔥 5 Days Active</span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-855 px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-medium text-slate-300">
                          <span className="text-slate-500 mr-1.5 font-sans">Quiz Score:</span>
                          <span className="text-emerald-400 font-black font-mono">Advanced (+100 XP)</span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-855 px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-medium text-slate-305">
                          <span className="text-slate-500 mr-1.5 font-sans">Platform:</span>
                          <span className="text-sky-400 font-extrabold font-mono text-[11px]">Hired AI Enterprise</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elegant Bento Grid of Premium Modules */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Certified Microservices & specific features
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Card 1: Resume PDF Extractor */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5 text-emerald-450" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">Resume PDF Extractor</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Extract structured syntax profiles, historical B.Tech degrees, and code technologies using pdfplumber.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("resume-analyzer")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-emerald-400 rounded-xl border border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Extractor &rarr;
                        </button>
                      </div>

                      {/* Card 2: ATS Similarity Score */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                            <Sparkles className="w-5 h-5 text-sky-450" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">ATS Similarity Score</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Compare your in-memory PDF elements against commercial job specs using real-time TF-IDF similarity.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("ats-calculator")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-sky-450 rounded-xl border border-slate-855 border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Score Matcher &rarr;
                        </button>
                      </div>

                      {/* Card 3: Career Role Matchmaker */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                            <Briefcase className="w-5 h-5 text-amber-450" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">Career Role Matchmaker</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Discover customized job title vectors matching your current engineering stack automatically.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("job-recommender")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-amber-400 rounded-xl border border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Matchmaker &rarr;
                        </button>
                      </div>

                      {/* Card 4: Interview Vocal Coach */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                            <HelpCircle className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">Interview Vocal Coach</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Start voice mock prompts and record responses to analyze pause density metrics.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("interview")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-amber-500 rounded-xl border border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Vocal Coach &rarr;
                        </button>
                      </div>

                      {/* Card 5: AI Placement Tutor */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                            <MessagesSquare className="w-5 h-5 text-sky-400" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">AI Placement Tutor</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Challenge yourself with the live assessment MCQ simulator and consult your virtual FAANG coach.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("chat")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-sky-450 rounded-xl border border-slate-855 border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Tutor Workspace &rarr;
                        </button>
                      </div>

                      {/* Card 6: Adaptive Study Paths */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                            <GraduationCap className="w-5 h-5 text-sky-400" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">Adaptive Study Paths</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Structure the optimal weeks-by-weeks schedule targeting custom algorithmic frameworks.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("roadmap")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-sky-400 rounded-xl border border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Study Paths &rarr;
                        </button>
                      </div>

                      {/* Card 7: RAG Semantic Search */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                            <Database className="w-5 h-5 text-teal-400" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">RAG Semantic Search</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Trigger vector index semantic matches over resume collections and alignment vectors instantly.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("rag")}
                          className="w-full text-center py-2 bg-slate-955/80 bg-slate-950 border text-[10px] font-mono font-bold text-teal-400 rounded-xl border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Search &rarr;
                        </button>
                      </div>

                      {/* Card 8: Microservice Operations */}
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 hover:bg-slate-900 hover:border-slate-800 transition duration-150 flex flex-col justify-between gap-4 shadow-md group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-[#101b1b] text-emerald-400 flex items-center justify-center font-bold border border-emerald-900/30">
                            <Layers className="w-5 h-5 text-emerald-400 animate-pulse" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-100 font-display">Deployment Ingress</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Audit multi-stage compiler builds, proxy routing systems, and verify container endpoints.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("deployment")}
                          className="w-full text-center py-2 bg-slate-950/80 hover:bg-slate-950 text-[10px] font-mono font-bold text-emerald-400 rounded-xl border border-slate-850 transition cursor-pointer select-none"
                        >
                          Launch Operator &rarr;
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Info Notice Banner */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-sky-505/10 bg-sky-500/11 text-sky-400 flex items-center justify-center font-bold shrink-0 font-mono text-xs select-none">
                      i
                    </div>
                    <p className="text-xs text-slate-400">
                      <strong>Pro Tip:</strong> Click the <span className="text-emerald-400 font-bold">"Diagnostics Sandbox"</span> toggle header control at any time to split-screen and check database parameters, physical raw files systems, and terminal connection trackers.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB Roadmap: PHASE 7 ADAPTIVE STUDY ROADMAPS */}
              {activeTab === "roadmap" && (
                <RoadmapGenerator 
                  resumeId={Number(selectedResumeId || 1)}
                  onShowNotice={showNotice}
                  terminalLog={(msg) => setTerminalOutput(prev => prev + msg)}
                />
              )}

              {/* TAB RAG: PHASE 9 RAG VECTOR INDEX ASSISTANT */}
              {activeTab === "rag" && (
                <RagCareerAssistant 
                  onShowNotice={showNotice}
                  terminalLog={(msg) => setTerminalOutput(prev => prev + msg)}
                />
              )}

              {/* TAB Analytics: PHASE 10 DASHBOARD ANALYTICS */}
              {activeTab === "analytics" && (
                <DashboardAnalytics 
                  onShowNotice={showNotice}
                  terminalLog={(msg) => setTerminalOutput(prev => prev + msg)}
                />
              )}

              {/* TAB Deployment: PHASE 11 PRODUCTION DEPLOYMENT & DOCKER COMPOSE */}
              {activeTab === "deployment" && (
                <ProductionDeployment 
                  onShowNotice={showNotice}
                  terminalLog={(msg) => setTerminalOutput(prev => prev + msg)}
                />
              )}

              {/* TAB 0: CAREER MATCHMAKER & PLACEMENT ENGINE */}
              {activeTab === "job-recommender" && (
                <div className="space-y-6">
                  
                  {/* Configuration Controls Card */}
                  <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative">
                    <div className="absolute top-0 right-0 p-4 select-none">
                      <span className="text-[8px] tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded font-mono uppercase font-bold">
                        Phase 5 Placement Matchmaker
                      </span>
                    </div>

                    <div className="space-y-4 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-amber-400" />
                        <h3 className="font-mono font-bold text-sm text-slate-100">Configure Placement Profile Match Search</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Select an extracted resume profile from your database records below. Our multi-dimensional alignment fit algorithm will perform matrix compatibility overlays on trending real-world job roles and generate bridging step tutorials.
                      </p>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">Select Active Resume Dataset</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-mono text-sky-400 focus:border-sky-500 outline-none cursor-pointer transition"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                          >
                            {uploadHistory.length > 0 ? (
                              uploadHistory.map((resEntry: any) => (
                                <option key={resEntry.id} value={resEntry.id}>
                                  ID {resEntry.id}: {resEntry.file_name} ({resEntry.extracted_skills?.length || 0} skills detected)
                                </option>
                              ))
                            ) : (
                              <option value="1">
                                ID 1: {activeResumeAnalysis?.file_name || "sai_akhil_software_engineer.pdf"} ({activeResumeAnalysis?.extracted_skills?.length || 7} skills detected)
                              </option>
                            )}
                          </select>
                        </div>

                        <div className="sm:pt-5">
                          <button
                            type="button"
                            onClick={handleFetchRecommendations}
                            disabled={isLoadingRecommendations}
                            className="w-full py-2.5 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-mono font-extrabold text-xs rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isLoadingRecommendations ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Aligning Profiles...</span>
                              </>
                            ) : (
                              <>
                                <Cpu className="w-3.5 h-3.5" />
                                <span>Analyze Career Path Fits</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curated Recommendations List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        Calculated Placement Vacancies & Compatibility Ratios
                      </span>
                      <span className="text-[10px] font-mono text-amber-500">
                        {recommendationsResult?.recommendations?.length || 0} Vacancies Formulated
                      </span>
                    </div>

                    {recommendationsResult ? (
                      <div className="grid grid-cols-1 gap-4">
                        {recommendationsResult.recommendations.map((job: any, index: number) => {
                          const isExpanded = openCardIndex === index;
                          return (
                            <div 
                              key={job.job_id} 
                              className="bg-[#10172a] rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all duration-300 shadow-md overflow-hidden"
                            >
                              {/* Header Card Row */}
                              <div 
                                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-900/10 transition"
                                onClick={() => setOpenCardIndex(isExpanded ? null : index)}
                              >
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-base font-bold text-white tracking-tight">{job.title}</h4>
                                    <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[9px] font-mono">
                                      {job.company}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                                    <span className="text-slate-500">📍 {job.location}</span>
                                    <span className="text-emerald-400 font-semibold">💰 {job.salary}</span>
                                  </div>
                                </div>

                                {/* Match percentage block */}
                                <div className="flex items-center gap-4 self-end sm:self-auto">
                                  <div className="text-right">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Fit Index Ratio</span>
                                    <div className="flex items-center gap-1.5 justify-end">
                                      <span className={`w-2 h-2 rounded-full ${
                                        job.match_percentage >= 80 
                                          ? "bg-emerald-400" 
                                          : job.match_percentage >= 50 
                                            ? "bg-amber-400" 
                                            : "bg-rose-400"
                                      }`}></span>
                                      <span className={`text-sm font-black font-mono ${
                                        job.match_percentage >= 80 
                                          ? "text-emerald-400" 
                                          : job.match_percentage >= 50 
                                            ? "text-amber-400" 
                                            : "text-rose-400"
                                      }`}>
                                        {job.match_percentage}%
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                                    <span className="text-[9px] font-mono text-sky-400 block px-1">
                                      {isExpanded ? "Collapse Details" : "Examine Gaps"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Panel Details */}
                              {isExpanded && (
                                <div className="border-t border-slate-850 bg-slate-950/40 p-5 space-y-5 select-text selection:bg-slate-850">
                                  
                                  {/* Description Paragraph */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Role Description Summary</span>
                                    <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                                      {job.description}
                                    </p>
                                  </div>

                                  {/* Skills Alignment Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    
                                    {/* Required Skills */}
                                    <div className="bg-[#090d1f] p-3.5 rounded-xl border border-slate-900 space-y-2">
                                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Required Vacancy Stack</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {job.required_skills.map((s: string, idx: number) => (
                                          <span key={idx} className="bg-slate-900 border border-slate-800 text-[10px] px-2 py-0.5 rounded font-mono text-slate-300">
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Matched Skills */}
                                    <div className="bg-[#090d1f] p-3.5 rounded-xl border border-slate-900 space-y-2">
                                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Your Skill Overlaps ({job.matched_skills.length})</span>
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {job.matched_skills.length > 0 ? (
                                          job.matched_skills.map((s: string, idx: number) => (
                                            <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                                              {s}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-[10px] text-slate-600 font-mono block">No skill overlaps recorded.</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Missing Skills */}
                                    <div className="bg-[#090d1f] p-3.5 rounded-xl border border-slate-900 space-y-2">
                                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                                        <BadgeAlert className="w-3 h-3" />
                                        <span>Technology Gaps ({job.missing_skills.length})</span>
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {job.missing_skills.length > 0 ? (
                                          job.missing_skills.map((s: string, idx: number) => (
                                            <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                                              {s}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-[10px] text-emerald-400 font-mono block font-bold">100% Match! Perfect synergy.</span>
                                        )}
                                      </div>
                                    </div>

                                  </div>

                                  {/* Career Roadmaps Bridges steps instructions */}
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                                      Actionable Technology-Gap Bridging Tutorials
                                    </span>
                                    <div className="grid grid-cols-1 gap-2.5">
                                      {job.bridge_roadmaps.map((bridge: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          className="bg-[#090d1f] border border-slate-900 rounded-xl p-3 flex items-start gap-3 transition hover:border-slate-800"
                                        >
                                          <div className="shrink-0 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-mono text-[9px] font-bold uppercase select-none">
                                            {bridge.skill}
                                          </div>
                                          <div className="space-y-0.5">
                                            <span className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">Bridging Roadmap Instruction</span>
                                            <p className="text-xs text-slate-300 leading-normal font-medium first-letter:capitalize">
                                              {bridge.action_step}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-slate-900/20 rounded-xl border border-slate-850/60 font-mono text-xs text-slate-500">
                        No career recommendation structures compiled. Change the active resume profile, then calculate again.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 1: ATS SCORE CALCULATOR & VECTORS OVERLAP */}
              {activeTab === "ats-calculator" && (
                <div className="space-y-6">
                  
                  {/* ATS Panel Grid wrapper */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LHS: Inputs Configuration Controls */}
                    <div className="lg:col-span-5 bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative flex flex-col gap-5 justify-between">
                      <div className="absolute top-0 right-0 p-3 select-none">
                        <span className="text-[8px] tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                          TF-IDF Vector Space Settings
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-sky-405 text-sky-400" />
                            <h3 className="font-semibold text-sm text-slate-200">1. Select Candidate Resume</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            Choose an extracted database record below as the TF similarity query source:
                          </p>
                        </div>

                        {/* Resume Select Selector */}
                        <div className="relative">
                          <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-mono text-sky-405 text-sky-450 focus:border-sky-500 outline-none cursor-pointer transition whitespace-pre"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                          >
                            {uploadHistory.length > 0 ? (
                              uploadHistory.map((resEntry: any) => (
                                <option key={resEntry.id} value={resEntry.id} className="bg-slate-950 text-slate-300">
                                  ID {resEntry.id}: {resEntry.file_name} ({resEntry.extracted_skills?.length || 0} skills)
                                </option>
                              ))
                            ) : (
                              <option value="1" className="bg-slate-950 text-slate-300">
                                ID 1: {activeResumeAnalysis?.file_name || "sai_akhil_software_engineer.pdf"} ({activeResumeAnalysis?.extracted_skills?.length || 7} skills detected)
                              </option>
                            )}
                          </select>
                        </div>

                        {/* Interactive drag-and-drop real PDF file matcher dropzone */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 py-0.5 justify-center select-none">
                            <span className="h-px bg-slate-800/60 flex-1"></span>
                            <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">OR DIRECT UPLOAD NEW PDF</span>
                            <span className="h-px bg-slate-800/60 flex-1"></span>
                          </div>

                          <div 
                            className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 relative ${
                              atsPdfDragActive 
                                ? "border-sky-400 bg-sky-950/20" 
                                : "border-slate-800 bg-slate-950/30 hover:border-slate-600 hover:bg-slate-950/70"
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setAtsPdfDragActive(true);
                            }}
                            onDragLeave={() => setAtsPdfDragActive(false)}
                            onDrop={async (e) => {
                              e.preventDefault();
                              setAtsPdfDragActive(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                await handleAtsPdfUploadAndExtract(e.dataTransfer.files[0]);
                              }
                            }}
                            onClick={() => {
                              const fileInputRef = document.getElementById("ats-pdf-file-selector");
                              if (fileInputRef) fileInputRef.click();
                            }}
                          >
                            <input 
                              id="ats-pdf-file-selector"
                              type="file" 
                              accept=".pdf,application/pdf" 
                              className="hidden" 
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  await handleAtsPdfUploadAndExtract(e.target.files[0]);
                                }
                              }}
                            />
                            <UploadCloud className={`w-8 h-8 ${atsPdfParsingStatus ? "text-amber-400 animate-bounce" : "text-sky-400 animate-pulse"}`} />
                            
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-bold text-slate-100">
                                {atsPdfParsingStatus ? "Active Parser Running..." : "Upload Real PDF Resume File"}
                              </p>
                              <p className="text-[9px] text-slate-400 leading-none">
                                {atsPdfParsingStatus || "Drag and drop your PDF here, or click to browse"}
                              </p>
                            </div>
                            
                            {atsPdfParsingStatus && (
                              <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center gap-2 p-3 z-10 transition-opacity">
                                <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" />
                                <span className="text-[9px] text-sky-300 font-mono font-bold animate-pulse text-center leading-relaxed px-2">
                                  {atsPdfParsingStatus}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Preset JDs loader shortcuts */}
                        <div className="space-y-2 pt-1 border-t border-slate-900">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">Load Placement Profile Presets</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setJobDescriptionText(
                                  "We are hiring a Junior FastAPI Backend Developer to build scalable enterprise APIs. Required tech stack:\n" +
                                  "- Strong coding experience in Python, FastAPI, and SQL.\n" +
                                  "- Database knowledge of postgreSQL or PostgreSQL relational services.\n" +
                                  "- Microservices deployment using Docker, GCP or Docker containers, and Git commands."
                                );
                                showNotice("FastAPI Placement Profile preset loaded!");
                              }}
                              className="text-left px-2.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 hover:text-sky-300 transition flex flex-col justify-between select-none cursor-pointer"
                            >
                              <span className="font-bold text-sky-400">FastAPI Developer</span>
                              <span className="text-[8px] text-slate-500 font-mono mt-0.5">Python, SQL, PostgreSQL, Docker</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setJobDescriptionText(
                                  "Seeking a Full Stack Software Engineer fluent in modern client interfaces. Required key qualifications:\n" +
                                  "- Exceptional building of responsive UIs in React and TypeScript packages.\n" +
                                  "- Competent in designing CSS style matrices using Tailwind CSS utility classes.\n" +
                                  "- Background managing client-side key state and state-dependent caching systems."
                                );
                                showNotice("Full Stack React Placement Profile preset loaded!");
                              }}
                              className="text-left px-2.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 hover:text-sky-300 transition flex flex-col justify-between select-none cursor-pointer"
                            >
                              <span className="font-bold text-emerald-400">Full Stack React</span>
                              <span className="text-[8px] text-slate-500 font-mono mt-0.5">React, TypeScript, Tailwind, CSS</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-slate-200">2. Target Job Description</h3>
                            <button
                              onClick={() => {
                                setJobDescriptionText("");
                                showNotice("Job description input box cleared.");
                              }}
                              className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                            >
                              Clear Text
                            </button>
                          </div>
                          
                          <textarea
                            className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500 leading-relaxed font-mono"
                            placeholder="Paste the employer's job description here (e.g. FastAPI, SQL, React, etc.)..."
                            value={jobDescriptionText}
                            onChange={(e) => setJobDescriptionText(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Score Action Button */}
                      <button
                        type="button"
                        onClick={handleCalculateAts}
                        disabled={isCalculatingAts}
                        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-2 select-none cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50"
                      >
                        {isCalculatingAts ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Calculating Similarities...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Evaluate ATS Similarity Score</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* RHS: Visualization Indicators & Gaps Dashboard */}
                    <div className="lg:col-span-7 bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
                      
                      {atsScoreResult ? (
                        <div className="space-y-5">
                          
                          {/* Radial Progress & Rating Indicator */}
                          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-900/80 shadow-inner">
                            
                            {/* Circle score ring SVG */}
                            <div className="relative w-32 h-32 flex items-center justify-center bg-slate-950 rounded-full border border-slate-850">
                              <svg className="w-28 h-28 transform -rotate-90">
                                <circle cx="56" cy="56" r="46" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                                <circle 
                                  cx="56" 
                                  cy="56" 
                                  r="46" 
                                  className={`${
                                    atsScoreResult.score >= 80 
                                      ? "stroke-emerald-500" 
                                      : atsScoreResult.score >= 60 
                                        ? "stroke-sky-500" 
                                        : "stroke-amber-500"
                                  } transition-all duration-1000`} 
                                  strokeWidth="7" 
                                  fill="transparent"
                                  strokeDasharray={2 * Math.PI * 46}
                                  strokeDashoffset={2 * Math.PI * 46 * (1 - (atsScoreResult.score || 0) / 100)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-2xl font-black ${
                                  atsScoreResult.score >= 80 
                                    ? "text-emerald-400" 
                                    : atsScoreResult.score >= 60 
                                      ? "text-sky-400" 
                                      : "text-amber-400"
                                } tracking-tighter`}>
                                  {atsScoreResult.score}%
                                </span>
                                <span className="text-[7.5px] text-slate-500 uppercase font-mono tracking-wider font-bold">
                                  Score Index
                                </span>
                              </div>
                            </div>

                            {/* Status label blocks */}
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">Similarity Category Rating</span>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded border ${
                                    atsScoreResult.score >= 80 
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                                      : atsScoreResult.score >= 60 
                                        ? "bg-sky-500/10 text-sky-400 border-sky-500/20" 
                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  }`}>
                                    {atsScoreResult.score >= 80 
                                      ? "EXCELLENT PLACEMENT SYNERGY" 
                                      : atsScoreResult.score >= 60 
                                        ? "STRONG FIT • BOOST RECOMMENDED" 
                                        : "CRITICAL REFINEMENT ADVISED"}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                {atsScoreResult.score >= 80 
                                  ? "Excellent alignment! Your resume features nearly all high-priority technical terms parsed from the profile. You're set for corporate placement rounds." 
                                  : atsScoreResult.score >= 60 
                                    ? "Strong core matched. Enhance your metrics score by integrating standard technological stop words and key frameworks from recommendations." 
                                    : "Major skill blocks are missing. We recommand integrating missing keywords and updating CV sections to pass preliminary screening algorithms."}
                              </p>
                            </div>

                          </div>

                          {/* Skill Gap Analysis Gaps Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Matched skills */}
                            <div className="bg-[#090d1f] p-4 rounded-xl border border-slate-900/60 shadow-inner space-y-2.5">
                              <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider font-bold">Matched Technology Skills ({atsScoreResult.skill_gap?.matched_skills?.length || 0})</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5">
                                {atsScoreResult.skill_gap?.matched_skills?.length > 0 ? (
                                  atsScoreResult.skill_gap.matched_skills.map((s: string, idx: number) => (
                                    <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-0.5 select-none hover:bg-emerald-500/20 transition duration-150">
                                      <span>{s}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-600 block pl-1">No matching words detected.</span>
                                )}
                              </div>
                            </div>

                            {/* Missing skills */}
                            <div className="bg-[#090d1f] p-4 rounded-xl border border-slate-900/60 shadow-inner space-y-2.5">
                              <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                                <BadgeAlert className="w-3.5 h-3.5 text-rose-450 text-rose-400" />
                                <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider font-bold text-rose-350">Missing Tech Highlights ({atsScoreResult.skill_gap?.missing_skills?.length || 0})</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5">
                                {atsScoreResult.skill_gap?.missing_skills?.length > 0 ? (
                                  atsScoreResult.skill_gap.missing_skills.map((s: string, idx: number) => (
                                    <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-0.5 select-none hover:bg-rose-500/20 transition duration-150">
                                      <span>{s}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] font-mono text-emerald-400 block pl-1">Perfect score! No skill gaps remaining.</span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* TF-IDF Salient keyword frequencies comparisons map */}
                          <div className="space-y-2 select-text selection:bg-slate-800">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">Salient Term Weightings: Candidate vs Job Specification</span>
                            <div className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden shadow-inner">
                              <div className="grid grid-cols-3 bg-[#0a0f24] p-2.5 border-b border-slate-900/80 text-[9px] font-mono uppercase font-bold text-slate-400">
                                <span>Salient Keyword</span>
                                <span className="text-center">Candidate Resume Hits</span>
                                <span className="text-right">Required Job Hits</span>
                              </div>
                              <div className="divide-y divide-slate-950 font-mono max-h-[120px] overflow-y-auto">
                                {atsScoreResult.keyword_frequencies?.length > 0 ? (
                                  atsScoreResult.keyword_frequencies.map((item: any, idx: number) => (
                                    <div key={idx} className="grid grid-cols-3 px-3 py-2 text-[10px] text-slate-300 hover:bg-slate-900/40 transition">
                                      <span className="font-bold text-slate-205 text-slate-100">{item.keyword}</span>
                                      <span className="text-center font-bold text-teal-400">{item.resume_frequency}</span>
                                      <span className="text-right font-bold text-sky-400">{item.job_frequency}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-[10px] text-slate-600 text-center">No vocabulary occurrences recorded.</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Suggested Optimization Boosters */}
                          <div className="bg-[#0f172a]/20 p-4 border border-slate-850 rounded-xl space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Placement Officers Advice: CV Boost Steps</span>
                            <ul className="list-disc pl-4 text-[10px] text-slate-450 text-slate-400 space-y-1.5 leading-relaxed font-sans">
                              {atsScoreResult.suggested_improvements?.length > 0 ? (
                                atsScoreResult.suggested_improvements.map((improvement: string, idx: number) => (
                                  <li key={idx} className="marker:text-sky-500 font-medium">
                                    {improvement}
                                  </li>
                                ))
                              ) : (
                                <li className="marker:text-emerald-500 text-emerald-450 font-bold">Your CV template is ideal for automated scans! Proceed with confidence.</li>
                              )}
                            </ul>
                          </div>

                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-2">
                          <Sparkles className="w-10 h-10 text-slate-700 animate-pulse" />
                          <h3 className="text-sm font-bold text-slate-350 text-slate-300">Similarity Metrics Pending</h3>
                          <p className="text-xs text-slate-500 max-w-sm leading-normal">
                            Choose or write a destination job profile then press **"Evaluate ATS Similarity Score"** to execute advanced vector algebra matching overlays in-memory on the server.
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* UNDER THE HOOD: TF-IDF MATH EXPLAINER CARD */}
                  <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                    <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-semibold text-sm text-slate-100 font-mono">Academic Placement Mechanics: Vector Space Calculations</h4>
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[#6366f1] uppercase font-bold bg-[#6366f1]/10 px-2.5 py-0.5 rounded border border-[#6366f1]/20 select-none">
                        TF-IDF & Cosine Similarity Equations
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Employers utilize NLP parsers during screening. To secure interviews, Akhil must understand how terms are mathematically scored against document corpora rather than simply stuffing raw lines.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1.5">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-2 font-mono">
                        <div>
                          <span className="text-[9px] text-[#6366f1] uppercase font-bold block pb-1 border-b border-slate-900/80 mb-2">1. Term Frequency (TF)</span>
                          <span className="text-xs font-bold text-slate-200 block text-center py-2">
                            tf(t, d) = f_t_d / ∑(f_w_d)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          Calculates the weight of word <code className="text-sky-400">t</code> by dividing its frequency by total tokens in document <code className="text-emerald-400">d</code>. Normalizes long resumes.
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-2 font-mono">
                        <div>
                          <span className="text-[9px] text-teal-400 uppercase font-bold block pb-1 border-b border-slate-900/80 mb-2">2. Inverse Document Frequency (IDF)</span>
                          <span className="text-xs font-bold text-slate-200 block text-center py-2">
                            idf(t) = ln( (1 + N) / (1 + df(t)) ) + 1
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          Measures term specificity across a database corpus of size <code className="text-sky-400">N</code>. Ensures common terms like 'the' are heavily penalised, raising weights of real skills.
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-2 font-mono">
                        <div>
                          <span className="text-[9px] text-emerald-400 uppercase font-bold block pb-1 border-b border-slate-900/80 mb-2">3. Cosine Vector Similarity</span>
                          <span className="text-xs font-bold text-slate-200 block text-center py-2 font-mono">
                            cos(θ) = A · B / (||A|| · ||B||)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          Determines the cosine of the angle between multidimensional vectors <code className="text-sky-400">A</code> (CV) and <code className="text-emerald-400">B</code> (JD). Purely measures tag direction alignment.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1e1b4b]/20 p-3 border border-[#4338ca]/30 rounded-xl">
                      <span className="text-[9px] tracking-wide text-indigo-300 font-bold block font-mono">Technical Placement Viva Cheat Sheet:</span>
                      <p className="text-[11px] text-slate-400 leading-snug font-sans mt-1">
                        Explain: "Cosine Similarity handles sparse dimension arrays seamlessly because its denominator divides by Euclidean norm vectors. This isolates pure structural overlap, ignoring filler sentences entirely." Perfect answer for final placement selectors!
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Resume Scanning Sandbox */}
              {activeTab === "resume-analyzer" && (
                <div className="space-y-6">
                  
                  {/* Left Column Input, Right parsed results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Sandbox Input Area */}
                    <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative flex flex-col justify-between">
                      <div className="absolute top-0 right-0 p-3">
                        <span className="text-[8px] tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                          PDF Stream Upload / Pasted Text Matcher
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <UploadCloud className="w-4 h-4 text-sky-400" />
                          <h3 className="font-semibold text-sm text-slate-200">REST Client: Scanning Sandbox</h3>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Paste raw resume layout tokens or modify mock CV parameters below to visualize how Python extraction heuristics parse data fields.
                        </p>
                      </div>

                      <form onSubmit={handleAnalyzeResume} className="space-y-3 pt-2">
                        {/* Interactive drag-and-drop real PDF file parser dropzone */}
                        <div 
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 relative ${
                            pdfDragActive 
                              ? "border-sky-450 bg-sky-950/20 border-sky-400" 
                              : "border-slate-805 bg-slate-950/40 border-slate-800 hover:border-slate-600 hover:bg-slate-950/80"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setPdfDragActive(true);
                          }}
                          onDragLeave={() => setPdfDragActive(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setPdfDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              await handlePdfUploadAndExtract(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => {
                            const fileInputRef = document.getElementById("pdf-file-selector");
                            if (fileInputRef) fileInputRef.click();
                          }}
                        >
                          <input 
                            id="pdf-file-selector"
                            type="file" 
                            accept=".pdf,application/pdf" 
                            className="hidden" 
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                await handlePdfUploadAndExtract(e.target.files[0]);
                              }
                            }}
                          />
                          <UploadCloud className={`w-10 h-10 ${pdfParsingStatus ? "text-amber-400 animate-bounce" : "text-sky-400 animate-pulse"}`} />
                          
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-100">
                              {pdfParsingStatus ? "Active Parser Running" : "Upload Real PDF Resume File"}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {pdfParsingStatus || "Drag and drop your PDF here, or click to browse files"}
                            </p>
                          </div>
                          
                          {pdfParsingStatus && (
                            <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center gap-2 p-3 z-10 transition-opacity">
                              <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
                              <span className="text-[10px] text-sky-300 font-mono font-bold animate-pulse text-center">
                                {pdfParsingStatus}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono font-semibold mb-1">Simulated File Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                            value={simulationFileName}
                            onChange={(e) => setSimulationFileName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono font-semibold mb-1">CV Content Matrix (Pasted plain text)</label>
                          <textarea 
                            rows={10}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:border-sky-500 focus:outline-none leading-relaxed"
                            value={pastedResumeText}
                            onChange={(e) => setPastedResumeText(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isAnalyzing}
                          className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-lg select-none cursor-pointer"
                        >
                          {isAnalyzing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Dispatch Parse (pdfplumber heuristic backend)</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Parser Heuristics Output bento columns */}
                    <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative flex flex-col justify-between">
                      <div className="absolute top-0 right-0 p-3">
                        <span className="text-[8px] tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">
                          Relational Database SQL Entity
                        </span>
                      </div>

                      <div className="mb-4 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <h3 className="font-semibold text-sm text-slate-200">Extracted Structured Model</h3>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          File: {activeResumeAnalysis?.file_name || "Scanning results..."} (ID: {activeResumeAnalysis?.id || "N/A"})
                        </span>
                      </div>

                      {activeResumeAnalysis ? (
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[360px] pr-1">
                          {/* Bento 1: Technologies Category parsing results */}
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
                              1. Classified Core Technologies
                            </span>
                            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-900">
                              {activeResumeAnalysis.extracted_skills?.length > 0 ? (
                                activeResumeAnalysis.extracted_skills.map((s: string, idx: number) => (
                                  <span key={idx} className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/40">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500 font-mono pl-1">No technologies detected. Enter tech stack in text grid.</span>
                              )}
                            </div>
                          </div>

                          {/* Bento 2: Extracted Credentials Education */}
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                              2. Academic Credentials (Education)
                            </span>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 divide-y divide-slate-900 space-y-2">
                              {activeResumeAnalysis.extracted_education?.map((edu: any, idx: number) => (
                                <div key={idx} className="pt-2 first:pt-0  space-y-1">
                                  <div className="text-xs font-semibold text-slate-205 text-slate-250 text-slate-300 leading-snug">
                                    {edu.institution || "Unspecified University"}
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded text-[9px]">{edu.degree || "B.Tech"}</span>
                                    <span className="flex items-center gap-1 text-[9px]">
                                      <Calendar className="w-2.5 h-2.5 text-slate-500" />
                                      {edu.year || "Ongoing"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bento 3: Project summary heuristics */}
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                              3. Extracted Academic Projects
                            </span>
                            <div className="space-y-2">
                              {activeResumeAnalysis.extracted_projects?.map((proj: any, idx: number) => (
                                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1.5">
                                  <div className="text-xs font-bold text-slate-200">{proj.title}</div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                                    {proj.description || "Parsed project architecture content."}
                                  </p>
                                  <div className="flex flex-wrap gap-1 pt-1.5">
                                    {proj.technologies?.map((tech: string, tIdx: number) => (
                                      <span key={tIdx} className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-900/60 flex flex-col items-center justify-center text-center py-12 gap-3 flex-1">
                          <AlertCircle className="w-8 h-8 text-slate-700 font-semibold animate-pulse" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">NO_COMMITTED_RESUMES</h4>
                            <p className="text-[11px] text-slate-550 text-slate-500 max-w-sm">
                              No parsed models found. Paste resume parameters inside sandbox on the left to invoke parsing microservices.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Resume Upload relational tables logs history tracker */}
                  <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <Layers2 className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <div>
                          <h3 className="font-semibold text-sm text-slate-200">Relational Database Table: resumes</h3>
                          <span className="text-[10.5px] text-slate-400 md:inline block leading-relaxed">
                            Historically scanned elements stored inside PostgreSQL databases belonging to Akhil.
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={fetchHistory}
                        className="text-xs text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Table</span>
                      </button>
                    </div>

                    {isLoadingHistory ? (
                      <div className="flex justify-center items-center py-6">
                        <RefreshCw className="w-6 h-6 animate-spin text-slate-500" />
                      </div>
                    ) : uploadHistory.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadHistory.map((h: any) => {
                          const isCurrentlySelected = activeResumeAnalysis?.id === h.id;
                          return (
                            <div 
                              key={h.id}
                              onClick={() => {
                                setActiveResumeAnalysis(h);
                                setSimulationFileName(h.file_name);
                                setPastedResumeText(h.raw_text);
                                showNotice(`Switched detail inspector to: ${h.file_name}`);
                              }}
                              className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden group ${
                                isCurrentlySelected 
                                  ? "bg-sky-500/10 border-sky-400 shadow" 
                                  : "bg-slate-950 border-slate-900 hover:border-slate-800"
                              }`}
                            >
                              <div className="absolute top-0 right-0 p-2">
                                <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                                  isCurrentlySelected ? "bg-sky-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-500"
                                }`}>
                                  ID: {h.id}
                                </span>
                              </div>

                              <div className="flex items-start gap-2.5 pr-8">
                                <FileText className={`w-5 h-5 shrink-0 ${isCurrentlySelected ? "text-sky-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-200 truncate max-w-[130px]" title={h.file_name}>
                                    {h.file_name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    Parsed: {new Date(h.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="flex gap-1.5 pt-1">
                                    <span className="text-[9px] text-emerald-400 bg-emerald-950/20 leading-none px-1 py-0.5 rounded font-mono">
                                      {h.extracted_skills?.length || 0} skills
                                    </span>
                                    <span className="text-[9px] text-indigo-400 bg-indigo-950/20 leading-none px-1 py-0.5 rounded font-mono">
                                      {h.extracted_projects?.length || 0} projects
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-6 rounded-xl border border-slate-900 flex justify-center items-center text-slate-500 text-xs py-8">
                        No resumes parsed in history. Process a past text parameters above to register data.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: System Architecture PDF Flow */}
              {activeTab === "architecture" && (
                <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                  <div>
                    <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                      <Layers3 className="w-5 h-5 text-indigo-400" />
                      <span>Phase 3: Interactive Extraction System Pipeline</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl mt-1">
                      Understand how uploaded binary streams map to sanitized relational variables. This diagram matches the exact execution flow of `/backend/app/api/v1/endpoints/resume.py`.
                    </p>
                  </div>

                  {/* Flow chart diagram blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    
                    {/* Block 1 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2 h-full justify-between">
                      <span className="text-[9px] text-slate-500 font-mono uppercase">Step 1: Input</span>
                      <UploadCloud className="w-7 h-7 text-sky-400" />
                      <div className="text-xs font-bold text-slate-200">PDF Document Bytes</div>
                      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                        Client sends multi-part stream with Bearer authorization credentials.
                      </p>
                    </div>

                    {/* Block 1 to 2 connector */}
                    <div className="hidden md:flex justify-center items-center text-slate-700">
                      <ChevronRight className="w-6 h-6 animate-pulse text-indigo-500" />
                    </div>

                    {/* Block 2 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2 h-full justify-between">
                      <span className="text-[9px] text-slate-500 font-mono uppercase">Step 2: Stream Parser</span>
                      <FileText className="w-7 h-7 text-indigo-400" />
                      <div className="text-xs font-bold text-slate-200">pdfplumber Extract</div>
                      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                        FastAPI loads chunks in-memory. Runs `pdf.pages` strings extraction loop on standard host memory buffers.
                      </p>
                    </div>

                    {/* Block 2 to 3 connector */}
                    <div className="hidden md:flex justify-center items-center text-slate-700">
                      <ChevronRight className="w-6 h-6 animate-pulse text-indigo-500" />
                    </div>

                    {/* Block 3 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2 h-full justify-between">
                      <span className="text-[9px] text-slate-500 font-mono uppercase">Step 3: Classifier</span>
                      <Cpu className="w-7 h-7 text-amber-400" />
                      <div className="text-xs font-bold text-slate-200">Regex Classifier NLP</div>
                      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                        Matching dictionaries detect tech stacks (FastAPI, React), degree targets, and projects segments.
                      </p>
                    </div>

                    {/* Block 3 to 4 connector */}
                    <div className="hidden md:flex justify-center items-center text-slate-700">
                      <ChevronRight className="w-6 h-6 animate-pulse text-indigo-500" />
                    </div>

                    {/* Block 4 */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2 h-full justify-between">
                      <span className="text-[9px] text-slate-500 font-mono uppercase">Step 4: SQL Store</span>
                      <Database className="w-7 h-7 text-emerald-400" />
                      <div className="text-xs font-bold text-slate-200">PostgreSQL commits</div>
                      <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                        SQLAlchemy converts collections to JSON structures inside the `resumes` relational database index.
                      </p>
                    </div>

                  </div>

                  {/* Flow chart description details */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900/60 leading-relaxed text-xs text-slate-400 space-y-2">
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">Why this architecture scores high in Technical Placement Assessments:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400">
                      <li>**In-Memory Buffer Stream Processing**: The file stream is evaluated directly via `file.file` instead of using expensive disk read/writes, which keeps execution lightning fast.</li>
                      <li>**Relational JSON storage indices**: Saving technology listings inside PostgreSQL `JSON` properties allows robust metadata queries without complex join operations.</li>
                      <li>**Custom Lookahead Regular Expressions**: Safeguards special characters (like C++) from triggering standard regex boundary errors.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: Python Code Explorer */}
              {activeTab === "files" && (
                <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl flex-1 flex flex-col justify-between">
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-semibold text-base text-slate-200">Active Technical Milestones Directories</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Preview live active files compiled successfully on disk. Click filenames on the left to review their structure.
                    </p>
                  </div>

                  {isLoadingFiles ? (
                    <div className="flex-1 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      
                      {/* Filenames list subpanel */}
                      <div className="lg:col-span-2 space-y-1.5 overflow-y-auto max-h-[460px] pr-1 border-r border-slate-800/40">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-550 block mb-2 px-1 text-slate-500 font-bold">Active Scripts</span>
                        {files.map((file, idx) => {
                          const isSelected = idx === selectedFileIndex;
                          const isSelectedModule3 = file.path.includes("resume") || file.path.includes("parser");
                          return (
                            <button
                              key={file.path}
                              onClick={() => setSelectedFileIndex(idx)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold" 
                                  : "border border-transparent text-slate-400 hover:bg-slate-900/60"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Code2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                                <span className="truncate">{file.path.split("/").pop()}</span>
                              </div>
                              {isSelectedModule3 && (
                                <span className="text-[8px] uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded shrink-0">
                                  P3 Model
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* File Contents visualization panel */}
                      <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-900 p-4 flex flex-col justify-between h-[480px]">
                        <div className="flex items-center justify-between border-b border-slate-900/80 pb-2 mb-2">
                          <span className="text-[10px] font-mono text-slate-400 truncate">
                            {files[selectedFileIndex]?.path}
                          </span>
                          <button
                            onClick={() => copyToClipboard(files[selectedFileIndex]?.content || "", files[selectedFileIndex]?.path)}
                            className="bg-slate-900 hover:bg-slate-850 px-2 py-1 text-[10px] text-emerald-400 rounded border border-emerald-500/10 flex items-center gap-1.5 transition select-none cursor-pointer"
                          >
                            {copiedPath === files[selectedFileIndex]?.path ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <ClipboardCheck className="w-3 h-3 text-emerald-500" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="text-[10px] font-mono text-slate-400 overflow-auto flex-1 p-2 bg-slate-950/60 rounded shadow-inner leading-relaxed pr-1 select-text selection:bg-slate-800">
                          <code>
                            {files[selectedFileIndex]?.content || "// Secure parsing pipeline setup ready on server."}
                          </code>
                        </pre>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Database & SQL Terminal inspector */}
              {activeTab === "endpoints" && (
                <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-semibold text-base text-slate-205 text-slate-100 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-rose-500" />
                      <span>Interactive SQL CLI & Docker Container Terminal</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Verify that your tables and compose layers are successfully synchronized! Click actions triggers below to execute simulated REST queries directly inside terminal streams:
                    </p>
                  </div>

                  {/* REST Triggers buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => executeConsoleCommand("curl -i http://localhost:8000/api/v1/resume/history")}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 text-slate-300 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-sky-400" />
                        <span>Query history endpoints</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      onClick={() => executeConsoleCommand("psql -h localhost -U postgres -d ai_career_coach -c '\\d resumes'")}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 text-slate-300 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect table schemas</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      onClick={() => executeConsoleCommand("docker ps")}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 text-slate-300 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-rose-400" />
                        <span>Docker compose status</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  {/* Terminal visualizing panel inside SQL */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between h-[300px]">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
                      <span>Relational Database Client Log Output Stream</span>
                    </div>

                    <pre className="text-[10px] font-mono text-sky-400 overflow-auto flex-1 select-all hover:bg-slate-950/80 p-2 rounded shadow-inner leading-relaxed pr-1 select-text">
                      <code>{terminalOutput}</code>
                    </pre>

                    <div className="flex justify-between items-center border-t border-slate-900 pt-2 mt-2">
                      <span className="text-[9px] text-slate-500 font-mono">postgres@localhost:5432/ai_career_coach</span>
                      <button 
                        onClick={() => setTerminalOutput("// Buffer logs flushed.")}
                        className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear terminal windows
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Placement Study Lounge Flashcards */}
              {activeTab === "interview" && (
                <div className="space-y-6">
                  {/* Phase 6 Main Simulated Interview Panel */}
                  <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                    <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-amber-500 animate-pulse" />
                          <span>AI Board Placement Assessment Simulator</span>
                          <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                            Phase 6 Active
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Test your readiness under elite CTO scrutiny. Generates multi-round technical and STAR-method adaptive board placement questions modeled directly on your parsed resume records.
                        </p>
                      </div>

                      {interviewActive && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 font-mono font-semibold">
                            Progress:
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3].map((r) => (
                              <div
                                key={r}
                                className={`w-6 h-2 rounded-full transition-all ${
                                  r < interviewRound
                                    ? "bg-emerald-500"
                                    : r === interviewRound
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-slate-800"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SETUP MODE: Choose role and start */}
                    {!interviewActive && !lastInterviewReport && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                              Select Targeted Placement Role
                            </label>
                            <select
                              value={interviewRole}
                              onChange={(e) => setInterviewRole(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                            >
                              <option value="FastAPI Backend Developer">FastAPI Backend Developer (Stripe preset)</option>
                              <option value="Frontend React Architect">Frontend React Architect (Vercel preset)</option>
                              <option value="Full Stack Software Engineer">Full Stack Software Engineer (Linear preset)</option>
                              <option value="Cloud DevOps Orchestrator">Cloud DevOps Orchestrator (HashiCorp preset)</option>
                              <option value="Generative AI Systems Engineer">Generative AI Systems Engineer (Hugging Face preset)</option>
                              <option value="Data Platform Specialist">Data Platform Specialist (Snowflake preset)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                              Select Interview Evaluation Format
                            </label>
                            <select
                              value={interviewType}
                              onChange={(e) => setInterviewType(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                            >
                              <option value="Behavioral (STAR method)">Behavioral (STAR method metrics validation)</option>
                              <option value="System Design & Scalability">System Design & Scalability architecture evaluation</option>
                              <option value="Technical Coding & Algorithms">Technical Coding & Core data structures evaluation</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-2">
                          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Simulated Placement Board Instructions</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-normal">
                            Once started, the AI panels will deliver a set of 3 questions tailored to your resume's extraction tokens and target vacancy guidelines. Each answer is scored based on linguistic posture, technical fidelity, and frameworks. After 3 rounds of interactions, an evaluation report card is formulated!
                          </p>
                        </div>

                        <button
                          onClick={handleStartInterview}
                          disabled={isStartingInterview}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 cursor-pointer select-none"
                        >
                          {isStartingInterview ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Structuring Simulated Interview Board...</span>
                            </>
                          ) : (
                            <>
                              <Cpu className="w-4 h-4" />
                              <span>Begin AI Placement Board Interview</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* ACTIVE MODE: Answer interviewer questions */}
                    {interviewActive && (
                      <div className="space-y-5">
                        {/* Live Audio-Video Proctoring Frame */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                            Live Mock Placement Video Proctoring & Frame Calibration (Continuous Feed)
                          </label>
                          <InterviewVideoProctor 
                            onShowNotice={showNotice}
                            interviewActive={interviewActive}
                            interviewRole={interviewRole}
                            currentQuestion={currentInterviewQuestion || ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">
                              Round {interviewRound} of 3
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-medium">
                              Role: {interviewRole}
                            </span>
                          </div>

                          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-15">
                              <Cpu className="w-20 h-20 text-amber-400" />
                            </div>
                            <span className="text-[9px] font-mono text-amber-500 uppercase font-bold block mb-1">
                              Interviewer:
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed select-text">
                              {currentInterviewQuestion || "Initializing query parameter..."}
                            </p>
                          </div>
                        </div>

                        {/* PHASE 8: Integrate real-time speech synthesis readout & speech to text dictation + voice quality diagnostics */}
                        <div className="bg-slate-950/25 border border-slate-800 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 pt-2 pr-2.5">
                            <span className="text-[8px] tracking-widest font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase animate-pulse select-none">
                              Voice interactive mode
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <h4 className="font-mono font-bold text-xs text-slate-200">Vocal Coach Diagnostics (Acoustic Unit)</h4>
                          </div>
                          <VoiceMockHelper
                            currentQuestion={currentInterviewQuestion || ""}
                            candidateAnswer={candidateAnswerInput}
                            onUpdateAnswer={(val) => setCandidateAnswerInput(val)}
                            onShowNotice={showNotice}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                            Your Draft Answer Response
                          </label>
                          <textarea
                            value={candidateAnswerInput}
                            onChange={(e) => setCandidateAnswerInput(e.target.value)}
                            disabled={isSubmittingInterview}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 outline-none focus:border-amber-500/50 resize-none font-sans placeholder-slate-500 leading-relaxed"
                            placeholder="Formulate your response here. For behavioral focus, utilize STAR mechanics: Situation/Task, Actions, and measurable Business Results. For engineering focus, cite database parameters, microservice indices, or exact API decorators..."
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSubmitInterviewResponse}
                            disabled={isSubmittingInterview || !candidateAnswerInput.trim()}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/5 cursor-pointer"
                          >
                            {isSubmittingInterview ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Grading and Compiling Evaluates...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Submit Draft to Panel Evaluation</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleResetInterview}
                            disabled={isSubmittingInterview}
                            className="px-4 py-3 border border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            Quit Session
                          </button>
                        </div>
                      </div>
                    )}

                    {/* EVALUATION REPORT STATE */}
                    {lastInterviewReport && (
                      <div className="space-y-6">
                        {/* Summary Header Cards */}
                        <div className="p-5 bg-gradient-to-br from-amber-500/5 to-slate-950 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 font-sans">
                          <div className="space-y-1.5 text-center md:text-left">
                            <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold block">
                              Executive Placement Fit Report
                            </span>
                            <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                              Simulated Board Review Compiled
                            </h4>
                            <p className="text-xs text-slate-400 max-w-md">
                              Evaluated for target role <strong className="text-slate-200">{interviewRole}</strong>. Here is your structured competency dashboard based on our multi-round simulation.
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                            <div className="text-center">
                              <span className="text-[9px] text-slate-500 uppercase font-mono block">Composite Score</span>
                              <strong className="text-2xl sm:text-3xl text-amber-400 font-bold tracking-tight">
                                {Math.round(
                                  lastInterviewReport.reduce((acc: number, r: any) => acc + r.score, 0) /
                                    lastInterviewReport.length
                                )}
                                <span className="text-xs text-slate-500 font-normal"> /100</span>
                              </strong>
                            </div>
                            <div className="w-px h-10 bg-slate-800" />
                            <div className="text-center">
                              <span className="text-[9px] text-slate-500 uppercase font-mono block">Status Level</span>
                              <span className="text-xs font-semibold text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block mt-1">
                                {lastInterviewReport[2]?.verbal_grade || "Highly Synergized"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Round Breakdown */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">
                            Interactive Round Breakdown Logs
                          </h4>

                          {lastInterviewReport.map((roundData: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 rounded-xl border border-slate-900 p-5 space-y-4 font-sans">
                              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                  <span className="w-5 h-5 bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold rounded-full font-mono">
                                    {idx + 1}
                                  </span>
                                  <span>Round {idx + 1} Evaluation</span>
                                </span>
                                <span className="text-xs bg-slate-900 border border-slate-850 text-amber-400 font-bold font-mono px-2.5 py-1 rounded">
                                  Score: {roundData.score}/100
                                </span>
                              </div>

                              <div className="space-y-2 text-xs">
                                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Question Asked:</div>
                                <p className="text-slate-300 italic">"{roundData.question}"</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                                <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-900 leading-relaxed font-sans">
                                  <strong className="text-amber-400/80 font-mono text-[9px] uppercase tracking-wider block">
                                    Linguistic Output & Communication Posture:
                                  </strong>
                                  <p className="text-[11px] text-slate-300">
                                    {roundData.communication_style_evaluation}
                                  </p>
                                </div>

                                <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-900 leading-relaxed font-sans">
                                  <strong className="text-amber-400/80 font-mono text-[9px] uppercase tracking-wider block">
                                    STAR Model Alignment:
                                  </strong>
                                  <p className="text-[11px] text-slate-300">
                                    {roundData.star_alignment_evaluation}
                                  </p>
                                </div>

                                <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-900 md:col-span-2 leading-relaxed font-sans">
                                  <strong className="text-emerald-400/80 font-mono text-[9px] uppercase tracking-wider block">
                                    Technical Architecture & Database Accuracy validation:
                                  </strong>
                                  <p className="text-[11px] text-slate-300">
                                    {roundData.technical_accuracy_evaluation}
                                  </p>
                                </div>
                              </div>

                              {/* CTO Revision Suggestion Code-block styled */}
                              <div className="space-y-2 bg-[#090d16] border border-emerald-950/40 p-4 rounded-xl font-sans">
                                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                                  CTO Recommended Senior Rewrite Answer:
                                </span>
                                <div className="text-slate-100 text-[11px] leading-relaxed select-text bg-[#030712] p-3 rounded border border-slate-900 font-medium">
                                  {roundData.revision_suggestion}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-4 font-sans">
                          <button
                            onClick={handleResetInterview}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Initiate New Placement Assessment Interview</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PRESERVED CAPABILITIES: Academic Placement Prep Flashcards */}
                  <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-amber-500" />
                        <span>Academic Placement Study Lounge (Fast Assessment Prep)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Prepare for top placements! Employers look for deep, granular skills in document scanning and transaction management. Click cards below to reveal placement assessment answers.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {interviewQuestions.map((q, idx) => {
                        const isOpen = openCardIndex === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setOpenCardIndex(isOpen ? null : idx)}
                            className={`p-5 rounded-xl border transition-all cursor-pointer select-none space-y-3 relative group overflow-hidden ${
                              isOpen
                                ? "bg-amber-500/10 border-amber-500/30"
                                : "bg-slate-950 border-slate-900 hover:border-slate-800"
                            }`}
                          >
                            <div className="absolute top-0 right-0 p-3">
                              <span className="text-[8px] font-mono text-slate-500 group-hover:text-amber-400 transition-colors uppercase font-bold">
                                {isOpen ? "Hide Reply" : "Show Reply"}
                              </span>
                            </div>

                            <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wide block">
                              Placement Question {idx + 1}
                            </span>

                            <div className="text-xs font-bold text-slate-200 leading-snug group-hover:text-white transition-colors">
                              {q.q}
                            </div>

                            {isOpen ? (
                              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-amber-900/40 pt-3 animate-fade-in font-sans font-normal">
                                {q.a}
                              </p>
                            ) : (
                              <div className="text-[10px] text-amber-400/70 font-mono mt-1 pt-1 border-t border-slate-900/40 flex items-center gap-1 group-hover:text-amber-400">
                                <span>Click to inspect placement parameters</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 11: Professional AI Tutor Studio */}
              {activeTab === "chat" && (
                <AITutorStudio />
              )}

            </div>

            {/* RHS Sidebar Section - Structured Metadata, Logs and File explorer shortcut */}
            {activeTab !== "chat" && activeTab !== "dashboard-hub" && showDiagnostics && (
              <div className="space-y-6">
              
              {/* Authenticated User state Profile Card */}
              <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 relative overflow-hidden">
                <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold absolute top-3 right-3 select-none">
                  Logged In
                </span>
                
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                  Credentials Session Profile
                </span>

                <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-900/60 shadow-inner">
                  <div className="w-9 h-9 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center font-display text-sm tracking-tight select-none uppercase">
                    {currentUserProfile?.full_name?.split(" ").map((n: string) => n[0]).join("") || "US"}
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="text-xs font-bold text-slate-200 truncate">{currentUserProfile?.full_name}</div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">{currentUserProfile?.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/50">
                    <span className="text-[9px] text-slate-500 block font-mono">User ID</span>
                    <span className="text-xs font-bold text-slate-350 text-slate-300 font-mono">{currentUserProfile?.id || "N/A"}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/50">
                    <span className="text-[9px] text-slate-500 block font-mono">Token Expiry</span>
                    <span className="text-xs font-bold text-teal-400 font-mono">11520m</span>
                  </div>
                </div>
              </div>

              {/* Rapid Mentoring Help Center Chat overlay */}
              <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <MessagesSquare className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                    System Architecture Advisory
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 leading-relaxed text-[11px] text-slate-300 space-y-2 font-display">
                  <span className="font-bold text-sky-300 text-xs block">Did you have a look at `resume_parser.py`?</span>
                  <p>
                    We configured a powerful custom technology dictionary lookup schema that automatically isolates:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li>**Languages** (Python, SQL, JavaScript, C++)</li>
                    <li>**Frameworks** (FastAPI, React, Django)</li>
                    <li>**Infrastructure** (Docker, PostgreSQL, AWS)</li>
                  </ul>
                  <p className="text-slate-500 text-[10px] pt-1 leading-snug">
                    This eliminates standard PDF translation overlaps. Select the **Python Code Explorer** tab above to review the source code!
                  </p>
                </div>
              </div>

              {/* Visual app status indicators */}
              <div className="bg-slate-900/30 rounded-xl border border-slate-850 p-4 space-y-3 border-slate-800">
                <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase block font-semibold">Microservice Status Indices</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Uvicorn FastAPI server</span>
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 font-mono uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      Active • Port 8000
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">PostgreSQL Daemon</span>
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 font-mono uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Connected • 5432
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">pdfplumber PDF parser</span>
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 font-mono uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Loaded
                    </span>
                  </div>
                </div>
              </div>

            </div>
            )}

          </div>

        </main>

      </div>

      {/* Floating viewport Scroll-to-Back Button for long scroll pages */}
      {activeTab !== "dashboard-hub" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 left-6 z-50 select-none hidden md:block"
        >
          <button
            onClick={() => {
              setActiveTab("dashboard-hub");
              showNotice("Back to main Placement Suite dashboard!");
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-500 hover:to-indigo-505 text-white font-mono font-bold text-xs rounded-full border border-sky-500/30 shadow-[0_4px_25px_rgba(56,189,248,0.35)] cursor-pointer transition-all uppercase tracking-wider"
          >
            <span className="font-sans font-bold">&larr;</span>
            <span>Jump to Hub Overview</span>
          </button>
        </motion.div>
      )}

    </div>
  );
}
