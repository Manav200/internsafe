import React, { useState } from 'react';
import { X, Sparkles, Plus, GraduationCap, User, Check, RefreshCw, FileText, ArrowRight } from 'lucide-react';

export interface StudentProfile {
  name: string;
  college: string;
  skills: string[];
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onNavigateToResume?: () => void;
}

const POPULAR_SKILL_SUGGESTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'SQL',
  'Tailwind CSS',
  'Git',
  'Figma',
  'Docker',
  'Linux',
  'Go',
  'Flutter',
  'PyTorch',
  'Pandas',
  'REST APIs',
  'SEO',
  'Google Analytics',
  'Excel',
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onNavigateToResume,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [newSkillInput, setNewSkillInput] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    const exists = skills.some((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setSkills([...skills, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(newSkillInput);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleResetToPresets = () => {
    setSkills(['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Git', 'Figma']);
  };

  const handleSave = () => {
    onSaveProfile({
      name: name.trim() || 'Alex Chen',
      college: college.trim() || 'State University',
      skills,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="bg-[#121215] w-full max-w-xl rounded-[8px] border border-[#27272a] overflow-hidden my-auto text-[#fafafa]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="profile-modal-title" className="text-lg font-bold text-[#fafafa] tracking-tight">
                Student Profile & Skill Matcher
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa]">
                Custom skills used to calculate live match rates across all internships
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

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-[#121215]">
          {/* Basic Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-mono text-[#a1a1aa] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#71717a]" /> Full Name
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs sm:text-sm text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            <div>
              <label htmlFor="college-input" className="block text-xs font-mono text-[#a1a1aa] mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#71717a]" /> College / University
              </label>
              <input
                id="college-input"
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. State University"
                className="w-full px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs sm:text-sm text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          {/* Quick Resume Upload Option */}
          {onNavigateToResume && (
            <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] bg-[#18181b] border border-[#27272a] text-[#a78bfa] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#fafafa]">Auto-Extract Skills from Resume</p>
                  <p className="text-[11px] font-mono text-[#71717a]">Sync skills directly from your PDF or DOCX resume</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToResume();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#a78bfa] rounded-[6px] text-xs font-mono transition-all shrink-0"
              >
                <span>Resume Match</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a78bfa]" />
              </button>
            </div>
          )}

          {/* Current Skills Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#71717a]">
                Active Skills ({skills.length})
              </label>
              <button
                type="button"
                onClick={handleResetToPresets}
                className="text-xs font-mono text-[#a78bfa] hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>

            {skills.length > 0 ? (
              <div className="p-3 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex flex-wrap gap-1.5 min-h-[70px]">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-[6px] text-xs font-mono hover:border-[#3f3f46] transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-0.5 hover:text-[#ef4444] text-[#71717a] transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#0c0c0f] border border-dashed border-[#27272a] rounded-[8px] text-center text-xs font-mono text-[#71717a]">
                No skills added yet. Add your skills below to view dynamic match rates!
              </div>
            )}
          </div>

          {/* Add Skill Input */}
          <div>
            <label htmlFor="custom-skill-input" className="block text-xs font-mono text-[#71717a] mb-1.5 font-semibold">
              Add Custom Skill
            </label>
            <div className="flex gap-2">
              <input
                id="custom-skill-input"
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill (e.g. Next.js, Node.js, C++) and press Enter"
                className="flex-1 px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs sm:text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa]"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-4 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium rounded-[8px] text-xs sm:text-sm flex items-center gap-1 transition-all font-mono"
              >
                <Plus className="w-4 h-4 text-[#a78bfa]" /> Add
              </button>
            </div>
          </div>

          {/* Quick Click Suggestions */}
          <div>
            <span className="block text-[11px] font-mono text-[#71717a] mb-2">
              Quickly toggle common student technical skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILL_SUGGESTIONS.map((suggestion) => {
                const isSelected = skills.some(
                  (s) => s.toLowerCase() === suggestion.toLowerCase()
                );
                return (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveSkill(suggestion);
                      } else {
                        handleAddSkill(suggestion);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-[4px] text-xs font-mono transition-all border ${
                      isSelected
                        ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40 font-medium'
                        : 'bg-[#0c0c0f] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 text-[#a78bfa]" />}
                    {suggestion}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0c0c0f] border-t border-[#27272a] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] rounded-[8px] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] rounded-[8px] transition-all"
          >
            Save Skills & Update Matches
          </button>
        </div>
      </div>
    </div>
  );
};
