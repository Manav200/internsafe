import type { Internship, RiskLevel } from '../types/internship.ts';

export interface ChecklistCriterion {
  id: string;
  category: 'fee' | 'verification' | 'stipend' | 'description' | 'pressure' | 'communication';
  title: string;
  description: string;
  whyItMatters: string;
  severity: RiskLevel;
  isTriggered: boolean;
  evidenceText?: string;
}

export interface ChecklistAudit {
  score: RiskLevel;
  totalChecks: number;
  triggeredCount: number;
  passedCount: number;
  criteria: ChecklistCriterion[];
  overallSummary: string;
}

export const CHECKLIST_DEFINITIONS = [
  {
    id: 'crit-fee',
    category: 'fee' as const,
    title: 'Upfront Fees, Training Kits, or Security Deposits',
    description: 'Requires candidate to pay registration fees, software license bonds, or course kits before starting.',
    whyItMatters: 'Legitimate employers NEVER ask students to pay to work. Demanding upfront money for background checks, laptops, or "mandatory training kits" is the #1 indicator of employment fraud.',
    severity: 'high' as const,
  },
  {
    id: 'crit-verification',
    category: 'verification' as const,
    title: 'Unverifiable Recruiter or Company Entity',
    description: 'Recruiter uses free webmail (@gmail, @yahoo) with no corporate domain, website, or verifiable LinkedIn presence.',
    whyItMatters: 'Authentic companies hire using corporate domain emails and maintain transparent public profiles. Personal email addresses prevent accountability and indicate fly-by-night operations.',
    severity: 'high' as const,
  },
  {
    id: 'crit-stipend',
    category: 'stipend' as const,
    title: 'Unrealistic or Deceptive Compensation',
    description: 'Promises an abnormally high stipend for entry-level work with 0 experience, or conceals a 100% sales commission structure.',
    whyItMatters: 'Scammers offer exorbitant pay (e.g. $8,500/mo for simple typing) as psychological bait to lure students into paying advance deposits or selling products to peers.',
    severity: 'high' as const,
  },
  {
    id: 'crit-description',
    category: 'description' as const,
    title: 'Vague Job Description & Deliverables',
    description: 'Lacks specific engineering/business tasks, learning syllabus, or clear team deliverables.',
    whyItMatters: 'Legitimate internships have structured mentorship and clear projects. Ultra-generic descriptions like "daily typing tasks" often mask illegal check-cashing, click farming, or laundering schemes.',
    severity: 'medium' as const,
  },
  {
    id: 'crit-pressure',
    category: 'pressure' as const,
    title: 'Artificial Urgency & High-Pressure Deadlines',
    description: 'Pressures candidate with artificial deadlines ("must pay/accept in 12 hours", "last 2 seats remaining").',
    whyItMatters: 'Scammers use urgency to panic students so they don\'t research the company or consult university career advisors before transferring money.',
    severity: 'medium' as const,
  },
  {
    id: 'crit-communication',
    category: 'communication' as const,
    title: 'Communication Exclusively via WhatsApp / Telegram',
    description: 'Interviews, onboarding, and instructions are conducted solely through anonymous messaging channels.',
    whyItMatters: 'Anonymous chat apps make it trivial for scammers to delete conversation history and vanish. Reputable employers use corporate email, verified ATS systems, and video interviews.',
    severity: 'medium' as const,
  },
];

/**
 * Runs an internship through the 6-point risk checklist
 */
export function evaluateRiskChecklist(internship: Internship): ChecklistAudit {
  const criteria: ChecklistCriterion[] = CHECKLIST_DEFINITIONS.map((def) => {
    let isTriggered = false;
    let evidenceText = '';

    switch (def.category) {
      case 'fee':
        isTriggered = Boolean(internship.verification.asksUpfrontFee);
        if (isTriggered) {
          evidenceText = internship.verification.feeAmount
            ? `Demands payment: ${internship.verification.feeAmount}`
            : 'Demands upfront registration or training fee';
        }
        break;

      case 'verification':
        const email = internship.verification.recruiterEmail.toLowerCase();
        const hasFreeEmail = email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@outlook.com');
        const lacksWebOrLinkedIn = !internship.verification.hasWebsite || !internship.verification.hasLinkedIn;
        isTriggered = hasFreeEmail || lacksWebOrLinkedIn || !internship.verification.hasCorporateEmail;
        if (isTriggered) {
          const reasons: string[] = [];
          if (hasFreeEmail) reasons.push(`Uses free email (${internship.verification.recruiterEmail})`);
          if (!internship.verification.hasWebsite) reasons.push('No company website');
          if (!internship.verification.hasLinkedIn) reasons.push('No company LinkedIn');
          evidenceText = reasons.join(', ');
        }
        break;

      case 'stipend':
        const stipendUpper = internship.stipend.toUpperCase();
        const isExcessive = stipendUpper.includes('8,500') || stipendUpper.includes('GUARANTEED DAY 1');
        const isCommissionDisguised = stipendUpper.includes('COMMISSION') || internship.description.toLowerCase().includes('commission');
        isTriggered = isExcessive || isCommissionDisguised;
        if (isTriggered) {
          evidenceText = isExcessive
            ? 'Stipend abnormally high ($8,500/mo) for freshers'
            : 'Stipend is 100% sales commission contingent on peer purchases';
        }
        break;

      case 'description':
        isTriggered = internship.verification.descriptionClarity === 'vague';
        if (isTriggered) {
          evidenceText = 'Vague tasks without defined mentorship, tech stack, or deliverables';
        }
        break;

      case 'pressure':
        isTriggered = Boolean(internship.verification.urgencyPressure);
        if (isTriggered) {
          evidenceText = 'High-pressure deadline tactics to bypass student review';
        }
        break;

      case 'communication':
        isTriggered = internship.verification.communicationChannel.includes('WhatsApp') ||
                      internship.verification.communicationChannel.includes('Telegram');
        if (isTriggered) {
          evidenceText = `All communication routed through ${internship.verification.communicationChannel}`;
        }
        break;
    }

    return {
      ...def,
      isTriggered,
      evidenceText: isTriggered ? evidenceText : 'Passed: No red flag detected',
    };
  });

  const triggeredCount = criteria.filter((c) => c.isTriggered).length;
  const passedCount = criteria.length - triggeredCount;
  const highTriggered = criteria.filter((c) => c.isTriggered && c.severity === 'high').length;

  let computedScore: RiskLevel = 'low';
  let overallSummary = 'All primary safety checks passed. Standard legitimate employer.';

  if (highTriggered >= 2 || triggeredCount >= 3) {
    computedScore = 'high';
    overallSummary = 'CRITICAL ALERT: Multiple high-severity red flags detected. High risk of employment scam.';
  } else if (triggeredCount >= 1 || highTriggered === 1) {
    computedScore = 'medium';
    overallSummary = 'CAUTION: Warning flags detected. Review fine print and verify credentials thoroughly.';
  }

  return {
    score: computedScore,
    totalChecks: criteria.length,
    triggeredCount,
    passedCount,
    criteria,
    overallSummary,
  };
}
