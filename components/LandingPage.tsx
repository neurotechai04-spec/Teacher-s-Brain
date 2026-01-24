
import React from 'react';
import { ICONS, EDUCATION_LEVELS, PREMIUM_PLANS } from '../constants';
import { EducationLevel } from '../types';

interface LandingPageProps {
  onEnter: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <ICONS.Brain />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Teacher's Brain</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Features</a>
            <a href="#levels" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Levels</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onLogin} className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-widest">Login</button>
            <button 
              onClick={onEnter} 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em] animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>The Professional AI Academic Suite</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] animate-fadeIn delay-100">
            Learn Smarter.<br/><span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Logic first.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed animate-fadeIn delay-200">
            The intelligent AI tutor that doesn't just give answers—it provides professional logic, full math workings, and exam prep for every level.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fadeIn delay-300">
            <button 
              onClick={onEnter} 
              className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Start Learning Now
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-12 py-5 bg-white text-slate-600 border border-slate-200 rounded-3xl font-black text-xl hover:bg-slate-50 transition-all"
            >
              See Features
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Students', val: '10K+' },
            { label: 'Exam Questions', val: '50K+' },
            { label: 'Academic Levels', val: '3' },
            { label: 'Satisfaction', val: '99%' },
          ].map(stat => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Core Intelligence</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Built for Professional Scholars.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Math Workings', desc: 'Rigorous step-by-step logic for complex calculations.', icon: '🔢', color: 'from-blue-500 to-blue-600' },
              { title: 'Essay Mastery', desc: 'Professional outlines and drafts for reports and projects.', icon: '✍️', color: 'from-indigo-500 to-indigo-600' },
              { title: 'CBT Practice', desc: 'Unlimited 20-question mock exams for exam success.', icon: '📝', color: 'from-violet-500 to-violet-600' },
              { title: 'Multi-Modal', desc: 'Upload images of homework or send professional voice notes.', icon: '🎙️', color: 'from-emerald-500 to-emerald-600' }
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[3rem] hover:border-blue-200 hover:shadow-2xl transition-all space-y-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-100`}>
                  {f.icon}
                </div>
                <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Adaptability */}
      <section id="levels" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 md:mx-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <ICONS.Brain />
        </div>
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Adaptive Learning</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Intelligence that adapts to you.</h3>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Teacher's Brain adjusts its logic, vocabulary, and depth based on your education level. From simple primary concepts to technical college rigor.
              </p>
              <div className="space-y-4">
                {EDUCATION_LEVELS.map(level => (
                  <div key={level.id} className="flex items-center space-x-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-black">{level.label[0]}</div>
                    <div>
                      <p className="font-black text-lg">{level.label}</p>
                      <p className="text-slate-500 text-sm font-medium">{level.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-[4rem] aspect-square shadow-2xl flex items-center justify-center">
                <div className="p-12 space-y-6 text-center">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl inline-block mb-4">
                    <ICONS.Brain />
                  </div>
                  <p className="text-3xl font-black tracking-tight leading-tight">One brain, three levels of mastery.</p>
                  <button onClick={onEnter} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">Select Your Level</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - "Extremely Affordable" */}
      <section id="pricing" className="py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Invest in your future</h2>
            <h3 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Extremely Affordable.</h3>
            <p className="text-slate-500 text-xl font-medium">Quality education shouldn't be expensive. Unlock premium for the cost of a snack.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(PREMIUM_PLANS).map(([lvl, plan]) => (
              <div key={lvl} className="relative group p-12 bg-white border border-slate-100 rounded-[3.5rem] hover:border-blue-200 hover:shadow-3xl transition-all">
                <div className={`absolute top-0 right-0 p-8 text-xs font-black uppercase tracking-widest opacity-20`}>{lvl}</div>
                <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">{plan.name}</h4>
                <div className="flex items-baseline space-x-1 mb-8">
                  <span className="text-6xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 font-bold uppercase text-xs">/ life</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.perks.map(perk => (
                    <li key={perk} className="flex items-center space-x-3 text-slate-600 font-bold text-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-500"><path d="m5 12 5 5L20 7"/></svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onEnter}
                  className={`w-full py-5 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all bg-gradient-to-br ${plan.color}`}
                >
                  Join {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <ICONS.Brain />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">Teacher's Brain</span>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">&copy; 2025 Professional Academic Solutions.</p>
          </div>
          <div className="flex space-x-10">
            <a href="#" className="text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest">Terms</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest">Support</a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-8 left-6 right-6 z-50">
        <button 
          onClick={onEnter}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-3xl flex items-center justify-center space-x-3"
        >
          <span>Get Started Free</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};
