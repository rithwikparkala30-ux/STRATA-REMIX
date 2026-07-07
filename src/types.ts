/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DashboardMode = "EXECUTIVE" | "OPERATIONS" | "ANALYST";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  jobTitle: string;
  department: string;
  employeeId: string;
  avatarUrl?: string;
  language: string;
  timezone: string;
  theme: "dark" | "night-ops";
  accentColor: string;
}

export interface BusinessProfile {
  businessName: string;
  businessLogo?: string;
  industry: string;
  companySize: string;
  country: string;
  currency: string;
  timezone: string;
  goals: string[];
  subscriptionType: "Enterprise OS Trial" | "SaaS Unlimited" | "Mission Control Premium";
  workspaceId: string;
}

export interface OnboardingState {
  step: number;
  welcomeChecked: boolean;
  businessDetails: {
    name: string;
    industry: string;
    companySize: string;
    currency: string;
    country: string;
  };
  enabledModules: {
    inventory: boolean;
    erp: boolean;
    analytics: boolean;
    ai: boolean;
    automation: boolean;
    barcode: boolean;
    digitalTwin: boolean;
  };
  uploadedDataSample?: any;
  completed: boolean;
}

export interface ProductItem {
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  price: number;
  barcode: string;
  shelf: string;
  rack: string;
  bin: string;
  supplier: string;
  history: { date: string; action: string; quantity: number }[];
  predictions: { date: string; demandForecast: number }[];
}

export interface CustomerHistoryItem {
  invoiceNumber: string;
  orderDate: string;
  productName: string;
  sku: string;
  barcode: string;
  category: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentStatus: "Paid" | "Outstanding" | "Overdue";
  deliveryStatus: "Delivered" | "Shipped" | "Processing" | "Returned";
  warehouseShipped: string;
  salesperson: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  companyName: string;
  customerType: "B2B" | "B2C";
  email: string;
  phone: string;
  address: string;
  country: string;
  creditLimit: number;
  status: "Active" | "Inactive";
  salesRepAssigned: string;
  registrationDate: string;
  lastPurchaseDate: string;
  purchaseHistory: CustomerHistoryItem[];
  clv: number;
  churnRiskScore: number; // 0-100
  customerHealthScore: number; // 0-100
  loyaltyPoints: number;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  recommendedProducts: {
    name: string;
    confidence: number;
    expectedRevenue: number;
    reason: string;
  }[];
  communicationHistory: {
    id: string;
    type: "Call" | "Email" | "WhatsApp" | "Support Ticket";
    date: string;
    summary: string;
    details: string;
  }[];
}

export interface SupplierProfile {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  riskScore: number; // 1-100 (lower is better)
  qualityRating: number; // 1-5 stars
  leadTimeDays: number;
  outstandingOrders: number;
  performanceScore: number; // 0-100
  history: { invoiceNumber: string; date: string; amount: number; status: string }[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  category: "INVENTORY" | "AI_FORECAST" | "SALES" | "SECURITY" | "AUTOMATION" | "SYSTEM";
  description: string;
  iconName: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  triggerEvent: string;
  action: string;
  status: "Active" | "Inactive";
}

export interface AIMemoryItem {
  prompt: string;
  timestamp: string;
}
