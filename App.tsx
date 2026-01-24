
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { ChatInterface } from './components/ChatInterface';
import { HistoryList } from './components/HistoryList';
import { ProfileView } from './components/ProfileView';
import { PaymentModal } from './components/PaymentModal';
import { CBTModule } from './components/CBTModule';
import { LandingPage } from './components/LandingPage';
import { EducationLevel, UserProfile, ChatMessage } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'chat' | 'cbt' | 'history' | 'bookmarks' | 'profile'>('chat');
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('tb_user');
    const savedHistory = localStorage.getItem('tb_history');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('app');
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('tb_user', JSON.stringify(user));
    else localStorage.removeItem('tb_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tb_history', JSON.stringify(history));
  }, [history]);

  const handleLogin = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      email: userData.email || '',
      phone: userData.phone || '',
      name: userData.name || 'Student',
      username: userData.username || 'student',
      dob: userData.dob || '',
      password: userData.password || '',
      level: EducationLevel.SECONDARY,
      subjects: [],
      onboarded: false,
      questionCount: 0,
      isPremium: false
    };
    setUser(newUser);
    setView('app');
  };

  const handleOnboardingComplete = (level: EducationLevel, subjects: string[], name: string) => {
    if (user) {
      setUser({ ...user, level, subjects, name, onboarded: true });
    }
  };

  const handleQuestionAsked = () => {
    if (user) {
      setUser({ ...user, questionCount: user.questionCount + 1 });
    }
  };

  const triggerUpgradeModal = () => {
    setShowPayment(true);
  };

  const handleUpgradeSuccess = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
  };

  const addMessageToHistory = (message: ChatMessage) => {
    setHistory(prev => [message, ...prev]);
  };

  const toggleBookmark = (id: string) => {
    setHistory(prev => prev.map(msg => 
      msg.id === id ? { ...msg, bookmarked: !msg.bookmarked } : msg
    ));
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setActiveTab('chat');
    setView('landing');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="animate-bounce bg-blue-600 p-4 rounded-full text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.78-3.06 2.5 2.5 0 0 1-2.41-4.23 2.5 2.5 0 0 1 .15-4.23A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.78-3.06 2.5 2.5 0 0 0 2.41-4.23 2.5 2.5 0 0 0-.15-4.23A2.5 2.5 0 0 0 14.5 2Z"/></svg>
      </div>
    </div>
  );

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('login')} onLogin={() => setView('login')} />;
  }

  if (view === 'login' && !user) {
    return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
  }

  if (user && !user.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} onLogout={handleLogout} />;
  }

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
        {activeTab === 'chat' && (
          <ChatInterface 
            user={user!} 
            onNewMessage={addMessageToHistory} 
            onQuestionAsked={handleQuestionAsked}
            onUpgrade={triggerUpgradeModal}
          />
        )}
        {activeTab === 'cbt' && (
          <CBTModule 
            user={user!}
            onUpgrade={triggerUpgradeModal}
          />
        )}
        {activeTab === 'history' && (
          <HistoryList 
            items={history.filter(m => m.role === 'assistant')} 
            onToggleBookmark={toggleBookmark}
            title="Recent Lessons"
          />
        )}
        {activeTab === 'bookmarks' && (
          <HistoryList 
            items={history.filter(m => m.role === 'assistant' && m.bookmarked)} 
            onToggleBookmark={toggleBookmark}
            title="Saved for Revision"
          />
        )}
        {activeTab === 'profile' && (
          <ProfileView 
            user={user!} 
            setUser={setUser} 
            historyCount={history.length}
            onLogout={handleLogout}
            onUpgrade={triggerUpgradeModal}
          />
        )}
      </Layout>

      {showPayment && user && (
        <PaymentModal 
          userLevel={user.level}
          onClose={() => setShowPayment(false)} 
          onSuccess={handleUpgradeSuccess} 
        />
      )}
    </>
  );
};

export default App;
