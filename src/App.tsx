import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  UserCheck,
  Sliders,
  Target,
  ArrowRight,
  BookmarkCheck,
  Check,
  Cloud,
  Lock,
  FileText,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type {
  FilterState,
  Internship,
  ApplicationRecord,
  ApplicationStatus,
  ListingReport,
  ResumeParsedData,
} from './types/internship.ts';
import { INITIAL_INTERNSHIPS } from './data/mockInternships.ts';
import { filterInternships, calculateRiskSummaryCounts, getTopSkills } from './utils/filter.ts';
import { getUrgentDeadlineReminders } from './utils/tracker.ts';
import {
  auth,
  signInWithGoogle,
  logOut,
  testFirestoreConnection,
  syncApplicationToFirestore,
  deleteApplicationFromFirestore,
  subscribeUserApplications,
  syncProfileToFirestore,
  subscribeUserProfile,
  syncReportToFirestore,
} from './firebase.ts';
import { Navbar } from './components/Navbar.tsx';
import { SearchAndFilters } from './components/SearchAndFilters.tsx';
import { InternshipCard } from './components/InternshipCard.tsx';
import { InternshipDetailModal } from './components/InternshipDetailModal.tsx';
import { StudentProfileModal, StudentProfile } from './components/StudentProfileModal.tsx';
import { RiskChecklistModal } from './components/RiskChecklistModal.tsx';
import { ApplicationTrackerView } from './components/ApplicationTrackerView.tsx';
import { ReportModal } from './components/ReportModal.tsx';
import { ResumeUploadSection } from './components/ResumeUploadSection.tsx';
import { SmartMatchRecommendations } from './components/SmartMatchRecommendations.tsx';

const STORAGE_KEY = 'internsafe_mock_internships_v1';
const PROFILE_KEY = 'internsafe_student_profile_v1';
const APPLICATIONS_KEY = 'internsafe_applications_v1';
const REPORTS_KEY = 'internsafe_reports_v1';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex Chen',
  college: 'State University',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Git', 'Figma'],
};

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-01',
    internshipId: 'intern-01', // Stripe
    status: 'Saved',
    deadline: '2026-11-30',
    notes: 'Need to polish developer portfolio and highlight open source pull requests.',
    updatedAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'app-02',
    internshipId: 'intern-02', // Biosense Health AI
    status: 'Applied',
    appliedDate: '2026-10-15',
    deadline: '2026-11-20',
    notes: 'Submitted resume and GitHub link through talent portal.',
    updatedAt: '2026-10-15T14:30:00Z',
  },
  {
    id: 'app-03',
    internshipId: 'intern-12', // Apex Global (Suspicious)
    status: 'Saved',
    deadline: '2026-10-21',
    notes: 'Flagged as high-risk ($199 fee demanded). Do not proceed.',
    updatedAt: '2026-10-18T16:00:00Z',
  },
];

export default function App() {
  // 1. Navigation View Tab
  const [activeTab, setActiveTab] = useState<'discover' | 'tracker' | 'resume'>('discover');

  // 2. Parsed Resume State (session-only, private, not permanently stored)
  const [parsedResumeData, setParsedResumeData] = useState<ResumeParsedData | null>(() => {
    try {
      const stored = sessionStorage.getItem('internsafe_parsed_resume_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read parsed resume:', e);
    }
    return null;
  });

  const handleSetParsedResumeData = (data: ResumeParsedData | null) => {
    setParsedResumeData(data);
    try {
      if (data) {
        sessionStorage.setItem('internsafe_parsed_resume_v1', JSON.stringify(data));
      } else {
        sessionStorage.removeItem('internsafe_parsed_resume_v1');
      }
    } catch (e) {
      console.error('Failed to store parsed resume in sessionStorage:', e);
    }
  };

  // 3. Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // 3. Internships State
  const [internships, setInternships] = useState<Internship[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read internships:', e);
    }
    return INITIAL_INTERNSHIPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(internships));
    } catch (e) {
      console.error('Failed to write internships:', e);
    }
  }, [internships]);

  // 4. Student Profile & Skills State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read profile:', e);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(studentProfile));
    } catch (e) {
      console.error('Failed to write profile:', e);
    }
  }, [studentProfile]);

  // 5. Applications Tracker State
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(APPLICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read applications:', e);
    }
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to write applications:', e);
    }
  }, [applications]);

  // 6. Reports State
  const [reports, setReports] = useState<ListingReport[]>(() => {
    try {
      const stored = localStorage.getItem(REPORTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read reports:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to write reports:', e);
    }
  }, [reports]);

  // 7. Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    locationQuery: '',
    workMode: 'all',
    compensation: 'all',
    riskLevel: 'all',
    selectedSkill: undefined,
    sortBy: 'default',
  });

  // 8. Modals State
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [reportingInternship, setReportingInternship] = useState<Internship | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // 9. Firebase Boot Connection Test & Auth Listener
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`Signed in as ${user.displayName || user.email}. Cloud sync active.`);
        // Set student name if not customized
        if (user.displayName) {
          setStudentProfile((prev) => ({
            ...prev,
            name: user.displayName || prev.name,
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 10. Real-time Firestore Sync for Authenticated User
  useEffect(() => {
    if (!currentUser) return;

    // Listen to user's tracked applications from Firestore
    const unsubApps = subscribeUserApplications(currentUser.uid, (cloudApps) => {
      if (cloudApps.length > 0) {
        setApplications(cloudApps);
      }
    });

    // Listen to user's profile from Firestore
    const unsubProfile = subscribeUserProfile(currentUser.uid, (cloudProfile) => {
      setStudentProfile((prev) => ({
        ...prev,
        name: cloudProfile.name || prev.name,
        college: cloudProfile.college || prev.college,
        skills: cloudProfile.skills.length > 0 ? cloudProfile.skills : prev.skills,
      }));
    });

    return () => {
      unsubApps();
      unsubProfile();
    };
  }, [currentUser]);

  // Auth Action Handlers
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign in failed:', e);
      showToast('Sign-in cancelled or popup closed.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('Signed out of cloud account.');
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  // Map of tracked application statuses for quick card lookups
  const applicationStatusMap = useMemo(() => {
    const map = new Map<string, ApplicationStatus>();
    applications.forEach((app) => map.set(app.internshipId, app.status));
    return map;
  }, [applications]);

  // Set of reported internship IDs
  const reportedSet = useMemo(() => {
    return new Set(reports.map((r) => r.internshipId));
  }, [reports]);

  // Derived urgent deadline reminders
  const urgentReminders = useMemo(() => {
    return getUrgentDeadlineReminders(applications);
  }, [applications]);

  // Derived filtered and sorted internships
  const filteredInternships = useMemo(() => {
    return filterInternships(internships, filters, studentProfile.skills);
  }, [internships, filters, studentProfile.skills]);

  // Derived statistics
  const stats = useMemo(() => {
    return calculateRiskSummaryCounts(internships);
  }, [internships]);

  // Top skills for quick-filter chips
  const topSkills = useMemo(() => {
    return getTopSkills(internships, 12);
  }, [internships]);

  // Tracker Handlers with Cloud Sync
  const handleToggleSave = (internship: Internship) => {
    const existing = applications.find((a) => a.internshipId === internship.id);
    if (existing) {
      setApplications(applications.filter((a) => a.id !== existing.id));
      if (currentUser) {
        deleteApplicationFromFirestore(currentUser.uid, existing.id);
      }
      showToast(`Removed "${internship.company}" from Application Tracker.`);
    } else {
      const newApp: ApplicationRecord = {
        id: `app-${Date.now()}`,
        internshipId: internship.id,
        status: 'Saved',
        deadline: internship.deadline,
        updatedAt: new Date().toISOString(),
      };
      setApplications([...applications, newApp]);
      if (currentUser) {
        syncApplicationToFirestore(currentUser.uid, newApp);
      }
      showToast(`Saved "${internship.company}" to your Application Tracker!`);
    }
  };

  const handleUpdateApplicationStatus = (
    targetInternshipIdOrAppId: string,
    newStatus: ApplicationStatus
  ) => {
    const existingByInternship = applications.find(
      (a) => a.internshipId === targetInternshipIdOrAppId
    );
    const existingById = applications.find((a) => a.id === targetInternshipIdOrAppId);
    const target = existingByInternship || existingById;

    if (target) {
      const updatedApp: ApplicationRecord = {
        ...target,
        status: newStatus,
        appliedDate:
          newStatus === 'Applied' && !target.appliedDate
            ? new Date().toISOString().split('T')[0]
            : target.appliedDate,
        updatedAt: new Date().toISOString(),
      };
      setApplications(
        applications.map((app) => (app.id === target.id ? updatedApp : app))
      );
      if (currentUser) {
        syncApplicationToFirestore(currentUser.uid, updatedApp);
      }
      showToast(`Updated stage to "${newStatus}".`);
    } else {
      const targetInternship = internships.find((i) => i.id === targetInternshipIdOrAppId);
      if (targetInternship) {
        const newApp: ApplicationRecord = {
          id: `app-${Date.now()}`,
          internshipId: targetInternship.id,
          status: newStatus,
          appliedDate:
            newStatus === 'Applied' ? new Date().toISOString().split('T')[0] : undefined,
          deadline: targetInternship.deadline,
          updatedAt: new Date().toISOString(),
        };
        setApplications([...applications, newApp]);
        if (currentUser) {
          syncApplicationToFirestore(currentUser.uid, newApp);
        }
        showToast(`Added "${targetInternship.company}" as "${newStatus}"!`);
      }
    }
  };

  const handleUpdateApplicationNotes = (appId: string, notes: string) => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        const revised = { ...app, notes, updatedAt: new Date().toISOString() };
        if (currentUser) {
          syncApplicationToFirestore(currentUser.uid, revised);
        }
        return revised;
      }
      return app;
    });
    setApplications(updated);
    showToast('Application notes saved.');
  };

  const handleRemoveApplication = (appId: string) => {
    setApplications(applications.filter((a) => a.id !== appId));
    if (currentUser) {
      deleteApplicationFromFirestore(currentUser.uid, appId);
    }
    showToast('Application removed from tracker.');
  };

  // Student Profile Save with Cloud Sync
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    if (currentUser) {
      syncProfileToFirestore(currentUser.uid, newProfile);
    }
    showToast('Student profile and skills updated!');
  };

  // Resume Skills Sync Handlers
  const handleSaveSkillsFromResume = (newSkills: string[]) => {
    const updatedProfile = {
      ...studentProfile,
      skills: newSkills,
    };
    setStudentProfile(updatedProfile);
    if (currentUser) {
      syncProfileToFirestore(currentUser.uid, updatedProfile);
    }
    showToast(`Synced ${newSkills.length} skills from resume to your profile!`);
  };

  const handleAddSingleSkill = (skill: string) => {
    if (!studentProfile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      const updatedProfile = {
        ...studentProfile,
        skills: [...studentProfile.skills, skill],
      };
      setStudentProfile(updatedProfile);
      if (currentUser) {
        syncProfileToFirestore(currentUser.uid, updatedProfile);
      }
      showToast(`Added "${skill}" to your profile skills!`);
    } else {
      showToast(`"${skill}" is already in your profile skills.`);
    }
  };

  // Report Handlers with Cloud Sync
  const handleSubmitReport = (report: ListingReport) => {
    setReports([...reports, report]);
    syncReportToFirestore(report);
    showToast(`Report received for "${report.company}". Thank you for protecting fellow students.`);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      locationQuery: '',
      workMode: 'all',
      compensation: 'all',
      riskLevel: 'all',
      selectedSkill: undefined,
      sortBy: 'default',
    });
  };

  const handleSkillSelect = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSkill: prev.selectedSkill === skill ? undefined : skill,
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans antialiased selection:bg-[#a78bfa]/20 selection:text-[#a78bfa]">
      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121215] text-[#fafafa] text-xs sm:text-sm font-mono font-medium px-4 py-3 rounded-[8px] shadow-2xl border border-[#27272a] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalCount={stats.total}
        lowRiskCount={stats.low}
        flaggedCount={stats.medium + stats.high}
        skillsCount={studentProfile.skills.length}
        trackedCount={applications.length}
        urgentDeadlinesCount={urgentReminders.length}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenChecklist={() => setIsChecklistModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: APPLICATION TRACKER VIEW */}
        {activeTab === 'tracker' ? (
          <ApplicationTrackerView
            applications={applications}
            internships={internships}
            onUpdateStatus={(appId, status) => handleUpdateApplicationStatus(appId, status)}
            onUpdateNotes={handleUpdateApplicationNotes}
            onRemoveApplication={handleRemoveApplication}
            onSelectInternship={setSelectedInternship}
            onSwitchToDiscover={() => setActiveTab('discover')}
          />
        ) : activeTab === 'resume' ? (
          /* VIEW 2: RESUME UPLOAD & SMART MATCH VIEW */
          <div className="space-y-6 animate-in fade-in duration-200">
            <ResumeUploadSection
              currentProfileSkills={studentProfile.skills}
              onSaveSkillsToProfile={handleSaveSkillsFromResume}
              parsedData={parsedResumeData}
              onSetParsedData={handleSetParsedResumeData}
            />

            <SmartMatchRecommendations
              internships={internships}
              studentSkills={studentProfile.skills}
              onSelectInternship={setSelectedInternship}
              onAddSkillSuggestion={handleAddSingleSkill}
            />
          </div>
        ) : (
          /* VIEW 3: DISCOVER INTERNSHIPS VIEW */
          <>
            {/* Hero & Risk Education Banner */}
            <section className="mb-8 bg-[#121215] text-[#fafafa] rounded-[8px] p-6 sm:p-8 md:p-9 border border-[#27272a] relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#a78bfa]/15 border border-[#a78bfa]/30 text-[#a78bfa] text-xs font-mono font-semibold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5 text-[#a78bfa]" />
                    Student Fraud Protection Active
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] text-xs font-mono font-semibold">
                    <Cloud className="w-3.5 h-3.5 text-[#34d399]" />
                    Firebase Live Sync
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#fafafa] mb-4 leading-tight">
                  Find Real Internships.{' '}
                  <span className="text-[#a78bfa]">
                    Spot Scams Instantly.
                  </span>
                </h1>

                <p className="text-[#a1a1aa] text-sm sm:text-base mb-6 leading-relaxed">
                  Every internship on InternSafe is audited against our 6-point fraud checklist. We flag upfront registration fees, fake recruiter domains, unrealistic stipends, and WhatsApp-only hiring before you apply.
                </p>

                {/* Quick Actions in Hero */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('resume')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold text-xs sm:text-sm rounded-[8px] transition-all"
                  >
                    <FileText className="w-4 h-4 text-[#09090b]" />
                    Upload Resume & Smart Match
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium text-xs sm:text-sm rounded-[8px] transition-all"
                  >
                    <Target className="w-4 h-4 text-[#a78bfa]" />
                    Customize Skills ({studentProfile.skills.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChecklistModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium text-xs sm:text-sm rounded-[8px] transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                    6-Point Risk Checklist
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('tracker')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium text-xs sm:text-sm rounded-[8px] transition-all"
                  >
                    <BookmarkCheck className="w-4 h-4 text-[#a78bfa]" />
                    Tracker ({applications.length})
                  </button>
                </div>

                {/* Risk Color Legend Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-[#27272a] text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-[6px] bg-[#0c0c0f] border border-[#34d399]/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] shrink-0" />
                    <div>
                      <span className="font-mono font-semibold text-[#34d399] block">Low Risk (Safe)</span>
                      <span className="text-[#71717a] text-[11px] font-mono">
                        Verified domain & 0 upfront fees
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-[6px] bg-[#0c0c0f] border border-[#f59e0b]/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                    <div>
                      <span className="font-mono font-semibold text-[#fbbf24] block">Medium Risk</span>
                      <span className="text-[#71717a] text-[11px] font-mono">
                        Training fees or 100% commission
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-[6px] bg-[#0c0c0f] border border-[#ef4444]/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                    <div>
                      <span className="font-mono font-semibold text-[#ef4444] block">High Risk (Scam Alert)</span>
                      <span className="text-[#71717a] text-[11px] font-mono">
                        Advance fee fraud & fake recruiter
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Student Profile Quick Match Bar */}
            <div className="mb-6 bg-[#121215] rounded-[8px] border border-[#27272a] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#18181b] border border-[#27272a] text-[#a78bfa] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#fafafa] text-sm sm:text-base">
                      {studentProfile.name}
                    </span>
                    <span className="text-xs font-mono text-[#71717a]">
                      ({studentProfile.college})
                    </span>
                    {currentUser && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30">
                        Cloud Synced
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-xs font-mono text-[#71717a] mr-1">Skills:</span>
                    {studentProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-[4px] text-[11px] font-mono font-medium bg-[#0c0c0f] text-[#fafafa] border border-[#27272a]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] transition-all"
                  title="Upload resume to auto-detect skills"
                >
                  <FileText className="w-3.5 h-3.5 text-[#a78bfa]" />
                  <span>Resume Match</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: prev.sortBy === 'skillMatch' ? 'default' : 'skillMatch',
                    }));
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium border transition-all ${
                    filters.sortBy === 'skillMatch'
                      ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40'
                      : 'bg-[#0c0c0f] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-[#a78bfa]" />
                  {filters.sortBy === 'skillMatch' ? 'Sorted by Skill Match' : 'Sort by Best Match'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#a78bfa] transition-all"
                >
                  Edit Skills
                  <ArrowRight className="w-3 h-3 text-[#a78bfa]" />
                </button>
              </div>
            </div>

            {/* Step 2 & 3 Search & Filter Panel */}
            <SearchAndFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              availableSkills={topSkills}
              totalResults={filteredInternships.length}
            />

            {/* Active Filters Notification / Skill Tag Pill */}
            {filters.selectedSkill && (
              <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#a1a1aa] bg-[#0c0c0f] border border-[#27272a] p-3 rounded-[8px]">
                <Info className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>
                  Filtered by skill: <strong className="text-[#fafafa]">{filters.selectedSkill}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleSkillSelect(filters.selectedSkill!)}
                  className="ml-auto text-[#a78bfa] hover:underline font-mono text-xs"
                >
                  Clear skill filter
                </button>
              </div>
            )}

            {/* Internship Cards Grid */}
            {filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    studentSkills={studentProfile.skills}
                    applicationStatus={applicationStatusMap.get(internship.id)}
                    isReported={reportedSet.has(internship.id)}
                    onSelect={setSelectedInternship}
                    onSkillClick={handleSkillSelect}
                    onToggleSave={handleToggleSave}
                    onReport={setReportingInternship}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex items-center justify-center mx-auto mb-4 text-[#71717a]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#fafafa] mb-2 tracking-tight">No internships found</h3>
                <p className="text-xs font-mono text-[#a1a1aa] mb-6">
                  We couldn't find any opportunities matching your specific combination of filters. Try loosening your keywords or reset all filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold rounded-[8px] transition-all text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detailed Internship & Risk Audit Modal */}
      <InternshipDetailModal
        internship={selectedInternship}
        studentSkills={studentProfile.skills}
        applicationStatus={
          selectedInternship ? applicationStatusMap.get(selectedInternship.id) : undefined
        }
        isReported={selectedInternship ? reportedSet.has(selectedInternship.id) : false}
        onClose={() => setSelectedInternship(null)}
        onSkillClick={handleSkillSelect}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onUpdateStatus={handleUpdateApplicationStatus}
        onReport={setReportingInternship}
      />

      {/* Student Profile & Skill Matcher Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
        onNavigateToResume={() => setActiveTab('resume')}
      />

      {/* 6-Point Risk Checklist Modal Guide */}
      <RiskChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />

      {/* Report Suspicious Listing Modal */}
      <ReportModal
        internship={reportingInternship}
        isOpen={Boolean(reportingInternship)}
        onClose={() => setReportingInternship(null)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Trust & Safety Footer */}
      <footer className="mt-16 border-t border-[#27272a] bg-[#0c0c0f] py-8 text-xs font-mono text-[#71717a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#a78bfa] text-[#09090b] flex items-center justify-center font-bold text-xs">
              <Shield className="w-3 h-3 fill-[#09090b]" />
            </div>
            <span className="font-semibold text-[#fafafa]">InternSafe Platform</span>
            <span>— Precision in Darkness • Fraud Detection & Student Protection.</span>
          </div>

          <div className="flex items-center gap-4 text-[#71717a]">
            <span>Low Risk: #34d399</span>
            <span>Medium: #f59e0b</span>
            <span>High Risk: #ef4444</span>
            <span className="inline-flex items-center gap-1 text-[#34d399]">
              <Cloud className="w-3 h-3" /> Firebase Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
