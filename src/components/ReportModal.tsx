import React, { useState, useEffect } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import type { Internship, ListingReport } from '../types/internship.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface ReportModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: ListingReport) => void;
}

const REPORT_REASONS = [
  'Asks for registration, training, or security fees upfront',
  'Recruiter or company cannot be verified (personal email like Gmail, no website)',
  'Unrealistic stipend for the work described',
  'Vague job description / unclear deliverables',
  'Pressure to decide quickly / artificial urgency',
  'Communication only via WhatsApp or Telegram',
  'Misleading compensation (100% sales commission labeled as stipend)',
  'Other suspicious or fraudulent behavior',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  internship,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(REPORT_REASONS[0]);
      setDetails('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !internship) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: ListingReport = {
      id: `report-${Date.now()}`,
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      reason: selectedReason,
      details: details.trim() || undefined,
      reporterEmail: reporterEmail.trim() || undefined,
      reportedAt: new Date().toISOString(),
    };

    onSubmitReport(newReport);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="bg-[#121215] w-full max-w-lg rounded-[8px] border border-[#27272a] overflow-hidden my-auto text-[#fafafa]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 flex items-center justify-center shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 id="report-modal-title" className="text-lg font-bold text-[#fafafa] tracking-tight">
                Report Suspicious Listing
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa]">
                Help protect student peers by flagging fraudulent offers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#71717a] hover:text-[#fafafa] rounded-[6px] hover:bg-[#18181b] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3 bg-[#121215]">
            <div className="w-12 h-12 bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] rounded-[8px] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#fafafa]">Report Submitted</h4>
            <p className="text-xs font-mono text-[#a1a1aa] max-w-sm mx-auto leading-relaxed">
              Thank you for keeping InternSafe reliable and safe. This listing has been flagged in your records and community audit registry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#121215]">
            {/* Target Internship Card Preview */}
            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[6px] flex items-center justify-between gap-3 text-xs">
              <div className="overflow-hidden">
                <span className="font-semibold text-[#fafafa] block truncate">
                  {internship.title}
                </span>
                <span className="text-xs font-mono text-[#71717a]">{internship.company}</span>
              </div>
              <RiskBadge level={internship.riskScore} size="sm" />
            </div>

            {/* Reason Selection */}
            <div>
              <label htmlFor="report-reason" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-1.5">
                Primary Reason for Report <span className="text-[#ef4444]">*</span>
              </label>
              <select
                id="report-reason"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs font-mono text-[#fafafa] focus:outline-none focus:border-[#ef4444]"
                required
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Details */}
            <div>
              <label htmlFor="report-details" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-1.5">
                Additional Evidence / Details (Optional)
              </label>
              <textarea
                id="report-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Recruiter messaged on WhatsApp asking to wire a $199 equipment deposit before onboarding..."
                className="w-full px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs font-mono text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#ef4444]"
              />
            </div>

            {/* Optional Email */}
            <div>
              <label htmlFor="reporter-email" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a] mb-1.5">
                Your Email (Optional, for investigation updates)
              </label>
              <input
                id="reporter-email"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs font-mono text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] rounded-[8px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-semibold bg-[#ef4444] hover:bg-[#dc2626] text-[#fafafa] rounded-[8px] transition-colors flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Submit Safety Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
