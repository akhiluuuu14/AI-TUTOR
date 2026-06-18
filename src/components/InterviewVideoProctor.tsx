import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video, 
  VideoOff, 
  Eye, 
  Sparkles, 
  AlertCircle, 
  Check, 
  Camera, 
  Tv, 
  Maximize2, 
  Radio, 
  Scan,
  UserCheck,
  Shield,
  RefreshCw,
  Gauge,
  User,
  Volume2,
  Lock,
  Cpu,
  Mic,
  Activity,
  Layers,
  Terminal,
  MessagesSquare,
  Network
} from "lucide-react";

interface InterviewVideoProctorProps {
  onShowNotice: (msg: string) => void;
  interviewActive: boolean;
  interviewRole?: string;
  currentQuestion?: string;
}

interface Persona {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  themeColor: string;
  accentClass: string;
  borderClass: string;
  pulseColor: string;
  avatarSeed: number;
  videoUrl: string;
}

const INTERVIEWER_PERSONAS: Persona[] = [
  {
    id: "dr-vance",
    name: "Dr. Aris Vance",
    role: "Senior AI & ML Principal Lead",
    avatarBg: "from-indigo-900/60 to-indigo-950/80",
    themeColor: "indigo",
    accentClass: "text-indigo-400",
    borderClass: "border-indigo-500/30",
    pulseColor: "bg-indigo-500",
    avatarSeed: 1,
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=2312656a8e5cc6b2e0cf27737885b54a2db6b784&profile_id=139&oauth2_token_id=57447761"
  },
  {
    id: "sophia",
    name: "Sophia Chen",
    role: "VP of Product Engineering & Frontend Board",
    avatarBg: "from-teal-900/60 to-teal-950/80",
    themeColor: "teal",
    accentClass: "text-teal-400",
    borderClass: "border-teal-500/30",
    pulseColor: "bg-teal-500",
    avatarSeed: 2,
    videoUrl: "https://player.vimeo.com/external/409605481.sd.mp4?s=ebca31ff063f25b29b699c2bfb15bade7c6a9947&profile_id=165&oauth2_token_id=57447761"
  },
  {
    id: "kai",
    name: "Mr. Kai Tanaka",
    role: "Infrastructure Board Chair & Systems Guru",
    avatarBg: "from-rose-900/60 to-rose-950/80",
    themeColor: "rose",
    accentClass: "text-rose-400",
    borderClass: "border-rose-500/30",
    pulseColor: "bg-rose-500",
    avatarSeed: 3,
    videoUrl: "https://player.vimeo.com/external/459389137.sd.mp4?s=82c23ffed7d2427a1498b5a03e6fd9c92cc49171&profile_id=165&oauth2_token_id=57447761"
  }
];

const getTrailingCaption = (text: string) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= 11) return text;
  return "... " + words.slice(-11).join(" ");
};

export default function InterviewVideoProctor({ 
  onShowNotice, 
  interviewActive,
  interviewRole = "Full Stack Engineer",
  currentQuestion = "Tell me about a complex database conflict or memory leak you analyzed recently. What diagnostics keys did you implement?"
}: InterviewVideoProctorProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Selected AI Interviewer state
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("dr-vance");
  const selectedPersona = INTERVIEWER_PERSONAS.find(p => p.id === selectedPersonaId) || INTERVIEWER_PERSONAS[0];

  // Face-to-Face Meeting Options
  const [streamViewMode, setStreamViewMode] = useState<"video" | "avatar">("video");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [captionText, setCaptionText] = useState<string>("");
  const [isParticipantsOpen, setIsParticipantsOpen] = useState<boolean>(false);
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  // Live telemetry metrics feedback state (User Camera)
  const [eyeContactScore, setEyeContactScore] = useState<number>(96);
  const [facialPose, setFacialPose] = useState<string>("Centered & Aligned");
  const [lightingLevel, setLightingLevel] = useState<string>("Optimal");
  const [backgroundComplexity, setBackgroundComplexity] = useState<string>("Low Noise");
  const [selectedOverlayMode, setSelectedOverlayMode] = useState<"telemetry" | "face-mesh" | "clean">("telemetry");

  // Periodic eye blinking state for realistic human gaze likeness
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 4200 + Math.random() * 2500);

    return () => clearInterval(blinkTimer);
  }, []);

  // Simulated metrics tracking and voice spectrum wavebars
  const [telemetryTicks, setTelemetryTicks] = useState<number>(0);
  const [talkingWavebars, setTalkingWavebars] = useState<number[]>(new Array(14).fill(20));
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Text-To-Speech (TTS) voice speech engine representing live face to face interviewer talk
  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    if (isMuted || !currentQuestion) {
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    const voices = window.speechSynthesis.getVoices();
    
    // Choose appropriate voice profiles
    if (selectedPersonaId === "dr-vance") {
      const v = voices.find(voice => 
        voice.name.toLowerCase().includes("male") || 
        voice.name.toLowerCase().includes("daniel") || 
        voice.name.toLowerCase().includes("david") ||
        voice.lang.startsWith("en-GB")
      );
      if (v) utterance.voice = v;
      utterance.pitch = 0.85;
      utterance.rate = 0.9;
    } else if (selectedPersonaId === "sophia") {
      const v = voices.find(voice => 
        voice.name.toLowerCase().includes("female") || 
        voice.name.toLowerCase().includes("samantha") || 
        voice.name.toLowerCase().includes("zira") ||
        voice.lang.startsWith("en-US")
      );
      if (v) utterance.voice = v;
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
    } else if (selectedPersonaId === "kai") {
      const v = voices.find(voice => 
        voice.name.toLowerCase().includes("google us english") ||
        voice.name.toLowerCase().includes("microsoft") || 
        voice.lang.startsWith("en-")
      );
      if (v) utterance.voice = v;
      utterance.pitch = 0.95;
      utterance.rate = 1.02;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play spoken question when loaded or changed
  useEffect(() => {
    if (interviewActive && currentQuestion) {
      const timer = setTimeout(() => {
        speakQuestion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, interviewActive, selectedPersonaId, isMuted]);

  // Real-time closed-captions generator (scrolling simulation)
  useEffect(() => {
    if (!interviewActive || !currentQuestion) {
      setCaptionText("");
      return;
    }
    
    let index = 0;
    setCaptionText("");
    const words = currentQuestion.split(" ");
    
    const interval = setInterval(() => {
      if (index < words.length) {
        setCaptionText(prev => prev + (prev ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 380);

    return () => clearInterval(interval);
  }, [currentQuestion, interviewActive]);

  // Calculate vocal activity mouth height
  const averageWave = (isSpeaking || (interviewActive && Math.random() > 0.45)) 
    ? talkingWavebars.reduce((a, b) => a + b, 0) / talkingWavebars.length 
    : 0;
  const mouthHeight = Math.max(2, (averageWave / 50) * 16);

  // Request camera and open media stream
  const startCamera = async () => {
    setIsLoading(true);
    setPermissionError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false // Audio handled by STT helper separately
      });

      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      onShowNotice(`📹 Candidate webcam enabled in Hired AI duplex testing room!`);
    } catch (err: any) {
      console.error("Camera setup failed:", err);
      let errorMsg = "Could not activate camera device.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMsg = "Webcam access pending. Please grant camera permission or click 'Open in New Tab' to bypass iframe restrictions.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMsg = "No webcam device detected on your current hardware configuration.";
      }
      setPermissionError(errorMsg);
      setCameraActive(false);
      onShowNotice(`⚠️ Camera Access Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Turn off camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    onShowNotice("📹 Camera feedback suspended.");
  };

  // Toggle camera
  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Wavebar audio spectrum generator simulator
  useEffect(() => {
    const speechSpeakerInterval = setInterval(() => {
      // Simulate real conversational voice vibrations of the interviewer
      setTalkingWavebars(() => 
        new Array(14).fill(0).map(() => Math.floor(Math.random() * 45) + 12)
      );
    }, 180);

    return () => clearInterval(speechSpeakerInterval);
  }, []);

  // Simulate dynamic proctored board telemetry shifts
  useEffect(() => {
    if (!cameraActive) return;

    const interval = setInterval(() => {
      setTelemetryTicks(t => t + 1);
      
      setEyeContactScore(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(89, Math.min(100, prev + change));
      });

      const postures = [
        "Centered & Aligned", 
        "Good Frontal Alignment", 
        "Centered & Aligned", 
        "Nodding Accentuation", 
        "Listening Lean"
      ];
      setFacialPose(postures[Math.floor(Math.random() * postures.length)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [cameraActive]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      {/* macOS style Zoom Application Frame Container */}
      <div className="bg-[#121212] rounded-xl border border-neutral-700/50 shadow-2xl overflow-hidden font-sans flex flex-col">
        {/* Zoom Window Header Bar */}
        <div className="bg-[#202020] px-4 py-2.5 flex items-center justify-between border-b border-neutral-900/80">
          <div className="flex items-center gap-1.5 select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="text-[11px] font-sans font-semibold text-neutral-300 tracking-wide select-none">
            Zoom
          </div>
          <div className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
            HD Call
          </div>
        </div>

        {/* Zoom Content Area (Side-by-side: Video feeds on Left, Interactive Chat on Right) */}
        <div className="flex flex-col lg:flex-row bg-[#161616] relative">
          
          {/* Main Video Call Area */}
          <div className="flex-1 p-4 bg-[#1a1a1a] relative flex flex-col justify-between min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          
          {/* FEED 1: AI Board Lead Interviewer */}
          <div className={`relative bg-zinc-950 rounded-lg aspect-video overflow-hidden flex flex-col justify-between p-3.5 min-h-[220px] max-h-[360px] shadow-lg transition-all border-2 ${
            isSpeaking 
              ? "border-[#a2c93b] ring-2 ring-[#a2c93b]/40" 
              : "border-neutral-800"
          }`}>
          
          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-15 relative">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${selectedPersona.pulseColor} animate-pulse`} />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-300">
                {streamViewMode === "video" ? `${selectedPersona.name} (LIVE)` : "AI SCHEMATIC VIEW"}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 p-0.5 rounded z-20">
              {/* Voice Speak trigger button */}
              <button
                type="button"
                onClick={() => speakQuestion()}
                className="p-1 hover:bg-slate-850 hover:text-sky-450 hover:bg-slate-800 hover:text-sky-450 text-slate-400 rounded transition cursor-pointer"
                title="Speak Question Loud (TTS voice)"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Mute toggle button */}
              <button
                type="button"
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (nextMuted) {
                    window.speechSynthesis.cancel();
                  }
                  onShowNotice(nextMuted ? "🔇 Interviewer voice synthesis muted." : "🔊 Interviewer voice active.");
                }}
                className={`p-1 rounded transition cursor-pointer ${
                  isMuted ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20" : "text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                }`}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* View mode toggle (Looping Person Video vs Wireframe Avatar Mesh) */}
              <button
                type="button"
                onClick={() => {
                  const nextMode = streamViewMode === "video" ? "avatar" : "video";
                  setStreamViewMode(nextMode);
                  onShowNotice(nextMode === "video"
                    ? "🎥 Switched background stream to live video representation!"
                    : "🤖 Switched background stream to schematic board layout!"
                  );
                }}
                className="p-1 rounded transition cursor-pointer text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                title={streamViewMode === "video" ? "Switch to Schematic Avatar Mesh" : "Switch to Live Human video stream"}
              >
                <Tv className="w-3.5 h-3.5" />
              </button>

              <span className="text-[8px] font-mono px-1 py-0.5 rounded text-sky-400 font-extrabold bg-sky-505 bg-sky-500/10 border border-sky-500/20">
                HD Call
              </span>
            </div>
          </div>

          {/* Looping Persona human video feed when streamViewMode === "video" */}
          {streamViewMode === "video" && (
            <div className="absolute inset-0 z-0">
              <video
                src={selectedPersona.videoUrl}
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/40" />
            </div>
          )}

          {/* Animated Cybernetic Face / Avatar Construct */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${streamViewMode === "avatar" ? "z-10 bg-slate-950" : "opacity-0 pointer-events-none absolute hidden"}`}>
            {/* Background scanner ring grids */}
            <motion.div 
              className={`absolute w-36 h-36 rounded-full border border-dashed ${selectedPersona.borderClass} opacity-20`}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className={`absolute w-44 h-44 rounded-full border border-dotted ${selectedPersona.borderClass} opacity-15`}
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            />

            {/* Glowing Aura Behind Avatar */}
            <div className={`absolute w-32 h-32 rounded-full opacity-10 blur-2xl ${selectedPersona.pulseColor}`} />

            {/* Avatar Head SVG Matrix representing real human interviewers */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="z-10 flex flex-col items-center"
            >
              {selectedPersonaId === "dr-vance" && (
                <svg className="w-24 h-24 drop-shadow-[0_4px_16px_rgba(99,102,241,0.35)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background halo */}
                  <circle cx="50" cy="45" r="28" fill="url(#vance-glow)" opacity="0.15" />
                  
                  <defs>
                    <radialGradient id="vance-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* Shoulder / Collar / Dark Charcoal Business Blazer */}
                  <path d="M22,86 C22,72 32,70 50,70 C68,70 78,72 78,86" fill="#1e293b" stroke="#312e81" strokeWidth="1" />
                  <path d="M42,70 L50,86 L58,70" fill="#f1f5f9" /> {/* Inner shirt collar */}
                  <path d="M48,74 L50,86 L52,74" fill="#6366f1" /> {/* Ties */}
                  <path d="M35,72 L47,86 L50,86 L37,72" fill="#0f172a" /> {/* Left Lapel */}
                  <path d="M65,72 L53,86 L50,86 L63,72" fill="#0f172a" /> {/* Right Lapel */}

                  {/* Face Profile and Ears */}
                  <rect x="36" y="30" width="28" height="36" rx="12" fill="#e0a96d" stroke="#b45309" strokeWidth="0.5" />
                  {/* Ear left */}
                  <path d="M36,42 C34,42 33,46 36,48" fill="#e0a96d" stroke="#b45309" strokeWidth="0.5" />
                  {/* Ear right */}
                  <path d="M64,42 C66,42 67,46 64,48" fill="#e0a96d" stroke="#b45309" strokeWidth="0.5" />

                  {/* Professional silver sleek hair graying */}
                  <path d="M35,34 C35,24 45,20 50,20 C55,20 65,24 65,34 C63,30 59,30 50,30 C41,30 37,30 35,34 Z" fill="#64748b" />
                  <path d="M36,34 C38,27 45,24 50,24 C55,24 62,27 64,34" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />

                  {/* Deep analytical brows */}
                  <path d="M40,38 Q45,36 47,39" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M60,38 Q55,36 53,39" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Blinking eyes action */}
                  {isBlinking ? (
                    <>
                      <line x1="40" y1="43" x2="46" y2="43" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="54" y1="43" x2="60" y2="43" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="43" cy="43" r="2.5" fill="#ffffff" />
                      <circle cx="43" cy="43" r="1.5" fill="#312e81" />
                      <circle cx="43.5" cy="42.5" r="0.6" fill="#ffffff" />

                      <circle cx="57" cy="43" r="2.5" fill="#ffffff" />
                      <circle cx="57" cy="43" r="1.5" fill="#312e81" />
                      <circle cx="57.5" cy="42.5" r="0.6" fill="#ffffff" />
                    </>
                  )}

                  {/* Smart clear professional glasses */}
                  <rect x="38" y="40" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1" fill="rgba(148,163,184,0.12)" />
                  <rect x="52" y="40" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1" fill="rgba(148,163,184,0.12)" />
                  <line x1="48" y1="43" x2="52" y2="43" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="38" y1="43" x2="36" y2="42" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="62" y1="43" x2="64" y2="42" stroke="#94a3b8" strokeWidth="1" />

                  {/* Sharp nose */}
                  <path d="M50,42 L49,51 L52,51" stroke="#b45309" strokeWidth="0.8" fill="none" strokeLinecap="round" />

                  {/* Responsive Mouth with speech-vibration height */}
                  <rect 
                    x={50 - 3} 
                    y={56 - mouthHeight / 2} 
                    width="6" 
                    height={mouthHeight} 
                    rx={mouthHeight / 2} 
                    fill="#581c87" 
                    stroke="#b45309" 
                    strokeWidth="0.5" 
                  />
                  {interviewActive && mouthHeight > 6 && (
                    <line x1="48" y1="56" x2="52" y2="56" stroke="#ffffff" strokeWidth="0.8" />
                  )}
                </svg>
              )}

              {selectedPersonaId === "sophia" && (
                <svg className="w-24 h-24 drop-shadow-[0_4px_16px_rgba(20,184,166,0.35)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background halo */}
                  <circle cx="50" cy="45" r="28" fill="url(#sophia-glow)" opacity="0.15" />
                  
                  <defs>
                    <radialGradient id="sophia-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* Shoulder / Elegant Teal Blazer */}
                  <path d="M22,86 C22,72 32,69 50,69 C68,69 78,72 78,86" fill="#0f766e" stroke="#115e59" strokeWidth="1" />
                  <path d="M44,69 L50,86 L56,69" fill="#f8fafc" /> {/* High collar shirt split */}
                  <path d="M38,71 L48,86 L50,86 L40,71" fill="#0d9488" /> {/* Lapels left */}
                  <path d="M62,71 L52,86 L50,86 L60,71" fill="#0d9488" /> {/* Lapels right */}

                  {/* Friendly Female Skin Profile */}
                  <rect x="36" y="31" width="28" height="34" rx="12" fill="#ffd1a9" stroke="#ea580c" strokeWidth="0.5" />
                  {/* Ear details */}
                  <path d="M36,43 C34,43 33,47 36,49" fill="#ffd1a9" stroke="#ea580c" strokeWidth="0.5" />
                  <path d="M64,43 C66,43 67,47 64,49" fill="#ffd1a9" stroke="#ea580c" strokeWidth="0.5" />

                  {/* Stylish Bob Cut dark brown hair */}
                  <path d="M33,34 C33,20 43,17 50,17 C57,17 67,20 67,34 C67,48 64,50 64,55 C60,42 62,34 50,34 C38,34 40,42 36,55 C36,50 33,48 33,34 Z" fill="#2d1c18" />
                  <path d="M35,34 Q50,26 65,34" stroke="#4a2d24" strokeWidth="1" fill="none" />

                  {/* Soft stylish brows */}
                  <path d="M39,38 Q43,35 47,37" stroke="#4a2d24" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M61,38 Q57,35 53,37" stroke="#4a2d24" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Blinking eyes */}
                  {isBlinking ? (
                    <>
                      <line x1="39" y1="43" x2="46" y2="43" stroke="#2d1c18" strokeWidth="1.6" strokeLinecap="round" />
                      <line x1="54" y1="43" x2="61" y2="43" stroke="#2d1c18" strokeWidth="1.6" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="42.5" cy="43" r="2.5" fill="#ffffff" />
                      <circle cx="42.5" cy="43" r="1.5" fill="#0d9488" />
                      <circle cx="43" cy="42.2" r="0.6" fill="#ffffff" />

                      <circle cx="57.5" cy="43" r="2.5" fill="#ffffff" />
                      <circle cx="57.5" cy="43" r="1.5" fill="#0d9488" />
                      <circle cx="58" cy="42.2" r="0.6" fill="#ffffff" />
                    </>
                  )}

                  {/* Gold thin-rim glasses */}
                  <circle cx="42.5" cy="43.5" r="5.5" stroke="#fbbf24" strokeWidth="0.8" fill="rgba(251,191,36,0.08)" />
                  <circle cx="57.5" cy="43.5" r="5.5" stroke="#fbbf24" strokeWidth="0.8" fill="rgba(251,191,36,0.08)" />
                  <line x1="48" y1="43.5" x2="52" y2="43.5" stroke="#fbbf24" strokeWidth="0.8" />
                  <line x1="37" y1="43.5" x2="36" y2="42.5" stroke="#fbbf24" strokeWidth="0.8" />
                  <line x1="63" y1="43.5" x2="64" y2="42.5" stroke="#fbbf24" strokeWidth="0.8" />

                  {/* Nose bar */}
                  <path d="M50,42 L49,49 L51.5,49" stroke="#ea580c" strokeWidth="0.7" fill="none" strokeLinecap="round" />

                  {/* Dynamic friendly responsive mouth */}
                  <rect 
                    x={50 - 4} 
                    y={55 - mouthHeight / 2} 
                    width="8" 
                    height={mouthHeight} 
                    rx={mouthHeight / 2} 
                    fill="#991b1b" 
                    stroke="#ea580c" 
                    strokeWidth="0.5" 
                  />
                  {/* Smile cheek dimples */}
                  <path d="M41,56 Q39,55 38,57" stroke="#ea580c" strokeWidth="0.5" fill="none" />
                  <path d="M59,56 Q61,55 62,57" stroke="#ea580c" strokeWidth="0.5" fill="none" />
                </svg>
              )}

              {selectedPersonaId === "kai" && (
                <svg className="w-24 h-24 drop-shadow-[0_4px_16px_rgba(244,63,94,0.35)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background halo */}
                  <circle cx="50" cy="45" r="28" fill="url(#kai-glow)" opacity="0.15" />
                  
                  <defs>
                    <radialGradient id="kai-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* Workwear Blue collar Denim / Architect Shirt */}
                  <path d="M22,86 C22,72 32,69 50,69 C68,69 78,72 78,86" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1" />
                  <path d="M43,69 L50,86 L57,69" fill="#f1f5f9" /> {/* Inner grey tee */}
                  <path d="M38,71 L48,86 L50,86 L40,71" fill="#1e40af" /> {/* Shirt collar left */}
                  <path d="M62,71 L52,86 L50,86 L60,71" fill="#1e40af" /> {/* Shirt collar right */}

                  {/* Systems specialist skin tone */}
                  <rect x="36" y="30" width="28" height="35" rx="8" fill="#e4a885" stroke="#9a3412" strokeWidth="0.5" />
                  {/* Ear details */}
                  <path d="M36,42 C34,42 33,46 36,48" fill="#e4a885" stroke="#9a3412" strokeWidth="0.5" />
                  <path d="M64,42 C66,42 67,46 64,48" fill="#e4a885" stroke="#9a3412" strokeWidth="0.5" />

                  {/* Spiky developer black hair */}
                  <path d="M34,31 L37,24 L42,26 L46,22 L50,25 L54,22 L58,26 L63,24 L66,31 C60,29 55,29 50,29 C45,29 40,29 34,31 Z" fill="#1e293b" />

                  {/* Focused straight eyebrows */}
                  <path d="M40,37 Q44,34 47,36" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M60,37 Q56,34 53,36" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Blinking eyes simulation */}
                  {isBlinking ? (
                    <>
                      <line x1="40" y1="41" x2="46" y2="41" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="54" y1="41" x2="60" y2="41" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="43" cy="41" r="2.5" fill="#ffffff" />
                      <circle cx="43" cy="41" r="1.5" fill="#2563eb" />
                      <circle cx="43.5" cy="40.2" r="0.6" fill="#ffffff" />

                      <circle cx="57" cy="41" r="2.5" fill="#ffffff" />
                      <circle cx="57" cy="41" r="1.5" fill="#2563eb" />
                      <circle cx="57.5" cy="40.2" r="0.6" fill="#ffffff" />
                    </>
                  )}

                  {/* Trendy thick acetate frames for programmers */}
                  <rect x="38" y="37" width="10" height="7" rx="1.5" stroke="#0f172a" strokeWidth="1.2" fill="rgba(15,23,42,0.06)" />
                  <rect x="52" y="37" width="10" height="7" rx="1.5" stroke="#0f172a" strokeWidth="1.2" fill="rgba(15,23,42,0.06)" />
                  <line x1="48" y1="39.5" x2="52" y2="39.5" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="38" y1="39.5" x2="36" y2="39" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="62" y1="39.5" x2="64" y2="39" stroke="#0f172a" strokeWidth="1.2" />

                  {/* Nose ridge */}
                  <path d="M50,40 L49,48 L51.5,48" stroke="#9a3412" strokeWidth="0.8" fill="none" strokeLinecap="round" />

                  {/* Speaking mouth synced height */}
                  <rect 
                    x={50 - 3.5} 
                    y={54 - mouthHeight / 2} 
                    width="7" 
                    height={mouthHeight} 
                    rx={mouthHeight / 2} 
                    fill="#881337" 
                    stroke="#9a3412" 
                    strokeWidth="0.5" 
                  />
                  {interviewActive && mouthHeight > 6 && (
                    <line x1="47.5" y1="54" x2="52.5" y2="54" stroke="#ffffff" strokeWidth="0.8" />
                  )}
                </svg>
              )}

              {/* Persona Floating Tag */}
              <span className={`text-[11px] font-mono font-black tracking-wider ${selectedPersona.accentClass} mt-3`}>
                {selectedPersona.name}
              </span>
              <span className="text-[8px] text-slate-450 text-slate-500 font-medium">
                {selectedPersona.role}
              </span>
            </motion.div>
          </div>

          {/* Floating diagnostic scrolling data on LHS (Sci-Fi cyber UI) */}
          <div className="absolute bottom-16 left-4 z-10 hidden sm:block pointer-events-none select-none font-mono text-[7px] text-slate-500 space-y-0.5">
            <div>AUD SPEED: 96,250 T/S</div>
            <div>DECISION TREE: ADAPTIVE NLP v5</div>
            <div>DIAG_SCORE: STAR_POSTURE_VALID</div>
            <div>STATUS: {interviewActive ? "DELIVERING COGNITIVE PROBE" : "STANDBY"}</div>
          </div>

          {/* Persona quick select panel in bottom left inside frame */}
          <div className="absolute top-12 left-4 z-15 flex flex-col gap-1 items-start bg-slate-950/80 px-2 py-1.5 border border-slate-900 rounded-lg">
            <span className="text-[7px] font-mono text-slate-500 font-bold uppercase tracking-wider">SWAP INTERVIEWER:</span>
            <div className="flex gap-1.5">
              {INTERVIEWER_PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPersonaId(p.id);
                    onShowNotice(`🗣️ Shifted to Lead Interviewer Board Persona: ${p.name}`);
                  }}
                  className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded transition uppercase border ${
                    selectedPersonaId === p.id 
                      ? "bg-slate-900 text-sky-400 border-sky-500/30 font-black" 
                      : "bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300"
                  }`}
                >
                  {p.name.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Speaking Waveform at Bottom */}
          <div className="z-10 flex items-center justify-between bg-slate-900/65 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-900/80">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none font-extrabold">
                Current State:
              </span>
              <span className={`text-[10px] font-sans font-bold leading-normal text-slate-200 mt-1 flex items-center gap-1.5`}>
                <Volume2 className={`w-3.5 h-3.5 ${selectedPersona.accentClass} ${interviewActive ? "animate-bounce" : ""}`} />
                {interviewActive ? "Continuous Vocal Output" : "Awaiting Candidate Answer Response"}
              </span>
            </div>

            {/* Simulated Animated Equalizer Graph */}
            <div className="flex items-end gap-[2px] h-6">
              {talkingWavebars.map((height, i) => (
                <div 
                  key={i} 
                  className={`w-[2.5px] rounded-t-sm transition-all duration-150 ${selectedPersona.pulseColor}`} 
                  style={{ height: interviewActive ? `${height}%` : "3px" }}
                />
              ))}
            </div>
          </div>

          {/* Zoom Name Pill Badge for Lead Interviewer (Bottom Left Overlay) */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] text-zinc-100 rounded-md font-sans font-semibold z-30 flex items-center gap-2 border border-white/10 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{selectedPersona.name}</span>
          </div>

        </div>

        {/* FEED 2: Candidate Webcam & Proctor Verification Feed */}
        <div className={`relative bg-zinc-950 rounded-lg aspect-video overflow-hidden flex flex-col items-center justify-center min-h-[220px] max-h-[360px] shadow-lg border-2 transition-all ${
          !isSpeaking && cameraActive 
            ? "border-[#a2c93b] ring-2 ring-[#a2c93b]/40" 
            : "border-neutral-800"
        }`}>

          {/* Zoom Name Pill Badge for Candidate (Bottom Left Overlay) */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] text-zinc-100 rounded-md font-sans font-semibold z-30 flex items-center gap-2 border border-white/10 select-none">
            <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? "bg-emerald-500" : "bg-zinc-500"}`} />
            <span>Marius (Candidate)</span>
          </div>
          
          {/* Real-time Video Stream Element */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover rounded-xl transition-all duration-500 ${
              cameraActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"
            }`}
          />

          {/* Live Indicator Overlay */}
          {cameraActive ? (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[9px] font-bold tracking-wider rounded-md uppercase animate-pulse select-none">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>CANDIDATE ACTIVE SCANNER PORTAL</span>
            </div>
          ) : (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[8px] font-semibold rounded uppercase">
              <VideoOff className="w-3 h-3 text-slate-500" />
              <span>Camera Feed Idle</span>
            </div>
          )}

          {/* Dynamic Telemetry Vectors & Frame Boundary Overlay (Cyber-UI overlay) */}
          {cameraActive && selectedOverlayMode !== "clean" && (
            <div className="absolute inset-0 z-10 pointer-events-none select-none p-4 flex flex-col justify-between">
              {/* Corner Indicators */}
              <div className="flex justify-between w-full opacity-60">
                <div className="w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl" />
                <div className="w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr" />
              </div>

              {/* AI Center Target Overlay */}
              {selectedOverlayMode === "telemetry" && (
                <div className="absolute inset-x-0 top-[28%] flex flex-col items-center gap-1">
                  {/* Horizontal scanner bar */}
                  <motion.div 
                    className="w-[85%] h-[1px] bg-[#38bdf8]/40 shadow-[0_0_15px_#38bdf8]"
                    animate={{
                      y: [-40, 150, -40],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Face Tracker calibration indicator box */}
                  <div className="w-48 h-48 border border-sky-400/20 rounded-2xl flex items-center justify-center mt-3 bg-sky-500/[0.01]">
                    <div className="w-3 h-3 border-t border-l border-sky-400 absolute top-[30%] left-[38%]" />
                    <div className="w-3 h-3 border-t border-r border-sky-400 absolute top-[30%] right-[38%]" />
                    <div className="w-3 h-3 border-b border-l border-sky-400 absolute bottom-[30%] left-[38%]" />
                    <div className="w-3 h-3 border-b border-r border-sky-400 absolute bottom-[30%] right-[38%]" />
                    
                    <span className="text-[8px] font-mono text-sky-400/60 uppercase tracking-widest font-extrabold animate-pulse">
                      FOCUSING EYE LEVEL
                    </span>
                  </div>
                </div>
              )}

              {/* Simulated Face Outline Matrix Wireframe Overlay */}
              {selectedOverlayMode === "face-mesh" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-60">
                  <svg className="w-48 h-56 text-teal-400/45" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer Face Contour */}
                    <path d="M50,15 C20,15 15,40 15,70 C15,95 30,110 50,110 C70,110 85,95 85,70 C85,40 80,15 50,15 Z" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 2" />
                    {/* Eye markers */}
                    <circle cx="35" cy="45" r="4" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="35" cy="45" r="1" fill="currentColor" />
                    <circle cx="65" cy="45" r="4" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="65" cy="45" r="1" fill="currentColor" />
                    {/* Brow-line */}
                    <path d="M25,38 Q35,35 43,40 M57,40 Q65,35 75,38" stroke="currentColor" strokeWidth="0.8" />
                    {/* Nose Outline */}
                    <path d="M50,42 L48,65 L52,65 Z" stroke="currentColor" strokeWidth="0.8" />
                    {/* Mouth indicator */}
                    <path d="M35,80 Q50,90 65,80 Q50,82 35,80" stroke="currentColor" strokeWidth="0.8" />
                    {/* Grid Lines intersecting target points */}
                    <line x1="50" y1="15" x2="50" y2="110" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
                    <line x1="15" y1="70" x2="85" y2="70" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
                  </svg>
                  <div className="absolute uppercase font-mono text-[7px] text-teal-400/80 bg-slate-950 border border-teal-500/20 px-1.5 py-0.5 rounded-sm bottom-[15%]">
                    AI Mesh: Sync Target Confirmed
                  </div>
                </div>
              )}

              <div className="flex justify-between w-full opacity-60">
                <div className="w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl" />
                <div className="w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br" />
              </div>
            </div>
          )}

          {/* Camera Off / Awaiting Launch Placeholder UI */}
          {!cameraActive && (
            <div className="flex flex-col items-center text-center p-6 space-y-4 max-w-sm relative z-20">
              {isLoading ? (
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-sky-500/20 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-7 h-7 text-sky-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-slate-350 transition duration-300">
                  <Camera className="w-7 h-7 text-slate-500" />
                </div>
              )}

              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-200">Interactive Proctor Webcam Feed</h4>
                <p className="text-[11px] text-slate-450 text-slate-450 leading-normal font-sans font-normal">
                  Turn on your local camera stream to enable side-by-side video rendering with the AI placement interviewer board and calibrate active candidate focus ratios.
                </p>
              </div>

              {permissionError ? (
                <div className="text-[10px] text-rose-400 px-3 py-2 bg-rose-950/20 border border-rose-900/30 rounded-xl leading-normal text-left">
                  <strong>Access Pending:</strong> {permissionError}
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-sky-550 to-indigo-600 bg-sky-600 border border-sky-400/20 hover:border-sky-400 text-white font-mono font-bold text-[10px] rounded-lg tracking-wider transition cursor-pointer select-none"
                >
                  ACTIVATE CAM PIPELINE
                </button>
              )}
            </div>
          )}
            </div>
          </div>

            {/* Floating Closed Captions Overlay (Zoom CC subtitle) */}
            {isCaptionsEnabled && captionText && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-4 py-1.5 border border-zinc-800 rounded-lg text-zinc-100 text-[11px] sm:text-xs font-semibold z-40 max-w-[85%] text-center shadow-xl select-none leading-relaxed transition-all">
                <span className="text-yellow-400 font-bold mr-1">[CC] {selectedPersona.name}:</span>
                {getTrailingCaption(captionText)}
              </div>
            )}

          </div>

          {/* Meeting Chat Sidebar Pane */}
          {isChatOpen && (
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-neutral-800 bg-[#1e1e1e] flex flex-col shrink-0 text-left font-sans h-auto lg:h-[420px] justify-between">
              {/* Chat Sidebar Header */}
              <div className="px-4 py-3 bg-[#222222] border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">In-Meeting Chat</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="text-neutral-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-neutral-850 cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs min-h-[160px] max-h-[220px] lg:max-h-[285px]">
                <div className="text-[9px] text-zinc-500 font-mono text-center select-none py-1 border-b border-zinc-900 leading-normal">
                  🔒 Messages are end-to-end encrypted. Standard billing active.
                </div>

                {/* Simulated Welcome Intro */}
                <div className="space-y-1 bg-zinc-950/30 p-2.5 rounded-md border border-neutral-900">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-300">System Link</span>
                    <span className="text-[9px] text-neutral-500">12:00 PM</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Welcome! You have connected face-to-face with <strong>{selectedPersona.name}</strong> ({selectedPersona.role}). Please review the real-time AI prompt and question context query in this lane:
                  </p>
                </div>

                {currentQuestion && (
                  <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-neutral-800 max-w-full">
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5 mb-1.5">
                      <span className="font-bold text-indigo-400 text-[10px] uppercase tracking-wide">{selectedPersona.name} (AI)</span>
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-300 px-1 py-0.5 rounded font-mono border border-indigo-500/20">ACTIVE PROBE</span>
                    </div>
                    <div className="text-zinc-200 leading-relaxed font-sans text-[11px] select-text whitespace-pre-line font-medium break-words">
                      {currentQuestion}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input simulation */}
              <div className="p-2 border-t border-neutral-900 bg-[#191919]">
                <input
                  type="text"
                  placeholder="Type mock message to everyone..."
                  disabled
                  className="w-full text-[10px] bg-neutral-950 text-neutral-500 border border-neutral-800 px-3 py-1.5 rounded focus:outline-none placeholder:text-neutral-600 disabled:opacity-80 select-none font-mono"
                />
              </div>
            </div>
          )}

        </div>

      {/* Sleek Zoom Bottom Utility Toolbar Panel */}
      <div className="bg-[#181818] px-6 py-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-neutral-300 gap-3 select-none">
        
        {/* Left Section: Audio & Video togglers */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (nextMuted) {
                window.speechSynthesis.cancel();
              }
              onShowNotice(nextMuted ? "🔇 Interviewer voice muted." : "🔊 Interviewer voice active.");
            }}
            className="flex flex-col items-center gap-1 min-w-[50px] text-center hover:text-white transition group cursor-pointer"
          >
            {isMuted ? (
              <div className="relative">
                <Mic className="w-5 h-5 text-rose-500" />
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-rose-500 rotate-45 scale-110" />
              </div>
            ) : (
              <Mic className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition" />
            )}
            <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200 mt-0.5 font-medium leading-none">
              {isMuted ? "Unmute" : "Mute AI"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className="flex flex-col items-center gap-1 min-w-[50px] text-center hover:text-white transition group cursor-pointer"
          >
            {cameraActive ? (
              <Video className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition" />
            ) : (
              <div className="relative">
                <VideoOff className="w-5 h-5 text-zinc-500" />
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-rose-500 rotate-45 scale-110" />
              </div>
            )}
            <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200 mt-0.5 font-medium leading-none">
              {cameraActive ? "Stop Video" : "Start Video"}
            </span>
          </button>
        </div>

        {/* Center Section: Core Interactive zoom options */}
        <div className="flex items-center gap-6">
          
          {/* Security (Overlay Mesh selector cycle) */}
          <button
            type="button"
            onClick={() => {
              const nextOverlay = selectedOverlayMode === "telemetry" ? "face-mesh" : selectedOverlayMode === "face-mesh" ? "clean" : "telemetry";
              setSelectedOverlayMode(nextOverlay);
              onShowNotice(`🛡️ Swapped client viewport overlay to: ${nextOverlay}`);
            }}
            className="flex flex-col items-center gap-1 text-center hover:text-white transition group cursor-pointer"
            title="Set Scan Overlay Mode"
          >
            <Shield className={`w-5 h-5 text-sky-400 group-hover:scale-105 transition ${selectedOverlayMode !== "clean" ? "animate-pulse" : ""}`} />
            <span className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">
              {selectedOverlayMode === "telemetry" ? "Radar HUD" : selectedOverlayMode === "face-mesh" ? "Mesh HUD" : "Clean Link"}
            </span>
          </button>

          {/* Participants panel - change companion board selectors */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
              className={`flex flex-col items-center gap-1 text-center hover:text-white transition group cursor-pointer ${isParticipantsOpen ? "text-[#38bdf8]" : ""}`}
            >
              <UserCheck className="w-5 h-5 text-indigo-400 group-hover:scale-105 transition" />
              <span className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">
                Participants (2)
              </span>
            </button>
            
            <AnimatePresence>
              {isParticipantsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: -4, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-zinc-950 border border-neutral-800 rounded-xl p-2.5 w-56 flex flex-col gap-1.5 shadow-2xl z-50 text-left cursor-default"
                >
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-900 pb-1 text-center font-black">
                    Call Members (Swap Interviewer)
                  </span>
                  
                  {INTERVIEWER_PERSONAS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPersonaId(p.id);
                        setIsParticipantsOpen(false);
                        onShowNotice(`👥 Swapped partner interviewer to: ${p.name}`);
                      }}
                      className={`flex flex-col items-start p-2 rounded-lg text-left transition w-full cursor-pointer ${
                        selectedPersonaId === p.id 
                          ? "bg-indigo-600/25 border border-indigo-500/40 text-indigo-300" 
                          : "hover:bg-zinc-900 text-stone-300 border border-transparent"
                      }`}
                    >
                      <span className="text-[10px] font-semibold leading-none">{p.name} {selectedPersonaId === p.id && "⭐"}</span>
                      <span className="text-[8px] text-neutral-500 mt-1 truncate max-w-full font-mono">{p.role}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zoom Meeting Chat Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextChat = !isChatOpen;
              setIsChatOpen(nextChat);
              onShowNotice(nextChat ? "💬 Chat panel pinned to workspace sidebar." : "🔇 Chat panel hidden.");
            }}
            className="flex flex-col items-center gap-1 text-center hover:text-white transition group cursor-pointer"
            title="Toggle Right Meeting Chat"
          >
            <MessagesSquare className={`w-5 h-5 group-hover:scale-105 transition ${isChatOpen ? "text-[#38bdf8]" : "text-neutral-500"}`} />
            <span className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">
              Chat {isChatOpen ? "(On)" : "(Off)"}
            </span>
          </button>

          {/* Subtitles / Closed Caption Toggle */}
          <button
            type="button"
            onClick={() => {
              const ccNext = !isCaptionsEnabled;
              setIsCaptionsEnabled(ccNext);
              onShowNotice(ccNext ? "💬 Zoom CC subtitle overlay enabled!" : "🔇 Zoom closed captions subtitle hidden.");
            }}
            className="flex flex-col items-center gap-1 text-center hover:text-white transition group cursor-pointer"
            title="Toggle Subtitles"
          >
            <Layers className={`w-5 h-5 group-hover:scale-105 transition ${isCaptionsEnabled ? "text-yellow-400" : "text-neutral-500"}`} />
            <span className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">
              CC {isCaptionsEnabled ? "(On)" : "(Off)"}
            </span>
          </button>

          {/* View mode (Looping realistic video vs core futuristic wireframe outline) */}
          <button
            type="button"
            onClick={() => {
              const nextMode = streamViewMode === "video" ? "avatar" : "video";
              setStreamViewMode(nextMode);
              onShowNotice(nextMode === "video"
                ? "🎥 Rendered live actual partner caller visual feeds!"
                : "🤖 Rendered core telemetry schema matrices!"
              );
            }}
            className="flex flex-col items-center gap-1 text-center hover:text-white transition group cursor-pointer"
            title="Toggle Feed Aesthetic Mode"
          >
            <Tv className={`w-5 h-5 group-hover:scale-105 transition ${streamViewMode === "video" ? "text-amber-400" : "text-purple-400 animate-pulse"}`} />
            <span className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">
              {streamViewMode === "video" ? "Realistic" : "Wireframe"}
            </span>
          </button>

          {/* Manual prompt vocal test trigger */}
          <button
            type="button"
            onClick={() => {
              speakQuestion();
              onShowNotice("🎤 Manual voice spectrum audit running!");
            }}
            className="flex flex-col items-center gap-1 text-center text-[#23d160] hover:text-emerald-305 transition group cursor-pointer"
          >
            <Activity className="w-5 h-5 text-[#23d160] group-hover:scale-110 transition shrink-0" />
            <span className="text-[10px] text-neutral-450 mt-0.5 font-bold leading-none text-[#23d160]">
              Speech Test
            </span>
          </button>

        </div>

        {/* Right Section: Leaves meeting / prominent red action button */}
        <div>
          <button
            type="button"
            onClick={() => onShowNotice("🔴 Mock call ended. Submit remaining code or finalize parameters in the code editor.")}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-md shadow-md active:scale-95 transition cursor-pointer"
          >
            End Meeting
          </button>
        </div>

      </div>

    </div>

    {/* Auxiliary Diagnostic Proctor Panel (Placed outside the Zoom interface) */}
    <div className="bg-[#0b0f19] border border-neutral-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      
      {/* Telemetry telemetry readings */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <Shield className="w-4 h-4 text-sky-400" />
          <h5 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">PROCTOR MONITOR DECK:</h5>
        </div>

        <div className="flex flex-wrap gap-4 text-[10px] font-mono leading-none">
          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-900/40">
            <span className="text-zinc-500 uppercase font-black font-semibold">Focus Index:</span>
            <span className={cameraActive ? "text-emerald-400 font-extrabold" : "text-zinc-500 font-medium"}>
              {cameraActive ? `${eyeContactScore}% - Optimal` : "Offline"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-900/40">
            <span className="text-zinc-500 uppercase font-black font-semibold">Posture:</span>
            <span className={cameraActive ? "text-sky-400 font-bold" : "text-zinc-500 font-medium"}>
              {cameraActive ? facialPose : "Offline"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-900/40">
            <span className="text-zinc-500 uppercase font-black font-semibold">Lighting:</span>
            <span className={cameraActive ? "text-emerald-400 font-bold" : "text-zinc-500"}>
              {cameraActive ? `98 Lux - Optimal` : "Offline"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-900/40">
            <span className="text-zinc-500 uppercase font-black font-semibold">Acoustics:</span>
            <span className={cameraActive ? "text-sky-400 font-bold" : "text-zinc-500"}>
              {cameraActive ? backgroundComplexity : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {cameraActive && (
        <button
          onClick={stopCamera}
          className="px-3 py-1.5 bg-neutral-950 hover:bg-rose-950/20 text-rose-400 border border-neutral-900 hover:border-rose-900/30 rounded-lg text-[9px] font-mono tracking-wider flex items-center gap-1.5 transition uppercase"
        >
          <VideoOff className="w-3.5 h-3.5 text-rose-500" />
          <span>Suspend Feed</span>
        </button>
      )}

    </div>

  </div>
  );
}
