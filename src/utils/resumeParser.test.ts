import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBestFitRankings,
  findTopSkillGapOpportunities,
  getSampleResumeData,
} from './resumeParser.ts';
import { INITIAL_INTERNSHIPS } from '../data/mockInternships.ts';

test('ranks internships with highest skill match first', () => {
  const sampleSkills = ['React', 'TypeScript', 'Tailwind CSS', 'Git'];
  const rankings = calculateBestFitRankings(INITIAL_INTERNSHIPS, sampleSkills);

  assert.ok(rankings.length === INITIAL_INTERNSHIPS.length);
  // Stripe requires: React, TypeScript, Tailwind CSS, Next.js, Git -> 4 of 5 = 80%
  assert.equal(rankings[0].internship.company, 'Stripe');
  assert.equal(rankings[0].matchPercentage, 80);
  assert.ok(rankings[0].reason.includes('Matches 4 of 5'));

  // Ensure sorted descending
  for (let i = 0; i < rankings.length - 1; i++) {
    assert.ok(rankings[i].matchPercentage >= rankings[i + 1].matchPercentage);
  }
});

test('identifies top 2-3 missing skills that unlock the most opportunities', () => {
  // If student only knows React and Git
  const studentSkills = ['React', 'Git'];
  const suggestions = findTopSkillGapOpportunities(INITIAL_INTERNSHIPS, studentSkills, 3);

  assert.equal(suggestions.length, 3);
  assert.ok(suggestions[0].count > 0);
  assert.ok(suggestions[0].unlockedInternshipTitles.length > 0);
  // Python is heavily required across mock listings (data science, devops, cybersecurity)
  assert.ok(suggestions.some((s) => s.skill === 'Python' || s.skill === 'TypeScript'));
});

test('provides valid sample resume data structure', () => {
  const sample = getSampleResumeData();
  assert.ok(sample.skills.length >= 8);
  assert.ok(sample.education.length > 0);
  assert.ok(sample.projects.length > 0);
  assert.ok(sample.summary);
});
