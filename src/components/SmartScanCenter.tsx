import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "motion/react";
import { ProductItem } from "../types";
import { sound } from "../utils/audio";
import { 
  Scan, Barcode, QrCode, Camera, Search, Sparkles, CheckCircle, 
  AlertTriangle, ArrowRight, Package, ShieldCheck, Database, RefreshCw, 
  History, SlidersHorizontal, Plus, Minus, ArrowUpRight, Truck, Warehouse, X, Eye
} from "lucide-react";

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

interface SmartScanCenterProps {
  onTimelineLogged?: (title: string, desc: string, category: "INVENTORY" | "AI_FORECAST" | "SALES" | "AUTOMATION" | "SYSTEM") => void;
  productsList: ProductItem[];
  setProductsList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  selectedPresetId?: "RETAIL" | "MANUFACTURING" | "WAREHOUSE" | "MARKETING" | "FINANCE";
  activePreset?: any;
}

// 6 realistic seed items per industry to ensure high density without hitting token limits
const SEED_PRODUCTS_MAP: Record<string, any[]> = {
  RETAIL: [
    { sku: "SKU-RET-01", barcode: "8490203112", qrCode: "QR-RET-01", productName: "Apex Pro Laptop 15\"", category: "Electronics", quantity: 12, warehouse: "Warehouse East", shelf: "A-04", supplier: "Silicon Dynamics", batchNumber: "B-RET-882", expiryDate: "2029-12-31", lastUpdated: "2026-07-01", status: "Low Stock", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&auto=format&fit=crop" },
    { sku: "SKU-RET-02", barcode: "9218491029", qrCode: "QR-RET-02", productName: "UHD UltraWide Display", category: "Electronics", quantity: 8, warehouse: "Warehouse East", shelf: "A-02", supplier: "Silicon Dynamics", batchNumber: "B-RET-551", expiryDate: "2029-06-30", lastUpdated: "2026-07-05", status: "Low Stock", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop" },
    { sku: "SKU-RET-03", barcode: "1112223334", qrCode: "QR-RET-03", productName: "Pro Ergonomic Office Chair", category: "Furniture", quantity: 45, warehouse: "Warehouse West", shelf: "F-12", supplier: "Comfort Seats Ltd", batchNumber: "B-RET-091", expiryDate: "N/A", lastUpdated: "2026-06-15", status: "In Stock", image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=200&auto=format&fit=crop" },
    { sku: "SKU-RET-04", barcode: "2223334445", qrCode: "QR-RET-04", productName: "Smart Desk LED Lamp v2", category: "Home Office", quantity: 85, warehouse: "Warehouse East", shelf: "L-03", supplier: "Lumina Lightings", batchNumber: "B-RET-231", expiryDate: "2031-01-01", lastUpdated: "2026-07-02", status: "In Stock", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&auto=format&fit=crop" },
    { sku: "SKU-RET-05", barcode: "3334445556", qrCode: "QR-RET-05", productName: "Noise-Cancelling Headphones", category: "Audio", quantity: 28, warehouse: "Warehouse West", shelf: "H-09", supplier: "Acoustics Global", batchNumber: "B-RET-712", expiryDate: "2030-05-20", lastUpdated: "2026-06-28", status: "In Stock", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop" },
    { sku: "SKU-RET-06", barcode: "4445556667", qrCode: "QR-RET-06", productName: "Universal USB-C Dock", category: "Accessories", quantity: 50, warehouse: "Warehouse West", shelf: "D-10", supplier: "Silicon Dynamics", batchNumber: "B-RET-890", expiryDate: "2032-10-15", lastUpdated: "2026-07-04", status: "In Stock", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&auto=format&fit=crop" }
  ],
  MANUFACTURING: [
    { sku: "SKU-MFG-01", barcode: "7584102931", qrCode: "QR-MFG-01", productName: "Carbon Steel Rotational Gear v2", category: "Heavy Machinery", quantity: 4, warehouse: "Assembly Zone C", shelf: "M-22", supplier: "Titan Heavy Parts", batchNumber: "B-MFG-881", expiryDate: "N/A", lastUpdated: "2026-07-04", status: "Critical", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop" },
    { sku: "SKU-MFG-02", barcode: "1313131313", qrCode: "QR-MFG-02", productName: "Hydraulic Valve Cylinder H1", category: "Pneumatics", quantity: 25, warehouse: "Hydraulics Bay", shelf: "H-12", supplier: "FluidTech", batchNumber: "B-MFG-102", expiryDate: "N/A", lastUpdated: "2026-07-02", status: "In Stock", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop" },
    { sku: "SKU-MFG-03", barcode: "1414141414", qrCode: "QR-MFG-03", productName: "Electric Alternator Core 440V", category: "Electronics", quantity: 15, warehouse: "Electrical Rack 4", shelf: "E-05", supplier: "Tesla Power", batchNumber: "B-MFG-301", expiryDate: "2030-01-01", lastUpdated: "2026-07-05", status: "In Stock", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop" },
    { sku: "SKU-MFG-04", barcode: "1515151515", qrCode: "QR-MFG-04", productName: "Induction Heating Coil", category: "Tooling", quantity: 8, warehouse: "Milling Station 2", shelf: "I-03", supplier: "HeatFlow Corp", batchNumber: "B-MFG-404", expiryDate: "2028-12-15", lastUpdated: "2026-07-03", status: "Low Stock", image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=200&auto=format&fit=crop" },
    { sku: "SKU-MFG-05", barcode: "1616161616", qrCode: "QR-MFG-05", productName: "Pneumatic Compressor Pump", category: "Pneumatics", quantity: 3, warehouse: "Power Plant East", shelf: "P-01", supplier: "FluidTech", batchNumber: "B-MFG-911", expiryDate: "N/A", lastUpdated: "2026-07-06", status: "Low Stock", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop" },
    { sku: "SKU-MFG-06", barcode: "1717171717", qrCode: "QR-MFG-06", productName: "High-Temp Gasket Seal", category: "Consumables", quantity: 150, warehouse: "Main Warehouse", shelf: "G-10", supplier: "GasketMasters", batchNumber: "B-MFG-202", expiryDate: "2028-06-30", lastUpdated: "2026-07-01", status: "In Stock", image: "https://images.unsplash.com/photo-1581092162384-868722a2a17f?w=200&auto=format&fit=crop" }
  ],
  WAREHOUSE: [
    { sku: "SKU-WAR-01", barcode: "4920194821", qrCode: "QR-WAR-01", productName: "Quantum IoT Controller", category: "IoT Sensors", quantity: 142, warehouse: "Warehouse West, Zone A", shelf: "C-11", supplier: "Telematics Global", batchNumber: "B-WAR-011", expiryDate: "2031-07-07", lastUpdated: "2026-07-05", status: "In Stock", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop" },
    { sku: "SKU-WAR-02", barcode: "2424242424", qrCode: "QR-WAR-02", productName: "AGV Lithium Battery Pack v3", category: "Material Handling", quantity: 18, warehouse: "AGV Service Deck", shelf: "S-01", supplier: "Vanguard Labs", batchNumber: "B-WAR-982", expiryDate: "2029-05-15", lastUpdated: "2026-07-03", status: "In Stock", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&auto=format&fit=crop" },
    { sku: "SKU-WAR-03", barcode: "2525252525", qrCode: "QR-WAR-03", productName: "Industrial Pallet Wrapper", category: "Packaging", quantity: 5, warehouse: "Dispatch Area B", shelf: "D-04", supplier: "PackSys Ltd", batchNumber: "B-WAR-332", expiryDate: "N/A", lastUpdated: "2026-07-02", status: "Low Stock", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop" },
    { sku: "SKU-WAR-04", barcode: "2626262626", qrCode: "QR-WAR-04", productName: "RFID Smart Asset Tags", category: "Labeling", quantity: 30, warehouse: "Tag Registry Room", shelf: "R-02", supplier: "Telematics Global", batchNumber: "B-WAR-411", expiryDate: "N/A", lastUpdated: "2026-07-06", status: "In Stock", image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=200&auto=format&fit=crop" },
    { sku: "SKU-WAR-05", barcode: "2727272727", qrCode: "QR-WAR-05", productName: "Steel Banding Strapping Kit", category: "Packaging", quantity: 15, warehouse: "Dispatch Area B", shelf: "D-08", supplier: "PackSys Ltd", batchNumber: "B-WAR-515", expiryDate: "N/A", lastUpdated: "2026-06-28", status: "Low Stock", image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=200&auto=format&fit=crop" },
    { sku: "SKU-WAR-06", barcode: "2828282828", qrCode: "QR-WAR-06", productName: "Hazardous Spill Containment Kit", category: "Safety", quantity: 12, warehouse: "Emergency Depot", shelf: "E-01", supplier: "SafeOps Supplies", batchNumber: "B-WAR-602", expiryDate: "2031-12-31", lastUpdated: "2026-07-04", status: "In Stock", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop" }
  ],
  DISTRIBUTION: [
    { sku: "SKU-DST-01", barcode: "3535353535", qrCode: "QR-DST-01", productName: "High-Security Transit RFID Locks", category: "Security", quantity: 320, warehouse: "Staging Zone G", shelf: "L-04", supplier: "TransitSec Global", batchNumber: "B-DST-001", expiryDate: "N/A", lastUpdated: "2026-07-05", status: "In Stock", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop" },
    { sku: "SKU-DST-02", barcode: "3636363636", qrCode: "QR-DST-02", productName: "Refrigerated Container Monitoring Unit", category: "Telemetry", quantity: 45, warehouse: "Cold Chain Depot", shelf: "T-11", supplier: "IceEdge IoT Systems", batchNumber: "B-DST-910", expiryDate: "2030-10-10", lastUpdated: "2026-07-04", status: "In Stock", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop" },
    { sku: "SKU-DST-03", barcode: "3737373737", qrCode: "QR-DST-03", productName: "Aluminum Logistics Pallet", category: "Shipping", quantity: 600, warehouse: "Main Logistics Floor", shelf: "P-05", supplier: "AluCargo Group", batchNumber: "B-DST-441", expiryDate: "N/A", lastUpdated: "2026-07-03", status: "In Stock", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop" },
    { sku: "SKU-DST-04", barcode: "3838383838", qrCode: "QR-DST-04", productName: "Heavy Freight Ratchet Strap (10m)", category: "Cargo Control", quantity: 1500, warehouse: "Cargo Bay West", shelf: "S-22", supplier: "TransitSec Global", batchNumber: "B-DST-122", expiryDate: "N/A", lastUpdated: "2026-07-02", status: "In Stock", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&auto=format&fit=crop" },
    { sku: "SKU-DST-05", barcode: "3939393939", qrCode: "QR-DST-05", productName: "Thermal Cargo Blankets", category: "Shipping", quantity: 80, warehouse: "Cold Chain Depot", shelf: "B-03", supplier: "IceEdge IoT Systems", batchNumber: "B-DST-505", expiryDate: "2031-12-12", lastUpdated: "2026-07-01", status: "In Stock", image: "https://images.unsplash.com/photo-1553413766-41f9d287af3c?w=200&auto=format&fit=crop" },
    { sku: "SKU-DST-06", barcode: "4040404040", qrCode: "QR-DST-06", productName: "OBD Fleet Telematics Tracker", category: "Telemetry", quantity: 14, warehouse: "Staging Zone G", shelf: "L-08", supplier: "TransitSec Global", batchNumber: "B-DST-707", expiryDate: "2029-08-08", lastUpdated: "2026-07-06", status: "Low Stock", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&auto=format&fit=crop" }
  ],
  AGRICULTURE: [
    { sku: "SKU-AGR-01", barcode: "4747474747", qrCode: "QR-AGR-01", productName: "Premium Basil Bio-Fertilizer", category: "Nutrients", quantity: 180, warehouse: "Bulk Storage E", shelf: "A-01", supplier: "GreenGrow Agro", batchNumber: "B-AGR-102", expiryDate: "2028-06-01", lastUpdated: "2026-07-05", status: "In Stock", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&auto=format&fit=crop" },
    { sku: "SKU-AGR-02", barcode: "4848484848", qrCode: "QR-AGR-02", productName: "Hydroponic Nutrient Concentrate 10L", category: "Nutrients", quantity: 45, warehouse: "Bulk Storage E", shelf: "A-03", supplier: "GreenGrow Agro", batchNumber: "B-AGR-554", expiryDate: "2027-12-31", lastUpdated: "2026-07-04", status: "In Stock", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&auto=format&fit=crop" },
    { sku: "SKU-AGR-03", barcode: "5050505050", qrCode: "QR-AGR-03", productName: "Wireless Soil pH Probe", category: "IoT Sensors", quantity: 12, warehouse: "Sensor Shed 2", shelf: "S-02", supplier: "AgriShield Telemetry", batchNumber: "B-AGR-910", expiryDate: "2032-10-15", lastUpdated: "2026-07-03", status: "Low Stock", image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=200&auto=format&fit=crop" },
    { sku: "SKU-AGR-04", barcode: "5151515151", qrCode: "QR-AGR-04", productName: "Smart Automated Drip Emitters", category: "Irrigation", quantity: 65, warehouse: "Irrigation Depot", shelf: "I-05", supplier: "HydroFlow Irrigation", batchNumber: "B-AGR-442", expiryDate: "N/A", lastUpdated: "2026-07-06", status: "In Stock", image: "https://images.unsplash.com/photo-1463123081488-729f511726f7?w=200&auto=format&fit=crop" },
    { sku: "SKU-AGR-05", barcode: "5252525252", qrCode: "QR-AGR-05", productName: "Biodegradable Plant Starter Pots", category: "Planting Supplies", quantity: 4200, warehouse: "Nursery Storage", shelf: "N-12", supplier: "GreenGrow Agro", batchNumber: "B-AGR-003", expiryDate: "N/A", lastUpdated: "2026-07-01", status: "In Stock", image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=200&auto=format&fit=crop" },
    { sku: "SKU-AGR-06", barcode: "5353535353", qrCode: "QR-AGR-06", productName: "UV-Stabilized Greenhouse Film 50m", category: "Infrastructure", quantity: 8, warehouse: "Nursery Storage", shelf: "N-01", supplier: "HydroFlow Irrigation", batchNumber: "B-AGR-881", expiryDate: "N/A", lastUpdated: "2026-06-28", status: "Low Stock", image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=200&auto=format&fit=crop" }
  ]
};

export const SmartScanCenter: React.FC<SmartScanCenterProps> = ({ 
  onTimelineLogged, 
  productsList, 
  setProductsList,
  selectedPresetId = "RETAIL",
  activePreset
}) => {
  // Sync the loaded industry profile. Users can override dynamically
  const [activeIndustry, setActiveIndustry] = useState<string>("RETAIL");
  const [sessionProducts, setSessionProducts] = useState<any[]>([]);
  const [scannedItem, setScannedItem] = useState<any | null>(null);
  
  // Camera & Scan Process states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanMethod, setScanMethod] = useState<"NATIVE" | "HTML5_QRCODE" | "SIMULATOR">("SIMULATOR");
  const [scanResultToast, setScanResultToast] = useState<string | null>(null);

  // Manual Inputs
  const [manualCodeInput, setManualCodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // AI recommendations
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Scan history logs
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  
  // History filters
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterWarehouse, setFilterWarehouse] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Mock edits active states
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [editQtyChange, setEditQtyChange] = useState<number>(0);
  const [editWarehouse, setEditWarehouse] = useState("");
  const [editShelf, setEditShelf] = useState("");

  const localStreamRef = useRef<MediaStream | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const nativeDetectionActiveRef = useRef<boolean>(false);

  // Sync state initially with preset id or RETAIL
  useEffect(() => {
    const defaultInd = selectedPresetId === "MARKETING" || selectedPresetId === "FINANCE" ? selectedPresetId : selectedPresetId;
    setActiveIndustry(defaultInd);
  }, [selectedPresetId]);

  // Load appropriate seeded inventory when industry profile changes
  useEffect(() => {
    const seeds = SEED_PRODUCTS_MAP[activeIndustry] || [];
    setSessionProducts(JSON.parse(JSON.stringify(seeds))); // Deep copy to isolate modifications
    setScannedItem(seeds[0] || null);
    setAiInsights([]);

    // Hydrate basic scan history with 3 entries for context
    if (seeds.length > 0) {
      setScanHistory([
        { time: "10:18 AM", user: "ID-0941", industry: activeIndustry, warehouse: seeds[0].warehouse, product: seeds[0].productName, quantity: 2, action: "Dispatched", status: "Nominal" },
        { time: "09:40 AM", user: "ID-0331", industry: activeIndustry, warehouse: seeds[0].warehouse, product: seeds[1]?.productName || seeds[0].productName, quantity: 15, action: "Inbound Delivery", status: "Nominal" },
        { time: "08:15 AM", user: "ID-0941", industry: activeIndustry, warehouse: seeds[2]?.warehouse || seeds[0].warehouse, product: seeds[2]?.productName || seeds[0].productName, quantity: 5, action: "Stock Audit", status: "Nominal" }
      ]);
    } else {
      setScanHistory([]);
    }
  }, [activeIndustry]);

  // Trigger Gemini Insights for recently scanned product
  const fetchGeminiInsights = async (product: any) => {
    if (!product) return;
    setIsLoadingInsights(true);
    try {
      const response = await fetch(`/api/insights/${activeIndustry}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentlyScannedProduct: product,
          industryMetrics: {
            selectedPresetId,
            industryName: activePreset?.industry || "Retail & Warehousing",
            grossProfit: activePreset?.grossProfit,
            revenue: activePreset?.revenue
          },
          inventoryMetrics: {
            totalAvailableItems: sessionProducts.reduce((sum, p) => sum + p.quantity, 0),
            lowStockAlertsCount: sessionProducts.filter(p => p.quantity <= 15).length
          }
        })
      });
      const data = await response.json();
      setAiInsights(data);
    } catch (err) {
      console.error("Error calling Gemini insights API:", err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Perform core successful scan operations
  const handleSuccessfulScan = (code: string, methodSource = "Scanner") => {
    const cleaned = code.trim();
    const matched = sessionProducts.find(p => p.barcode === cleaned || p.sku.toLowerCase() === cleaned.toLowerCase() || p.qrCode === cleaned);
    
    if (matched) {
      sound.playBarcodeScanned();
      setScannedItem(matched);
      setIsUpdateFormOpen(false);
      setScanResultToast(`✓ Successfully identified asset via ${methodSource}: ${matched.productName}`);
      
      // Update local history
      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        user: "ID-0042",
        industry: activeIndustry,
        warehouse: matched.warehouse,
        product: matched.productName,
        quantity: 1,
        action: "Scanned",
        status: matched.quantity <= 15 ? "Low Stock" : "Nominal"
      };
      setScanHistory(prev => [newLog, ...prev]);

      // Trigger timeline audit if callback present
      if (onTimelineLogged) {
        onTimelineLogged(
          "Scanner Pipeline Triggered",
          `Scanned asset: ${matched.productName} (SKU: ${matched.sku}). Automated inventory reconciliation completed with zero audit variance.`,
          "INVENTORY"
        );
      }

      // Load AI Insights
      fetchGeminiInsights(matched);
    } else {
      sound.playNotification();
      setScanResultToast(`❌ Asset signature "${cleaned}" not matched in active industry catalog.`);
    }

    setTimeout(() => setScanResultToast(null), 4500);
  };

  // Start Live Camera Capture Flow
  const startCameraScan = async () => {
    setIsCameraActive(true);
    setIsLoadingCamera(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      localStreamRef.current = stream;

      const hasNativeSupport = "BarcodeDetector" in window;
      if (hasNativeSupport) {
        setScanMethod("NATIVE");
        const videoEl = document.getElementById("scanner-video-source") as HTMLVideoElement;
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.setAttribute("playsinline", "true");
          await videoEl.play();

          const formats = ["qr_code", "ean_13", "upc_a", "upc_e", "code_128", "code_39", "data_matrix"];
          const detector = new window.BarcodeDetector({ formats });
          
          nativeDetectionActiveRef.current = true;
          const detectionLoop = async () => {
            if (!nativeDetectionActiveRef.current) return;
            try {
              if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
                const barcodes = await detector.detect(videoEl);
                if (barcodes.length > 0) {
                  handleSuccessfulScan(barcodes[0].rawValue, "Native BarcodeDetector");
                  closeCameraScan();
                  return;
                }
              }
            } catch (err) {
              console.error("Native loop detection fault:", err);
            }
            requestAnimationFrame(detectionLoop);
          };
          requestAnimationFrame(detectionLoop);
        }
      } else {
        // Fallback to Html5Qrcode
        setScanMethod("HTML5_QRCODE");
        // Ensure reader node is present before instantiating
        setTimeout(async () => {
          try {
            const html5QrCode = new Html5Qrcode("html5-reader-target");
            html5QrCodeRef.current = html5QrCode;
            await html5QrCode.start(
              { facingMode: "environment" },
              {
                fps: 15,
                qrbox: (w, h) => {
                  const size = Math.min(w, h) * 0.75;
                  return { width: size, height: size };
                }
              },
              (decodedText) => {
                handleSuccessfulScan(decodedText, "HTML5-QRCode Engine");
                closeCameraScan();
              },
              () => {
                // quiet background scan noise
              }
            );
          } catch (initErr: any) {
            console.error("HTML5 fallback error during start:", initErr);
            setCameraError(`HTML5 Engine: ${initErr.message || "Failed to engage camera stream."}`);
          }
        }, 100);
      }
      setIsLoadingCamera(false);
    } catch (err: any) {
      console.warn("Camera media exception:", err);
      setCameraError(
        "Standard Web Camera Access was blocked. Please authorize camera permissions or utilize our interactive scan simulator widgets below."
      );
      setScanMethod("SIMULATOR");
      setIsLoadingCamera(false);
    }
  };

  // Close Camera Capture Flow cleanly
  const closeCameraScan = () => {
    nativeDetectionActiveRef.current = false;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current = null;
      }).catch(err => {
        console.warn("Error stopping html5-qrcode instance:", err);
      });
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  // Run mock inventory state edits and persist
  const handlePersistInventoryUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedItem) return;

    sound.playAIComplete();
    const updatedProducts = sessionProducts.map(p => {
      if (p.sku === scannedItem.sku) {
        const nextQty = Math.max(0, p.quantity + editQtyChange);
        const nextWarehouse = editWarehouse.trim() || p.warehouse;
        const nextShelf = editShelf.trim() || p.shelf;
        const nextStatus = nextQty <= 0 ? "Critical" : nextQty <= 15 ? "Low Stock" : "In Stock";
        
        return {
          ...p,
          quantity: nextQty,
          warehouse: nextWarehouse,
          shelf: nextShelf,
          status: nextStatus,
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      }
      return p;
    });

    setSessionProducts(updatedProducts);
    const matchedNew = updatedProducts.find(p => p.sku === scannedItem.sku);
    setScannedItem(matchedNew || null);

    // Log history
    const updateAction = editQtyChange > 0 ? "Inbound Rec" : editQtyChange < 0 ? "Outbound Dispatch" : "Location Shift";
    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      user: "ID-0042",
      industry: activeIndustry,
      warehouse: editWarehouse || scannedItem.warehouse,
      product: scannedItem.productName,
      quantity: Math.abs(editQtyChange) || 1,
      action: updateAction,
      status: matchedNew?.status || "Nominal"
    };
    setScanHistory(prev => [newLog, ...prev]);

    if (onTimelineLogged) {
      onTimelineLogged(
        "Asset Parameters Corrected",
        `Adjusted physical parameters for SKU: ${scannedItem.sku}. Verified shelf alignment at ${editWarehouse || scannedItem.warehouse} (${editShelf || scannedItem.shelf}).`,
        "SYSTEM"
      );
    }

    setIsUpdateFormOpen(false);
    setEditQtyChange(0);
    setEditWarehouse("");
    setEditShelf("");
    setScanResultToast("✓ Physical asset records updated on STRATA distributed ledgers.");
    setTimeout(() => setScanResultToast(null), 3000);
  };

  // Quick Action: Transfer Stock
  const handleQuickTransferStock = () => {
    if (!scannedItem) return;
    sound.playClick();
    const destination = scannedItem.warehouse.includes("East") ? "Warehouse West" : "Warehouse East";
    
    const updatedProducts = sessionProducts.map(p => {
      if (p.sku === scannedItem.sku) {
        return {
          ...p,
          warehouse: destination,
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      }
      return p;
    });

    setSessionProducts(updatedProducts);
    setScannedItem(updatedProducts.find(p => p.sku === scannedItem.sku) || null);

    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      user: "ID-0042",
      industry: activeIndustry,
      warehouse: destination,
      product: scannedItem.productName,
      quantity: scannedItem.quantity,
      action: "Transferred",
      status: "Nominal"
    };
    setScanHistory(prev => [newLog, ...prev]);
    setScanResultToast(`✓ Relocating stock to ${destination} ledger cells...`);
    setTimeout(() => setScanResultToast(null), 3000);
  };

  // Quick Action: Mark Damaged
  const handleQuickMarkDamaged = () => {
    if (!scannedItem) return;
    sound.playNotification();
    
    const updatedProducts = sessionProducts.map(p => {
      if (p.sku === scannedItem.sku) {
        return {
          ...p,
          quantity: Math.max(0, p.quantity - 1),
          status: "Critical",
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      }
      return p;
    });

    setSessionProducts(updatedProducts);
    setScannedItem(updatedProducts.find(p => p.sku === scannedItem.sku) || null);

    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      user: "ID-0042",
      industry: activeIndustry,
      warehouse: scannedItem.warehouse,
      product: scannedItem.productName,
      quantity: 1,
      action: "Mark Damaged",
      status: "Critical"
    };
    setScanHistory(prev => [newLog, ...prev]);
    setScanResultToast(`⚠️ 1 unit of ${scannedItem.productName} flagged as Damaged. Audit alerted.`);
    setTimeout(() => setScanResultToast(null), 3500);
  };

  // Filter scan history database
  const filteredHistory = scanHistory.filter(log => {
    if (filterAction !== "ALL" && log.action.toLowerCase() !== filterAction.toLowerCase() && !(filterAction === "DISPATCHED" && log.action === "Dispatched")) return false;
    if (filterWarehouse !== "ALL" && !log.warehouse.toLowerCase().includes(filterWarehouse.toLowerCase())) return false;
    if (filterStatus !== "ALL" && log.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    return true;
  });

  // Check if Marketing or Finance requested - show informative empty state
  const isServiceBlocked = activeIndustry === "MARKETING" || activeIndustry === "FINANCE";

  return (
    <div className="space-y-6" id="smart-scan-center-module">
      
      {/* Control Navigation & Industry Profiler */}
      <div className="bg-[#1A1E29] border border-[#2A3040]/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                Layer 1 – Smart Operations
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                Layer 2 – Business Operations
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#EDEFF4] flex items-center gap-2.5">
              <Scan className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
              Smart Barcode & QR Scanner
            </h2>
            <p className="text-xs text-[#8B92A5] max-w-xl">
              Production-ready multi-format scanner. Autodetect EAN-13, UPC, Code 128, and QR models with immediate server-side Gemini intelligence insights.
            </p>
          </div>

          {/* Selector to trigger any of the 5 inventory or 2 services */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-[#8B92A5] font-bold">OPERATIONS NODE:</span>
            <select
              value={activeIndustry}
              onChange={(e) => setActiveIndustry(e.target.value)}
              className="bg-[#10131A] border border-[#2A3040] rounded-lg px-3 py-1.5 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-emerald-500"
            >
              <option value="RETAIL">Retail Profile</option>
              <option value="MANUFACTURING">Manufacturing Profile</option>
              <option value="WAREHOUSE">Warehousing Profile</option>
              <option value="DISTRIBUTION">Distribution Profile</option>
              <option value="AGRICULTURE">Agriculture Profile</option>
              <option value="MARKETING">Marketing & CRM (Empty State)</option>
              <option value="FINANCE">Finance & Hedge (Empty State)</option>
            </select>
          </div>
        </div>

        {/* Global Toast Alerts */}
        <AnimatePresence>
          {scanResultToast && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-xl text-xs font-mono flex items-center gap-2.5 shadow-lg border ${
                scanResultToast.includes("❌") 
                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {scanResultToast.includes("❌") ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {scanResultToast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isServiceBlocked ? (
        /* Empty state for non-inventory driven sectors */
        <div className="bg-[#1A1E29] border border-dashed border-[#2A3040] rounded-2xl p-16 text-center max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="p-4 bg-amber-500/10 rounded-full text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-[#EDEFF4] font-display font-bold text-base">Physical Inventory Blocked</h3>
          <p className="text-[#8B92A5] text-xs max-w-md leading-relaxed">
            This industry does not manage physical inventory. Barcode scanning is available only for inventory-driven industries.
          </p>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setActiveIndustry("RETAIL")}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-mono text-white transition-all font-bold"
            >
              Switch to Retail (Inventory)
            </button>
            <button
              onClick={() => setActiveIndustry("WAREHOUSE")}
              className="bg-[#10131A] hover:bg-[#2A3040] border border-[#2A3040] px-4 py-2 rounded-xl text-xs font-mono text-[#EDEFF4] transition-all"
            >
              Switch to Warehousing
            </button>
          </div>
        </div>
      ) : (
        /* Full Production Interactive Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Scan Control Stage */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Camera Console Card */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  OPTICAL SCANNER CONSOLE
                </h3>
                <span className="text-[10px] font-mono text-[#8B92A5] bg-[#10131A] px-2.5 py-1 rounded border border-[#2A3040]">
                  Hardware Terminal: Active
                </span>
              </div>

              {/* Laser viewport */}
              <div className="h-56 bg-[#10131A] rounded-xl border border-[#2A3040] relative overflow-hidden flex flex-col items-center justify-center p-4">
                {isCameraActive ? (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    {/* Laser scanner horizontal indicator */}
                    <div className="absolute left-0 right-0 h-[2px] bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10 animate-bounce" />
                    
                    {isLoadingCamera && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#10131A] z-20 space-y-2">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                        <span className="text-[11px] font-mono text-[#8B92A5]">Initializing Media Camera...</span>
                      </div>
                    )}

                    {cameraError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#10131A] z-20 space-y-2">
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                        <p className="text-[10px] font-mono text-amber-300 max-w-sm">{cameraError}</p>
                        <button
                          onClick={closeCameraScan}
                          className="px-3 py-1 bg-[#1A1E29] border border-[#2A3040] hover:bg-[#2A3040] text-[10px] font-mono text-[#EDEFF4] rounded"
                        >
                          Dismiss Camera
                        </button>
                      </div>
                    ) : (
                      <>
                        <div id="html5-reader-target" className="w-full h-full object-cover" />
                        <video id="scanner-video-source" className="absolute inset-0 w-full h-full object-cover hidden" />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-3 z-10 max-w-md">
                    <Barcode className="w-12 h-12 text-[#2A3040] mx-auto animate-pulse" />
                    <div>
                      <p className="text-xs font-mono font-bold text-[#EDEFF4]">Optical Lens Standard Passive</p>
                      <p className="text-[10px] font-mono text-[#8B92A5] mt-1">
                        Accepts EAN-13, UPC, Code 128, Code 39, Data Matrix and QRs.
                      </p>
                    </div>
                    <button
                      onClick={startCameraScan}
                      className="mx-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-xs font-mono text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      ENGAGE CAMERA SCANNER
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Input Fallback & Testing Simulators */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                <div className="md:col-span-8 relative">
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    placeholder="Enter SKU, EAN-13, or QR Code tag..."
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-emerald-500 placeholder-[#8B92A5]"
                  />
                  <Barcode className="w-4 h-4 text-[#8B92A5] absolute left-3 top-3.5" />
                </div>
                <button
                  onClick={() => {
                    handleSuccessfulScan(manualCodeInput, "Manual Keyboard Input");
                    setManualCodeInput("");
                  }}
                  className="md:col-span-4 bg-[#10131A] hover:bg-[#2A3040] border border-[#2A3040] py-2.5 rounded-xl text-xs font-mono text-[#EDEFF4] font-bold transition-all"
                >
                  DECODE SIGNATURE
                </button>
              </div>

              {/* Click-to-Scan Preset Simulators for Demo Ease */}
              <div className="bg-[#10131A]/60 p-3.5 rounded-xl border border-[#2A3040]/50 space-y-2">
                <span className="text-[10px] font-mono text-[#8B92A5] block font-bold uppercase tracking-wider">
                  Test Simulator Triggers (Click to Mock Scan):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sessionProducts.slice(0, 4).map(p => (
                    <button
                      key={p.sku}
                      onClick={() => handleSuccessfulScan(p.barcode, "Laser Gun Simulation")}
                      className="text-[10px] font-mono bg-[#1A1E29] hover:bg-[#2A3040] border border-[#2A3040] px-2.5 py-1.5 rounded-lg text-[#EDEFF4] transition-all flex items-center gap-1.5"
                    >
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>{p.productName.split(" ")[0]} ({p.barcode})</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSuccessfulScan(sessionProducts[0]?.qrCode || "QR-RET-01", "Laser QR Simulator")}
                    className="text-[10px] font-mono bg-[#1A1E29] hover:bg-[#2A3040] border border-[#2A3040] px-2.5 py-1.5 rounded-lg text-indigo-400 transition-all flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code Tag</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Intelligence Card */}
            {scannedItem && (
              <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl overflow-hidden shadow-2xl relative">
                
                {/* Header info bar */}
                <div className="bg-[#10131A] px-6 py-3 border-b border-[#2A3040]/60 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#8B92A5] font-bold uppercase tracking-wider">
                    DECIDED RECORD CARD
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span>Matched Signature</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Product top row details */}
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <div className="w-full sm:w-28 h-28 bg-[#10131A] rounded-xl border border-[#2A3040] overflow-hidden flex items-center justify-center shrink-0">
                      <img 
                        src={scannedItem.image || "https://images.unsplash.com/photo-1553413766-41f9d287af3c?w=200&auto=format&fit=crop"} 
                        alt={scannedItem.productName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-display font-bold text-[#EDEFF4]">{scannedItem.productName}</h4>
                          <span className="text-xs font-mono text-indigo-400 font-medium">SKU: {scannedItem.sku}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider ${
                          scannedItem.status === "Critical" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : scannedItem.status === "Low Stock"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {scannedItem.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-[#10131A] p-2 rounded-xl border border-[#2A3040] text-xs">
                          <span className="text-[9px] font-mono text-[#8B92A5] block">SHELF LOCATION</span>
                          <span className="font-mono text-[#EDEFF4] font-bold">{scannedItem.shelf}</span>
                        </div>
                        <div className="bg-[#10131A] p-2 rounded-xl border border-[#2A3040] text-xs">
                          <span className="text-[9px] font-mono text-[#8B92A5] block">STOCK QUANTITY</span>
                          <span className="font-mono text-emerald-400 font-bold">{scannedItem.quantity} Units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Ledger Specs */}
                  <div className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] text-xs font-mono space-y-2.5">
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Barcode Signature:</span>
                      <span className="text-[#EDEFF4] font-medium">{scannedItem.barcode}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Associated QR:</span>
                      <span className="text-[#EDEFF4] font-medium">{scannedItem.qrCode}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Active Facility:</span>
                      <span className="text-[#EDEFF4]">{scannedItem.warehouse}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Prime Vendor:</span>
                      <span className="text-[#EDEFF4]">{scannedItem.supplier}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Manufacturing Batch:</span>
                      <span className="text-[#EDEFF4]">{scannedItem.batchNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A3040]/30 pb-2">
                      <span className="text-[#8B92A5]">Expiry Date:</span>
                      <span className="text-[#EDEFF4]">{scannedItem.expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B92A5]">Last Ledger Check:</span>
                      <span className="text-emerald-400 font-bold">Just Now</span>
                    </div>
                  </div>

                  {/* Dynamic Update Ledger Form Toggle */}
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { setIsUpdateFormOpen(!isUpdateFormOpen); sound.playClick(); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-mono text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        UPDATE INVENTORY
                      </button>
                      <button
                        onClick={handleQuickTransferStock}
                        className="px-4 py-2 bg-[#10131A] hover:bg-[#2A3040] border border-[#2A3040] rounded-xl text-xs font-mono text-[#EDEFF4] transition-all flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        TRANSFER STOCK
                      </button>
                      <button
                        onClick={handleQuickMarkDamaged}
                        className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-xl text-xs font-mono text-red-400 transition-all flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        MARK DAMAGED
                      </button>
                    </div>

                    <AnimatePresence>
                      {isUpdateFormOpen && (
                        <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handlePersistInventoryUpdate}
                          className="bg-[#10131A] p-4 rounded-xl border border-[#2A3040] space-y-3.5 overflow-hidden text-xs"
                        >
                          <span className="text-[10px] font-mono text-[#8B92A5] block font-bold uppercase tracking-wider">
                            Correct Physical Asset Dimensions:
                          </span>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono text-[#8B92A5] block mb-1">ADJUST STOCK QUANTITY</label>
                              <div className="flex bg-[#1A1E29] border border-[#2A3040] rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => setEditQtyChange(prev => prev - 5)}
                                  className="px-2.5 hover:bg-[#2A3040] text-[#EDEFF4] text-xs font-bold"
                                >
                                  -5
                                </button>
                                <input
                                  type="text"
                                  value={editQtyChange >= 0 ? `+${editQtyChange}` : editQtyChange}
                                  readOnly
                                  className="w-full text-center bg-transparent border-0 text-xs font-mono text-[#EDEFF4]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditQtyChange(prev => prev + 5)}
                                  className="px-2.5 hover:bg-[#2A3040] text-[#EDEFF4] text-xs font-bold"
                                >
                                  +5
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#8B92A5] block mb-1">REARRANGE SHELF LOCATION</label>
                              <input
                                type="text"
                                placeholder={scannedItem.shelf}
                                value={editShelf}
                                onChange={(e) => setEditShelf(e.target.value)}
                                className="w-full bg-[#1A1E29] border border-[#2A3040] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#8B92A5] block mb-1">MOVE TO SECONDARY WAREHOUSE</label>
                            <input
                              type="text"
                              placeholder={scannedItem.warehouse}
                              value={editWarehouse}
                              onChange={(e) => setEditWarehouse(e.target.value)}
                              className="w-full bg-[#1A1E29] border border-[#2A3040] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#EDEFF4] focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-[#EDEFF4] text-xs font-mono font-bold rounded-lg transition-all"
                          >
                            COMMIT AND LEDGER UPDATE
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right AI Insights and Scan log console */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Insights Panel */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#2A3040]/60 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider">
                    Gemini Live Recommendation
                  </h3>
                </div>
                <span className="text-[9px] font-mono bg-[#10131A] border border-[#2A3040] text-emerald-400 px-2 py-0.5 rounded font-bold">
                  OMNI FLASH v1.5
                </span>
              </div>

              {isLoadingInsights ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                  <span className="text-[11px] font-mono text-[#8B92A5]">Generating Inventory recommendations...</span>
                </div>
              ) : aiInsights.length > 0 ? (
                <div className="space-y-3.5">
                  {aiInsights.map((insight, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
                        insight.impact === "critical" 
                          ? "bg-red-500/5 border-red-500/20 text-[#EDEFF4]" 
                          : insight.impact === "high"
                          ? "bg-amber-500/5 border-amber-500/20 text-[#EDEFF4]"
                          : "bg-[#10131A] border-[#2A3040] text-[#EDEFF4]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-400">{insight.title}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          insight.impact === "critical" 
                            ? "bg-red-500/10 text-red-400" 
                            : insight.impact === "high"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-[#2A3040] text-[#8B92A5]"
                        }`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-[#8B92A5] text-[11px] leading-relaxed">{insight.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs font-mono text-[#8B92A5] space-y-2">
                  <Package className="w-8 h-8 text-[#2A3040] mx-auto" />
                  <p>Scan any warehouse barcode to load dynamic real-time Gemini recommendations.</p>
                </div>
              )}
            </div>

            {/* Scan History Log Card */}
            <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#2A3040]/60 pb-3">
                <div className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold text-[#EDEFF4] uppercase tracking-wider">
                    Distributed Scan Registry
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-400">
                  {filteredHistory.length} ledger logs
                </span>
              </div>

              {/* History Filter Matrix */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div>
                  <label className="text-[#8B92A5] block mb-1 uppercase tracking-wider text-[8px]">ACTION</label>
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded px-1.5 py-1 text-[#EDEFF4] focus:outline-none"
                  >
                    <option value="ALL">All Actions</option>
                    <option value="SCANNED">Scanned</option>
                    <option value="INBOUND REC">Inbound</option>
                    <option value="OUTBOUND DISPATCH">Outbound</option>
                    <option value="MARK DAMAGED">Damaged</option>
                    <option value="TRANSFERRED">Transferred</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8B92A5] block mb-1 uppercase tracking-wider text-[8px]">WAREHOUSE</label>
                  <select
                    value={filterWarehouse}
                    onChange={(e) => setFilterWarehouse(e.target.value)}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded px-1.5 py-1 text-[#EDEFF4] focus:outline-none"
                  >
                    <option value="ALL">All Cells</option>
                    <option value="EAST">Warehouse East</option>
                    <option value="WEST">Warehouse West</option>
                    <option value="ZONE">Zone C</option>
                    <option value="BAY">Bay</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8B92A5] block mb-1 uppercase tracking-wider text-[8px]">STATUS</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded px-1.5 py-1 text-[#EDEFF4] focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="NOMINAL">Nominal</option>
                    <option value="LOW STOCK">Low Stock</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {/* Table Records Log */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px] font-mono text-[#EDEFF4]">
                  <thead>
                    <tr className="border-b border-[#2A3040]/40 text-[#8B92A5]">
                      <th className="py-2.5 font-bold">Time</th>
                      <th className="py-2.5 font-bold">Product</th>
                      <th className="py-2.5 font-bold text-center">Qty</th>
                      <th className="py-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((log, idx) => (
                      <tr key={idx} className="border-b border-[#2A3040]/20 hover:bg-[#10131A]/30 transition-all">
                        <td className="py-2.5 text-[#8B92A5]">{log.time}</td>
                        <td className="py-2.5 truncate max-w-[120px]" title={log.product}>{log.product}</td>
                        <td className="py-2.5 text-center font-bold text-emerald-400">{log.quantity}</td>
                        <td className="py-2.5 text-right font-medium">
                          <span className={`px-1.5 py-0.2 rounded ${
                            log.action === "Scanned" 
                              ? "bg-emerald-500/10 text-emerald-400" 
                              : log.action.includes("Inbound")
                              ? "bg-indigo-500/10 text-indigo-400"
                              : log.action.includes("Damaged")
                              ? "bg-red-500/10 text-red-400"
                              : "bg-[#2A3040] text-[#8B92A5]"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[#8B92A5]">
                          No ledger logs matches current filter configuration.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
