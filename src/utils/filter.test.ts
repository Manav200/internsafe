import test from 'node:test';
import assert from 'node:assert/strict';
import { filterInternships, calculateRiskSummaryCounts, getTopSkills } from './filter.ts';
import { INITIAL_INTERNSHIPS } from '../data/mockInternships.ts';
import type { FilterState } from '../types/internship.ts';

const baseFilters: FilterState = {
  searchQuery: '',
  locationQuery: '',
  workMode: 'all',
  compensation: 'all',
  riskLevel: 'all',
};

test('filters return all 15 internships with base empty filters', () => {
  const result = filterInternships(INITIAL_INTERNSHIPS, baseFilters);
  assert.equal(result.length, 15);
});

test('filters correctly by text search keyword for title or company', () => {
  const stripeResult = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    searchQuery: 'Stripe',
  });
  assert.equal(stripeResult.length, 1);
  assert.equal(stripeResult[0].company, 'Stripe');

  const pythonResult = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    searchQuery: 'Python',
  });
  assert.ok(pythonResult.length >= 4);
});

test('filters correctly by work mode: wfh, offline, hybrid', () => {
  const wfhResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    workMode: 'wfh',
  });
  assert.ok(wfhResults.every((item) => item.workMode === 'wfh'));
  assert.ok(wfhResults.length >= 5);

  const offlineResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    workMode: 'offline',
  });
  assert.ok(offlineResults.every((item) => item.workMode === 'offline'));
});

test('filters correctly by compensation: paid vs unpaid', () => {
  const paidResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    compensation: 'paid',
  });
  assert.ok(paidResults.every((item) => item.compensationType === 'paid'));
  assert.equal(paidResults.length, 13);

  const unpaidResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    compensation: 'unpaid',
  });
  assert.ok(unpaidResults.every((item) => item.compensationType === 'unpaid'));
  assert.equal(unpaidResults.length, 2);
});

test('filters correctly by risk level: low, medium, high', () => {
  const highRiskResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    riskLevel: 'high',
  });
  assert.equal(highRiskResults.length, 2);
  assert.ok(highRiskResults.every((item) => item.riskScore === 'high'));

  const mediumRiskResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    riskLevel: 'medium',
  });
  assert.equal(mediumRiskResults.length, 2);
  assert.ok(mediumRiskResults.every((item) => item.riskScore === 'medium'));

  const lowRiskResults = filterInternships(INITIAL_INTERNSHIPS, {
    ...baseFilters,
    riskLevel: 'low',
  });
  assert.equal(lowRiskResults.length, 11);
  assert.ok(lowRiskResults.every((item) => item.riskScore === 'low'));
});

test('calculates correct summary counts across all 15 listings', () => {
  const counts = calculateRiskSummaryCounts(INITIAL_INTERNSHIPS);
  assert.equal(counts.total, 15);
  assert.equal(counts.low, 11);
  assert.equal(counts.medium, 2);
  assert.equal(counts.high, 2);
});

test('extracts top required skills', () => {
  const top = getTopSkills(INITIAL_INTERNSHIPS, 5);
  assert.ok(top.length <= 5);
  assert.ok(top.includes('Python') || top.includes('React'));
});
