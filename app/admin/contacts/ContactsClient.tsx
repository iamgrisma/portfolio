'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Trash2, Eye, EyeOff, MessageSquare, Search, Calendar, Phone, Dog, Syringe, Scissors, CheckCircle, Clock, XCircle, ChevronDown, Send } from 'lucide-react';
import { deleteContact, toggleContactRead, updateBookingStatus, sendEmailReply } from './actions';

type ContactReply = {
  id: number;
  subject: string;
  message: string;
  createdAt: Date | null;
};

type ContactRecord = {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  animalType: string | null;
  date: string | null;
  time: string | null;
  message: string | null;
  status: string;
  read: boolean;
  createdAt: Date | null;
  replies?: ContactReply[];
};

export default function ContactsClient({ initialContacts }: { initialContacts: ContactRecord[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'booking'>('all');
  const [isPending, startTransition] = useTransition();

  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    setIsReplying(false);
    setReplyMessage('');
    setReplySubject('');
  }, [selectedId]);

  const selected = initialContacts.find((m) => m.id === selectedId);

  const handleToggleRead = (id: number, current: boolean) => {
    startTransition(async () => {
      await toggleContactRead(id, current);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    startTransition(async () => {
      await deleteContact(id);
      if (selectedId === id) setSelectedId(null);
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    startTransition(async () => {
      await updateBookingStatus(id, status);
    });
  };

  const filtered = initialContacts.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.message && m.message.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || m.type === activeTab;

    return matchesSearch && matchesTab;
  });

  const unreadCount = initialContacts.filter((m) => !m.read).length;
  const newBookingsCount = initialContacts.filter((m) => m.type === 'booking' && m.status === 'pending').length;

  const getStatusColor = (status: string) => {
    if (status === 'confirmed') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (status === 'completed') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (status === 'cancelled') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20'; // pending
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Messages & Bookings</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-dark-300">
              {initialContacts.length} total
            </p>
            <span className="w-1 h-1 rounded-full bg-dark-500"></span>
            <p className="text-sm text-accent-400 font-medium">
              {unreadCount} unread
            </p>
            {newBookingsCount > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-dark-500"></span>
                <p className="text-sm text-amber-400 font-medium">
                  {newBookingsCount} pending bookings
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-dark-300 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('booking')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'booking' ? 'bg-accent-500 text-white shadow-sm' : 'text-dark-300 hover:text-white'}`}
          >
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-white/10 text-white shadow-sm' : 'text-dark-300 hover:text-white'}`}
          >
            Messages
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="admin-card rounded-xl p-8 text-center">
              <MessageSquare className="w-10 h-10 text-dark-400 mx-auto mb-3" />
              <p className="text-dark-300 text-sm">No items found.</p>
            </div>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedId(msg.id);
                  if (!msg.read) handleToggleRead(msg.id, msg.read);
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
                      <p className="text-[10px] text-dark-400 truncate flex items-center gap-1">
                        {msg.type === 'booking' ? <span className="text-amber-400 font-medium">Booking</span> : 'Message'} • {msg.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-dark-400 shrink-0 flex items-center gap-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {msg.type === 'booking' ? (
                  <div className="ml-10">
                    <p className="text-xs text-dark-200">
                      <span className="font-medium text-dark-100">{msg.service}</span> • {msg.date} {msg.time && `(${msg.time})`}
                    </p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-dark-300 line-clamp-2 ml-10">{msg.message}</p>
                )}
              </button>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="admin-card rounded-xl p-6 sm:p-8 sticky top-4 animate-fade-in-up">
              <div className="flex items-start justify-between mb-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-[var(--font-heading)] flex items-center gap-2">
                      {selected.name}
                      {selected.type === 'booking' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-500/20 text-accent-400 border border-accent-500/30">
                          Booking Request
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${selected.email}`} className="text-sm text-dark-200 hover:text-accent-400 transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selected.email}
                      </a>
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`} className="text-sm text-dark-200 hover:text-accent-400 transition-colors flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {selected.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleRead(selected.id, selected.read)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-white transition-all"
                    title={selected.read ? 'Mark as unread' : 'Mark as read'}
                    disabled={isPending}
                  >
                    {selected.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-red-400 hover:border-red-500/30 transition-all"
                    title="Delete"
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selected.type === 'booking' && (
                <div className="mb-6 grid grid-cols-2 gap-4 bg-white/5 border border-white/5 rounded-xl p-5">
                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Service</p>
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      {selected.service === 'Consultation' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                      {selected.service === 'Vaccination' && <Syringe className="w-4 h-4 text-teal-400" />}
                      {selected.service === 'Surgery' && <Scissors className="w-4 h-4 text-rose-400" />}
                      {selected.service === 'Farm Visit' && <Dog className="w-4 h-4 text-amber-400" />}
                      {selected.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Animal</p>
                    <p className="text-sm text-white font-medium">{selected.animalType || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Preferred Date</p>
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-400" /> {selected.date || 'Any'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Preferred Time</p>
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent-400" /> {selected.time || 'Any'}
                    </p>
                  </div>
                  <div className="col-span-2 pt-3 mt-1 border-t border-white/5 flex items-center justify-between">
                    <p className="text-xs text-dark-400 uppercase tracking-wider font-bold">Status</p>
                    <div className="relative">
                      <select 
                        className={`appearance-none bg-transparent font-bold text-xs uppercase tracking-wider pl-3 pr-8 py-1 rounded-full border cursor-pointer outline-none ${getStatusColor(selected.status)}`}
                        value={selected.status}
                        onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                        disabled={isPending}
                      >
                        <option className="bg-dark-800 text-white" value="pending">Pending</option>
                        <option className="bg-dark-800 text-white" value="confirmed">Confirmed</option>
                        <option className="bg-dark-800 text-white" value="completed">Completed</option>
                        <option className="bg-dark-800 text-white" value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${getStatusColor(selected.status).split(' ')[0]}`} />
                    </div>
                  </div>
                </div>
              )}

              {selected.message && (
                <div className="prose-dark mb-8">
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-2">
                    {selected.type === 'booking' ? 'Additional Notes' : 'Message'}
                  </p>
                  <p className="text-dark-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}

              {/* Threaded Replies */}
              {selected.replies && selected.replies.length > 0 && (
                <div className="mb-8 space-y-4 border-l-2 border-white/10 pl-4 ml-2">
                  <h4 className="text-sm font-bold text-dark-200">Conversation History</h4>
                  {selected.replies.map(reply => (
                    <div key={reply.id} className="bg-dark-800 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">You</span>
                        <span className="text-[10px] text-dark-400">
                          {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <p className="text-xs text-dark-300 mb-2 border-b border-white/5 pb-2">Subj: {reply.subject}</p>
                      <p className="text-sm text-dark-200 whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-dark-400 border-t border-white/5 pt-6">
                <Calendar className="w-3 h-3" />
                Received on {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'Unknown'}
              </div>

              {/* Email Reply Box */}
              <div className="mt-8">
                {!isReplying ? (
                  <button 
                    onClick={() => {
                      setIsReplying(true);
                      setReplySubject(`Re: ${selected.type === 'booking' ? 'Your Booking Request' : 'Your Contact Message'}`);
                      setReplyMessage(`Hi ${selected.name},\n\n`);
                    }}
                    className="btn-primary py-2 px-4 flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                  >
                    <Mail className="w-4 h-4" /> Reply directly to {selected.name}
                  </button>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-sm">Compose Reply</h3>
                      <button onClick={() => setIsReplying(false)} className="text-dark-300 hover:text-white p-1 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={replySubject} 
                        onChange={(e) => setReplySubject(e.target.value)} 
                        placeholder="Subject" 
                        className="admin-input text-sm" 
                        disabled={isSendingReply}
                      />
                      <textarea 
                        value={replyMessage} 
                        onChange={(e) => setReplyMessage(e.target.value)} 
                        placeholder="Type your reply here..." 
                        className="admin-input text-sm min-h-[150px]"
                        disabled={isSendingReply}
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          onClick={() => setIsReplying(false)} 
                          className="px-4 py-2 text-sm text-dark-200 hover:text-white transition-colors"
                          disabled={isSendingReply}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            setIsSendingReply(true);
                            try {
                              await sendEmailReply(selected.id, selected.email, selected.name, replySubject, replyMessage);
                              alert("Email sent successfully!");
                              setIsReplying(false);
                            } catch (err: any) {
                              alert(err.message || "Failed to send email.");
                            } finally {
                              setIsSendingReply(false);
                            }
                          }}
                          disabled={isSendingReply || !replyMessage.trim()}
                          className="btn-primary py-2 px-4 flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          {isSendingReply ? 'Sending...' : <><Send className="w-4 h-4" /> Send Email</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="admin-card rounded-xl p-16 text-center">
              <MessageSquare className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-2">Select an Item</h3>
              <p className="text-dark-300 text-sm">Click on a message or booking to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
