import React from 'react';
import {
  Shield,
  Search,
  BookmarkCheck,
  Cloud,
  LogIn,
  LogOut,
  FileText,
  ShieldAlert,
  UserCheck,
  Moon,
  Sparkles,
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'discover' | 'tracker' | 'resume';
  onTabChange: (tab: 'discover' | 'tracker' | 'resume') => void;
  totalCount: number;
  lowRiskCount: number;
  flaggedCount: number;
  skillsCount: number;
  trackedCount: number;
  urgentDeadlinesCount: number;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenProfile: () => void;
  onOpenChecklist: () => void;
  themeMode?: 'high-contrast' | 'pure-black';
  onToggleThemeMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  totalCount,
  lowRiskCount,
  flaggedCount,
  skillsCount,
  trackedCount,
  urgentDeadlinesCount,
  currentUser,
  onSignIn,
  onSignOut,
  onOpenProfile,
  onOpenChecklist,
  themeMode = 'high-contrast',
  onToggleThemeMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('discover')}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded-[8px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] bg-[#a78bfa] text-[#09090b] flex items-center justify-center font-bold shadow-none">
                <Shield className="w-5 h-5 fill-[#09090b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#fafafa]">
                    Intern<span className="text-[#a78bfa]">Safe</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/30 rounded-[4px]">
                    Obsidian Dark
                  </span>
                </div>
                <p className="text-[11px] text-[#71717a] font-mono hidden sm:block">
                  Precision in Darkness • Fraud Detection
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Switcher: Discover vs. Tracker vs. Resume Smart Match */}
          <nav className="flex items-center p-1 bg-[#121215] rounded-[8px] border border-[#27272a] text-xs font-medium shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('discover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'discover'
                  ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] border border-transparent'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Discover</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'tracker'
                  ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] border border-transparent'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Tracker</span>
              <span
                className={`px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono font-bold ${
                  urgentDeadlinesCount > 0
                    ? 'bg-[#ef4444] text-[#fafafa]'
                    : 'bg-[#27272a] text-[#a1a1aa]'
                }`}
                title={
                  urgentDeadlinesCount > 0
                    ? `${urgentDeadlinesCount} urgent deadlines this week!`
                    : `${trackedCount} saved applications`
                }
              >
                {trackedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('resume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'resume'
                  ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Resume Match</span>
            </button>
          </nav>

          {/* Right Action & Cloud Status Controls */}
          <div className="flex items-center gap-2 text-xs font-medium shrink-0">
            {/* Firebase Cloud Sync Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-[11px] font-mono"
              title="Firebase Firestore Cloud Sync Active"
            >
              <Cloud className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Cloud Live</span>
            </div>

            {/* Dark Mode Theme Controller */}
            {onToggleThemeMode && (
              <button
                type="button"
                onClick={onToggleThemeMode}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-transparent hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] transition-all text-xs font-mono"
                title="Toggle High-Contrast Obsidian Theme"
              >
                <Moon className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>Obsidian</span>
              </button>
            )}

            {/* Checklist Guide Action Button */}
            <button
              type="button"
              onClick={onOpenChecklist}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-transparent hover:bg-[#18181b] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium transition-all"
              title="View the 6-point risk checklist guide and interactive scam checker"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
              <span>Risk Checklist</span>
            </button>

            {/* Student Profile Skills Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#a78bfa] font-medium transition-all"
              title="Manage your profile skills"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
              <span className="hidden sm:inline">Skills</span>
              <span className="px-1.5 py-0.2 bg-[#a78bfa] text-[#09090b] rounded-[4px] text-[10px] font-mono font-bold">
                {skillsCount}
              </span>
            </button>

            {/* Firebase Google Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#27272a]">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 text-[#fafafa] font-medium hover:text-[#a78bfa]"
                  title={`Signed in as ${currentUser.displayName || currentUser.email}`}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-[6px] border border-[#27272a] object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-[6px] bg-[#a78bfa] text-[#09090b] flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs truncate max-w-[85px] font-mono">
                    {currentUser.displayName?.split(' ')[0] || 'Alex'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 text-[#71717a] hover:text-[#fafafa] rounded-[6px] hover:bg-[#18181b] transition-colors"
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold transition-all text-xs shadow-none"
                title="Sign in with Google to sync applications and profile to Firebase"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
