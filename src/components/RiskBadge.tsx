import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { RiskLevel } from '../types/internship.ts';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const config = {
    low: {
      label: 'Low Risk',
      sublabel: 'Verified & Legitimate',
      bg: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/40',
      badgeBg: 'bg-[#34d399] text-[#09090b]',
      dot: 'bg-[#34d399]',
      icon: ShieldCheck,
    },
    medium: {
      label: 'Medium Risk',
      sublabel: 'Caution Advised',
      bg: 'bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/40',
      badgeBg: 'bg-[#f59e0b] text-[#09090b]',
      dot: 'bg-[#f59e0b]',
      icon: AlertTriangle,
    },
    high: {
      label: 'High Risk',
      sublabel: 'Potential Scam Alert',
      bg: 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/50',
      badgeBg: 'bg-[#ef4444] text-[#fafafa]',
      dot: 'bg-[#ef4444]',
      icon: ShieldAlert,
    },
  }[level];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-medium font-mono',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-semibold font-mono',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-[6px] border ${config.bg} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label} - ${config.sublabel}`}
      title={`${config.label}: ${config.sublabel}`}
    >
      <Icon size={iconSizes} className="shrink-0" aria-hidden="true" />
      {showLabel && (
        <span className="tracking-tight uppercase text-[11px] font-semibold">
          {config.label}
        </span>
      )}
    </span>
  );
};
