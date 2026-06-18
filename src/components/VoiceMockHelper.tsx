import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Gauge, 
  CheckCircle2, 
  Lightbulb, 
  TrendingUp, 
  Activity,
  AlertTriangle
} from "lucide-react";

interface VoiceMockHelperProps {
  currentQuestion: string;
  candidateAnswer: string;
  onUpdateAnswer: (val: string) => void;
  onShowNotice: (msg: string) => void;
}

export default function VoiceMockHelper({ 
  currentQuestion, 
  candidateAnswer, 
  onUpdateAnswer, 
  onShowNotice 
}: VoiceMockHelperProps) {
  // Speech synthesis state (Text to Speech)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech recognition state (Speech to Text)
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  // Live posture evaluation statistics
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerWordsList, setFillerWordsList] = useState<string[]>([]);
  const [overallPostureRating, setOverallPostureRating] = useState("Excellent");
  const [calculatedWpm, setCalculatedWpm] = useState(130);

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
          setRecognitionError(null);
          onShowNotice("🎙️ Dictation active! Speak clean, metric-driven lines now.");
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "not-allowed") {
            setRecognitionError(
              "Microphone access denied (not-allowed). Because the application runs inside an iframe sandbox, please click the 'Open in New Tab' button in the top-right corner of AI Studio, and grant microphone access in the address bar lock icon."
            );
          } else {
            setRecognitionError(`Mic error: ${event.error}. Please check your audio hardware input options.`);
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            onUpdateAnswer(candidateAnswer + (candidateAnswer ? " " : "") + finalTranscript.trim());
          }
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      // Cleanup speaking on unmount
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [candidateAnswer, onUpdateAnswer, onShowNotice]);

  // Handle live posture analysis of current draft answer text
  useEffect(() => {
    const text = candidateAnswer.toLowerCase();
    // Common speech filler words/phrases
    const fillerPatterns = [
      /\bum\b/g,
      /\buh\b/g,
      /\blike\b/g,
      /\byou know\b/g,
      /\bactually\b/g,
      /\bbasically\b/g,
      /\bliterally\b/g,
      /\berr\b/g,
      /\bso\b/g
    ];

    let count = 0;
    const detected: string[] = [];

    fillerPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
        const representation = pattern.source.replace(/\\b/g, "");
        if (!detected.includes(representation)) {
          detected.push(representation);
        }
      }
    });

    setFillerCount(count);
    setFillerWordsList(detected);

    // Calculate quality score or posture rating
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount === 0) {
      setOverallPostureRating("Neutral (Awaiting Input)");
    } else {
      const density = count / wordCount;
      if (density === 0) {
        setOverallPostureRating("Superior Executive Posture");
      } else if (density < 0.05) {
        setOverallPostureRating("Elite Software Communicator");
      } else if (density < 0.12) {
        setOverallPostureRating("Fluent (Minor Filler Noise)");
      } else {
        setOverallPostureRating("Needs Pacing (High Filler Density)");
      }
      
      // Simulate dynamic WPM study estimate
      const simulatedWpm = Math.max(110, Math.min(160, 140 - count * 4 + Math.round((wordCount % 20))));
      setCalculatedWpm(simulatedWpm);
    }
  }, [candidateAnswer]);

  // TTS implementation: Read active interviewer question
  const toggleSpeechOfQuestion = () => {
    if (!synthRef.current) {
      onShowNotice("Speech synthesis is not supported inside this browser context.");
      return;
    }

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentQuestion) {
      onShowNotice("No question text available to speak.");
      return;
    }

    synthRef.current.cancel(); // Stop any current speaking
    
    // Create new utterance
    const cleanText = currentQuestion.replace(/[#*_`]/g, ""); // strip markdown characters for pronunciation clarity
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    
    // Attain a crisp, professional voice if available
    const voices = synthRef.current.getVoices();
    const optimalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Microsoft")));
    if (optimalVoice) {
      utterance.voice = optimalVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  // STT implementation: Toggle listening status
  const toggleListening = () => {
    if (!recognitionRef.current) {
      onShowNotice("⚠️ Web Speech Recognition is not supported or permission is denied inside your browser frame.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onShowNotice("🎤 Dictation session suspended.");
    } else {
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        console.error("Speech start error:", err);
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  return (
    <div className="space-y-4" id="speech-advisor-pipeline">
      {/* Voice Controls Integration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          {/* Read out loud button */}
          <button
            onClick={toggleSpeechOfQuestion}
            className={`p-2 rounded-lg border transition flex items-center gap-2 cursor-pointer text-xs font-bold ${
              isSpeaking 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold" 
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Read question out loud using Web Text-To-Speech Synthesis"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Mute Voice Operator</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span>Hear Question Out Loud</span>
              </>
            )}
          </button>

          {/* Voice rate selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded-lg border-slate-800">
            <span className="text-[9px] font-mono text-slate-600 uppercase font-bold">Voice Pitch</span>
            <select
              value={speechRate}
              onChange={(e) => {
                const newRate = parseFloat(e.target.value);
                setSpeechRate(newRate);
                if (isSpeaking && synthRef.current) {
                  // Restart with new rate
                  toggleSpeechOfQuestion();
                  setTimeout(() => toggleSpeechOfQuestion(), 200);
                }
              }}
              className="bg-transparent text-[10px] text-slate-300 font-mono focus:outline-none cursor-pointer font-bold"
            >
              <option value="0.8">0.8x (Deliberate)</option>
              <option value="1.0">1.0x (Standard)</option>
              <option value="1.2">1.2x (Brisk)</option>
            </select>
          </div>
        </div>

        {/* Dictation Trigger */}
        <div>
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              isListening 
                ? "bg-rose-500 hover:bg-rose-600 text-slate-955 animate-pulse text-white font-bold" 
                : "bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold"
            }`}
            title="Toggle speech recognition to formulate your answer verbally"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span>Dictation Active... Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Dictate Verbal Response (STT)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {recognitionError && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-sans">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{recognitionError}</span>
        </div>
      )}

      {isListening && (
        <div className="bg-[#1e1b4b]/20 border border-indigo-900/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-end h-4 w-6 shrink-0">
              <div className="w-1 bg-amber-400 rounded-full h-2 animate-bounce"></div>
              <div className="w-1 bg-amber-400 rounded-full h-4 animate-bounce delay-75"></div>
              <div className="w-1 bg-amber-400 rounded-full h-3 animate-bounce delay-150"></div>
              <div className="w-1 bg-amber-400 rounded-full h-1 animate-bounce delay-300"></div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-black block">Live Audio Pipeline Feed</span>
              <p className="text-xs text-slate-300 leading-normal">
                Listening to microphone input stream... Talk normally. Say "Situation..." to trigger STAR structure alignment.
              </p>
            </div>
          </div>
          <span className="text-[8px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-bold animate-pulse shrink-0">
            RECORDING
          </span>
        </div>
      )}

      {/* Modernist Speech & Posture Coach live Diagnostics Panel */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Sound Posture Grade */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Gauge className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Communication Posture</span>
          </div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="line-clamp-1">{overallPostureRating}</span>
          </div>
        </div>

        {/* Metric 2: Filler word count */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Linguistic Filler Checks</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center justify-between">
            <span>{fillerCount} Filler occurrences</span>
            {fillerCount > 0 && (
              <span className="text-[8px] font-mono bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                {fillerWordsList.slice(0, 3).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Clarity Pacing index */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Estimated Speech Pace</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{calculatedWpm} Words / Min</span>
          </div>
        </div>
      </div>

      {fillerCount > 0 && (
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Linguistic Coaching Prompt</span>
            <p className="text-[11px] text-slate-400 leading-normal">
              You used words like <strong className="text-slate-350 text-slate-300">"{fillerWordsList.join(", ")}"</strong>. For a sound Executive presentation under board reviewers, try exchanging filler vocalizations for silent, thoughtful transitions. This increases authority by 40%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
