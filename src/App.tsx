import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { MissionControlDashboard } from "./components/MissionControlDashboard";
import { sound } from "./utils/audio";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type AppState = "LANDING" | "AUTH" | "ONBOARDING" | "DASHBOARD";

interface UserProfile {
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
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("LANDING");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("strata-theme");
    return (saved as any) || "dark";
  });

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("strata-theme", newTheme);
  };

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          let userDocSnap;
          try {
            userDocSnap = await getDoc(userDocRef);
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          }

          if (userDocSnap && userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            setUserProfile(data);
            setAppState("DASHBOARD");
          } else {
            // Profile not built yet, we require onboarding
            // Create a default partial profile
            const names = (user.displayName || "User").split(" ");
            const partialProfile: UserProfile = {
              firstName: names[0] || "Owner",
              lastName: names.slice(1).join(" ") || "Admin",
              email: user.email || "",
              mobile: user.phoneNumber || "",
              businessName: "",
              industry: "Retail & Warehousing",
              companySize: "100-500 employees",
              country: "United States",
              currency: "USD ($)",
              goals: ["Revenue Growth"]
            };
            setUserProfile(partialProfile);
            setAppState("ONBOARDING");
          }
        } catch (err) {
          console.error("Error fetching user profile from Firestore:", err);
          // Standard guest fallback
          setUserProfile({
            firstName: "Rithwik",
            lastName: "Parkala",
            email: user.email || "rithwikparkala30@gmail.com",
            mobile: "+1 (555) 012-9841",
            businessName: "Apex Logistics & Retailing",
            industry: "Retail & Warehousing",
            companySize: "100-500 employees",
            country: "United States",
            currency: "USD ($)",
            goals: ["Revenue Growth", "Inventory Optimization", "AI Automation"]
          });
          setAppState("DASHBOARD");
        }
      } else {
        setUserProfile((prev) => {
          if (prev) return prev;
          setAppState("LANDING");
          return null;
        });
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLandingAction = (action: "LOGIN" | "REGISTER" | "GUEST") => {
    if (action === "GUEST") {
      setUserProfile({
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
      setAppState("DASHBOARD");
    } else {
      setAppState("AUTH");
    }
  };

  const handleAuthSuccess = async (profile: UserProfile, bypassOnboarding = false) => {
    setUserProfile(profile);
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.uid), profile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }
    setAppState(bypassOnboarding ? "DASHBOARD" : "ONBOARDING");
  };

  const handleOnboardingComplete = async (onboardingData: {
    businessName: string;
    industry: string;
    companySize: string;
    currency: string;
    country: string;
    enabledModules: string[];
  }) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        businessName: onboardingData.businessName,
        industry: onboardingData.industry,
        companySize: onboardingData.companySize,
        currency: onboardingData.currency,
        country: onboardingData.country
      };
      setUserProfile(updatedProfile);

      // Persist full onboarding data to Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await setDoc(doc(db, "users", currentUser.uid), updatedProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      }
    }
    setAppState("DASHBOARD");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
    setUserProfile(null);
    setAppState("LANDING");
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#10131A] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs font-mono text-[#8B92A5] block">INITIALIZING SECURE STRATA ENDPOINT...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen selection:bg-[#8B7FF5] selection:text-white ${
      theme === "light" ? "theme-light bg-[#F8FAFC] text-[#0F172A]" : "theme-dark bg-[#10131A] text-[#EDEFF4]"
    }`} id="strata-app-container">
      
      {/* Sound Toggle Helper (floating in margin for custom setups) */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-mono text-[#8B92A5]">SYNTH AUDIO:</span>
        <button
          onClick={() => {
            sound.toggleMute();
            sound.playClick();
          }}
          className="p-1 px-2 text-[9px] font-mono rounded bg-[#1A1E29] border border-[#2A3040] text-[#EDEFF4] hover:border-[#8B7FF5]"
          id="btn-toggle-sound"
        >
          TOGGLE SOUND
        </button>
      </div>

      {appState === "LANDING" && (
        <LandingPage onAction={handleLandingAction} />
      )}

      {appState === "AUTH" && (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess} 
          onBackToLanding={() => {
            sound.playClick();
            setAppState("LANDING");
          }} 
          onGuestBypass={() => {
            setUserProfile({
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
            setAppState("DASHBOARD");
          }}
        />
      )}

      {appState === "ONBOARDING" && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#10131A]">
          <OnboardingWizard 
            userEmail={userProfile?.email} 
            onComplete={handleOnboardingComplete} 
          />
        </div>
      )}

      {appState === "DASHBOARD" && userProfile && (
        <MissionControlDashboard 
          userProfile={userProfile} 
          onLogout={handleLogout} 
          activeTheme={theme}
          onChangeTheme={handleSetTheme}
        />
      )}

    </div>
  );
}
