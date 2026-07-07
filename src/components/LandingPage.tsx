import React, { useState, useEffect } from "react";
import { sound } from "../utils/audio";
import { 
  Sparkles, Terminal, Activity, ArrowRight, ShieldCheck, 
  Layers, Cpu, Server, Network, Barcode, TrendingUp, HelpCircle
} from "lucide-react";

interface LandingPageProps {
  onAction: (actionType: "LOGIN" | "REGISTER" | "GUEST") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAction }) => {
  const [activeTab, setActiveTab] = useState(0);

  const rotateTabs = ["Retail", "Manufacturing", "Finance & Hedge", "Logistics", "Marketing & CRM"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % rotateTabs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotateTabs.length]);

  const handleButtonClick = (action: "LOGIN" | "REGISTER" | "GUEST") => {
    sound.playClick();
    onAction(action);
  };

  const showcaseCards = [
    {
      title: "AI Command Center",
      desc: "Simulate what-if parameters and let our neural nodes write strategic summaries.",
      icon: Cpu,
      color: "text-violet-400"
    },
    {
      title: "Smart Operations",
      desc: "Instant shelf assignment coordinates with integrated barcode scanner simulations.",
      icon: Server,
      color: "text-[#F0A93A]"
    },
    {
      title: "Business Operations",
      desc: "Unified ledger accounts mapping. Updates propagate instantly across entire event bus.",
      icon: Layers,
      color: "text-emerald-400"
    },
    {
      title: "Digital Twin 3D Layout",
      desc: "Spatial virtual racks mapping exact coordinates (Warehouse -> Shelf -> Rack -> Bin -> SKU).",
      icon: Network,
      color: "text-sky-400"
    },
    {
      title: "Intelligence Hub",
      desc: "Full pivot and drift filters. Generates PowerPoint slide desks and contract summaries with one click.",
      icon: TrendingUp,
      color: "text-indigo-400"
    },
    {
      title: "Smart Barcode Scanner",
      desc: "Synthesized audio feedback, instant stock level increment and customer ledger sync.",
      icon: Barcode,
      color: "text-teal-400"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#10131A] overflow-hidden flex flex-col justify-between" id="landing-page-root">
      {/* Background glowing particles/circles */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#8B7FF5] opacity-[0.03] blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500 opacity-[0.02] blur-3xl" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1E29_1px,transparent_1px),linear-gradient(to_bottom,#1A1E29_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-[#2A3040]/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl font-display font-black text-[#EDEFF4] tracking-wider">
            STRATA
          </span>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-[#8B7FF5] border border-indigo-500/20 px-2 py-0.5 rounded-full">
            ENTERPRISE OS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleButtonClick("LOGIN")}
            className="text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] px-4 py-2 transition-colors"
            id="btn-landing-signin"
          >
            SIGN IN
          </button>
          <button
            onClick={() => handleButtonClick("REGISTER")}
            className="text-xs font-mono bg-[#8B7FF5] hover:bg-[#7B6FE5] text-[#EDEFF4] px-4 py-2 rounded-xl transition-all font-semibold"
            id="btn-landing-getstarted"
          >
            GET STARTED
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left copy text block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#1A1E29] border border-[#2A3040] rounded-full px-3 py-1 text-xs text-[#8B92A5]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Driven Enterprise Autopilot Inception</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-[#EDEFF4] tracking-tight leading-none">
            Strategic Analytics & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B7FF5] via-indigo-400 to-emerald-400">
              Autonomous Operations
            </span>
          </h1>

          <p className="text-base text-[#8B92A5] max-w-xl leading-relaxed">
            One Platform. Every Decision. Unified cloud-scale operating system bridging real-time inventory pipelines, embedded ERP books, spatial digital twins, and executive decision algorithms.
          </p>

          {/* Interactive Rotating Sector Tab */}
          <div className="flex items-center gap-3 text-xs font-mono bg-[#1A1E29] border border-[#2A3040] p-3 rounded-xl max-w-md">
            <Terminal className="w-4 h-4 text-[#8B7FF5]" />
            <span className="text-[#8B92A5]">STRATA Engine adapted for:</span>
            <div className="font-bold text-indigo-400 transition-all duration-300">
              {rotateTabs[activeTab].toUpperCase()}
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => handleButtonClick("REGISTER")}
              className="px-6 py-3.5 bg-gradient-to-r from-[#8B7FF5] to-indigo-600 hover:from-[#7B6FE5] hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2"
              id="btn-cta-getstarted"
            >
              PROVISION WORKSPACE
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleButtonClick("GUEST")}
              className="px-6 py-3.5 bg-[#1A1E29] hover:bg-[#2A3040] border border-[#2A3040] text-xs font-mono font-bold tracking-wider rounded-xl transition-all flex items-center gap-2"
              id="btn-cta-guest"
            >
              LAUNCH GUEST DEMO
            </button>
          </div>
        </div>

        {/* Right Floating Dashboard Glassmorphic mockup */}
        <div className="lg:col-span-5 relative">
          <div className="bg-[#1A1E29]/80 border border-[#2A3040] rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-float">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-mono text-[#8B92A5]">APEX-OS CORE V4.1</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8B92A5] block">BUSINESS HEALTH INDEX</span>
                  <span className="text-xl font-mono font-bold text-[#EDEFF4] block mt-0.5">94% (EXCELLENT)</span>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin-slow flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040]/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B92A5]">Connected Warehouses:</span>
                  <span className="font-mono text-[#EDEFF4]">2 Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B92A5]">Inbound Barcodes Syncing:</span>
                  <span className="font-mono text-indigo-400">99.8% accurate</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B92A5]">AI Cognitive Predictions:</span>
                  <span className="font-mono text-emerald-400">Recalibrated 4m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#2A3040]/40">
        <h3 className="text-center text-xs font-mono font-bold text-[#8B92A5] mb-8 uppercase tracking-widest">
          STRATA OPERATING ADVANTAGES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseCards.map((card, i) => (
            <div
              key={i}
              className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5 hover:border-[#8B7FF5] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h4 className="text-sm font-display font-bold text-[#EDEFF4] mb-1.5">
                  {card.title}
                </h4>
                <p className="text-xs text-[#8B92A5] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-[#2A3040]/20 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#8B92A5] gap-4">
        <span>© 2026 STRATA Technologies Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#EDEFF4]">DOCUMENTATION</a>
          <a href="#" className="hover:text-[#EDEFF4]">RELEASE LOG</a>
          <a href="#" className="hover:text-[#EDEFF4]">SYSTEM SECURITY</a>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
