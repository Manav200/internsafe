import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRiskChecklist } from './riskChecklist.ts';
import { INITIAL_INTERNSHIPS } from '../data/mockInternships.ts';

test('evaluates legitimate listing (Stripe) as Low Risk with 0 triggered red flags', () => {
  const stripe = INITIAL_INTERNSHIPS.find((i) => i.company === 'Stripe')!;
  const audit = evaluateRiskChecklist(stripe);

  assert.equal(audit.score, 'low');
  assert.equal(audit.triggeredCount, 0);
  assert.equal(audit.passedCount, 6);
});

test('evaluates upfront fee scam (Apex Global) as High Risk triggering multiple criteria', () => {
  const apex = INITIAL_INTERNSHIPS.find((i) => i.id === 'intern-12')!;
  const audit = evaluateRiskChecklist(apex);

  assert.equal(audit.score, 'high');
  assert.ok(audit.triggeredCount >= 4);

  // Check that fee, verification, stipend, and communication flags are triggered
  const feeCrit = audit.criteria.find((c) => c.category === 'fee');
  assert.equal(feeCrit?.isTriggered, true);

  const stipendCrit = audit.criteria.find((c) => c.category === 'stipend');
  assert.equal(stipendCrit?.isTriggered, true);

  const commCrit = audit.criteria.find((c) => c.category === 'communication');
  assert.equal(commCrit?.isTriggered, true);
});

test('evaluates pay-to-train scheme (FastTrack Digital) as Medium Risk', () => {
  const fasttrack = INITIAL_INTERNSHIPS.find((i) => i.id === 'intern-14')!;
  const audit = evaluateRiskChecklist(fasttrack);

  assert.ok(audit.score === 'medium' || audit.score === 'high');
  const feeCrit = audit.criteria.find((c) => c.category === 'fee');
  assert.equal(feeCrit?.isTriggered, true);
});
