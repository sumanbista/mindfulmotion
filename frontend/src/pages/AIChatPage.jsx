// src/pages/AIChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate }           from 'react-router-dom';
import ChatSessionsList          from '../components/ChatSessionsList';
import ChatHistoryPanel         from '../components/ChatHistoryPanel';
import ChatInput                from '../components/ChatInput';
import { auth } from '../../firebase/config'; 

export default function AIChatPage() {
  const [sessions, setSessions]       = useState([]);
  const [currentSession, setCurrent]  = useState(null);
  const [history, setHistory]         = useState([]);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const bottomRef                     = useRef();
  const navigate                      = useNavigate();

  // load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/aichat/sessions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        setSessions(await res.json());
      } catch (error) {
        console.error('Error loading sessions:', error);
        navigate('/login');
      }
    };

    loadSessions();
  }, [navigate]);

  // load history when session changes
  useEffect(() => {
    if (!currentSession) return setHistory([]);

    const loadHistory = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`http://localhost:5000/api/aichat/history/${currentSession._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setHistory(await res.json());
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };

    loadHistory();
  }, [currentSession, navigate]);

  // start a brand‑new chat
  const startNewChat = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/aichat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const session = await res.json();
      setSessions([session, ...sessions]);
      setCurrent(session);
      setHistory([]);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  // send a message to AI
  const handleSend = async (text) => {
    if (!text.trim()) return;
    setSending(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/aichat/send', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: currentSession?._id, text })
      });
      const { sessionId: newSid, reply } = await res.json();

      
      if (!currentSession && newSid) {
        setCurrent({ _id: newSid, createdAt: new Date().toISOString() });
      
      }

      setHistory(h => [
        ...h,
        { role: 'user',      text,      createdAt: new Date().toISOString() },
        { role: 'assistant', text: reply, createdAt: new Date().toISOString() }
      ]);

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT: sessions list */}
      <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
        <ChatHistoryPanel
          sessions={sessions}
          onSelect={setCurrent}
          onNew={startNewChat}
        />
      </div>

      {/* RIGHT: chat window */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {currentSession
            ? `Session: ${new Date(currentSession.createdAt).toLocaleString()}`
            : 'Select or start a new chat'}
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {history.map((m,i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[75%] ${
                m.role === 'assistant'
                  ? 'bg-pink-100 self-start'
                  : 'bg-gray-100 self-end'
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <ChatInput
          onSend={handleSend}
          sending={sending}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  );
}
