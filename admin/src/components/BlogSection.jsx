import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { getPreviewUrl } from '../utils/helpers';
import { FileUpload, FormField, Input, Textarea } from './Common';

export default function BlogSection({
  blogs,
  blogViewMode,
  setBlogViewMode,
  blogPreviewMode,
  setBlogPreviewMode,
  blogForm,
  setBlogForm,
  editingBlogId,
  setEditingBlogId,
  handlePreviewBlog,
  handleEditBlog,
  handleDeleteBlog,
  handleAddBlog,
  contentSaving,
  handleFileUpload
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Subheader Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Blog</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Create and format stories, behind-the-scenes diaries, and reflections behind compositions.</p>
        </div>
        <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
          <button
            onClick={() => setBlogViewMode('list')}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              blogViewMode === 'list'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            All Blogs ({blogs.length})
          </button>
          <button
            onClick={() => {
              setBlogViewMode('add');
              setEditingBlogId(null);
              setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', isPublished: true });
              setBlogPreviewMode(false);
            }}
            className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              blogViewMode === 'add' && !editingBlogId
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            Write Blog
          </button>
        </div>
      </div>

      {blogViewMode === 'list' ? (
        <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
          <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-obsidian-950 p-4 border border-obsidian-700/40 rounded-xl flex items-center justify-between gap-4 hover:border-gold-500/25 transition-colors">
                <div className="text-left min-w-0">
                  <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate leading-snug">{blog.title}</h5>
                  <div className="flex items-center space-x-2.5 text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                    <span className="flex items-center gap-1 text-slate-400 font-mono">
                      <Eye size={10} className="text-gold-500" /> {blog.views || 0} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePreviewBlog(blog)}
                    className="text-slate-400 hover:text-gold-500 p-2 hover:bg-gold-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Preview Article"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditBlog(blog)}
                    className="text-slate-400 hover:text-blue-500 p-2 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Article"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <p className="text-xs text-slate-500 italic py-10 text-center">No blog stories published yet.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddBlog} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
          <div className="border-b border-obsidian-700/50 pb-3 flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
              <Plus size={14} /> <span>Compose Reflection Article</span>
            </h3>
            <div className="flex bg-obsidian-950 border border-obsidian-750 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setBlogPreviewMode(false)}
                className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-md ${!blogPreviewMode ? 'text-gold-500 bg-gold-500/10' : 'text-obsidian-500 hover:text-obsidian-100'}`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setBlogPreviewMode(true)}
                className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-md ${blogPreviewMode ? 'text-gold-500 bg-gold-500/10' : 'text-obsidian-500 hover:text-obsidian-100'}`}
              >
                Preview
              </button>
            </div>
          </div>

          {blogPreviewMode ? (
            <div className="bg-obsidian-950 border border-obsidian-700/60 rounded-xl p-5 min-h-[360px] text-left">
              {blogForm.coverUrl && (
                <img src={getPreviewUrl(blogForm.coverUrl)} className="w-full h-44 object-cover rounded-lg mb-4 border border-obsidian-750 shadow-md" alt="" />
              )}
              <h2 className="font-serif text-lg font-bold text-black mb-2 leading-tight">{blogForm.title || 'Untitled Article'}</h2>
              <p className="text-[10.5px] text-slate-400 italic mb-4 font-light">{blogForm.excerpt || 'No summary excerpt provided.'}</p>
              <div
                className="text-xs text-black space-y-3.5 leading-relaxed border-t border-obsidian-700/40 pt-4"
                dangerouslySetInnerHTML={{ __html: blogForm.content || '<p className="text-black italic">No content written yet.</p>' }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FormField label="Article Headline Title">
                <Input
                  type="text"
                  required
                  placeholder="e.g. Behind the Score of Letters Unheard"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                />
              </FormField>

              <FormField label="Banner Cover Photo">
                <div className="flex gap-3 items-start">
                  {blogForm.coverUrl && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-obsidian-750 shrink-0 shadow-md">
                      <img
                        src={getPreviewUrl(blogForm.coverUrl)}
                        className="w-full h-full object-cover"
                        alt="Cover Preview"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <FileUpload
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'blogCover')}
                      label="Upload Cover Photo"
                      value={blogForm.coverUrl}
                    />
                    <Input
                      type="text"
                      placeholder="Or enter Image URL"
                      value={typeof blogForm.coverUrl === 'string' ? blogForm.coverUrl : ''}
                      onChange={(e) => setBlogForm({ ...blogForm, coverUrl: e.target.value })}
                      className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </FormField>

              <FormField label="Short Summary/Excerpt">
                <Input
                  type="text"
                  required
                  placeholder="Excerpt preview shown on the list page..."
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                />
              </FormField>

              <FormField label="Article Content (Supports HTML, e.g. <p>, <em>, <strong>)">
                <Textarea
                  required
                  placeholder="Type story content body..."
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="font-mono text-[11px] leading-relaxed"
                />
              </FormField>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setBlogViewMode('list');
                setEditingBlogId(null);
                setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', isPublished: true });
              }}
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
              <span>{contentSaving ? 'Saving...' : (editingBlogId ? 'Save Changes' : 'Publish Story')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
