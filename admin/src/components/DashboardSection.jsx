import React from 'react';
import { Mail, Eye, ChevronRight } from 'lucide-react';

export default function DashboardSection({
  stats,
  blogs,
  songs = [],
  mediaWorks = [],
  gallery = [],
  messages,
  streamPeriod,
  setStreamPeriod,
  streamData,
  handleMetricClick,
  handleTabSelect
}) {
  const combinedRecent = [];

  (songs || []).forEach(s => {
    combinedRecent.push({
      type: 'Song',
      title: s.title,
      date: s.createdAt ? new Date(s.createdAt) : new Date(s.releaseDate || Date.now()),
      status: 'Live'
    });
  });

  (blogs || []).forEach(b => {
    combinedRecent.push({
      type: 'Blog',
      title: b.title,
      date: b.createdAt ? new Date(b.createdAt) : new Date(),
      status: b.isPublished ? 'Live' : 'Draft'
    });
  });

  (mediaWorks || []).forEach(w => {
    combinedRecent.push({
      type: 'Media',
      title: w.title,
      date: w.createdAt ? new Date(w.createdAt) : new Date(),
      status: 'Live'
    });
  });

  (gallery || []).forEach(g => {
    combinedRecent.push({
      type: 'Gallery',
      title: g.title || 'Visual Artwork',
      date: g.createdAt ? new Date(g.createdAt) : new Date(),
      status: 'Live'
    });
  });

  const recentAdded = combinedRecent
    .sort((a, b) => b.date - a.date)
    .slice(0, 4)
    .map(item => ({
      ...item,
      dateString: item.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Heading */}
      <div>
        <h2 className="font-serif text-xl font-bold tracking-tight text-obsidian-100 flex items-center space-x-2">
          <span>Welcome back, Midhun!</span>
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Here is a quick overview of your database metrics and stream stats.</p>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Songs', value: stats.songs, change: 'Manage compositions database', target: 'songs', bg: 'from-blue-600/10 to-transparent' },
          { label: 'My Works', value: stats.mediaWorks, change: 'Manage cinematic works', target: 'media-works', bg: 'from-cyan-600/10 to-transparent' },
          { label: 'Journey Milestones', value: stats.timelineEvents, change: 'View achievement roadmap', target: 'timeline', bg: 'from-purple-600/10 to-transparent' },
          { label: 'Booking Inbox', value: stats.totalMessages, change: `${stats.unreadMessages} unread enquiry message(s)`, target: 'enquiries', alert: stats.unreadMessages > 0, bg: 'from-amber-600/10 to-transparent' }
        ].map((m, i) => (
          <div
            key={i}
            onClick={() => handleMetricClick(m.target)}
            className={`bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md cursor-pointer hover:border-gold-500/40  active:translate-y-0 transition-all bg-gradient-to-br ${m.bg}`}
          >
            <span className="text-[9.5px] uppercase tracking-widest text-slate-400 font-black block mb-2">{m.label}</span>
            <div className="text-2xl font-bold text-obsidian-100 tracking-tight leading-none font-serif">{m.value}</div>
            <span className={`text-[9.5px] mt-3.5 block font-bold uppercase tracking-wider ${m.alert ? 'text-gold-500 animate-pulse' : 'text-slate-500'}`}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Center Dashboard Split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Visitor Traffic Analytics */}
        <div className="lg:col-span-8 bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col text-left">
              <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono">Visitor Traffic Analytics</h3>
              <span className="text-[9.5px] text-slate-400 font-medium mt-0.5">Total Site Visits: <strong className="text-blue-400 font-mono">{streamData.total}</strong></span>
            </div>
            <select
              value={streamPeriod}
              onChange={e => setStreamPeriod(e.target.value)}
              className="bg-obsidian-950 border border-obsidian-700 text-[8.5px] uppercase tracking-widest px-2.5 py-1 text-slate-400 rounded-lg focus:outline-none cursor-pointer font-bold"
            >
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="relative h-48 w-full mt-4 flex items-end">
            <svg viewBox="0 0 500 200" className="w-full h-full text-gold-500 overflow-visible">
              <defs>
                <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />

              <path d={streamData.glowPath} fill="url(#curveGlow)" />
              <path d={streamData.linePath} fill="none" stroke="var(--color-gold-500)" strokeWidth="2.5" />

              {streamData.coords.map((c, idx) => (
                <circle
                  key={idx}
                  cx={c.x}
                  cy={c.y}
                  r={idx === streamData.coords.length - 1 ? "5" : "3.5"}
                  fill={idx === streamData.coords.length - 1 ? "var(--color-gold-500)" : "#090d16"}
                  stroke="var(--color-gold-500)"
                  strokeWidth="2"
                  className={idx === streamData.coords.length - 1 ? "animate-pulse" : ""}
                />
              ))}
            </svg>

            {streamData.coords.length > 0 && (
              <div
                className="absolute bg-obsidian-950 border border-obsidian-750 text-obsidian-100 px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none flex flex-col text-left transition-all duration-300"
                style={{
                  top: '15%',
                  left: '42%'
                }}
              >
                <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-bold">{streamData.peakDay} Peak</span>
                <span className="text-[10px] font-bold text-obsidian-100 font-mono">{streamData.peak} Page Views</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-wider select-none">
            {streamData.days.map((d, idx) => (
              <span key={idx}>{d}</span>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="lg:col-span-4 bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl shadow-md flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono">Popular Articles</h3>
            <p className="text-[9.5px] text-slate-400 mt-0.5 mb-4">Top stories ranked by view metrics</p>
            
            <div className="space-y-3.5 max-h-[170px] overflow-y-auto pr-1">
              {blogs.length === 0 ? (
                <p className="text-slate-500 italic text-[10.5px]">No blog posts published yet.</p>
              ) : (
                blogs
                  .slice()
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 4)
                  .map((blog, idx) => (
                    <div key={blog._id} className="flex justify-between items-center text-[10.5px]">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="w-4 h-4 bg-gold-500/10 text-gold-500 font-bold font-mono text-[8px] flex items-center justify-center rounded">
                          {idx + 1}
                        </span>
                        <span className="text-slate-300 font-medium truncate max-w-[130px]">{blog.title}</span>
                      </div>
                      <span className="font-mono text-white font-semibold shrink-0">
                        {blog.views || 0} <span className="text-slate-500 text-[8.5px]">views</span>
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
          
          <div className="border-t border-obsidian-800 pt-3 mt-4 flex justify-between items-center text-[10.5px]">
            <span className="text-slate-400 uppercase tracking-widest text-[8.5px] font-bold">Total Blog Views</span>
            <span className="font-mono font-bold text-gold-500 text-sm">
              {blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom split list panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Added Table */}
        <div className="lg:col-span-7 bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md text-left flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono mb-4">Recent Added Content</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-obsidian-750 uppercase tracking-wider text-[8px] font-bold">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Date Added</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-750 text-obsidian-300">
                  {recentAdded.map((row, idx) => (
                    <tr key={idx} className="hover:bg-obsidian-850/50 transition-colors">
                      <td className="py-2.5 font-bold text-gold-500 uppercase tracking-widest text-[8.5px] font-mono">{row.type}</td>
                      <td className="py-2.5 font-semibold text-obsidian-100 truncate max-w-[150px]">{row.title}</td>
                      <td className="py-2.5 text-slate-400 font-mono">{row.dateString}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider rounded-md font-mono ${
                          row.status === 'Live'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentAdded.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-6 text-xs text-slate-500 italic text-center">
                        No content added to portfolio database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Enquiries List */}
        <div className="lg:col-span-5 bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md text-left flex flex-col justify-between">
          <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono mb-4">Recent Enquiries</h3>

          <div className="space-y-3">
            {messages.slice(0, 3).map((msg) => (
              <div key={msg._id} className="flex justify-between items-start space-x-3 bg-obsidian-950 p-3 border border-obsidian-700/40 rounded-lg">
                <div className="flex items-start space-x-3 text-left min-w-0">
                  <div className="w-8 h-8 rounded-full bg-obsidian-800 overflow-hidden shrink-0 border border-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-500">
                    {msg.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-[11px] text-obsidian-100 leading-tight truncate">{msg.name}</h5>
                    <p className="text-[9px] text-gold-500 uppercase tracking-wider font-semibold mt-1 truncate">{msg.subject}</p>
                  </div>
                </div>
                <span className="text-[7.5px] text-slate-500 font-mono shrink-0">Inbox</span>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-xs text-slate-500 italic py-4">No recent bookings in mail.</p>
            )}
          </div>

          <button
            onClick={() => handleTabSelect('enquiries')}
            className="w-full text-center text-[8.5px] uppercase tracking-widest text-gold-500 hover:text-gold-600 mt-4.5 font-black flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Open Bookings Mailbox</span>
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
