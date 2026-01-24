
import React, { useState } from 'react';
import { EDUCATION_LEVELS, SUBJECTS_BY_LEVEL } from '../constants';
import { EducationLevel } from '../types';

interface OnboardingProps {
  onComplete: (level: EducationLevel, subjects: string[], name: string) => void;
  onLogout: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLogout }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EducationLevel | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleToggleSubject = (sub: string) => {
    setSelectedSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleBack = () => {
    if (step === 1) {
      if (confirm("Go back to the welcome screen? You will be signed out.")) {
        onLogout();
      }
    } else {
      setStep(s => s - 1);
    }
  };

  const handleNext = () => {
    if (step === 1 && name) setStep(2);
    else if (step === 2 && level) setStep(3);
    else if (step === 3 && selectedSubjects.length > 0) {
      onComplete(level!, selectedSubjects, name);
    }
  };

  const currentSubjectOptions = level ? SUBJECTS_BY_LEVEL[level] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col transform transition-all animate-scaleIn">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 flex">
          <div className="bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="p-8 md:p-16 flex-1 max-h-[75vh] overflow-y-auto scrollbar-hide">
          <div className="mb-10">
             <button 
              onClick={handleBack}
              className="flex items-center text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest mb-4 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              {step === 1 ? 'Exit Setup' : 'Previous Step'}
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">What should I call you?</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">I'm your new professional AI teacher. Let's start with your preferred name for certificates and history.</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-2xl font-black outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-300"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Education Level</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">I'll adjust my professional logic, vocabulary, and teaching rigor to match your level.</p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {EDUCATION_LEVELS.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => {
                      setLevel(ed.label as EducationLevel);
                      setSelectedSubjects([]); 
                    }}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                      level === ed.label 
                        ? 'border-blue-600 bg-blue-50 ring-8 ring-blue-50 shadow-xl' 
                        : 'border-slate-100 hover:border-blue-200 bg-white'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 p-6 text-blue-600 transition-opacity ${level === ed.label ? 'opacity-100' : 'opacity-0'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m5 12 5 5L20 7"/></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{ed.label}</h3>
                    <p className={`font-medium mt-1 ${level === ed.label ? 'text-blue-600' : 'text-slate-400'}`}>{ed.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{level} Subjects</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Select the core subjects you're currently prioritizing for study and exams.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSubjectOptions.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleToggleSubject(sub)}
                    className={`p-5 rounded-2xl border-2 text-left font-black transition-all ${
                      selectedSubjects.includes(sub)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-blue-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 md:p-12 border-t bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest hidden sm:block">Step {step} of 3</p>
          <button
            onClick={handleNext}
            disabled={(step === 1 && !name) || (step === 2 && !level) || (step === 3 && selectedSubjects.length === 0)}
            className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>{step === 3 ? 'Finish & Start Learning' : 'Continue'}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
