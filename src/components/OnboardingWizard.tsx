import React, { useState } from "react";
import { sound } from "../utils/audio";
import { 
  Building2, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, 
  Sparkles, FileText, Upload, RefreshCw, Layers, Check, HelpCircle
} from "lucide-react";

interface OnboardingWizardProps {
  userEmail?: string;
  onComplete: (onboardingData: {
    businessName: string;
    industry: string;
    companySize: string;
    currency: string;
    country: string;
    enabledModules: string[];
    uploadedFileName?: string;
  }) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ userEmail, onComplete }) => {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("Apex Logistics & Retailing");
  const [industry, setIndustry] = useState("Retail & Warehousing");
  const [companySize, setCompanySize] = useState("100-500 employees");
  const [currency, setCurrency] = useState("USD ($)");
  const [country, setCountry] = useState("United States");
  
  const [modules, setModules] = useState({
    inventory: true,
    erp: true,
    analytics: true,
    ai: true,
    automation: true,
    barcode: true,
    digitalTwin: true
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleNextStep = () => {
    sound.playClick();
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const activeModulesList = Object.keys(modules).filter((k) => modules[k as keyof typeof modules]);
      onComplete({
        businessName,
        industry,
        companySize,
        currency,
        country,
        enabledModules: activeModulesList,
        uploadedFileName: uploadedFile || undefined
      });
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleModule = (modName: keyof typeof modules) => {
    sound.playClick();
    setModules((prev) => ({
      ...prev,
      [modName]: !prev[modName]
    }));
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileUpload(file.name);
    }
  };

  const simulateFileUpload = (name: string) => {
    sound.playUpload();
    setIsUploading(true);
    setUploadPercent(0);

    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile(name);
          sound.playAIComplete();
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const industriesList = [
    { name: "Retail & Warehousing", desc: "Omnichannel inventory distribution & supply lines" },
    { name: "Manufacturing", desc: "Advanced fabrication, Bill of Materials, and machine IoT integration" },
    { name: "Finance & Hedge Support", desc: "Accounts ledger normalization & quantitative forecasting models" },
    { name: "Marketing & CRM", desc: "LTV expansion tracking, segmentation, and social voice integrations" },
    { name: "Distribution & Farming", desc: "Agronomic data routing, yield projections, and cold-chain logs" }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 md:p-8 shadow-2xl relative" id="onboarding-wizard">
      {/* Absolute floating decorations */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#8B7FF5] opacity-[0.03] rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500 opacity-[0.03] rounded-full blur-2xl" />

      {/* Progress Line */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-[#8B92A5] uppercase tracking-wider">
            WORKSPACE PROVISIONING PROGRESS
          </span>
          <span className="text-xs font-mono text-[#8B7FF5] font-bold">
            STEP {step} OF 6
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#10131A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B7FF5] to-indigo-500 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content switch */}
      <div className="min-h-[300px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B7FF5] to-indigo-600 flex items-center justify-center text-white mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-[#EDEFF4]">
              Initialize your STRATA Enterprise Core
            </h2>
            <p className="text-sm text-[#8B92A5] leading-relaxed">
              Welcome to STRATA—the Strategic Real-Time Analytics & Autonomous Operations system. We are setting up an isolated virtual tenant sandbox linked to your account <strong className="text-indigo-400">{userEmail || "rithwikparkala30@gmail.com"}</strong>.
            </p>
            <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040]/60 space-y-2 text-xs font-mono text-[#8B92A5]">
              <div className="flex items-center gap-2 text-[#EDEFF4]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Auto-indexing Intelligence Hub interfaces</span>
              </div>
              <div className="flex items-center gap-2 text-[#EDEFF4]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instantiating cloud-hosted AI model clusters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8B7FF5] animate-ping" />
                <span>Ready to construct specific physical Digital Twin structures</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg md:text-xl font-display font-bold text-[#EDEFF4]">
              Operational Profile Specifications
            </h2>
            <p className="text-xs text-[#8B92A5] mb-4">
              Define the baseline structural boundaries of your enterprise. This configuration drives active ledger schemas and localized currency format rules.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] focus:outline-none focus:border-[#8B7FF5] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Corporate Headquarters</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Primary Currency</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Company Scale</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] focus:outline-none"
                >
                  <option>1-50 employees (Venture stage)</option>
                  <option>50-100 employees (Expansion scale)</option>
                  <option>100-500 employees (Enterprise level)</option>
                  <option>500+ employees (Global Fortune-500 scale)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg md:text-xl font-display font-bold text-[#EDEFF4]">
              Select Sector Alignment
            </h2>
            <p className="text-xs text-[#8B92A5] mb-4">
              STRATA adapts its automated workflows, recommendations, and AI personalities to match your targeted sector parameters.
            </p>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {industriesList.map((ind) => (
                <button
                  key={ind.name}
                  onClick={() => {
                    setIndustry(ind.name);
                    sound.playClick();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex justify-between items-center ${
                    industry === ind.name
                      ? "bg-[#8B7FF5]/10 border-[#8B7FF5]"
                      : "bg-[#10131A] border-[#2A3040] hover:border-[#8B92A5]"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-display font-bold text-[#EDEFF4]">
                      {ind.name}
                    </h4>
                    <p className="text-[10px] text-[#8B92A5] mt-0.5">
                      {ind.desc}
                    </p>
                  </div>
                  {industry === ind.name && (
                    <div className="h-4 w-4 rounded-full bg-[#8B7FF5] flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg md:text-xl font-display font-bold text-[#EDEFF4]">
              Enable Operating Modules
            </h2>
            <p className="text-xs text-[#8B92A5] mb-4">
              Select which structural interfaces will be injected into your dashboard. You can alter these options inside workspace preferences later.
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {Object.keys(modules).map((mName) => {
                const label = mName.toUpperCase();
                const isEnabled = modules[mName as keyof typeof modules];
                return (
                  <button
                    key={mName}
                    onClick={() => toggleModule(mName as any)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isEnabled
                        ? "bg-[#10131A] border-[#8B7FF5] text-[#EDEFF4]"
                        : "bg-[#10131A] border-[#2A3040] text-[#8B92A5] opacity-50"
                    }`}
                  >
                    <span className="text-xs font-mono font-medium">{label} MODULE</span>
                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                      isEnabled ? "bg-[#8B7FF5] border-[#8B7FF5]" : "border-[#2A3040]"
                    }`}>
                      {isEnabled && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg md:text-xl font-display font-bold text-[#EDEFF4]">
              Intelligence Hub Ingestion (Optional)
            </h2>
            <p className="text-xs text-[#8B92A5] mb-4">
              Upload existing CSV lists, PDF contracts, or Excel warehouse records. STRATA AI will identify data keys, map SKU parameters, and seed the active digital twin layout.
            </p>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center ${
                dragActive
                  ? "border-[#8B7FF5] bg-[#8B7FF5]/5"
                  : uploadedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-[#2A3040] hover:border-[#8B92A5]"
              }`}
            >
              {isUploading ? (
                <div className="space-y-3 py-6 flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-[#8B7FF5] animate-spin" />
                  <span className="text-xs font-mono text-[#EDEFF4] block">
                    UPLOADING & ANALYZING SCHEMAS: {uploadPercent}%
                  </span>
                  <div className="w-48 h-1 bg-[#10131A] rounded-full overflow-hidden">
                    <div className="bg-[#8B7FF5] h-full transition-all duration-200" style={{ width: `${uploadPercent}%` }} />
                  </div>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-2 py-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 block font-bold">
                    ✓ FILE INGESTION COMPLETED
                  </span>
                  <span className="text-[11px] font-mono text-[#8B92A5] block">
                    Mapped: {uploadedFile} (Detected: Sales & CRM records)
                  </span>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="w-8 h-8 text-[#8B92A5] mx-auto mb-3" />
                  <span className="text-xs font-mono text-[#EDEFF4] block font-bold mb-1">
                    Drag and drop CSV / Excel / PDF file here
                  </span>
                  <span className="text-[11px] font-mono text-[#8B92A5] block mb-3">
                    or click below to browse local disk
                  </span>
                  <label className="inline-block px-4 py-1.5 bg-[#10131A] hover:bg-[#2A3040] border border-[#2A3040] rounded-xl text-xs font-mono text-[#EDEFF4] cursor-pointer transition-colors">
                    BROWSE DISK
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".csv,.xlsx,.xls,.pdf,.json"
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setUploadedFile("demo_sandbox_data.csv");
                sound.playAIComplete();
              }}
              className="w-full py-2 border border-dashed border-[#2A3040] rounded-xl text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-all"
            >
              USE PRE-CONFIGURED DEMO DATASET (SECURE SANDBOX)
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 animate-fadeIn text-center py-6">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h2 className="text-xl md:text-2xl font-display font-bold text-[#EDEFF4]">
              Enterprise Core Configured!
            </h2>
            <p className="text-sm text-[#8B92A5] leading-relaxed max-w-md mx-auto">
              Isolated workspace tenant created successfully for <strong className="text-[#EDEFF4]">{businessName}</strong>. All modules are bound to the Event Bus.
            </p>

            <div className="p-4 bg-[#10131A] rounded-xl border border-[#2A3040]/60 text-xs font-mono text-[#8B92A5] max-w-sm mx-auto space-y-1">
              <div className="flex justify-between">
                <span>Tenant Domain:</span>
                <span className="text-[#EDEFF4]">apex-os-sandbox.strata.io</span>
              </div>
              <div className="flex justify-between">
                <span>Sector Focus:</span>
                <span className="text-indigo-400 font-bold">{industry}</span>
              </div>
              <div className="flex justify-between">
                <span>Modules Activated:</span>
                <span className="text-[#EDEFF4]">7 Connected</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Navigation Footer */}
        <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-[#2A3040]">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-5 py-2 rounded-xl bg-transparent hover:bg-[#10131A] border border-[#2A3040] text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-all flex items-center gap-1.5"
              id="btn-onboarding-prev"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNextStep}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B7FF5] to-indigo-600 hover:from-[#7B6FE5] hover:to-indigo-500 text-white text-xs font-mono transition-all flex items-center gap-1.5 ml-auto"
            id="btn-onboarding-next"
          >
            {step === 6 ? "LAUNCH MISSION CONTROL" : "CONTINUE"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default OnboardingWizard;
