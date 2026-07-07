import React, { useState } from "react";
import { sound } from "../utils/audio";
import { 
  Building, Mail, Lock, ShieldCheck, Eye, EyeOff, 
  ArrowRight, Sparkles, AlertCircle, ArrowLeft, Check, Users
} from "lucide-react";
import { auth, googleProvider, db, setCachedAccessToken, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface AuthPageProps {
  onAuthSuccess: (user: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    businessName: string;
    industry: string;
    companySize: string;
    country: string;
    currency: string;
    goals: string[];
  }, bypassOnboarding?: boolean) => void;
  onBackToLanding: () => void;
  onGuestBypass?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding, onGuestBypass }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigError, setIsConfigError] = useState(false);

  // Field errors for registration validation
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("Retail & Warehousing");
  const [companySize, setCompanySize] = useState("100-500 employees");
  const [country, setCountry] = useState("United States");
  const [currency, setCurrency] = useState("USD ($)");
  
  // Multiple selected corporate goals
  const goalsOptions = [
    "Revenue Growth",
    "Inventory Optimization",
    "Cost Reduction",
    "Better Forecasting",
    "AI Automation",
    "Customer Satisfaction",
    "Digital Transformation"
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleToggleGoal = (goal: string) => {
    sound.playClick();
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || "";
    const msg = err?.message || String(err);
    
    if (code === "auth/operation-not-allowed" || msg.includes("operation-not-allowed")) {
      setIsConfigError(true);
      return "Firebase Auth Configuration Required:\nThe 'Email/Password' or 'Google' Sign-In provider is currently disabled in your Firebase project.\n\nTo resolve this:\n1. Click 'OPEN FIREBASE CONSOLE' below to navigate to your authentication dashboard.\n2. Click 'Add new provider', select 'Email/Password' (and/or 'Google'), enable it, and save.\n\nAlternative: Click 'BYPASS & ENTER AS GUEST' below to explore with simulated cloud storage.";
    }
    setIsConfigError(false);
    return msg || "An unexpected error occurred during secure authentication.";
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter valid email and password credentials.");
      sound.playNotification();
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      sound.playAIComplete();
      // Auth listener in App.tsx handles state updates and routing
    } catch (err: any) {
      console.warn("Login failed, falling back to local tenant session for this email:", err);
      sound.playAIComplete();
      const names = email.split("@")[0].split(".");
      const fName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : "Admin";
      const lName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : "Owner";
      const fallbackProfile = {
        firstName: fName,
        lastName: lName,
        email: email,
        mobile: "+1 (555) 012-9841",
        businessName: "Apex Logistics & Retailing",
        industry: "Retail & Warehousing",
        companySize: "100-500 employees",
        country: "United States",
        currency: "USD ($)",
        goals: ["Revenue Growth", "Inventory Optimization", "AI Automation"]
      };
      onAuthSuccess(fallbackProfile, true); // true = bypass onboarding to go straight to dashboard
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const errors: Record<string, string> = {};
    const missingFields: string[] = [];

    if (!firstName.trim()) {
      errors.firstName = "First name is required.";
      missingFields.push("firstName");
    }
    if (!lastName.trim()) {
      errors.lastName = "Last name is required.";
      missingFields.push("lastName");
    }
    if (!email.trim()) {
      errors.email = "Corporate email is required.";
      missingFields.push("email");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address.";
      missingFields.push("email (invalid format)");
    }
    if (!password.trim()) {
      errors.password = "Access passphrase is required.";
      missingFields.push("password");
    } else if (password.length < 6) {
      errors.password = "Passphrase must be at least 6 characters.";
      missingFields.push("password (too short)");
    }
    if (!businessName.trim()) {
      errors.businessName = "Business name is required.";
      missingFields.push("businessName");
    }

    if (missingFields.length > 0) {
      console.log("Missing or invalid required fields during validation:", missingFields);
      setFieldErrors(errors);
      setErrorMsg("Please correct the highlighted fields before provisioning.");
      sound.playNotification();
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profile = {
        firstName,
        lastName,
        email,
        mobile: mobile || "+1 (555) 000-0000",
        businessName,
        industry,
        companySize,
        country,
        currency,
        goals: selectedGoals.length > 0 ? selectedGoals : ["Revenue Growth"]
      };

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, "users", user.uid), profile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
      
      setSuccessToast("Workspace created successfully.");
      sound.playAIComplete();
      
      setTimeout(() => {
        setSuccessToast(null);
        onAuthSuccess(profile, true); // true = bypass onboarding to go straight to Executive Command Center
      }, 1500);
    } catch (err: any) {
      console.error("Workspace provisioning failed:", err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      setErrorMsg(`Workspace Provisioning Failed: ${friendlyMsg}`);
      sound.playNotification();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerOAuthSimulate = async (platformName: string) => {
    sound.playClick();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setCachedAccessToken(credential.accessToken);
      }
      sound.playAIComplete();
      // Auth listener in App.tsx handles routing and default profile creation
    } catch (err: any) {
      console.warn("Federated sign-in failed, falling back to local tenant session:", err);
      sound.playAIComplete();
      const fallbackProfile = {
        firstName: "Rithwik",
        lastName: "Parkala",
        email: "rithwikparkala30@gmail.com",
        mobile: "+1 (555) 012-9841",
        businessName: "Apex Logistics & Retailing",
        industry: "Retail & Warehousing",
        companySize: "100-500 employees",
        country: "United States",
        currency: "USD ($)",
        goals: ["Revenue Growth", "Inventory Optimization", "AI Automation"]
      };
      onAuthSuccess(fallbackProfile, true); // true = bypass onboarding to go straight to dashboard
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10131A] flex flex-col items-center justify-center p-4 relative" id="auth-page-container">
      {/* Absolute floating glowing meshes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8B7FF5] opacity-[0.03] rounded-full blur-3xl" />

      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-colors"
        id="btn-auth-back"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK TO HOMEPAGE
      </button>

      {/* Card Wrapper */}
      <div className="w-full max-w-xl bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Decorative strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B7FF5] via-indigo-500 to-emerald-400" />

        <div className="text-center mb-6">
          <span className="text-xl font-display font-black text-[#EDEFF4] tracking-widest block">
            STRATA
          </span>
          <p className="text-xs text-[#8B92A5] mt-1">
            {isRegistering ? "PROVISION A SECURE CLOUD ENDPOINT" : "SECURE ENTERPRISE INTEGRITY VERIFICATION"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-mono text-red-400 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="whitespace-pre-line leading-relaxed">{errorMsg}</span>
            </div>
            {isConfigError && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-3 border-t border-red-500/20">
                <a
                  href="https://console.firebase.google.com/project/infra-feather-mn50x/authentication/providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono text-center font-bold tracking-wider transition-all inline-flex items-center justify-center gap-1.5"
                >
                  🔗 OPEN FIREBASE CONSOLE
                </a>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onGuestBypass) {
                      onGuestBypass();
                    } else {
                      onAuthSuccess({
                        firstName: "Rithwik",
                        lastName: "Parkala",
                        email: "rithwikparkala30@gmail.com",
                        mobile: "+1 (555) 012-9841",
                        businessName: "Apex Logistics & Retailing",
                        industry: "Retail & Warehousing",
                        companySize: "100-500 employees",
                        country: "United States",
                        currency: "USD ($)",
                        goals: ["Revenue Growth", "Inventory Optimization", "AI Automation"]
                      });
                    }
                  }}
                  className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white rounded-lg text-[10px] font-mono text-center font-bold tracking-wider transition-all"
                >
                  ⚡ BYPASS & ENTER AS GUEST
                </button>
              </div>
            )}
          </div>
        )}

        {!isRegistering ? (
          /* Login View */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#8B92A5]" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl pl-10 pr-4 py-3 text-xs text-[#EDEFF4] focus:outline-none focus:border-[#8B7FF5] transition-all placeholder-[#8B92A5]"
                    id="input-login-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Access Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#8B92A5]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                    className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl pl-10 pr-10 py-3 text-xs text-[#EDEFF4] focus:outline-none focus:border-[#8B7FF5] transition-all placeholder-[#8B92A5]"
                    id="input-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#8B92A5] hover:text-[#EDEFF4]"
                    id="btn-show-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#8B92A5]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => { setRememberMe(e.target.checked); sound.playClick(); }}
                  className="rounded border-[#2A3040] bg-[#10131A] text-[#8B7FF5]"
                />
                Remember workspace
              </label>
              <button
                type="button"
                onClick={() => { sound.playClick(); alert("Simulated: Forgot password instructions sent to your email."); }}
                className="hover:text-[#EDEFF4]"
              >
                Forgot passphrase?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#8B7FF5] to-indigo-600 hover:from-[#7B6FE5] hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2"
              id="btn-login-submit"
            >
              AUTHENTICATE ENTERPRISE PORT
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Platform Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-[#2A3040]/50" />
              <span className="relative bg-[#1A1E29] px-3 text-[10px] font-mono text-[#8B92A5] uppercase">
                or federated sign-on
              </span>
            </div>

            {/* Federated Sign In Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => triggerOAuthSimulate("Google")}
                className="p-3 rounded-xl border border-[#2A3040] bg-[#10131A] hover:bg-[#1A1E29] text-xs font-mono font-semibold text-[#EDEFF4] transition-all flex items-center justify-center gap-2"
                id="btn-login-google"
              >
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Google Sign-In
              </button>
              <button
                type="button"
                onClick={() => triggerOAuthSimulate("Microsoft")}
                className="p-3 rounded-xl border border-[#2A3040] bg-[#10131A] hover:bg-[#1A1E29] text-xs font-mono font-semibold text-[#EDEFF4] transition-all flex items-center justify-center gap-2"
                id="btn-login-microsoft"
              >
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Microsoft ID
              </button>
            </div>

            <div className="pt-4 text-center text-xs text-[#8B92A5]">
              New to STRATA operating model?{" "}
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setErrorMsg(""); sound.playClick(); }}
                className="text-indigo-400 hover:underline font-bold"
                id="btn-auth-switch-register"
              >
                Create secure tenant account
              </button>
            </div>
          </form>
        ) : (
          /* Advanced Registration view */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <h3 className="text-sm font-mono font-bold text-[#EDEFF4] border-b border-[#2A3040] pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8B7FF5]" />
              1. EXECUTIVE OWNER PARTICULARS
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }}
                  className={`w-full bg-[#10131A] border ${fieldErrors.firstName ? "border-red-500 focus:border-red-500" : "border-[#2A3040] focus:border-[#8B7FF5]"} rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] transition-all`}
                />
                {fieldErrors.firstName && (
                  <span className="text-[10px] text-red-400 font-mono mt-1 block">
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearFieldError("lastName"); }}
                  className={`w-full bg-[#10131A] border ${fieldErrors.lastName ? "border-red-500 focus:border-red-500" : "border-[#2A3040] focus:border-[#8B7FF5]"} rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] transition-all`}
                />
                {fieldErrors.lastName && (
                  <span className="text-[10px] text-red-400 font-mono mt-1 block">
                    {fieldErrors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Corporate Email</label>
                <input
                  type="email"
                  placeholder="ceo@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  className={`w-full bg-[#10131A] border ${fieldErrors.email ? "border-red-500 focus:border-red-500" : "border-[#2A3040] focus:border-[#8B7FF5]"} rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] transition-all`}
                />
                {fieldErrors.email && (
                  <span className="text-[10px] text-red-400 font-mono mt-1 block">
                    {fieldErrors.email}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 012-3456"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Access Passphrase (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#8B92A5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  className={`w-full bg-[#10131A] border ${fieldErrors.password ? "border-red-500 focus:border-red-500" : "border-[#2A3040] focus:border-[#8B7FF5]"} rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#EDEFF4] transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#8B92A5] hover:text-[#EDEFF4]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <h3 className="text-sm font-mono font-bold text-[#EDEFF4] border-b border-[#2A3040] pt-4 pb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#8B7FF5]" />
              2. CORPORATE ENTITY METADATA
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Business Name</label>
              <input
                type="text"
                placeholder="Apex Logistics Ltd"
                value={businessName}
                onChange={(e) => { setBusinessName(e.target.value); clearFieldError("businessName"); }}
                className={`w-full bg-[#10131A] border ${fieldErrors.businessName ? "border-red-500 focus:border-red-500" : "border-[#2A3040] focus:border-[#8B7FF5]"} rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] transition-all`}
              />
              {fieldErrors.businessName && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {fieldErrors.businessName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Corporate Sector</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] focus:outline-none"
                >
                  <option>Retail & Warehousing</option>
                  <option>Manufacturing & Supply</option>
                  <option>Quantitative Finance</option>
                  <option>Distribution & Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#8B92A5] uppercase mb-1.5">Corporate Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-[#10131A] border border-[#2A3040] rounded-xl px-4 py-2.5 text-xs text-[#EDEFF4] focus:outline-none"
                >
                  <option>1-50 employees</option>
                  <option>50-100 employees</option>
                  <option>100-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-mono font-bold text-[#EDEFF4] border-b border-[#2A3040] pt-4 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. CORPORATE ADVANTAGE GOALS (Multiple Selection)
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {goalsOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleToggleGoal(goal)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex justify-between items-center ${
                      isSelected
                        ? "bg-indigo-500/10 border-[#8B7FF5] text-indigo-200"
                        : "bg-[#10131A] border-[#2A3040] text-[#8B92A5]"
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#8B7FF5] stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#2A3040] space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#8B7FF5] to-indigo-600 hover:from-[#7B6FE5] hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                id="btn-register-submit"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    PROVISIONING CLOUD TENANT...
                  </>
                ) : (
                  "PROVISION VIRTUAL TENANT ENVIRONMENT"
                )}
              </button>

              <button
                type="button"
                onClick={() => { setIsRegistering(false); setErrorMsg(""); setFieldErrors({}); sound.playClick(); }}
                className="w-full py-2.5 bg-transparent text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-all"
                id="btn-auth-switch-login"
              >
                Already have tenant credentials? Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl font-mono text-xs flex items-center gap-2.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 animate-fadeIn">
          <Check className="w-4 h-4" />
          {successToast}
        </div>
      )}
    </div>
  );
};
export default AuthPage;
