import React from 'react';
import {
  MapPin,
  Briefcase,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Bookmark,
  Flag,
} from 'lucide-react';
import type { Internship, ApplicationStatus } from '../types/internship.ts';
import { RiskBadge } from './RiskBadge.tsx';
import { SkillMatchBadge } from './SkillMatchBadge.tsx';

interface InternshipCardProps {
  internship: Internship;
  studentSkills: string[];
  applicationStatus?: ApplicationStatus;
  isReported?: boolean;
  onSelect: (internship: Internship) => void;
  onSkillClick?: (skill: string) => void;
  onToggleSave?: (internship: Internship) => void;
  onReport?: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  studentSkills,
  applicationStatus,
  isReported,
  onSelect,
  onSkillClick,
  onToggleSave,
  onReport,
}) => {
  const getWorkModeLabel = (mode: string) => {
    switch (mode) {
      case 'wfh':
        return 'Remote (WFH)';
      case 'offline':
        return 'In-Office';
      case 'hybrid':
        return 'Hybrid';
      default:
        return mode;
    }
  };

  const hasHighRisk = internship.riskScore === 'high';
  const hasMediumRisk = internship.riskScore === 'medium';

  return (
    <article
      className={`group relative bg-[#121215] rounded-[8px] border transition-all duration-150 flex flex-col justify-between overflow-hidden ${
        hasHighRisk
          ? 'border-[#ef4444]/50 hover:border-[#ef4444]'
          : hasMediumRisk
          ? 'border-[#f59e0b]/50 hover:border-[#f59e0b]'
          : 'border-[#27272a] hover:border-[#3f3f46] hover:bg-[#18181b]'
      }`}
    >
      {/* Top Warning Banner for High Risk Listings */}
      {hasHighRisk && (
        <div className="bg-[#ef4444]/15 border-b border-[#ef4444]/30 text-[#f87171] px-4 py-1.5 text-xs font-mono font-medium flex items-center justify-between tracking-tight">
          <span className="flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-[#ef4444]" />
            RISK ALERT: Potential Advance-Fee Student Scam
          </span>
          <span className="text-[11px] text-[#ef4444] uppercase tracking-wider font-semibold">
            Zero Fees Allowed
          </span>
        </div>
      )}

      {hasMediumRisk && (
        <div className="bg-[#f59e0b]/15 border-b border-[#f59e0b]/30 text-[#fbbf24] px-4 py-1 text-xs font-mono flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-[#f59e0b]" />
          <span>CAUTION: Review hiring terms & corporate domain</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header: Company, Location, and Quick Action Buttons */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[8px] bg-[#18181b] border border-[#27272a] text-[#fafafa] font-mono font-bold text-sm flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {internship.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-[#fafafa] text-sm sm:text-base leading-tight tracking-tight">
                    {internship.company}
                  </h3>
                  {internship.verification.hasCorporateEmail && (
                    <span
                      title="Verified corporate domain"
                      className="text-[#34d399] inline-flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-[#34d399]/20" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#71717a] shrink-0" />
                    {internship.location}
                  </span>
                  <span className="text-[#3f3f46]">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#71717a] shrink-0" />
                    {getWorkModeLabel(internship.workMode)}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right: Risk Badge & Bookmark / Report */}
            <div className="flex items-center gap-1.5 shrink-0">
              <RiskBadge level={internship.riskScore} size="sm" />

              {/* Bookmark to Application Tracker Button */}
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(internship)}
                  className={`p-1.5 rounded-[6px] border transition-all ${
                    applicationStatus
                      ? 'bg-[#a78bfa]/15 border-[#a78bfa]/40 text-[#a78bfa]'
                      : 'bg-transparent border-[#27272a] text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46]'
                  }`}
                  title={
                    applicationStatus
                      ? `Tracked (${applicationStatus}) - click to change`
                      : 'Save to Application Tracker'
                  }
                  aria-label="Save to application tracker"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${applicationStatus ? 'fill-[#a78bfa]' : ''}`}
                  />
                </button>
              )}

              {/* Report Flag Button */}
              {onReport && (
                <button
                  type="button"
                  onClick={() => onReport(internship)}
                  className={`p-1.5 rounded-[6px] border transition-all ${
                    isReported
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]'
                      : 'bg-transparent border-[#27272a] text-[#71717a] hover:text-[#ef4444] hover:border-[#ef4444]/40'
                  }`}
                  title={isReported ? 'You reported this listing' : 'Report suspicious listing'}
                  aria-label="Report listing"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Job Title */}
          <h4 className="text-base font-semibold text-[#fafafa] mb-2.5 tracking-tight group-hover:text-[#a78bfa] transition-colors">
            {internship.title}
          </h4>

          {/* Stipend & Key Meta Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-mono font-medium ${
                internship.compensationType === 'paid'
                  ? 'bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30'
                  : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
              }`}
            >
              <DollarSign className="w-3 h-3 text-[#34d399]" />
              {internship.stipend}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-mono text-[#a1a1aa] bg-[#0c0c0f] border border-[#27272a]">
              <Calendar className="w-3 h-3 text-[#71717a]" />
              {internship.duration}
            </span>

            {/* Tracker status pill if tracked */}
            {applicationStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/40">
                Stage: {applicationStatus}
              </span>
            )}

            {isReported && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-medium bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/40">
                Reported
              </span>
            )}
          </div>

          {/* Job Description Excerpt */}
          <p className="text-xs sm:text-sm text-[#a1a1aa] line-clamp-2 mb-4 leading-relaxed">
            {internship.description}
          </p>

          {/* Red Flag Warning Box on Card */}
          {internship.triggeredFlags.length > 0 ? (
            <div
              className={`p-3 rounded-[8px] mb-4 text-xs font-mono ${
                hasHighRisk
                  ? 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#f87171]'
                  : 'bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#fbbf24]'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5 text-[#ef4444]" />
                {internship.triggeredFlags.length} Red Flag
                {internship.triggeredFlags.length > 1 ? 's' : ''} Detected:
              </div>
              <ul className="space-y-1 list-disc list-inside text-xs">
                {internship.triggeredFlags.slice(0, 2).map((flag) => (
                  <li key={flag.id} className="line-clamp-1">
                    {flag.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-2.5 rounded-[8px] mb-4 text-xs bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
              <span className="line-clamp-1 text-[11px] font-mono">
                Verified recruiter domain • Zero upfront fees • Standard process
              </span>
            </div>
          )}

          {/* Core Feature: Skill Matching Component */}
          <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] mb-3">
            <SkillMatchBadge
              studentSkills={studentSkills}
              requiredSkills={internship.requiredSkills}
            />
          </div>
        </div>

        {/* Card Footer: Deadline & Action */}
        <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-[#71717a]">
            Apply by <strong className="text-[#fafafa] font-normal">{internship.deadline}</strong>
          </div>

          <button
            type="button"
            onClick={() => onSelect(internship)}
            className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-[6px] border transition-all ${
              hasHighRisk
                ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40 hover:bg-[#ef4444]/25'
                : 'bg-[#18181b] text-[#fafafa] border-[#27272a] hover:border-[#a78bfa] hover:text-[#a78bfa]'
            }`}
          >
            Audit Risk & Details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
