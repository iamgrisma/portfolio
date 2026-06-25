"use client";

import { useState } from 'react';
import { Mail, Trash2, Eye, EyeOff, MessageSquare, Search, Calendar } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    name: 'Sita Sharma',
    email: 'sita.sharma@example.com',
    date: '2024-03-20',
    message: 'Hello Kamal, I would like to invite you as a guest speaker for our upcoming community program on animal welfare in Kamalamai municipality.',
    read: false,
  },
  {
    id: 2,
    name: 'Ram Karki',
    email: 'ram.karki@example.com',
    date: '2024-03-18',
    message: 'Dear Sir, please share more details regarding the recent policy update in the municipality regarding livestock vaccination schedules.',
    read: false,
  },
  {
    id: 3,
    name: 'Anita Thapa',
    email: 'anita.thapa@example.com',
    date: '2024-03-15',
    message: 'Namaste Kamal ji, I have a question about the upcoming veterinary camp in our area. When is it scheduled and what services will be available?',
    read: true,
  },
  {
    id: 4,
    name: 'Bijay Rai',
    email: 'bijay.rai@example.com',
    date: '2024-03-10',
    message: 'Good morning, I read your blog post about digital governance and would love to discuss potential collaboration on a similar project in our district.',
    read: true,
  },
];

export default function AdminContacts() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selected = messages.find((m) => m.id === selectedId);

  const toggleRead = (id: number) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Messages</h1>
        <p className="text-sm text-dark-300 mt-1">
          {messages.length} total • {unreadCount} unread
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-input pl-10"
        />
      </div>

      {/* Messages Layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="admin-card rounded-xl p-8 text-center">
              <MessageSquare className="w-10 h-10 text-dark-400 mx-auto mb-3" />
              <p className="text-dark-300 text-sm">No messages found.</p>
            </div>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedId(msg.id);
                  if (!msg.read) toggleRead(msg.id);
                }}
                className={`w-full text-left admin-card rounded-xl p-4 transition-all duration-300 ${
                  selectedId === msg.id
                    ? 'border-accent-500/30 bg-accent-500/5'
                    : 'hover:border-white/10'
                } ${!msg.read ? 'border-l-2 border-l-accent-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.read ? 'text-white font-semibold' : 'text-dark-100'}`}>{msg.name}</p>
                      <p className="text-[10px] text-dark-400 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-dark-400 shrink-0 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {msg.date}
                  </span>
                </div>
                <p className="text-xs text-dark-300 line-clamp-2 ml-10">{msg.message}</p>
                {!msg.read && (
                  <div className="ml-10 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 font-medium">New</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="admin-card rounded-xl p-6 sm:p-8 sticky top-4">
              <div className="flex items-start justify-between mb-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-[var(--font-heading)]">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
                      {selected.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(selected.id)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-white transition-all"
                    title={selected.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selected.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-red-400 hover:border-red-500/30 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-dark-300" />
                <span className="text-xs text-dark-300">Received: {selected.date}</span>
              </div>

              <div className="prose-dark">
                <p className="text-dark-200 leading-relaxed">{selected.message}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="admin-card rounded-xl p-16 text-center">
              <MessageSquare className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-2">Select a Message</h3>
              <p className="text-dark-300 text-sm">Click on a message to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
