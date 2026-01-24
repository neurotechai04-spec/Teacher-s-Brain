
import React, { useState, useEffect } from 'react';
import { UserProfile, EducationLevel } from '../types';
import { ICONS, EDUCATION_LEVELS, SUBJECTS_BY_LEVEL, PREMIUM_PLANS } from '../constants';

interface ProfileViewProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  historyCount: number;
  onLogout: () => void;
  onUpgrade: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, historyCount, onLogout, onUpgrade }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedLevel, setEditedLevel] = useState(user.level);
  const [editedSubjects, setEditedSubjects] = useState(user.subjects);

  const currentPlan = PREMIUM_PLANS[user.level];

  useEffect(() => {
    if (isEditing) {
      const validSubjects = SUBJECTS_BY_LEVEL[editedLevel];
      setEditedSubjects(prev => prev.filter(s => validSubjects.includes(s)));
    }
  }, [editedLevel, isEditing]);

  const handleToggleSubject = (sub: string) => {
    setEditedSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleSave = () => {
    setUser({
      ...user,
      name: editedName,
      level: editedLevel,
      subjects: editedSubjects
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedName(user.name);
    setEditedLevel(user.level);
    setEditedSubjects(user.subjects);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 p-8 z-10">
          {isEditing && (
            <button 
              onClick={cancelEdit}
              className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
              title="Cancel Editing"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
        </div>

        <div className="absolute top-0 right-0 p-8 flex space-x-2 z-10">
          {!user.isPremium && !isEditing && (
            <button 
              onClick={onUpgrade}
              className={`px-6 py-2 text-white rounded-xl font-bold transition-all shadow-md bg-gradient-to-r ${currentPlan.color}`}
            >
              Get Premium
            </button>
          )}
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-6 py-2 rounded-xl font-bold transition-all shadow-sm ${
              isEditing 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
          <div className="relative">
            <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center text-white shadow-xl bg-gradient-to-br ${currentPlan.color}`}>
              <span className="text-4xl font-bold">{user.name[0]}</span>
            </div>
            {user.isPremium && (
              <div className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-full border-4 border-white text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-3xl font-bold text-slate-900 border-b-2 border-blue-600 outline-none w-full max-w-sm bg-transparent pb-1"
                  autoFocus
                />
              </div>
            ) : (
              <h2 className="text-4xl font-bold text-slate-900">{user.name}</h2>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-2 bg-slate-50 rounded-2xl text-slate-600 font-medium border border-slate-100">
                {user.email || user.phone}
              </span>
              {!isEditing && (
                <span className={`px-4 py-2 rounded-2xl font-bold border ${user.level === EducationLevel.PRIMARY ? 'bg-green-50 text-green-600 border-green-100' : user.level === EducationLevel.COLLEGE ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  {user.level}
                </span>
              )}
              {user.isPremium && (
                <span className="px-4 py-2 bg-amber-50 rounded-2xl text-amber-600 font-black border border-amber-100 uppercase tracking-widest text-xs flex items-center">
                  {currentPlan.name} Member
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-12 border-t border-slate-50">
          <div className="text-center md:text-left p-4">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Lessons</p>
            <p className="text-3xl font-bold text-slate-900">{historyCount}</p>
          </div>
          <div className="text-center md:text-left p-4">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Limit Used</p>
            <p className="text-3xl font-bold text-slate-900">{user.questionCount}{!user.isPremium && '/5'}</p>
          </div>
          <div className="text-center md:text-left p-4">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Subjects</p>
            <p className="text-3xl font-bold text-slate-900">{user.subjects.length}</p>
          </div>
          <div className="text-center md:text-left p-4">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">XP Points</p>
            <p className="text-3xl font-bold text-slate-900">{user.questionCount * 100}</p>
          </div>
        </div>
      </div>

      {!user.isPremium && !isEditing && (
        <div className={`rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden bg-gradient-to-br ${currentPlan.color}`}>
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-black">{currentPlan.name} Plan</h3>
            <p className="text-white/90 max-w-md text-lg">
              Unlock the full potential of Teacher's Brain for {user.level}. Unlimited questions, photo analysis, and voice notes.
            </p>
            <button 
              onClick={onUpgrade}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-[1.05] transition-all shadow-xl"
            >
              Get for {currentPlan.price}
            </button>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="space-y-8 animate-fadeIn pb-12">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Academic Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EDUCATION_LEVELS.map((ed) => (
                <button
                  key={ed.id}
                  onClick={() => setEditedLevel(ed.label as EducationLevel)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    editedLevel === ed.label 
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                      : 'border-slate-50 hover:border-blue-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">{ed.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{ed.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">{editedLevel} Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {SUBJECTS_BY_LEVEL[editedLevel].map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleToggleSubject(sub)}
                  className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all text-left ${
                    editedSubjects.includes(sub)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'border-slate-100 text-slate-400 hover:border-blue-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
             <button 
              onClick={handleSave}
              className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:scale-105 transition-all"
            >
              Save All Changes
            </button>
          </div>
        </div>
      )}

      <div className="pt-8 flex justify-center">
        <button 
          onClick={onLogout}
          className="w-full max-w-sm py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
