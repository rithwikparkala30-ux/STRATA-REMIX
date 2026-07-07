import React, { useState } from "react";
import { enterpriseCustomers } from "../data";
import { CustomerProfile } from "../types";
import { sound } from "../utils/audio";
import { 
  Users, UserCheck, ShieldCheck, Mail, Phone, DollarSign, 
  MapPin, Clock, CreditCard, Layers, TrendingUp, AlertCircle, 
  Download, FileSpreadsheet, ArrowUpRight, MessageSquare, Award,
  Sparkles, CheckCircle2, ChevronRight, Zap, RefreshCw
} from "lucide-react";

export const Customer360: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(enterpriseCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(enterpriseCustomers[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "B2B" | "B2C">("ALL");
  const [aiSummaries, setAiSummaries] = useState<{ [key: string]: string }>({});
  const [isLoadingSummary, setIsLoadingSummary] = useState<string | null>(null);

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    sound.playClick();
  };

  const handleExportTimeline = () => {
    sound.playUpload();
    // Simulate generation and download
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(activeCustomer.purchaseHistory, null, 2)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeCustomer.name.replace(/\s+/g, "_")}_purchase_timeline_ledger.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSummarizeComm = async (commId: string, details: string) => {
    if (aiSummaries[commId]) return; // Already summarized
    setIsLoadingSummary(commId);
    sound.playClick();

    // Trigger local simulation of backend AI summaries for speed and offline resilience, or query server
    setTimeout(() => {
      sound.playAIComplete();
      setAiSummaries((prev) => ({
        ...prev,
        [commId]: `[STRATA AI Summary]: Client confirmed resolution of previous sensory hardware latency. Re-asserted commitment to Q3 physical server nodes lease renewal of $45k.`
      }));
      setIsLoadingSummary(null);
    }, 1200);
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || c.customerType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6" id="customer-360-container">
      {/* Upper overview metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#1A1E29] border border-[#2A3040] p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-[#8B92A5] block">TOTAL ACCOUNTS</span>
          <span className="text-xl font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5 mt-1">
            <Users className="w-4 h-4 text-[#8B7FF5]" />
            142
          </span>
          <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">✓ 100% cloud synced</span>
        </div>
        <div className="bg-[#1A1E29] border border-[#2A3040] p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-[#8B92A5] block">ACTIVE CONTRACTS</span>
          <span className="text-xl font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5 mt-1">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            98
          </span>
          <span className="text-[9px] font-mono text-indigo-400 block mt-0.5">3 pending renewals</span>
        </div>
        <div className="bg-[#1A1E29] border border-[#2A3040] p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-[#8B92A5] block">TOTAL REVENUE (CLV)</span>
          <span className="text-xl font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5 mt-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            $242.5K
          </span>
          <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">▲ +12.4% MoM growth</span>
        </div>
        <div className="bg-[#1A1E29] border border-[#2A3040] p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-[#8B92A5] block">AVERAGE ORDER VALUE</span>
          <span className="text-xl font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5 mt-1">
            <CreditCard className="w-4 h-4 text-[#F0A93A]" />
            $5,420
          </span>
          <span className="text-[9px] font-mono text-[#8B92A5] block mt-0.5">Standard contract limit</span>
        </div>
        <div className="bg-[#1A1E29] border border-[#2A3040] p-4 rounded-2xl col-span-2 lg:col-span-1">
          <span className="text-[10px] font-mono text-[#8B92A5] block">CHURN DEFENSE RATE</span>
          <span className="text-xl font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            98.2%
          </span>
          <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">Excellent threshold</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Customer list panel */}
        <div className="xl:col-span-1 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-4 flex flex-col justify-between max-h-[700px]">
          <div>
            <h3 className="text-xs font-mono font-bold text-[#EDEFF4] mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8B7FF5]" />
              ENTERPRISE DIRECTORY ({filteredCustomers.length})
            </h3>

            {/* Filters and search */}
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl p-2.5 text-xs text-[#EDEFF4] focus:outline-none focus:border-[#8B7FF5] transition-colors placeholder-[#8B92A5]"
              />

              <div className="flex bg-[#10131A] p-0.5 rounded-lg border border-[#2A3040] text-[10px]">
                {["ALL", "B2B", "B2C"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFilterType(t as any);
                      sound.playClick();
                    }}
                    className={`flex-1 py-1 rounded text-center transition-all ${
                      filterType === t
                        ? "bg-[#2A3040] text-white font-medium"
                        : "text-[#8B92A5] hover:text-[#EDEFF4]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => {
                  const isActive = c.id === selectedCustomerId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCustomer(c.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isActive
                          ? "bg-[#8B7FF5]/10 border-[#8B7FF5]"
                          : "bg-[#10131A] border-[#2A3040] hover:border-[#8B92A5]"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-mono text-[#8B92A5]">{c.id}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          c.customerType === "B2B" ? "bg-indigo-500/10 text-indigo-400" : "bg-teal-500/10 text-teal-400"
                        }`}>
                          {c.customerType}
                        </span>
                      </div>
                      <h4 className="text-xs font-display font-medium text-[#EDEFF4] mt-1.5 truncate w-full">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-[#8B92A5] truncate w-full mt-0.5">
                        {c.companyName}
                      </p>

                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#2A3040]/40 w-full text-[10px] font-mono">
                        <span className="text-[#8B92A5]">CLV: ${c.clv.toLocaleString()}</span>
                        <span className={c.customerHealthScore >= 80 ? "text-emerald-400" : "text-[#F0A93A]"}>
                          Score: {c.customerHealthScore}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 text-[#8B92A5] text-xs font-mono">
                  No direct accounts match filter query.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2A3040] text-center text-[9px] font-mono text-[#8B92A5]">
            STRATA CRM Matrix Layer V4.1
          </div>
        </div>

        {/* Right Details Panel (Customer 360 Consolidated View) */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile overview card & AI Insights */}
          <div className="md:col-span-1 space-y-6">
            {/* profile metadata */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B7FF5] opacity-5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B7FF5] to-indigo-600 flex items-center justify-center text-[#EDEFF4] font-display font-semibold text-lg">
                  {activeCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-[#EDEFF4] leading-tight">
                    {activeCustomer.name}
                  </h3>
                  <span className="text-xs font-mono text-indigo-400">
                    {activeCustomer.membershipLevel} Client Group
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-t border-[#2A3040] pt-4 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Account ID:</span>
                  <span className="text-[#EDEFF4]">{activeCustomer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">E-mail:</span>
                  <span className="text-indigo-400 truncate max-w-[120px]">{activeCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Assigned Rep:</span>
                  <span className="text-[#EDEFF4] text-[10px] truncate max-w-[110px]">{activeCustomer.salesRepAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Credit Limit:</span>
                  <span className="text-[#EDEFF4]">${activeCustomer.creditLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Country:</span>
                  <span className="text-[#EDEFF4]">{activeCustomer.country}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B92A5]">Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold">
                    {activeCustomer.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2A3040] flex items-center justify-between text-xs">
                <div className="text-center w-1/2 border-r border-[#2A3040]/50 pr-2">
                  <span className="text-[#8B92A5] text-[10px] font-mono block">LOYALTY POINTS</span>
                  <span className="text-sm font-mono font-bold text-[#F0A93A] mt-0.5 block flex items-center justify-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {activeCustomer.loyaltyPoints}
                  </span>
                </div>
                <div className="text-center w-1/2 pl-2">
                  <span className="text-[#8B92A5] text-[10px] font-mono block">CHURN PROBABILITY</span>
                  <span className={`text-sm font-mono font-bold mt-0.5 block ${
                    activeCustomer.churnRiskScore < 20 ? "text-emerald-400" : "text-[#F0A93A]"
                  }`}>
                    {activeCustomer.churnRiskScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Purchase Intelligence Card */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                CUSTOMER PURCHASE INTELLIGENCE
              </h4>

              <div className="space-y-2.5 text-xs font-mono border-t border-[#2A3040] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Purchase Frequency:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeCustomer.name.includes("Aero") ? "1.6 orders / month" : "2.4 orders / month"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Favorite Asset Class:</span>
                  <span className="text-indigo-400 font-bold truncate max-w-[130px]" title={activeCustomer.purchaseHistory[0]?.productName || "Direct Requisition"}>
                    {activeCustomer.purchaseHistory[0]?.productName || "Hardware Infrastructure"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Calculated LTV:</span>
                  <span className="text-[#EDEFF4] font-bold">
                    {activeCustomer.name.includes("Aero") ? "₹14.8M" : "₹4.8M"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B92A5]">Last Purchase Date:</span>
                  <span className="text-[#EDEFF4]">
                    {activeCustomer.purchaseHistory[0]?.orderDate || "2026-07-01"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-t border-[#2A3040]/50 pt-2.5 mt-1">
                  <span className="text-[#8B92A5] text-[9px] uppercase tracking-wider">Predicted Next Purchase:</span>
                  <div className="bg-[#10131A] p-2 rounded-lg border border-[#2A3040] flex justify-between items-center mt-0.5">
                    <span className="text-[#EDEFF4] font-semibold text-[10px] truncate max-w-[120px]">
                      {activeCustomer.name.includes("Aero") ? "STRATA Node Server v4" : "Quantum IoT Controller"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[8px] font-bold">
                      Confidence 94%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI customer insights list */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5">
              <h4 className="text-xs font-mono font-bold text-[#EDEFF4] mb-3.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8B7FF5] animate-pulse" />
                STRATA COGNITIVE INSIGHTS
              </h4>

              <div className="space-y-3">
                <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]/60 relative">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-indigo-400 font-bold">LTV EXPANSION POTENTIAL</span>
                    <span className="text-[#8B92A5]">96% Match</span>
                  </div>
                  <p className="text-xs text-[#EDEFF4] leading-relaxed">
                    Customer qualifies for Silver logistics waiver due to high Platinum credit balance. Suggesting cross-sell bundle next cycle.
                  </p>
                </div>

                <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]/60">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-[#F0A93A] font-bold">PAYMENT LATENCY SHIELD</span>
                    <span className="text-[#8B92A5]">Confidence 89%</span>
                  </div>
                  <p className="text-xs text-[#EDEFF4] leading-relaxed">
                    {activeCustomer.purchaseHistory.some(p => p.paymentStatus === "Outstanding") 
                      ? "Outstanding invoice flag detected. Recommend holding manual dispatch override." 
                      : "Zero structural accounts receivable friction. Clear path to automatic dispatch renewals."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chronological timelines and purchases list */}
          <div className="md:col-span-2 space-y-6">
            {/* Purchase Chronological Timeline */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-mono font-bold text-[#EDEFF4] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8B7FF5]" />
                  CHRONOLOGICAL ENTERPRISE BUYING TIMELINE
                </h4>
                <button
                  onClick={handleExportTimeline}
                  className="p-1 px-2.5 rounded-lg bg-[#10131A] border border-[#2A3040] text-[10px] font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-colors flex items-center gap-1"
                  id="btn-export-timeline"
                >
                  <Download className="w-3.5 h-3.5" />
                  EXPORT LEDGER
                </button>
              </div>

              {/* Time node loop */}
              <div className="relative pl-6 border-l border-[#2A3040] ml-3 py-2 space-y-6">
                {activeCustomer.purchaseHistory.map((hist, index) => (
                  <div key={index} className="relative">
                    {/* Ring indicator */}
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-[#1A1E29] border-2 border-[#8B7FF5] flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B7FF5]" />
                    </span>

                    <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-indigo-400">{hist.orderDate}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                            {hist.invoiceNumber}
                          </span>
                        </div>
                        <h5 className="text-xs font-display font-medium text-[#EDEFF4]">
                          {hist.productName}
                        </h5>
                        <p className="text-[10px] text-[#8B92A5] font-mono mt-0.5">
                          SKU: {hist.sku} | Barcode: {hist.barcode}
                        </p>
                        <p className="text-[10px] text-[#8B92A5] mt-1">
                          Shipped from {hist.warehouseShipped} | Rep: {hist.salesperson}
                        </p>
                      </div>

                      <div className="text-right flex flex-col justify-between items-end">
                        <span className="text-sm font-mono font-bold text-emerald-400 block">
                          ${hist.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-mono text-[#8B92A5] block">
                          Qty: {hist.quantity} units
                        </span>
                        <div className="flex gap-1.5 mt-2">
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                            hist.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {hist.paymentStatus}
                          </span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#2A3040] text-[#EDEFF4]">
                            {hist.deliveryStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Product recommendations */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5">
              <h4 className="text-xs font-mono font-bold text-[#EDEFF4] mb-3.5 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#F0A93A]" />
                ML RECOMMENDATION & UPSELL SUITE
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCustomer.recommendedProducts.map((rec, i) => (
                  <div key={i} className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                        <span className="text-[#8B92A5]">CONFIDENCE RATING</span>
                        <span className="text-[#8B7FF5] font-bold">{rec.confidence}% Match</span>
                      </div>
                      <h5 className="text-xs font-display font-semibold text-[#EDEFF4] mb-1">
                        {rec.name}
                      </h5>
                      <p className="text-[11px] text-[#8B92A5] leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A3040]/40 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono text-[#8B92A5] block">EXPECTED NET IMPACT</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 block">
                          +${rec.expectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sound.playBarcodeScanned();
                          alert(`Draft invoice compiled for ${rec.name}. Upsell order pushed to dispatch coordinator.`);
                        }}
                        className="p-1 px-2 text-[10px] font-mono bg-[#1A1E29] hover:bg-[#8B7FF5] hover:text-white text-[#8B7FF5] rounded border border-[#2A3040] transition-all flex items-center gap-1"
                      >
                        TRIGGER CONTRACT
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication CRM Log Center */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5">
              <h4 className="text-xs font-mono font-bold text-[#EDEFF4] mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                COMMUNICATION MATRIX JOURNAL
              </h4>

              <div className="space-y-3">
                {activeCustomer.communicationHistory.map((comm) => (
                  <div key={comm.id} className="bg-[#10131A] p-3.5 rounded-xl border border-[#2A3040]/60">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          comm.type === "Call" ? "bg-emerald-500/10 text-emerald-400" :
                          comm.type === "Email" ? "bg-indigo-500/10 text-indigo-400" : "bg-sky-500/10 text-sky-400"
                        }`}>
                          {comm.type.toUpperCase()}
                        </span>
                        <span className="text-xs font-display font-medium text-[#EDEFF4]">{comm.summary}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8B92A5]">{new Date(comm.date).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-[#8B92A5] leading-relaxed mb-3">
                      {comm.details}
                    </p>

                    {/* AI Summary integration */}
                    {aiSummaries[comm.id] ? (
                      <div className="p-2.5 bg-[#1A1E29] rounded-lg border border-[#8B7FF5]/20 text-xs font-mono text-indigo-200 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#8B7FF5] shrink-0 mt-0.5" />
                        <span>{aiSummaries[comm.id]}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSummarizeComm(comm.id, comm.details)}
                        className="text-[10px] font-mono text-[#8B7FF5] hover:text-[#8B7FF5]/80 flex items-center gap-1"
                        disabled={isLoadingSummary === comm.id}
                      >
                        {isLoadingSummary === comm.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            ANALYZING LOG TEXT...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            ASK STRATA AI TO SUMMARIZE CONVERSATION
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Customer360;
