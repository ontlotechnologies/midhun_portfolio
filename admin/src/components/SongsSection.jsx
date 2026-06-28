import { Plus, Trash2 } from 'lucide-react';
import { getPreviewUrl } from '../utils/helpers';
import { FileUpload, FormField, Input, Select, Textarea } from './Common';

export default function SongsSection({
  songsViewMode,
  setSongsViewMode,
  songs,
  handleDeleteSong,
  handleAddSong,
  songForm,
  setSongForm,
  contentSaving,
  handleFileUpload
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Spacious Subheader Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Songs</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage and preview all compositions visible on your homepage Works panel.</p>
        </div>
        <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
          <button
            onClick={() => setSongsViewMode('list')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              songsViewMode === 'list'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            View Registry ({songs.length})
          </button>
          <button
            onClick={() => setSongsViewMode('add')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              songsViewMode === 'add'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            Add New Song
          </button>
        </div>
      </div>

      {songsViewMode === 'list' ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {songs.map((song) => (
              <div key={song._id} className="bg-obsidian-950 p-4 border border-obsidian-700/40 rounded-xl flex items-center justify-between hover:border-gold-500/25 transition-colors gap-4">
                <div className="flex items-center space-x-4 text-left min-w-0">
                  <img
                    src={song.coverUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%230d0d0d"/><circle cx="150" cy="150" r="80" fill="none" stroke="%23cca647" stroke-width="1.5"/><circle cx="150" cy="150" r="6" fill="%23cca647"/><text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="3" fill="%23cca647">COMPOSITION</text></svg>'}
                    className="w-12 h-12 object-cover rounded-lg border border-obsidian-750 shrink-0 shadow-md"
                    alt=""
                  />
                  <div className="min-w-0">
                    <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate">{song.title}</h5>
                    <div className="flex items-center space-x-2 text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                      <span className="text-gold-500 bg-gold-500/5 border border-gold-500/10 px-2 py-0.5 rounded-md">{song.category}</span>
                      {song.isFeatured && (
                        <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-2 py-0.5 rounded-md font-black">Featured on Slider</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSong(song._id)}
                  className="text-slate-400 hover:text-red-550 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Delete Release"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {songs.length === 0 && (
              <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No compositions recorded in registry database.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddSong} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
          <div className="border-b border-obsidian-700/50 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
              <Plus size={14} /> <span>Create New Composition Release</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Song Release Title">
              <Input
                type="text"
                required
                placeholder="e.g. Ennin Nenjil (Acoustic)"
                value={songForm.title}
                onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
              />
            </FormField>

            <FormField label="Music Category">
              <Select
                value={songForm.category}
                onChange={(e) => setSongForm({ ...songForm, category: e.target.value })}
              >
                <option value="Single">Single Release</option>
                <option value="Album">Album Track</option>
                <option value="Film Score">Film Score Composition</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cover Artwork Image File">
              <div className="flex gap-3 items-start">
                {songForm.coverUrl && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-obsidian-750 shrink-0 shadow-md">
                    <img
                      src={getPreviewUrl(songForm.coverUrl)}
                      className="w-full h-full object-cover"
                      alt="Cover Preview"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <FileUpload
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'songCover')}
                    label="Upload cover picture"
                    value={songForm.coverUrl}
                  />
                  <Input
                    type="text"
                    placeholder="Or enter Image URL"
                    value={typeof songForm.coverUrl === 'string' ? songForm.coverUrl : ''}
                    onChange={(e) => setSongForm({ ...songForm, coverUrl: e.target.value })}
                    className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </FormField>

            <FormField label="Audio Track Preview File (.mp3)">
              <FileUpload
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, 'songAudio')}
                label="Upload audio track"
                value={songForm.audioUrl}
              />
              <Input
                type="text"
                placeholder="Or enter Audio URL"
                value={typeof songForm.audioUrl === 'string' ? songForm.audioUrl : ''}
                onChange={(e) => setSongForm({ ...songForm, audioUrl: e.target.value })}
                className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Spotify Track Link">
              <Input
                type="text"
                placeholder="https://open.spotify.com/track/..."
                value={songForm.spotifyUrl}
                onChange={(e) => setSongForm({ ...songForm, spotifyUrl: e.target.value })}
              />
            </FormField>

            <FormField label="YouTube Streaming Link">
              <Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={songForm.youtubeUrl || ''}
                onChange={(e) => setSongForm({ ...songForm, youtubeUrl: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Composition Description Notes">
            <Textarea
              placeholder="Notes about style, production credits, orchestration..."
              rows={2}
              value={songForm.description}
              onChange={(e) => setSongForm({ ...songForm, description: e.target.value })}
            />
          </FormField>

          <div className="flex items-center space-x-2.5 py-1 text-left">
            <input
              type="checkbox"
              id="isFeaturedDashboard"
              checked={songForm.isFeatured}
              onChange={(e) => setSongForm({ ...songForm, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-gold-500 rounded-lg bg-obsidian-950 border border-obsidian-700 cursor-pointer"
            />
            <label htmlFor="isFeaturedDashboard" className="text-[10.5px] uppercase tracking-widest text-slate-400 cursor-pointer font-bold">
              Feature release prominently on homepage slider
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setSongsViewMode('list')}
              className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={contentSaving}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1"
            >
              {contentSaving && <span className="animate-spin mr-1">⌛</span>}
              <span>{contentSaving ? 'Uploading...' : 'Save Release'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
