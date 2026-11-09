"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, INITIAL_PROFILE } from "@/data/user";

interface ProgressContextType {
  profile: UserProfile;
  completeChallenge: (challengeId: string, xpEarned: number, badgeAwarded?: string) => boolean;
  isChallengeCompleted: (challengeId: string) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = "hackercraft_user_progress_v1";

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load stored user progress", e);
    }
    setMounted(true);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.warn("Could not persist user progress", e);
    }
  };

  const isChallengeCompleted = (challengeId: string) => {
    return profile.completedChallenges.includes(challengeId);
  };

  const completeChallenge = (challengeId: string, xpEarned: number, badgeAwarded?: string): boolean => {
    if (profile.completedChallenges.includes(challengeId)) {
      return false; // Já pontuou anteriormente
    }

    const updatedCompleted = [...profile.completedChallenges, challengeId];
    let newXp = profile.currentXp + xpEarned;
    let newLevel = profile.level;
    let newNextXp = profile.nextLevelXp;
    let rank = profile.rank;

    while (newXp >= newNextXp) {
      newLevel += 1;
      newNextXp = Math.floor(newNextXp * 1.5);
    }

    if (newLevel >= 10) rank = "Cyber Specialist";
    if (newLevel >= 20) rank = "Elite Infiltrator";
    if (newLevel >= 30) rank = "Cyber Warlord";

    const badges = [...profile.unlockedBadges];
    if (badgeAwarded && !badges.includes(badgeAwarded)) {
      badges.push(badgeAwarded);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      level: newLevel,
      currentXp: newXp,
      nextLevelXp: newNextXp,
      rank,
      completedChallenges: updatedCompleted,
      solvedFlags: profile.solvedFlags + 1,
      reputation: profile.reputation + Math.floor(xpEarned / 10),
      unlockedBadges: badges
    };

    saveProfile(updatedProfile);
    return true;
  };

  const resetProgress = () => {
    saveProfile(INITIAL_PROFILE);
  };

  return (
    <ProgressContext.Provider
      value={{
        profile: mounted ? profile : INITIAL_PROFILE,
        completeChallenge,
        isChallengeCompleted,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useUserProgress must be used within a ProgressProvider");
  }
  return context;
}
