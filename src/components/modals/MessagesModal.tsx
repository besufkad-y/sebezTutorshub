import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Conversation, Message, TutorDetail, api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/validation';
import { X, Send, MessageSquare, User as UserIcon, Sparkles } from 'lucide-react';

interface MessagesModalProps {
  initialPartner?: TutorDetail | null;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  initialPartner,
  onClose,
  showToast,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<number | null>(
    initialPartner ? initialPartner.user_id : null
  );
  const [activePartnerName, setActivePartnerName] = useState<string>(
    initialPartner ? `${initialPartner.first_name} ${initialPartner.last_name}` : ''
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      loadMessages(activePartnerId);
    }
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        if (!activePartnerId && res.conversations.length > 0) {
          setActivePartnerId(res.conversations[0].user_id);
          setActivePartnerName(res.conversations[0].name);
        }
      }
    } catch {
      // Handled silently
    }
  };

  const loadMessages = async (partnerId: number) => {
    setLoading(true);
    try {
      const res = await api.getMessages(partnerId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch {
      showToast('Error loading messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePartnerId || !inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await api.sendMessage(activePartnerId, content);
      if (res.success) {
        loadMessages(activePartnerId);
        loadConversations();
      } else {
        showToast(res.message || 'Failed to send message.', 'error');
      }
    } catch {
      showToast('Error sending message.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[680px] max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Direct Messaging</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">REAL-TIME COMM CHANNEL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Pane Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Conversations */}
          <div className="w-1/3 border-r border-white/[0.08] flex flex-col bg-white/[0.01]">
            <div className="p-4 border-b border-white/[0.06] text-[11px] font-mono-accent uppercase tracking-widest text-slate-400 font-bold">
              CONVERSATIONS
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
              {initialPartner &&
                !conversations.some((c) => c.user_id === initialPartner.user_id) && (
                  <div
                    onClick={() => {
                      setActivePartnerId(initialPartner.user_id);
                      setActivePartnerName(
                        `${initialPartner.first_name} ${initialPartner.last_name}`
                      );
                    }}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                      activePartnerId === initialPartner.user_id
                        ? 'bg-violet-600/20 border-l-2 border-violet-500'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <img
                      src={initialPartner.profile_picture_url || '/images/users/1.jpg'}
                      alt={initialPartner.first_name}
                      className="w-10 h-10 rounded-xl object-cover border border-violet-500/30 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {initialPartner.first_name} {initialPartner.last_name}
                      </div>
                      <div className="text-xs text-violet-400 italic">Start conversation...</div>
                    </div>
                  </div>
                )}

              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const isActive = activePartnerId === conv.user_id;
                  return (
                    <div
                      key={conv.user_id}
                      onClick={() => {
                        setActivePartnerId(conv.user_id);
                        setActivePartnerName(conv.name);
                      }}
                      className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                        isActive
                          ? 'bg-violet-600/20 border-l-2 border-violet-500'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <img
                        src={conv.avatar || '/images/users/1.jpg'}
                        alt={conv.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white truncate">
                            {conv.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                          {conv.last_message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 font-mono-accent">
                  NO ACTIVE CHATS
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Chat Thread */}
          <div className="flex-1 flex flex-col bg-[#080A12]">
            {activePartnerId ? (
              <>
                {/* Active Partner Bar */}
                <div className="px-6 py-3.5 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activePartnerName}</h4>
                    <span className="text-[10px] font-mono-accent text-emerald-400 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                    </span>
                  </div>
                </div>

                {/* Messages History */}
                <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#080A12]">
                  {loading ? (
                    <div className="text-center text-xs text-slate-500 py-12 font-mono-accent">
                      LOADING TRANSMISSION HISTORY...
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = user && msg.sender_id === user.user_id;
                      return (
                        <div
                          key={msg.id || msg.message_id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-lg shadow-violet-600/25'
                                : 'bg-[#141829] text-slate-200 rounded-bl-none border border-white/[0.08]'
                            }`}
                          >
                            {msg.message_content}
                          </div>
                          <span className="text-[10px] font-mono-accent text-slate-500 mt-1 px-1">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-slate-500 py-16">
                      Send your initial inquiry or questions to start collaborating!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-white/[0.08] bg-[#0C0E18] flex gap-2.5"
                >
                  <input
                    type="text"
                    required
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.1] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl shadow-lg shadow-violet-600/30 transition cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 text-slate-500 text-xs font-mono-accent">
                SELECT A CONVERSATION ON THE LEFT TO TRANSMIT
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
