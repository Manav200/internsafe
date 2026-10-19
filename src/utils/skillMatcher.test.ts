import test from 'node:test';
import assert from 'node:assert/strict';
import { computeSkillMatch, getSkillMatchColor } from './skillMatcher.ts';

test('computes 100% skill match when all skills match (case-insensitive)', () => {
  const studentSkills = ['React', 'TypeScript', 'Tailwind CSS'];
  const requiredSkills = ['react', 'TYPESCRIPT', 'tailwind css'];

  const result = computeSkillMatch(studentSkills, requiredSkills);
  assert.equal(result.matchPercentage, 100);
  assert.equal(result.matchedSkills.length, 3);
  assert.equal(result.missingSkills.length, 0);
});

test('computes correct partial match and lists missing skills', () => {
  const studentSkills = ['Python', 'SQL'];
  const requiredSkills = ['Python', 'Pandas', 'PyTorch', 'SQL'];

  const result = computeSkillMatch(studentSkills, requiredSkills);
  assert.equal(result.matchPercentage, 50);
  assert.deepEqual(result.matchedSkills, ['Python', 'SQL']);
  assert.deepEqual(result.missingSkills, ['Pandas', 'PyTorch']);
});

test('handles 0% match when student has no overlapping skills', () => {
  const studentSkills = ['Figma', 'UI/UX'];
  const requiredSkills = ['Docker', 'Kubernetes', 'Linux'];

  const result = computeSkillMatch(studentSkills, requiredSkills);
  assert.equal(result.matchPercentage, 0);
  assert.equal(result.matchedSkills.length, 0);
  assert.equal(result.missingSkills.length, 3);
});

test('provides correct visual labels for percentages', () => {
  assert.equal(getSkillMatchColor(80).label, 'Great Match');
  assert.equal(getSkillMatchColor(50).label, 'Moderate Match');
  assert.equal(getSkillMatchColor(25).label, 'Partial Match');
  assert.equal(getSkillMatchColor(0).label, 'No Match');
});
