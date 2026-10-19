import type {
  Internship,
  ResumeParsedData,
  SkillGapOpportunity,
} from '../types/internship.ts';
import { computeSkillMatch } from './skillMatcher.ts';

export interface RankedInternshipFit {
  internship: Internship;
  matchPercentage: number;
  matchedCount: number;
  totalRequired: number;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
}

/**
 * Pure function: Ranks internships by skill match and generates a clear one-line reason
 */
export function calculateBestFitRankings(
  internships: Internship[],
  studentSkills: string[]
): RankedInternshipFit[] {
  const ranked = internships.map((internship) => {
    const match = computeSkillMatch(studentSkills, internship.requiredSkills);

    let reason = '';
    if (match.matchPercentage === 100) {
      reason = `Perfect match: You have all ${match.totalRequired} required skills (${match.matchedSkills.join(', ')})`;
    } else if (match.matchedSkills.length > 0) {
      const missingPreview = match.missingSkills.slice(0, 2).join(', ');
      reason = `Matches ${match.matchedSkills.length} of ${match.totalRequired} required skills (${match.matchedSkills.join(', ')})${
        match.missingSkills.length > 0 ? ` • Learn: ${missingPreview}` : ''
      }`;
    } else {
      const needPreview = internship.requiredSkills.slice(0, 3).join(', ');
      reason = `0 of ${match.totalRequired} skills matched • Requires ${needPreview}`;
    }

    return {
      internship,
      matchPercentage: match.matchPercentage,
      matchedCount: match.matchedSkills.length,
      totalRequired: match.totalRequired,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      reason,
    };
  });

  // Sort by match percentage descending, then title
  return ranked.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.internship.title.localeCompare(b.internship.title);
  });
}

/**
 * Pure function: Discovers 2-3 high-impact skills the student should learn to unlock more opportunities
 */
export function findTopSkillGapOpportunities(
  internships: Internship[],
  studentSkills: string[],
  limit: number = 3
): SkillGapOpportunity[] {
  const studentSet = new Set(studentSkills.map((s) => s.trim().toLowerCase()));
  const missingFrequency = new Map<string, { count: number; titles: string[] }>();

  internships.forEach((item) => {
    item.requiredSkills.forEach((skill) => {
      const norm = skill.trim().toLowerCase();
      if (!studentSet.has(norm)) {
        const existing = missingFrequency.get(skill) || { count: 0, titles: [] };
        existing.count += 1;
        if (!existing.titles.includes(item.title)) {
          existing.titles.push(item.title);
        }
        missingFrequency.set(skill, existing);
      }
    });
  });

  return Array.from(missingFrequency.entries())
    .map(([skill, data]) => ({
      skill,
      count: data.count,
      unlockedInternshipTitles: data.titles,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Realistic sample resume for one-click testing
 */
export function getSampleResumeData(): ResumeParsedData {
  return {
    skills: [
      'React',
      'JavaScript',
      'TypeScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Node.js',
      'Git',
      'GitHub',
      'REST APIs',
      'UI/UX Prototyping',
      'Figma',
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        school: 'University of California, Berkeley',
        year: '2023 - 2027 (Expected)',
      },
    ],
    projects: [
      {
        title: 'Campus Pulse - Student Event Hub',
        description: 'Built a responsive React & Tailwind web app allowing student clubs to publish verified campus workshops.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
      },
      {
        title: 'AlgoVisualizer',
        description: 'Interactive sorting algorithm visualizer with step-by-step playback.',
        techStack: ['JavaScript', 'Canvas API', 'CSS Grid'],
      },
    ],
    experience: [
      {
        role: 'Undergraduate Teaching Assistant (CS61A)',
        company: 'UC Berkeley EECS Dept',
        duration: 'Jan 2026 - Present',
        highlights: [
          'Held weekly lab sections assisting 35+ students in Python and data abstraction fundamentals.',
          'Graded programming problem sets and helped debug student code.',
        ],
      },
    ],
    summary: 'Proactive sophomore computer science student skilled in modern web development with React and TypeScript, passionate about developer tooling and accessible UI design.',
    extractedAt: new Date().toISOString(),
    fileName: 'Alex_Chen_Tech_Resume_2026.pdf',
  };
}
