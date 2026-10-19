import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Sparkles,
  Lock,
  RefreshCw,
  GraduationCap,
  Briefcase,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { ResumeParsedData } from '../types/internship.ts';
import { getSampleResumeData } from '../utils/resumeParser.ts';

interface ResumeUploadSectionProps {
  currentProfileSkills: string[];
  onSaveSkillsToProfile: (updatedSkills: string[]) => void;
  parsedData: ResumeParsedData | null;
  onSetParsedData: (data: ResumeParsedData | null) => void;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  currentProfileSkills,
  onSaveSkillsToProfile,
  parsedData,
  onSetParsedData,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync editableSkills when parsedData changes
  React.useEffect(() => {
    if (parsedData) {
      setEditableSkills(parsedData.skills);
    }
  }, [parsedData]);

  // Handle file upload
  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validate file type
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (!isPdf && !isDocx && !isTxt) {
      setErrorMessage(
        'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).'
      );
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('File size exceeds 12MB limit. Please upload a smaller document.');
      return;
    }

    setIsParsing(true);
    setParseStep('Reading document binary...');

    try {
      // Convert file to base64
      const reader = new FileReader();

      const base64Promise = new Promise<{ base64: string }>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1] || result;
          resolve({ base64 });
        };
        reader.onerror = () => reject(new Error('Failed to read file from disk.'));
        reader.readAsDataURL(file);
      });

      const { base64 } = await base64Promise;

      setParseStep('Analyzing resume with Gemini AI...');

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      setParseStep('Structuring skills and project history...');

      const result = await response.json();
      if (!result.data || !result.data.skills || result.data.skills.length === 0) {
        throw new Error('No technical skills could be extracted. Try uploading a clearer resume or test with the sample resume.');
      }

      onSetParsedData(result.data);
      setEditableSkills(result.data.skills);
      onSaveSkillsToProfile(result.data.skills);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.warn('API parsing failed, offering sample fallback:', err);
      setErrorMessage(
        err?.message || 'Could not parse resume. Please ensure the document contains readable text.'
      );
    } finally {
      setIsParsing(false);
      setParseStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSampleResume = () => {
    setIsParsing(true);
    setParseStep('Loading sample student resume...');
    setErrorMessage(null);
    setTimeout(() => {
      const sample = getSampleResumeData();
      onSetParsedData(sample);
      setEditableSkills(sample.skills);
      onSaveSkillsToProfile(sample.skills);
      setIsParsing(false);
      setParseStep('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = editableSkills.filter((s) => s !== skillToRemove);
    setEditableSkills(updated);
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!editableSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setEditableSkills([...editableSkills, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(newSkillInput);
    }
  };

  const handleSaveAllSkills = () => {
    onSaveSkillsToProfile(editableSkills);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box / Dropzone */}
      <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI Powered
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fafafa] tracking-tight">
              Resume Upload & Smart Match
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#a1a1aa] mt-1">
              Upload your student resume (PDF or DOCX). AI extracts skills, projects, and education to rank matching listings and audit gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleResume}
              disabled={isParsing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] text-xs font-mono font-medium rounded-[8px] transition-all border border-[#27272a] hover:border-[#3f3f46]"
              title="Test with a realistic computer science student resume"
            >
              <FileText className="w-4 h-4 text-[#a78bfa]" />
              Load Sample Student Resume
            </button>
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-[8px] p-8 text-center cursor-pointer transition-all ${
            isParsing
              ? 'border-[#a78bfa]/60 bg-[#a78bfa]/5 pointer-events-none'
              : 'border-[#27272a] hover:border-[#a78bfa] bg-[#0c0c0f] hover:bg-[#18181b]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isParsing ? (
            <div className="space-y-3 py-4">
              <RefreshCw className="w-8 h-8 text-[#a78bfa] animate-spin mx-auto" />
              <h4 className="font-semibold text-[#fafafa] text-sm font-mono">{parseStep}</h4>
              <p className="text-xs font-mono text-[#71717a]">
                Parsing document structure and extracting technical skills via Gemini API...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#18181b] border border-[#27272a] text-[#a78bfa] rounded-[8px] flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#fafafa] text-sm">
                  Choose a PDF or Word Document
                </h4>
                <p className="text-xs font-mono text-[#71717a] mt-1">
                  Drag and drop your file here, or click to browse (PDF, DOCX up to 12MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#71717a]">
          <Lock className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
          <span>
            <strong className="text-[#a1a1aa]">Private & Secure:</strong> Processed in-memory for extraction only. Never permanently stored or sold.
          </span>
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-[8px] text-xs font-mono text-[#ef4444] flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="block">Upload or Parsing Issue</strong>
                <p className="mt-0.5 text-[#f87171]">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 text-[#ef4444] hover:text-[#f87171]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Extracted Resume Details & Editable Skills List */}
      {parsedData && (
        <div className="bg-[#121215] rounded-[8px] border border-[#27272a] p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#fafafa] text-base tracking-tight">
                  Resume Parsed Successfully
                </h3>
                <p className="text-xs font-mono text-[#71717a]">
                  Source: <strong className="text-[#fafafa] font-normal">{parsedData.fileName}</strong> • Extracted {parsedData.skills.length} skills
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] rounded-[6px] border border-transparent hover:border-[#27272a] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Upload Different Resume
            </button>
          </div>

          {/* Professional Summary */}
          {parsedData.summary && (
            <div className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
              <span className="font-mono uppercase tracking-wider text-[#71717a] text-[10px] block mb-1 font-semibold">
                Extracted Summary
              </span>
              {parsedData.summary}
            </div>
          )}

          {/* Editable Extracted Skills List */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-[#fafafa] text-sm flex items-center gap-2">
                  <span>Extracted Skills</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
                    {editableSkills.length}
                  </span>
                </h4>
                <p className="text-xs font-mono text-[#71717a]">
                  Click ✕ to remove any extracted skill or add missing skills below:
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAllSkills}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#a78bfa] hover:bg-[#bba4fb] text-[#09090b] rounded-[8px] text-xs font-semibold transition-all shadow-none"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#09090b]" />
                    <span>Saved to Profile!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#09090b]" />
                    <span>Save & Sync to Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Skills Pills */}
            <div className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] flex flex-wrap gap-2">
              {editableSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-[6px] text-xs font-mono group hover:border-[#3f3f46] transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 text-[#71717a] hover:text-[#ef4444] rounded-[4px] transition-colors"
                    title={`Remove ${skill}`}
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Skill Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add missing skill (e.g. Next.js, Docker, PyTorch) and press Enter"
                className="flex-1 px-3 py-2 bg-[#0c0c0f] border border-[#27272a] rounded-[8px] text-xs sm:text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa]"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-4 py-2 bg-[#18181b] hover:bg-[#222226] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] font-medium rounded-[8px] text-xs sm:text-sm flex items-center gap-1.5 transition-all font-mono"
              >
                <Plus className="w-4 h-4 text-[#a78bfa]" /> Add Skill
              </button>
            </div>
          </div>

          {/* Education & Projects & Experience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
                <span className="font-mono font-semibold text-xs uppercase tracking-wider text-[#71717a] flex items-center gap-1.5 mb-2.5">
                  <GraduationCap className="w-4 h-4 text-[#a78bfa]" /> Education
                </span>
                <div className="space-y-2 text-xs">
                  {parsedData.education.map((edu, idx) => (
                    <div key={idx} className="p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                      <strong className="text-[#fafafa] block">{edu.degree}</strong>
                      <span className="text-[#a1a1aa] font-mono">{edu.school}</span>
                      {edu.year && <span className="text-[#71717a] block mt-0.5 font-mono">{edu.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.experience && parsedData.experience.length > 0 && (
              <div className="p-4 bg-[#0c0c0f] border border-[#27272a] rounded-[8px]">
                <span className="font-mono font-semibold text-xs uppercase tracking-wider text-[#71717a] flex items-center gap-1.5 mb-2.5">
                  <Briefcase className="w-4 h-4 text-[#a78bfa]" /> Work / Campus Roles
                </span>
                <div className="space-y-2 text-xs">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="p-2.5 bg-[#121215] rounded-[6px] border border-[#27272a]">
                      <strong className="text-[#fafafa] block">{exp.role}</strong>
                      <span className="text-[#a1a1aa] font-mono">{exp.company}</span>
                      {exp.duration && <span className="text-[#71717a] block mt-0.5 font-mono">{exp.duration}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
