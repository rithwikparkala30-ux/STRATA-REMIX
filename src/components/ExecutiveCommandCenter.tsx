import React, { useState } from "react";
import { sound } from "../utils/audio";
import { DemoPreset } from "../data/demoPresets";
import { 
  TrendingUp, DollarSign, Wallet, ShieldCheck, Heart, UserCheck, 
  Sparkles, AlertCircle, FileCheck2, Activity, Zap, BarChart3, ArrowUpRight, Scale,
  Eye, EyeOff, FileText, Download, Play, Square, RefreshCw
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

interface ExecutiveCommandCenterProps {
  onTimelineLogged?: (title: string, desc: string, category: "INVENTORY" | "AI_FORECAST" | "SALES" | "AUTOMATION" | "SYSTEM") => void;
  onTabChange?: (tab: "DASHBOARD" | "DIGITAL_TWIN" | "CUSTOMER_360" | "MAP" | "UPLOAD" | "AI_LAB" | "GMAIL" | "SMART_SCAN" | "ERP_ENGINE") => void;
  activePreset: DemoPreset;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onGenerateReport: (type: "PDF" | "PPT" | "EXCEL" | "SUMMARY") => void;
  isGeneratingReport: string | null;
  onExplainMyBusiness: () => void;
  isNarrating: boolean;
}

export const ExecutiveCommandCenter: React.FC<ExecutiveCommandCenterProps> = ({ 
  onTimelineLogged,
  onTabChange,
  activePreset,
  isPresentationMode,
  onTogglePresentationMode,
  onGenerateReport,
  isGeneratingReport,
  onExplainMyBusiness,
  isNarrating
}) => {
  // Executive state defaults synced with active Preset
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(1);

  // Simulated live event list
  const [businessEvents, setBusinessEvents] = useState([
    { id: "EV-01", desc: `SLA contract DEL-88402 fully signed with ${activePreset.products[0]?.supplier || "SuperMicro Logistics"}`, status: "NOMINAL" },
    { id: "EV-02", desc: `R&D Systems logged high priority purchase request (PR-2026-001) for ${activePreset.products[0]?.name || "Apex Laptop"}`, status: "ATTENTION" },
    { id: "EV-03", desc: `Accounts receivable invoice generated for client of ${activePreset.businessName}`, status: "NOMINAL" }
  ]);

  // Handle live approval directly from Executive Command Center
  const handleApprovePending = () => {
    sound.playAIComplete();
    setPendingApprovalsCount(0);
    setBusinessEvents(prev => [
      { id: `EV-${Date.now()}`, desc: `Executive approved and dispatched purchase order for ${activePreset.products[0]?.name || "Apex Laptop"} (Qty: 15)`, status: "NOMINAL" },
      ...prev
    ]);
    if (onTimelineLogged) {
      onTimelineLogged(
        "Executive Approval Authenticated",
        `Approved pending ${activePreset.businessName} procurement request.`,
        "SYSTEM"
      );
    }
  };

  // 12 KPI metrics with custom AI explanations, actual preset values, and confidence percentages
  const metrics = [
    { label: "Net Revenue", value: activePreset.revenue, change: activePreset.revenueChange, aiExplanation: "Driven by seasonal B2B contract renewals", confidence: "98%", icon: DollarSign, color: "text-emerald-400" },
    { label: "Gross Profit", value: activePreset.grossProfit, change: activePreset.grossProfitChange, aiExplanation: "Cost optimization bounds verified", confidence: "96%", icon: TrendingUp, color: "text-indigo-400" },
    { label: "Operating Margin", value: activePreset.operatingMargin, change: "+2.1%", aiExplanation: "Overhead index completely nominal", confidence: "94%", icon: BarChart3, color: "text-[#8B7FF5]" },
    { label: "Liquid Cash Flow", value: activePreset.cashFlow, change: "Highly Liquid", aiExplanation: "General ledger balances reconciled", confidence: "99%", icon: Wallet, color: "text-emerald-400" },
    { label: "Working Capital", value: activePreset.id === "RETAIL" ? "₹1.85M" : "$1.85M", change: "+4.5%", aiExplanation: "Assets vs liabilities ratio ideal", confidence: "95%", icon: Scale, color: "text-indigo-300" },
    { label: "Active Inventory", value: `${activePreset.products.reduce((acc, p) => acc + p.stockLevel, 0)} units`, change: `${activePreset.products.length} SKUs`, aiExplanation: "Staging rack spaces safe", confidence: "97%", icon: Zap, color: "text-[#F0A93A]" },
    { label: "Customer CSAT", value: `${activePreset.csat} / 5.0`, change: "99% SLA Met", aiExplanation: "Exceptional courier dispatch score", confidence: "96%", icon: Heart, color: "text-red-400" },
    { label: "ESG Index", value: "94.2%", change: "Tier-1", aiExplanation: "Optimized carbon logistics offset", confidence: "92%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Employee Index", value: "98.5%", change: "Stable", aiExplanation: "Shift efficiency bounds maximized", confidence: "91%", icon: UserCheck, color: "text-emerald-400" },
    { label: "Compliance Rate", value: "100%", change: "Audit Ok", aiExplanation: "Legal contracts audit clear", confidence: "99%", icon: FileCheck2, color: "text-indigo-400" },
    { label: "Risk Index", value: activePreset.riskIndex, change: "Optimal", aiExplanation: "No critical structural failure risk", confidence: "95%", icon: AlertCircle, color: "text-[#8B7FF5]" },
  ];

  // Performance Chart mapped to active preset
  const rawRev = parseFloat(activePreset.revenue.replace(/[^0-9.]/g, '')) * 1000000 || 2400000;
  const rawProfit = parseFloat(activePreset.grossProfit.replace(/[^0-9.]/g, '')) * 1000000 || 1480000;
  const rawCash = parseFloat(activePreset.cashFlow.replace(/[^0-9.]/g, '')) * 1000000 || 920000;

  const executivePerformanceChart = [
    { week: "Wk 1", revenue: Math.round(rawRev * 0.45), profit: Math.round(rawProfit * 0.4), cash: Math.round(rawCash * 0.3) },
    { week: "Wk 2", revenue: Math.round(rawRev * 0.65), profit: Math.round(rawProfit * 0.55), cash: Math.round(rawCash * 0.5) },
    { week: "Wk 3", revenue: Math.round(rawRev * 0.55), profit: Math.round(rawProfit * 0.48), cash: Math.round(rawCash * 0.42) },
    { week: "Wk 4", revenue: Math.round(rawRev * 0.85), profit: Math.round(rawProfit * 0.8), cash: Math.round(rawCash * 0.7) },
    { week: "Wk 5", revenue: Math.round(rawRev * 0.72), profit: Math.round(rawProfit * 0.68), cash: Math.round(rawCash * 0.6) },
    { week: "Wk 6", revenue: Math.round(rawRev), profit: Math.round(rawProfit), cash: Math.round(rawCash) }
  ];

  return (
    <div className="space-y-6 animate-fadeIn" id="executive-command-center-module">
      
      {/* Dynamic Action Ribbons for Hackathon Demo Mode */}
      <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase">STRATA HACKATHON EXECUTIVE CONTROLS</h4>
            <p className="text-[10px] text-[#8B92A5] font-mono mt-0.5">High-impact actions to demonstrate STRATA capabilities to judges live.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Explain My Business (60s speech synthesis) */}
          <button
            onClick={onExplainMyBusiness}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              isNarrating 
                ? "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500"
            }`}
            id="btn-explain-business"
            title="Narrates your company's operational and financial status using synthesized voice."
          >
            {isNarrating ? (
              <>
                <Square className="w-3.5 h-3.5 fill-red-400" />
                STOP NARRATION
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                EXPLAIN BUSINESS IN 60s
              </>
            )}
          </button>

          {/* Toggle Presentation Mode */}
          <button
            onClick={onTogglePresentationMode}
            className="px-4 py-2 bg-[#10131A] hover:bg-[#1A1E29] border border-[#2A3040] rounded-xl text-xs font-mono font-bold text-[#EDEFF4] transition-all flex items-center gap-2"
            id="btn-toggle-presentation"
          >
            {isPresentationMode ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                EXIT PRESENTATION MODE
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-indigo-400" />
                EXECUTIVE PRESENTATION MODE
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Narration Audio Spectrum Visualizer */}
      {isNarrating && (
        <div className="bg-[#1A1E29]/80 border border-red-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 h-6 items-end">
              <span className="w-1 bg-red-400 animate-bounce h-4" style={{ animationDelay: "0.1s" }} />
              <span className="w-1 bg-red-400 animate-bounce h-6" style={{ animationDelay: "0.2s" }} />
              <span className="w-1 bg-red-400 animate-bounce h-3" style={{ animationDelay: "0.3s" }} />
              <span className="w-1 bg-red-400 animate-bounce h-5" style={{ animationDelay: "0.4s" }} />
              <span className="w-1 bg-red-400 animate-bounce h-2" style={{ animationDelay: "0.5s" }} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#EDEFF4] block">STRATA VOICEOVER NARRATIVE ENGINE ACTIVE</span>
              <span className="text-[10px] font-mono text-[#8B92A5] block">Broadcasting operational telemetry briefing via HTML5 speech synthesis...</span>
            </div>
          </div>
          <button
            onClick={onExplainMyBusiness}
            className="text-[10px] font-mono px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
          >
            Mute Narrator
          </button>
        </div>
      )}

      {/* 11 Interactive KPI bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#1A1E29] border border-[#2A3040] hover:border-indigo-500/30 rounded-2xl p-4 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold text-[#8B92A5] uppercase tracking-wider">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color} transition-transform group-hover:scale-110`} />
              </div>

              <div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-mono font-bold text-[#EDEFF4]">{m.value}</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">{m.change}</span>
                </div>
                {/* Confidence Meter Badge */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-indigo-500/10 text-indigo-400 rounded">
                    AI Confidence: {m.confidence}
                  </span>
                </div>
                {/* AI Explanation Text */}
                <span className="text-[9px] font-mono text-indigo-300 block mt-2 border-t border-[#2A3040]/50 pt-1.5 leading-normal italic">
                  ⚡ AI: {m.aiExplanation}
                </span>
              </div>
            </div>
          );
        })}

        {/* Dynamic Business Health Score Card (Category Breakdown) */}
        <div className="col-span-2 bg-gradient-to-br from-[#1E1938] to-[#1A1E29] border-2 border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">BUSINESS HEALTH SCORE</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-mono text-indigo-300 font-bold">EXCELLENT</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">{activePreset.healthScore}%</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ STRATA VERIFIED</span>
          </div>

          <div className="space-y-1.5 border-t border-[#2A3040] pt-2.5 mt-2">
            <span className="text-[8px] font-mono text-[#8B92A5] block uppercase tracking-wider font-semibold">COGNITIVE COMPONENT INDEX METERS:</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px] font-mono text-[#EDEFF4]">
              {activePreset.healthMetrics.map((met, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[7.5px]">
                    <span className="text-[#8B92A5] truncate max-w-[90px]">{met.category}</span>
                    <span className="text-indigo-400">{met.score}%</span>
                  </div>
                  <div className="w-full bg-[#10131A] rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${met.color}`} 
                      style={{ width: `${met.score}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts + Executive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Performance chart (Left) */}
        <div className="lg:col-span-8 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">6-Week Cumulative Executive Performance Chart</h3>
              <p className="text-xs text-[#8B92A5] mt-0.5">Dual-axis modeling of Net Revenue, Gross Profit, and Liquidity Cash Flow trends.</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold flex items-center gap-1 shrink-0 self-start md:self-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> REVENUE RECORD PEAK
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executivePerformanceChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B7FF5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B7FF5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                <XAxis dataKey="week" stroke="#8B92A5" fontSize={10} />
                <YAxis stroke="#8B92A5" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1E29", border: "1px solid #2A3040" }} labelStyle={{ color: "#EDEFF4" }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" name="Cumulative Revenue" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" name="Gross Profit" dataKey="profit" stroke="#8B7FF5" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Business Event Ticker & Approvals (Right) */}
        <div className="lg:col-span-4 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* One-click Report Generator Panel */}
            <div className="border-b border-[#2A3040] pb-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider">
                  ONE-CLICK AI REPORT GENERATOR
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <button
                  onClick={() => onGenerateReport("PDF")}
                  disabled={isGeneratingReport !== null}
                  className="p-2 bg-[#10131A] hover:bg-indigo-600/10 border border-[#2A3040] hover:border-indigo-500 rounded-lg text-left transition-all flex items-center gap-1.5 text-[#EDEFF4]"
                >
                  <Download className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="truncate">Export PDF</span>
                </button>
                <button
                  onClick={() => onGenerateReport("PPT")}
                  disabled={isGeneratingReport !== null}
                  className="p-2 bg-[#10131A] hover:bg-indigo-600/10 border border-[#2A3040] hover:border-indigo-500 rounded-lg text-left transition-all flex items-center gap-1.5 text-[#EDEFF4]"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">Export PowerPoint</span>
                </button>
                <button
                  onClick={() => onGenerateReport("EXCEL")}
                  disabled={isGeneratingReport !== null}
                  className="p-2 bg-[#10131A] hover:bg-indigo-600/10 border border-[#2A3040] hover:border-indigo-500 rounded-lg text-left transition-all flex items-center gap-1.5 text-[#EDEFF4]"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Export Excel Ledger</span>
                </button>
                <button
                  onClick={() => onGenerateReport("SUMMARY")}
                  disabled={isGeneratingReport !== null}
                  className="p-2 bg-[#10131A] hover:bg-indigo-600/10 border border-[#2A3040] hover:border-indigo-500 rounded-lg text-left transition-all flex items-center gap-1.5 text-[#EDEFF4]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Executive Summary</span>
                </button>
              </div>

              {isGeneratingReport && (
                <div className="mt-3.5 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-2 text-[9px] font-mono text-indigo-300">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400 shrink-0" />
                  <span>Generating {isGeneratingReport} corporate briefing ledger...</span>
                </div>
              )}
            </div>
            
            {/* Quick Actions / Approvals */}
            <div>
              <div className="flex items-center gap-1.5 border-b border-[#2A3040] pb-2.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <h3 className="text-[11px] font-mono font-bold text-[#EDEFF4] uppercase tracking-wider">
                  PENDING ACTIONS
                </h3>
              </div>

              {pendingApprovalsCount > 0 ? (
                <div className="bg-[#10131A] border border-indigo-500/20 p-3 rounded-xl space-y-2.5">
                  <div>
                    <span className="text-[9px] font-mono text-[#8B92A5] block">REQ TYPE: PROCUREMENT ORDER</span>
                    <strong className="text-[11px] font-mono text-[#EDEFF4] mt-0.5 block">PR-2026-001 (Size: 15)</strong>
                    <p className="text-[9px] font-mono text-[#8B92A5] leading-relaxed mt-1">
                      Authorize bulk inventory acquisition contract. Projected impact: <strong className="text-white">{activePreset.id === "RETAIL" ? "₹14.8M" : "$32,499.75"}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleApprovePending}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-xl transition-all"
                  >
                    AUTHORIZE CONTRACT DISPATCH
                  </button>
                </div>
              ) : (
                <div className="bg-[#10131A] p-3 rounded-xl text-center text-[10px] font-mono text-[#8B92A5] border border-[#2A3040]/50">
                  <span>✓ All procurement contract lines synchronized. No pending actions.</span>
                </div>
              )}
            </div>

            {/* Live Event Ticker */}
            <div>
              <div className="flex items-center gap-1.5 border-b border-[#2A3040] pb-2.5 mb-2.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#EDEFF4] uppercase">
                  LIVE INCIDENTS / ALERTS
                </span>
              </div>

              <div className="space-y-2">
                {businessEvents.map((evt, i) => (
                  <div key={evt.id || i} className="bg-[#10131A] border border-[#2A3040]/70 rounded-xl p-2.5 text-[10px] font-mono space-y-0.5">
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-indigo-400 font-bold">{evt.id || "EVENT"}</span>
                      <span className={`px-1 py-0.2 rounded text-[7.5px] font-bold ${
                        evt.status === "ATTENTION" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                    <p className="text-[#EDEFF4] leading-relaxed">{evt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-[#2A3040] pt-3 mt-4">
            <div className="flex justify-between text-[9px] font-mono text-[#8B92A5]">
              <span>STRATA COMMAND SYSTEM</span>
              <span className="text-emerald-400">● REAL-TIME DIRECT LOGS</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

