import type { ApplicationRecord, ApplicationStatus, Internship } from '../types/internship.ts';

export interface DeadlineStatus {
  daysRemaining: number;
  isExpired: boolean;
  urgency: 'urgent' | 'soon' | 'upcoming' | 'expired';
  label: string;
  badgeBg: string;
  badgeText: string;
  border: string;
}

/**
 * Calculates deadline proximity and provides human-friendly reminder labels and colors
 */
export function calculateDeadlineStatus(
  deadlineStr: string,
  currentDate: Date = new Date()
): DeadlineStatus {
  if (!deadlineStr) {
    return {
      daysRemaining: 999,
      isExpired: false,
      urgency: 'upcoming',
      label: 'No deadline specified',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-600',
      border: 'border-slate-200',
    };
  }

  // Parse YYYY-MM-DD
  const [year, month, day] = deadlineStr.split('-').map(Number);
  const targetMidnight = new Date(year, month - 1, day).getTime();
  const currentMidnight = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  ).getTime();

  const diffTime = targetMidnight - currentMidnight;
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      isExpired: true,
      urgency: 'expired',
      label: 'Deadline Passed',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-500',
      border: 'border-slate-300',
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      isExpired: false,
      urgency: 'urgent',
      label: 'Deadline Today!',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      border: 'border-rose-300',
    };
  }

  if (daysRemaining <= 3) {
    return {
      daysRemaining,
      isExpired: false,
      urgency: 'urgent',
      label: `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left!`,
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      border: 'border-rose-300',
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      isExpired: false,
      urgency: 'soon',
      label: `${daysRemaining} days left`,
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      border: 'border-amber-300',
    };
  }

  return {
    daysRemaining,
    isExpired: false,
    urgency: 'upcoming',
    label: `${daysRemaining} days left`,
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    border: 'border-emerald-200',
  };
}

/**
 * Returns grouped application counts by status
 */
export function getStatusCounts(applications: ApplicationRecord[]): Record<ApplicationStatus | 'all', number> {
  const counts: Record<ApplicationStatus | 'all', number> = {
    all: applications.length,
    Saved: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  applications.forEach((app) => {
    if (counts[app.status] !== undefined) {
      counts[app.status] += 1;
    }
  });

  return counts;
}

/**
 * Filters applications that have an urgent deadline (within 7 days) and are still active (Saved or Applied)
 */
export function getUrgentDeadlineReminders(
  applications: ApplicationRecord[],
  currentDate: Date = new Date()
): ApplicationRecord[] {
  return applications.filter((app) => {
    if (app.status !== 'Saved' && app.status !== 'Applied') return false;
    const status = calculateDeadlineStatus(app.deadline, currentDate);
    return !status.isExpired && (status.urgency === 'urgent' || status.urgency === 'soon');
  });
}
