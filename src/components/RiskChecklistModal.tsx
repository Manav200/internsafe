import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Mail,
  Zap,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { CHECKLIST_DEFINITIONS } from '../utils/riskChecklist.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface RiskChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskChecklistModal: React.FC<RiskChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Interactive Simulator State: lets students check any real-world offer
  const [activeChecks, setActiveChecks] = useState<Record<string, boolean>>({
    'crit-fee': false,
    'crit-verification': false,
    'crit-stipend': false,
    'crit-description': false,
    'crit-pressure': false,
    'crit-communication': false,
  });

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setActiveChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const triggeredCount = Object.values(activeChecks).filter(Boolean).length;
  const highSeverityTriggered =
    (activeChecks['crit-fee'] ? 1 : 0) +
    (activeChecks['crit-verification'] ? 1 : 0) +
    (activeChecks['crit-stipend'] ? 1 : 0);

  let simulatedScore: 'low' | 'medium' | 'high' = 'low';
  let advice =
    'Safe to proceed. Remember to never pay money to an employer at any stage of hiring.';

  if (highSeverityTriggered >= 2 || triggeredCount >= 3) {
    simulatedScore = 'high';
    advice =
      'CRITICAL DANGER: High probability of employment fraud. DO NOT transfer money, send personal bank credentials, or sign unverified documents.';
  } else if (triggeredCount >= 1 || highSeverityTriggered === 1) {
    simulatedScore = 'medium';
    advice =
      'EXERCISE CAUTION: Red flags detected. Request an official corporate email and consult your university career guidance office before proceeding.';
  }

  const categoryIcons = {
    fee: DollarSign,
    verification: Mail,
    stipend: Zap,
    description: FileText,
    pressure: AlertTriangle,
    communication: MessageCircle,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#000000]/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-guide-title"
    >
      <div
        className="bg-[#121215] w-full max-w-3xl rounded-[8px] border border-[#27272a] overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#fafafa]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="checklist-guide-title" className="text-lg sm:text-xl font-bold text-[#fafafa] tracking-tight">
                Internship Risk Checklist & Fraud Guide
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa]">
                The 6 mandatory safety checks every student should run before applying
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#fafafa] bg-[#121215]">
          {/* Interactive Self-Test Simulator Box */}
          <div className="p-5 bg-[#0c0c0f] text-[#fafafa] rounded-[8px] border border-[#27272a]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Interactive Risk Simulator
                </span>
                <h4 className="text-sm sm:text-base font-semibold text-[#fafafa] mt-0.5">
                  Received an internship offer elsewhere? Test it here:
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#71717a]">Risk Result:</span>
                <RiskBadge level={simulatedScore} size="sm" />
              </div>
            </div>

            <p className="text-xs font-mono text-[#a1a1aa] mb-4">{advice}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CHECKLIST_DEFINITIONS.map((def) => {
                const isChecked = activeChecks[def.id];
                return (
                  <button
                    key={def.id}
                    type="button"
                    onClick={() => toggleCheck(def.id)}
                    className={`flex items-center justify-between p-2.5 rounded-[6px] border text-left transition-all ${
                      isChecked
                        ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]'
                        : 'bg-[#121215] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-[#fafafa]'
                    }`}
                  >
                    <span className="font-mono text-xs truncate pr-2">{def.title}</span>
                    <span
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-[#ef4444] border-[#ef4444] text-[#fafafa]'
                          : 'border-[#27272a]'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6 Checklist Items Breakdown with "Why It Matters" */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717a]">
              Checklist Criteria & Explanations
            </h4>

            {CHECKLIST_DEFINITIONS.map((crit, index) => {
              const Icon = categoryIcons[crit.category] || AlertOctagon;
              return (
                <div
                  key={crit.id}
                  className="p-4 rounded-[8px] border border-[#27272a] bg-[#0c0c0f] hover:border-[#3f3f46] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${
                        crit.severity === 'high'
                          ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                          : 'bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h5 className="font-semibold text-[#fafafa] text-sm">
                          {index + 1}. {crit.title}
                        </h5>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[4px] ${
                            crit.severity === 'high'
                              ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                              : 'bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30'
                          }`}
                        >
                          {crit.severity} Severity Flag
                        </span>
                      </div>

                      <p className="text-xs text-[#a1a1aa] mb-2 leading-relaxed">
                        {crit.description}
                      </p>

                      <div className="p-3 bg-[#121215] border border-[#27272a] rounded-[6px] text-xs">
                        <span className="font-mono font-semibold text-[#a78bfa] block mb-0.5 flex items-center gap-1 text-[11px]">
                          <HelpCircle className="w-3.5 h-3.5 text-[#a78bfa]" /> Why this matters:
                        </span>
                        <p className="text-[#a1a1aa] leading-normal font-mono text-xs">
                          {crit.whyItMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0c0c0f] border-t border-[#27272a] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold text-xs rounded-[8px] transition-all"
          >
            Got It, Back to Listings
          </button>
        </div>
      </div>
    </div>
  );
};
