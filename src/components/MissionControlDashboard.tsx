import React, { useState, useEffect, useRef } from "react";
import { sound } from "../utils/audio";
import { recentTimelineEvents, noCodeWorkflows, enterpriseProducts } from "../data";
import { demoPresets, DemoPreset } from "../data/demoPresets";
import { ProductItem, TimelineEvent, WorkflowRule, DashboardMode } from "../types";
import { DigitalTwin } from "./DigitalTwin";
import { Customer360 } from "./Customer360";
import { WorldMap } from "./WorldMap";
import { AiLab } from "./AiLab";
import { ExecutiveCommandCenter } from "./ExecutiveCommandCenter";
import { SmartScanCenter } from "./SmartScanCenter";
import { ERPProcessEngine } from "./ERPProcessEngine";
import { 
  Menu, Bell, Search, Cpu, Sparkles, LogOut, LayoutDashboard, 
  Package, Users, Map, Upload, Workflow, HelpCircle, Activity,
  Maximize2, Zap, Settings, RefreshCw, Send, ChevronRight, CheckCircle,
  Briefcase, MessageSquare, Plus, Brain, Command, Play, Check, ShieldAlert,
  Mail, Scan
} from "lucide-react";

interface MissionControlDashboardProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    businessName: string;
    industry: string;
    companySize: string;
    country: string;
    currency: string;
    goals: string[];
  };
  onLogout: () => void;
  activeTheme?: "light" | "dark";
  onChangeTheme?: (theme: "light" | "dark") => void;
}

export const MissionControlDashboard: React.FC<MissionControlDashboardProps> = ({ 
  userProfile, 
  onLogout,
  activeTheme = "dark",
  onChangeTheme
}) => {
  // Entrance loader
  const [isEntranceLoading, setIsEntranceLoading] = useState(true);
  const [loaderIndex, setLoaderIndex] = useState(0);
  const loaderLines = [
    "Connecting ERP core nodes...",
    "Reconciling physical warehouse inventory coordinates...",
    "Instantiating STRATA AI Neural Model layers...",
    "Establishing active local event bus links...",
    "Generating spatial Digital Twin shelf geometry...",
    "Mapping Customer 360 purchase chronological records...",
    "✓ Core Ready. Enterprise Operational."
  ];

  // Primary navigation tabs
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "DIGITAL_TWIN" | "CUSTOMER_360" | "MAP" | "UPLOAD" | "AI_LAB" | "SMART_SCAN" | "ERP_ENGINE">("DASHBOARD");

  // Shared Dynamic Health Orb States
  const [sharedOrbColor, setSharedOrbColor] = useState<"Green" | "Amber" | "Red" | "Violet">("Green");
  const [sharedHealthIndex, setSharedHealthIndex] = useState<number>(94);
  const [sharedConfidenceScore, setSharedConfidenceScore] = useState<number>(91);
  const [sharedInsights, setSharedInsights] = useState<string[]>([
    "Aggregate supply risk vectors indicate highly optimal buffer zones.",
    "B2B Account receivable collections display no significant overdue cycles.",
    "Vanguard physical digital twin tracks normal thermal state across standard warehouses.",
    "Suggest maintaining existing inventory reorder parameters."
  ]);

  // Dashboard Submode (Executive, Operations, Analyst)
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>("EXECUTIVE");

  // Demo Mode Preset States
  const [selectedPresetId, setSelectedPresetId] = useState<"RETAIL" | "MANUFACTURING" | "WAREHOUSE" | "MARKETING" | "FINANCE">("RETAIL");
  const activePreset = demoPresets[selectedPresetId];

  // State arrays populated from mock preset data
  const [products, setProducts] = useState<ProductItem[]>(demoPresets.RETAIL.products);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(demoPresets.RETAIL.timeline);
  const [journeySteps, setJourneySteps] = useState(demoPresets.RETAIL.journeySteps);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [rules, setRules] = useState<WorkflowRule[]>(noCodeWorkflows);

  // Presentation Mode state
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Report Generator States
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null);

  // Narrator States
  const [isNarrating, setIsNarrating] = useState(false);

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // AI Floating Copilot states
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Smart Upload states
  const [uploadDragActive, setUploadDragActive] = useState(false);
  const [uploadingFileDetails, setUploadingFileDetails] = useState<any | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [analystOutput, setAnalystOutput] = useState<any | null>(null);

  // Interactive Health Orb Color toggle based on active metric
  const [healthFactor, setHealthFactor] = useState<"REVENUE" | "INVENTORY" | "AI">("REVENUE");

  // On mount trigger entrance loader
  useEffect(() => {
    sound.playAIComplete();
    const interval = setInterval(() => {
      setLoaderIndex((prev) => {
        if (prev >= loaderLines.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsEntranceLoading(false);
            sound.playNotification();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K triggers Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sound.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Esc closes panels
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setIsAiOpen(false);
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    sound.playClick();
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const handleDashboardModeChange = (mode: DashboardMode) => {
    sound.playClick();
    setDashboardMode(mode);
    if (mode === "OPERATIONS") {
      setHealthFactor("INVENTORY");
    } else if (mode === "ANALYST") {
      setHealthFactor("AI");
    } else {
      setHealthFactor("REVENUE");
    }
  };

  // Log timeline event to active event bus
  const logToEventBus = (title: string, desc: string, category: TimelineEvent["category"]) => {
    const newEvent: TimelineEvent = {
      id: `EVT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title,
      category,
      description: desc,
      iconName: category === "INVENTORY" ? "Package" : "Brain"
    };
    setTimeline((prev) => [newEvent, ...prev]);
  };

  // Handle Preset Workspace Switch
  const simulationIntervalRef = useRef<any>(null);

  // Dynamic Follow-up Questions Helper
  const getDynamicFollowUps = () => {
    const lastUserMessage = [...aiChatHistory]
      .reverse()
      .find((chat) => chat.role === "user");
    
    if (lastUserMessage) {
      const qText = lastUserMessage.content.toLowerCase().trim();
      
      const matchedKey = Object.keys(activePreset.qaAnswers).find(
        (key) => key.toLowerCase().trim() === qText || qText.includes(key.toLowerCase().trim())
      );
      
      if (matchedKey && activePreset.qaAnswers[matchedKey]?.followUps) {
        return activePreset.qaAnswers[matchedKey].followUps;
      }
    }
    
    // Default fallback list of unasked predefined questions
    const defaultQs = [
      "Why did revenue decrease?",
      "Which warehouse has the highest stock?",
      "Who are my top customers?",
      "What should I reorder?",
      "Predict next month's sales.",
      "Generate an executive report."
    ];
    
    return defaultQs
      .filter((q) => !aiChatHistory.some((h) => h.content.toLowerCase().trim() === q.toLowerCase().trim()))
      .slice(0, 2);
  };

  const runJourneySimulation = () => {
    if (isSimulationRunning) return;
    setIsSimulationRunning(true);
    sound.playClick();
    
    // Reset steps
    const resetSteps = activePreset.journeySteps.map((step, idx) => ({
      ...step,
      status: idx === 0 ? ("active" as const) : ("pending" as const),
      time: idx === 0 ? "Active" : "Pending"
    }));
    setJourneySteps(resetSteps);

    let currentStepIndex = 0;

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    simulationIntervalRef.current = setInterval(() => {
      setJourneySteps((prevSteps) => {
        const nextSteps = prevSteps.map((s, idx) => {
          if (idx === currentStepIndex) {
            const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            return { ...s, status: "completed" as const, time: timeStr };
          } else if (idx === currentStepIndex + 1) {
            return { ...s, status: "active" as const, time: "In Progress" };
          }
          return s;
        });

        const completedStep = prevSteps[currentStepIndex];
        if (completedStep) {
          if (completedStep.title.toLowerCase().includes("barcode") || completedStep.title.toLowerCase().includes("scan")) {
            sound.playBarcodeScanned();
          } else if (completedStep.title.toLowerCase().includes("ai") || completedStep.title.toLowerCase().includes("analytics") || completedStep.title.toLowerCase().includes("intelligence")) {
            sound.playAIComplete();
          } else {
            sound.playNotification();
          }
          
          logToEventBus(
            completedStep.title,
            completedStep.desc,
            completedStep.title.toLowerCase().includes("ai") ? "AI_FORECAST" : "INVENTORY"
          );
        }

        return nextSteps;
      });

      currentStepIndex++;
      if (currentStepIndex >= activePreset.journeySteps.length) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
        setIsSimulationRunning(false);
        sound.playAIComplete();
        logToEventBus(
          "Journey Completed",
          "All steps of the business journey simulation have been executed and checked.",
          "SYSTEM"
        );
      }
    }, 2000);
  };

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  const handlePresetChange = (presetId: "RETAIL" | "MANUFACTURING" | "WAREHOUSE" | "MARKETING" | "FINANCE") => {
    sound.playAIComplete();
    setSelectedPresetId(presetId);
    const targetPreset = demoPresets[presetId];
    setProducts(targetPreset.products);
    setTimeline(targetPreset.timeline);
    setJourneySteps(targetPreset.journeySteps);
    setIsSimulationRunning(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setSharedHealthIndex(targetPreset.healthScore);
    setSharedConfidenceScore(targetPreset.confidenceScore);
    
    // Automatically log seed to central operations event bus
    logToEventBus(
      `${targetPreset.industry} Seeded`,
      `Successfully loaded and instantiated full Operational coordinates for ${targetPreset.businessName}.`,
      "SYSTEM"
    );
  };

  // One-click AI Report Generator with raw file draft & physical download
  const handleGenerateReport = (type: "PDF" | "PPT" | "EXCEL" | "SUMMARY") => {
    setIsGeneratingReport(type);
    sound.playUpload();

    setTimeout(() => {
      sound.playAIComplete();
      setIsGeneratingReport(null);

      // Create detailed file content
      let content = `==================================================\n`;
      content += `   STRATA AI COGNITIVE EXECUTIVE REPORT: ${activePreset.businessName}\n`;
      content += `   FORMAT: ${type} | INDUSTRY: ${activePreset.industry}\n`;
      content += `   TIMESTAMP: ${new Date().toISOString()}\n`;
      content += `==================================================\n\n`;
      content += `I. FINANCIAL & OPERATIONAL SCOREBOARD\n`;
      content += `--------------------------------------------------\n`;
      content += `- Net Revenue: ${activePreset.revenue} (${activePreset.revenueChange})\n`;
      content += `- Gross Profit: ${activePreset.grossProfit} (${activePreset.grossProfitChange})\n`;
      content += `- Operating Margin: ${activePreset.operatingMargin}\n`;
      content += `- Liquid Reserves: ${activePreset.cashFlow}\n`;
      content += `- Central Health Score: ${activePreset.healthScore}% / 100% (NOMINAL)\n`;
      content += `- AI Prediction Confidence: ${activePreset.confidenceScore}%\n\n`;
      content += `II. PHYSICAL WAREHOUSE ASSETS & SKUs\n`;
      content += `--------------------------------------------------\n`;
      activePreset.products.forEach(p => {
        content += `- SKU: ${p.sku} | Name: ${p.name}\n`;
        content += `  Physical Stock Level: ${p.stockLevel} units (Safety Limit: ${p.reorderPoint})\n`;
        content += `  Staging Coordinate: Rack ${p.rack}, Shelf ${p.shelf}, Bin ${p.bin}\n`;
        content += `  Primary Supplier: ${p.supplier}\n\n`;
      });
      content += `III. COGNITIVE ALGORITHMIC ANALYSIS\n`;
      content += `--------------------------------------------------\n`;
      content += `1. LOGISTICS RE-ROUTE: Move safety buffer acquisitions to SuperMicro Logistics to bypass Silicon Dynamics supply delays (+${activePreset.delayDays || 5} days lag).\n`;
      content += `2. ACCRUED B2B RECEIVABLES: Mitigate risk levels by triggering automatic reminders to client accounts exhibiting rising drift variation.\n\n`;
      content += `==================================================\n`;
      content += `   END OF EXECUTIVE ACTION DIRECTIVE\n`;
      content += `==================================================\n`;

      const element = document.createElement("a");
      const file = new Blob([content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `strata_executive_${activePreset.id.toLowerCase()}_report_${type.toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Log success incident
      logToEventBus(
        `AI Report Generated (${type})`,
        `Exported performance spreadsheets and slides summary. saved locally.`,
        "AUTOMATION"
      );
    }, 1500);
  };

  // Professional Business Narrator (HTML5 Speech API)
  const handleExplainMyBusiness = () => {
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    sound.playAIComplete();
    setIsNarrating(true);

    const speechText = activePreset.narrationText;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95; 
    utterance.pitch = 1.0;

    // Load professional sounding english voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsNarrating(false);
    };

    utterance.onerror = () => {
      setIsNarrating(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // High-fidelity pre-engineered business questions handler
  const sendPreDefinedQuestion = async (question: string) => {
    sound.playClick();
    setAiChatHistory((prev) => [...prev, { role: "user", content: question }]);
    setIsAiTyping(true);

    let responseText = "";
    const q = question.toLowerCase();

    if (q.includes("why did revenue decrease") || q.includes("revenue decrease")) {
      responseText = `📉 **STRATA Cognitive Revenue Diagnostics**\n\nFor **${activePreset.businessName}**, revenue indicators logged a minor deviation due to:\n1. **Vendor Congestion**: Logistics alerts indicate a **${activePreset.delayDays || 5}-day supplier lag** re-routing incoming raw materials.\n2. **Inventory Safety Thresholds**: **${activePreset.stockAlertsCount || 2} SKU bottlenecks** triggered reorder alerts, temporarily slowing outbound staging.\n\n*Strategic Directive:* Deploy reserve supplies via alternative carriers inside the Operations Hub to mitigate delivery latency.`;
    } else if (q.includes("warehouse has the highest stock") || q.includes("highest stock")) {
      responseText = `🏭 **STRATA Digital Twin Inventory Audit**\n\nPhysical scan telemetry confirms:\n- **Warehouse East Hub (Rack R-12)** holds the highest current inventory density (**84% space occupancy**).\n- Primary SKU in focus: **${activePreset.products[0]?.name || "Apex Pro Laptop"}** with **${activePreset.products[0]?.stockLevel || 12} units** staged.\n\n*Action:* Initiate cross-docking sweeps to secondary depots to prevent local freight congestion.`;
    } else if (q.includes("who are my top customers") || q.includes("top customer")) {
      responseText = `🏆 **STRATA CRM Account Ledger [Top Partners]**\n\nOur top-performing B2B partner accounts are:\n1. **AeroSpace Logistics Tech** (Calculated LTV: **₹14.8M** | Order Cycle: **1.6 orders/mo** | Churn Risk: **4%**)\n2. **NexaGlobal Operations** (Calculated LTV: **₹4.8M** | Order Cycle: **2.4 orders/mo** | Churn Risk: **18%**)\n\n*Predictive Recommendation:* Prepare proactive contract extension parameters for AeroSpace Tech's upcoming cycle.`;
    } else if (q.includes("what should i reorder") || q.includes("reorder")) {
      responseText = `📦 **STRATA Intelligent Procurement Assistant**\n\nBased on safety stock limits (reorder thresholds):\n- **SKU: ${activePreset.products[0]?.sku || "SKU-LAP-9020"} (${activePreset.products[0]?.name || "Apex Pro Laptop"})** is down to **${activePreset.products[0]?.stockLevel || 12} units** (Threshold level is ${activePreset.products[0]?.reorderPoint || 20}).\n\n*Action Suggested:* Tap 'Approve PO' on the central operations deck to auto-dispatch standard REST requests to suppliers.`;
    } else if (q.includes("predict next month's sales") || q.includes("predict") || q.includes("sales")) {
      responseText = `🔮 **STRATA AI Predictive Analytics Engine**\n\n- **Projected Sales Volume**: **+15.4% monthly expansion rate**.\n- **Forecast Margin**: Net revenue is projected to rise by **${activePreset.revenueChange}**, matching historical seasonal peaks.\n- **Model Confidence Score**: **${activePreset.confidenceScore}%**.\n\n*Operational Buffer Action:* Maintain safety reserves at 120% of standard baseline values.`;
    } else if (q.includes("generate an executive report") || q.includes("executive report") || q.includes("report")) {
      responseText = `📄 **STRATA AI Executive Report Compiled**\n\nI have successfully drafted the performance overview spreadsheet for **${activePreset.businessName}**!\n- **Overall Business Health**: **${activePreset.healthScore}% (OPTIMAL)**\n- **Operating Margin**: ${activePreset.operatingMargin}\n- **Total Cash Reserves**: ${activePreset.cashFlow}\n\n*Action:* You can download the physical spreadsheet or presentation deck directly by clicking **GENERATE REPORT** on the top command deck!`;
    } else {
      // Proxy to real backend Gemini route if query is unique
      try {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            history: aiChatHistory,
            context: {
              workspaceName: activePreset.businessName,
              healthScore: `${activePreset.healthScore}%`,
              activeRole: "Executive Owner",
              mode: dashboardMode
            }
          })
        });
        const data = await response.json();
        responseText = data.text;
      } catch (err) {
        responseText = `🤖 **STRATA AI Assistant [Failsafe]**\n\nI am processing operational coordinates for **${activePreset.businessName}**. Overall health stands at **${activePreset.healthScore}%** with **${activePreset.confidenceScore}%** confidence score. All systems operating nominally.`;
      }
    }

    setTimeout(() => {
      sound.playAIComplete();
      setAiChatHistory((prev) => [...prev, { role: "model", content: responseText }]);
      setIsAiTyping(false);
    }, 1000);
  };

  // Upgraded AI Chat submission
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userText = aiMessage.trim();
    setAiMessage("");
    sendPreDefinedQuestion(userText);
  };

  // Smart Upload Handling
  const handleSmartUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFilePayload(e.dataTransfer.files[0]);
    }
  };

  const processFilePayload = async (file: File) => {
    sound.playUpload();
    setIsAnalyzingFile(true);
    setUploadingFileDetails({ name: file.name, size: file.size });

    // Read small text sample
    const reader = new FileReader();
    reader.onload = async (event) => {
      const textSample = event.target?.result as string;
      try {
        const response = await fetch("/api/gemini/analyze-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || "text/csv",
            fileContent: textSample || "Mock database matrix parameters"
          })
        });
        const data = await response.json();
        sound.playAIComplete();
        setAnalystOutput(data);
        logToEventBus(
          "Smart File Analyzed",
          `Processed Bulk data: ${file.name}. Classification: ${data.detectedType}.`,
          "SYSTEM"
        );
      } catch (err) {
        // Fallback simulated metrics if network is isolated
        setAnalystOutput({
          detectedType: "Operational CSV Sheet",
          confidence: 96,
          insights: [
            "Parsed and normalized 14 new SKU safety levels.",
            "Flagged 1 price difference threshold discrepancy.",
            "Synced metadata with active CRM ledger profiles."
          ],
          kpis: { totalRecords: 85, anomalies: 1, suggestedActions: "Validate import ledger or update reorder index" }
        });
      } finally {
        setIsAnalyzingFile(false);
      }
    };
    reader.readAsText(file.slice(0, 15000));
  };

  // Keyboard Command Palette actions
  const executeCommand = (cmd: string) => {
    sound.playClick();
    setIsCommandPaletteOpen(false);

    if (cmd === "EXECUTIVE") {
      handleDashboardModeChange("EXECUTIVE");
    } else if (cmd === "OPERATIONS") {
      handleDashboardModeChange("OPERATIONS");
    } else if (cmd === "ANALYST") {
      handleDashboardModeChange("ANALYST");
    } else if (cmd === "CO_OP") {
      setIsAiOpen(true);
    } else if (cmd === "SCAN") {
      handleTabChange("DIGITAL_TWIN");
    } else if (cmd === "MAP") {
      handleTabChange("MAP");
    } else if (cmd === "CRM") {
      handleTabChange("CUSTOMER_360");
    } else if (cmd === "REPORT") {
      sound.playAIComplete();
      alert(`[STRATA AI Report Generator] Compiled Q3 Executive Operational Briefing of ${userProfile.businessName}. Saved locally.`);
    }
  };

  if (isEntranceLoading) {
    return (
      <div className="fixed inset-0 bg-[#10131A] z-50 flex flex-col items-center justify-center p-6" id="entrance-loader-root">
        <div className="max-w-lg w-full space-y-6 text-center">
          <span className="text-3xl font-display font-black text-[#EDEFF4] tracking-widest block animate-pulse">
            STRATA
          </span>
          <p className="text-xs font-mono text-[#8B92A5] uppercase tracking-widest">
            Strategic Real-Time Analytics & Autonomous Operations
          </p>
          
          <div className="space-y-2 border border-[#2A3040]/50 bg-[#1A1E29]/50 p-4 rounded-xl min-h-[140px] text-left font-mono text-xs text-[#8B92A5]">
            {loaderLines.slice(0, loaderIndex + 1).map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 text-indigo-200">
                <span className="text-[#8B7FF5]">▸</span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#8B92A5]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Establishing secure cloud Sandbox...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#10131A] text-[#EDEFF4] flex ${
      activeTheme === "light" ? "theme-light" : "theme-dark"
    }`} id="mission-control-root">
      
      {/* 1. Left collapsible sidebar */}
      {!isPresentationMode && (
        <aside className={`bg-[#1A1E29] border-r border-[#2A3040] flex flex-col justify-between transition-all duration-300 z-30 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}>
          <div>
            {/* Header brand name */}
            <div className="p-4 border-b border-[#2A3040]/60 flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-display font-black tracking-wider text-[#EDEFF4]">STRATA</span>
                  <span className="text-[9px] font-mono bg-indigo-500/10 text-[#8B7FF5] px-1.5 py-0.5 rounded">V4</span>
                </div>
              )}
              <button
                onClick={() => { sound.playClick(); setIsSidebarCollapsed(!isSidebarCollapsed); }}
                className="p-1 rounded bg-[#10131A] border border-[#2A3040] text-[#8B92A5] hover:text-[#EDEFF4] mx-auto"
                id="btn-toggle-sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1.5">
              {[
                { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
                { id: "AI_LAB", label: "AI Intelligence Lab", icon: Brain },
                { id: "SMART_SCAN", label: "Smart Ingest & Scan", icon: Scan },
                { id: "ERP_ENGINE", label: "ERP Process Engine", icon: Briefcase },
                { id: "DIGITAL_TWIN", label: "Digital Twin 3D", icon: Package },
                { id: "CUSTOMER_360", label: "Customer 360", icon: Users },
                { id: "MAP", label: "Global Radar Map", icon: Map },
                { id: "UPLOAD", label: "Data Ingestion", icon: Upload }
              ].map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleTabChange(link.id as any)}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono flex items-center gap-3 transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-[#8B92A5] hover:text-[#EDEFF4] hover:bg-[#10131A]/40"
                    }`}
                    title={link.label}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>{link.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar bottom panel */}
          <div className="p-3 border-t border-[#2A3040]/50 space-y-2">
            {!isSidebarCollapsed && (
              <div className="bg-[#10131A] p-2.5 rounded-xl border border-[#2A3040]/40">
                <span className="text-[9px] font-mono text-[#8B92A5] block">ACTIVE WORKSPACE</span>
                <span className="text-xs font-semibold text-[#EDEFF4] block truncate mt-0.5">
                  {userProfile.businessName}
                </span>
              </div>
            )}

            <button
              onClick={() => { sound.playClick(); setIsLogoutConfirmOpen(true); }}
              className="w-full p-2 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
              id="btn-sidebar-logout"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Term. Session</span>}
            </button>
          </div>
        </aside>
      )}

      {/* 2. Main content block */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Command Bar */}
        {!isPresentationMode && (
          <header className="bg-[#1A1E29] border-b border-[#2A3040] h-16 px-6 flex items-center justify-between relative z-20">
            
            {/* Left search Ctrl+K prompt */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => { sound.playClick(); setIsCommandPaletteOpen(true); }}
                className="bg-[#10131A] border border-[#2A3040] hover:border-[#8B92A5] rounded-xl px-4 py-2 text-xs text-[#8B92A5] flex items-center gap-3 w-40 md:w-56 transition-colors text-left"
                id="btn-global-search"
              >
                <Search className="w-4 h-4" />
                <span>Search index...</span>
                <span className="ml-auto bg-[#1A1E29] border border-[#2A3040] text-[10px] font-mono px-1.5 py-0.5 rounded">
                  Ctrl + K
                </span>
              </button>

              {/* Workspace Preset Selector */}
              <div className="hidden lg:flex items-center gap-2 bg-[#10131A] border border-[#2A3040] rounded-xl px-3 py-1.5">
                <span className="text-[9px] font-mono text-[#8B92A5] uppercase tracking-wider font-bold">WORKSPACE PRESET:</span>
                <select
                  value={selectedPresetId}
                  onChange={(e) => handlePresetChange(e.target.value as any)}
                  className="bg-transparent text-xs font-mono text-indigo-400 font-bold focus:outline-none cursor-pointer border-none"
                  id="header-preset-selector"
                >
                  <option value="RETAIL" className="bg-[#10131A] text-white">Retail & Logistics (Apex Retailers)</option>
                  <option value="MANUFACTURING" className="bg-[#10131A] text-white">Heavy Manufacturing (Titan Industries)</option>
                  <option value="WAREHOUSE" className="bg-[#10131A] text-white">Dynamic Warehousing (Vanguard Hub)</option>
                  <option value="MARKETING" className="bg-[#10131A] text-white">Digital Marketing (Nexa Creative)</option>
                  <option value="FINANCE" className="bg-[#10131A] text-white">Enterprise Finance (Aegis Capital)</option>
                </select>
              </div>
            </div>

          {/* Right quick controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Actions Mode Toggles (when on DASHBOARD view) */}
            {activeTab === "DASHBOARD" && (
              <div className="hidden md:flex bg-[#10131A] p-1 rounded-xl border border-[#2A3040] text-[10px]">
                {(["EXECUTIVE", "OPERATIONS", "ANALYST"] as DashboardMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleDashboardModeChange(mode)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                      dashboardMode === mode
                        ? "bg-[#2A3040] text-white"
                        : "text-[#8B92A5] hover:text-[#EDEFF4]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}

            {/* Notification triggers */}
            <div className="relative">
              <button
                onClick={() => { sound.playClick(); setIsNotificationOpen(!isNotificationOpen); }}
                className="p-2 rounded-xl bg-[#10131A] border border-[#2A3040] text-[#8B92A5] hover:text-[#EDEFF4] relative"
                id="btn-header-notif"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-4 shadow-2xl z-40 space-y-3 font-mono text-xs">
                  <h4 className="font-bold border-b border-[#2A3040] pb-1.5 text-indigo-400">
                    NOTIFICATIONS LOG
                  </h4>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <span className="text-[10px] text-red-400 font-bold block">LOW STOCK INCIDENT</span>
                      <p className="text-[11px] text-[#EDEFF4] mt-0.5 leading-tight">
                        Apex Pro Laptop fell below safety point (12/20 units).
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <span className="text-[10px] text-yellow-400 font-bold block">SUPPLIER DELAY</span>
                      <p className="text-[11px] text-[#EDEFF4] mt-0.5 leading-tight">
                        Microchips transit delayed by 5 days from Taiwan.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { sound.playClick(); setIsProfileOpen(!isProfileOpen); }}
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8B7FF5] to-indigo-600 flex items-center justify-center font-display font-semibold text-xs text-white"
                id="btn-header-profile"
              >
                {userProfile.firstName[0]}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-4 shadow-2xl z-40 space-y-3">
                  <div className="border-b border-[#2A3040] pb-2.5">
                    <h4 className="text-xs font-display font-bold text-[#EDEFF4]">
                      {userProfile.firstName} {userProfile.lastName}
                    </h4>
                    <span className="text-[10px] font-mono text-[#8B92A5] block truncate">
                      {userProfile.email}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[10px] font-mono text-[#8B92A5]">
                    <div className="flex justify-between">
                      <span>Job Title:</span>
                      <span className="text-[#EDEFF4]">Corporate Director</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span className="text-[#EDEFF4]">{userProfile.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Region Server:</span>
                      <span className="text-indigo-400">Asia-SE-1 (HQ)</span>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="border-t border-[#2A3040] pt-3 mt-2">
                    <span className="text-[9px] font-mono text-[#8B92A5] block uppercase mb-2 font-bold tracking-wider">STRATA THEME PALETTE</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "dark", label: "🌌 Dark Mode", colors: "Corporate Slate & Indigo" },
                        { id: "light", label: "☀️ Light Mode", colors: "Clean Professional White" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            if (onChangeTheme) {
                              onChangeTheme(t.id as any);
                            }
                          }}
                          className={`w-full p-2 border text-left rounded-xl transition-all ${
                            activeTheme === t.id
                              ? "bg-indigo-600/15 border-indigo-500 text-indigo-400 font-bold"
                              : "bg-[#10131A]/40 border-[#2A3040] text-[#8B92A5] hover:border-[#8B92A5] hover:text-[#EDEFF4]"
                          }`}
                        >
                          <div className="text-[10px] font-mono flex items-center justify-between">
                            <span>{t.label}</span>
                            {activeTheme === t.id && (
                              <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[3]" />
                            )}
                          </div>
                          <span className="text-[8px] opacity-60 font-mono block mt-0.5">{t.colors}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </header>
        )}

        {/* 3. Subview Page Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === "DASHBOARD" && (
            <div className="space-y-6 animate-fadeIn">
              
              {dashboardMode === "EXECUTIVE" ? (
                <ExecutiveCommandCenter 
                  onTimelineLogged={logToEventBus} 
                  onTabChange={handleTabChange} 
                  activePreset={activePreset}
                  isPresentationMode={isPresentationMode}
                  onTogglePresentationMode={() => { sound.playClick(); setIsPresentationMode(!isPresentationMode); }}
                  onGenerateReport={handleGenerateReport}
                  isGeneratingReport={isGeneratingReport}
                  onExplainMyBusiness={handleExplainMyBusiness}
                  isNarrating={isNarrating}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. GLOWING HEALTH ORB BENTO PANEL */}
                <div className="lg:col-span-4 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[300px]" id="dashboard-health-orb-card">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,127,245,0.06)_0%,transparent_70%)] pointer-events-none" />
                  
                  <div>
                    <h3 className="text-xs font-mono font-bold text-[#8B92A5] uppercase tracking-wider">
                      BUSINESS HEALTH INDEX
                    </h3>
                    <span className="text-[10px] font-mono text-indigo-400 mt-1 block">
                      STRATA Real-time AI Telemetry
                    </span>
                  </div>

                  {/* 3D Glowing sphere */}
                  <div 
                    onClick={() => {
                      sound.playClick();
                      setActiveTab("AI_LAB");
                    }}
                    className={`h-36 w-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-700 select-none animate-pulse ${
                      sharedOrbColor === "Green"
                        ? "bg-gradient-to-br from-emerald-600/30 to-emerald-950/20 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                        : sharedOrbColor === "Amber"
                        ? "bg-gradient-to-br from-amber-600/30 to-amber-950/20 border-2 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                        : sharedOrbColor === "Red"
                        ? "bg-gradient-to-br from-red-600/30 to-red-950/20 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
                        : "bg-gradient-to-br from-violet-600/30 to-violet-950/20 border-2 border-violet-500 shadow-[0_0_50px_rgba(139,127,245,0.5)]"
                    }`}
                  >
                    <span className="text-3.5xl font-mono font-black text-white">
                      {sharedHealthIndex}%
                    </span>
                    <span className="text-[8px] font-mono text-gray-300 tracking-widest mt-1">
                      {sharedOrbColor.toUpperCase()} STATE
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-[#EDEFF4] font-medium block">
                      AI Confidence: <strong className="text-indigo-400">{sharedConfidenceScore}%</strong>
                    </span>
                    <span className="text-[9px] font-mono text-[#8B92A5] block mt-0.5 underline hover:text-indigo-300 cursor-pointer" onClick={() => { sound.playClick(); setActiveTab("AI_LAB"); }}>
                      Click to calibrate in AI Lab
                    </span>
                  </div>
                </div>

                {/* 2. FLOATING STRATA AI COGNITIVE CORE PANEL */}
                <div className="lg:col-span-4 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-[#2A3040]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-mono font-bold text-[#EDEFF4]">
                        STRATA COGNITIVE AI CORE
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400">● Live 12 Models Online</span>
                  </div>

                  {/* AI Status Indicators */}
                  <div className="py-4 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#8B7FF5] animate-ping" />
                      <span className="text-xs font-mono text-[#8B92A5]">Active prompt analysis...</span>
                    </div>

                    <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]/60 text-xs font-mono text-indigo-200">
                      <span className="text-[10px] text-indigo-400 font-bold block mb-1">PROACTIVE FORECAST</span>
                      <span>Estimated computing accessories demand spike detected for next month. Recommend ordering 15 additional safety units of SKU-LAP-9020.</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { sound.playClick(); setIsAiOpen(true); }}
                    className="w-full py-2.5 bg-[#10131A] hover:bg-[#8B7FF5] border border-[#2A3040] hover:border-[#8B7FF5] rounded-xl text-xs font-mono font-bold text-[#8B7FF5] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    ENGAGE FULL AI COPILOT
                  </button>
                </div>

                {/* 3. CORE SUB-MODE DETAILS SWITCHER PANEL (Executive Summary vs Warehouse tables vs Analyst charts) */}
                <div className="lg:col-span-4 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
                  {dashboardMode === "EXECUTIVE" && (
                    <div className="space-y-4 animate-fadeIn flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] font-mono text-[#8B92A5] block">EXECUTIVE MODE ACTIVE</span>
                        <h4 className="text-base font-display font-bold text-[#EDEFF4] mt-1">
                          Enterprise Narrative Summary
                        </h4>
                        <p className="text-xs text-[#8B92A5] leading-relaxed mt-2">
                          Apex Distribution corporate revenue grew <strong className="text-emerald-400">12% MoM</strong>. Cash reserves are highly healthy at $3.5M. However, physical computer hardware supply chain exhibits a bottleneck in Warehouse East due to delays from microchip manufacturers.
                        </p>
                      </div>

                      <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]/60 text-[10px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span>Liquid Cash reserves:</span>
                          <span className="text-[#EDEFF4]">$3.5M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outstanding B2B limits:</span>
                          <span className="text-[#F0A93A]">$12,400</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {dashboardMode === "OPERATIONS" && (
                    <div className="space-y-4 animate-fadeIn flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 block">✓ OPERATIONS MODE ACTIVE</span>
                        <h4 className="text-base font-display font-bold text-[#EDEFF4] mt-1">
                          Smart Warehouse Tracking
                        </h4>
                        <p className="text-xs text-[#8B92A5] leading-relaxed mt-2">
                          Track inventory limits and trigger fast coordinate sweeps. Current physical stock safety bounds indicate 2 SKUs require attention.
                        </p>
                      </div>

                      <button
                        onClick={() => handleTabChange("DIGITAL_TWIN")}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold transition-all"
                      >
                        OPEN DIGITAL TWIN RACK MAP
                      </button>
                    </div>
                  )}

                  {dashboardMode === "ANALYST" && (
                    <div className="space-y-4 animate-fadeIn flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] font-mono text-[#8B7FF5] block">ANALYST MODE ACTIVE</span>
                        <h4 className="text-base font-display font-bold text-[#EDEFF4] mt-1">
                          Quantitative SQL Workbench
                        </h4>
                        <p className="text-xs text-[#8B92A5] leading-relaxed mt-2">
                          Query the Intelligence Hub directly. Drag or drop Excel data logs into ingestion to generate predictive demand charts instantly.
                        </p>
                      </div>

                      <button
                        onClick={() => handleTabChange("UPLOAD")}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-all"
                      >
                        LAUNCH SCHEMAS INGESTION
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

              {/* World Map section rendered on main tab */}
              <WorldMap />

              {/* FEATURE: Business Journey Timeline */}
              <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A3040] pb-2">
                  <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-[#8B7FF5]" />
                    LIVE TRANSACTION JOURNEY PIPELINE (REAL-TIME STEPPER)
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={runJourneySimulation}
                      disabled={isSimulationRunning}
                      className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                        isSimulationRunning
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/15"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isSimulationRunning ? "animate-spin" : ""}`} />
                      {isSimulationRunning ? "Simulating..." : "Simulate Journey"}
                    </button>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      ● ACTIVE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {journeySteps.map((step) => {
                    const isCompleted = step.status === "completed";
                    const isActive = step.status === "active";

                    return (
                      <div
                        key={step.id}
                        className={`p-3 rounded-xl border font-mono transition-all relative ${
                          isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/30 text-[#EDEFF4]"
                            : isActive
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 animate-pulse"
                            : "bg-[#10131A] border-[#2A3040] text-[#8B92A5] opacity-65"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold text-[#8B92A5]">{step.time}</span>
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isActive ? (
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#2A3040]" />
                          )}
                        </div>
                        <h4 className={`text-[10px] font-bold tracking-tight ${isCompleted ? "text-emerald-400" : isActive ? "text-[#8B7FF5]" : "text-[#8B92A5]"}`}>
                          {step.title}
                        </h4>
                        <p className="text-[9px] text-[#8B92A5] leading-snug mt-1 line-clamp-2" title={step.desc}>
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event Timeline Logging Section */}
              <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-[#2A3040] pb-2">
                  <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    UNIFIED ENTERPRISE EVENT BUS REAL-TIME STREAM
                  </h3>
                  <span className="text-[10px] font-mono text-[#8B92A5]">
                    {timeline.length} transactions in local log index
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {timeline.map((event) => (
                    <div key={event.id} className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]/50 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8B92A5]">{event.time}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          event.category === "INVENTORY" ? "bg-[#F0A93A]/10 text-[#F0A93A]" :
                          event.category === "AI_FORECAST" ? "bg-violet-500/10 text-violet-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {event.category}
                        </span>
                        <div>
                          <span className="text-[#EDEFF4] font-bold block">{event.title}</span>
                          <span className="text-[#8B92A5] text-[10px] block mt-0.5">{event.description}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400">● PROCESSED</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === "AI_LAB" && (
            <div className="animate-fadeIn">
              <AiLab 
                userProfile={userProfile}
                logToEventBus={logToEventBus}
                sharedOrbColor={sharedOrbColor}
                setSharedOrbColor={setSharedOrbColor}
                sharedHealthIndex={sharedHealthIndex}
                setSharedHealthIndex={setSharedHealthIndex}
                sharedConfidenceScore={sharedConfidenceScore}
                setSharedConfidenceScore={setSharedConfidenceScore}
                sharedInsights={sharedInsights}
                setSharedInsights={setSharedInsights}
              />
            </div>
          )}


          {activeTab === "SMART_SCAN" && (
            <div className="animate-fadeIn">
              <SmartScanCenter 
                onTimelineLogged={logToEventBus} 
                productsList={products} 
                setProductsList={setProducts} 
                selectedPresetId={selectedPresetId}
                activePreset={activePreset}
              />
            </div>
          )}

          {activeTab === "ERP_ENGINE" && (
            <div className="animate-fadeIn">
              <ERPProcessEngine 
                onTimelineLogged={logToEventBus} 
                productsList={products} 
                setProductsList={setProducts} 
              />
            </div>
          )}

          {activeTab === "DIGITAL_TWIN" && (
            <div className="animate-fadeIn">
              <DigitalTwin 
                onProductUpdated={(p) => {
                  // Keep products list in sync
                  const idx = products.findIndex(pItem => pItem.sku === p.sku);
                  if (idx !== -1) {
                    const next = [...products];
                    next[idx] = p;
                    setProducts(next);
                  }
                }}
                onTimelineLogged={logToEventBus}
              />
            </div>
          )}

          {activeTab === "CUSTOMER_360" && (
            <div className="animate-fadeIn">
              <Customer360 />
            </div>
          )}

          {activeTab === "MAP" && (
            <div className="animate-fadeIn space-y-6">
              <WorldMap />
              <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5">
                <h3 className="text-xs font-mono font-bold text-[#EDEFF4] mb-3 uppercase tracking-wider">
                  RADAR STATUS DIAGNOSTICS
                </h3>
                <p className="text-xs text-[#8B92A5] leading-relaxed">
                  Supply logistics routes mapped via secure mock telemetry feeds. Intermittent delay alert: Baltic sea lanes and European shipping channels exhibit an average +4.2 days transit drift. Automatic route re-planning has been scheduled inside active operations rules.
                </p>
              </div>
            </div>
          )}

          {activeTab === "UPLOAD" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6">
                <h3 className="text-base font-display font-bold text-[#EDEFF4] mb-2">
                  Intelligence Hub Ingestion Center
                </h3>
                <p className="text-xs text-[#8B92A5] mb-6">
                  Drop operational CSV sheets, financial records, supplier invoices, or raw PDF contract assets directly. Our server-side model automatically normalizes indices, registers anomalies, and populates your workspace dashboards.
                </p>

                {/* Drop zone area */}
                <div
                  onDragEnter={(e) => { e.preventDefault(); setUploadDragActive(true); }}
                  onDragOver={(e) => { e.preventDefault(); setUploadDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setUploadDragActive(false); }}
                  onDrop={handleSmartUploadDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all flex flex-col items-center justify-center ${
                    uploadDragActive
                      ? "border-[#8B7FF5] bg-[#8B7FF5]/5"
                      : "border-[#2A3040] hover:border-[#8B92A5]"
                  }`}
                >
                  <Upload className="w-10 h-10 text-[#8B7FF5] mb-3" />
                  <span className="text-sm font-mono text-[#EDEFF4] block font-bold mb-1">
                    Drag and drop dataset files here
                  </span>
                  <span className="text-xs font-mono text-[#8B92A5] block mb-4">
                    Supports .CSV, .XLSX, .PDF, .JSON (Max file size 10MB)
                  </span>

                  <label className="px-5 py-2 bg-[#10131A] border border-[#2A3040] rounded-xl text-xs font-mono text-[#EDEFF4] cursor-pointer hover:bg-[#1A1E29] transition-all">
                    SELECT FILE FROM COMPUTER
                    <input
                      type="file"
                      onChange={(e) => e.target.files && processFilePayload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Ingestion results panel */}
                {isAnalyzingFile && (
                  <div className="mt-6 p-4 bg-[#10131A] rounded-xl border border-[#2A3040] text-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#8B7FF5] mx-auto" />
                    <span className="text-xs font-mono text-[#EDEFF4] block font-bold">
                      STRATA DOCUMENT INTELLIGENCE RUNNING...
                    </span>
                    <span className="text-[10px] font-mono text-[#8B92A5] block">
                      Reconstructing ledger keys against active model vectors.
                    </span>
                  </div>
                )}

                {!isAnalyzingFile && analystOutput && (
                  <div className="mt-6 p-5 bg-[#10131A] rounded-xl border border-emerald-500/30 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-[#2A3040] pb-2.5 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                          ✓ SCHEMAS PARSED SUCCESSFULLY
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8B92A5]">
                        Confidence Match: {analystOutput.confidence}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                      <div className="space-y-3 col-span-2">
                        <span className="text-[10px] text-indigo-400 font-bold block uppercase">
                          MAPPED CATEGORY: {analystOutput.detectedType}
                        </span>
                        <div className="space-y-2">
                          {analystOutput.insights.map((insight: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-[#8B7FF5] shrink-0">▸</span>
                              <p className="text-[#EDEFF4] leading-relaxed">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#1A1E29] p-4 rounded-xl border border-[#2A3040] space-y-3">
                        <span className="text-[10px] text-[#8B92A5] block font-bold">NORMALIZATION INDEX</span>
                        <div>
                          <span className="text-[10px] text-[#8B92A5] block">RECORDS READ:</span>
                          <span className="text-sm font-bold text-[#EDEFF4]">{analystOutput.kpis?.totalRecords} Rows</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8B92A5] block">FLAGGED ANOMALIES:</span>
                          <span className="text-sm font-bold text-[#F0A93A]">{analystOutput.kpis?.anomalies} variances</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8B92A5] block">RECOMMENDED NEXT ACTION:</span>
                          <span className="text-[11px] text-indigo-300 block leading-tight mt-0.5">{analystOutput.kpis?.suggestedActions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Automation block removed */}

        </main>
      </div>

      {/* 4. Global VS-Code Keyboard Command Palette (Ctrl+K overlay) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-[#10131A]/85 backdrop-blur-md flex items-start justify-center pt-24 z-50">
          <div className="bg-[#1A1E29] border border-[#2A3040] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
            <div className="p-4 border-b border-[#2A3040] flex items-center gap-3 bg-[#10131A]">
              <Command className="w-4 h-4 text-[#8B7FF5]" />
              <input
                type="text"
                placeholder="Type operational command or view..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="bg-transparent flex-1 focus:outline-none text-[#EDEFF4]"
                autoFocus
              />
            </div>

            <div className="p-2 max-h-60 overflow-y-auto">
              {[
                { name: "Switch to Executive Mode (CEO Overview)", trigger: "EXECUTIVE" },
                { name: "Switch to Operations Mode (Warehouse / Barcode)", trigger: "OPERATIONS" },
                { name: "Switch to Analyst Mode (Analytics / Charts)", trigger: "ANALYST" },
                { name: "Open Digital Twin shelf locator", trigger: "SCAN" },
                { name: "Open global supply chains radar map", trigger: "MAP" },
                { name: "Open central Customer 360 CRM", trigger: "CRM" },
                { name: "Generate Board Powerpoint Report summary", trigger: "REPORT" },
                { name: "Engage floating AI Copilot Assistant", trigger: "CO_OP" }
              ].filter(c => c.name.toLowerCase().includes(commandQuery.toLowerCase())).map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => executeCommand(c.trigger)}
                  className="w-full p-2.5 rounded-lg text-left text-[#8B92A5] hover:text-[#EDEFF4] hover:bg-[#10131A]/60 flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING AI COPILOT CHATBOT (Bottom Right Orb) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAiOpen ? (
          <button
            onClick={() => { sound.playClick(); setIsAiOpen(true); }}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#8B7FF5] to-indigo-600 hover:from-[#7B6FE5] hover:to-indigo-500 shadow-2xl border-2 border-[#EDEFF4]/10 flex items-center justify-center text-white relative animate-float transition-all cursor-pointer"
            id="btn-floating-ai"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#10131A]" />
          </button>
        ) : (
          <div className="bg-[#1A1E29] border border-[#2A3040] w-80 md:w-96 h-[480px] rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn" id="chatbot-panel">
            {/* Chat header */}
            <div className="p-4 bg-[#10131A] border-b border-[#2A3040] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#8B7FF5]" />
                <div>
                  <span className="text-xs font-mono font-bold text-[#EDEFF4] block">STRATA COGNITIVE ASSISTANT</span>
                  <span className="text-[9px] font-mono text-[#8B92A5] block">Powered by Gemini 3.5</span>
                </div>
              </div>
              <button
                onClick={() => { sound.playClick(); setIsAiOpen(false); }}
                className="text-[#8B92A5] hover:text-[#EDEFF4] text-xs font-mono"
                id="btn-chatbot-close"
              >
                [CLOSE]
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[340px]">
              {aiChatHistory.length === 0 && (
                <div className="text-center py-4 space-y-2">
                  <Sparkles className="w-5 h-5 text-[#8B7FF5] mx-auto animate-spin-slow" />
                  <p className="text-[10px] font-mono text-[#8B92A5] px-2">
                    Ask me any high-level financial or operational intelligence questions about our active business workspace.
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 pt-2 max-h-[220px] overflow-y-auto px-1">
                    {[
                      "Why did revenue decrease?",
                      "Which warehouse has the highest stock?",
                      "Who are my top customers?",
                      "What should I reorder?",
                      "Predict next month's sales.",
                      "Generate an executive report."
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendPreDefinedQuestion(q)}
                        className="text-[10px] font-mono bg-[#10131A] border border-[#2A3040]/70 p-2 rounded-xl text-[#EDEFF4] hover:border-[#8B7FF5] text-left transition-all hover:bg-indigo-950/20"
                      >
                        ⚡ "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {aiChatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    chat.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-[#10131A] border border-[#2A3040] text-[#EDEFF4] rounded-bl-none font-mono"
                  }`}>
                    {chat.content}
                  </div>
                </div>
              ))}

               {aiChatHistory.length > 0 && !isAiTyping && (
                <div className="pt-2 border-t border-[#2A3040]/40 space-y-1">
                  <span className="text-[9px] font-mono text-[#8B92A5] block uppercase font-bold tracking-widest">Suggested Follow-ups:</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {getDynamicFollowUps().map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendPreDefinedQuestion(q)}
                        className="text-[9px] font-mono bg-[#10131A] border border-[#2A3040] hover:border-[#8B7FF5] px-2 py-1 rounded-lg text-[#8B7FF5] text-left transition-colors font-semibold shadow-sm"
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#10131A] border border-[#2A3040] p-2.5 rounded-xl text-xs font-mono text-[#8B92A5]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin inline-block mr-1.5" />
                    STRATA AI is processing...
                  </div>
                </div>
              )}
            </div>

            {/* Chat entry form */}
            <form onSubmit={handleSendAiMessage} className="p-3 border-t border-[#2A3040] bg-[#10131A] flex gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                className="flex-1 bg-[#1A1E29] border border-[#2A3040] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8B7FF5] transition-colors text-white"
                id="input-chatbot-text"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#8B7FF5] hover:bg-[#7B6FE5] text-white"
                id="btn-chatbot-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 6. LOGOUT CONFIRMATION MODAL */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-[#10131A]/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <h4 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">
              CONFIRM SESSION TERMINATION
            </h4>
            <p className="text-xs text-[#8B92A5] leading-relaxed">
              Are you sure you want to log out and clear active session indices? This will save workspace preferences before closing WebSockets.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { sound.playClick(); setIsLogoutConfirmOpen(false); }}
                className="flex-1 py-2 rounded-xl bg-[#10131A] border border-[#2A3040] text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4]"
                id="btn-logout-cancel"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLogoutConfirmOpen(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono"
                id="btn-logout-confirm"
              >
                TERMINATE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default MissionControlDashboard;
