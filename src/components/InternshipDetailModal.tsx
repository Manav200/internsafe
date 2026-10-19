import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Mail,
  Linkedin,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Target,
  Check,
  Plus,
  HelpCircle,
  Flag,
} from 'lucide-react';
import type { Internship, ApplicationStatus } from '../types/internship.ts';
import { RiskBadge } from './RiskBadge.tsx';
import { evaluateRiskChecklist } from '../utils/riskChecklist.ts';
import { computeSkillMatch, getSkillMatchColor } from '../utils/skillMatcher.ts';

interface InternshipDetailModalProps {
  internship: Internship | null;
  studentSkills: string[];
  applicationStatus?: ApplicationStatus;
  isReported?: boolean;
  onClose: () => void;
  onSkillClick?: (skill: string) => void;
  onOpenProfile?: () => void;
  onUpdateStatus?: (internshipId: string, status: ApplicationStatus) => void;
  onReport?: (internship: Internship) => void;
}

export const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({
  internship,
  studentSkills,
  applicationStatus,
  isReported,
  onClose,
  onSkillClick,
  onOpenProfile,
  onUpdateStatus,
  onReport,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!internship) return null;

  const isHighRisk = internship.riskScore === 'high';
  const isMediumRisk = internship.riskScore === 'medium';
  const isLowRisk = internship.riskScore === 'low';

  // 1. Evaluate against 6-point risk checklist
  const audit = evaluateRiskChecklist(internship);

  // 2. Evaluate skill match against student profile
  const skillMatch = computeSkillMatch(studentSkills, internship.requiredSkills);
  const matchColor = getSkillMatchColor(skillMatch.matchPercentage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-[#000000]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-[#121215] w-full max-w-3xl rounded-[8px] border border-[#27272a] overflow-hidden max-h-[92vh] flex flex-col my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner if High or Medium Risk */}
        {isHighRisk && (
          <div className="bg-[#ef4444]/15 border-b border-[#ef4444]/30 text-[#f87171] px-6 py-2.5 text-xs sm:text-sm font-mono font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              SCAM WARNING: High likelihood of fraudulent internship listing
            </span>
            <span className="text-[11px] bg-[#ef4444] text-[#fafafa] px-2 py-0.5 rounded-[4px] uppercase font-bold tracking-wider">
              Do Not Pay Fees
            </span>
          </div>
        )}

        {isMediumRisk && (
          <div className="bg-[#f59e0b]/15 border-b border-[#f59e0b]/30 text-[#fbbf24] px-6 py-2 text-xs sm:text-sm font-mono font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#f59e0b]" />
            <span>MODERATE RISK: Review contractual conditions and stipend transparency</span>
          </div>
        )}

        {/* Modal Top Bar */}
        <div className="p-6 border-b border-[#27272a] flex items-start justify-between gap-4 bg-[#121215]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[8px] bg-[#18181b] border border-[#27272a] text-[#fafafa] font-mono font-bold text-base flex items-center justify-center shrink-0">
              {internship.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-[#fafafa] tracking-tight">
                  {internship.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#a1a1aa] mt-0.5">
                {internship.company}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#71717a] hover:text-[#fafafa] rounded-[6px] hover:bg-[#18181b] transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#fafafa] text-sm bg-[#121215]">
          {/* Quick Metrics Header Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] block mb-1">
                Stipend
              </span>
              <span className="font-mono font-semibold text-[#34d399] flex items-center gap-1 text-sm sm:text-base">
                <DollarSign className="w-4 h-4 text-[#34d399] shrink-0" />
                {internship.stipend}
              </span>
            </div>

            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] block mb-1">
                Location
              </span>
              <span className="font-medium text-[#fafafa] flex items-center gap-1 text-xs sm:text-sm truncate">
                <MapPin className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                {internship.location}
              </span>
            </div>

            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] block mb-1">
                Arrangement
              </span>
              <span className="font-medium text-[#fafafa] flex items-center gap-1 text-xs sm:text-sm capitalize font-mono">
                <Briefcase className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                {internship.workMode === 'wfh' ? 'Remote (WFH)' : internship.workMode}
              </span>
            </div>

            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] block mb-1">
                Risk Score
              </span>
              <div>
                <RiskBadge level={internship.riskScore} size="sm" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 1. SKILL MATCH ANALYSIS CARD (CORE FEATURE) */}
          {/* ======================================================== */}
          <div className="p-5 rounded-[8px] bg-[#0c0c0f] border border-[#27272a]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[6px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#fafafa] text-sm sm:text-base tracking-tight">
                    Skill Match Analysis ({skillMatch.matchPercentage}%)
                  </h3>
                  <span className="text-xs font-mono text-[#a1a1aa]">
                    {skillMatch.matchedSkills.length} of {skillMatch.totalRequired} required skills in your profile
                  </span>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="text-xs font-mono text-[#a78bfa] hover:underline"
                >
                  Edit profile skills →
                </button>
              )}
            </div>

            {/* Match Progress Bar */}
            <div className="w-full h-1.5 bg-[#18181b] border border-[#27272a] rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${matchColor.progressBar} transition-all duration-300 rounded-full`}
                style={{ width: `${Math.max(skillMatch.matchPercentage, 5)}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Matched Skills */}
              <div className="p-3.5 rounded-[8px] bg-[#121215] border border-[#34d399]/30">
                <span className="font-mono font-semibold text-[#34d399] uppercase tracking-wider text-[11px] block mb-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  Skills You Have ({skillMatch.matchedSkills.length})
                </span>
                {skillMatch.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skillMatch.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30 rounded-[4px] font-mono text-xs"
                      >
                        <Check className="w-3 h-3 text-[#34d399] shrink-0" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#71717a] italic">
                    None of the required skills currently match your profile.
                  </p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="p-3.5 rounded-[8px] bg-[#121215] border border-[#27272a]">
                <span className="font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider text-[11px] block mb-2 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#71717a]" />
                  Skills to Learn ({skillMatch.missingSkills.length})
                </span>
                {skillMatch.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skillMatch.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-[#0c0c0f] text-[#a1a1aa] border border-[#27272a] rounded-[4px] font-mono text-xs hover:border-[#3f3f46] hover:text-[#fafafa] transition-colors"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-[#34d399]">
                    100% of required skills matched!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. THE 6-POINT RISK CHECKLIST AUDIT (UNIQUE FEATURE) */}
          {/* ======================================================== */}
          <div
            className={`p-5 rounded-[8px] border ${
              isHighRisk
                ? 'bg-[#ef4444]/10 border-[#ef4444]/40'
                : isMediumRisk
                ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40'
                : 'bg-[#34d399]/10 border-[#34d399]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isHighRisk && <ShieldAlert className="w-5 h-5 text-[#ef4444]" />}
                {isMediumRisk && <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />}
                {isLowRisk && <ShieldCheck className="w-5 h-5 text-[#34d399]" />}
                <h3 className="font-bold text-[#fafafa] text-base tracking-tight">
                  InternSafe 6-Point Risk Checklist Audit
                </h3>
              </div>
              <RiskBadge level={internship.riskScore} size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-[#a1a1aa] mb-4 leading-relaxed font-mono">
              {audit.overallSummary}
            </p>

            {/* Itemized 6 Checks List */}
            <div className="space-y-3">
              {audit.criteria.map((crit, idx) => (
                <div
                  key={crit.id}
                  className={`p-3.5 rounded-[8px] border transition-all ${
                    crit.isTriggered
                      ? crit.severity === 'high'
                        ? 'border-[#ef4444]/50 bg-[#0c0c0f]'
                        : 'border-[#f59e0b]/50 bg-[#0c0c0f]'
                      : 'border-[#27272a] bg-[#0c0c0f]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {crit.isTriggered ? (
                        <AlertOctagon className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-[#fafafa] text-xs sm:text-sm">
                            {idx + 1}. {crit.title}
                          </h4>
                          {crit.isTriggered ? (
                            <span
                              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[4px] ${
                                crit.severity === 'high'
                                  ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                                  : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40'
                              }`}
                            >
                              TRIGGERED ({crit.severity.toUpperCase()} RISK)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-[4px] bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30">
                              PASSED (SAFE)
                            </span>
                          )}
                        </div>

                        {/* Evidence or Status */}
                        <p className="text-xs text-[#a1a1aa] mt-1">
                          <span className="text-[#fafafa] font-mono text-[11px]">Assessment: </span>
                          {crit.evidenceText}
                        </p>

                        {/* Why this matters explanation */}
                        {crit.isTriggered && (
                          <div className="mt-2 p-2.5 bg-[#121215] rounded-[6px] border border-[#ef4444]/30 text-xs">
                            <span className="font-mono text-[#ef4444] block mb-0.5 flex items-center gap-1 text-[11px] font-semibold">
                              <HelpCircle className="w-3.5 h-3.5 text-[#ef4444]" /> Why this red flag matters:
                            </span>
                            <p className="text-[#a1a1aa] leading-normal">
                              {crit.whyItMatters}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RECRUITER & COMPANY CREDENTIAL AUDIT */}
          {/* ======================================================== */}
          <div className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-3">
              Recruiter & Domain Verification Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                <Mail className="w-4 h-4 text-[#71717a] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[#71717a] block text-[10px] font-mono">Recruiter Contact</span>
                  <span className="font-mono text-[#fafafa] truncate block">
                    {internship.verification.recruiterEmail}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                <Globe className="w-4 h-4 text-[#71717a] shrink-0" />
                <div>
                  <span className="text-[#71717a] block text-[10px] font-mono">Company Website</span>
                  {internship.verification.hasWebsite ? (
                    <a
                      href={internship.verification.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a78bfa] hover:underline inline-flex items-center gap-1 font-mono"
                    >
                      {internship.verification.websiteUrl?.replace('https://', '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#ef4444] font-mono">No verifiable website</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                <Linkedin className="w-4 h-4 text-[#71717a] shrink-0" />
                <div>
                  <span className="text-[#71717a] block text-[10px] font-mono">Company LinkedIn</span>
                  {internship.verification.hasLinkedIn ? (
                    <span className="text-[#34d399] font-mono">Verified Profile</span>
                  ) : (
                    <span className="text-[#ef4444] font-mono">No LinkedIn Presence</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                <MessageSquare className="w-4 h-4 text-[#71717a] shrink-0" />
                <div>
                  <span className="text-[#71717a] block text-[10px] font-mono">Communication Channel</span>
                  <span
                    className={`font-mono ${
                      internship.verification.communicationChannel.includes('WhatsApp')
                        ? 'text-[#ef4444]'
                        : 'text-[#fafafa]'
                    }`}
                  >
                    {internship.verification.communicationChannel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Responsibilities */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-2">
              Role Description
            </h4>
            <p className="text-[#a1a1aa] leading-relaxed text-sm">
              {internship.description}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#a1a1aa] text-sm">
              {internship.responsibilities.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions: Track Application, Report & Apply */}
        <div className="p-4 bg-[#0c0c0f] border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Quick Application Tracker Status Selector */}
            {onUpdateStatus && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#71717a] hidden sm:inline">
                  Tracker Stage:
                </span>
                <select
                  value={applicationStatus || 'none'}
                  onChange={(e) => {
                    if (e.target.value === 'none') {
                      onUpdateStatus(internship.id, 'Saved');
                    } else {
                      onUpdateStatus(internship.id, e.target.value as ApplicationStatus);
                    }
                  }}
                  className="py-1.5 px-3 bg-[#121215] border border-[#27272a] rounded-[6px] text-xs font-mono text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
                >
                  <option value="none">Add to Tracker</option>
                  <option value="Saved">Saved (Considering)</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}

            {/* Report Button */}
            {onReport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReport(internship);
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-[6px] border transition-colors ${
                  isReported
                    ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40'
                    : 'bg-transparent text-[#71717a] hover:text-[#ef4444] hover:border-[#ef4444]/40 border-[#27272a]'
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-[#ef4444]" />
                {isReported ? 'Reported' : 'Report Listing'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] rounded-[8px] transition-colors"
            >
              Close
            </button>

            {isHighRisk ? (
              <button
                type="button"
                onClick={() => {
                  alert(
                    'SECURITY NOTICE: InternSafe flags this listing as High Risk. We strongly advise against paying fees or communicating outside official platforms.'
                  );
                }}
                className="px-5 py-2 text-xs sm:text-sm font-semibold bg-[#ef4444] hover:bg-[#dc2626] text-[#fafafa] rounded-[8px] transition-colors flex items-center gap-1.5 font-mono"
              >
                <ShieldAlert className="w-4 h-4" />
                Proceed with Caution
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onUpdateStatus && (!applicationStatus || applicationStatus === 'Saved')) {
                    onUpdateStatus(internship.id, 'Applied');
                  }
                  alert(
                    `Applied to ${internship.title} at ${internship.company}! Application has been moved to "Applied" in your Tracker.`
                  );
                }}
                className="px-5 py-2 text-xs sm:text-sm font-semibold bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] rounded-[8px] transition-colors flex items-center gap-1.5"
              >
                Apply via Official Portal
                <ArrowRight className="w-4 h-4 text-[#09090b]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
