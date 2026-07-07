import { ProductItem, CustomerProfile, SupplierProfile, TimelineEvent, WorkflowRule } from "./types";

// Standard barcodes for barcode scanner simulations
export const enterpriseProducts: ProductItem[] = [
  {
    sku: "SKU-LAP-9020",
    name: "Apex Pro Laptop 15\"",
    category: "Computing Hardware",
    stockLevel: 12, // Low stock (reorder is 20)
    reorderPoint: 20,
    price: 1299.99,
    barcode: "8490203112",
    shelf: "A-04",
    rack: "R-12",
    bin: "B-22",
    supplier: "Silicon Dynamics Inc.",
    history: [
      { date: "2026-07-01", action: "Dispatched to Customer ABC", quantity: -2 },
      { date: "2026-06-25", action: "Inbound Delivery", quantity: 50 },
      { date: "2026-06-10", action: "Stock Audit Correction", quantity: 1 }
    ],
    predictions: [
      { date: "2026-08", demandForecast: 45 },
      { date: "2026-09", demandForecast: 52 },
      { date: "2026-10", demandForecast: 60 }
    ]
  },
  {
    sku: "SKU-SVR-4000",
    name: "STRATA Enterprise Server Node V4",
    category: "Data Center Infrastructure",
    stockLevel: 35,
    reorderPoint: 10,
    price: 4999.99,
    barcode: "7584102931",
    shelf: "B-01",
    rack: "R-02",
    bin: "B-03",
    supplier: "SuperMicro Logistics Corp",
    history: [
      { date: "2026-07-04", action: "Quality Validation", quantity: 0 },
      { date: "2026-06-28", action: "Inbound Delivery", quantity: 10 }
    ],
    predictions: [
      { date: "2026-08", demandForecast: 15 },
      { date: "2026-09", demandForecast: 18 },
      { date: "2026-10", demandForecast: 12 }
    ]
  },
  {
    sku: "SKU-IOT-2200",
    name: "Quantum IoT Sensor Controller",
    category: "Smart IoT Telemetry",
    stockLevel: 142,
    reorderPoint: 50,
    price: 189.50,
    barcode: "4920194821",
    shelf: "C-11",
    rack: "R-08",
    bin: "B-41",
    supplier: "Telematics Global",
    history: [
      { date: "2026-07-05", action: "Dispatched to Retail Store West", quantity: -20 },
      { date: "2026-07-02", action: "QA Certificate Issued", quantity: 100 }
    ],
    predictions: [
      { date: "2026-08", demandForecast: 110 },
      { date: "2026-09", demandForecast: 125 },
      { date: "2026-10", demandForecast: 140 }
    ]
  },
  {
    sku: "SKU-MON-8800",
    name: "UHD UltraWide Executive Display",
    category: "Computing Hardware",
    stockLevel: 8, // Low Stock
    reorderPoint: 15,
    price: 649.99,
    barcode: "9218491029",
    shelf: "A-02",
    rack: "R-04",
    bin: "B-10",
    supplier: "Silicon Dynamics Inc.",
    history: [
      { date: "2026-07-05", action: "Dispatched", quantity: -4 }
    ],
    predictions: [
      { date: "2026-08", demandForecast: 22 },
      { date: "2026-09", demandForecast: 24 }
    ]
  }
];

export const enterpriseCustomers: CustomerProfile[] = [
  {
    id: "CUST-8041",
    name: "AeroSpace Tech Systems",
    companyName: "AeroSpace Tech Systems LLC",
    customerType: "B2B",
    email: "procurement@aerospacetech.com",
    phone: "+1 (555) 019-2831",
    address: "4401 Kepler Way, Sector 7",
    country: "United States",
    creditLimit: 150000,
    status: "Active",
    salesRepAssigned: "Sarah Jenkins (Director of B2B Accounts)",
    registrationDate: "2024-03-12",
    lastPurchaseDate: "2026-07-02",
    clv: 184500,
    churnRiskScore: 12, // Very Low
    customerHealthScore: 96, // Excellent
    loyaltyPoints: 12500,
    membershipLevel: "Platinum",
    recommendedProducts: [
      {
        name: "STRATA Enterprise Server Node V4",
        confidence: 94,
        expectedRevenue: 14999.97,
        reason: "Calculated high-throughput data processing trends across standard divisions."
      },
      {
        name: "Apex Pro Laptop 15\"",
        confidence: 88,
        expectedRevenue: 6499.95,
        reason: "Previous hardware leasing lifecycle expiring next month."
      }
    ],
    purchaseHistory: [
      {
        invoiceNumber: "INV-2026-004",
        orderDate: "2026-07-02",
        productName: "STRATA Enterprise Server Node V4",
        sku: "SKU-SVR-4000",
        barcode: "7584102931",
        category: "Data Center Infrastructure",
        quantity: 3,
        sellingPrice: 4999.99,
        discount: 250.00,
        tax: 1199.99,
        totalAmount: 15949.96,
        paymentStatus: "Paid",
        deliveryStatus: "Shipped",
        warehouseShipped: "Warehouse East (HQ)",
        salesperson: "Sarah Jenkins"
      },
      {
        invoiceNumber: "INV-2026-001",
        orderDate: "2026-05-18",
        productName: "Apex Pro Laptop 15\"",
        sku: "SKU-LAP-9020",
        barcode: "8490203112",
        category: "Computing Hardware",
        quantity: 10,
        sellingPrice: 1299.99,
        discount: 500.00,
        tax: 999.99,
        totalAmount: 13499.89,
        paymentStatus: "Paid",
        deliveryStatus: "Delivered",
        warehouseShipped: "Warehouse East (HQ)",
        salesperson: "Sarah Jenkins"
      }
    ],
    communicationHistory: [
      {
        id: "COM-01",
        type: "Call",
        date: "2026-07-02T10:15:00Z",
        summary: "Q3 Account Alignment",
        details: "Discussed expansion of cloud computing physical server racks. Verified delivery coordinate accuracy."
      },
      {
        id: "COM-02",
        type: "Email",
        date: "2026-06-30T14:22:00Z",
        summary: "Inbound Quote Request",
        details: "Client requested B2B discounts on UHD display modules. Drafted quote for 15 monitors."
      }
    ]
  },
  {
    id: "CUST-9012",
    name: "NexaGlobal Logistics",
    companyName: "NexaGlobal Group Inc.",
    customerType: "B2B",
    email: "ops@nexaglobal.net",
    phone: "+1 (555) 441-2910",
    address: "900 Industrial Boulevard",
    country: "Canada",
    creditLimit: 75000,
    status: "Active",
    salesRepAssigned: "Marcus Vance",
    registrationDate: "2025-01-15",
    lastPurchaseDate: "2026-06-10",
    clv: 54200,
    churnRiskScore: 48, // Moderate Churn risk
    customerHealthScore: 74, // Amber
    loyaltyPoints: 4800,
    membershipLevel: "Gold",
    recommendedProducts: [
      {
        name: "Quantum IoT Sensor Controller",
        confidence: 97,
        expectedRevenue: 3790.00,
        reason: "High synergy with automated fleet scanning and real-time package geofencing modules."
      }
    ],
    purchaseHistory: [
      {
        invoiceNumber: "INV-2026-002",
        orderDate: "2026-06-10",
        productName: "Quantum IoT Sensor Controller",
        sku: "SKU-IOT-2200",
        barcode: "4920194821",
        category: "Smart IoT Telemetry",
        quantity: 20,
        sellingPrice: 189.50,
        discount: 0,
        tax: 303.20,
        totalAmount: 4093.20,
        paymentStatus: "Outstanding", // Delayed payment
        deliveryStatus: "Delivered",
        warehouseShipped: "Warehouse West",
        salesperson: "Marcus Vance"
      }
    ],
    communicationHistory: [
      {
        id: "COM-03",
        type: "Support Ticket",
        date: "2026-06-20T08:00:00Z",
        summary: "Latency on IoT calibration API",
        details: "NexaGlobal reported intermittent delay when calling geolocation end. Patch applied to physical sensor hub."
      }
    ]
  },
  {
    id: "CUST-1033",
    name: "Dr. Elena Rostov",
    companyName: "Individual Retailer B2C",
    customerType: "B2C",
    email: "elena.rostov@uni-research.org",
    phone: "+49 89 201928",
    address: "Ludwigstrasse 22, Munich",
    country: "Germany",
    creditLimit: 10000,
    status: "Active",
    salesRepAssigned: "Automated Core",
    registrationDate: "2025-08-01",
    lastPurchaseDate: "2026-07-04",
    clv: 3899,
    churnRiskScore: 5, // Extremely Safe
    customerHealthScore: 99, // Perfect
    loyaltyPoints: 1200,
    membershipLevel: "Silver",
    recommendedProducts: [
      {
        name: "UHD UltraWide Executive Display",
        confidence: 91,
        expectedRevenue: 649.99,
        reason: "Frequently viewed computing accessories and ergonomics checklists."
      }
    ],
    purchaseHistory: [
      {
        invoiceNumber: "INV-2026-005",
        orderDate: "2026-07-04",
        productName: "Apex Pro Laptop 15\"",
        sku: "SKU-LAP-9020",
        barcode: "8490203112",
        category: "Computing Hardware",
        quantity: 1,
        sellingPrice: 1299.99,
        discount: 0,
        tax: 246.99,
        totalAmount: 1546.98,
        paymentStatus: "Paid",
        deliveryStatus: "Delivered",
        warehouseShipped: "Warehouse West",
        salesperson: "Digital Terminal Checkout"
      }
    ],
    communicationHistory: [
      {
        id: "COM-04",
        type: "WhatsApp",
        date: "2026-07-04T12:00:00Z",
        summary: "Delivery confirmation check",
        details: "Assisted customer in mapping parcel tracker details through WhatsApp automation service."
      }
    ]
  }
];

export const enterpriseSuppliers: SupplierProfile[] = [
  {
    id: "SUP-101",
    name: "Silicon Dynamics Inc.",
    contactName: "Arthur Pendelton",
    email: "supplier@silicondynamics.com",
    phone: "+1 (800) 555-0912",
    country: "Taiwan",
    riskScore: 24, // low risk
    qualityRating: 4.8,
    leadTimeDays: 7,
    outstandingOrders: 2,
    performanceScore: 94,
    history: [
      { invoiceNumber: "INBOUND-9920", date: "2026-06-15", amount: 24500, status: "Settled" },
      { invoiceNumber: "INBOUND-9942", date: "2026-07-01", amount: 12900, status: "Pending Delivery" }
    ]
  },
  {
    id: "SUP-102",
    name: "SuperMicro Logistics Corp",
    contactName: "Jean-Pierre Laurent",
    email: "contact@supermicrologistics.eu",
    phone: "+33 1 422 901",
    country: "France",
    riskScore: 58, // moderate delay risk
    qualityRating: 4.2,
    leadTimeDays: 14,
    outstandingOrders: 1,
    performanceScore: 82,
    history: [
      { invoiceNumber: "INBOUND-8811", date: "2026-06-20", amount: 84000, status: "Settled" }
    ]
  }
];

export const recentTimelineEvents: TimelineEvent[] = [
  {
    id: "EVT-100",
    time: "09:00 AM",
    title: "ERP Inventory Normalization Ingestion",
    category: "INVENTORY",
    description: "Successfully processed bulk shipment invoice batch. Warehouse West racks reconciled.",
    iconName: "Package"
  },
  {
    id: "EVT-101",
    time: "09:15 AM",
    title: "AI Forecast Model Recalibrated",
    category: "AI_FORECAST",
    description: "Demand predictions for Computing Hardware bumped by +4.2% based on local regional indicators.",
    iconName: "Brain"
  },
  {
    id: "EVT-102",
    time: "10:20 AM",
    title: "Apex Laptop Reorder Triggered",
    category: "AUTOMATION",
    description: "No-code event: SKU-LAP-9020 fell below safety limit 20. Automated Purchase Order drafted.",
    iconName: "Zap"
  },
  {
    id: "EVT-103",
    time: "11:00 AM",
    title: "Warehouse East Barcode Sync Check",
    category: "SYSTEM",
    description: "Digital Twin 3D spatial alignment completed for Rack R-12. Accuracy rating at 99.8%.",
    iconName: "Maximize2"
  }
];

export const noCodeWorkflows: WorkflowRule[] = [
  {
    id: "RULE-01",
    name: "Low Stock Auto-Replenishment Trigger",
    triggerEvent: "If Inventory Stock level falls below reorder threshold",
    action: "Automatically create purchase order draft, notify procurement team via internal workspace",
    status: "Active"
  },
  {
    id: "RULE-02",
    name: "VIP Customer High Churn Risk Guard",
    triggerEvent: "If Customer buying frequency drops by >25% in 30 days",
    action: "Trigger priority outbound sales alert, assign dedicated customer success manager",
    status: "Active"
  },
  {
    id: "RULE-03",
    name: "Inbound Barcode Receipt Ingestion",
    triggerEvent: "When inventory item barcode is scanned on dock",
    action: "Increment stock levels, sync ERP ledgers, and rebuild Digital Twin rack coordinates",
    status: "Active"
  }
];
