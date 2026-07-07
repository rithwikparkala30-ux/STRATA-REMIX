import React, { useState } from "react";
import { ProductItem, CustomerProfile, SupplierProfile } from "../types";
import { enterpriseProducts, enterpriseCustomers } from "../data";
import { sound } from "../utils/audio";
import { 
  Briefcase, Truck, Package, DollarSign, Cpu, Users, Sparkles, 
  Check, AlertCircle, RefreshCw, FileText, Plus, ChevronRight, Activity, TrendingUp, Filter
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

interface ERPProcessEngineProps {
  onTimelineLogged?: (title: string, desc: string, category: "INVENTORY" | "AI_FORECAST" | "SALES" | "AUTOMATION" | "SYSTEM") => void;
  productsList: ProductItem[];
  setProductsList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
}

export const ERPProcessEngine: React.FC<ERPProcessEngineProps> = ({ 
  onTimelineLogged,
  productsList,
  setProductsList
}) => {
  const [activeModule, setActiveModule] = useState<"PROCUREMENT" | "INVENTORY" | "SALES" | "FINANCE" | "MANUFACTURING" | "HR">("PROCUREMENT");
  const [procurementStep, setProcurementStep] = useState<"LIST" | "NEW_REQUEST">("LIST");
  
  // Simulated State Stores
  const [purchaseRequests, setPurchaseRequests] = useState([
    { id: "PR-2026-001", sku: "SKU-LAP-9020", name: "Apex Pro Laptop 15\"", qty: 15, dept: "R&D Systems", status: "PENDING_APPROVAL" },
    { id: "PR-2026-002", sku: "SKU-MON-8800", name: "UHD UltraWide Executive Display", qty: 8, dept: "Design Suite", status: "APPROVED" }
  ]);
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: "PO-2026-802", supplier: "Silicon Dynamics Inc.", items: [{ name: "Apex Pro Laptop 15\"", qty: 25 }], total: 32499.75, status: "ORDERED" },
    { id: "PO-2026-801", supplier: "SuperMicro Logistics Corp", items: [{ name: "STRATA Enterprise Server Node V4", qty: 2 }], total: 9999.98, status: "GOODS_RECEIVED" }
  ]);
  const [inventoryTransfers, setInventoryTransfers] = useState([
    { id: "TR-9901", sku: "SKU-LAP-9020", from: "Warehouse East (HQ)", to: "Warehouse West", qty: 5, date: "2026-07-05", status: "COMPLETED" },
    { id: "TR-9902", sku: "SKU-IOT-2200", from: "Warehouse East (HQ)", to: "Zone Gamma Retail", qty: 20, date: "2026-07-06", status: "IN_TRANSIT" }
  ]);
  const [salesOrders, setSalesOrders] = useState([
    { id: "SO-2026-101", customer: "AeroSpace Tech Systems LLC", amount: 15949.96, items: "3x STRATA Server Nodes", status: "SHIPPED" },
    { id: "SO-2026-102", customer: "Global Capital Holdings", amount: 2599.98, items: "2x Apex Pro Laptops", status: "PENDING_PAYMENT" }
  ]);

  // HR list
  const [employees, setEmployees] = useState([
    { id: "EMP-4001", name: "Sarah Jenkins", dept: "Corporate Sales", role: "Director of B2B Accounts", attendance: "98.5%", status: "On Duty" },
    { id: "EMP-4002", name: "Elena Mitchell", dept: "Operations Hub", role: "Ops Lead", attendance: "99.2%", status: "On Duty" },
    { id: "EMP-4003", name: "David Vance", dept: "Finance Management", role: "SVP Finance", attendance: "95.4%", status: "On Leave" },
    { id: "EMP-4004", name: "Marcus Thorne", dept: "Manufacturing Assembly", role: "OEE Lead", attendance: "97.8%", status: "On Duty" }
  ]);

  // New Purchase Request form state
  const [newPrSku, setNewPrSku] = useState(productsList[0]?.sku || "");
  const [newPrQty, setNewPrQty] = useState(10);
  const [newPrDept, setNewPrDept] = useState("Sales Ops");

  // AI ERP Assistant notifications/tasks
  const [aiRecommendations, setAiRecommendations] = useState([
    { 
      id: "REC-1", 
      type: "BOTTLENECK", 
      title: "Assembly Line 2 Feed Bottleneck", 
      desc: "Microchip supplier lead times have drifted +3.5 days. Expected shortage of SKU-LAP-9020 in 8 days.", 
      actionLabel: "Re-route to Backup Supplier",
      applied: false 
    },
    { 
      id: "REC-2", 
      type: "PROCUREMENT", 
      title: "Automated Reorder Triggered", 
      desc: "Apex Pro Laptop stock level (12) is below safety point (20). Suggest purchase of 25 units.", 
      actionLabel: "Generate Purchase Order",
      applied: false 
    },
    { 
      id: "REC-3", 
      type: "CASH_FLOW", 
      title: "Accounts Receivable Drift Warning", 
      desc: "Global Capital outstanding invoice ($15,949) is nearing grace threshold. Cash reserves steady at $3.5M.", 
      actionLabel: "Send Automated Reminder",
      applied: false 
    }
  ]);

  // Handle PR Creation
  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    const product = productsList.find(p => p.sku === newPrSku);
    if (!product) return;

    const newPr = {
      id: `PR-2026-00${purchaseRequests.length + 1}`,
      sku: newPrSku,
      name: product.name,
      qty: newPrQty,
      dept: newPrDept,
      status: "PENDING_APPROVAL"
    };

    setPurchaseRequests([newPr, ...purchaseRequests]);
    setProcurementStep("LIST");
    sound.playAIComplete();

    if (onTimelineLogged) {
      onTimelineLogged(
        "Purchase Request Logged",
        `Created PR ${newPr.id} for ${newPr.qty} units of ${newPr.name} requested by ${newPr.dept}.`,
        "INVENTORY"
      );
    }
  };

  // Handle Vendor selection simulation
  const handleApprovePr = (id: string) => {
    sound.playClick();
    setPurchaseRequests(prev => prev.map(pr => {
      if (pr.id === id) {
        // create matching PO
        const newPo = {
          id: `PO-2026-80${purchaseOrders.length + 1}`,
          supplier: "Silicon Dynamics Inc.",
          items: [{ name: pr.name, qty: pr.qty }],
          total: Number((pr.qty * 1200).toFixed(2)),
          status: "ORDERED"
        };
        setPurchaseOrders([newPo, ...purchaseOrders]);
        return { ...pr, status: "APPROVED" };
      }
      return pr;
    }));
  };

  // Execute AI assistant recommendations
  const handleApplyRecommendation = (id: string) => {
    sound.playAIComplete();
    setAiRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        if (rec.type === "PROCUREMENT") {
          // create matching PO
          const newPo = {
            id: `PO-2026-80${purchaseOrders.length + 1}`,
            supplier: "Silicon Dynamics Inc.",
            items: [{ name: "Apex Pro Laptop 15\"", qty: 25 }],
            total: 32499.75,
            status: "ORDERED"
          };
          setPurchaseOrders([newPo, ...purchaseOrders]);
          
          // Increment stock slightly for visual update
          setProductsList(prevProducts => prevProducts.map(p => {
            if (p.sku === "SKU-LAP-9020") {
              return { ...p, stockLevel: p.stockLevel + 25 };
            }
            return p;
          }));
        }
        
        if (onTimelineLogged) {
          onTimelineLogged(
            "AI Assistant Action Executed",
            `Executed ERP recommendation [${rec.type}]: ${rec.title}`,
            "AUTOMATION"
          );
        }
        return { ...rec, applied: true };
      }
      return rec;
    }));
  };

  // Mock Financial Data for Recharts
  const monthlyPnLData = [
    { month: "Jan", revenue: 145000, expenses: 105000, profit: 40000 },
    { month: "Feb", revenue: 168000, expenses: 110000, profit: 58000 },
    { month: "Mar", revenue: 182000, expenses: 121000, profit: 61000 },
    { month: "Apr", revenue: 154000, expenses: 102000, profit: 52000 },
    { month: "May", revenue: 195000, expenses: 130000, profit: 65000 },
    { month: "Jun", revenue: 215000, expenses: 142000, profit: 73000 },
    { month: "Jul", revenue: 245000, expenses: 155000, profit: 90000 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn" id="erp-process-engine-module">
      
      {/* Module Title Section */}
      <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">
                STRATA CORE PROCESS ENGINE
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#EDEFF4]">
              Enterprise Resource Planning (ERP) Suite
            </h2>
            <p className="text-xs text-[#8B92A5] mt-1 max-w-2xl">
              Integrate, synchronize, and model real-time business transactions. Manage multi-layered operations from automated supplier procurement and inventory transfers to financial statements.
            </p>
          </div>

          <div className="flex bg-[#10131A] p-1 rounded-xl border border-[#2A3040] text-xs font-mono overflow-x-auto gap-1">
            <button
              onClick={() => { setActiveModule("PROCUREMENT"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === "PROCUREMENT" ? "bg-indigo-600 text-white font-bold" : "text-[#8B92A5] hover:text-[#EDEFF4]"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Procurement
            </button>
            <button
              onClick={() => { setActiveModule("INVENTORY"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === "INVENTORY" ? "bg-indigo-600 text-white font-bold" : "text-[#8B92A5] hover:text-[#EDEFF4]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Inventory
            </button>
            <button
              onClick={() => { setActiveModule("SALES"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === "SALES" ? "bg-indigo-600 text-white font-bold" : "text-[#8B92A5] hover:text-[#EDEFF4]"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Sales & Finance
            </button>
            <button
              onClick={() => { setActiveModule("MANUFACTURING"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === "MANUFACTURING" ? "bg-indigo-600 text-white font-bold" : "text-[#8B92A5] hover:text-[#EDEFF4]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Manufacturing
            </button>
            <button
              onClick={() => { setActiveModule("HR"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === "HR" ? "bg-indigo-600 text-white font-bold" : "text-[#8B92A5] hover:text-[#EDEFF4]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Human Resources
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sub-Module Process Operations Console */}
        <div className="lg:col-span-8 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6">
          
          {/* Module 1: Procurement */}
          {activeModule === "PROCUREMENT" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">Procurement Logistics Hub</h3>
                  <p className="text-xs text-[#8B92A5] mt-0.5">Approve purchase requests (PR) and auto-dispatch supplier purchase orders (PO).</p>
                </div>
                {procurementStep === "LIST" ? (
                  <button
                    onClick={() => { setProcurementStep("NEW_REQUEST"); sound.playClick(); }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Purchase Request
                  </button>
                ) : (
                  <button
                    onClick={() => { setProcurementStep("LIST"); sound.playClick(); }}
                    className="text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4]"
                  >
                    ← Back to Index
                  </button>
                )}
              </div>

              {procurementStep === "NEW_REQUEST" ? (
                <form onSubmit={handleCreatePr} className="bg-[#10131A] p-5 rounded-2xl border border-[#2A3040] space-y-4">
                  <h4 className="text-xs font-mono font-bold text-indigo-400">LOG REQUISITION MILITARY SPECIFICATION</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8B92A5]">SELECT ITEM SKU</label>
                      <select
                        value={newPrSku}
                        onChange={(e) => setNewPrSku(e.target.value)}
                        className="w-full bg-[#1A1E29] border border-[#2A3040] rounded-xl px-3 py-2 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-indigo-500"
                      >
                        {productsList.map(p => (
                          <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8B92A5]">ORDER VOLUME (UNITS)</label>
                      <input
                        type="number"
                        value={newPrQty}
                        onChange={(e) => setNewPrQty(Number(e.target.value))}
                        className="w-full bg-[#1A1E29] border border-[#2A3040] rounded-xl px-3 py-2 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-indigo-500"
                        min="1"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8B92A5]">REQUESTING DIVISION</label>
                      <input
                        type="text"
                        value={newPrDept}
                        onChange={(e) => setNewPrDept(e.target.value)}
                        className="w-full bg-[#1A1E29] border border-[#2A3040] rounded-xl px-3 py-2 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-xl transition-colors"
                  >
                    DISPATCH PURCHASE REQUISITION
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* Purchase Requests Table */}
                  <div className="bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden">
                    <div className="bg-[#1A1E29] px-4 py-2.5 border-b border-[#2A3040] flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-[#8B92A5]">ACTIVE REQUISITIONS</span>
                    </div>
                    <div className="divide-y divide-[#2A3040]/40">
                      {purchaseRequests.map((pr) => (
                        <div key={pr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-indigo-400 font-bold">{pr.id}</span>
                              <span className="text-[10px] text-[#8B92A5]">• {pr.dept}</span>
                            </div>
                            <span className="text-[#EDEFF4] font-medium block mt-1">{pr.name}</span>
                            <span className="text-[10px] text-[#8B92A5] mt-0.5 block">Reorder size: <strong className="text-white">{pr.qty}</strong> units</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              pr.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {pr.status}
                            </span>
                            {pr.status === "PENDING_APPROVAL" && (
                              <button
                                onClick={() => handleApprovePr(pr.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] text-white transition-all font-bold"
                              >
                                APPROVE & CREATE PO
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchase Orders Table */}
                  <div className="bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden">
                    <div className="bg-[#1A1E29] px-4 py-2.5 border-b border-[#2A3040] flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-[#8B92A5]">SUPPLIER PURCHASE ORDERS</span>
                    </div>
                    <div className="divide-y divide-[#2A3040]/40">
                      {purchaseOrders.map((po) => (
                        <div key={po.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-bold">{po.id}</span>
                              <span className="text-[10px] text-[#8B92A5]">• {po.supplier}</span>
                            </div>
                            <span className="text-[#EDEFF4] block mt-1">{po.items[0]?.qty}x {po.items[0]?.name}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[#EDEFF4] font-bold">${po.total.toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              po.status === "GOODS_RECEIVED" ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400 animate-pulse"
                            }`}>
                              {po.status === "GOODS_RECEIVED" ? "✓ GOODS INGESTED" : "● DISPATCHED TO SHIP"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Module 2: Inventory */}
          {activeModule === "INVENTORY" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">Global Inventory Transfer & Batch Tracker</h3>
                <p className="text-xs text-[#8B92A5] mt-0.5">Coordinate intra-warehouse stocks and trace individual batch lots across storage racks.</p>
              </div>

              {/* Transfers Table */}
              <div className="bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden">
                <div className="bg-[#1A1E29] px-4 py-2.5 border-b border-[#2A3040] flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#8B92A5]">TRANS-WAREHOUSE LEDGER</span>
                </div>
                <div className="divide-y divide-[#2A3040]/40">
                  {inventoryTransfers.map((tr) => {
                    const product = productsList.find(p => p.sku === tr.sku);
                    return (
                      <div key={tr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">{tr.id}</span>
                            <span className="text-[10px] text-indigo-400">{tr.sku}</span>
                          </div>
                          <span className="text-[#EDEFF4] font-medium block mt-1">{product?.name || "Inventory Asset"}</span>
                          <span className="text-[10px] text-[#8B92A5] block mt-0.5">Route: {tr.from} → {tr.to}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold">{tr.qty} units</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            tr.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400 animate-pulse"
                          }`}>
                            {tr.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cycle count / Batch lot summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] space-y-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block">LOT BATCH CODE MAPPING</span>
                  <p className="text-xs text-[#8B92A5] leading-relaxed">
                    All electronics products are fully certified under **ISO-9001** and tracked via decentralized barcode parameters. Active batch **#BT-2026A-04** has completed QA validation in Warehouse East.
                  </p>
                </div>
                <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] space-y-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block">REORDER METRIC DEVIATION</span>
                  <p className="text-xs text-[#8B92A5] leading-relaxed">
                    Automatic reorder checks occur every 6 hours inside the core workflow engine. The system triggers procurement alerts when active shelf quantity reaches minimum buffers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: Sales & Finance */}
          {activeModule === "SALES" && (
            <div className="space-y-6 font-mono">
              <div>
                <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">General Ledger & Profit & Loss Analysis</h3>
                <p className="text-xs text-[#8B92A5] mt-0.5">Audit global sales cycles, monitor P&L forecasts, and view accounts receivables.</p>
              </div>

              {/* Chart */}
              <div className="bg-[#10131A] border border-[#2A3040] rounded-xl p-4">
                <span className="text-[10px] font-mono font-bold text-[#8B92A5] block mb-4 uppercase">7-Month Cumulative Net Profit Growth</span>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyPnLData}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B7FF5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B7FF5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                      <XAxis dataKey="month" stroke="#8B92A5" fontSize={10} />
                      <YAxis stroke="#8B92A5" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#1A1E29", border: "1px solid #2A3040" }} labelStyle={{ color: "#EDEFF4" }} />
                      <Area type="monotone" dataKey="profit" stroke="#8B7FF5" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Orders Table */}
              <div className="bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden">
                <div className="bg-[#1A1E29] px-4 py-2.5 border-b border-[#2A3040] flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#8B92A5]">ACTIVE CUSTOMER SALES INVOICES</span>
                </div>
                <div className="divide-y divide-[#2A3040]/40">
                  {salesOrders.map((so) => (
                    <div key={so.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">{so.id}</span>
                          <span className="text-[10px] text-[#8B92A5]">• {so.customer}</span>
                        </div>
                        <span className="text-[#EDEFF4] font-medium block mt-1">{so.items}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">${so.amount.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          so.status === "SHIPPED" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {so.status === "SHIPPED" ? "✓ SHIPPED" : "● PENDING PAY"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Manufacturing */}
          {activeModule === "MANUFACTURING" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">Manufacturing Assembly (OEE & BOM Scheduler)</h3>
                <p className="text-xs text-[#8B92A5] mt-0.5">Analyze plant OEE efficiencies, manage Bill of Materials (BOM), and schedule work orders.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] text-center">
                  <span className="text-[10px] font-mono text-[#8B92A5] block">ASSEMBLY OEE INDEX</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 block mt-1">92.4%</span>
                  <span className="text-[9px] font-mono text-[#8B92A5] block mt-1">Class A Global Standard</span>
                </div>
                <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] text-center">
                  <span className="text-[10px] font-mono text-[#8B92A5] block">ACTIVE WORK ORDERS</span>
                  <span className="text-2xl font-mono font-bold text-[#EDEFF4] block mt-1">4 Run</span>
                  <span className="text-[9px] font-mono text-indigo-400 block mt-1">Next schedule in 4h</span>
                </div>
                <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] text-center">
                  <span className="text-[10px] font-mono text-[#8B92A5] block">BOM INTEGRITY RATE</span>
                  <span className="text-2xl font-mono font-bold text-indigo-400 block mt-1">100%</span>
                  <span className="text-[9px] font-mono text-emerald-400 block mt-1">SLA verified</span>
                </div>
              </div>

              {/* Bill of materials */}
              <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] space-y-3 font-mono text-xs">
                <span className="text-[10px] text-indigo-400 font-bold block uppercase">BOM STRUCTURE: SKU-SVR-4000 Assembly Node</span>
                <div className="space-y-1.5 divide-y divide-[#2A3040]/30 text-[11px]">
                  <div className="flex justify-between py-1">
                    <span className="text-[#8B92A5]">1. Core Motherboard Matrix v2:</span>
                    <span className="text-[#EDEFF4]">1 unit</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8B92A5]">2. Premium Solid State Rails:</span>
                    <span className="text-[#EDEFF4]">4 units</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8B92A5]">3. Thermal Exhaust Fans:</span>
                    <span className="text-[#EDEFF4]">2 units</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 5: HR */}
          {activeModule === "HR" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono font-bold text-[#EDEFF4] uppercase">Human Resources and Rosters</h3>
                <p className="text-xs text-[#8B92A5] mt-0.5">Audit employee performance, check shift attendance, and track credentials.</p>
              </div>

              <div className="bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden font-mono text-xs">
                <div className="bg-[#1A1E29] px-4 py-2.5 border-b border-[#2A3040]">
                  <span className="text-[10px] font-bold text-[#8B92A5]">ACTIVE CORPORATE DIRECTORY</span>
                </div>
                <div className="divide-y divide-[#2A3040]/40">
                  {employees.map((emp) => (
                    <div key={emp.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">{emp.id}</span>
                          <span className="text-[10px] text-[#8B92A5]">{emp.dept}</span>
                        </div>
                        <span className="text-[#EDEFF4] font-bold block mt-1">{emp.name}</span>
                        <span className="text-[10px] text-[#8B92A5]">{emp.role}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[9px] text-[#8B92A5] block">ATTENDANCE</span>
                          <span className="text-emerald-400 font-bold">{emp.attendance}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          emp.status === "On Duty" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {emp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right AI Assistant & Process Bottlenecks Console */}
        <div className="lg:col-span-4 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center gap-2 border-b border-[#2A3040] pb-3.5 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider">
                AI ERP WORKFLOW ASSISTANT
              </h3>
            </div>

            <p className="text-xs text-[#8B92A5] leading-relaxed mb-4">
              STRATA AI constantly monitors the General Ledger, inventory, and supply pipelines to identify latency anomalies and queue buffer optimization steps.
            </p>

            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`border rounded-xl p-4 space-y-3 transition-all ${
                    rec.applied 
                      ? "bg-[#10131A]/40 border-[#2A3040]/30 opacity-60" 
                      : "bg-[#10131A] border-indigo-500/20 hover:border-indigo-500/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                      rec.type === "BOTTLENECK" ? "bg-red-500/10 text-red-400" :
                      rec.type === "PROCUREMENT" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {rec.type}
                    </span>
                    {rec.applied && (
                      <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> APPLIED
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#EDEFF4]">{rec.title}</h4>
                    <p className="text-[11px] text-[#8B92A5] leading-normal mt-1.5 font-mono">{rec.desc}</p>
                  </div>

                  {!rec.applied && (
                    <button
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className="w-full py-1.5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white text-[10px] font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <span>{rec.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2A3040] pt-4 mt-6">
            <span className="text-[9px] font-mono text-[#8B92A5] uppercase tracking-wider block mb-1">
              Active Neural Decision Handshake
            </span>
            <div className="flex justify-between text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                Ledger Syncing (0.04s)
              </span>
              <span className="text-[#8B92A5]">SLA Valid</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
