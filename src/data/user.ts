export interface UserProfile {
  handle: string;
  rank: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  completedChallenges: string[];
  solvedFlags: number;
  reputation: number;
  unlockedBadges: string[];
}

export const INITIAL_PROFILE: UserProfile = {
  handle: "neo_operator",
  rank: "Script Explorer",
  level: 3,
  currentXp: 750,
  nextLevelXp: 1500,
  completedChallenges: [],
  solvedFlags: 2,
  reputation: 98,
  unlockedBadges: ["FIRST BLOOD", "RECON MASTER"]
};

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  country: string;
  level: number;
  xp: number;
  solved: number;
  badge: string;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, handle: "0xGhost", country: "BR", level: 42, xp: 34500, solved: 128, badge: "CYBER WARLORD" },
  { rank: 2, handle: "null_byte", country: "BR", level: 38, xp: 29800, solved: 114, badge: "EXPLOIT DEV" },
  { rank: 3, handle: "c4t_v0id", country: "PT", level: 35, xp: 26100, solved: 98, badge: "MALWARE ARCHITECT" },
  { rank: 4, handle: "k4li_l1nux", country: "BR", level: 29, xp: 21300, solved: 82, badge: "RECON ELITE" },
  { rank: 5, handle: "b00t_sect0r", country: "BR", level: 24, xp: 17400, solved: 67, badge: "PWN GOD" },
  { rank: 6, handle: "neo_operator", country: "BR", level: 3, xp: 750, solved: 2, badge: "RECON MASTER" },
];
