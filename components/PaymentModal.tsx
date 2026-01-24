
import React, { useState } from 'react';
import { ICONS, PREMIUM_PLANS } from '../constants';
import { EducationLevel } from '../types';

interface PaymentModalProps {
  userLevel: EducationLevel;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'card' | 'transfer' | 'ussd';

export const PaymentModal: React.FC<PaymentModalProps> = ({ userLevel, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const plan = PREMIUM_PLANS[userLevel];

  const ACCOUNT_DETAILS = {
    number: '1823975746',
    bank: 'Access Bank',
    name: 'Samuel Asepeoluwa David'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_DETAILS.number);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleComplete = () => {
    setProcessing(true);
    // Simulate payment gateway verification
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-scaleIn border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl text-white shadow-lg bg-gradient-to-br ${plan.color}`}>
              <ICONS.Brain />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">{plan.name}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Secure Checkout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Plan Summary */}
          <div className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border ${userLevel === EducationLevel.PRIMARY ? 'bg-green-50 border-green-100' : userLevel === EducationLevel.COLLEGE ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="space-y-1 text-center md:text-left">
              <h3 className={`text-lg font-black ${userLevel === EducationLevel.PRIMARY ? 'text-green-900' : userLevel === EducationLevel.COLLEGE ? 'text-indigo-900' : 'text-blue-900'}`}>{plan.name} Membership</h3>
              <p className={`text-sm font-medium ${userLevel === EducationLevel.PRIMARY ? 'text-green-700' : userLevel === EducationLevel.COLLEGE ? 'text-indigo-700' : 'text-blue-700'}`}>Full access for {userLevel}</p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className={`text-3xl font-black ${userLevel === EducationLevel.PRIMARY ? 'text-green-900' : userLevel === EducationLevel.COLLEGE ? 'text-indigo-900' : 'text-blue-900'}`}>{plan.price}</p>
              <p className={`text-xs font-bold uppercase tracking-widest ${userLevel === EducationLevel.PRIMARY ? 'text-green-600' : userLevel === EducationLevel.COLLEGE ? 'text-indigo-600' : 'text-blue-600'}`}>Single Payment</p>
            </div>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
            {plan.perks.map((perk, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm text-slate-600">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${plan.color}`}></div>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {(['card', 'transfer', 'ussd'] as PaymentMethod[]).map((m) => (
              <button 
                key={m}
                onClick={() => setMethod(m)}
                className={`py-3 rounded-xl font-bold text-sm capitalize transition-all flex flex-col items-center space-y-1 ${
                  method === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{m}</span>
              </button>
            ))}
          </div>

          {/* Card Section */}
          {method === 'card' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-lg"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                  <input type="password" placeholder="***" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono" />
                </div>
              </div>
            </div>
          )}

          {/* Transfer Section */}
          {method === 'transfer' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Bank Name</p>
                  <p className="text-xl font-black">{ACCOUNT_DETAILS.bank}</p>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black tracking-tighter text-blue-400">{ACCOUNT_DETAILS.number}</p>
                    <button 
                      onClick={handleCopy}
                      className={`p-3 rounded-xl transition-all ${copyFeedback ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'}`}
                    >
                      {copyFeedback ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Account Name</p>
                  <p className="text-lg font-bold">{ACCOUNT_DETAILS.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* USSD Section */}
          {method === 'ussd' && (
            <div className="text-center py-6 animate-fadeIn">
              <p className="text-slate-500 font-medium">Dial the code below</p>
              <div className="bg-slate-100 p-6 rounded-3xl border-2 border-dashed border-slate-300 my-4">
                <p className="text-2xl md:text-3xl font-black text-slate-900">*901*000*1823975746#</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div>
            <button 
              onClick={handleComplete}
              disabled={processing}
              className={`w-full py-5 text-white rounded-3xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 bg-gradient-to-r ${plan.color} ${processing ? 'opacity-80' : ''}`}
            >
              {processing ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Pay {plan.price} Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
