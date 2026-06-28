import React from 'react';
import { Settings, ChevronDown, Save, Trash2, Plus } from 'lucide-react';
import { FormField, Input, Textarea, Select, FileUpload } from './Common';

export default function SiteContentSection({
  activeContentSection,
  setActiveContentSection,
  contentSaveSuccess,
  contentSaving,
  heroForm,
  setHeroForm,
  aboutForm,
  setAboutForm,
  legacyForm,
  setLegacyForm,
  footerForm,
  setFooterForm,
  faqsForm,
  setFaqsForm,
  newFaqQuestion,
  setNewFaqQuestion,
  newFaqAnswer,
  setNewFaqAnswer,
  handleSiteContentImageUpload,
  saveSiteContentSection
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-obsidian-700/40 pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-obsidian-100 flex items-center space-x-2">
            <Settings size={18} className="text-gold-500" />
            <span>Page Content Editor</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Configure biography narratives, FAQs, and contact credentials shown on your landing website.</p>
        </div>

        {/* Dropdown page selector on right-top */}
        <div className="relative min-w-[220px]">
          <select
            value={activeContentSection}
            onChange={e => setActiveContentSection(e.target.value)}
            className="w-full bg-obsidian-950 border border-obsidian-700/60 text-obsidian-100 px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-black focus:outline-none focus:border-gold-500 cursor-pointer shadow-md appearance-none pr-10"
          >
            {[
              { id: 'hero', label: 'Hero Cover' },
              { id: 'about', label: 'About Story' },
              { id: 'father_legacy', label: "Father's Legacy" },
              { id: 'footer', label: 'Footer Links' },
              { id: 'faqs', label: 'FAQs Config' }
            ].map(tab => (
              <option key={tab.id} value={tab.id} className="bg-obsidian-950 text-obsidian-100">
                {tab.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gold-500">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Settings sheets */}
      <div className="w-full">

        {/* ===== HERO SECTION EDITOR ===== */}
        {activeContentSection === 'hero' && (
          <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Hero Header Cover settings</h3>
              {contentSaveSuccess === 'hero' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Subtitle Banner Tagline">
                <Input type="text" value={heroForm.subtitle} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} placeholder="The Sound. The Story." />
              </FormField>
              <FormField label="Signature Name">
                <Input type="text" value={heroForm.signature} onChange={e => setHeroForm({ ...heroForm, signature: e.target.value })} placeholder="Midhun Saji Ram" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Title Line 1">
                <Input type="text" value={heroForm.titleLine1} onChange={e => setHeroForm({ ...heroForm, titleLine1: e.target.value })} placeholder="A Legacy" />
              </FormField>
              <FormField label="Title Line 2">
                <Input type="text" value={heroForm.titleLine2} onChange={e => setHeroForm({ ...heroForm, titleLine2: e.target.value })} placeholder="He Gave." />
              </FormField>
              <FormField label="Title Line 3 (Italic highlight)">
                <Input type="text" value={heroForm.titleLine3} onChange={e => setHeroForm({ ...heroForm, titleLine3: e.target.value })} placeholder="A Voice I Carry." />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Main Brief Narrative">
                <Textarea rows={2} value={heroForm.description} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} placeholder="From the melodies Saji Ram created..." />
              </FormField>

              <FormField label="Prominent Quote Text">
                <Textarea rows={2} value={heroForm.quote} onChange={e => setHeroForm({ ...heroForm, quote: e.target.value })} placeholder='"He wrote the scores..."' />
              </FormField>
            </div>

            <FormField label="Hero Wallpaper Image">
              <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'hero', 'heroImage')} label="Upload Cover Photo" value={heroForm.heroImage} />
              <Input type="text" value={typeof heroForm.heroImage === 'string' ? heroForm.heroImage : ''} onChange={e => setHeroForm({ ...heroForm, heroImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
            </FormField>

            <div className="flex justify-end pt-2">
              <button onClick={() => saveSiteContentSection('hero', heroForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                <Save size={13} />
                <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== ABOUT SECTION EDITOR ===== */}
        {activeContentSection === 'about' && (
          <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Biography Narrative Details</h3>
              {contentSaveSuccess === 'about' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Subtitle Section label">
                <Input type="text" value={aboutForm.subtitle} onChange={e => setAboutForm({ ...aboutForm, subtitle: e.target.value })} placeholder="Biography Story" />
              </FormField>
              <FormField label="Headline statement (use \n for line breaks)">
                <Input type="text" value={aboutForm.title} onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })} placeholder="Melodies bridging cinematic scores..." />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Biographical Narrative Paragraph 1">
                <Textarea rows={3} value={aboutForm.paragraph1} onChange={e => setAboutForm({ ...aboutForm, paragraph1: e.target.value })} />
              </FormField>

              <FormField label="Secondary Paragraph 2">
                <Textarea rows={3} value={aboutForm.paragraph2} onChange={e => setAboutForm({ ...aboutForm, paragraph2: e.target.value })} />
              </FormField>
            </div>

            <FormField label="Portrait Studio Cover Image">
              <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'about', 'portraitImage')} label="Upload portrait image file" value={aboutForm.portraitImage} />
              <Input type="text" value={typeof aboutForm.portraitImage === 'string' ? aboutForm.portraitImage : ''} onChange={e => setAboutForm({ ...aboutForm, portraitImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
            </FormField>

            {/* Stats Editor */}
            <div className="space-y-2 text-left">
              <label className="block text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Achievements counters</label>
              <div className="grid grid-cols-1 gap-2.5">
                {(aboutForm.stats || []).map((stat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-obsidian-950 border border-obsidian-700/40 p-3.5 rounded-lg">
                    <Select value={stat.iconName} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].iconName = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }}>
                      <option value="Music">Music Disc Icon</option>
                      <option value="Award">Achievement Award</option>
                      <option value="Users">Artists Collaborated</option>
                      <option value="Heart">Aesthetic Heart</option>
                    </Select>
                    <Input type="text" value={stat.value} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].value = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }} placeholder="Value (e.g. 50+)" className="sm:w-24 shrink-0" />
                    <Input type="text" value={stat.label} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].label = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }} placeholder="Stat Name Label (e.g. Songs Composed)" />
                    <button onClick={() => { const newStats = aboutForm.stats.filter((_, i) => i !== idx); setAboutForm({ ...aboutForm, stats: newStats }); }} className="text-slate-455 hover:text-red-550 p-2 hover:bg-red-550/10 rounded transition-colors cursor-pointer shrink-0"><Trash2 size={13} /></button>
                  </div>
                ))}
                <button onClick={() => setAboutForm({ ...aboutForm, stats: [...(aboutForm.stats || []), { iconName: 'Music', value: '', label: '' }] })} className="text-gold-500 hover:text-gold-600 text-[9px] uppercase tracking-widest font-black flex items-center space-x-1 cursor-pointer py-1.5 w-max select-none">
                  <Plus size={12} /><span>Add Counter Stat</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => saveSiteContentSection('about', aboutForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                <Save size={13} />
                <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== FATHER'S LEGACY EDITOR ===== */}
        {activeContentSection === 'father_legacy' && (
          <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Father's Musical Legacy Settings</h3>
              {contentSaveSuccess === 'father_legacy' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Subtitle Banner Header">
                <Input type="text" value={legacyForm.subtitle} onChange={e => setLegacyForm({ ...legacyForm, subtitle: e.target.value })} placeholder="Saji Ram legacy" />
              </FormField>
              <FormField label="Headline statement (use \n for line breaks)">
                <Input type="text" value={legacyForm.title} onChange={e => setLegacyForm({ ...legacyForm, title: e.target.value })} placeholder="Before I found my voice..." />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Biographical Description Paragraph 1">
                <Textarea rows={3} value={legacyForm.paragraph1} onChange={e => setLegacyForm({ ...legacyForm, paragraph1: e.target.value })} />
              </FormField>

              <FormField label="Secondary Description Paragraph 2">
                <Textarea rows={3} value={legacyForm.paragraph2} onChange={e => setLegacyForm({ ...legacyForm, paragraph2: e.target.value })} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Main Legacy Background Photo">
                <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'father_legacy', 'mainImage')} label="Upload Main Photo" value={legacyForm.mainImage} />
                <Input type="text" value={typeof legacyForm.mainImage === 'string' ? legacyForm.mainImage : ''} onChange={e => setLegacyForm({ ...legacyForm, mainImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
              </FormField>
              <FormField label="Overlapping Portrait Photo">
                <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'father_legacy', 'polaroidImage')} label="Upload Portrait Photo" value={legacyForm.polaroidImage} />
                <Input type="text" value={typeof legacyForm.polaroidImage === 'string' ? legacyForm.polaroidImage : ''} onChange={e => setLegacyForm({ ...legacyForm, polaroidImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Portrait Caption text">
                <Input type="text" value={legacyForm.polaroidCaption} onChange={e => setLegacyForm({ ...legacyForm, polaroidCaption: e.target.value })} placeholder="e.g. Saji Ram" />
              </FormField>
              <FormField label="Cursive Script signature line">
                <Input type="text" value={legacyForm.cursiveText} onChange={e => setLegacyForm({ ...legacyForm, cursiveText: e.target.value })} placeholder="e.g. A legacy that lives on..." />
              </FormField>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => saveSiteContentSection('father_legacy', legacyForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                <Save size={13} />
                <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== FOOTER EDITOR ===== */}
        {activeContentSection === 'footer' && (
          <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Footer Info & Contact channels</h3>
              {contentSaveSuccess === 'footer' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Brand Header Name">
                <Input type="text" value={footerForm.brandName} onChange={e => setFooterForm({ ...footerForm, brandName: e.target.value })} placeholder="Midhun Saji Ram" />
              </FormField>
              <FormField label="Brand Tagline text label">
                <Input type="text" value={footerForm.brandTagline} onChange={e => setFooterForm({ ...footerForm, brandTagline: e.target.value })} placeholder="Music Director & Composer" />
              </FormField>
            </div>

            <FormField label="Bottom Brand Description text">
              <Textarea rows={2} value={footerForm.description} onChange={e => setFooterForm({ ...footerForm, description: e.target.value })} />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Booking Inquiry Email">
                <Input type="email" value={footerForm.bookingEmail} onChange={e => setFooterForm({ ...footerForm, bookingEmail: e.target.value })} placeholder="bookings@midhunsajiram.com" />
              </FormField>
              <FormField label="Artist Base Location">
                <Input type="text" value={footerForm.location} onChange={e => setFooterForm({ ...footerForm, location: e.target.value })} placeholder="Kochi, Kerala, India" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Spotify Artist URL">
                <Input type="text" value={footerForm.spotifyUrl} onChange={e => setFooterForm({ ...footerForm, spotifyUrl: e.target.value })} placeholder="https://spotify.com" />
              </FormField>
              <FormField label="YouTube Studio URL">
                <Input type="text" value={footerForm.youtubeUrl} onChange={e => setFooterForm({ ...footerForm, youtubeUrl: e.target.value })} placeholder="https://youtube.com" />
              </FormField>
              <FormField label="Instagram Profile URL">
                <Input type="text" value={footerForm.instagramUrl} onChange={e => setFooterForm({ ...footerForm, instagramUrl: e.target.value })} placeholder="https://instagram.com" />
              </FormField>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => saveSiteContentSection('footer', footerForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                <Save size={13} />
                <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== FAQ MANAGER ===== */}
        {activeContentSection === 'faqs' && (
          <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
            <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
              <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">FAQ Accordion Listings</h3>
              {contentSaveSuccess === 'faqs' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Section subtitle mini header">
                <Input type="text" value={faqsForm.subtitle} onChange={e => setFaqsForm({ ...faqsForm, subtitle: e.target.value })} placeholder="FAQs" />
              </FormField>
              <FormField label="Accordion segment title">
                <Input type="text" value={faqsForm.title} onChange={e => setFaqsForm({ ...faqsForm, title: e.target.value })} placeholder="Frequently Asked Questions" />
              </FormField>
            </div>

            {/* Existing FAQ Items */}
            <div className="space-y-3.5 pt-2 text-left">
              <label className="block text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Questions & Answers ({(faqsForm.items || []).length})</label>
              {(faqsForm.items || []).map((item, idx) => (
                <div key={idx} className="bg-obsidian-950 border border-obsidian-700/40 p-4 rounded-xl space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2.5">
                      <Input type="text" value={item.question} onChange={e => { const items = [...faqsForm.items]; items[idx].question = e.target.value; setFaqsForm({ ...faqsForm, items }); }} placeholder="Question Title Topic" />
                      <Textarea rows={2} value={item.answer} onChange={e => { const items = [...faqsForm.items]; items[idx].answer = e.target.value; setFaqsForm({ ...faqsForm, items }); }} placeholder="Answer description details" />
                    </div>
                    <div className="flex flex-col gap-1 shrink-0 select-none pt-2 font-mono">
                      {idx > 0 && (
                        <button onClick={() => { const items = [...faqsForm.items];[items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; setFaqsForm({ ...faqsForm, items }); }} className="text-slate-455 hover:text-gold-500 p-1.5 hover:bg-obsidian-850 rounded text-xs cursor-pointer" title="Move Up">▲</button>
                      )}
                      {idx < (faqsForm.items || []).length - 1 && (
                        <button onClick={() => { const items = [...faqsForm.items];[items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; setFaqsForm({ ...faqsForm, items }); }} className="text-slate-455 hover:text-gold-500 p-1.5 hover:bg-obsidian-850 rounded text-xs cursor-pointer" title="Move Down">▼</button>
                      )}
                      <button onClick={() => { const items = faqsForm.items.filter((_, i) => i !== idx); setFaqsForm({ ...faqsForm, items }); }} className="text-slate-500 hover:text-red-500 p-1.5 hover:bg-red-550/10 rounded transition-colors cursor-pointer" title="Delete FAQ"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New FAQ */}
            <div className="bg-obsidian-950 border border-gold-500/20 p-4.5 rounded-xl space-y-3.5 mt-4">
              <label className="block text-[9.5px] uppercase tracking-widest text-gold-500 font-black">Create a new FAQ Node</label>
              <Input type="text" value={newFaqQuestion} onChange={e => setNewFaqQuestion(e.target.value)} placeholder="Enter new FAQ question..." />
              <Textarea rows={2} value={newFaqAnswer} onChange={e => setNewFaqAnswer(e.target.value)} placeholder="Enter detailed FAQ answer narrative..." />
              <button onClick={() => { if (newFaqQuestion.trim() && newFaqAnswer.trim()) { setFaqsForm({ ...faqsForm, items: [...(faqsForm.items || []), { question: newFaqQuestion, answer: newFaqAnswer }] }); setNewFaqQuestion(''); setNewFaqAnswer(''); } }} className="text-gold-500 hover:text-gold-600 text-[9px] uppercase tracking-widest font-black flex items-center space-x-1 cursor-pointer py-1 select-none">
                <Plus size={12} /><span>Add Node</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => saveSiteContentSection('faqs', faqsForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                <Save size={13} />
                <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
