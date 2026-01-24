
import React, { useState, useEffect } from 'react';
import { UserProfile, EducationLevel, QuizQuestion } from '../types';
import { ICONS, SUBJECTS_BY_DEPARTMENT, SECONDARY_DEPARTMENTS, SUBJECTS_BY_LEVEL, PREMIUM_PLANS } from '../constants';
import { generateCBTExam } from '../services/geminiService';

interface CBTModuleProps {
  user: UserProfile;
  onUpgrade: () => void;
}

export const CBTModule: React.FC<CBTModuleProps> = ({ user, onUpgrade }) => {
  const [department, setDepartment] = useState<string | null>(null); // For Secondary
  const [course, setCourse] = useState<string | null>(null); // For College
  const [subject, setSubject] = useState<string | null>(null);
  const [exam, setExam] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(1200); // 20 minutes for 20 questions

  useEffect(() => {
    let interval: number;
    if (exam && !showResults && timer > 0) {
      interval = window.setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [exam, showResults, timer]);

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      setExam(null);
    } else if (exam) {
      if (confirm("Are you sure you want to quit this exam? Your progress will be lost.")) {
        setExam(null);
        setSubject(null);
        setAnswers({});
        setCurrentIdx(0);
      }
    } else if (subject) {
      setSubject(null);
    } else if (department) {
      setDepartment(null);
    } else if (course) {
      setCourse(null);
    }
  };

  const isSecondary = user.level === EducationLevel.SECONDARY;
  const isCollege = user.level === EducationLevel.COLLEGE;

  if (!isSecondary && !isCollege) {
    return (
      <div className="p-8 md:p-12 max-w-4xl mx-auto text-center space-y-8 animate-fadeIn h-full flex flex-col justify-center">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
          <ICONS.Exam />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900">CBT Access Restricted</h2>
          <p className="text-slate-500 text-lg">
            The professional CBT Exam Center is currently optimized for **Secondary** and **University** level exam preparations.
          </p>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm text-slate-400">
            Current Level: <span className="text-slate-600 font-bold">{user.level}</span>. <br/>
            Please switch your level in your profile to try this feature.
          </div>
        </div>
      </div>
    );
  }

  const handleStart = async (selectedTopic: string) => {
    if (!user.isPremium && user.questionCount >= 5) {
      onUpgrade();
      return;
    }
    setLoading(true);
    try {
      const questions = await generateCBTExam(selectedTopic, user.level);
      setExam(questions);
      setSubject(selectedTopic);
      setTimer(1200); // 20 minutes
      setCurrentIdx(0);
      setAnswers({});
    } catch (e) {
      alert("Error generating exam. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn">
      <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center animate-spin text-blue-600">
        <ICONS.Exam />
      </div>
      <p className="text-xl font-black text-slate-900">Preparing 20 Practice Questions...</p>
      <p className="text-slate-400 font-medium text-center max-w-sm px-4">Teacher's Brain is analyzing professional curricula. This might take a moment.</p>
    </div>
  );

  if (isSecondary) {
    if (!department) return (
      <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 animate-fadeIn h-full overflow-y-auto">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
            <ICONS.Exam />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">Secondary Exam Center</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Get 20 standard exam-style questions for WAEC, JAMB, or IGCSE prep.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SECONDARY_DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setDepartment(dept.id)}
              className={`p-10 rounded-[3rem] text-center border-2 transition-all hover:scale-[1.02] group bg-white border-slate-100 hover:border-blue-400 hover:shadow-2xl active:scale-95`}
            >
              <div className={`w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-4xl mb-6 shadow-lg bg-gradient-to-br ${dept.color} text-white`}>
                {dept.icon}
              </div>
              <p className="font-black text-slate-900 text-2xl group-hover:text-blue-600">{dept.label}</p>
              <p className="text-xs text-slate-400 font-bold uppercase mt-3 tracking-widest">Select Category</p>
            </button>
          ))}
        </div>
      </div>
    );

    if (!exam) return (
      <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 animate-fadeIn h-full overflow-y-auto">
        <div className="flex items-center space-x-4">
          <button onClick={goBack} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            <span className="ml-2 text-sm font-bold">Back</span>
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900">{department} Subjects</h2>
            <p className="text-slate-400 font-medium">Choose a subject for your 20-question mock test.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS_BY_DEPARTMENT[department].map(sub => (
            <button
              key={sub}
              onClick={() => handleStart(sub)}
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left hover:border-blue-400 hover:shadow-xl transition-all group active:scale-95"
            >
              <p className="font-black text-slate-900 text-xl group-hover:text-blue-600">{sub}</p>
              <p className="text-xs text-slate-400 font-bold uppercase mt-2">Start 20 Practice Questions</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isCollege) {
    if (!course) return (
      <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 animate-fadeIn h-full overflow-y-auto">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
            <ICONS.Exam />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">University CBT Center</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Select your major for a specialized 20-question academic assessment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS_BY_LEVEL[EducationLevel.COLLEGE].map(c => (
            <button
              key={c}
              onClick={() => setCourse(c)}
              className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] text-center hover:border-indigo-400 hover:shadow-2xl transition-all group active:scale-95"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <ICONS.User />
              </div>
              <p className="font-black text-slate-900 text-2xl">{c}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Select Major</p>
            </button>
          ))}
        </div>
      </div>
    );

    if (!exam) return (
      <div className="p-8 md:p-12 max-w-4xl mx-auto text-center space-y-8 animate-fadeIn h-full flex flex-col justify-center">
         <div className="flex items-center space-x-4 mb-4 text-left">
          <button onClick={goBack} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            <span className="ml-2 text-sm font-bold">Back</span>
          </button>
        </div>
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ICONS.Exam />
        </div>
        <h2 className="text-4xl font-black text-slate-900">Ready for 20 questions in {course}?</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Teacher's Brain has prepared a professional academic assessment for the **{course}** level curriculum.
        </p>
        <div className="pt-8">
          <button 
            onClick={() => handleStart(course)} 
            className="px-16 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:scale-[1.05] transition-all active:scale-95"
          >
            Start Exam Now
          </button>
        </div>
        {!user.isPremium && (
          <p className="text-amber-600 font-bold text-sm">
            Note: You have {5 - user.questionCount} free academic sessions remaining today.
          </p>
        )}
      </div>
    );
  }

  if (showResults) {
    const score = exam.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const categoryName = isSecondary ? `${department} Category` : `${course} Program`;
    const themeColor = isSecondary ? 'blue' : 'indigo';
    const plan = PREMIUM_PLANS[user.level];

    return (
      <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24 h-full overflow-y-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={goBack} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            <span className="ml-2 text-sm font-bold">Exit Results</span>
          </button>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Progress Report</h2>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${isSecondary ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <span className="text-5xl font-black">{Math.round((score / exam.length) * 100)}%</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Subject: {subject}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-12">{categoryName} • Score: {score} / {exam.length}</p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
            <button 
              onClick={() => setExam(null)} 
              className={`px-12 py-5 text-white rounded-[2rem] font-black text-lg shadow-xl hover:scale-[1.02] transition-all active:scale-95 ${isSecondary ? 'bg-blue-600 shadow-blue-100' : 'bg-indigo-600 shadow-indigo-100'}`}
            >
              Take Another 20 Questions
            </button>
            <button 
              onClick={() => {setExam(null); isSecondary ? setDepartment(null) : setCourse(null);}} 
              className="px-12 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-lg shadow-lg hover:bg-slate-200 transition-all active:scale-95"
            >
              Change {isSecondary ? 'Department' : 'Course'}
            </button>
          </div>

          {!user.isPremium && (
            <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4 max-w-lg mx-auto">
              <p className="font-black text-amber-900">Want Unlimited 20-Question Tests?</p>
              <p className="text-sm text-amber-700">Get unlimited academic practice for only <span className="font-bold">{plan.price}</span>. Extremely affordable learning!</p>
              <button 
                onClick={onUpgrade}
                className={`w-full py-4 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 bg-gradient-to-r ${plan.color}`}
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 px-4">Detailed Review & Professional Logic</h3>
          {exam.map((q, i) => (
            <div key={i} className="bg-white rounded-[3rem] p-10 border border-slate-100 space-y-8 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xl font-black text-slate-900 leading-tight pr-8">{i + 1}. {q.question}</p>
                {answers[i] === q.correctIndex ? (
                  <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shrink-0">Correct</span>
                ) : (
                  <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shrink-0">Review Needed</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`p-6 rounded-2xl border-2 font-bold text-lg ${
                    oi === q.correctIndex ? 'border-green-500 bg-green-50 text-green-900' :
                    oi === answers[i] ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-50 text-slate-400'
                  }`}>
                    <span className="opacity-50 mr-3">{String.fromCharCode(65 + oi)}.</span> {opt}
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-slate-100">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${isSecondary ? 'text-blue-400' : 'text-indigo-400'}`}>Teacher's Brain Logic Analysis</h4>
                <div className="space-y-4 font-mono text-sm leading-relaxed">
                  {q.workings && q.workings.length > 0 && q.workings.map((step, si) => (
                    <div key={si} className="flex space-x-4">
                      <span className={`font-black ${isSecondary ? 'text-blue-500' : 'text-indigo-500'}`}>{si + 1} ➜</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <p className="text-slate-300 italic text-sm">
                    <span className="text-white font-black not-italic uppercase tracking-widest mr-2">Core Concept:</span> {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = exam[currentIdx];
  const themeColorClass = isSecondary ? 'blue' : 'indigo';

  return (
    <div className="flex flex-col h-full bg-white relative animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="p-6 md:px-12 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="flex items-center space-x-6">
          <button onClick={goBack} className="p-3 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center active:scale-95 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            <span className="ml-2 text-xs font-bold hidden sm:inline">Quit Exam</span>
          </button>
          <div>
            <h3 className="font-black text-slate-900 text-lg">{subject}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isSecondary ? department : course} • Q{currentIdx + 1} of {exam.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Time Remaining</p>
            <p className={`font-mono text-2xl font-black ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{formatTime(timer)}</p>
          </div>
          <button 
            onClick={() => { if(confirm("Submit your exam now for professional assessment?")) setShowResults(true) }} 
            className={`text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${isSecondary ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{currentQ.question}</h2>
            <div className="grid grid-cols-1 gap-5">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                  className={`p-8 rounded-[2.5rem] border-2 text-left transition-all flex items-center group active:scale-[0.98] ${
                    answers[currentIdx] === i 
                      ? `border-${themeColorClass}-600 bg-${themeColorClass}-50 ring-8 ring-${themeColorClass}-50/50 shadow-2xl` 
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-6 border-2 transition-all text-lg ${
                    answers[currentIdx] === i ? `bg-${themeColorClass}-600 border-${themeColorClass}-600 text-white` : 'bg-white border-slate-100 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-xl font-bold ${answers[currentIdx] === i ? `text-${themeColorClass}-900` : 'text-slate-600'}`}>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-8 border-t border-slate-100 flex items-center justify-center space-x-6 bg-slate-50/50 backdrop-blur-md">
        <button 
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(c => c - 1)}
          className="p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-lg active:scale-90"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex space-x-2">
          {exam.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIdx ? `w-12 bg-${themeColorClass}-600` : 
              answers[i] !== undefined ? `w-4 bg-${themeColorClass}-200` : 'w-4 bg-slate-200'
            }`}></div>
          ))}
        </div>
        <button 
          onClick={() => {
            if (currentIdx === exam.length - 1) setShowResults(true);
            else setCurrentIdx(c => c + 1);
          }}
          className={`p-5 text-white rounded-[1.5rem] shadow-2xl hover:scale-110 transition-all active:scale-90 ${isSecondary ? 'bg-blue-600 shadow-blue-100' : 'bg-indigo-600 shadow-indigo-100'}`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};
