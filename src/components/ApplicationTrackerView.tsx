import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Bookmark,
  Send,
  MessageSquare,
  Award,
  XCircle,
  Trash2,
  ExternalLink,
  Edit3,
  Check,
  Search,
  ShieldAlert,
} from 'lucide-react';
import type {
  ApplicationRecord,
  ApplicationStatus,
  Internship,
} from '../types/internship.ts';
import { calculateDeadlineStatus, getStatusCounts } from '../utils/tracker.ts';
import { RiskBadge } from './RiskBadge.tsx';

interface ApplicationTrackerViewProps {
  applications: ApplicationRecord[];
  internships: Internship[];
  onUpdateStatus: (applicationId: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (applicationId: string, notes: string) => void;
  onRemoveApplication: (applicationId: string) => void;
  onSelectInternship: (internship: Internship) => void;
  onSwitchToDiscover: () => void;
}

const STATUS_ICONS = {
  Saved: Bookmark,
  Applied: Send,
  Interview: MessageSquare,
  Offer: Award,
  Rejected: XCircle,
};

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  Saved: { bg: 'bg-[#18181b]', text: 'text-[#fafafa]', border: 'border-[#27272a]' },
  Applied: { bg: 'bg-[#a78bfa]/15', text: 'text-[#a78bfa]', border: 'border-[#a78bfa]/40' },
  Interview: { bg: 'bg-[#a78bfa]/25', text: 'text-[#bba4fb]', border: 'border-[#a78bfa]/50' },
  Offer: { bg: 'bg-[#34d399]/15', text: 'text-[#34d399]', border: 'border-[#34d399]/40' },
  Rejected: { bg: 'bg-[#ef4444]/15', text: 'text-[#ef4444]', border: 'border-[#ef4444]/40' },
};

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  internships,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveApplication,
  onSelectInternship,
  onSwitchToDiscover,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<ApplicationStatus | 'all'>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Map internship IDs for fast lookup
  const internshipMap = React.useMemo(() => {
    const map = new Map<string, Internship>();
    internships.forEach((i) => map.set(i.id, i));
    return map;
  }, [internships]);

  const statusCounts = React.useMemo(() => {
    return getStatusCounts(applications);
  }, [applications]);

  // Urgent deadlines summary (< 7 days, active)
  const urgentReminders = React.useMemo(() => {
    return applications
      .filter((app) => app.status === 'Saved' || app.status === 'Applied')
      .map((app) => {
        const intern = internshipMap.get(app.internshipId);
        const deadline = calculateDeadlineStatus(app.deadline);
        return { app, intern, deadline };
      })
      .filter((item) => !item.deadline.isExpired && item.deadline.daysRemaining <= 7)
      .sort((a, b) => a.deadline.daysRemaining - b.deadline.daysRemaining);
  }, [applications, internshipMap]);

  // Filtered applications by current tab
  const filteredApps = React.useMemo(() => {
    if (selectedStatusTab === 'all') return applications;
    return applications.filter((app) => app.status === selectedStatusTab);
  }, [applications, selectedStatusTab]);

  const handleStartEditNotes = (app: ApplicationRecord) => {
    setEditingNotesId(app.id);
    setNotesInput(app.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, notesInput.trim());
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fafafa] tracking-tight">
              Application Tracker & Deadlines
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#a1a1aa] mt-1">
              Precision tracking across pipeline stages with real-time deadline monitoring.
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToDiscover}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold text-xs sm:text-sm rounded-[8px] transition-all"
          >
            <Search className="w-4 h-4" />
            Explore More Internships
          </button>
        </div>

        {/* Urgent Deadlines Alert Banner */}
        {urgentReminders.length > 0 && (
          <div className="p-4 rounded-[8px] bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#fbbf24] mb-5 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-mono font-semibold text-xs sm:text-sm block">
                Upcoming Deadline Reminder ({urgentReminders.length} listing{urgentReminders.length > 1 ? 's' : ''} closing soon):
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {urgentReminders.map(({ app, intern, deadline }) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => intern && onSelectInternship(intern)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121215] border border-[#f59e0b]/40 rounded-[6px] text-xs font-mono text-[#fafafa] hover:border-[#f59e0b]"
                  >
                    <span className="font-bold text-[#fafafa]">{intern?.company}:</span>
                    <span className="text-[#fbbf24]">{deadline.label}</span>
                    <span className="text-[10px] text-[#71717a]">({app.deadline})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage Filter Tabs (All / Saved / Applied / Interview / Offer / Rejected) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
          <button
            type="button"
            onClick={() => setSelectedStatusTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
              selectedStatusTab === 'all'
                ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
            }`}
          >
            <span>All Applications</span>
            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono bg-[#27272a] text-[#fafafa]">
              {statusCounts.all}
            </span>
          </button>

          {(['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'] as ApplicationStatus[]).map((status) => {
            const Icon = STATUS_ICONS[status];
            const isSelected = selectedStatusTab === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatusTab(status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#222226] text-[#fafafa] border border-[#3f3f46]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>{status}</span>
                <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono bg-[#27272a] text-[#fafafa]">
                  {statusCounts[status]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const intern = internshipMap.get(app.internshipId);
            if (!intern) return null;

            const deadlineInfo = calculateDeadlineStatus(app.deadline);
            const isHighRisk = intern.riskScore === 'high';
            const isMediumRisk = intern.riskScore === 'medium';
            const statusStyle = STATUS_COLORS[app.status];

            return (
              <div
                key={app.id}
                className={`bg-[#121215] rounded-[8px] border p-5 flex flex-col justify-between transition-all hover:bg-[#18181b] ${
                  isHighRisk
                    ? 'border-[#ef4444]/50'
                    : isMediumRisk
                    ? 'border-[#f59e0b]/50'
                    : 'border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div>
                  {/* Top: Risk Warning if Risky */}
                  {isHighRisk && (
                    <div className="mb-3 px-2.5 py-1 rounded-[6px] bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[11px] font-mono font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                      <span>HIGH RISK: Beware of fee demands</span>
                    </div>
                  )}

                  {/* Header: Company & Risk */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[8px] bg-[#18181b] border border-[#27272a] text-[#fafafa] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {intern.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-[#fafafa] text-sm truncate tracking-tight">
                          {intern.company}
                        </h4>
                        <span className="text-xs font-mono text-[#71717a] block truncate">
                          {intern.location}
                        </span>
                      </div>
                    </div>
                    <RiskBadge level={intern.riskScore} size="sm" />
                  </div>

                  {/* Job Title */}
                  <h3 className="font-semibold text-[#fafafa] text-sm sm:text-base mb-2 line-clamp-2 tracking-tight">
                    {intern.title}
                  </h3>

                  {/* Deadline & Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-mono bg-[#0c0c0f] border border-[#27272a] text-[#a1a1aa]"
                      title={`Deadline: ${app.deadline}`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                      {deadlineInfo.label}
                    </span>

                    <span className="text-xs font-mono text-[#34d399] font-medium">
                      {intern.stipend}
                    </span>
                  </div>

                  {/* Current Status Selector */}
                  <div className="mb-4">
                    <label
                      htmlFor={`status-select-${app.id}`}
                      className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1 font-semibold"
                    >
                      Application Stage
                    </label>
                    <select
                      id={`status-select-${app.id}`}
                      value={app.status}
                      onChange={(e) =>
                        onUpdateStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      className={`w-full py-1.5 px-3 rounded-[6px] text-xs font-mono font-medium border transition-colors ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none focus:border-[#a78bfa]`}
                    >
                      <option value="Saved">Saved (Considering)</option>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview Scheduled</option>
                      <option value="Offer">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Personal Notes Section */}
                  <div className="mb-4 p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#71717a] flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-[#71717a]" />
                        Notes
                      </span>
                      {editingNotesId !== app.id && (
                        <button
                          type="button"
                          onClick={() => handleStartEditNotes(app)}
                          className="text-[11px] font-mono text-[#a78bfa] hover:underline"
                        >
                          {app.notes ? 'Edit' : '+ Add Note'}
                        </button>
                      )}
                    </div>

                    {editingNotesId === app.id ? (
                      <div className="space-y-2 mt-1">
                        <textarea
                          rows={2}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="Interview scheduled for Oct 25 at 2pm..."
                          className="w-full p-2 text-xs bg-[#121215] border border-[#27272a] text-[#fafafa] rounded-[6px] focus:outline-none focus:border-[#a78bfa]"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 text-[11px] text-[#71717a] hover:bg-[#18181b] rounded-[4px]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(app.id)}
                            className="px-2.5 py-1 text-[11px] bg-[#a78bfa] text-[#09090b] rounded-[4px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#a1a1aa] italic font-mono">
                        {app.notes || 'No personal notes yet.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectInternship(intern)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#a78bfa] hover:text-[#bba4fb]"
                  >
                    Audit Risk & Details
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveApplication(app.id)}
                    className="p-1.5 text-[#71717a] hover:text-[#ef4444] rounded-[6px] hover:bg-[#18181b] transition-colors"
                    title="Remove from application tracker"
                    aria-label={`Remove application for ${intern.company}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-10 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex items-center justify-center mx-auto mb-3 text-[#a78bfa]">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#fafafa] mb-1">
            No {selectedStatusTab === 'all' ? '' : selectedStatusTab} applications yet
          </h3>
          <p className="text-xs text-[#a1a1aa] mb-5 font-mono">
            Browse verified internships from the Discover tab and click "Save to Tracker" or "Apply" to start tracking.
          </p>
          <button
            type="button"
            onClick={onSwitchToDiscover}
            className="px-4 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] font-semibold text-xs rounded-[8px] transition-all"
          >
            Explore Internships Now
          </button>
        </div>
      )}
    </div>
  );
};
