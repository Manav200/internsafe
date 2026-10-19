import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDeadlineStatus,
  getStatusCounts,
  getUrgentDeadlineReminders,
} from './tracker.ts';
import type { ApplicationRecord } from '../types/internship.ts';

test('calculates urgent deadline for 2 days remaining', () => {
  const mockNow = new Date('2026-10-19T00:00:00');
  const deadline = '2026-10-21';

  const status = calculateDeadlineStatus(deadline, mockNow);
  assert.equal(status.isExpired, false);
  assert.equal(status.urgency, 'urgent');
  assert.ok(status.label.includes('2 days left'));
});

test('identifies expired deadline properly', () => {
  const mockNow = new Date('2026-10-19T00:00:00');
  const deadline = '2026-10-15';

  const status = calculateDeadlineStatus(deadline, mockNow);
  assert.equal(status.isExpired, true);
  assert.equal(status.urgency, 'expired');
  assert.equal(status.label, 'Deadline Passed');
});

test('calculates counts across application statuses', () => {
  const sampleApps: ApplicationRecord[] = [
    { id: '1', internshipId: 'i1', status: 'Saved', deadline: '2026-11-01', updatedAt: '' },
    { id: '2', internshipId: 'i2', status: 'Applied', deadline: '2026-11-05', updatedAt: '' },
    { id: '3', internshipId: 'i3', status: 'Interview', deadline: '2026-11-10', updatedAt: '' },
    { id: '4', internshipId: 'i4', status: 'Offer', deadline: '2026-11-15', updatedAt: '' },
  ];

  const counts = getStatusCounts(sampleApps);
  assert.equal(counts.all, 4);
  assert.equal(counts.Saved, 1);
  assert.equal(counts.Applied, 1);
  assert.equal(counts.Interview, 1);
  assert.equal(counts.Offer, 1);
  assert.equal(counts.Rejected, 0);
});

test('filters active urgent deadline reminders', () => {
  const mockNow = new Date('2026-10-19T00:00:00');
  const sampleApps: ApplicationRecord[] = [
    { id: '1', internshipId: 'i1', status: 'Saved', deadline: '2026-10-21', updatedAt: '' }, // urgent (2 days)
    { id: '2', internshipId: 'i2', status: 'Applied', deadline: '2026-10-24', updatedAt: '' }, // soon (5 days)
    { id: '3', internshipId: 'i3', status: 'Interview', deadline: '2026-10-20', updatedAt: '' }, // Interview (not pending apply)
    { id: '4', internshipId: 'i4', status: 'Saved', deadline: '2026-11-30', updatedAt: '' }, // far
  ];

  const urgent = getUrgentDeadlineReminders(sampleApps, mockNow);
  assert.equal(urgent.length, 2);
  assert.equal(urgent[0].id, '1');
  assert.equal(urgent[1].id, '2');
});
