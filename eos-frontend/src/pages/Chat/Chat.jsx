import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Send, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Chat({ receiverId }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Load conversation threads
  useEffect(() => {
    const loadThreads = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setThreads(res.data || []);
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    };
    if (user) loadThreads();
  }, [user]);

  // Set default active thread
  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0]._id);
    }
  }, [threads, activeThreadId]);

  // Join room for active thread
  useEffect(() => {
    if (!user || !activeThreadId) return;
    socket.emit('join-room', activeThreadId);

    return () => {
      socket.off('receive-message');
      socket.off('message-sent');
    };
  }, [user, activeThreadId]);

  // Listen for messages in active thread
  useEffect(() => {
    if (!activeThreadId) return;

    const onReceive = (msg) => {
      if (msg.threadId === activeThreadId || msg._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    };

    socket.on('receive-message', onReceive);
    socket.on('message-sent', onReceive);

    return () => {
      socket.off('receive-message', onReceive);
      socket.off('message-sent', onReceive);
    };
  }, [activeThreadId]);

  // Fetch messages for active thread
  useEffect(() => {
    if (!user || !activeThreadId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/conversation/${activeThreadId}`);
        setMessages(res.data || []);
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    };
    fetchMessages();
  }, [user, activeThreadId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !user || !activeThreadId) return;
    socket.emit('send-message', {
      threadId: activeThreadId,
      sender: user._id,
      content
    });
    setNewMessage('');
  };

  const active = threads.find((t) => t._id === activeThreadId);
  const filtered = threads.filter((t) => {
    const name =
      t.participants?.find((p) => p._id !== user?._id)?.name || 'Chat';
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-slate-200 focus-within:border-[#0066FF] transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats…"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="mt-4 space-y-2">
            {filtered.map((t) => {
              const other = t.participants?.find((p) => p._id !== user?._id);
              const name = other?.name || 'Chat';
              const last = t.lastMessage?.content || '';
              const time = t.updatedAt
                ? new Date(t.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '';
              return (
                <button
                  key={t._id}
                  onClick={() => setActiveThreadId(t._id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition-colors ${
                    activeThreadId === t._id
                      ? 'bg-blue-50/70 border-blue-100'
                      : 'bg-white/50 border-white/40 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{time}</p>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-1">{last}</p>
                </button>
              );
            })}
            {!filtered.length && (
              <p className="text-sm text-slate-500 text-center mt-4">
                No conversations yet.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2 flex flex-col min-h-[28rem]">
          <div className="pb-4 border-b border-slate-100">
            <p className="text-sm text-slate-500">Messages</p>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-1">
              {active
                ? (active.participants?.find((p) => p._id !== user?._id)?.name ||
                  'Chat')
                : 'Chat'}
            </h1>
          </div>

          <div className="flex-1 py-5 space-y-3 overflow-y-auto scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === user?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === user?._id
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#0ea5e9] text-white'
                      : 'bg-white/70 border border-white/40 text-slate-700'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="pt-4 border-t border-slate-100 flex items-center gap-3"
            onSubmit={sendMessage}
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 px-4 py-3 rounded-2xl bg-white/60 border border-slate-200 focus:border-[#0066FF] outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}