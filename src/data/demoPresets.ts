import { ProductItem, TimelineEvent } from "../types";

export interface DemoPreset {
  id: "RETAIL" | "MANUFACTURING" | "WAREHOUSE" | "MARKETING" | "FINANCE";
  industry: string;
  businessName: string;
  currency: string;
  currencySymbol: string;
  delayDays?: number;
  stockAlertsCount?: number;
  revenue: string;
  revenueChange: string;
  grossProfit: string;
  grossProfitChange: string;
  operatingMargin: string;
  cashFlow: string;
  csat: string;
  healthScore: number;
  confidenceScore: number;
  riskIndex: string;
  supplierAlert: string;
  supplierAlertLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "OPPORTUNITY";
  lowStockSku: string;
  lowStockName: string;
  lowStockQty: number;
  lowStockReorder: number;
  products: ProductItem[];
  timeline: TimelineEvent[];
  journeySteps: {
    id: number;
    title: string;
    desc: string;
    status: "completed" | "active" | "pending";
    time: string;
  }[];
  healthMetrics: {
    category: string;
    score: number;
    status: "Excellent" | "Good" | "Stable" | "Attention";
    color: string;
  }[];
  smartNotifications: {
    id: string;
    type: "CRITICAL" | "HIGH" | "MEDIUM" | "OPPORTUNITY" | "INFO";
    title: string;
    desc: string;
    time: string;
  }[];
  qaAnswers: {
    [key: string]: {
      answer: string;
      followUps: string[];
    };
  };
  narrationText: string;
}

export const demoPresets: { [key: string]: DemoPreset } = {
  RETAIL: {
    id: "RETAIL",
    industry: "Retail & Warehousing",
    businessName: "Apex Retailers & Co",
    currency: "INR",
    currencySymbol: "₹",
    revenue: "₹2.4M",
    revenueChange: "+12.4%",
    grossProfit: "₹1.48M",
    grossProfitChange: "62% margin",
    operatingMargin: "32.1%",
    cashFlow: "₹920,000",
    csat: "4.8",
    healthScore: 92,
    confidenceScore: 96,
    riskIndex: "4%",
    supplierAlert: "🔴 Critical: Warehouse B running low on Pro Laptops. Reorder triggered.",
    supplierAlertLevel: "CRITICAL",
    lowStockSku: "SKU-LAP-9020",
    lowStockName: "Apex Pro Laptop 15\"",
    lowStockQty: 12,
    lowStockReorder: 20,
    journeySteps: [
      { id: 1, title: "Customer Places Order", desc: "Order ORD-2026-89A received via portal", status: "completed", time: "10:15 AM" },
      { id: 2, title: "Inventory Checked", desc: "Automated stock check: SKU-LAP-9020 is available", status: "completed", time: "10:16 AM" },
      { id: 3, title: "Barcode Scanned", desc: "Handheld scanner registers checkout at Bin A-04", status: "completed", time: "10:18 AM" },
      { id: 4, title: "Business Operations Created Invoice", desc: "Invoice INV-2026-004 ($15,949) ledgered", status: "completed", time: "10:19 AM" },
      { id: 5, title: "Shipment Dispatched", desc: "Assigned to AeroSpace Express courier", status: "active", time: "In Progress" },
      { id: 6, title: "Customer Receives Order", desc: "ETA is July 8th via smart logistics route", status: "pending", time: "Pending" },
      { id: 7, title: "AI Updates Intelligence Hub", desc: "Drift analysis and customer CLV updated", status: "pending", time: "Pending" },
      { id: 8, title: "Executive Report Generated", desc: "Q3 dashboard updated and exported safely", status: "pending", time: "Pending" }
    ],
    healthMetrics: [
      { category: "Revenue Optimization", score: 95, status: "Excellent", color: "bg-emerald-500" },
      { category: "Inventory Turn Rate", score: 86, status: "Good", color: "bg-indigo-500" },
      { category: "Financial Integrity", score: 94, status: "Excellent", color: "bg-emerald-500" },
      { category: "Customer Satisfaction", score: 96, status: "Excellent", color: "bg-emerald-500" },
      { category: "Smart Operations", score: 88, status: "Good", color: "bg-indigo-500" },
      { category: "AI Confidence Index", score: 96, status: "Excellent", color: "bg-indigo-500" }
    ],
    smartNotifications: [
      { id: "NT-1", type: "CRITICAL", title: "Supplier delayed", desc: "Silicon Dynamics Inc. delayed chipsets transit (+5 days lag)", time: "Just Now" },
      { id: "NT-2", type: "HIGH", title: "Inventory low", desc: "Apex Pro Laptop 15\" (12 remaining, reorder point 20)", time: "2 mins ago" },
      { id: "NT-3", type: "MEDIUM", title: "Invoice overdue", desc: "NexaGlobal group invoice outstanding for 15 days", time: "1 hour ago" },
      { id: "NT-4", type: "CRITICAL", title: "Customer churn risk", desc: "NexaGlobal Logistics health score dipped to 74%", time: "3 hours ago" },
      { id: "NT-5", type: "OPPORTUNITY", title: "Revenue milestone", desc: "Q3 retail target threshold ₹2.4M exceeded ahead of timeline", time: "1 day ago" },
      { id: "NT-6", type: "INFO", title: "Automation completed", desc: "Auto-reorder script dispatched 50 orders of Quantum IoT sensors", time: "2 days ago" }
    ],
    products: [
      { sku: "SKU-LAP-9020", name: "Apex Pro Laptop 15\"", category: "Computing Hardware", stockLevel: 12, reorderPoint: 20, price: 1299.99, barcode: "8490203112", shelf: "A-04", rack: "R-12", bin: "B-22", supplier: "Silicon Dynamics Inc.", history: [], predictions: [] },
      { sku: "SKU-SVR-4000", name: "STRATA Enterprise Server Node V4", category: "Data Center Infrastructure", stockLevel: 35, reorderPoint: 10, price: 4999.99, barcode: "7584102931", shelf: "B-01", rack: "R-02", bin: "B-03", supplier: "SuperMicro Logistics Corp", history: [], predictions: [] },
      { sku: "SKU-IOT-2200", name: "Quantum IoT Sensor Controller", category: "Smart IoT Telemetry", stockLevel: 142, reorderPoint: 50, price: 189.50, barcode: "4920194821", shelf: "C-11", rack: "R-08", bin: "B-41", supplier: "Telematics Global", history: [], predictions: [] }
    ],
    timeline: [
      { id: "EV-01", time: "10:15", title: "Retail Check ORD-901", category: "SALES", description: "Purchased 2x Apex Pro Laptops", iconName: "Package" },
      { id: "EV-02", time: "09:40", title: "Supplier Delay Alert", category: "SYSTEM", description: "Silicon Dynamics Inc. transit lag growing to +5 days", iconName: "Brain" }
    ],
    qaAnswers: {
      "Why did revenue decrease?": {
        answer: "Our analytics engine registers a temporary **3.2% drop** in direct retail turnover last week. This was directly due to the **Silicon Dynamics shipment delay**, creating a low safety stock state on laptops. Inbound customer demand remains exceptionally high, and recovering this ledger gap is expected within 3 days.",
        followUps: ["How to mitigate supplier delays?", "Which supplier has faster transit times?"]
      },
      "Which warehouse has the highest stock?": {
        answer: "**Warehouse West (HQ)** holds the highest stock volume with **14,200 active units** (68% capacity utilization). Warehouse East holds 4,500 units and has experienced inventory depletion for high-ticket SKUs.",
        followUps: ["Initiate stock transfer from West to East?", "Show Warehouse East capacity limits."]
      },
      "Who are my top customers?": {
        answer: "Your top customers are:\n1. **AeroSpace Tech Systems** (Platinum, Lifetime Value: $184,500)\n2. **NexaGlobal Logistics** (Gold, Lifetime Value: $54,200)\nBoth accounts exhibit zero payment friction and stable chronological buying cycles.",
        followUps: ["Run loyalty campaign", "Review AeroSpace Tech pending approvals"]
      },
      "What should I reorder?": {
        answer: "**CRITICAL RECOMMENDATION**:\n- **Apex Pro Laptop 15\"** is at **12 units** (reorder boundary is 20). Recommend reordering **50 units** immediately to avoid B2B contract fulfillment failures.",
        followUps: ["Automate this reorder via script", "Show supplier contract list"]
      },
      "Predict next month's sales.": {
        answer: "Intelligence Hub forecasts Q3 Retail sales to peak at **₹2.8M** (a **15.4% expansion**), driven heavily by corporate hardware upgrades. Model confidence score stands at **96%** based on regression variables.",
        followUps: ["Export forecast as PDF", "Check sector demand trends"]
      },
      "Generate an executive report.": {
        answer: "### Executive Operations Briefing — Apex Retailers & Co\n- **Unified Health**: 92 / 100 (Excellent)\n- **Net Revenue**: ₹2.4M (↑ 12.4% MoM)\n- **SLA Fulfillment**: 99.2% nominal rate\n- **Inventory Status**: Stable; 1 Low Stock alert active.\n\nReport fully reconciled inside Intelligence Hub.",
        followUps: ["Download Board PPT slides", "Send report to Board of Directors"]
      }
    },
    narrationText: "STRATA system live status report for Apex Retailers. Your business health score is 92 out of 100, which is excellent. Net revenue stands at 2.4 million rupees, showing strong twelve percent growth driven by high-ticket B2B sales. We have flagged one critical alert: Supplier transit delays from Silicon Dynamics have pushed laptop safety stock down to 12 units. Intelligent reorder automation has been initialized."
  },
  MANUFACTURING: {
    id: "MANUFACTURING",
    industry: "Manufacturing",
    businessName: "Titan Heavy Industries",
    currency: "USD",
    currencySymbol: "$",
    revenue: "$4.8M",
    revenueChange: "+8.2%",
    grossProfit: "$2.64M",
    grossProfitChange: "55% margin",
    operatingMargin: "28.5%",
    cashFlow: "$1.45M",
    csat: "4.6",
    healthScore: 88,
    confidenceScore: 92,
    riskIndex: "12%",
    supplierAlert: "🟠 High: Zone C Assembly motor thermal drift is +18°C. Maintenance required.",
    supplierAlertLevel: "HIGH",
    lowStockSku: "SKU-GEAR-8830",
    lowStockName: "Carbon Steel Rotational Gear v2",
    lowStockQty: 4,
    lowStockReorder: 15,
    journeySteps: [
      { id: 1, title: "Customer Places Order", desc: "B2B parts bulk requisition issued by Ford Motors", status: "completed", time: "08:10 AM" },
      { id: 2, title: "Inventory Checked", desc: "Mating gears checked. Stock level critical (4 remaining)", status: "completed", time: "08:12 AM" },
      { id: 3, title: "Barcode Scanned", desc: "Milling machine QR code scanned for production scheduling", status: "completed", time: "08:15 AM" },
      { id: 4, title: "Business Operations Created Invoice", desc: "Work-in-progress ledger accounts posted to SAP", status: "completed", time: "08:20 AM" },
      { id: 5, title: "Shipment Dispatched", desc: "Direct flatbed transport allocated", status: "active", time: "Assembly" },
      { id: 6, title: "Customer Receives Order", desc: "Fulfillment target scheduled within 48 hours", status: "pending", time: "Pending" },
      { id: 7, title: "AI Updates Intelligence Hub", desc: "Predictive failure metrics and tooling wear logs synchronized", status: "pending", time: "Pending" },
      { id: 8, title: "Executive Report Generated", desc: "BOM (Bill of Materials) yields uploaded", status: "pending", time: "Pending" }
    ],
    healthMetrics: [
      { category: "Revenue Optimization", score: 90, status: "Excellent", color: "bg-emerald-500" },
      { category: "Inventory Turn Rate", score: 72, status: "Stable", color: "bg-amber-500" },
      { category: "Financial Integrity", score: 89, status: "Good", color: "bg-indigo-500" },
      { category: "Customer Satisfaction", score: 92, status: "Excellent", color: "bg-emerald-500" },
      { category: "Smart Operations", score: 95, status: "Excellent", color: "bg-emerald-500" },
      { category: "AI Confidence Index", score: 92, status: "Excellent", color: "bg-indigo-500" }
    ],
    smartNotifications: [
      { id: "MN-1", type: "CRITICAL", title: "Supplier delayed", desc: "Steel casting forge delayed casting blocks deliverable (+7 days)", time: "Just Now" },
      { id: "MN-2", type: "HIGH", title: "Inventory low", desc: "Carbon Steel Rotational Gear v2 (4 remaining, reorder point 15)", time: "10 mins ago" },
      { id: "MN-3", type: "MEDIUM", title: "Invoice overdue", desc: "HeavyTech Requisitions payment late by 10 business days", time: "3 hours ago" },
      { id: "MN-4", type: "CRITICAL", title: "Customer churn risk", desc: "Global Auto Parts index showing moderate order size drift", time: "5 hours ago" },
      { id: "MN-5", type: "OPPORTUNITY", title: "Revenue milestone", desc: "Exceeded Q3 defense contract delivery margins by 2.4%", time: "1 day ago" },
      { id: "MN-6", type: "INFO", title: "Automation completed", desc: "Milling arm thermal sensor reset protocol successfully executed", time: "3 days ago" }
    ],
    products: [
      { sku: "SKU-GEAR-8830", name: "Carbon Steel Rotational Gear v2", category: "Heavy Machine Parts", stockLevel: 4, reorderPoint: 15, price: 450.00, barcode: "1190204910", shelf: "M-02", rack: "R-05", bin: "B-12", supplier: "Midwest Casting Ltd.", history: [], predictions: [] },
      { sku: "SKU-HYD-5020", name: "Industrial Hydraulic Fluid Piston", category: "Fluid Mechanics Assemblies", stockLevel: 42, reorderPoint: 20, price: 1120.00, barcode: "9940182931", shelf: "F-04", rack: "R-02", bin: "B-01", supplier: "Piston Dynamics Corp", history: [], predictions: [] }
    ],
    timeline: [
      { id: "EV-M1", time: "08:10", title: "B2B parts Requisition", category: "SALES", description: "Ford Requisition order block $88k", iconName: "Package" },
      { id: "EV-M2", time: "07:30", title: "Sensor Alert Logs", category: "SYSTEM", description: "Milling Machine 4 thermal drift alert", iconName: "Brain" }
    ],
    qaAnswers: {
      "Why did revenue decrease?": {
        answer: "Net margins contracted slightly due to **unplanned maintenance** on Zone C sorting lines, capping production yield. Raw steel material costs have also inflated by **4.2%**, but energy-efficiency rules successfully cushioned net EBITDA limits.",
        followUps: ["Show Zone C sorting logs", "Review steel procurement rates"]
      },
      "Which warehouse has the highest stock?": {
        answer: "**South Chicago Warehouse** holds **82% of structural raw stock**, consisting mostly of cast-iron brackets and raw hydraulic fluid cylinders. Detroit staging holds finished sub-assemblies.",
        followUps: ["Review Chicago capacity limits", "Check Detroit dispatch status"]
      },
      "Who are my top customers?": {
        answer: "Your top manufacturer accounts are:\n1. **Ford Powertrain Division** ($2.4M CLV)\n2. **Stellantis Assembly Corp** ($1.2M CLV)\nBoth are on stable Q3 schedule blocks.",
        followUps: ["Review Stellantis SLA metrics", "Create custom pricing draft"]
      },
      "What should I reorder?": {
        answer: "**Carbon Steel Rotational Gear v2** is critical (4 units left against 15 safety limit). Midwest Casting Ltd has a 7-day transit delay; we suggest re-routing to **Detroit Forge Inc** immediately.",
        followUps: ["Simulate Detroit Forge re-routing", "Order 30 units of gears"]
      },
      "Predict next month's sales.": {
        answer: "AI model predicts manufacturing billing of **$5.12M** next month, indicating strong industrial tooling cycles. **Confidence: 92%**.",
        followUps: ["Export demand forecast", "Check factory load indices"]
      },
      "Generate an executive report.": {
        answer: "### Manufacturing Briefing — Titan Heavy Industries\n- **Health**: 88 / 100 (Stable)\n- **Revenue**: $4.8M (↑ 8.2%)\n- **Factory OEE**: 94.8%\n- **Tooling Anomaly**: 1 Active drift warning in Milling Machine 4.",
        followUps: ["Download Executive PDF", "Email supervisor dispatch log"]
      }
    },
    narrationText: "Live operating telemetry for Titan Heavy Industries. Overall health index is eighty-eight out of one hundred. Net monthly manufacturing revenues are healthy at four point eight million dollars. Our cognitive core has identified one active thermal drift anomaly on sorting machine four, and steel castings inventories are currently low. Alternate dispatch paths are ready to execute."
  },
  WAREHOUSE: {
    id: "WAREHOUSE",
    industry: "Logistics",
    businessName: "Vanguard Global Hub B",
    currency: "USD",
    currencySymbol: "$",
    revenue: "$1.8M",
    revenueChange: "+15.6%",
    grossProfit: "$1.12M",
    grossProfitChange: "62% margin",
    operatingMargin: "34.5%",
    cashFlow: "$680,000",
    csat: "4.9",
    healthScore: 95,
    confidenceScore: 98,
    riskIndex: "2%",
    supplierAlert: "🟢 Opportunity: Optimized route completed for flight carrier LH-901.",
    supplierAlertLevel: "OPPORTUNITY",
    lowStockSku: "SKU-PLT-3030",
    lowStockName: "Standard Industrial Storage Pallet",
    lowStockQty: 8,
    lowStockReorder: 30,
    journeySteps: [
      { id: 1, title: "Customer Places Order", desc: "Warehouse space booking received for 200 pallets", status: "completed", time: "11:00 AM" },
      { id: 2, title: "Inventory Checked", desc: "Staging floor space checked. 120 slots open", status: "completed", time: "11:02 AM" },
      { id: 3, title: "Barcode Scanned", desc: "Incoming cargo containers barcode registered", status: "completed", time: "11:05 AM" },
      { id: 4, title: "Business Operations Created Invoice", desc: "Port landing taxes reconciled automatically", status: "completed", time: "11:10 AM" },
      { id: 5, title: "Shipment Dispatched", desc: "Tugboat and flatbed trailers dispatched", status: "active", time: "Transit" },
      { id: 6, title: "Customer Receives Order", desc: "Cargo safely containerized and signed by gate control", status: "pending", time: "Pending" },
      { id: 7, title: "AI Updates Intelligence Hub", desc: "Fuel surcharge metrics and shipping transit lag indexes refreshed", status: "pending", time: "Pending" },
      { id: 8, title: "Executive Report Generated", desc: "Vanguard warehouse storage map synced with active twin", status: "pending", time: "Pending" }
    ],
    healthMetrics: [
      { category: "Revenue Optimization", score: 94, status: "Excellent", color: "bg-emerald-500" },
      { category: "Inventory Turn Rate", score: 96, status: "Excellent", color: "bg-emerald-500" },
      { category: "Financial Integrity", score: 92, status: "Excellent", color: "bg-emerald-500" },
      { category: "Customer Satisfaction", score: 98, status: "Excellent", color: "bg-emerald-500" },
      { category: "Smart Operations", score: 97, status: "Excellent", color: "bg-emerald-500" },
      { category: "AI Confidence Index", score: 98, status: "Excellent", color: "bg-emerald-500" }
    ],
    smartNotifications: [
      { id: "WN-1", type: "INFO", title: "Supplier delayed", desc: "No global ocean carrier delays. Staging lines cleared", time: "Just Now" },
      { id: "WN-2", type: "HIGH", title: "Inventory low", desc: "Standard Industrial Storage Pallet (8 left, reorder limit 30)", time: "15 mins ago" },
      { id: "WN-3", type: "INFO", title: "Invoice overdue", desc: "Reconciled all accounts receivable bills for global sea lines", time: "4 hours ago" },
      { id: "WN-4", type: "INFO", title: "Customer churn risk", desc: "Account health score of 98% represents robust zero risk level", time: "8 hours ago" },
      { id: "WN-5", type: "OPPORTUNITY", title: "Revenue milestone", desc: "Completed 500th cargo container clearance milestone this week", time: "1 day ago" },
      { id: "WN-6", type: "INFO", title: "Automation completed", desc: "Automated route optimization triggered for vessel vessel-B", time: "2 days ago" }
    ],
    products: [
      { sku: "SKU-PLT-3030", name: "Standard Industrial Storage Pallet", category: "Warehouse Consumables", stockLevel: 8, reorderPoint: 30, price: 45.00, barcode: "7749102941", shelf: "P-01", rack: "R-09", bin: "B-20", supplier: "Global Lumber Products", history: [], predictions: [] }
    ],
    timeline: [
      { id: "EV-W1", time: "11:00", title: "Space Booking ORD-77", category: "SALES", description: "Booked 200 pallets storage", iconName: "Package" },
      { id: "EV-W2", time: "10:30", title: "GPS Route Complete", category: "SYSTEM", description: "Vessel container optimization route locked", iconName: "Brain" }
    ],
    qaAnswers: {
      "Why did revenue decrease?": {
        answer: "Logistics revenue **did not decrease**; it increased by **15.6%** over last month due to the clearance of high-throughput cargo vessel backlog at Dock Gate 4. Transport fuel surcharges remained completely stable.",
        followUps: ["Show Dock Gate 4 throughput logs", "Show vessel loading schedules"]
      },
      "Which warehouse has the highest stock?": {
        answer: "**Global Hub B (HQ)** holds the highest stock density at **94.5% storage layout utilization**, housing 240 metric tons of commercial electronics.",
        followUps: ["Trigger automatic inventory redistribution", "Show layout map details"]
      },
      "Who are my top customers?": {
        answer: "Your top logistics clients are:\n1. **DHL Ocean Freight Alliance** ($1.8M CLV)\n2. **Maersk Cargo Line Group** ($950,000 CLV)\nBoth display outstanding performance metrics.",
        followUps: ["Review Maersk SLA compliance", "View active cargo loads"]
      },
      "What should I reorder?": {
        answer: "**Standard Industrial Storage Pallet** is low (8 units remaining, reorder boundary 30). Recommend reordering **100 units** from Global Lumber Products immediately.",
        followUps: ["Reorder from alternate supplier", "Show pallet storage locations"]
      },
      "Predict next month's sales.": {
        answer: "Our regression model forecasts cargo booking billings to reach **$2.1M** next month due to pre-holiday supply shipments. **Confidence level: 98%**.",
        followUps: ["Export forecast as PowerPoint", "Check holiday seasonal trends"]
      },
      "Generate an executive report.": {
        answer: "### Logistics Executive Summary — Vanguard Global Hub B\n- **Health**: 95 / 100 (Excellent)\n- **Cargo Volume**: 14,200 metric tons\n- **Fulfillment**: 99.8% on-time dispatch rate\n- **Space capacity**: 94.5% utilized.",
        followUps: ["Download Board PDF briefing", "Share report with port authority"]
      }
    },
    narrationText: "Autonomous status brief for Vanguard Global Hub B. Operations are highly optimal with an outstanding health index of ninety-five out of one hundred. Monthly billing is one point eight million dollars. Staging floors are ninety-four percent filled, and sea lanes have zero cargo delay flags. We suggest maintaining current automated container scheduling parameters."
  },
  MARKETING: {
    id: "MARKETING",
    industry: "Marketing & CRM",
    businessName: "Nexa Creative Studio",
    currency: "USD",
    currencySymbol: "$",
    revenue: "$3.1M",
    revenueChange: "+9.4%",
    grossProfit: "$2.17M",
    grossProfitChange: "70% margin",
    operatingMargin: "45.2%",
    cashFlow: "$890,000",
    csat: "4.7",
    healthScore: 91,
    confidenceScore: 94,
    riskIndex: "5%",
    supplierAlert: "🟡 Medium: Facebook Ad API token expiring in 2 days. Sync required.",
    supplierAlertLevel: "MEDIUM",
    lowStockSku: "SKU-CMP-8080",
    lowStockName: "Dynamic Digital Campaign Ad slots",
    lowStockQty: 5,
    lowStockReorder: 15,
    journeySteps: [
      { id: 1, title: "Customer Places Order", desc: "Requisition for full SEO branding campaign", status: "completed", time: "09:30 AM" },
      { id: 2, title: "Inventory Checked", desc: "Available ad-inventory verified across core channels", status: "completed", time: "09:35 AM" },
      { id: 3, title: "Barcode Scanned", desc: "Dynamic pixel tracking codes generated & cataloged", status: "completed", time: "09:40 AM" },
      { id: 4, title: "Business Operations Created Invoice", desc: "Automatic advertising billing schedule set up", status: "completed", time: "09:45 AM" },
      { id: 5, title: "Shipment Dispatched", desc: "SEO Campaign launched live to target audiances", status: "active", time: "Live Campaign" },
      { id: 6, title: "Customer Receives Order", desc: "Conversion and click traffic actively tracking", status: "pending", time: "Pending" },
      { id: 7, title: "AI Updates Intelligence Hub", desc: "Cost Per Acquisition and Brand Reach databases refreshed", status: "pending", time: "Pending" },
      { id: 8, title: "Executive Report Generated", desc: "Conversion ROAS (Return on Ad Spend) models created", status: "pending", time: "Pending" }
    ],
    healthMetrics: [
      { category: "Revenue Optimization", score: 92, status: "Excellent", color: "bg-emerald-500" },
      { category: "Inventory Turn Rate", score: 85, status: "Good", color: "bg-indigo-500" },
      { category: "Financial Integrity", score: 91, status: "Excellent", color: "bg-emerald-500" },
      { category: "Customer Satisfaction", score: 94, status: "Excellent", color: "bg-emerald-500" },
      { category: "Smart Operations", score: 90, status: "Excellent", color: "bg-emerald-500" },
      { category: "AI Confidence Index", score: 94, status: "Excellent", color: "bg-indigo-500" }
    ],
    smartNotifications: [
      { id: "MN-1", type: "CRITICAL", title: "Supplier delayed", desc: "Ad Creative assets delivery from design agency delayed (+2 days)", time: "Just Now" },
      { id: "MN-2", type: "HIGH", title: "Inventory low", desc: "Dynamic Campaign Ad slots (5 left, reorder safety threshold 15)", time: "10 mins ago" },
      { id: "MN-3", type: "MEDIUM", title: "Invoice overdue", desc: "Client Apex Retailers invoice overdue by 5 business days", time: "2 hours ago" },
      { id: "MN-4", type: "HIGH", title: "Customer churn risk", desc: "Brand loyalty metrics showing minor click volume decay on client A", time: "6 hours ago" },
      { id: "MN-5", type: "OPPORTUNITY", title: "Revenue milestone", desc: "Ad Campaign ROI target of 4.5 ROAS reached on premium accounts", time: "1 day ago" },
      { id: "MN-6", type: "INFO", title: "Automation completed", desc: "Facebook and Google Ads API integrations refreshed", time: "3 days ago" }
    ],
    products: [
      { sku: "SKU-CMP-8080", name: "Dynamic Digital Campaign Ad slots", category: "Advertising inventory", stockLevel: 5, reorderPoint: 15, price: 1500.00, barcode: "9910293810", shelf: "D-01", rack: "R-02", bin: "B-03", supplier: "Nexa Creative Studio", history: [], predictions: [] }
    ],
    timeline: [
      { id: "EV-MK1", time: "09:30", title: "Requisition SEO Campaign", category: "SALES", description: "Branding launch contract approved $12k", iconName: "Package" },
      { id: "EV-MK2", time: "08:45", title: "Conversion Sweep Complete", category: "SYSTEM", description: "ROI metrics fully compiled in CRM ledger", iconName: "Brain" }
    ],
    qaAnswers: {
      "Why did revenue decrease?": {
        answer: "Marketing studio revenues **grew by 9.4% MoM**. Slight cost of client acquisition inflation did occur on Instagram ad blocks, but search organic campaigns mitigated this perfectly to maintain high profit lines.",
        followUps: ["Review Instagram acquisition costs", "Show organic campaign keywords"]
      },
      "Which warehouse has the highest stock?": {
        answer: "As a marketing and software enterprise, our **Staging Cloud server clusters** are our warehouses, with our **Dynamic Ad slots** currently running at 82% utilization.",
        followUps: ["Show active cloud clusters", "Check ad slot availability"]
      },
      "Who are my top customers?": {
        answer: "Your top brand accounts are:\n1. **Red Bull Event Team** ($1.2M CLV)\n2. **Uber Tech Marketing** ($940,000 CLV)\nBoth exhibit maximum engagement levels.",
        followUps: ["Review Uber campaigns ROAS", "Draft Red Bull Q4 proposals"]
      },
      "What should I reorder?": {
        answer: "**Dynamic Digital Campaign Ad slots** are low (5 left against 15 safety threshold). We suggest booking an additional block of **50 campaign inventory slots** immediately.",
        followUps: ["Purchase additional Google ad slots", "Review campaign performance"]
      },
      "Predict next month's sales.": {
        answer: "AI predicts advertising bookings to peak at **$3.4M** next month, indicating robust seasonal holiday brand campaigns. **Confidence: 94%**.",
        followUps: ["Export forecast details", "Review seasonal industry demands"]
      },
      "Generate an executive report.": {
        answer: "### Marketing Campaign Summary — Nexa Creative Studio\n- **Unified Health**: 91 / 100 (Excellent)\n- **ROAS average**: 4.2x (highly profitable)\n- **Active campaigns**: 42 live projects\n- **API status**: Nominal; Facebook sync is secure.",
        followUps: ["Download Board PPT slides", "Share metrics with client Uber"]
      }
    },
    narrationText: "Operational brief for Nexa Creative Studio. Overall brand health is ninety-one out of one hundred, driven by an outstanding four point two times average return on ad spend. Monthly creative revenue is three point one million dollars. Facebook and Google API channels are fully sync-locked, and our neural engine predicts a twelve percent traffic surge next month. Creative autopilot is active."
  },
  FINANCE: {
    id: "FINANCE",
    industry: "Finance & Hedge",
    businessName: "Aegis Capital & Ledgers",
    currency: "USD",
    currencySymbol: "$",
    revenue: "$8.2M",
    revenueChange: "+14.2%",
    grossProfit: "$6.15M",
    grossProfitChange: "75% margin",
    operatingMargin: "58.1%",
    cashFlow: "$3.82M",
    csat: "4.8",
    healthScore: 97,
    confidenceScore: 99,
    riskIndex: "1%",
    supplierAlert: "🟢 Opportunity: Liquidity levels exceptional. Arbitrage bots ready.",
    supplierAlertLevel: "OPPORTUNITY",
    lowStockSku: "SKU-HFT-9900",
    lowStockName: "High Frequency Algorithmic Router Node",
    lowStockQty: 2,
    lowStockReorder: 10,
    journeySteps: [
      { id: 1, title: "Customer Places Order", desc: "Corporate hedge account opened ($5M asset base)", status: "completed", time: "09:00 AM" },
      { id: 2, title: "Inventory Checked", desc: "Vault cash reserves checked: $25M liquidity available", status: "completed", time: "09:02 AM" },
      { id: 3, title: "Barcode Scanned", desc: "Hardware security token and Ledger keys registered", status: "completed", time: "09:05 AM" },
      { id: 4, title: "Business Operations Created Invoice", desc: "Automatic brokerage invoice fully ledgered", status: "completed", time: "09:10 AM" },
      { id: 5, title: "Shipment Dispatched", desc: "Asset allocations and high frequency index activated", status: "active", time: "Active Allocation" },
      { id: 6, title: "Customer Receives Order", desc: "Interest yields and portfolio returns actively tracing", status: "pending", time: "Pending" },
      { id: 7, title: "AI Updates Intelligence Hub", desc: "Arbitrage drift risk models and market volatility updated", status: "pending", time: "Pending" },
      { id: 8, title: "Executive Report Generated", desc: "Asset ledger statement finalized & signed with zero error", status: "pending", time: "Pending" }
    ],
    healthMetrics: [
      { category: "Revenue Optimization", score: 98, status: "Excellent", color: "bg-emerald-500" },
      { category: "Inventory Turn Rate", score: 90, status: "Excellent", color: "bg-indigo-500" },
      { category: "Financial Integrity", score: 99, status: "Excellent", color: "bg-emerald-500" },
      { category: "Customer Satisfaction", score: 96, status: "Excellent", color: "bg-emerald-500" },
      { category: "Smart Operations", score: 95, status: "Excellent", color: "bg-emerald-500" },
      { category: "AI Confidence Index", score: 99, status: "Excellent", color: "bg-indigo-500" }
    ],
    smartNotifications: [
      { id: "FN-1", type: "INFO", title: "Supplier delayed", desc: "Hardware ledger vendor ship delayed by 1 business day", time: "Just Now" },
      { id: "FN-2", type: "HIGH", title: "Inventory low", desc: "HFT Router Node (2 left, safety threshold 10)", time: "20 mins ago" },
      { id: "FN-3", type: "INFO", title: "Invoice overdue", desc: "Brokerage invoice payment secured. Margin bounds safe", time: "3 hours ago" },
      { id: "FN-4", type: "INFO", title: "Customer churn risk", desc: "Top B2B hedge client churn probability at absolute zero percent", time: "5 hours ago" },
      { id: "FN-5", type: "OPPORTUNITY", title: "Revenue milestone", desc: "Secured maximum portfolio return target of $8.2M for this month", time: "1 day ago" },
      { id: "FN-6", type: "INFO", title: "Automation completed", desc: "Dynamic risk hedging algorithms executed automatically", time: "2 days ago" }
    ],
    products: [
      { sku: "SKU-HFT-9900", name: "High Frequency Algorithmic Router Node", category: "Financial Hardware", stockLevel: 2, reorderPoint: 10, price: 9500.00, barcode: "9910283019", shelf: "F-01", rack: "R-02", bin: "B-10", supplier: "Aegis Capital", history: [], predictions: [] }
    ],
    timeline: [
      { id: "EV-FN1", time: "09:00", title: "Account Initialized", category: "SALES", description: "Deposited $5M asset base into hedge portfolio", iconName: "Package" },
      { id: "EV-FN2", time: "08:15", title: "Algorithmic Sweep", category: "SYSTEM", description: "Arbitrage yield model calculated", iconName: "Brain" }
    ],
    qaAnswers: {
      "Why did revenue decrease?": {
        answer: "Aegis revenues **did not decrease**. Portfolio returns expanded by **14.2%** due to dynamic arbitrage hedging algorithms. Risk indexes remain at a low 1%.",
        followUps: ["Review arbitrage performance", "Check general ledger balances"]
      },
      "Which warehouse has the highest stock?": {
        answer: "Our **Swiss Vault Facility** holds our physical gold reserve holdings, while our high-frequency router nodes are staged inside our **Silicon Valley Data Center**.",
        followUps: ["Review gold reserve values", "Check data center latency metrics"]
      },
      "Who are my top customers?": {
        answer: "Your top institutional hedge clients are:\n1. **Vanguard Asset Trust** ($4.5M cash base)\n2. **BlackRock Custom Ledger** ($2.8M cash base)\nBoth have active automatic yield allocations.",
        followUps: ["Review BlackRock interest margins", "Draft Vanguard Q4 reports"]
      },
      "What should I reorder?": {
        answer: "**High Frequency Algorithmic Router Node** is low (2 left against 10 safety threshold). Recommend order of **10 nodes** immediately to preserve trading speed.",
        followUps: ["Purchase router nodes from vendor", "Run latency diagnostic scan"]
      },
      "Predict next month's sales.": {
        answer: "Hedge yields projected to grow to **$8.9M** next month, driven by interest rate movements. **Model confidence is 99%**.",
        followUps: ["Export financial model as Excel", "Check Federal Reserve announcements"]
      },
      "Generate an executive report.": {
        answer: "### Financial Executive Briefing — Aegis Capital & Ledgers\n- **Unified Health**: 97 / 100 (Excellent)\n- **Net Asset Yield**: $8.2M (↑ 14.2% MoM)\n- **Compliance rate**: 100% (Securities audit passed)\n- **Risk Coefficient**: 1% (Highly optimized).",
        followUps: ["Download Board PPT slides", "Share yield ledger with board"]
      }
    },
    narrationText: "Financial operational brief for Aegis Capital and Ledgers. Ledger integrity is exceptionally high with an outstanding health score of ninety-seven out of one hundred, and a net monthly portfolio yield of eight point two million dollars. Risk coefficients are limited to one percent. All algorithmic hedging scripts are executing on track, and general cash flow liquid reserves are extremely healthy."
  }
};
