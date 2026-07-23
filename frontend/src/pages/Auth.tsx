import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import './Auth.css';

const AnimatedChatWindow = () => (
  <div className="w-full max-w-md bg-cream/5 border border-cream/10 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-sm z-10">
    <div className="text-sm font-medium text-cream mb-8 flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-cork shadow-[0_0_8px_#d09355] animate-pulse" />
      Elevate AI Tutor
    </div>
    
    <div className="flex-1 flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-cream/10 p-4 rounded-2xl rounded-tl-sm text-sm text-cream/90 self-start max-w-[85%] border border-cream/5 shadow-sm"
      >
        Welcome! Let's get started. What subject are we mastering today?
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="bg-cork p-4 rounded-2xl rounded-tr-sm text-sm text-cream self-end max-w-[85%] shadow-md"
      >
        I need to study for my Biology midterms.
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.7, duration: 0.5 }}
        className="border border-cream/10 p-5 rounded-2xl mt-4 bg-mat-green-light/20 relative overflow-hidden"
      >
        <div className="text-sm text-cream mb-3 font-medium flex items-center gap-2">
          Generating Study Plan...
        </div>
        <div className="w-full h-1.5 bg-cream/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 2.8, duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-cork"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
    
    {/* Ambient glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cork/10 blur-[100px] pointer-events-none rounded-full" />
  </div>
);

export const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        alert('Check your email for the verification link, or log in if auto-confirm is enabled!');
        if (!error) setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/chat');
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex overflow-hidden font-sans">
      {/* 
        Container holds the two panels.
        Using flex-row for Login, flex-row-reverse for SignUp 
      */}
      <div className={`flex w-full h-screen transition-all duration-700 ease-in-out ${isSignUp ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* PANEL A: Animated Chat Window (mat-green) */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="hidden md:flex w-1/2 h-full bg-mat-green relative items-center justify-center p-12 overflow-hidden"
        >
          {/* Background effects for chat panel */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-0 pointer-events-none" />
          <div className="absolute inset-0 opacity-10 z-0" style={{
            backgroundImage: 'linear-gradient(rgba(245,236,217,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,236,217,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Render chat window only after layout swap finishes for clean entry, or keep it persistent */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup-chat' : 'login-chat'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md z-10"
            >
              <AnimatedChatWindow />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* PANEL B: Auth Form (cream) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="w-full md:w-1/2 h-full bg-cream flex flex-col justify-center items-center p-8 lg:p-16 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]"
        >
          <div className="w-full max-w-sm flex flex-col">
            <button 
              className="self-start text-mat-green/60 hover:text-mat-green font-medium text-sm mb-12 flex items-center gap-2 transition-colors" 
              onClick={() => navigate('/')}
            >
              &larr; Back to Home
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-mat-green mb-2">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-mat-green/70">
                {isSignUp ? 'Start your journey with Elevate AI today.' : 'Please enter your details to sign in.'}
              </p>
            </div>
            
            <button 
              className="w-full flex items-center justify-center gap-3 bg-white border border-mat-green/20 text-mat-green py-3 px-4 rounded-xl font-medium shadow-sm hover:bg-mat-green/5 transition-colors mb-6" 
              onClick={handleGoogleLogin} 
              type="button"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="flex items-center text-center mb-6 text-mat-green/40 text-sm before:content-[''] before:flex-1 before:border-b before:border-mat-green/10 after:content-[''] after:flex-1 after:border-b after:border-mat-green/10 px-2 gap-4">
              <span>or continue with email</span>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2 overflow-hidden"
                  >
                    <label className="text-sm font-medium text-mat-green">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-white border border-mat-green/20 rounded-xl px-4 py-3 text-mat-green placeholder-mat-green/40 focus:outline-none focus:border-cork focus:ring-1 focus:ring-cork transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-mat-green">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-mat-green/20 rounded-xl px-4 py-3 text-mat-green placeholder-mat-green/40 focus:outline-none focus:border-cork focus:ring-1 focus:ring-cork transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-mat-green">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-white border border-mat-green/20 rounded-xl px-4 py-3 text-mat-green placeholder-mat-green/40 focus:outline-none focus:border-cork focus:ring-1 focus:ring-cork transition-all"
                />
              </div>
              
              <button 
                className="w-full bg-cork text-cream py-3.5 px-4 rounded-xl font-medium shadow-[0_4px_14px_rgba(208,147,85,0.4)] hover:shadow-[0_6px_20px_rgba(208,147,85,0.6)] hover:bg-cork-dark transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-mat-green/70">
              {isSignUp ? (
                <p>Already have an account? <button type="button" className="text-cork font-semibold hover:underline ml-1" onClick={() => setIsSignUp(false)}>Sign in</button></p>
              ) : (
                <p>Don't have an account? <button type="button" className="text-cork font-semibold hover:underline ml-1" onClick={() => setIsSignUp(true)}>Sign up</button></p>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
