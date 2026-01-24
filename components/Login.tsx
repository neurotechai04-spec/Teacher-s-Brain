
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  // Form Fields for Signup
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  
  // Single input for Sign In
  const [signInValue, setSignInValue] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOTP) {
      setIsOTP(true);
    } else {
      if (otp.length === 6) {
        if (isSignUp) {
          onLogin({
            email,
            phone,
            name: fullName,
            username,
            dob,
            password
          });
        } else {
          onLogin({
            email: signInValue.includes('@') ? signInValue : '',
            phone: !signInValue.includes('@') ? signInValue : '',
            name: 'Student', 
            username: signInValue.split('@')[0],
            dob: '',
            password: signInPassword
          });
        }
      }
    }
  };

  const handleBackNavigation = () => {
    if (isOTP) {
      setIsOTP(false);
      setOtp('');
    } else {
      onBack();
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsOTP(false);
    setOtp('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 flex flex-col items-center justify-center p-4 overflow-y-auto py-12">
      {/* Global Back Button */}
      <div className="w-full max-w-xl mb-6">
        <button 
          onClick={handleBackNavigation}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-all group font-bold px-2"
        >
          <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="uppercase tracking-widest text-xs">{isOTP ? 'Back to Form' : 'Back to Home'}</span>
        </button>
      </div>

      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-8 md:p-12 transform transition-all animate-fadeIn">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-100 p-5 rounded-3xl text-blue-600 mb-4 shadow-inner">
            <ICONS.Brain />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center">Teacher's Brain</h1>
          <p className="text-gray-500 mt-2 text-center font-medium max-w-xs">
            {isOTP ? 'Verify your identity' : (isSignUp ? 'Create your professional student profile' : 'Continue your academic journey')}
          </p>
        </div>

        {!isOTP && (
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 shadow-inner">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                !isSignUp ? 'bg-white text-blue-600 shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                isSignUp ? 'bg-white text-blue-600 shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              SIGN UP
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isOTP ? (
            <div className="space-y-5 animate-fadeIn">
              {isSignUp ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="scholar_99"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@study.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3.59 3.59"/><path d="m21 21-6.42-6.42"/><path d="M2 12s3-7 10-7a9.71 9.71 0 0 1 5.37 1.57"/><path d="M22 12s-3 7-10 7a9.71 9.71 0 0 1-5.37-1.57"/><circle cx="12" cy="12" r="3"/><path d="m3 3 18 18"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email or Phone Number</label>
                    <input
                      type="text"
                      value={signInValue}
                      onChange={(e) => setSignInValue(e.target.value)}
                      placeholder="Enter your email or phone"
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-lg"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3.59 3.59"/><path d="m21 21-6.42-6.42"/><path d="M2 12s3-7 10-7a9.71 9.71 0 0 1 5.37 1.57"/><path d="M22 12s-3 7-10 7a9.71 9.71 0 0 1-5.37-1.57"/><circle cx="12" cy="12" r="3"/><path d="m3 3 18 18"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end pr-1">
                      <button type="button" className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">Forgot Password?</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-6">
                  Verify your device. We've sent a 6-digit verification code to <span className="font-black text-gray-900">{isSignUp ? email : signInValue}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000 000"
                  className="w-full px-4 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center text-4xl font-black tracking-[0.5em] text-blue-600"
                  required
                  autoFocus
                />
                <button 
                  type="button"
                  className="mt-8 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-[0.2em]"
                >
                  Resend Verification Code
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-2xl shadow-blue-200 flex items-center justify-center space-x-3 mt-10"
          >
            <span>{isOTP ? 'VERIFY & ENTER' : (isSignUp ? 'CREATE MY ACCOUNT' : 'SIGN IN NOW')}</span>
            {!isOTP && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
          </button>
        </form>

        {!isOTP && (
          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-sm font-bold">
              {isSignUp ? 'Already a student?' : "New to the platform?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-blue-600 font-black hover:underline ml-1"
              >
                {isSignUp ? 'SIGN IN' : 'SIGN UP FREE'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
