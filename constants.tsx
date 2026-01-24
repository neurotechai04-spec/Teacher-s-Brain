
import React from 'react';
import { EducationLevel } from './types';

export const EDUCATION_LEVELS = [
  { id: 'PRIMARY', label: EducationLevel.PRIMARY, desc: 'Simple, easy explanations for younger learners.' },
  { id: 'SECONDARY', label: EducationLevel.SECONDARY, desc: 'Exam-focused steps (WAEC, JAMB, IGCSE).' },
  { id: 'COLLEGE', label: EducationLevel.COLLEGE, desc: 'Deep technical terms and academic rigor.' }
];

export const SECONDARY_DEPARTMENTS = [
  { id: 'SCIENCE', label: 'Science Student', icon: '🔬', color: 'from-blue-500 to-cyan-600' },
  { id: 'ART', label: 'Art Student', icon: '🎭', color: 'from-purple-500 to-pink-600' },
  { id: 'COMMERCIAL', label: 'Commercial Student', icon: '💹', color: 'from-emerald-500 to-teal-600' }
];

export const SUBJECTS_BY_DEPARTMENT: Record<string, string[]> = {
  'SCIENCE': ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Agricultural Science', 'Geography', 'Computer Science'],
  'ART': ['Mathematics', 'English Language', 'Government', 'Literature in English', 'History', 'Christian Religious Studies', 'Yoruba', 'Economics'],
  'COMMERCIAL': ['Mathematics', 'English Language', 'Financial Accounting', 'Commerce', 'Economics', 'Government', 'Commerce', 'Financial Accounting']
};

export const PREMIUM_PLANS = {
  [EducationLevel.PRIMARY]: {
    name: 'Junior Explorer',
    price: '$0.99',
    perks: ['Unlimited 20-Question Exams', 'Voice Notes Enabled', 'Simple Step Explanations', 'No Daily Limits'],
    color: 'from-green-400 to-emerald-600'
  },
  [EducationLevel.SECONDARY]: {
    name: 'Exam Success',
    price: '$1.99',
    perks: ['Unlimited 20-Question Mock tests', 'WAEC/JAMB/IGCSE Logic', 'Photo Homework Uploads', 'Priority AI Thinking'],
    color: 'from-blue-500 to-indigo-600'
  },
  [EducationLevel.COLLEGE]: {
    name: 'Academic Mastery',
    price: '$2.99',
    perks: ['Unlimited Advanced Assessments', 'Technical Term Glossary', 'Citation Assistance', 'Complex Problem Solving'],
    color: 'from-indigo-600 to-violet-800'
  }
};

export const SUBJECTS_BY_LEVEL: Record<EducationLevel, string[]> = {
  [EducationLevel.PRIMARY]: [
    'Mathematics', 'English Language', 'Civic Education', 
    'Agricultural Science', 'Verbal Reasoning', 'Quantitative Reasoning', 
    'Home Economics', 'History', 'Computer Science', 'Creative Art', 
    'Physical and Health Education', 'Christian Religious Studies', 'Yoruba'
  ],
  [EducationLevel.SECONDARY]: [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 
    'Economics', 'Geography', 'Government', 'Literature in English', 
    'Further Mathematics', 'Commerce', 'Financial Accounting', 'Agricultural Science', 'Computer Science'
  ],
  [EducationLevel.COLLEGE]: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'Economics', 'Philosophy', 'Engineering', 
    'Medicine', 'Law', 'Political Science', 'Sociology', 'Psychology'
  ]
};

export const ICONS = {
  Brain: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.78-3.06 2.5 2.5 0 0 1-2.41-4.23 2.5 2.5 0 0 1 .15-4.23A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.78-3.06 2.5 2.5 0 0 0 2.41-4.23 2.5 2.5 0 0 0-.15-4.23A2.5 2.5 0 0 0 14.5 2Z"/></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  Bookmark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
  ),
  Exam: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
  ),
  Volume: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
  )
};
