import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
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
        // Fallback: switch to login mode so they can just log in
        if (!error) setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-brand">
           <img src="/logo.png" alt="Logo" className="auth-logo" />
           <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        </div>
        <p className="auth-subtitle">
          {isSignUp ? 'Join AI Study Buddy to persist your notes and chat history.' : 'Sign in to access your knowledge base.'}
        </p>
        
        <form onSubmit={handleAuth} className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button className="btn-save" type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button className="btn-google" onClick={handleGoogleLogin} type="button">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: 18, height: 18, marginRight: 8}} />
          Continue with Google
        </button>
        
        <div className="auth-switch">
          {isSignUp ? (
            <p>Already have an account? <button type="button" className="btn-logout-link" onClick={() => setIsSignUp(false)}>Sign in</button></p>
          ) : (
            <p>Don't have an account? <button type="button" className="btn-logout-link" onClick={() => setIsSignUp(true)}>Sign up</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
