import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ListChecks, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  GraduationCap, 
  Terminal, 
  Layers,
  ChevronDown
} from "lucide-react";

interface RoadmapGeneratorProps {
  resumeId: number;
  onShowNotice: (msg: string) => void;
  terminalLog: (msg: string) => void;
}

export default function RoadmapGenerator({ resumeId, onShowNotice, terminalLog }: RoadmapGeneratorProps) {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Developer");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [intensityHours, setIntensityHours] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});

  const rolePresets = [
    { title: "FastAPI Backend Developer", desc: "Focuses on high-bandwidth endpoints, connection pooling, and composite keys query plan tuning." },
    { title: "Frontend React Architect", desc: "Focuses on rigid UI state management, hydration constraints, and micro-rendering performance optimization." },
    { title: "DevOps & SRE Orchestrator", desc: "Focuses on container multi-stage footprint optimizations, Kubernetes statefulsets, and robust CI/CD metrics pipelines." },
    { title: "AI Integration & LLM Systems Engineer", desc: "Focuses on server-side model routing contexts, RAG pipelines, and stream-response latency handling." },
  ];

  const generateRoadmap = async () => {
    setIsLoading(true);
    setRoadmap(null);
    terminalLog(`\n[PHASE 7 INITIATED] Formulation Request:\nRole: "${roleTitle}"\nDuration: ${durationWeeks} weeks\nWeekly Intensity Limit: ${intensityHours} hrs/week`);
    
    try {
      const response = await fetch("/api/v1/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId,
          role_title: roleTitle,
          duration_weeks: durationWeeks,
          intensity_hours: intensityHours
        })
      });

      if (!response.ok) {
        throw new Error(`Failed with HTML status ${response.status}`);
      }

      const data = await response.json();
      setRoadmap(data);
      setActiveWeekIndex(0);
      onShowNotice(`Personalized weekly curriculum finalized for ${roleTitle}!`);
      terminalLog(`[SUCCESS] Structured roadmap compile successful. Matrix covers: ${data.missing_skills?.join(", ")}`);
    } catch (error: any) {
      console.error(error);
      onShowNotice(`Failed compiling dynamic schedule: ${error.message}`);
      terminalLog(`[CRITICAL ERROR] Fallback failure or connection issue: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (weekIndex: number, planIndex: number) => {
    const key = `${weekIndex}-${planIndex}`;
    setCompletedTasks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const weekPlanCount = roadmap?.weeks?.[weekIndex]?.daily_plan?.length || 1;
      const completedCount = Object.keys(next).filter(k => k.startsWith(`${weekIndex}-`) && next[k]).length;
      if (completedCount === weekPlanCount) {
        onShowNotice(`🏆 Phenom! Completed all planned daily topics for Week ${weekIndex + 1}!`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6" id="phase7-roadmap-panel">
      {/* Configuration Controller Card */}
      <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 select-none">
          <span className="text-[8px] tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded font-mono uppercase font-bold">
            Phase 7 Personalized Roadmap Editor
          </span>
        </div>

        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            <h3 className="font-mono font-bold text-sm text-slate-100">Configure Placement Acceleration Program</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Construct a comprehensive, daily-scheduled preparation curriculum to bridge tech stack gaps for your target role. This compiler integrates directly with resume diagnostics to optimize learning milestones within strict time allocations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Target Vacancy Role</label>
              <div className="relative">
                <select
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none focus:border-sky-500 transition-colors cursor-pointer appearance-none"
                >
                  {rolePresets.map((r, i) => (
                    <option key={i} value={r.title}>{r.title}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Duration of Study</label>
              <div className="relative">
                <select
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none focus:border-sky-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value={2}>2 Weeks Accelerated Crash course</option>
                  <option value={4}>4 Weeks Standard Bridge training</option>
                  <option value={6}>6 Weeks Extensive Placement bootcamp</option>
                  <option value={8}>8 Weeks Rigorous Master curriculum</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Weekly Study Intensity</label>
              <div className="relative">
                <select
                  value={intensityHours}
                  onChange={(e) => setIntensityHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none focus:border-sky-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value={10}>10 Hours per week (Light / Casual)</option>
                  <option value={20}>20 Hours per week (Standard / Consistent)</option>
                  <option value={40}>40 Hours per week (Intensive / Immersive)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={generateRoadmap}
              disabled={isLoading}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isLoading ? "Analyzing Profile & Formulating Weekly Roadmap..." : "Compile My Academic Study Roadmap"}</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-[#10172a] rounded-2xl border border-slate-800 p-8 shadow-xl text-center space-y-4 animate-pulse">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-sky-500/20 border border-sky-500/40 rounded-full flex items-center justify-center animate-spin">
              <Layers className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-semibold text-sm font-display">Engineering Tailored Learning Plan</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please wait while our placement engine extracts resume tech specs, maps vacancy requirements, and structures a week-by-week calendar of actionable core developer projects.
            </p>
          </div>
          <div className="text-left max-w-md mx-auto text-[10px] font-mono text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 overflow-x-auto select-none">
            <span className="text-sky-400">root@career-coach:~$</span> ./assess-gaps --role="{roleTitle}" --weeks={durationWeeks}<br/>
            <span className="text-emerald-400">[OK]</span> Identified profile reference matrix...<br/>
            <span className="text-emerald-400">[OK]</span> Calculating weighted priority queue...<br/>
            <span className="text-yellow-400 animate-pulse">[LOAD]</span> Deploying learning schedplers and study milestones...
          </div>
        </div>
      )}

      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Weeks Navigation Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Curriculum Schedule
            </div>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {roadmap.weeks.map((week: any, idx: number) => {
                const isActive = activeWeekIndex === idx;
                const weekKeyPrefix = `${idx}-`;
                const weekTasksCount = week.daily_plan.length;
                const weekCompletedCount = Object.keys(completedTasks).filter(k => k.startsWith(weekKeyPrefix) && completedTasks[k]).length;
                const isWeekComplete = weekTasksCount > 0 && weekCompletedCount === weekTasksCount;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveWeekIndex(idx)}
                    className={`flex-1 shrink-0 p-3.5 rounded-xl border text-left transition relative cursor-pointer min-w-[140px] lg:min-w-0 ${
                      isActive 
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/40 shadow" 
                        : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono bg-slate-950/80 text-sky-400 px-1.5 py-0.5 rounded border border-slate-800">
                        WEEK 0{week.week_number}
                      </span>
                      {isWeekComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
                      ) : isActive ? (
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow"></span>
                      ) : null}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-2 line-clamp-1">
                      {week.week_theme}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/40 pt-1">
                      <span>Daily Topics</span>
                      <span className="font-mono">{weekCompletedCount}/{weekTasksCount}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Summary card */}
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 space-y-3">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Diagnostic Focus Summary</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-300 font-semibold">{roadmap.role_title}</div>
                <div className="text-[10px] text-slate-550 text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Intensity Target: {roadmap.intensity}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block mb-1">Bridged Technology Stack Gaps</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {roadmap.missing_skills?.map((sk: string, i: number) => (
                    <span key={i} className="text-[9px] font-mono bg-sky-950/60 border border-sky-900 text-sky-400 px-1.5 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Week Curriculum Details Panel */}
          <div className="lg:col-span-3 space-y-6">
            {roadmap.weeks[activeWeekIndex] && (() => {
              const week = roadmap.weeks[activeWeekIndex];
              const weekKeyPrefix = `${activeWeekIndex}-`;
              const totalTasksOfActiveWeek = week.daily_plan.length;
              const completedTasksOfActiveWeek = Object.keys(completedTasks).filter(k => k.startsWith(weekKeyPrefix) && completedTasks[k]).length;
              const percentProgress = Math.round((completedTasksOfActiveWeek / totalTasksOfActiveWeek) * 100);

              return (
                <div className="space-y-6">
                  {/* Focus Header Banner */}
                  <div className="bg-[#10172a] rounded-2.5xl p-6 border border-slate-800/80 shadow relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest bg-sky-950/60 border border-sky-900 px-2 py-0.5 rounded">
                          Week {week.week_number} Curriculum Focus
                        </span>
                        <span className="text-slate-500 text-xs">•</span>
                        <div className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-mono text-slate-400">Technology Focus: {week.skills_covered?.join(", ")}</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold font-display text-white mt-1">
                        {week.week_theme}
                      </h4>
                    </div>

                    <div className="w-full md:w-36 shrink-0">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span>Milestones Passed</span>
                        <span className="font-bold text-sky-400">{percentProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${percentProgress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Curriculum Plans Checklist */}
                  <div className="bg-[#0f172a]/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <div className="border-b border-slate-800/80 px-5 py-3.5 bg-slate-900/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-sky-400" />
                        <span className="font-mono font-bold text-xs text-white">Daily Learning Schemas</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-450 text-slate-400">Check boxes to flag syllabus coverage progress</span>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                      {week.daily_plan.map((item: any, idx: number) => {
                        const isDone = !!completedTasks[`${activeWeekIndex}-${idx}`];
                        return (
                          <div 
                            key={idx} 
                            onClick={() => toggleTask(activeWeekIndex, idx)}
                            className={`p-4 flex items-start gap-4 transition hover:bg-slate-900/40 cursor-pointer ${
                              isDone ? "opacity-60 bg-slate-900/10" : ""
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(activeWeekIndex, idx);
                              }}
                              className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                isDone 
                                  ? "bg-sky-550 border-sky-500 bg-sky-500 text-slate-950" 
                                  : "border-slate-700 hover:border-sky-500"
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                            </button>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold font-mono text-sky-400 uppercase tracking-wide bg-sky-950/60 px-1.5 py-0.5 rounded">
                                  {item.day}
                                </span>
                                <span className={`text-[11px] font-bold tracking-wide transition ${isDone ? "text-slate-400 line-through" : "text-white"}`}>
                                  {item.topic}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {item.description}
                              </p>
                              {item.deliverable && (
                                <div className="mt-2 text-[10px] font-mono text-indigo-400 bg-indigo-950/20 border border-indigo-900/20 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                                  <Terminal className="w-3 h-3 text-indigo-400" />
                                  <span>Required Outcome / Artifact: {item.deliverable}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hands-on Weekly Project / Milestone Assignment */}
                  {week.weekly_milestone_project && (
                    <div className="bg-[#1e1b4b]/20 border border-indigo-900/40 rounded-2.5xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 opacity-5">
                        <Award className="w-32 h-32 text-indigo-400" />
                      </div>
                      
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-indigo-400" />
                          <h4 className="font-mono font-bold text-sm text-slate-100">Weekly Capstone Project: Portfolio Validation</h4>
                        </div>
                        <div className="bg-[#111822]/95 border border-indigo-950 rounded-xl p-4.5 space-y-2">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">{week.weekly_milestone_project.title}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {week.weekly_milestone_project.description}
                          </p>
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-600 block mb-2">Technical Standards / Expectations</span>
                          <ul className="space-y-1.5">
                            {week.weekly_milestone_project.technical_requirements?.map((reqItem: string, reqIdx: number) => (
                              <li key={reqIdx} className="text-xs text-slate-400 flex items-start gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                                <span>{reqItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Official Curated Study Resources bookmarks */}
                  {week.study_resources && week.study_resources.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-mono text-slate-500 font-bold block px-1">Curated Study Resources</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {week.study_resources.map((resItem: any, resIdx: number) => (
                          <a
                            href={resItem.url}
                            target="_blank"
                            rel="noreferrer"
                            key={resIdx}
                            className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center hover:bg-slate-900 hover:border-slate-700 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-900/50 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{resItem.title}</h5>
                                <span className="text-[9px] font-mono uppercase bg-slate-950/70 border border-slate-900 text-slate-500 px-1 py-0.5 rounded">
                                  {resItem.type}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* No roadmap yet card instruction */}
      {!roadmap && !isLoading && (
        <div className="bg-slate-900/20 rounded-2.5xl border border-dashed border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="w-5 h-5 text-sky-500" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-white font-display">No study roadmap initialized yet</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the **"Compile My Academic Study Roadmap"** button above to generate a custom-tailored daily learning study planner corresponding to your diagnostic tech gaps!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
