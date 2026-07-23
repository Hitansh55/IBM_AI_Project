import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { DynamicButton } from './components/ui/dynamic-button';
import { OriginButton } from './components/ui/origin-button';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import './App.css';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  is_pinned?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
  attachedFile?: string;
}

const TypewriterMessage = ({ text }: { text: string }) => {
  const fullText = text + ".....";
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 20); // Fast typing
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <span>
      {displayedText}
      <span className="blinking-cursor"></span>
    </span>
  );
};

const WELCOME_MESSAGES = [
  "Turn Your Notes into Knowledge. Upload a document to begin.",
  "Your Learning Journey Starts Here. Upload your study material to get started.",
  "Learn Faster. Understand Better. Upload your first PDF to begin.",
  "Smarter Learning Begins Here. Upload your notes and start learning.",
  "Your Personal AI Study Assistant. Upload a document to get started.",
  "Master Every Subject with AI. Upload your study material to begin.",
  "Everything You Need to Study Smarter. Upload your notes to get started."
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{top: number, left: number} | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      role: 'ai',
      content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
    }
  ]);
  const [documentText, setDocumentText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  // Profile & Settings State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || "John Doe");
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('userAvatar') || "👤");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempUserAvatar, setTempUserAvatar] = useState(userAvatar);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (session) {
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({data}) => {
         if (data) {
             setUserName(data.display_name || session.user.email?.split('@')[0] || "User");
             if (data.avatar_url) setUserAvatar(data.avatar_url);
         }
      });
      supabase.from('chat_sessions').select('*').order('created_at', { ascending: false }).then(({data}) => {
         if (data && data.length > 0) {
             setSessions(data);
             setCurrentSessionId(null);
         }
      });
    }
  }, [session]);

  useEffect(() => {
    if (session && currentSessionId) {
      supabase.from('messages').select('*').eq('session_id', currentSessionId).order('created_at', { ascending: true }).then(({data}) => {
         if (data && data.length > 0) {
             const formattedMessages = data.map(m => ({
                 id: m.id,
                 role: m.role as 'user' | 'ai',
                 content: m.content,
                 attachedFile: m.attached_file
             }));
             setMessages(formattedMessages);
         }
         // Do not overwrite with welcome messages if data.length === 0, 
         // because this happens momentarily when creating a new session before the first message is saved!
      });
    } else if (session && !currentSessionId) {
      setMessages([{ id: '1', role: 'ai', content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)] }]);
    }
  }, [currentSessionId, session]);

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    
    // Optimistic UI update
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
    
    // DB delete
    const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
    if (error) {
       console.error("Error deleting session:", error);
       alert("Failed to delete session.");
    }
  };

  const handleRenameClick = (e: React.MouseEvent, sessionId: string, oldTitle: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingSessionId(sessionId);
    setEditTitle(oldTitle);
  };

  const submitRename = async (sessionId: string) => {
    setEditingSessionId(null);
    if (!editTitle || editTitle.trim() === '') return;
    
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editTitle } : s));
    await supabase.from('chat_sessions').update({ title: editTitle }).eq('id', sessionId);
  };

  const handleTogglePin = async (e: React.MouseEvent, sessionId: string, currentlyPinned: boolean) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newPinned = !currentlyPinned;
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, is_pinned: newPinned } : s));
    await supabase.from('chat_sessions').update({ is_pinned: newPinned }).eq('id', sessionId);
  };

  const handleOpenProfile = () => {
    setTempUserName(userName);
    setTempUserAvatar(userAvatar);
    setShowProfileModal(true);
  };

  const handleSaveProfile = () => {
    setUserName(tempUserName);
    setUserAvatar(tempUserAvatar);
    localStorage.setItem('userName', tempUserName);
    localStorage.setItem('userAvatar', tempUserAvatar);
    setShowProfileModal(false);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('darkMode', String(checked));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempUserAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessages([{ id: '1', role: 'ai', content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)] }]);
    setDocumentText('');
    setUploadedFileName('');
    setCurrentSessionId(null);
    setShowProfileModal(false);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/extract`, {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setDocumentText(data.text);
      setUploadedFileName(file.name);
    } catch (err) {
      alert('Sorry, there was an error uploading the document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'image/png', 'image/jpeg'];
    
    if (file && (allowedTypes.includes(file.type) || file.name.match(/\.(pdf|docx?|txt|png|jpe?g)$/i))) {
      await processFile(file);
    } else if (file) {
      alert('Unsupported file type! Please drop a PDF, Word Doc, TXT, or Image.');
    }
  };

  const handleSend = async (action: string = 'chat', query: string = inputText) => {
    if (!documentText && action !== 'chat') {
       alert("Please upload a document first!");
       return;
    }
    if (!query.trim() && action === 'chat') return;

    let sessionIdToUse = currentSessionId;
    if (!sessionIdToUse) {
      const newSessionTitle = query.trim().substring(0, 30) + (query.trim().length > 30 ? '...' : '');
      const { data, error } = await supabase.from('chat_sessions').insert({
        user_id: session?.user.id,
        title: newSessionTitle
      }).select().single();
      
      if (data) {
        sessionIdToUse = data.id;
        setCurrentSessionId(data.id);
        setSessions(prev => [data, ...prev]);
      } else if (error) {
        console.error("Failed to create session:", error);
      }
    }

    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();

    let userContent = query;
    if (action === 'summarize') userContent = "Please summarize the document.";
    if (action === 'explain') userContent = "Please explain the core concepts.";
    if (action === 'quiz') userContent = "Create a quiz for me.";
    if (action === 'flashcards') userContent = "Generate flashcards.";

    setMessages(prev => [
      ...prev.filter(m => m.id !== '1'), 
      { 
        id: userMessageId, 
        role: 'user', 
        content: userContent,
        attachedFile: uploadedFileName || undefined
      }
    ]);
    
    setInputText('');
    setUploadedFileName(''); // Clear visual attachment from input box after sending

    setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: '', isStreaming: true }]);

    abortControllerRef.current = new AbortController();
    
    let accumulatedText = '';
    let buffer = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ text: documentText, action, query, session_id: sessionIdToUse }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() || '';
          
          for (const block of blocks) {
            if (block.startsWith('data: ')) {
              const dataStr = block.slice(6).trim();
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.error) throw new Error(data.error);
                
                accumulatedText += data.text;
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg
                ));
              } catch (e: any) {
                console.error("Parse error", e);
                if (e.message !== "Unexpected end of JSON input" && !e.message.includes("Unexpected token")) {
                    throw e;
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, content: accumulatedText + `\n\n*(Error: ${err.message || 'Failed to generate response'})*` } : msg
      ));
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
      ));
    }
  };

  const showQuickActions = documentText && messages[messages.length - 1]?.role === 'ai' && !messages[messages.length - 1]?.isStreaming;

  if (sessionLoading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading your workspace...</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout">
      {/* LEFT SIDEBAR (ChatGPT Style) */}
      {/* LEFT SIDEBAR */}
      <aside className={`sidebar-left ${!sidebarOpen ? 'collapsed' : ''}`}>
        {sidebarOpen ? (
          <>
            <div className="sidebar-header">
              <button className="icon-btn collapse-btn" onClick={() => setSidebarOpen(false)} title="Close sidebar">
                 ≡
              </button>
              <div className="brand-logo">
                 <img src="/logo.png" alt="Logo" className="logo-img" />
                 <strong>Elevate</strong>
              </div>
            </div>
            
            <div className="sidebar-actions">
               <OriginButton 
                 className="w-[90%] mx-auto mt-4 mb-2 justify-start"
                 onClick={() => {
                 setCurrentSessionId(null);
                 if (window.innerWidth <= 768) setSidebarOpen(false);
               }}>
                 + New chat
               </OriginButton>
            </div>
            
            <div className="history-list">
              <div className="history-group">
                <h4>Recent</h4>
                {sessions.length > 0 ? (
                  [...sessions].sort((a, b) => {
                    if (a.is_pinned && !b.is_pinned) return -1;
                    if (!a.is_pinned && b.is_pinned) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  }).map((sess) => (
                      <div 
                        key={sess.id} 
                        className={`history-item ${sess.id === currentSessionId ? 'active' : ''}`}
                        onClick={() => {
                           if (editingSessionId !== sess.id) {
                             setCurrentSessionId(sess.id);
                             if (window.innerWidth <= 768) setSidebarOpen(false);
                           }
                        }}
                      >
                        {editingSessionId === sess.id ? (
                          <input 
                             type="text" 
                             className="inline-rename-input"
                             value={editTitle}
                             onChange={(e) => setEditTitle(e.target.value)}
                             onBlur={() => submitRename(sess.id)}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') submitRename(sess.id);
                               if (e.key === 'Escape') setEditingSessionId(null);
                             }}
                             autoFocus
                             onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="history-title" title={sess.title}>{sess.is_pinned ? '📌 ' : ''}{sess.title}</span>
                        )}
                        <div className="session-menu-container">
                          <button 
                            className="session-menu-btn" 
                            onClick={(e) => { 
                               e.stopPropagation(); 
                               if (activeMenuId === sess.id) {
                                 setActiveMenuId(null);
                                 setMenuPos(null);
                               } else {
                                 const rect = e.currentTarget.getBoundingClientRect();
                                 setMenuPos({ top: rect.top, left: rect.right + 8 });
                                 setActiveMenuId(sess.id);
                               }
                            }}
                          >
                            •••
                          </button>
                          {activeMenuId === sess.id && menuPos && createPortal(
                            <div className="session-dropdown" style={{ top: menuPos.top, left: menuPos.left }}>
                               <button onClick={(e) => handleTogglePin(e, sess.id, !!sess.is_pinned)}>
                                  {sess.is_pinned ? 'Unpin' : 'Pin'}
                               </button>
                               <button onClick={(e) => handleRenameClick(e, sess.id, sess.title)}>
                                  Rename
                               </button>
                               <button onClick={(e) => handleDeleteSession(e, sess.id)} className="danger">
                                  Delete
                               </button>
                            </div>,
                            document.body
                          )}
                        </div>
                      </div>
                  ))
                ) : (
                  <div className="history-item" style={{color: 'var(--text-tertiary)', fontStyle: 'italic'}}>No recent chats</div>
                )}
              </div>
            </div>

            <div className="user-profile" onClick={handleOpenProfile}>
              <div className="avatar">
                {(userAvatar.startsWith('data:') || userAvatar.startsWith('http')) ? <img src={userAvatar} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} /> : userAvatar}
              </div>
              <div className="user-info">
                <div className="name">{userName}</div>
                <button 
                  className="sidebar-logout-btn" 
                  onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  title="Logout"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="sidebar-collapsed-content">
             <div className="top-actions">
               <button className="icon-btn collapse-hover-btn has-tooltip" onClick={() => setSidebarOpen(true)} data-tooltip="Open sidebar">
                 <span className="collapse-icon-inner">≡</span>
               </button>
               <button className="icon-btn collapsed-new-btn has-tooltip" onClick={() => setCurrentSessionId(null)} data-tooltip="New chat">
                 <span className="plus-icon-inner">+</span>
               </button>
             </div>
             
             <div className="user-profile collapsed-profile has-tooltip" data-tooltip="Profile" onClick={handleOpenProfile}>
               <div className="avatar" style={{fontSize: (userAvatar.startsWith('data:') || userAvatar.startsWith('http')) ? '0' : undefined}}>
                 {(userAvatar.startsWith('data:') || userAvatar.startsWith('http')) ? <img src={userAvatar} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} /> : userAvatar}
               </div>
             </div>
          </div>
        )}
      </aside>

      {/* MAIN CHAT AREA */}
      <main 
        className={`chat-main ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-content">
              <span className="icon">📄</span>
              <h2>Drop File here</h2>
            </div>
          </div>
        )}

        <div className="messages-container">
          <div className="messages-inner">
            {messages.length === 0 ? (
              <div className="welcome-header">
                <h2>
                  {uploadedFileName ? (
                    <><span className="breathing-dot"></span>You've attached {uploadedFileName}. What would you like to do with it?</>
                  ) : (
                    <>
                      <span className="breathing-dot"></span>Turn Your Notes into Knowledge. Upload a document to begin.<span className="typewriter-dot">...</span><span className="blinking-cursor">|</span>
                    </>
                  )}
                </h2>
              </div>
            ) : messages.map(msg => {
              if (msg.id === '1') {
                return (
                  <div key={msg.id} className="welcome-header">
                    <h2><span className="breathing-dot"></span><TypewriterMessage text={msg.content} /></h2>
                  </div>
                );
              }
              return (
                <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                  <div className="message-content">
                    <div className="bubble">
                      {msg.attachedFile && (
                        <div className="message-attachment">
                          📎 {msg.attachedFile}
                        </div>
                      )}
                      {msg.content === '' && msg.isStreaming ? (
                        <span className="typing-indicator"><span></span><span></span><span></span></span>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-area">
          {showQuickActions && (
             <div className="quick-actions-floating">
               <DynamicButton variant="secondary" icon="📝" onClick={() => setInputText('Please summarize the document.')}>Summarize</DynamicButton>
               <DynamicButton variant="secondary" icon="💡" onClick={() => setInputText('Please explain the core concepts.')}>Explain</DynamicButton>
               <DynamicButton variant="secondary" icon="🎯" onClick={() => setInputText('Create a quiz for me.')}>Quiz</DynamicButton>
               <DynamicButton variant="secondary" icon="🧠" onClick={() => setInputText('Generate flashcards.')}>Flashcards</DynamicButton>
             </div>
          )}
          <div className="input-box">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={handleFileUpload} 
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
            <button className="attach-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="loading-icon-svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="8 10 12 14 16 10" className="arrow-down"></polyline>
                </svg>
              ) : '+'}
            </button>
            {uploadedFileName && (
              <span className="dataset-tag">
                📎 {uploadedFileName}
                <button 
                  className="remove-file-btn" 
                  onClick={() => { setUploadedFileName(''); setDocumentText(''); }}
                  title="Remove file"
                >
                  ×
                </button>
              </span>
            )}
            <input 
              type="text" 
              placeholder="What do you want to summarize today?" 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend('chat')}
            />
            <button className="send-btn" onClick={() => handleSend('chat')}>
              ➤
            </button>
          </div>
        </div>
      </main>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settings</h2>
              <span className="modal-subtitle">Set or customise your preferences for the system</span>
            </div>
            <div className="modal-body">
              
              <div className="setting-row">
                <div className="setting-info">
                  <label>Display Picture</label>
                  <span>Upload a new avatar</span>
                </div>
                <div className="avatar-upload-wrapper">
                  <div className="avatar-preview">
                    {(tempUserAvatar.startsWith('data:') || tempUserAvatar.startsWith('http')) ? <img src={tempUserAvatar} alt="Avatar" /> : tempUserAvatar}
                  </div>
                  <label className="upload-btn">
                    Upload new
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleAvatarUpload} />
                  </label>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <label>Display Name</label>
                  <span>How others see you</span>
                </div>
                <input type="text" value={tempUserName} onChange={(e) => setTempUserName(e.target.value)} className="modal-input" />
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <label>Dark mode</label>
                  <span>Toggle application appearance</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={isDarkMode} onChange={(e) => handleDarkModeToggle(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

            </div>
            
            <div className="modal-footer">
              <button className="btn-logout-link" onClick={handleLogout}>Log out</button>
              <div className="footer-right">
                <button className="btn-cancel" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSaveProfile}>Save Preferences</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
