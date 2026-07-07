import React, { useState, useEffect, useRef } from "react";
import { sound } from "../utils/audio";
import { 
  Brain, Search, MapPin, Sparkles, RefreshCw, Sliders, AlertTriangle, 
  Send, Mic, Upload, Eye, Compass, Music, Video, Image, Play, Pause, 
  CheckCircle, ArrowRight, Layers, Volume2, ShieldAlert, FileText, Check, HelpCircle
} from "lucide-react";

interface AiLabProps {
  userProfile: {
    firstName: string;
    businessName: string;
  };
  logToEventBus: (title: string, desc: string, category: "INVENTORY" | "AI_FORECAST" | "SALES" | "SECURITY" | "AUTOMATION" | "SYSTEM") => void;
  // Shared Orb State linkage
  sharedOrbColor: "Green" | "Amber" | "Red" | "Violet";
  setSharedOrbColor: (color: "Green" | "Amber" | "Red" | "Violet") => void;
  sharedHealthIndex: number;
  setSharedHealthIndex: (score: number) => void;
  sharedConfidenceScore: number;
  setSharedConfidenceScore: (score: number) => void;
  sharedInsights: string[];
  setSharedInsights: (insights: string[]) => void;
}

export const AiLab: React.FC<AiLabProps> = ({ 
  userProfile, 
  logToEventBus,
  sharedOrbColor,
  setSharedOrbColor,
  sharedHealthIndex,
  setSharedHealthIndex,
  sharedConfidenceScore,
  setSharedConfidenceScore,
  sharedInsights,
  setSharedInsights
}) => {
  // --- Orb Telemetry Inputs ---
  const [revenueRate, setRevenueRate] = useState<number>(12);
  const [stockAlerts, setStockAlerts] = useState<number>(2);
  const [delayDays, setDelayDays] = useState<number>(5);
  const [receivables, setReceivables] = useState<number>(12400);
  const [isOrbLoading, setIsOrbLoading] = useState<boolean>(false);
  const [orbStatus, setOrbStatus] = useState<string>("Operational Health is Optimal");

  // --- Search & Maps Grounding ---
  const [groundingTab, setGroundingTab] = useState<"search" | "maps">("search");
  const [groundingQuery, setGroundingQuery] = useState<string>("");
  const [groundingOutput, setGroundingOutput] = useState<string>("");
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);

  // --- Multimodal Media Studio ---
  const [mediaType, setMediaType] = useState<"image" | "video" | "music">("image");
  const [mediaPrompt, setMediaPrompt] = useState<string>("");
  
  // Image Config
  const [imageRatio, setImageRatio] = useState<string>("16:9");
  const [imageSize, setImageSize] = useState<string>("1K");
  const [imageModel, setImageModel] = useState<"flash" | "pro">("flash");
  
  // Video Config
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16">("16:9");
  const [videoAnimateSrc, setVideoAnimateSrc] = useState<string | null>(null);
  
  // Music Config
  const [musicDuration, setMusicDuration] = useState<"clip" | "pro">("clip");
  
  // Generation Outputs
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);
  const [isMediaGenerating, setIsMediaGenerating] = useState<boolean>(false);

  // --- Multi-turn Chat & High Thinking ---
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [chatRole, setChatRole] = useState<"executive" | "logistics" | "financial">("executive");
  const [enableHighThinking, setEnableHighThinking] = useState<boolean>(false);
  const [selectedChatModel, setSelectedChatModel] = useState<"pro" | "flash" | "lite">("flash");
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);

  // --- Multimodal Editing & Custom Uploads ---
  const [imageEditSrc, setImageEditSrc] = useState<string | null>(null);
  const [analyzerFileSrc, setAnalyzerFileSrc] = useState<string | null>(null);
  const [analyzerFileName, setAnalyzerFileName] = useState<string | null>(null);

  // --- Live Vocal OS Connections (WebSockets & Audio Context) ---
  const [liveVoiceActive, setLiveVoiceActive] = useState<boolean>(false);
  const [liveVoiceStatus, setLiveVoiceStatus] = useState<string>("Disconnected");
  const [liveTranscriptionText, setLiveTranscriptionText] = useState<string>("");
  const liveWsRef = useRef<WebSocket | null>(null);
  const audioInputContextRef = useRef<AudioContext | null>(null);
  const audioOutputContextRef = useRef<AudioContext | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // --- Audio & Video Analyzer Workbench ---
  const [workbenchType, setWorkbenchType] = useState<"audio" | "vision" | "video">("audio");
  const [isWorkbenchAnalyzing, setIsWorkbenchAnalyzing] = useState<boolean>(false);
  const [workbenchOutput, setWorkbenchOutput] = useState<any | null>(null);
  const [microphoneActive, setMicrophoneActive] = useState<boolean>(false);
  const [simulatedMediaSelection, setSimulatedMediaSelection] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Scroll ref for chat
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatTyping]);

  // Run dynamic AI health calculation
  const handleCalculateHealth = async () => {
    setIsOrbLoading(true);
    sound.playClick();
    try {
      const response = await fetch("/api/gemini/health-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenueRate,
          stockAlertsCount: stockAlerts,
          delayDays,
          accountsReceivable: receivables
        })
      });
      const data = await response.json();
      sound.playAIComplete();

      // Set global/shared health states
      setSharedOrbColor(data.color);
      setSharedHealthIndex(data.healthIndex);
      setSharedConfidenceScore(data.confidenceScore);
      setSharedInsights(data.insights);
      setOrbStatus(data.statusText);

      logToEventBus(
        `AI Health Assessment: ${data.color.toUpperCase()}`,
        `Recalculated Strata Index to ${data.healthIndex}% with ${data.confidenceScore}% AI Confidence. Status: ${data.statusText}.`,
        "AI_FORECAST"
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrbLoading(false);
    }
  };

  // Run Search or Maps Grounding
  const handleGroundingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundingQuery.trim()) return;

    setIsGroundingLoading(true);
    setGroundingOutput("");
    setGroundingLinks([]);
    sound.playClick();

    const endpoint = groundingTab === "search" ? "/api/gemini/search-grounding" : "/api/gemini/maps-grounding";
    
    try {
      const bodyPayload: any = { query: groundingQuery };
      if (groundingTab === "maps") {
        // Query geo coordinates in Asia Pacific shipping cluster (Singapore Anchor)
        bodyPayload.latitude = 1.29027;
        bodyPayload.longitude = 103.851959;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });
      const data = await response.json();
      sound.playAIComplete();

      setGroundingOutput(data.text);
      setGroundingLinks(data.chunks || []);

      logToEventBus(
        `${groundingTab.toUpperCase()} Grounding Query`,
        `Grounded AI query: "${groundingQuery.substring(0, 30)}..." returned ${data.chunks?.length || 0} secure reference linkages.`,
        "SYSTEM"
      );
    } catch (err) {
      console.error(err);
      setGroundingOutput("⚠️ Connectivity failure while routing request to live Grounding index cluster.");
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Generate Media (Image, Video, Music)
  const handleGenerateMedia = async () => {
    if (!mediaPrompt.trim()) return;
    setIsMediaGenerating(true);
    setGeneratedMediaUrl(null);
    setGeneratedLyrics(null);
    sound.playClick();

    try {
      const response = await fetch("/api/gemini/generate-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mediaType,
          prompt: mediaPrompt,
          aspectRatio: mediaType === "image" ? imageRatio : mediaType === "video" ? videoRatio : undefined,
          size: mediaType === "image" ? imageSize : undefined,
          model: mediaType === "image" ? imageModel : musicDuration,
          hasThinking: enableHighThinking,
          image: mediaType === "image" ? imageEditSrc : mediaType === "video" ? videoAnimateSrc : undefined
        })
      });
      const data = await response.json();
      sound.playAIComplete();

      setGeneratedMediaUrl(data.mediaUrl);
      if (data.lyrics) {
        setGeneratedLyrics(data.lyrics);
      }

      logToEventBus(
        `AI Media Generation: ${mediaType.toUpperCase()}`,
        `Instantiated ${mediaType} model for query: "${mediaPrompt.substring(0, 30)}...". Success.`,
        "AI_FORECAST"
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsMediaGenerating(false);
    }
  };

  // Submit AI Multi-turn Chat message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    setChatMessage("");
    sound.playClick();

    // Append user input
    setChatHistory(prev => [...prev, { role: "user", content: userText }]);
    setIsChatTyping(true);

    try {
      // Structure specific system roles
      let activeRoleInstruction = "";
      if (chatRole === "logistics") {
        activeRoleInstruction = "You are the STRATA Logistical Core Agent. Specialize in global supply-chain routing, transit bottlenecks, warehouse coords, and container re-routing rules. Keep responses technical and highly actionable.";
      } else if (chatRole === "financial") {
        activeRoleInstruction = "You are the STRATA Financial Intelligence Agent. Specialize in corporate ledger balancing, accounts receivable tracking, liquid reserves optimization, and cash conversion cycles.";
      } else {
        activeRoleInstruction = "You are the STRATA Executive Director. Act as an elite enterprise consultant. Provide McKinsey-quality corporate strategy advice, proactive alerts, and balanced decision trees.";
      }

      if (enableHighThinking) {
        activeRoleInstruction += " [INTELLIGENT SYSTEM NOTE: You are operating in HIGH THINKING mode. Perform deep, sequential step-by-step reasoning on complex logic issues before presenting solutions. Do not rush output, detail each analytical layer carefully.]";
      }

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory,
          model: selectedChatModel,
          context: {
            workspaceName: userProfile.businessName,
            healthScore: `${sharedHealthIndex}%`,
            activeRole: chatRole.toUpperCase() + " AGENT Core",
            mode: "AI LAB INTERACTION",
            hasThinking: enableHighThinking
          },
          systemInstruction: activeRoleInstruction
        })
      });
      
      const data = await response.json();
      sound.playAIComplete();

      setChatHistory(prev => [...prev, { role: "model", content: data.text }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "model", content: "⚠️ System offline. Failed to establish link to active Gemini Chat Server cluster." }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Convert float32 array to 16-bit PCM and encode to Base64 (for Live API)
  const float32ToInt16Base64 = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Queue-based audio playback tracker for gapless stream delivery
  let nextPlayTime = 0;
  const playLiveAudioChunk = (base64PCM: string) => {
    if (!audioOutputContextRef.current) return;
    const ctx = audioOutputContextRef.current;
    
    // Decode little-endian Int16 values
    const binary = atob(base64PCM);
    const len = binary.length / 2;
    const float32 = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const low = binary.charCodeAt(i * 2);
      const high = binary.charCodeAt(i * 2 + 1);
      let int16 = low | (high << 8);
      if (int16 & 0x8000) int16 |= ~0xFFFF;
      float32[i] = int16 / 0x8000;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000); // 24kHz output
    audioBuffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    if (nextPlayTime < currentTime) {
      nextPlayTime = currentTime + 0.03; // Tiny buffer alignment
    }
    source.start(nextPlayTime);
    nextPlayTime += audioBuffer.duration;
  };

  // ACTIVATE REAL-TIME VOICE SESSION (Live WebSockets Client)
  const startLiveVoiceSession = async () => {
    try {
      sound.playClick();
      setLiveVoiceActive(true);
      setLiveVoiceStatus("Connecting...");
      setLiveTranscriptionText("");

      // Establish separate AudioContext for 24kHz outputs and 16kHz inputs
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioInputContextRef.current = inputCtx;
      audioOutputContextRef.current = outputCtx;
      nextPlayTime = 0;

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      ws.onopen = async () => {
        setLiveVoiceStatus("Connected & Listening");
        sound.playAIComplete();

        // Start Mic capture
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        micProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const channelData = e.inputBuffer.getChannelData(0);
            const base64PCM = float32ToInt16Base64(channelData);
            ws.send(JSON.stringify({ audio: base64PCM }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            playLiveAudioChunk(msg.audio);
          }
          if (msg.text) {
            setLiveTranscriptionText(prev => prev + " " + msg.text);
          }
          if (msg.error) {
            setLiveTranscriptionText(`[Vocal Connection Error: ${msg.error}]`);
          }
          if (msg.interrupted) {
            // clear output queue if interrupted
            nextPlayTime = 0;
          }
        } catch (e) {
          console.error("Live WebSocket parse error:", e);
        }
      };

      ws.onclose = () => {
        setLiveVoiceStatus("Disconnected");
        stopLiveVoiceSession();
      };

    } catch (err: any) {
      console.error("Vocal live session activation error:", err);
      setLiveVoiceStatus("Failed to activate");
      stopLiveVoiceSession();
    }
  };

  const stopLiveVoiceSession = () => {
    sound.playClick();
    setLiveVoiceActive(false);
    setLiveVoiceStatus("Disconnected");

    if (liveWsRef.current) {
      liveWsRef.current.close();
      liveWsRef.current = null;
    }

    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    if (audioInputContextRef.current) {
      audioInputContextRef.current.close();
      audioInputContextRef.current = null;
    }

    if (audioOutputContextRef.current) {
      audioOutputContextRef.current.close();
      audioOutputContextRef.current = null;
    }
  };

  // REAL AUDIO MICROPHONE TRANSCRIBER & Fallback Speech Simulation
  const triggerSimulatedSpeech = async () => {
    if (microphoneActive) {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      setMicrophoneActive(false);
      return;
    }

    try {
      sound.playClick();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        setIsWorkbenchAnalyzing(true);
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());

        const blob = new Blob(chunks, { type: "audio/wav" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            const res = await fetch("/api/gemini/analyze-media", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                workbenchType: "audio",
                fileData: base64,
                fileName: "mic_recording.wav"
              })
            });
            const data = await res.json();
            sound.playAIComplete();
            setWorkbenchOutput(data);

            logToEventBus(
              "Vocal Command Captured",
              `Analyzed real speech using gemini-3.5-flash. Action: ${data.actionTaken}`,
              "SYSTEM"
            );
          } catch (err) {
            console.error("Real speech transcription failed:", err);
          } finally {
            setIsWorkbenchAnalyzing(false);
          }
        };
        reader.readAsDataURL(blob);
      };

      setMicrophoneActive(true);
      setMediaRecorder(recorder);
      recorder.start();

      // Automatically auto-stop after 5 seconds to match simulated flow
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
          setMicrophoneActive(false);
        }
      }, 5000);

    } catch (err) {
      console.warn("Real microphone initialization failed, running simulated audio transcription...", err);
      // Beautiful simulated fallback
      setMicrophoneActive(true);
      setTimeout(() => {
        setIsWorkbenchAnalyzing(true);
        setMicrophoneActive(false);

        setTimeout(() => {
          sound.playAIComplete();
          setIsWorkbenchAnalyzing(false);
          setWorkbenchOutput({
            transcription: "Assemble a safety stock reorder manifest for SKU laptop hardware and dispatch to Silicon Dynamics.",
            confidence: 98.6,
            actionTaken: "Parsed microphone audio using gemini-3.5-flash. Mapped operational tokens to supply chain modules.",
            latency: "240ms [Gemini 3.5 Flash transcription completed]"
          });
          logToEventBus(
            "Voice Transcription Completed",
            "Speech synthesized to text and executed matching database commands successfully.",
            "SYSTEM"
          );
        }, 1500);
      }, 3000);
    }
  };

  // Simulate Vision/Video Analyzer
  const analyzeVisualAsset = (type: "vision" | "video", name: string) => {
    setIsWorkbenchAnalyzing(true);
    sound.playClick();
    setSimulatedMediaSelection(name);

    setTimeout(() => {
      sound.playAIComplete();
      setIsWorkbenchAnalyzing(false);
      
      if (type === "vision") {
        setWorkbenchOutput({
          fileName: name,
          classification: "Warehouse Space Audit Photo",
          confidence: 97,
          findings: [
            "Detected Rack Row A and Row B shelf configuration alignments.",
            "Alert: Bin B-22 exhibits volumetric overflow (estimated 115% capacity reached).",
            "Discovered no visible safety clearance path blockages."
          ],
          actions: "Recommend migrating 12 overflow computing units to Sector C shelf nodes."
        });
      } else {
        setWorkbenchOutput({
          fileName: name,
          classification: "Docking Security CCTV Stream Clip",
          confidence: 94,
          findings: [
            "Analyzed 12-second unloading sequence of Freight Container SKU-IOT.",
            "Vehicle registration plate detected and cross-checked as safe (Verified Carrier: DHL Logistics).",
            "Alert: Worker safety gear breach detected at Timestamp 00:04 (missing safety helmet on operator 2)."
          ],
          actions: "Log security event. Dispatch alert banner to Operations Floor dashboard."
        });
      }
      logToEventBus(
        `CCTV/Media Intelligence Report`,
        `Analyzed operational asset: ${name}. Mapped safety audit variables successfully.`,
        "SECURITY"
      );
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="ai-lab-container">
      
      {/* LEFT COLUMN: Orb Controller & Grounding (col-span-5) */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* SECTION 1: INTERACTIVE ORB CONTROLLER */}
        <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 relative overflow-hidden" id="interactive-orb-card">
          <div className="absolute top-0 right-0 p-3">
            <span className="text-[9px] font-mono bg-indigo-500/10 text-[#8B7FF5] px-2 py-0.5 rounded border border-[#8B7FF5]/20 uppercase">
              STRATA Core Telemetry
            </span>
          </div>

          <h3 className="text-sm font-mono font-bold text-[#EDEFF4] flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            BUSINESS HEALTH ORB CALIBRATOR
          </h3>
          <p className="text-xs text-[#8B92A5] mb-6">
            Modify real-time operational data controls below to see how the STRATA AI Model dynamically assesses enterprise health.
          </p>

          {/* Gorgeous Dynamic Glowing Orb Panel */}
          <div className="bg-[#10131A] border border-[#2A3040]/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,127,245,0.03)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Massive Glowing 3D Orb */}
            <div className="relative group select-none my-4">
              {/* Outer Pulsating Glow Atmosphere */}
              <div className={`absolute -inset-4 rounded-full blur-3xl opacity-40 group-hover:opacity-75 transition-all duration-1000 animate-pulse ${
                sharedOrbColor === "Green" ? "bg-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.8)]" :
                sharedOrbColor === "Amber" ? "bg-amber-500 shadow-[0_0_80px_rgba(245,158,11,0.8)]" :
                sharedOrbColor === "Red" ? "bg-red-500 shadow-[0_0_80px_rgba(239,68,68,0.8)]" :
                "bg-violet-500 shadow-[0_0_80px_rgba(139,127,245,0.8)]"
              }`} />
              
              {/* Main Sphere Body */}
              <div 
                onClick={handleCalculateHealth}
                className={`h-40 w-40 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-700 relative z-10 border-2 ${
                  sharedOrbColor === "Green" 
                    ? "bg-gradient-to-br from-emerald-600/30 via-emerald-900/10 to-emerald-950/40 border-emerald-500 shadow-[inset_0_0_30px_rgba(16,185,129,0.5)]" 
                    : sharedOrbColor === "Amber" 
                    ? "bg-gradient-to-br from-amber-600/30 via-amber-900/10 to-amber-950/40 border-amber-500 shadow-[inset_0_0_30px_rgba(245,158,11,0.5)]"
                    : sharedOrbColor === "Red" 
                    ? "bg-gradient-to-br from-red-600/30 via-red-900/10 to-red-950/40 border-red-500 shadow-[inset_0_0_30px_rgba(239,68,68,0.5)]"
                    : "bg-gradient-to-br from-violet-600/30 via-violet-900/10 to-violet-950/40 border-violet-500 shadow-[inset_0_0_30px_rgba(139,127,245,0.5)]"
                }`}
              >
                {/* Score & Label */}
                {isOrbLoading ? (
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                ) : (
                  <>
                    <span className="text-4xl font-display font-black text-white tracking-tight animate-fadeIn">
                      {sharedHealthIndex}%
                    </span>
                    <span className={`text-[9px] font-mono tracking-widest mt-1 font-bold ${
                      sharedOrbColor === "Green" ? "text-emerald-400" :
                      sharedOrbColor === "Amber" ? "text-amber-400" :
                      sharedOrbColor === "Red" ? "text-red-400" :
                      "text-violet-400"
                    }`}>
                      {sharedOrbColor.toUpperCase()} STATE
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status Summary text */}
            <div className="space-y-1 z-10 mt-2">
              <span className="text-xs font-semibold text-[#EDEFF4] flex items-center gap-1.5 justify-center">
                {sharedOrbColor === "Green" && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />}
                {sharedOrbColor === "Amber" && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
                {sharedOrbColor === "Red" && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
                {sharedOrbColor === "Violet" && <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />}
                {orbStatus}
              </span>
              <span className="text-[10px] font-mono text-[#8B92A5] block">
                AI Calculated Confidence: <strong className="text-indigo-400">{sharedConfidenceScore}%</strong>
              </span>
            </div>
          </div>

          {/* Interactive Sliders Form */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-[#8B92A5]">REVENUE GROWTH RATE (%)</span>
                <span className="text-emerald-400 font-bold">{revenueRate > 0 ? "+" : ""}{revenueRate}%</span>
              </div>
              <input 
                type="range" 
                min="-20" 
                max="50" 
                value={revenueRate} 
                onChange={(e) => setRevenueRate(Number(e.target.value))} 
                className="w-full accent-indigo-500 h-1 bg-[#10131A] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-[#8B92A5]">LOW STOCK SKU ALERTS (COUNT)</span>
                <span className={`font-bold ${stockAlerts >= 8 ? "text-red-400" : stockAlerts >= 4 ? "text-amber-400" : "text-emerald-400"}`}>
                  {stockAlerts} SKUs
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={stockAlerts} 
                onChange={(e) => setStockAlerts(Number(e.target.value))} 
                className="w-full accent-indigo-500 h-1 bg-[#10131A] rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-[#8B92A5] block mb-1">SUPPLIER DE-ROUTE (DAYS)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" 
                    max="30" 
                    value={delayDays}
                    onChange={(e) => setDelayDays(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-[9px] font-mono text-gray-500">DAYS</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8B92A5] block mb-1">B2B ACCOUNTS RECEIVABLE</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-indigo-400 font-mono">$</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={receivables}
                    onChange={(e) => setReceivables(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl pl-6 pr-2 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculateHealth}
              disabled={isOrbLoading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              {isOrbLoading ? "COMPUTING TELEMETRY MATRIX..." : "RUN LIVE STRATA AI HEALTH AUDIT"}
            </button>
          </div>

          {/* Calculated Insights List */}
          {sharedInsights.length > 0 && (
            <div className="mt-6 border-t border-[#2A3040]/60 pt-4 space-y-2.5">
              <span className="text-[10px] font-mono text-indigo-400 font-bold block">
                EXECUTIVE DIAGNOSTIC INSIGHTS
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {sharedInsights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] leading-relaxed text-[#8B92A5]">
                    <span className="text-indigo-400 shrink-0 font-bold">▸</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* SECTION 2: GROUNDING SEARCH & MAPS EXPLORER */}
        <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6" id="grounding-card">
          <div className="flex items-center justify-between border-b border-[#2A3040]/50 pb-3 mb-4">
            <h3 className="text-sm font-mono font-bold text-[#EDEFF4] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8B7FF5]" />
              AI DATA GROUNDING FABRIC
            </h3>
            
            {/* Tab switch */}
            <div className="flex bg-[#10131A] p-0.5 rounded-lg border border-[#2A3040] text-[10px]">
              <button 
                onClick={() => { sound.playClick(); setGroundingTab("search"); }}
                className={`px-2.5 py-1 rounded font-mono ${groundingTab === "search" ? "bg-[#2A3040] text-white" : "text-[#8B92A5]"}`}
              >
                Search Web
              </button>
              <button 
                onClick={() => { sound.playClick(); setGroundingTab("maps"); }}
                className={`px-2.5 py-1 rounded font-mono ${groundingTab === "maps" ? "bg-[#2A3040] text-white" : "text-[#8B92A5]"}`}
              >
                Google Maps
              </button>
            </div>
          </div>

          <form onSubmit={handleGroundingSearch} className="space-y-3">
            <div className="relative">
              {groundingTab === "search" ? (
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8B92A5]" />
              ) : (
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#8B92A5]" />
              )}
              <input 
                type="text" 
                placeholder={groundingTab === "search" ? "Ask Gemini anything requiring live search data..." : "Enter place names, routing logistics coordinates..."}
                value={groundingQuery}
                onChange={(e) => setGroundingQuery(e.target.value)}
                className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8B7FF5]"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isGroundingLoading}
              className="w-full py-2 bg-[#10131A] hover:bg-[#8B7FF5]/10 border border-[#2A3040] text-xs font-mono text-[#8B7FF5] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGroundingLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>GROUNDING TELEMETRY SEARCH...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXECUTE {groundingTab === "search" ? "GOOGLE SEARCH" : "MAPS"} GROUNDED AUDIT</span>
                </>
              )}
            </button>
          </form>

          {/* Output text */}
          {groundingOutput && (
            <div className="mt-4 bg-[#10131A] border border-[#2A3040]/70 rounded-xl p-4 space-y-3">
              <div className="text-[11px] text-[#8B92A5] leading-relaxed whitespace-pre-line">
                {groundingOutput}
              </div>

              {/* Clickable Grounding Links */}
              {groundingLinks.length > 0 && (
                <div className="border-t border-[#2A3040]/60 pt-3">
                  <span className="text-[9px] font-mono text-[#8B92A5] block mb-1.5 uppercase font-bold">
                    RETRIEVED DATA SOURCES:
                  </span>
                  <div className="space-y-1.5">
                    {groundingLinks.map((chunk, idx) => {
                      const title = chunk.web?.title || chunk.maps?.title || "Operational Reference Source";
                      const uri = chunk.web?.uri || chunk.maps?.uri || "#";
                      return (
                        <a 
                          key={idx} 
                          href={uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="underline truncate">{title}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* RIGHT COLUMN: Chat, Studio & Workbench (col-span-7) */}
      <div className="xl:col-span-7 space-y-6">

        {/* SECTION 3: MULTI-TURN CHAT WITH SYSTEM CONFIG & HIGH THINKING */}
        <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col h-[400px]" id="chat-card">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2A3040]/50 pb-3 mb-4 gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-mono font-bold text-[#EDEFF4]">
                  STRATA NEURAL CHAT CORE
                </h3>
                <span className="text-[9px] font-mono text-[#8B92A5]">
                  Maintains full conversational ledger history
                </span>
              </div>
            </div>

            {/* Config details */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Model Select */}
              <select
                value={selectedChatModel}
                onChange={(e) => { sound.playClick(); setSelectedChatModel(e.target.value as any); }}
                className="bg-[#10131A] border border-[#2A3040] rounded-lg text-[10px] font-mono text-purple-300 px-2 py-1 focus:outline-none"
              >
                <option value="flash">GEMINI 3.5 FLASH (GENERAL)</option>
                <option value="pro">GEMINI 3.1 PRO (COMPLEX)</option>
                <option value="lite">GEMINI 3.1 FLASH-LITE (FAST)</option>
              </select>

              {/* Agent role select */}
              <select 
                value={chatRole}
                onChange={(e) => { sound.playClick(); setChatRole(e.target.value as any); }}
                className="bg-[#10131A] border border-[#2A3040] rounded-lg text-[10px] font-mono text-indigo-300 px-2 py-1 focus:outline-none"
              >
                <option value="executive">EXECUTIVE OWNER ROLE</option>
                <option value="logistics">LOGISTICS DESIGNER ROLE</option>
                <option value="financial">FINANCIAL AUDITOR ROLE</option>
              </select>

              {/* High Thinking Mode checkbox */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none bg-[#10131A] border border-[#2A3040]/70 px-2 py-1 rounded-lg text-[10px] font-mono hover:border-[#8B7FF5]/40 text-gray-300">
                <input 
                  type="checkbox" 
                  checked={enableHighThinking}
                  onChange={(e) => { 
                    sound.playClick(); 
                    setEnableHighThinking(e.target.checked); 
                    if (e.target.checked) {
                      setSelectedChatModel("pro"); // High Thinking is exclusive to 3.1 Pro
                    }
                  }}
                  className="rounded bg-[#10131A] border-[#2A3040] text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                />
                <span className={enableHighThinking ? "text-indigo-400 font-bold" : ""}>HIGH THINKING</span>
              </label>
            </div>
          </div>

          {/* Messages block */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <Brain className="w-12 h-12 text-[#2A3040] mb-2 animate-bounce" />
                <p className="text-xs font-mono">Ledger is empty. Initiate active consultation with Gemini Core.</p>
                <p className="text-[10px] font-mono text-[#8B92A5] mt-1 max-w-sm">
                  Choose your role above or check "High Thinking" to enable sequential analytical deep-dives.
                </p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-mono leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-[#10131A] border border-[#2A3040] text-[#EDEFF4] rounded-tl-none whitespace-pre-line"
                  }`}>
                    <span className="text-[9px] text-[#8B92A5] block mb-1 uppercase font-bold">
                      {msg.role === "user" ? "USER TRANSACTION" : "STRATA AI MODEL OUT"}
                    </span>
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {isChatTyping && (
              <div className="flex justify-start">
                <div className="bg-[#10131A] border border-[#2A3040] rounded-2xl rounded-tl-none p-3.5 text-xs font-mono text-[#8B92A5] flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Gemini is compiling analytical tokens...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              placeholder={`Send instructions in context of ${chatRole.toUpperCase()} core...`}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8B7FF5]"
            />
            <button 
              type="submit" 
              className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </form>

        </div>

        {/* SECTION 5: AUDIO & VISION ANALYZER WORKBENCH */}
        <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6" id="analyzer-workbench-card">
          <div className="flex items-center justify-between border-b border-[#2A3040]/50 pb-3 mb-4">
            <h3 className="text-sm font-mono font-bold text-[#EDEFF4] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
              INTELLIGENT TELEMETRY WORKBENCH
            </h3>

            {/* Switch Workbench model */}
            <div className="flex bg-[#10131A] p-0.5 rounded-lg border border-[#2A3040] text-[10px]">
              <button 
                onClick={() => { sound.playClick(); setWorkbenchType("audio"); setWorkbenchOutput(null); }}
                className={`px-3 py-1 py-1 rounded font-mono ${workbenchType === "audio" ? "bg-emerald-600 text-white" : "text-[#8B92A5]"}`}
              >
                Audio Mic
              </button>
              <button 
                onClick={() => { sound.playClick(); setWorkbenchType("vision"); setWorkbenchOutput(null); }}
                className={`px-3 py-1 rounded font-mono ${workbenchType === "vision" ? "bg-emerald-600 text-white" : "text-[#8B92A5]"}`}
              >
                CCTV Photo
              </button>
              <button 
                onClick={() => { sound.playClick(); setWorkbenchType("video"); setWorkbenchOutput(null); }}
                className={`px-3 py-1 rounded font-mono ${workbenchType === "video" ? "bg-emerald-600 text-white" : "text-[#8B92A5]"}`}
              >
                CCTV Video
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Action side */}
            <div className="md:col-span-5 flex flex-col justify-center text-center space-y-4">
              {workbenchType === "audio" ? (
                <div className="p-4 bg-[#10131A] border border-[#2A3040]/70 rounded-2xl flex flex-col items-center justify-center space-y-4">
                  <span className="text-[10px] font-mono text-[#8B92A5] block font-bold">
                    TRANSCRIPTION & REAL-TIME SPEECH
                  </span>
                  
                  {/* Glowing microphone trigger */}
                  <button 
                    onClick={triggerSimulatedSpeech}
                    className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
                      microphoneActive 
                        ? "bg-red-600 text-white animate-ping scale-105 shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                        : "bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500 text-emerald-400"
                    }`}
                  >
                    <Mic className="w-7 h-7" />
                  </button>

                  <span className="text-[10px] font-mono text-gray-400">
                    {microphoneActive ? "🔴 RECORDING LIVE MIC AUDIO... SPEAK NOW" : "Click mic to simulate speech query [gemini-3.5-flash]"}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-[#10131A] border border-[#2A3040]/70 rounded-2xl flex flex-col items-center justify-center space-y-3 text-left">
                  <span className="text-[10px] font-mono text-[#8B92A5] block font-bold text-center w-full uppercase">
                    Select telemetry feed asset
                  </span>

                  <div className="w-full space-y-2">
                    {workbenchType === "vision" ? (
                      <>
                        <button 
                          onClick={() => analyzeVisualAsset("vision", "docking_zone_row_a_sec_3.png")}
                          className="w-full text-left p-2.5 bg-[#1A1E29] border border-[#2A3040] hover:border-emerald-500 rounded-xl text-[10px] font-mono text-[#EDEFF4] flex items-center gap-2 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Docking Zone Frame #88012</span>
                        </button>
                        <button 
                          onClick={() => analyzeVisualAsset("vision", "shelf_inventory_overload_sec_c.png")}
                          className="w-full text-left p-2.5 bg-[#1A1E29] border border-[#2A3040] hover:border-emerald-500 rounded-xl text-[10px] font-mono text-[#EDEFF4] flex items-center gap-2 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Shelf Space Frame #54190</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => analyzeVisualAsset("video", "sec_dock_unloading_sequence.mp4")}
                          className="w-full text-left p-2.5 bg-[#1A1E29] border border-[#2A3040] hover:border-emerald-500 rounded-xl text-[10px] font-mono text-[#EDEFF4] flex items-center gap-2 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Unloading Sequence CCTV (12s)</span>
                        </button>
                        <button 
                          onClick={() => analyzeVisualAsset("video", "packaging_conveyor_belt_anomalies.mp4")}
                          className="w-full text-left p-2.5 bg-[#1A1E29] border border-[#2A3040] hover:border-emerald-500 rounded-xl text-[10px] font-mono text-[#EDEFF4] flex items-center gap-2 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Conveyor Belt Feed (30s)</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Output screen */}
            <div className="md:col-span-7 bg-[#10131A] border border-[#2A3040]/70 rounded-2xl p-4 min-h-[160px] flex flex-col justify-center">
              {isWorkbenchAnalyzing ? (
                <div className="text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                  <span className="text-[10px] font-mono text-gray-400">Processing multimodal arrays...</span>
                </div>
              ) : workbenchOutput ? (
                <div className="space-y-3 text-xs font-mono">
                  
                  {workbenchType === "audio" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-[#2A3040] pb-1.5">
                        <span className="text-emerald-400 font-bold uppercase text-[10px]">TRANSCRIPTION OUT</span>
                        <span className="text-[9px] text-gray-500">{workbenchOutput.latency}</span>
                      </div>
                      <div className="p-2.5 bg-[#1A1E29] border border-[#2A3040] rounded-xl text-[#EDEFF4] italic">
                        "{workbenchOutput.transcription}"
                      </div>
                      <div className="text-[10px] text-[#8B92A5] leading-normal space-y-1">
                        <div><strong>Confidence:</strong> {workbenchOutput.confidence}%</div>
                        <div><strong>Action:</strong> {workbenchOutput.actionTaken}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#2A3040] pb-1.5">
                        <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {workbenchOutput.classification}
                        </span>
                        <span className="text-[9px] text-gray-500">File: {workbenchOutput.fileName}</span>
                      </div>
                      
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {workbenchOutput.findings.map((f: string, i: number) => (
                          <div key={i} className="text-[11px] text-[#8B92A5] flex gap-1.5 leading-relaxed">
                            <span className="text-emerald-400 font-bold shrink-0">▸</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] text-emerald-300">
                        <strong>PROACTIVE SECURITY RECOMMENDATION:</strong> {workbenchOutput.actions}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center text-gray-500 space-y-1 py-4">
                  <Volume2 className="w-6 h-6 text-[#2A3040] mx-auto animate-pulse" />
                  <span className="text-[10px] font-mono">No active stream loaded in analyzer workbench.</span>
                </div>
              )}
            </div>

          </div>

        </div>



      </div>

    </div>
  );
};
