import React from 'react';
import { Mail, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

export default function EnquiriesSection({
  messages,
  handleMarkMessageRead,
  handleDeleteMessage
}) {
  return (
    <div className="space-y-5 animate-fade-in text-left">
      <div>
        <h3 className="font-serif text-lg font-bold text-obsidian-100 flex items-center gap-2">
          <Mail size={16} className="text-gold-500" />
          <span>Booking & Inquiry Mailbox</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Manage messages from clients, concert organizers, and collaborations.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-12 rounded-xl text-center shadow">
          <span className="text-4xl">✉️</span>
          <p className="text-xs text-slate-500 italic mt-3">Mailbox is empty. No messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-3.5 max-w-4xl">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-5 rounded-xl border transition-all ${
                msg.status === 'unread'
                  ? 'bg-gold-500/5 border-gold-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.04)]'
                  : 'bg-obsidian-900 border-obsidian-700/50 hover:border-obsidian-750'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-obsidian-100">{msg.name}</span>
                    <span className="text-slate-500 text-[10px] font-mono">&lt;{msg.email}&gt;</span>
                    {msg.status === 'unread' && (
                      <span className="bg-gold-500 text-white text-[7.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gold-500 uppercase tracking-widest mt-1.5 font-black font-mono">
                    Subject: {msg.subject || 'General Inquiry'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] select-none">
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => handleMarkMessageRead(msg._id)}
                      className="text-gold-500 hover:text-gold-600 font-bold uppercase tracking-widest text-[8.5px] flex items-center space-x-1.5 p-1.5 hover:bg-gold-500/10 rounded-lg cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Inquiry'}&body=Hi ${msg.name},`}
                    className="bg-gold-500/10 text-gold-500 border border-gold-500/25 hover:bg-gold-500 hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-1 transition-all"
                  >
                    <MessageSquare size={10} />
                    <span>Reply</span>
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete enquiry message"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light mt-4 border-t border-obsidian-700/50 pt-4 text-left whitespace-pre-wrap">
                {msg.message}
              </p>

              {msg.phone && (
                <div className="text-[9.5px] text-slate-500 mt-3 font-mono flex items-center space-x-1">
                  <span>Phone:</span>
                  <span className="text-slate-300 font-semibold">{msg.phone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
