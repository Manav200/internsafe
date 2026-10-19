import React from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import type { FilterState, WorkMode, CompensationType, RiskLevel } from '../types/internship.ts';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableSkills: string[];
  totalResults: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableSkills,
  totalResults,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, locationQuery: e.target.value });
  };

  const handleWorkModeChange = (mode: WorkMode) => {
    onFilterChange({ ...filters, workMode: mode });
  };

  const handleCompensationChange = (comp: CompensationType) => {
    onFilterChange({ ...filters, compensation: comp });
  };

  const handleRiskChange = (risk: 'all' | RiskLevel) => {
    onFilterChange({ ...filters, riskLevel: risk });
  };

  const handleSkillToggle = (skill: string) => {
    onFilterChange({
      ...filters,
      selectedSkill: filters.selectedSkill === skill ? undefined : skill,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as 'default' | 'skillMatch' | 'deadline',
    });
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.locationQuery) ||
    filters.workMode !== 'all' ||
    filters.compensation !== 'all' ||
    filters.riskLevel !== 'all' ||
    Boolean(filters.selectedSkill) ||
    (filters.sortBy && filters.sortBy !== 'default');

  return (
    <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-4 sm:p-5 mb-8">
      {/* Top Search Inputs: Keyword/Skills & Location */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        <div className="md:col-span-7 relative">
          <label htmlFor="search-input" className="sr-only">
            Search by title, skill, or company
          </label>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={filters.searchQuery}
            onChange={handleTextChange}
            placeholder="Search internships by skills (e.g. React, Python), title, or company..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/40 transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#71717a] hover:text-[#fafafa] rounded-[4px]"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="md:col-span-5 relative">
          <label htmlFor="location-input" className="sr-only">
            Search by location or Remote
          </label>
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
          <input
            id="location-input"
            type="text"
            value={filters.locationQuery}
            onChange={handleLocationChange}
            placeholder="Location (e.g. San Francisco, Boston, Remote)"
            className="w-full pl-10 pr-10 py-2.5 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/40 transition-all"
          />
          {filters.locationQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, locationQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#71717a] hover:text-[#fafafa] rounded-[4px]"
              aria-label="Clear location input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row 1: Work Mode, Compensation & Risk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-[#27272a] items-center">
        {/* Work Mode Filter (WFH vs Offline vs Hybrid) */}
        <div className="lg:col-span-4">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1.5 font-semibold">
            Work Arrangement
          </span>
          <div className="inline-flex p-1 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] w-full text-xs font-medium">
            {(
              [
                { id: 'all', label: 'All Modes' },
                { id: 'wfh', label: 'Remote' },
                { id: 'offline', label: 'In-Office' },
                { id: 'hybrid', label: 'Hybrid' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleWorkModeChange(mode.id)}
                className={`flex-1 py-1.5 px-1.5 rounded-[6px] text-center transition-all ${
                  filters.workMode === mode.id
                    ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compensation Filter (Paid vs Unpaid) */}
        <div className="lg:col-span-3">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1.5 font-semibold">
            Compensation
          </span>
          <div className="inline-flex p-1 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] w-full text-xs font-medium">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'paid', label: 'Paid Only' },
                { id: 'unpaid', label: 'Unpaid' },
              ] as const
            ).map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => handleCompensationChange(comp.id)}
                className={`flex-1 py-1.5 px-2 rounded-[6px] text-center transition-all ${
                  filters.compensation === comp.id
                    ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Filter (Low / Medium / High) */}
        <div className="lg:col-span-3">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1.5 font-semibold">
            Safety Risk Score
          </span>
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs font-medium">
            <button
              type="button"
              onClick={() => handleRiskChange('all')}
              className={`py-1.5 px-1 rounded-[6px] text-center transition-all ${
                filters.riskLevel === 'all'
                  ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleRiskChange('low')}
              className={`py-1.5 px-1 rounded-[6px] text-center transition-all flex items-center justify-center gap-1 ${
                filters.riskLevel === 'low'
                  ? 'bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/40'
                  : 'text-[#34d399] hover:bg-[#34d399]/10'
              }`}
              title="Low Risk (Legitimate)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Low
            </button>
            <button
              type="button"
              onClick={() => handleRiskChange('medium')}
              className={`py-1.5 px-1 rounded-[6px] text-center transition-all flex items-center justify-center gap-1 ${
                filters.riskLevel === 'medium'
                  ? 'bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40'
                  : 'text-[#fbbf24] hover:bg-[#f59e0b]/10'
              }`}
              title="Medium Risk (Caution)"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Med
            </button>
            <button
              type="button"
              onClick={() => handleRiskChange('high')}
              className={`py-1.5 px-1 rounded-[6px] text-center transition-all flex items-center justify-center gap-1 ${
                filters.riskLevel === 'high'
                  ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/40'
                  : 'text-[#ef4444] hover:bg-[#ef4444]/10'
              }`}
              title="High Risk (Scam Flags)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              High
            </button>
          </div>
        </div>

        {/* Sort By Filter */}
        <div className="lg:col-span-2">
          <label
            htmlFor="sort-select"
            className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1.5 font-semibold"
          >
            Sort Listings
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={filters.sortBy || 'default'}
              onChange={handleSortChange}
              className="w-full py-2 px-2.5 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs font-mono text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
            >
              <option value="default">Default Order</option>
              <option value="skillMatch">Highest Skill Match</option>
              <option value="deadline">Upcoming Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Row 2: Popular Skills Tags & Active Status */}
      <div className="mt-4 pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#71717a] font-mono text-[11px] mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#a78bfa]" /> Skills:
          </span>
          {availableSkills.slice(0, 7).map((skill) => {
            const isSelected = filters.selectedSkill === skill;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-2.5 py-1 rounded-[6px] text-xs transition-all border font-mono ${
                  isSelected
                    ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40 font-medium'
                    : 'bg-[#0c0c0f] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]'
                }`}
              >
                {skill}
                {isSelected && <span className="ml-1 text-[10px]">✕</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#71717a]">
            Showing <strong className="text-[#fafafa] font-medium">{totalResults}</strong> listings
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-mono text-[#ef4444] hover:text-[#f87171] hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
