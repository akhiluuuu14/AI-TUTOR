import React, { useState } from "react";
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Code, 
  Sparkles, 
  HelpCircle, 
  ThumbsUp, 
  FileCheck,
  Zap,
  BarChart3,
  ChevronRight,
  RefreshCw,
  Sliders,
  Play
} from "lucide-react";

interface SkillMetric {
  subject: string;
  score: number;
  max: number;
  description: string;
  category: "Technical" | "Communication" | "Architectural";
}

interface PerformanceSession {
  date: string;
  fillerWords: number;
  wpmRate: number;
  vocalClarity: number; 
  atsScore: number;
}

interface DashboardAnalyticsProps {
  onShowNotice: (msg: string) => void;
  terminalLog: (msg: string) => void;
}

export default function DashboardAnalytics({ onShowNotice, terminalLog }: DashboardAnalyticsProps) {
  // Mock statistical data for Phase 10
  const initialSkillsList: SkillMetric[] = [
    { subject: "FastAPI Backend APIS", score: 88, max: 100, description: "REST Route structures, dependency injection, validation", category: "Technical" },
    { subject: "JWT Auth & Cryptography", score: 92, max: 100, description: "Bcrypt secure hashes, token claims, secure sessions", category: "Technical" },
    { subject: "Postgres Indexing", score: 85, max: 100, description: "Index scans vs sequential scans tuning, pg_trgm", category: "Architectural" },
    { subject: "ChromaDB RAG Vectors", score: 82, max: 100, description: "MDS projection, similarity distances, context prompt", category: "Architectural" },
    { subject: "NLP Resume Keyword Fit", score: 89, max: 100, description: "TF-IDF matching, skill extraction, gap algorithms", category: "Technical" },
    { subject: "STAR Behavioral Speaking", score: 75, max: 100, description: "STAR metrics delivery, filler word suppression, density", category: "Communication" },
    { subject: "Docker Multi-Stage", score: 78, max: 100, description: "Alpine runners, builder compiling separation, footprint", category: "Architectural" },
    { subject: "Acoustic Vocal Clarity", score: 80, max: 100, description: "Fluent cadence matching, pitch steadying, WPM speed", category: "Communication" },
  ];

  const speechHistory: PerformanceSession[] = [
    { date: "May 20", fillerWords: 15, wpmRate: 115, vocalClarity: 68, atsScore: 65 },
    { date: "May 25", fillerWords: 11, wpmRate: 122, vocalClarity: 74, atsScore: 72 },
    { date: "May 30", fillerWords: 8, wpmRate: 130, vocalClarity: 79, atsScore: 78 },
    { date: "Jun 03", fillerWords: 5, wpmRate: 138, vocalClarity: 85, atsScore: 84 },
    { date: "Jun 08", fillerWords: 2, wpmRate: 142, vocalClarity: 91, atsScore: 90 },
  ];

  const dbBenchmarks = [
    { name: "Raw Sequential Search Scan", latencyMs: 68.4, cpuUsagePercent: 42, color: "text-rose-400" },
    { name: "PostgreSQL B-Tree Indexed Scan", latencyMs: 4.8, cpuUsagePercent: 12, color: "text-emerald-400" },
    { name: "ChromaDB Memory Cache Retrieve", latencyMs: 1.2, cpuUsagePercent: 8, color: "text-cyan-400" },
  ];

  // States
  const [skills, setSkills] = useState<SkillMetric[]>(initialSkillsList);
  const [selectedMetric, setSelectedMetric] = useState<SkillMetric | null>(initialSkillsList[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeBenchmarkMetric, setActiveBenchmarkMetric] = useState<"latency" | "cpu">("latency");

  // Filter skills by category
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Technical" | "Communication" | "Architectural">("All");

  const filteredSkills = categoryFilter === "All" 
    ? skills 
    : skills.filter(s => s.category === categoryFilter);

  // Math Helper for RADAR CHART Coordinates Projector
  // Center is at (150, 150), Radius is 110
  const getRadarCoordinates = (index: number, total: number, scoreValue: number, maxVal: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const radius = 110 * (scoreValue / maxVal);
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    return { x, y };
  };

  const handleRecalculateMetrics = () => {
    setIsRefreshing(true);
    terminalLog("\n[Analytics Core] Recalculating Placement Readiness indexes...\n");
    terminalLog("[Analytics Core] Loading historical sessions log metrics...\n");
    
    setTimeout(() => {
      // Small simulated updates to add realistic interactivity
      const updated = skills.map(s => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextScore = Math.min(Math.max(s.score + delta, 65), 98);
        return { ...s, score: nextScore };
      });
      setSkills(updated);
      setIsRefreshing(false);
      onShowNotice("📈 Refreshed career metrics with latest simulation telemetry!");
      terminalLog("[Analytics Core] Mathematical models integrated with success. Placement Readiness at 85%\n");
    }, 900);
  };

  // Derive historical chart coordinates
  // SVGs width: 420px, height: 160px. Margins: left 30px, right 30px, top 20px, bottom 30px
  const getProgressHistoryCoordinates = (metricKey: "fillerWords" | "wpmRate" | "vocalClarity" | "atsScore") => {
    const width = 360;
    const height = 110;
    const xSpacing = width / (speechHistory.length - 1);
    
    // Find min and max values to scale
    const values = speechHistory.map(h => h[metricKey]);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal;

    return speechHistory.map((h, idx) => {
      const x = 30 + idx * xSpacing;
      // Invert Y coordinate because SVG matches 0 to top
      const normalizedY = range > 0 ? (h[metricKey] - minVal) / range : 0.5;
      const y = 130 - (normalizedY * height);
      return { x, y, value: h[metricKey], label: h.date };
    });
  };

  const [activeHistoryMetric, setActiveHistoryMetric] = useState<"fillerWords" | "wpmRate" | "vocalClarity" | "atsScore">("vocalClarity");
  const activeHistoryPoints = getProgressHistoryCoordinates(activeHistoryMetric);
  
  // Format line path string
  const linePath = activeHistoryPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
  // Area path string back to baseline
  const areaPath = `${linePath} L ${activeHistoryPoints[activeHistoryPoints.length - 1].x} 130 L ${activeHistoryPoints[0].x} 130 Z`;

  // Calculated overall metrics
  const avgAtsScore = Math.round(skills.reduce((acc, curr) => acc + curr.score, 0) / skills.length);

  return (
    <div className="space-y-6" id="dashboard-analytics-component">
      
      {/* Header telemetry summary */}
      <div className="bg-gradient-to-r from-sky-950/25 via-[#0d1428] to-[#111c3a] border border-sky-500/10 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded font-black">
              Phase 10 Fully Active
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive Chart Engine Framework v4.2</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-display">
            <BarChart3 className="w-5 h-5 text-sky-450 text-sky-400" />
            <span>Placement Readiness Dashboard & Analytical Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Synthesize all competency telemetry. Real-time ATS, speech fluency filters, semantic indexing coordinates, and full-stack benchmarks calculated into action advice.
          </p>
        </div>

        <button
          onClick={handleRecalculateMetrics}
          disabled={isRefreshing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold rounded-xl text-sky-400 flex items-center gap-2 transition cursor-pointer self-start md:self-center select-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? "Recalculating Models..." : "Sync Assessment Telemetry"}</span>
        </button>
      </div>

      {/* Primary Key Stats Widgets Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#10172a] rounded-xl border border-slate-800 p-4 space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-sky-500/5 text-sky-400 rounded-bl-xl border-l border-b border-sky-500/10">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Placement Readiness Index</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-black font-mono text-sky-400">{avgAtsScore}%</span>
            <span className="text-[10px] text-emerald-450 font-bold font-mono text-emerald-400">+4.5%</span>
          </div>
          <p className="text-[10px] text-slate-400">Calculated across 8 core competencies</p>
        </div>

        <div className="bg-[#10172a] rounded-xl border border-slate-800 p-4 space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-teal-500/5 text-teal-400 rounded-bl-xl border-l border-b border-teal-500/10">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Vocal Verbal Clarity</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-black font-mono text-teal-400">91%</span>
            <span className="text-[10px] text-emerald-450 font-bold font-mono text-emerald-400">+6%</span>
          </div>
          <p className="text-[10px] text-slate-400">Filler suppresion metrics optimal</p>
        </div>

        <div className="bg-[#10172a] rounded-xl border border-slate-800 p-4 space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-indigo-500/5 text-indigo-400 rounded-bl-xl border-l border-b border-indigo-500/10">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Speech Rate Cadence</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-black font-mono text-indigo-400">142 WPM</span>
            <span className="text-[10px] text-slate-500 font-bold font-mono">Normal Range</span>
          </div>
          <p className="text-[10px] text-slate-400">Target matches standard 130-150 WPM</p>
        </div>

        <div className="bg-[#10172a] rounded-xl border border-slate-800 p-4 space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-rose-500/5 text-rose-400 rounded-bl-xl border-l border-b border-rose-500/10">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">ATS Resume Keywords Match</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-black font-mono text-rose-400">89%</span>
            <span className="text-[10px] text-emerald-450 font-bold font-mono text-emerald-400">+12%</span>
          </div>
          <p className="text-[10px] text-slate-400">Postgres + Redis credentials registered</p>
        </div>
      </div>

      {/* Main analytical bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Competency Chart Visualizer Panel - Span 5 */}
        <div className="lg:col-span-5 bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div>
            <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Competency Matrix Mapping</h4>
            <p className="text-[10px] text-slate-500">Multidimensional engineering radar overlay based on simulation feedback</p>
          </div>

          <div className="flex items-center justify-center p-2 bg-slate-950 border border-slate-900 rounded-xl relative overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-full max-w-[280px] aspect-square text-slate-600">
              {/* Radar Grid Circles boundaries */}
              <circle cx="150" cy="150" r="110" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="82.5" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
              <circle cx="150" cy="150" r="55" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="27.5" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />

              {/* Axial lines */}
              {skills.map((s, idx) => {
                const coord = getRadarCoordinates(idx, skills.length, 100, 100);
                return (
                  <line 
                    key={`axis-${idx}`} 
                    x1="150" 
                    y1="150" 
                    x2={coord.x} 
                    y2={coord.y} 
                    stroke="#1e293b" 
                    strokeWidth="0.5" 
                  />
                );
              })}

              {/* Core Filled Polygon Path */}
              <polygon
                points={skills.map((s, idx) => {
                  const coord = getRadarCoordinates(idx, skills.length, s.score, 100);
                  return `${coord.x},${coord.y}`;
                }).join(" ")}
                fill="url(#radar-gradient)"
                fillOpacity="0.18"
                stroke="#0284c7"
                strokeWidth="1.5"
                className="transition-all duration-500"
              />

              {/* Dynamic Coordinate Target Bullets */}
              {skills.map((s, idx) => {
                const coord = getRadarCoordinates(idx, skills.length, s.score, 100);
                const isSelected = selectedMetric?.subject === s.subject;
                return (
                  <g 
                    key={`bullet-${idx}`} 
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedMetric(s);
                      terminalLog(`\n[Matrix Selection] Clicked telemetry category: "${s.subject}" (${s.score}% score)\n`);
                    }}
                  >
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? 6 : 4}
                      fill={s.category === "Technical" ? "#06b6d4" : s.category === "Communication" ? "#10b981" : "#818cf8"}
                      stroke="#0d111c"
                      strokeWidth="1"
                      className="transition-all duration-300 group-hover:scale-125"
                    />
                    {isSelected && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="9"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}

              <defs>
                <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Quick Helper Floating coordinates labels */}
            <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-slate-500 space-y-0.5 select-none bg-slate-950/90 p-1.5 border border-slate-900 rounded-lg">
              <span className="block font-bold">LEGEND:</span>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></div><span>Technical</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div><span>Language</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]"></div><span>Arch</span></div>
            </div>
          </div>

          {/* Expanded Selected Metric Information */}
          {selectedMetric && (
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-200 uppercase font-mono">{selectedMetric.subject}</span>
                <span className={`text-[8px] font-black font-mono px-2 py-0.5 rounded border ${
                  selectedMetric.category === "Technical" 
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/20" 
                    : selectedMetric.category === "Communication" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                }`}>
                  {selectedMetric.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {selectedMetric.description}
              </p>
              
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Subcomponent Mastery Confidence</span>
                  <span className="font-bold text-slate-300">{selectedMetric.score}%</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${selectedMetric.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Time Series Historical Training Fluency Chart & System Performance - Span 7 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            {/* Time-Series Header toggle */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/60 pb-3">
              <div>
                <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Fluency Progression Trend</h4>
                <p className="text-[10px] text-slate-500">Telemetry changes tracked across five sequential placement mock milestones</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-lg">
                <button
                  onClick={() => setActiveHistoryMetric("vocalClarity")}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition ${
                    activeHistoryMetric === "vocalClarity" 
                      ? "bg-sky-600 text-white" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Vocal Clarity
                </button>
                <button
                  onClick={() => setActiveHistoryMetric("fillerWords")}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition ${
                    activeHistoryMetric === "fillerWords" 
                      ? "bg-sky-600 text-white" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Fillers Out
                </button>
                <button
                  onClick={() => setActiveHistoryMetric("atsScore")}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition ${
                    activeHistoryMetric === "atsScore" 
                      ? "bg-sky-600 text-white" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ATS Sync Score
                </button>
              </div>
            </div>

            {/* Historical Series Plot Map */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 relative">
              <div className="h-[145px] w-full flex items-center justify-center">
                <svg viewBox="0 0 420 160" className="w-full h-full overflow-visible">
                  {/* Grid background horizontal ticks */}
                  <line x1="30" y1="20" x2="390" y2="20" stroke="#111827" strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="47.5" x2="390" y2="47.5" stroke="#111827" strokeWidth="1" />
                  <line x1="30" y1="75" x2="390" y2="75" stroke="#111827" strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="102.5" x2="390" y2="102.5" stroke="#111827" strokeWidth="1" />
                  <line x1="30" y1="130" x2="390" y2="130" stroke="#1f2937" strokeWidth="1" />

                  {/* Shaded bottom gradient area */}
                  <path
                    d={areaPath}
                    fill="url(#progression-area-gradient)"
                    fillOpacity="0.08"
                    className="transition-all duration-500"
                  />

                  {/* Primary Trend line path */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Scatter circle data points and labels */}
                  {activeHistoryPoints.map((p, idx) => (
                    <g key={`point-${idx}`} className="group cursor-help">
                      {/* Interactive glowing hover ring */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        fill="#0284c7"
                        fillOpacity="0.4"
                        className="opacity-0 group-hover:opacity-100 transition-all scale-150 duration-300"
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#0ea5e9"
                        strokeWidth="1.5"
                      />
                      {/* Metric value labeling */}
                      <text
                        x={p.x}
                        y={p.y - 10}
                        fill="#f1f5f9"
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {p.value}{activeHistoryMetric === "vocalClarity" || activeHistoryMetric === "atsScore" ? "%" : ""}
                      </text>
                      {/* Date timeline labels at bottom axes */}
                      <text
                        x={p.x}
                        y="146"
                        fill="#64748b"
                        fontSize="8.5"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}

                  <defs>
                    <linearGradient id="progression-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Performance analysis explanation block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-400 leading-relaxed font-sans pt-1">
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-teal-400 font-bold block">Acoustic Suppresion Analysis</span>
                <p>
                  Vocal delivery logs indicate a **74% drop in conversational pause syllables** ("like", "actually") since initial baseline tests. Continuous training stabilized structural STAR methods articulation.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-sky-400 font-bold block">Mastery Evaluation Output</span>
                <p>
                  Calculated cumulative indices match high eligibility brackets for enterprise backend teams. Core database optimization competencies scored **92% mastership levels**.
                </p>
              </div>
            </div>
          </div>

          {/* Low-Level Execution Speed & Database Benchmarks */}
          <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2.5">
              <div>
                <h4 className="font-bold text-xs font-mono uppercase text-slate-300">Infrastructure Performance Latency Benchmarks</h4>
                <p className="text-[10px] text-slate-500">Verify postgres indices speeds versus non-indexed queries on 10,000 dataset rows</p>
              </div>
              <div className="flex gap-1.5 items-center bg-slate-950 p-1 rounded-lg border border-slate-850">
                <button
                  onClick={() => setActiveBenchmarkMetric("latency")}
                  className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded transition ${
                    activeBenchmarkMetric === "latency" ? "bg-slate-800 text-teal-400 font-black" : "text-slate-500"
                  }`}
                >
                  Latency
                </button>
                <button
                  onClick={() => setActiveBenchmarkMetric("cpu")}
                  className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded transition ${
                    activeBenchmarkMetric === "cpu" ? "bg-slate-800 text-teal-400 font-black" : "text-slate-500"
                  }`}
                >
                  CPU Overhead
                </button>
              </div>
            </div>

            {/* Interactive benchmarks horizontal comparative display */}
            <div className="space-y-3">
              {dbBenchmarks.map((b, idx) => {
                // Scale value
                const widthPercent = activeBenchmarkMetric === "latency" 
                  ? (b.latencyMs / 68.4) * 100 
                  : (b.cpuUsagePercent / 42) * 100;

                const displayVal = activeBenchmarkMetric === "latency"
                  ? `${b.latencyMs.toFixed(1)} ms`
                  : `${b.cpuUsagePercent}%`;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-350 text-slate-300">{b.name}</span>
                      <span className={`font-bold ${b.color}`}>{displayVal}</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-400 font-sans italic text-center pt-1.5 opacity-80">
              *Indexation reduced query latencies by **14.2x**, freeing database thread pools to process subsequent simulated queue payloads flawlessly.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
