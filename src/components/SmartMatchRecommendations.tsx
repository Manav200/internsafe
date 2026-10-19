import React from 'react';
import {
  Sparkles,
  Target,
  ChevronRight,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import type { Internship, SkillGapOpportunity } from '../types/internship.ts';
import {
  calculateBestFitRankings,
  findTopSkillGapOpportunities,
  RankedInternshipFit,
} from '../utils/resumeParser.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface SmartMatchRecommendationsProps {
  internships: Internship[];
  studentSkills: string[];
  onSelectInternship: (internship: Internship) => void;
  onAddSkillSuggestion: (skill: string) => void;
}

export const SmartMatchRecommendations: React.FC<SmartMatchRecommendationsProps> = ({
  internships,
  studentSkills,
  onSelectInternship,
  onAddSkillSuggestion,
}) => {
  const rankings: RankedInternshipFit[] = React.useMemo(() => {
    return calculateBestFitRankings(internships, studentSkills);
  }, [internships, studentSkills]);

  const topOpportunities: SkillGapOpportunity[] = React.useMemo(() => {
    return findTopSkillGapOpportunities(internships, studentSkills, 3);
  }, [internships, studentSkills]);

  return (
    <div className="space-y-6">
      {/* 1. Skill Gap Recommendations: 2-3 High-Impact Skills to Learn */}
      {topOpportunities.length > 0 && (
        <div className="bg-[#121215] text-[#fafafa] rounded-[8px] p-6 border border-[#27272a]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[6px] bg-[#f59e0b]/15 text-[#fbbf24] flex items-center justify-center shrink-0 border border-[#f59e0b]/30">
                <Lightbulb className="w-4 h-4 text-[#fbbf24]" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#fafafa] tracking-tight">
                  High-Impact Skill Gap Recommendations
                </h3>
                <p className="text-xs font-mono text-[#a1a1aa]">
                  Mastering these 3 skills qualifies you for the highest volume of additional vetted listings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {topOpportunities.map((gap) => (
              <div
                key={gap.skill}
                className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex flex-col justify-between hover:border-[#3f3f46] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-[#fafafa] text-sm">
                      {gap.skill}
                    </span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
                      +{gap.count} listing{gap.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed mb-3 font-mono">
                    Required by <strong className="text-[#fafafa] font-normal">{gap.unlockedInternshipTitles.slice(0, 2).join(', ')}</strong>
                    {gap.unlockedInternshipTitles.length > 2 ? '...' : '.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddSkillSuggestion(gap.skill)}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-[6px] bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#a78bfa] text-xs font-mono transition-all"
                >
                  <span>Already know this? Add to Skills</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a78bfa]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Best Fit For You: Ranked Internships by Match Score */}
      <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#fafafa] tracking-tight">
                Best Fit For You
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa]">
                All internships ranked by match percentage based on your profile skills
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-[#71717a]">
            Ranked across <strong className="text-[#fafafa] font-normal">{rankings.length}</strong> audited listings
          </div>
        </div>

        {/* Ranked Listings */}
        <div className="space-y-3">
          {rankings.map((fit, index) => {
            const isHighRisk = fit.internship.riskScore === 'high';
            const isTopMatch = fit.matchPercentage >= 70;

            return (
              <div
                key={fit.internship.id}
                className={`p-4 rounded-[8px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isTopMatch
                    ? 'bg-[#0c0c0f] border-[#34d399]/40 hover:border-[#34d399]'
                    : isHighRisk
                    ? 'bg-[#0c0c0f] border-[#ef4444]/40 hover:border-[#ef4444]'
                    : 'bg-[#0c0c0f] border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                {/* Left: Rank, Company Monogram, Title, Match Reason */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-6 h-6 rounded-[4px] bg-[#18181b] border border-[#27272a] text-[#71717a] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{index + 1}
                  </div>

                  <div className="w-9 h-9 rounded-[8px] bg-[#18181b] border border-[#27272a] text-[#fafafa] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {fit.internship.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-[#fafafa] text-sm leading-tight tracking-tight">
                        {fit.internship.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] mt-0.5">
                      <span className="text-[#a1a1aa]">{fit.internship.company}</span>
                      <span>•</span>
                      <span>{fit.internship.location}</span>
                      <span>•</span>
                      <span className="text-[#34d399]">{fit.internship.stipend}</span>
                    </div>

                    {/* One-line reason for match % */}
                    <div className="mt-2 text-xs font-mono text-[#a1a1aa] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                      <span>{fit.reason}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Match % Pill, Risk Badge, and View Details Button */}
                <div className="flex items-center justify-between md:justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#27272a] shrink-0">
                  {/* Match % */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-xs font-mono font-semibold border ${
                      fit.matchPercentage >= 75
                        ? 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/40'
                        : fit.matchPercentage >= 40
                        ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40'
                        : 'bg-[#18181b] text-[#71717a] border-[#27272a]'
                    }`}
                  >
                    {fit.matchPercentage}% Match
                  </span>

                  {/* Existing Risk Label (Low / Medium / High) */}
                  <RiskBadge level={fit.internship.riskScore} size="sm" />

                  {/* View Details Action */}
                  <button
                    type="button"
                    onClick={() => onSelectInternship(fit.internship)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#a78bfa] text-xs font-mono transition-all"
                  >
                    <span>Audit Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
