import React, { useState } from "react";
import { enterpriseProducts } from "../data";
import { ProductItem } from "../types";
import { sound } from "../utils/audio";
import { Package, MapPin, Eye, RotateCcw, AlertTriangle, Play, Barcode, TrendingUp, CheckCircle, Cpu, Sparkles, RefreshCw, Users } from "lucide-react";

interface DigitalTwinProps {
  onProductUpdated?: (updatedProduct: ProductItem) => void;
  onTimelineLogged?: (title: string, desc: string, category: "INVENTORY" | "AI_FORECAST" | "SALES" | "AUTOMATION" | "SYSTEM") => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ onProductUpdated, onTimelineLogged }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<"East" | "West">("East");
  const [products, setProducts] = useState<ProductItem[]>(enterpriseProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(enterpriseProducts[0]);
  const [scanCode, setScanCode] = useState("");
  const [scanSuccessMsg, setScanSuccessMsg] = useState("");

  // AI Simulations States
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    impact: string;
    probability: string;
    capacity: string;
    mitigation: string;
    severity: "NOMINAL" | "WARNING" | "CRITICAL";
  } | null>(null);

  const handleRunSimulation = (type: string) => {
    setIsSimulating(true);
    setActiveSimulation(type);
    sound.playClick();
    setTimeout(() => {
      setIsSimulating(false);
      sound.playAIComplete();
      
      let res: any;
      if (type === "SURGE") {
        res = {
          impact: "+40% spike in computer hardware checkouts over next 14 days",
          probability: "14% variance on core buffers",
          capacity: "98.5% bottleneck in Warehouse East logistics belts",
          mitigation: "Pre-trigger purchase orders inside operational rule engines to secure next-tier transport buffers",
          severity: "WARNING"
        };
      } else if (type === "FAIL") {
        res = {
          impact: "Zone Gamma Power Node 4 drops offline, cooling telemetry drifts",
          probability: "88% failure probability on aging Backup Gaskets",
          capacity: "12% assembly downtime expected inside 2 hours",
          mitigation: "Instantly re-route main power rails to Grid Station B and flag alert inside Emergency response log",
          severity: "CRITICAL"
        };
      } else if (type === "DELAY") {
        res = {
          impact: "Silicon Dynamics supplier transit lag grows to +7.2 days",
          probability: "95% probability of low safety stock event on laptops",
          capacity: "82% lower packing throughput for custom B2B bulk contracts",
          mitigation: "Re-assign priority orders to alternate vendor (SuperMicro Logistics) inside Procurement Suite",
          severity: "WARNING"
        };
      } else if (type === "DOWNTIME") {
        res = {
          impact: "Sorting Arm Assembly C2 motor overheats and trips safety limits",
          probability: "18.2% motor seizure warning detected",
          capacity: "Assembly Line 2 output falls by 45% standard deviation",
          mitigation: "Dispatch Marcus Thorne to execute predictive maintenance sweep and recalibrate rotor tension",
          severity: "CRITICAL"
        };
      } else if (type === "SHORTAGE") {
        res = {
          impact: "Inbound supply of Quantum IoT controller depleted",
          probability: "4% minor drift",
          capacity: "All inventory buffer zones transition to RED state",
          mitigation: "Instruct smart barcode center to flag reorder alerts and execute stock transfer TR-9902",
          severity: "CRITICAL"
        };
      } else {
        res = {
          impact: "Baltic and European shipping channels exhibit +5.2 days drift",
          probability: "72% freight rate inflation expected",
          capacity: "8% inventory dispatch delay on long-haul customer deliveries",
          mitigation: "Execute alternate ground route mappings inside Global Radar Map routing rule engine",
          severity: "WARNING"
        };
      }
      setSimulationResult(res);
      if (onTimelineLogged) {
        onTimelineLogged(
          "AI Operations Simulation Run",
          `Completed predictive impact assessment for physical twin event: [${type}].`,
          "AI_FORECAST"
        );
      }
    }, 1500);
  };

  const handleSelectProduct = (p: ProductItem) => {
    setSelectedProduct(p);
    sound.playClick();
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    // Search product by barcode or SKU
    const foundIdx = products.findIndex(
      (p) => p.barcode === scanCode.trim() || p.sku.toLowerCase() === scanCode.trim().toLowerCase()
    );

    if (foundIdx !== -1) {
      const target = products[foundIdx];
      const updated = {
        ...target,
        stockLevel: target.stockLevel + 1,
        history: [
          {
            date: new Date().toISOString().split("T")[0],
            action: "Barcode Scanner Ingestion (+1 Unit)",
            quantity: 1,
          },
          ...target.history,
        ],
      };

      const nextProducts = [...products];
      nextProducts[foundIdx] = updated;
      setProducts(nextProducts);
      setSelectedProduct(updated);

      sound.playBarcodeScanned();
      setScanSuccessMsg(`Scanned: ${updated.name}. Ingestion registered, ERP state rebuilt!`);
      setScanCode("");

      if (onProductUpdated) onProductUpdated(updated);
      if (onTimelineLogged) {
        onTimelineLogged(
          "Barcode Scan Registered",
          `Incremented ${updated.name} (SKU: ${updated.sku}) via scanner terminal. Re-indexing Digital Twin map.`,
          "INVENTORY"
        );
      }

      setTimeout(() => setScanSuccessMsg(""), 4000);
    } else {
      sound.playNotification();
      setScanSuccessMsg("❌ Unknown barcode. System failed to map to enterprise data model.");
      setTimeout(() => setScanSuccessMsg(""), 3000);
    }
  };

  // Render rack grid simulation
  const shelfPositions = ["A", "B", "C"];
  const rackPositions = ["R-02", "R-04", "R-08", "R-12"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="digital-twin-container">
      {/* 3D Warehouse Shelf Rack Simulation */}
      <div className="lg:col-span-2 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8B7FF5]" />
              <h3 className="text-base font-display font-medium text-[#EDEFF4]">
                WAREHOUSE DIGITAL TWIN GEOMETRY
              </h3>
            </div>
            <div className="flex bg-[#10131A] p-1 rounded-lg border border-[#2A3040] text-xs">
              <button
                onClick={() => {
                  setSelectedWarehouse("East");
                  sound.playClick();
                }}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  selectedWarehouse === "East"
                    ? "bg-[#8B7FF5] text-white"
                    : "text-[#8B92A5] hover:text-[#EDEFF4]"
                }`}
                id="btn-warehouse-east"
              >
                Warehouse East (HQ)
              </button>
              <button
                onClick={() => {
                  setSelectedWarehouse("West");
                  sound.playClick();
                }}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  selectedWarehouse === "West"
                    ? "bg-[#3B82F6] text-white"
                    : "text-[#8B92A5] hover:text-[#EDEFF4]"
                }`}
                id="btn-warehouse-west"
              >
                Warehouse West
              </button>
            </div>
          </div>

          <p className="text-xs text-[#8B92A5] mb-5">
            Real-time physical inventory shelf mapping. Click any shelf coordinates cell to focus the optical feed and retrieve active product specifications.
          </p>

          {/* Grid Layout representing Warehouse racks */}
          <div className="grid grid-cols-4 gap-3 bg-[#10131A] p-4 rounded-xl border border-[#2A3040]">
            {rackPositions.map((rack) => (
              <div key={rack} className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-center font-bold text-[#8B92A5] tracking-wider border-b border-[#2A3040] pb-1">
                  RACK {rack}
                </span>

                {shelfPositions.map((shelf) => {
                  // Find any product matching shelf-rack combination
                  const cellProduct = products.find(
                    (p) =>
                      p.shelf.startsWith(shelf) &&
                      p.rack === rack &&
                      (selectedWarehouse === "East"
                        ? p.shelf.includes("04") || p.shelf.includes("01") || p.shelf.includes("02")
                        : p.shelf.includes("11") || p.shelf.includes("02"))
                  );

                  const isSelected = selectedProduct && cellProduct && selectedProduct.sku === cellProduct.sku;
                  const isLowStock = cellProduct && cellProduct.stockLevel <= cellProduct.reorderPoint;

                  return (
                    <button
                      key={shelf}
                      onClick={() => cellProduct && handleSelectProduct(cellProduct)}
                      className={`h-20 rounded-lg p-2 flex flex-col justify-between transition-all relative group text-left ${
                        cellProduct
                          ? isSelected
                            ? "bg-[#8B7FF5]/20 border-2 border-[#8B7FF5] ring-2 ring-[#8B7FF5]/20"
                            : isLowStock
                            ? "bg-[#EF4444]/10 border border-[#EF4444]/40 hover:bg-[#EF4444]/20"
                            : "bg-[#1A1E29] border border-[#2A3040] hover:border-[#8B92A5]"
                          : "bg-[#10131A] border border-[#2A3040]/30 border-dashed opacity-40 cursor-not-allowed"
                      }`}
                      disabled={!cellProduct}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9px] font-mono text-[#8B92A5]">
                          {shelf}-{rack.replace("R-", "B")}
                        </span>
                        {isLowStock && (
                          <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
                        )}
                      </div>

                      {cellProduct ? (
                        <div className="truncate w-full mt-1">
                          <span className="text-[10px] font-display font-medium text-[#EDEFF4] block truncate">
                            {cellProduct.name}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400 block mt-0.5">
                            QTY: {cellProduct.stockLevel}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-mono text-[#2A3040] block self-end">
                          EMPTY
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Barcode Simulator Form */}
        <div className="mt-6 border-t border-[#2A3040] pt-4">
          <h4 className="text-xs font-mono font-medium text-[#EDEFF4] mb-3 flex items-center gap-2">
            <Barcode className="w-4 h-4 text-emerald-400" />
            VIRTUAL BARCODE / SCANNER TERMINAL
          </h4>

          <form onSubmit={handleSimulateScan} className="flex gap-2">
            <input
              type="text"
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              placeholder="Enter product barcode (e.g. 8490203112) or SKU..."
              className="flex-1 bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-[#8B7FF5] transition-colors placeholder-[#8B92A5]"
              id="barcode-input"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition-colors flex items-center gap-1.5"
              id="btn-scan-submit"
            >
              <Play className="w-3 h-3 fill-current" />
              SCAN
            </button>
          </form>

          {scanSuccessMsg && (
            <div className={`mt-2.5 p-2 rounded-lg text-xs font-mono flex items-center gap-2 ${
              scanSuccessMsg.includes("❌")
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            }`}>
              {scanSuccessMsg.includes("❌") ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {scanSuccessMsg}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <span className="text-[9px] font-mono text-[#8B92A5]">Presets:</span>
            <button
              type="button"
              onClick={() => { setScanCode("8490203112"); sound.playClick(); }}
              className="text-[9px] font-mono bg-[#10131A] border border-[#2A3040] px-1.5 py-0.5 rounded text-indigo-400 hover:border-indigo-400"
            >
              8490203112 (Laptop)
            </button>
            <button
              type="button"
              onClick={() => { setScanCode("7584102931"); sound.playClick(); }}
              className="text-[9px] font-mono bg-[#10131A] border border-[#2A3040] px-1.5 py-0.5 rounded text-[#F0A93A] hover:border-[#F0A93A]"
            >
              7584102931 (Server)
            </button>
            <button
              type="button"
              onClick={() => { setScanCode("4920194821"); sound.playClick(); }}
              className="text-[9px] font-mono bg-[#10131A] border border-[#2A3040] px-1.5 py-0.5 rounded text-sky-400 hover:border-sky-400"
            >
              4920194821 (IoT Sensor)
            </button>
          </div>
        </div>
      </div>

      {/* Selected Product Operations details view */}
      <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-5 flex flex-col justify-between">
        {selectedProduct ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="text-xs font-mono text-emerald-400 tracking-wider">
                COORDINATES: {selectedProduct.shelf}-{selectedProduct.rack}-{selectedProduct.bin}
              </span>
            </div>

            <h3 className="text-lg font-display font-semibold text-[#EDEFF4] mb-1">
              {selectedProduct.name}
            </h3>
            <p className="text-xs font-mono text-[#8B92A5] mb-4">
              SKU: {selectedProduct.sku} | BARCODE: {selectedProduct.barcode}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]">
                <span className="text-[10px] font-mono text-[#8B92A5] block">STOCK LEVEL</span>
                <span className="text-lg font-mono font-bold text-[#EDEFF4] block">
                  {selectedProduct.stockLevel}
                </span>
                <span className={`text-[9px] font-mono block mt-0.5 ${
                  selectedProduct.stockLevel <= selectedProduct.reorderPoint ? "text-red-400" : "text-emerald-400"
                }`}>
                  {selectedProduct.stockLevel <= selectedProduct.reorderPoint ? "⚠ BELOW SAFETY" : "✓ STATUS HEALTHY"}
                </span>
              </div>

              <div className="bg-[#10131A] p-3 rounded-xl border border-[#2A3040]">
                <span className="text-[10px] font-mono text-[#8B92A5] block">UNIT PRICE</span>
                <span className="text-lg font-mono font-bold text-[#EDEFF4] block">
                  ${selectedProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-mono text-indigo-400 block mt-0.5">
                  B2B wholesale tier
                </span>
              </div>
            </div>

            <div className="mb-5 bg-[#10131A] p-3 rounded-xl border border-[#2A3040]">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#8B92A5]">Primary Supplier:</span>
                <span className="font-medium text-[#EDEFF4]">{selectedProduct.supplier}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8B92A5]">Reorder Threshold:</span>
                <span className="font-mono text-[#EDEFF4]">{selectedProduct.reorderPoint} Units</span>
              </div>
            </div>

            {/* AI Predictions */}
            <div className="mb-5">
              <h4 className="text-xs font-mono font-medium text-[#EDEFF4] mb-2.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#8B7FF5]" />
                STRATA AI DEMAND PROJECTIONS
              </h4>
              <div className="space-y-1.5 bg-[#10131A] p-2.5 rounded-xl border border-[#2A3040] text-xs font-mono">
                {selectedProduct.predictions && selectedProduct.predictions.length > 0 ? (
                  selectedProduct.predictions.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5 border-b border-[#2A3040]/30 last:border-0">
                      <span className="text-[#8B92A5]">Period {p.date}:</span>
                      <span className="text-indigo-400 font-bold">
                        {p.demandForecast} units expected
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[#8B92A5] text-[10px]">No predictive telemetry modeled for this item yet.</span>
                )}
              </div>
            </div>

            {/* Physical Inventory Operations Audit Logs */}
            <div>
              <h4 className="text-xs font-mono font-medium text-[#EDEFF4] mb-2.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#8B92A5]" />
                AUDIT LEDGER HISTORIC
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedProduct.history.map((h, i) => (
                  <div key={i} className="bg-[#10131A] p-2 rounded-lg border border-[#2A3040]/60 text-[10px] font-mono flex justify-between items-center">
                    <div>
                      <span className="text-[#8B92A5] block text-[9px]">{h.date}</span>
                      <span className="text-[#EDEFF4] block leading-tight">{h.action}</span>
                    </div>
                    <span className={`font-bold ${h.quantity < 0 ? "text-red-400" : h.quantity > 0 ? "text-emerald-400" : "text-gray-400"}`}>
                      {h.quantity > 0 ? `+${h.quantity}` : h.quantity === 0 ? "LEDG" : h.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-[#8B92A5]">
            <Package className="w-12 h-12 mb-3 text-[#2A3040] stroke-1" />
            <span className="text-xs font-mono">No physical shelf coordinate focused.</span>
          </div>
        )}

        {selectedProduct && (
          <button
            onClick={() => {
              // Reset products to default states
              setProducts(enterpriseProducts);
              setSelectedProduct(enterpriseProducts[0]);
              sound.playClick();
            }}
            className="w-full mt-5 py-2.5 bg-[#10131A] hover:bg-[#1A1E29] border border-[#2A3040] rounded-xl text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-all flex items-center justify-center gap-1.5"
            id="btn-recalibrate-twin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RECALIBRATE SPATIAL COORDINATES
          </button>
        )}
      </div>

      {/* Full-width bottom section: AI Operations Simulation & Predictive Analytics */}
      <div className="lg:col-span-3 bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden animate-fadeIn" id="digital-twin-simulations-panel">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Column 1: AI Simulation Launcher */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> AI Operational Simulation
          </h4>
          <p className="text-xs text-[#8B92A5] leading-normal font-mono">
            Test facility and logistics stress tolerances. Trigger simulated physical failure conditions to compute downstream business P&L bottlenecks before execution.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleRunSimulation("SURGE")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "SURGE" ? "bg-indigo-600 border-indigo-500 text-white font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-[#8B7FF5]/40"
              }`}
            >
              📈 Demand Surge
            </button>
            <button
              onClick={() => handleRunSimulation("FAIL")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "FAIL" ? "bg-red-600/10 border-red-500/30 text-red-400 font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-red-500/40"
              }`}
            >
              🔌 Facility Outage
            </button>
            <button
              onClick={() => handleRunSimulation("DELAY")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "DELAY" ? "bg-indigo-600 border-indigo-500 text-white font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-[#8B7FF5]/40"
              }`}
            >
              ⏳ Supplier Delay
            </button>
            <button
              onClick={() => handleRunSimulation("DOWNTIME")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "DOWNTIME" ? "bg-red-600/10 border-red-500/30 text-red-400 font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-red-500/40"
              }`}
            >
              ⚙ Line Jam
            </button>
            <button
              onClick={() => handleRunSimulation("SHORTAGE")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "SHORTAGE" ? "bg-indigo-600 border-indigo-500 text-white font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-[#8B7FF5]/40"
              }`}
            >
              📦 Stock Shortage
            </button>
            <button
              onClick={() => handleRunSimulation("DISRUPT")}
              className={`py-2 px-3 text-left rounded-xl border text-[10px] font-mono transition-all ${
                activeSimulation === "DISRUPT" ? "bg-indigo-600 border-indigo-500 text-white font-bold" : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4] hover:border-[#8B7FF5]/40"
              }`}
            >
              🚚 Transit Block
            </button>
          </div>
        </div>

        {/* Column 2: Simulated Business Impact Output */}
        <div className="space-y-4 border-t md:border-t-0 md:border-x border-[#2A3040] pt-4 md:pt-0 md:px-6">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Predicted Business Impact
          </h4>

          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#8B92A5] font-mono text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-[#8B7FF5] mb-2" />
              <span>Recalibrating twin parameters...</span>
            </div>
          ) : simulationResult ? (
            <div className="space-y-3.5 font-mono text-xs animate-fadeIn">
              <div>
                <span className="text-[9px] text-[#8B92A5] block uppercase font-bold">MODEL IMPACT</span>
                <span className="text-[#EDEFF4] font-bold block mt-0.5 leading-snug">{simulationResult.impact}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#10131A] p-2 rounded-xl border border-[#2A3040]">
                  <span className="text-[9px] text-[#8B92A5] block uppercase font-bold">FAILURE PROB</span>
                  <span className="text-red-400 font-bold block mt-0.5">{simulationResult.probability}</span>
                </div>
                <div className="bg-[#10131A] p-2 rounded-xl border border-[#2A3040]">
                  <span className="text-[9px] text-[#8B92A5] block uppercase font-bold">CAPACITY COEFF</span>
                  <span className="text-indigo-400 font-bold block mt-0.5">{simulationResult.capacity}</span>
                </div>
              </div>
              <div className="border border-indigo-500/20 bg-indigo-950/20 rounded-xl p-3">
                <span className="text-[9px] text-indigo-400 font-bold block uppercase">RECOMMENDED AI RESPONSE</span>
                <p className="text-[11px] text-[#8B92A5] leading-relaxed mt-1">{simulationResult.mitigation}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8B92A5] font-mono text-[11px]">
              <Cpu className="w-8 h-8 text-[#2A3040] mb-2" />
              <span>Select an active simulation incident trigger to project neural impact parameters.</span>
            </div>
          )}
        </div>

        {/* Column 3: Equipment Health & Workforce Tracking */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Predictive Analytics & Health
          </h4>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#10131A] p-2 rounded-xl border border-[#2A3040]">
              <div>
                <span className="text-[#EDEFF4] block font-medium">Line 2 Sorting Arm</span>
                <span className="text-[9px] text-[#8B92A5] block">Telemetry Node: EQ-ARM-C2</span>
              </div>
              <div className="text-right">
                <span className="text-red-400 font-bold block">71.4% Health</span>
                <span className="text-[9px] text-red-400 block">18.2% Failure Prob</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#10131A] p-2 rounded-xl border border-[#2A3040]">
              <div>
                <span className="text-[#EDEFF4] block font-medium">Forklift AGV-09 Fleet</span>
                <span className="text-[9px] text-[#8B92A5] block font-bold">Telemetry Node: EQ-AGV-09</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold block">88.5% Health</span>
                <span className="text-[9px] text-[#8B92A5] block">4.8% Failure Prob</span>
              </div>
            </div>

            {/* Workforce Locations */}
            <div className="border border-[#2A3040] bg-[#10131A] p-2.5 rounded-xl text-[10px] text-[#8B92A5] space-y-1">
              <span className="text-indigo-400 font-bold block uppercase tracking-wider">Workforce GPS Coordinates</span>
              <div className="flex justify-between">
                <span>Elena Mitchell:</span>
                <span className="text-[#EDEFF4]">Zone A Loading Bay</span>
              </div>
              <div className="flex justify-between">
                <span>Marcus Thorne:</span>
                <span className="text-[#EDEFF4]">Assembly Line 2 Belt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DigitalTwin;
