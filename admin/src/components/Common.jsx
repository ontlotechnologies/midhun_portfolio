import { Upload } from 'lucide-react';

export const FormField = ({ label, children }) => (
  <div className="flex flex-col space-y-1 text-left w-full">
    <span className="text-[9.5px] font-bold uppercase tracking-widest text-obsidian-500">{label}</span>
    {children}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 placeholder-slate-500 transition-all outline-none w-full ${className}`}
  />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 placeholder-slate-500 transition-all outline-none resize-none font-sans w-full ${className}`}
  />
);

export const Select = ({ className = '', ...props }) => (
  <select
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 transition-all outline-none cursor-pointer w-full ${className}`}
  />
);

// Helper utilities moved to ../utils/helpers.js to keep this file component-only

export const FileUpload = ({ accept, onChange, label, value }) => (
  <label className="flex items-center gap-3 border border-dashed border-obsidian-700 hover:border-gold-500/50 bg-obsidian-950 hover:bg-gold-500/5 px-4 py-3 rounded-lg cursor-pointer transition-all min-w-0 w-full select-none">
    <Upload size={14} className="text-gold-500 shrink-0" />
    <div className="flex-1 min-w-0 text-left">
      <span className="text-[11px] font-semibold text-obsidian-100 block truncate">{label}</span>
      <span className="text-[9px] text-slate-500 block truncate">
        {value
          ? (typeof value === 'string' ? value.split('/').pop() : value.name)
          : 'Click to select asset'}
      </span>
    </div>
    <input type="file" accept={accept} onChange={onChange} className="hidden" />
  </label>
);
// end of components
