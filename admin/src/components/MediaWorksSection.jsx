import { Plus, Trash2 } from 'lucide-react';
import { getPreviewUrl, getTabWorkType } from '../utils/helpers';
import { FileUpload, FormField, Input, Select, Textarea } from './Common';

const getTabLabel = (tab) => {
  switch (tab) {
    case 'short-films': return 'Short Films';
    case 'web-series': return 'Web Series';
    case 'tv-programs': return 'TV Programs';
    case 'feature-films': return 'Feature Films';
    case 'independent-works': return 'Independent Works';
    default: return 'Cinematic Works';
  }
};

const getTabSingularLabel = (tab) => {
  switch (tab) {
    case 'short-films': return 'Short Film';
    case 'web-series': return 'Web Series';
    case 'tv-programs': return 'TV Program';
    case 'feature-films': return 'Feature Film';
    case 'independent-works': return 'Independent Work';
    default: return 'Cinematic Release';
  }
};

export default function MediaWorksSection({
  activeTab,
  mediaWorks,
  mediaViewMode,
  setMediaViewMode,
  mediaWorkForm,
  setMediaWorkForm,
  independentSubtype,
  setIndependentSubtype,
  handleDeleteMediaWork,
  handleAddMediaWork,
  contentSaving,
  handleFileUpload,
  API_URL
}) {
  const filteredWorks = mediaWorks.filter(w => {
    if (activeTab === 'media-works') return true;
    return w.type === getTabWorkType(activeTab);
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Subheader Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">{getTabLabel(activeTab)}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage posters, video/audio assets, and release details for {getTabLabel(activeTab)} visible on the portfolio site.</p>
        </div>
        <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
          <button
            onClick={() => setMediaViewMode('list')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              mediaViewMode === 'list'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            View Releases ({filteredWorks.length})
          </button>
          <button
            onClick={() => {
              setMediaViewMode('add');
              setMediaWorkForm({
                title: '',
                type: getTabWorkType(activeTab),
                coverUrl: '',
                videoUrl: '',
                audioUrl: '',
                mediaType: 'youtube',
                releaseYear: '',
                description: '',
                isFeatured: false
              });
            }}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              mediaViewMode === 'add'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            Add {getTabSingularLabel(activeTab)}
          </button>
        </div>
      </div>

      {mediaViewMode === 'list' ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredWorks.map((work) => (
              <div key={work._id} className="bg-obsidian-950 border border-obsidian-700/40 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-gold-500/25 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  {work.coverUrl ? (
                    <img
                      src={work.coverUrl.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${work.coverUrl}` : work.coverUrl}
                      className="w-10 h-14 object-cover rounded-lg border border-obsidian-750 shrink-0 shadow"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-14 bg-obsidian-900 border border-obsidian-850 rounded-lg flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-black uppercase tracking-wider text-center p-1 font-mono">
                      No Cover
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate leading-snug">{work.title}</h5>
                    <div className="flex items-center space-x-2 text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                      <span className="text-gold-500 bg-gold-500/5 border border-gold-500/10 px-2 py-0.5 rounded-md">
                        {work.type === 'independent_work'
                          ? `indie (${(!!work.audioUrl || /\.(mp3|wav)(?:\?|$)/i.test(work.videoUrl || '')) ? 'audio' : 'video'})`
                          : work.type.replace('_', ' ')}
                      </span>
                      <span>&bull;</span>
                      <span>{work.releaseYear}</span>
                      {work.isFeatured && (
                        <span className="text-blue-400 bg-blue-600/5 border border-blue-600/10 px-1.5 py-0.5 rounded-md font-black">Featured</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMediaWork(work._id)}
                  className="text-slate-400 hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {filteredWorks.length === 0 && (
              <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No {getTabSingularLabel(activeTab).toLowerCase()} releases uploaded yet.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddMediaWork} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
          <div className="border-b border-obsidian-700/50 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
              <Plus size={14} /> <span>Create {getTabSingularLabel(activeTab)}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={activeTab === 'media-works' ? "sm:col-span-2" : "sm:col-span-3"}>
              <FormField label="Project Release Title">
                <Input
                  type="text"
                  required
                  placeholder="e.g. Echoes of Silence"
                  value={mediaWorkForm.title}
                  onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, title: e.target.value })}
                />
              </FormField>
            </div>

            {activeTab === 'media-works' && (
              <FormField label="Work Category">
                <Select
                  value={mediaWorkForm.type}
                  onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, type: e.target.value })}
                >
                  <option value="short_film">Short Film</option>
                  <option value="web_series">Web Series</option>
                  <option value="tv_program">TV Program</option>
                  <option value="movie">Feature Film</option>
                  <option value="independent_work">Independent Work</option>
                </Select>
              </FormField>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Release Year">
              <Input
                type="text"
                required
                placeholder="e.g. 2026"
                value={mediaWorkForm.releaseYear}
                onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, releaseYear: e.target.value })}
              />
            </FormField>

            {mediaWorkForm.type === 'independent_work' ? (
              <FormField label="Independent Subtype">
                <Select
                  value={independentSubtype}
                  onChange={(e) => setIndependentSubtype(e.target.value)}
                >
                  <option value="video">Video Release</option>
                  <option value="audio">Audio Soundtrack</option>
                </Select>
              </FormField>
            ) : (
              <FormField label="Resource Hosting Type">
                <Select
                  value={mediaWorkForm.mediaType}
                  onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, mediaType: e.target.value })}
                >
                  <option value="youtube">YouTube Video Link</option>
                  <option value="upload">User Uploaded Video/Audio File</option>
                  <option value="image_only">Poster Image Showcase Only</option>
                </Select>
              </FormField>
            )}
          </div>

          {mediaWorkForm.type === 'independent_work' && independentSubtype === 'video' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="hidden sm:block"></div>
              <FormField label="Video Host Resource">
                <Select
                  value={mediaWorkForm.mediaType}
                  onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, mediaType: e.target.value })}
                >
                  <option value="youtube">YouTube Embed Link</option>
                  <option value="upload">Custom Media Upload</option>
                </Select>
              </FormField>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cover Artwork Poster Artwork">
              <div className="flex gap-3 items-start">
                {mediaWorkForm.coverUrl && (
                  <div className="w-14 h-20 rounded-lg overflow-hidden border border-obsidian-750 shrink-0 shadow-md">
                    <img
                      src={getPreviewUrl(mediaWorkForm.coverUrl)}
                      className="w-full h-full object-cover"
                      alt="Cover Preview"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <FileUpload
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'mediaCover')}
                    label="Upload Poster Cover"
                    value={mediaWorkForm.coverUrl}
                  />
                  <Input
                    type="text"
                    placeholder="Or enter Image URL"
                    value={typeof mediaWorkForm.coverUrl === 'string' ? mediaWorkForm.coverUrl : ''}
                    onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, coverUrl: e.target.value })}
                    className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </FormField>

            {mediaWorkForm.mediaType !== 'image_only' && (
              <>
                {!(mediaWorkForm.type === 'independent_work' && independentSubtype === 'audio') ? (
                  <FormField label={mediaWorkForm.mediaType === 'youtube' ? 'YouTube Video URL' : 'Upload Video File'}>
                    <FileUpload
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'mediaVideo')}
                      label="Upload Video Clip"
                      value={mediaWorkForm.videoUrl}
                    />
                    <Input
                      type="text"
                      placeholder={mediaWorkForm.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'Or enter video file URL'}
                      value={typeof mediaWorkForm.videoUrl === 'string' ? mediaWorkForm.videoUrl : ''}
                      onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, videoUrl: e.target.value })}
                      className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                    />
                  </FormField>
                ) : (
                  <FormField label="Soundtrack Upload (.mp3)">
                    <FileUpload
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'mediaAudio')}
                      label="Upload Audio Soundtrack"
                      value={mediaWorkForm.audioUrl}
                    />
                    <Input
                      type="text"
                      placeholder="Or enter Audio URL"
                      value={typeof mediaWorkForm.audioUrl === 'string' ? mediaWorkForm.audioUrl : ''}
                      onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, audioUrl: e.target.value })}
                      className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                    />
                  </FormField>
                )}
              </>
            )}
          </div>

          <FormField label="Project Summary/Description Notes">
            <Textarea
              placeholder="Notes about story, orchestration, film awards, director credits..."
              rows={2}
              value={mediaWorkForm.description}
              onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, description: e.target.value })}
            />
          </FormField>

          <div className="flex items-center space-x-2.5 py-1 text-left">
            <input
              type="checkbox"
              id="isFeaturedMedia"
              checked={mediaWorkForm.isFeatured}
              onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-gold-500 rounded-lg bg-obsidian-950 border border-obsidian-700 cursor-pointer"
            />
            <label htmlFor="isFeaturedMedia" className="text-[10.5px] uppercase tracking-widest text-slate-400 cursor-pointer font-bold">
              Feature release prominently on site works details
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setMediaViewMode('list')}
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
