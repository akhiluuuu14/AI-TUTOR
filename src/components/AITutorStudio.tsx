import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  Cpu, 
  Layers, 
  Send, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Trophy, 
  Flame, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ChevronRight,
  PlayCircle
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface Persona {
  id: "academic" | "architect" | "recruiter";
  name: string;
  roleTitle: string;
  avatarBg: string;
  initials: string;
  description: string;
  strengths: string[];
  suggestedPrompts: string[];
}

interface QuizQuestion {
  id: number;
  domain: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export default function AITutorStudio() {
  // Available Tutor Personas
  const personas: Persona[] = [
    {
      id: "academic",
      name: "Prof. Allison",
      roleTitle: "Senior Computer Science Academic Placement Mentor",
      avatarBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      initials: "PA",
      description: "Focuses on computer science fundamentals, algorithm efficiency bounds, SQL normalizations, and pure mathematical definitions.",
      strengths: ["Database Normal Forms (1NF-3NF)", "TF-IDF Vector Cosine Math", "Algorithm Space Complexity"],
      suggestedPrompts: [
        "Explain Vector Cosine Dot Products formula",
        "Teach me database normal forms (1NF to 3NF)",
        "How does tf-idf normalize sparse words?"
      ]
    },
    {
      id: "architect",
      name: "Devon",
      roleTitle: "FAANG Lead System Architect & Database Engineer",
      avatarBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      initials: "DV",
      description: "Focuses on container orchestration, pgBouncer pooling strategies, index storage overheads, and high-performance server limits.",
      strengths: ["pgBouncer & Connection Pooling", "Docker Multistage Minimization", "B-Tree vs Hash GIN indexes"],
      suggestedPrompts: [
        "Explain pgBouncer vs raw connection scaling",
        "How is Docker Multistage layer optimized?",
        "Why is GIN indexing preferred for JSONB?"
      ]
    },
    {
      id: "recruiter",
      name: "Sarah",
      roleTitle: "Ex-Google Technical Placement Coach",
      avatarBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      initials: "SH",
      description: "Focuses on resume phrasing optimization, bypassing ATS filters, masterclass portfolios, and robust STAR interview strategy.",
      strengths: ["STAR Behavioral Formula", "ATS Keyword Extraction hacks", "Elevator Pitch polish"],
      suggestedPrompts: [
        "Give ATS Resume optimization hacks",
        "Explain STAR method for B-Tech projects",
        "Suggest keywords to beat FastAPI filters"
      ]
    }
  ];

  const [selectedPersona, setSelectedPersona] = useState<"academic" | "architect" | "recruiter">("academic");
  const activePersona = personas.find(p => p.id === selectedPersona) || personas[0];

  // Chat message logs per persona
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    academic: [
      {
        role: "assistant",
        text: "Hello Akhil! I am **Prof. Allison**, your CS Academic Mentor. It is wonderful to support your preparation for top-tier research and engineering placements! \n\nI can teach you the core mathematics of **Vector Cosine Similarities**, **sparse matrices**, and why we use **Term Frequency - Inverse Document Frequency (TF-IDF)** to isolate skills inside job descriptions. Ask me anything, or try our live Assessment Quiz on the side!"
      }
    ],
    architect: [
      {
        role: "assistant",
        text: "Hello Akhil. **Devon** here. Let's skip the small talk. Real placements are decided on system architecture, database physical page efficiency, and backend scaling parameters. We will audit pgBouncer pool limits, Docker multi-stage footprint optimizations (slashing from 800MB to 85MB), Nginx ingress proxies, and slow SQL query scans. What are we optimizing today?"
      }
    ],
    recruiter: [
      {
        role: "assistant",
        text: "Hi Akhil! I'm **Sarah**, and I want to make sure your masterclass portfolio does not get ignored by recruiters! To convert interviews into formal offers, we need to bypass keyword matching systems, quantify bullet metrics precisely, and apply the STAR (Situation, Task, Action, Result) behavioral technique perfectly. Let's make you stand out!"
      }
    ]
  });

  const chatMessages = chatHistories[selectedPersona];
  const [chatInput, setChatInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  // Stats
  const [streakDays, setStreakDays] = useState<number>(5);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedQuizCount, setCompletedQuizCount] = useState<number>(0);

  // Live Technical Placement Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      domain: "Database Indexing",
      question: "Why does a B-Tree index degrade if columns contain near-duplicate values or continuous ranges with massive row volumes?",
      options: [
        "A) B-Trees do not support index ranges, failing into an automatic O(N) sequential search array.",
        "B) Cardinality drops too low. The database optimizer discards index lookups because scanning the disk pages directly is faster than index page pointer roundtrips.",
        "C) The binary nodes trigger an infinite autovacuum loop, locking writing ports permanently.",
        "D) Postgres disables raw lookups on ranges to comply with strict 3NF database normal schemas."
      ],
      correctAnswer: 1, // B
      explanation: "Low cardinality tables make indices useless. Because if there are few unique values, the cost of matching random index heaps and leaping to data heap pages is higher than doing a fast, linear sequential table scan of flat blocks on the SSD."
    },
    {
      id: 2,
      domain: "Information Retrieval Math",
      question: "How does the TF-IDF formula penalize a tech skill token like 'Software' while highlighting 'FastAPI'?",
      options: [
        "A) Term Frequency (TF) counts occurrences relative to page count which reduces vocabulary indexes.",
        "B) Inverse Document Frequency (IDF) takes the natural log of total documents divided by documents containing the token. Common words result in an IDF close to 0, stripping weights.",
        "C) It flags technical words with lookbehind delimiters to bypass the cosine matrix dot product.",
        "D) TF-IDF utilizes deep learning layers to classify skills via ChromaDB vectors rather than math."
      ],
      correctAnswer: 1, // B
      explanation: "Exactly! IDF = ln(Total Docs / Docs with Word). If a word like 'software' exists in all resumes, the fraction is N/N = 1, and ln(1) = 0. Therefore, its weight drops to zero. Whereas 'FastAPI' is rare, boosting its relative value."
    },
    {
      id: 3,
      domain: "System Architecture",
      question: "Which pattern is critical when database client count reaches 500+ active microservice threads?",
      options: [
        "A) Opening clean raw TCP connection threads to Postgres dynamically inside each API route.",
        "B) Implementing a middleware broker like pgBouncer in transaction mode to pool and pipeline database links.",
        "C) Exceeding max_connections to 2000 in postgres.conf without configuring server memory limits.",
        "D) Moving all database tables to raw local text arrays inside the memory buffer."
      ],
      correctAnswer: 1, // B
      explanation: "Correct! Postgres spawns a physical server process for every concurrent connection, which drains 2-10MB of RAM per connection. pgBouncer allows thousands of connections to multiplex over a small set of real database links."
    },
    {
      id: 4,
      domain: "Container Security",
      question: "Why should we split the builder environment from the runner in a production multi-stage Dockerfile?",
      options: [
        "A) To ensure compilers run on port 3000 during test phases.",
        "B) It separates compiling tools, compilers (like gcc or pip dependencies), and source logs from the final image, reducing size to ~85MB and eliminating vulnerable packages.",
        "C) Nginx proxy protocols require double-stage Docker files to execute HTTPS redirections.",
        "D) Multi-stage builds are required to bypass standard local JWT cryptographic decryptions."
      ],
      correctAnswer: 1, // B
      explanation: "Spot-on! By discarding compiler runtimes (which are only needed to build dependencies) and copying only the compiled wheel files into a clean alpine/slim runner, we reduce surface vulnerabilites and shrivel footprint size."
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const activeQuestion = quizQuestions[activeQuizIndex];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Clean speaking stop on persona change
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);
  }, [selectedPersona]);

  // Read message out loud using browser speech synth
  const handleToggleSpeak = (text: string, index: number) => {
    if (speakingIdx === index) {
      window.speechSynthesis?.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis?.cancel();
    const cleanText = text.replace(/[*#`_]+/g, ""); // Strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice based on persona character
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      if (selectedPersona === "architect") {
        const maleVoice = voices.find(v => v.name.includes("David") || v.name.includes("Google US English") || v.lang.startsWith("en-US"));
        if (maleVoice) utterance.voice = maleVoice;
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
      } else if (selectedPersona === "recruiter") {
        const femaleVoice = voices.find(v => v.name.includes("Zira") || v.name.includes("Samantha") || v.name.includes("Moira"));
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
      } else {
        const softVoice = voices.find(v => v.name.includes("Hazel") || v.name.includes("Google UK English Female"));
        if (softVoice) utterance.voice = softVoice;
        utterance.rate = 0.95;
      }
    }

    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    
    setSpeakingIdx(index);
    window.speechSynthesis?.speak(utterance);
  };

  // Chat message sender
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim() || isSending) return;

    if (!messageText) {
      setChatInput("");
    }

    // Add user message to state
    const updatedMessages: ChatMessage[] = [...chatMessages, { role: "user", text: textToSend }];
    setChatHistories(prev => ({
      ...prev,
      [selectedPersona]: updatedMessages
    }));

    setIsSending(true);

    try {
      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          persona: selectedPersona,
          userProfile: { name: "Akhil", phase: 11 }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatHistories(prev => ({
          ...prev,
          [selectedPersona]: [...updatedMessages, { role: "assistant", text: data.text }]
        }));
      } else {
        setChatHistories(prev => ({
          ...prev,
          [selectedPersona]: [...updatedMessages, { role: "assistant", text: `Warning: ${data.error || "Tutor server is busy."}` }]
        }));
      }
    } catch (err: any) {
      setChatHistories(prev => ({
        ...prev,
        [selectedPersona]: [...updatedMessages, { role: "assistant", text: `Error: Unable to reach Tutor AI server. Details: ${err.message}` }]
      }));
    } finally {
      setIsSending(false);
    }
  };

  // Quiz click options
  const handleSelectAnswer = (optIndex: number) => {
    if (selectedAnswers[activeQuestion.id] !== undefined) return; // Answer already selected
    
    const isCorrect = optIndex === activeQuestion.correctAnswer;
    
    setSelectedAnswers(prev => ({ ...prev, [activeQuestion.id]: optIndex }));
    setCompletedQuizCount(prev => prev + 1);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 25);
      setStreakDays(prev => prev + 1);
    }
  };

  // Move quiz question
  const handleNextQuiz = () => {
    if (activeQuizIndex < quizQuestions.length - 1) {
      setActiveQuizIndex(prev => prev + 1);
    } else {
      setActiveQuizIndex(0); // Cycle back
    }
  };

  // Ask AI about this Question
  const handleAskAITutorAboutQuiz = () => {
    const quizPrompt = `Can you explain the placement concept on ${activeQuestion.domain} in detail? The question was: "${activeQuestion.question}". Why is option "${activeQuestion.options[activeQuestion.correctAnswer]}" the absolute correct answer? Please break it down like a mentor.`;
    handleSend(quizPrompt);
  };

  // Aggregate student score
  const preparScore = Math.min(100, 65 + (quizScore / 100) * 35);

  return (
    <div id="ai-tutor-studio-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed text-slate-300 font-sans">
      
      {/* LHS - Persona selection and stats stats */}
      <div className="lg:col-span-4 space-y-6 flex flex-col">
        
        {/* Dynamic Study Header / Streak Card */}
        <div id="tutor-metrics-card" className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 select-none">
              Academic Placement Preparedness
            </span>
            <div className="flex items-center gap-1 text-amber-500 animate-pulse">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-mono font-bold">{streakDays}D Streak</span>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-display">
              {preparScore.toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400">Tutor Readiness Score</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${preparScore}%` }}
            ></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-slate-900 text-center">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
              <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Quiz Answers</span>
              <span className="text-sm font-bold text-slate-200 font-mono">{completedQuizCount}/4</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
              <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Assessed Score</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">+{quizScore} XP</span>
            </div>
          </div>
        </div>

        {/* Persona Selectors */}
        <div id="persona-selection-card" className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block">
                Select Placement Persona
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-1">
                Customize your Active AI Coach
              </h4>
            </div>

            <div className="space-y-2 pt-1">
              {personas.map((p) => {
                const isActive = p.id === selectedPersona;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 relative group overflow-hidden cursor-pointer ${
                      isActive 
                        ? "bg-slate-950 border-sky-500/60 shadow-lg" 
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${p.avatarBg}`}>
                      {p.initials}
                    </div>
                    
                    <div className="space-y-0.5 truncate flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                          {p.name}
                        </span>
                        {isActive && (
                          <span className="text-[8px] font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-900">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{p.roleTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 mt-3">
            <span className="text-[9px] font-mono uppercase text-slate-500 block mb-2 font-bold select-none">
              Active Tutor Expertise
            </span>
            <div className="flex flex-wrap gap-1">
              {activePersona.strengths.map((str, idx) => (
                <span key={idx} className="text-[9px] bg-slate-950 text-slate-350 px-2.5 py-1 rounded-md border border-slate-900 font-mono shrink-0">
                  • {str}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 leading-snug italic italic-slate text-slate-500">
              {activePersona.description}
            </p>
          </div>
        </div>

      </div>

      {/* RHS - Conversation & Quiz tabs split */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Chat Stream section */}
        <div id="ai-tutor-conversation-log" className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl md:col-span-7 flex flex-col justify-between h-[520px] relative">
          
          {/* Active Tutor Header */}
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div className="space-y-0.5 truncate">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                <span>Coach {activePersona.name}</span>
              </h3>
              <p className="text-[10px] text-slate-400 truncate">{activePersona.roleTitle}</p>
            </div>
            
            <span className="text-[8px] font-mono tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded uppercase font-bold animate-pulse shrink-0">
              Gemini Active
            </span>
          </div>

          {/* Scrolling messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1 max-h-[320px] scrollbar-thin scrollbar-thumb-slate-800 select-text">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}>
                {msg.role === "assistant" && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] border uppercase shrink-0 mt-1 select-none ${activePersona.avatarBg}`}>
                    {activePersona.initials}
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed shadow-md relative group ${
                  msg.role === "user" 
                    ? "bg-sky-600 text-white rounded-tr-none" 
                    : "bg-slate-950 text-slate-350 border border-slate-900 rounded-tl-none font-sans"
                }`}>
                  
                  {/* Markdown formatted text converter */}
                  <div className="whitespace-pre-wrap select-text selection:bg-sky-500/30">
                    {msg.text}
                  </div>

                  {msg.role === "assistant" && (
                    <div className="mt-2.5 pt-1.5 border-t border-slate-900/40 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleSpeak(msg.text, i)}
                        className={`text-[9px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                          speakingIdx === i 
                            ? "text-rose-400 bg-rose-950/40 border-rose-800" 
                            : "text-slate-400 hover:text-sky-400 bg-slate-900/80 border-slate-850"
                        }`}
                      >
                        {speakingIdx === i ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen to Mentor Voice</span>
                          </>
                        )}
                      </button>
                      <span className="text-[8px] text-slate-600 font-mono">Tutor Guidance</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips Section */}
          <div className="mt-3 pt-2 border-t border-slate-900 bg-[#10172a]">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-2 select-none font-bold">
              Suggested Placement Inquiries
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto pr-1">
              {activePersona.suggestedPrompts.map((pmt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(pmt)}
                  disabled={isSending}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-900/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] text-left transition duration-150 cursor-pointer flex items-center gap-1 font-mono truncate max-w-full"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">{pmt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Message Input bar */}
          <div className="flex gap-2 pt-3 mt-3 bg-[#10172a]">
            <input
              type="text"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-sky-500 placeholder-slate-500 transition font-mono"
              placeholder={`Ask ${activePersona.name} any technical query...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSending}
            />
            <button
              onClick={() => handleSend()}
              disabled={isSending}
              className="px-4 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 select-none cursor-pointer"
            >
              {isSending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Placement Assessment Quiz card */}
        <div id="placement-tutor-quiz-portal" className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl md:col-span-5 h-[520px] flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                  Placement Check
                </span>
                <h3 className="font-semibold text-xs text-slate-100 flex items-center gap-1.5 mt-1">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Evaluation Quiz Portal</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold shrink-0">
                Q {activeQuizIndex + 1}/{quizQuestions.length}
              </span>
            </div>

            {/* Question description */}
            <div className="space-y-3 pt-1">
              <div className="text-[9px] font-mono tracking-wider uppercase text-slate-500">
                Category: <span className="text-sky-400">{activeQuestion.domain}</span>
              </div>
              <h4 className="text-xs font-bold leading-normal text-slate-200">
                {activeQuestion.question}
              </h4>
            </div>

            {/* MCQ Options list */}
            <div className="space-y-2 pt-1 font-sans">
              {activeQuestion.options.map((opt, i) => {
                const isSelected = selectedAnswers[activeQuestion.id] !== undefined;
                const userSelectedIdx = selectedAnswers[activeQuestion.id];
                const isCorrectOp = i === activeQuestion.correctAnswer;
                const isUserWrongSelection = isSelected && userSelectedIdx === i && !isCorrectOp;

                let optionStyles = "bg-slate-950 border-slate-900 text-slate-350 hover:border-slate-800";
                if (isSelected) {
                  if (isCorrectOp) {
                    optionStyles = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300";
                  } else if (isUserWrongSelection) {
                    optionStyles = "bg-rose-950/40 border-rose-500/60 text-rose-300";
                  } else {
                    optionStyles = "bg-slate-950/40 border-slate-950 text-slate-600 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    disabled={isSelected}
                    className={`w-full text-left p-3 rounded-lg border text-[11px] leading-relaxed transition-all duration-150 ${optionStyles} ${!isSelected && "cursor-pointer"}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation panel slide out */}
          <div className="pt-3 border-t border-slate-900/60 mt-3 flex-1 flex flex-col justify-end space-y-3">
            {selectedAnswers[activeQuestion.id] !== undefined ? (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2 text-left animate-fade-in">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10 shrink-0" />
                  <span className="uppercase font-mono">Tutor Explanation:</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  {activeQuestion.explanation}
                </p>
                <button
                  onClick={handleAskAITutorAboutQuiz}
                  className="w-full mt-2 py-2.5 bg-sky-950 hover:bg-sky-900 border border-sky-850 hover:border-sky-750 text-sky-400 hover:text-sky-300 rounded-lg text-[9px] font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Discuss details in chat now</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-4 border border-dashed border-slate-850 rounded-xl text-center text-[10px] text-slate-500 py-6 font-mono font-normal">
                Select an answer to complete active assessment evaluation and reveal explain-matrices.
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleNextQuiz}
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-350 border border-slate-900 font-bold text-[10px] rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Cycle Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
