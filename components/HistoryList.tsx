
import React from 'react';
import { ChatMessage } from '../types';
import { ICONS } from '../constants';

interface HistoryListProps {
  items: ChatMessage[];
  onToggleBookmark: (id: string) => void;
  title: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onToggleBookmark, title }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <ICONS.History />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 max-w-xs">No entries found yet. Start chatting with Teacher's Brain to build your history!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {item.structuredContent?.meaning || item.content.slice(0, 60) + '...'}
                </h3>
              </div>
              <button 
                onClick={() => onToggleBookmark(item.id)}
                className={`p-2 rounded-xl transition-all ${
                  item.bookmarked 
                    ? 'text-blue-600 bg-blue-50 shadow-inner' 
                    : 'text-slate-300 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <ICONS.Bookmark />
              </button>
            </div>

            {item.structuredContent && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.structuredContent.keyConcepts.slice(0, 3).map((concept, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {concept}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <p className="text-slate-500 text-sm italic">
                {item.structuredContent?.summary.slice(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
