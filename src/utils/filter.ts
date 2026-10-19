import type { FilterState, Internship, RiskLevel } from '../types/internship.ts';

/**
 * Pure function to filter internships by search query, location, work mode, compensation, and risk level.
 */
export function filterInternships(
  internships: Internship[],
  filters: FilterState,
  studentSkills?: string[]
): Internship[] {
  const query = filters.searchQuery.trim().toLowerCase();
  const locationQ = filters.locationQuery.trim().toLowerCase();

  const filtered = internships.filter((item) => {
    // 1. Text Search (Matches title, company, requiredSkills, or description)
    if (query) {
      const titleMatch = item.title.toLowerCase().includes(query);
      const companyMatch = item.company.toLowerCase().includes(query);
      const skillMatch = item.requiredSkills.some((s) => s.toLowerCase().includes(query));
      const descMatch = item.description.toLowerCase().includes(query);

      if (!titleMatch && !companyMatch && !skillMatch && !descMatch) {
        return false;
      }
    }

    // 2. Location Search
    if (locationQ) {
      const locMatch = item.location.toLowerCase().includes(locationQ);
      const wfhMatch = locationQ.includes('remote') || locationQ.includes('wfh') 
        ? item.workMode === 'wfh' || item.location.toLowerCase().includes('remote')
        : false;

      if (!locMatch && !wfhMatch) {
        return false;
      }
    }

    // 3. Work Mode Filter ('all' | 'wfh' | 'offline' | 'hybrid')
    if (filters.workMode !== 'all' && item.workMode !== filters.workMode) {
      return false;
    }

    // 4. Compensation Filter ('all' | 'paid' | 'unpaid')
    if (filters.compensation !== 'all' && item.compensationType !== filters.compensation) {
      return false;
    }

    // 5. Risk Level Filter ('all' | 'low' | 'medium' | 'high')
    if (filters.riskLevel !== 'all' && item.riskScore !== filters.riskLevel) {
      return false;
    }

    // 6. Selected Skill (Optional specific skill tag filter)
    if (filters.selectedSkill) {
      const targetSkill = filters.selectedSkill.toLowerCase();
      const hasSkill = item.requiredSkills.some((s) => s.toLowerCase() === targetSkill);
      if (!hasSkill) {
        return false;
      }
    }

    return true;
  });

  // Apply Sorting
  if (filters.sortBy === 'skillMatch' && studentSkills && studentSkills.length > 0) {
    const studentSet = new Set(studentSkills.map((s) => s.toLowerCase()));
    filtered.sort((a, b) => {
      const matchA = a.requiredSkills.filter((s) => studentSet.has(s.toLowerCase())).length / a.requiredSkills.length;
      const matchB = b.requiredSkills.filter((s) => studentSet.has(s.toLowerCase())).length / b.requiredSkills.length;
      return matchB - matchA;
    });
  } else if (filters.sortBy === 'deadline') {
    filtered.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }

  return filtered;
}

/**
 * Get distribution metrics for dashboard/filter pills
 */
export function calculateRiskSummaryCounts(internships: Internship[]): {
  total: number;
  low: number;
  medium: number;
  high: number;
} {
  return internships.reduce(
    (acc, curr) => {
      acc.total += 1;
      if (curr.riskScore === 'low') acc.low += 1;
      else if (curr.riskScore === 'medium') acc.medium += 1;
      else if (curr.riskScore === 'high') acc.high += 1;
      return acc;
    },
    { total: 0, low: 0, medium: 0, high: 0 }
  );
}

/**
 * Extract unique top skills across all internships
 */
export function getTopSkills(internships: Internship[], limit = 12): string[] {
  const counts: Record<string, number> = {};
  internships.forEach((item) => {
    item.requiredSkills.forEach((skill) => {
      counts[skill] = (counts[skill] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([skill]) => skill);
}
