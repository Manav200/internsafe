export interface SkillMatchResult {
  matchPercentage: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  totalRequired: number;
}

/**
 * Computes skill match percentage and segregates matched vs missing skills
 */
export function computeSkillMatch(
  studentSkills: string[],
  requiredSkills: string[]
): SkillMatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
    };
  }

  // Normalize student skills for fast case-insensitive lookup
  const studentSkillSet = new Set(
    studentSkills.map((s) => s.trim().toLowerCase())
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((skill) => {
    const normalized = skill.trim().toLowerCase();
    if (studentSkillSet.has(normalized)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalRequired: requiredSkills.length,
  };
}

/**
 * Returns color classes based on match percentage
 */
export function getSkillMatchColor(percentage: number): {
  badgeBg: string;
  badgeText: string;
  border: string;
  progressBar: string;
  label: string;
} {
  if (percentage >= 75) {
    return {
      badgeBg: 'bg-[#34d399]/15',
      badgeText: 'text-[#34d399]',
      border: 'border-[#34d399]/40',
      progressBar: 'bg-[#34d399]',
      label: 'Great Match',
    };
  }
  if (percentage >= 40) {
    return {
      badgeBg: 'bg-[#a78bfa]/15',
      badgeText: 'text-[#a78bfa]',
      border: 'border-[#a78bfa]/40',
      progressBar: 'bg-[#a78bfa]',
      label: 'Moderate Match',
    };
  }
  if (percentage > 0) {
    return {
      badgeBg: 'bg-[#f59e0b]/15',
      badgeText: 'text-[#fbbf24]',
      border: 'border-[#f59e0b]/40',
      progressBar: 'bg-[#f59e0b]',
      label: 'Partial Match',
    };
  }
  return {
    badgeBg: 'bg-[#18181b]',
    badgeText: 'text-[#71717a]',
    border: 'border-[#27272a]',
    progressBar: 'bg-[#27272a]',
    label: 'No Match',
  };
}
