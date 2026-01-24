
import React from 'react';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'chat' | 'cbt' | 'history' | 'bookmarks' | 'profile';
  setActiveTab: (tab: 'chat' | 'cbt' | 'history' | 'bookmarks' | 'profile') => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const NavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-6">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <ICONS.Brain />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Teacher's Brain
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="chat" icon={ICONS.Brain} label="Ask Teacher" />
          <NavItem id="cbt" icon={ICONS.Exam} label="CBT Center" />
          <NavItem id="history" icon={ICONS.History} label="Learning History" />
          <NavItem id="bookmarks" icon={ICONS.Bookmark} label="Saved Topics" />
          <NavItem id="profile" icon={ICONS.User} label="My Profile" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <ICONS.Brain />
            </div>
            <span className="font-bold text-lg">Teacher's Brain</span>
          </div>
          <button onClick={() => setActiveTab('profile')} className="p-2 text-slate-500">
            <ICONS.User />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex items-center justify-around p-3 bg-white border-t">
          <button onClick={() => setActiveTab('chat')} className={`p-2 ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'}`}>
            <ICONS.Brain />
          </button>
          <button onClick={() => setActiveTab('cbt')} className={`p-2 ${activeTab === 'cbt' ? 'text-blue-600' : 'text-slate-400'}`}>
            <ICONS.Exam />
          </button>
          <button onClick={() => setActiveTab('history')} className={`p-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-400'}`}>
            <ICONS.History />
          </button>
          <button onClick={() => setActiveTab('bookmarks')} className={`p-2 ${activeTab === 'bookmarks' ? 'text-blue-600' : 'text-slate-400'}`}>
            <ICONS.Bookmark />
          </button>
        </nav>
      </main>
    </div>
  );
};
