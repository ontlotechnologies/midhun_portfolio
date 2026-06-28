import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { FormField, Input, Select, FileUpload } from './Common';

export default function GallerySection({
  gallery,
  galleryViewMode,
  setGalleryViewMode,
  galleryForm,
  setGalleryForm,
  handleDeleteGallery,
  handleAddGalleryItem,
  contentSaving,
  handleFileUpload
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Subheader Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Photo Gallery</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage live performance shoots and behind-the-scenes photography assets.</p>
        </div>
        <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
          <button
            onClick={() => setGalleryViewMode('list')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              galleryViewMode === 'list'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            View Photos ({gallery.length})
          </button>
          <button
            onClick={() => setGalleryViewMode('add')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              galleryViewMode === 'add'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {galleryViewMode === 'list' ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">
            {gallery.map((item) => (
              <div key={item._id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-obsidian-950 border border-obsidian-750/50 group shadow-md hover:border-gold-500/25 transition-all">
                <img src={item.url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%230d0d0d"/><rect width="100%" height="100%" fill="none" stroke="%23cca647" stroke-width="1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23cca647">GALLERY EXHIBIT</text></svg>'} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-left">
                  <span className="text-[8px] uppercase tracking-widest font-black font-mono text-gold-500 bg-gold-500/10 border border-gold-500/10 px-2 py-0.5 rounded-md w-max">
                    {item.category}
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-auto w-full">
                    <span className="text-[11px] font-bold text-obsidian-100 truncate max-w-[120px]">{item.title}</span>
                    <button
                      onClick={() => handleDeleteGallery(item._id)}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {gallery.length === 0 && (
              <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No images uploaded to visual gallery registry.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddGalleryItem} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
          <div className="border-b border-obsidian-700/50 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
              <Plus size={14} /> <span>Upload Concert / Studio Photo Asset</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField label="Gallery Category">
              <Select
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
              >
                <option value="Concerts">Live Performances</option>
                <option value="Studio">Studio Recording Sessions</option>
                <option value="Personal">Behind the Scenes Moments</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Upload File / Image URL">
            <FileUpload
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'galleryUrl')}
              label="Upload Photo File"
              value={galleryForm.url}
            />
            <Input
              type="text"
              placeholder="Or enter Image URL"
              value={typeof galleryForm.url === 'string' ? galleryForm.url : ''}
              onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
              className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setGalleryViewMode('list')}
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
              <span>{contentSaving ? 'Uploading...' : 'Upload Picture'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
