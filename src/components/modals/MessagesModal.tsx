import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, TutorDetail, api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/validation';
import { X, Send, MessageSquare, User as UserIcon } from 'lucide-react';

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
      // Error
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
      showToast('Error loading chat messages.', 'error');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">Direct Messaging</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Pane Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Conversations */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
            <div className="p-3.5 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
              Conversations
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {/* If initialPartner was passed and not in conversations yet, display header */}
              {initialPartner &&
                !conversations.some((c) => c.user_id === initialPartner.user_id) && (
                  <div
                    onClick={() => {
                      setActivePartnerId(initialPartner.user_id);
                      setActivePartnerName(
                        `${initialPartner.first_name} ${initialPartner.last_name}`
                      );
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                      activePartnerId === initialPartner.user_id
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={initialPartner.profile_picture_url || '/images/users/1.jpg'}
                      alt={initialPartner.first_name}
                      className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {initialPartner.first_name} {initialPartner.last_name}
                      </div>
                      <div className="text-xs text-indigo-600 italic">Start conversation...</div>
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
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                        isActive
                          ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={conv.avatar || '/images/users/1.jpg'}
                        alt={conv.name}
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {conv.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {conv.last_message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active conversations yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Chat Thread */}
          <div className="flex-1 flex flex-col bg-white">
            {activePartnerId ? (
              <>
                {/* Chat Partner Header */}
                <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{activePartnerName}</h4>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                    </span>
                  </div>
                </div>

                {/* Messages History */}
                <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/40">
                  {loading ? (
                    <div className="text-center text-xs text-slate-400 py-10">
                      Loading messages...
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
                            className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-200'
                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-sm'
                            }`}
                          >
                            {msg.message_content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-slate-400 py-12">
                      Send your first message to start the conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-slate-100 bg-white flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6 text-slate-400 text-sm">
                Select a conversation on the left to start messaging.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
