import { Edit, Plus, Trash2 } from 'lucide-react';
import { getPreviewUrl } from '../utils/helpers';
import { FileUpload, FormField, Input, Textarea } from './Common';

export default function TimelineSection({
  timeline,
  timelineViewMode,
  setTimelineViewMode,
  timelineForm,
  setTimelineForm,
  editingTimelineId,
  setEditingTimelineId,
  handleDeleteTimeline,
  handleAddTimeline,
  handleStartEditTimeline,
  contentSaving,
  handleFileUpload
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Subheader Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Journey Roadmap</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage chronological timeline points, milestones, and awards shown on Journey details panel.</p>
        </div>
        <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
          <button
            onClick={() => setTimelineViewMode('list')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              timelineViewMode === 'list'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            View Milestones ({timeline.length})
          </button>
          <button
            onClick={() => {
              setTimelineViewMode('add');
              setEditingTimelineId(null);
              setTimelineForm({ year: '', title: '', description: '', image: '' });
            }}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              timelineViewMode === 'add'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            Add Milestone
          </button>
        </div>
      </div>

      {timelineViewMode === 'list' ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
          <div className="relative pl-6 border-l border-obsidian-700/60 ml-2.5 space-y-5 max-h-[520px] overflow-y-auto py-2">
            {timeline.map((evt) => (
              <div key={evt._id} className="relative group text-left">
                {/* Timeline circle node */}
                <div className="absolute -left-[32.5px] top-2.5 w-3 h-3 rounded-full bg-gold-500 border-2 border-obsidian-900 shadow group-hover:scale-125 transition-transform" />

                <div className="bg-obsidian-950 p-4.5 border border-obsidian-700/40 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {evt.image && (
                      <img
                        src={evt.image}
                        className="w-12 h-12 rounded-lg object-cover border border-obsidian-750 shrink-0 mt-0.5 animate-fade-in"
                        alt=""
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2.5 font-mono">
                        <span className="text-xs font-black text-gold-500 tracking-widest">{evt.year}</span>
                        <span className="text-slate-600 text-[10px]">&bull;</span>
                        <span className="text-xs font-bold text-obsidian-100 uppercase tracking-wider">{evt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-light">{evt.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0 select-none">
                    <button
                      onClick={() => handleStartEditTimeline(evt)}
                      className="text-slate-400 hover:text-gold-500 p-2.5 hover:bg-gold-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteTimeline(evt._id)}
                      className="text-slate-400 hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {timeline.length === 0 && (
              <p className="text-xs text-slate-500 italic py-6 pl-2">No journey timeline milestones recorded yet.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddTimeline} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
          <div className="border-b border-obsidian-700/50 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
              <Plus size={14} /> <span>{editingTimelineId ? 'Edit Journey Milestone Point' : 'Create Journey Milestone Point'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Milestone Year">
                  <Input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={timelineForm.year}
                    onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                  />
                </FormField>
                <div className="col-span-2">
                  <FormField label="Milestone Header Name">
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Winner at Golden Award Music Festival"
                      value={timelineForm.title}
                      onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              <FormField label="Milestone Description Narrative">
                <Textarea
                  required
                  placeholder="Detail information about what this milestone includes..."
                  rows={4}
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  className="h-[105px]"
                />
              </FormField>
            </div>

            {/* Right Column: Image and Preview */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <FormField label="Milestone Image Artwork">
                <FileUpload
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'timelineImage')}
                  label="Upload Milestone Image"
                  value={timelineForm.image}
                />
                <Input
                  type="text"
                  placeholder="Or enter Image URL"
                  value={typeof timelineForm.image === 'string' ? timelineForm.image : ''}
                  onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                  className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                />
              </FormField>
              
              <div className="flex-1 flex flex-col justify-center items-center border border-dashed border-obsidian-800 rounded-lg bg-obsidian-950 p-2 min-h-[90px] mt-2.5">
                {timelineForm.image ? (
                  <img 
                    src={getPreviewUrl(timelineForm.image)} 
                    className="w-24 h-24 object-cover rounded-lg animate-fade-in border border-obsidian-750" 
                    alt="Milestone Preview" 
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 italic font-mono uppercase tracking-widest text-center">No image selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setTimelineViewMode('list');
                setEditingTimelineId(null);
                setTimelineForm({ year: '', title: '', description: '', image: '' });
              }}
              className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={contentSaving}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1.5"
            >
              {contentSaving && <span className="animate-spin mr-1">⌛</span>}
              <span>{contentSaving ? 'Saving...' : (editingTimelineId ? 'Save Changes' : 'Save Milestone')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
