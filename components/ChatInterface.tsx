
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { UserProfile, ChatMessage, Attachment } from '../types';
import { askTeacher } from '../services/geminiService';

interface ChatInterfaceProps {
  user: UserProfile;
  onNewMessage: (msg: ChatMessage) => void;
  onQuestionAsked: () => void;
  onUpgrade: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onNewMessage, onQuestionAsked, onUpgrade }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const QUESTION_LIMIT = 5;
  const isLimitReached = user.questionCount >= QUESTION_LIMIT && !user.isPremium;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, attachments]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, {
            data: reader.result as string,
            mimeType: 'audio/webm',
            name: `Voice Question`
          }]);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);
      timerRef.current = window.setInterval(() => setRecordDuration(d => d + 1), 1000);
    } catch (err) { alert("Mic access needed."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const finalInput = customInput || input;
    if ((!finalInput.trim() && attachments.length === 0) || isTyping || isLimitReached) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput || (attachments.length > 0 ? "Analyzed content request" : ""),
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    try {
      const historyStrings = messages.slice(-4).map(m => m.content);
      const result = await askTeacher(finalInput, user.level, historyStrings, attachments);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.summary,
        structuredContent: result,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
      onNewMessage(assistantMsg);
      onQuestionAsked();
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered a problem processing your request. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCBTAnswer = (msgId: string, index: number) => {
    setSelectedAnswers(prev => ({ ...prev, [msgId]: index }));
  };

  const goBackToHub = () => {
    if (messages.length > 0 && confirm("Do you want to end this academic session and return to the hub?")) {
      setMessages([]);
      setSelectedAnswers({});
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header with Back Arrow when in chat */}
      {messages.length > 0 && (
        <div className="p-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center sticky top-0 z-20">
          <button 
            onClick={goBackToHub}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all mr-3 flex items-center"
            title="Return to Hub"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            <span className="ml-1 text-sm font-bold">Back to Hub</span>
          </button>
          <div className="flex items-center space-x-2 ml-auto">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center scale-75">
              <ICONS.Brain />
            </div>
            <span className="font-black text-slate-900 hidden sm:block">Academic Session</span>
          </div>
        </div>
      )}

      <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide ${messages.length > 0 ? 'pb-48' : ''}`}>
        {messages.length === 0 && (
          <div className="max-w-4xl mx-auto text-center mt-12 md:mt-20 space-y-8 px-4">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <ICONS.Brain />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight md:text-5xl">Academic Hub</h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Select a tool below to begin your professional academic analysis or mock practice.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { label: 'CBT Practice', sub: 'Generate exam-style questions', icon: '📝' },
                { label: 'Essay Writer', sub: 'Professional outlines & drafts', icon: '✍️' },
                { label: 'Math Workings', sub: 'Step-by-step calculations', icon: '🔢' },
                { label: 'Report Helper', sub: 'Term papers & assignments', icon: '📊' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleSend(undefined, `${item.label} on a topic of your choice`)}
                  className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left hover:border-blue-400 hover:shadow-2xl transition-all group active:scale-95"
                >
                  <span className="text-3xl mb-4 block">{item.icon}</span>
                  <p className="font-black text-slate-900 text-xl group-hover:text-blue-600">{item.label}</p>
                  <p className="text-sm text-slate-400 font-bold uppercase mt-1 tracking-tight">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn max-w-6xl mx-auto w-full`}>
            <div className={`w-full md:w-[90%] lg:w-[85%] rounded-[2.5rem] overflow-hidden ${
              msg.role === 'user' ? 'bg-blue-600 text-white p-6 shadow-xl ml-auto' : 'bg-white border border-slate-100 shadow-sm'
            }`}>
              {msg.role === 'assistant' && msg.structuredContent ? (
                <div className="flex flex-col">
                  {/* Meaning / Abstract Header */}
                  <div className="p-8 border-b border-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Academic Analysis</span>
                      <button onClick={() => {}} className="text-slate-300 hover:text-blue-600"><ICONS.Volume /></button>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4">{msg.structuredContent.meaning}</h3>
                    <div className="flex flex-wrap gap-2">
                      {msg.structuredContent.keyConcepts.map(c => (
                        <span key={c} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Writing Outline */}
                  {msg.structuredContent.outline && (
                    <div className="p-8 bg-slate-50/50 border-b border-slate-50">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Proposed Document Outline</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {msg.structuredContent.outline.map((item, i) => (
                          <div key={i} className="flex items-center space-x-3 text-slate-700 font-bold">
                            <span className="text-blue-500">{i + 1}.</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workings / Body */}
                  <div className="p-8 bg-slate-900 text-slate-100">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                      Detailed Workings & Logical Proofs <div className="ml-4 flex-1 h-[1px] bg-slate-800"></div>
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {msg.structuredContent.steps.map((step, i) => (
                        <div key={i} className="flex space-x-4">
                          <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-blue-400 shrink-0">{i+1}</span>
                          <p className="text-sm font-mono leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CBT Quiz Module */}
                  {msg.structuredContent.quiz && (
                    <div className="p-8 border-t border-slate-50 bg-blue-50/30">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">CBT Practice Module</h4>
                      <p className="font-black text-slate-900 mb-6 text-lg">{msg.structuredContent.quiz.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {msg.structuredContent.quiz.options.map((opt, i) => {
                          const isSelected = selectedAnswers[msg.id] === i;
                          const isCorrect = i === msg.structuredContent?.quiz?.correctIndex;
                          const showResult = selectedAnswers[msg.id] !== undefined;

                          return (
                            <button
                              key={i}
                              disabled={showResult}
                              onClick={() => handleCBTAnswer(msg.id, i)}
                              className={`p-5 rounded-2xl border-2 text-left transition-all font-bold ${
                                !showResult ? 'bg-white border-slate-100 hover:border-blue-300 active:scale-98' :
                                isCorrect ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' :
                                isSelected ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100' : 'bg-white border-slate-100 opacity-50'
                              }`}
                            >
                              <span className="mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span> {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Examples & Summary */}
                  <div className="p-8 flex flex-col md:flex-row gap-8 border-t border-slate-50">
                    <div className="flex-1 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Examples</h4>
                      <ul className="space-y-3">
                        {msg.structuredContent.examples.map((ex, i) => (
                          <li key={i} className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl italic font-medium border border-slate-100">"{ex}"</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-1 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Conclusion</h4>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-900 font-black leading-relaxed">{msg.structuredContent.summary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-lg leading-relaxed">{msg.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start max-w-6xl mx-auto w-full">
            <div className="bg-white px-8 py-5 rounded-full shadow-sm border border-slate-100 flex items-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="max-w-4xl mx-auto">
          {!isLimitReached ? (
            <div className="relative">
              {isRecording && (
                <div className="absolute -top-16 left-0 right-0 flex items-center justify-center space-x-4">
                  <div className="bg-red-500 px-6 py-3 rounded-full text-white font-black animate-pulse shadow-2xl flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>Recording: {recordDuration}s</span>
                  </div>
                  <button onClick={stopRecording} className="bg-white p-3 rounded-full shadow-2xl border border-red-100 text-red-500 hover:bg-red-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><rect width="12" height="12" x="6" y="6" rx="2"/></svg>
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="bg-white p-3 pl-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center space-x-3">
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => {}} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-300 hover:text-blue-600"><ICONS.Bookmark /></button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Listening..." : "Request Essay, CBT, or Math help..."}
                  disabled={isRecording}
                  className="flex-1 py-4 text-lg outline-none font-medium bg-transparent"
                />
                {!input && attachments.length === 0 ? (
                  <button type="button" onClick={startRecording} className="p-4 bg-blue-50 text-blue-600 rounded-3xl hover:bg-blue-100 transition-all active:scale-95"><ICONS.Mic /></button>
                ) : (
                  <button type="submit" className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"><ICONS.Send /></button>
                )}
              </form>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-3xl text-center font-black text-amber-600 border border-amber-100 shadow-xl animate-pulse">
              Trial usage complete. Please upgrade for professional features.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
