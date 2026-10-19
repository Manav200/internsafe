import React from 'react';
import { Check, Plus, Target } from 'lucide-react';
import { computeSkillMatch, getSkillMatchColor } from '../utils/skillMatcher.ts';

interface SkillMatchBadgeProps {
  studentSkills: string[];
  requiredSkills: string[];
  compact?: boolean;
}

export const SkillMatchBadge: React.FC<SkillMatchBadgeProps> = ({
  studentSkills,
  requiredSkills,
  compact = false,
}) => {
  const result = computeSkillMatch(studentSkills, requiredSkills);
  const color = getSkillMatchColor(result.matchPercentage);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-semibold border ${color.badgeBg} ${color.badgeText} ${color.border} font-mono`}
        title={`${result.matchedSkills.length} of ${result.totalRequired} required skills match your profile`}
      >
        <Target className="w-3.5 h-3.5 text-[#a78bfa]" />
        <span>{result.matchPercentage}% Match</span>
      </span>
    );
  }

  return (
    <div className="space-y-2">
      {/* Percentage Bar & Label */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#fafafa] flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-[#a78bfa]" />
          Skill Match
        </span>
        <span className={`font-mono font-semibold px-2 py-0.5 rounded-[4px] border ${color.badgeBg} ${color.badgeText} ${color.border}`}>
          {result.matchPercentage}% ({result.matchedSkills.length}/{result.totalRequired})
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#18181b] border border-[#27272a] rounded-full overflow-hidden">
        <div
          className={`h-full ${color.progressBar} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.max(result.matchPercentage, 4)}%` }}
        />
      </div>

      {/* Matched vs Missing Skill Chips */}
      <div className="flex flex-wrap items-center gap-1 text-[11px] pt-1">
        {result.matchedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30 font-medium"
            title="You have this skill in your profile"
          >
            <Check className="w-3 h-3 text-[#34d399]" />
            {skill}
          </span>
        ))}

        {result.missingSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#0c0c0f] text-[#a1a1aa] border border-[#27272a] font-normal hover:border-[#3f3f46] hover:text-[#fafafa] transition-colors"
            title="Skill not in your profile (skill to learn)"
          >
            <Plus className="w-2.5 h-2.5 text-[#71717a]" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
