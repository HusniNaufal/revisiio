import React from 'react';
import { X, FileVideo, FileText, History, MessageSquare, Send } from 'lucide-react';

export default function ContentDetailModal({
  selectedContent,
  setSelectedContent,
  role,
  viewingVersion,
  setViewingVersion,
  commentInput,
  setCommentInput,
  handleUpdateStatus,
  handlePostComment
}) {
  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
       <div className="w-full max-w-[1000px] bg-white h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right-full duration-500 ease-out overflow-hidden">
          {/* PREVIEW PANEL */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/20 overflow-hidden">
             <header className="h-20 md:h-24 px-6 md:px-10 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-6 text-left">
                   <button onClick={() => setSelectedContent(null)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all active:scale-90"><X size={20}/></button>
                   <div>
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{selectedContent.currentStatus}</p>
                      <h3 className="font-black text-lg text-slate-900 tracking-tight uppercase">{selectedContent.title}</h3>
                   </div>
                </div>
                <div className="flex gap-3">
                  {role === 'Client' && selectedContent.currentStatus === 'Review' && (
                    <>
                      <button onClick={() => handleUpdateStatus(selectedContent.id, 'Review', 'Revisi')} className="px-6 py-3 border border-rose-100 text-rose-500 text-[10px] font-black rounded-xl uppercase hover:bg-rose-50 transition-colors">Tolak</button>
                      <button onClick={() => handleUpdateStatus(selectedContent.id, 'Review', 'Approved')} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase hover:bg-indigo-600 shadow-xl transition-all">Terima</button>
                    </>
                  )}
                  {role === 'Creator' && selectedContent.currentStatus === 'Revisi' && (
                    <button onClick={() => handleUpdateStatus(selectedContent.id, 'Revisi', 'Review')} className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase hover:shadow-lg transition-all">Unggah Perbaikan</button>
                  )}
                  {role === 'Creator' && selectedContent.currentStatus === 'Draft' && (
                    <button onClick={() => handleUpdateStatus(selectedContent.id, 'Draft', 'Review')} className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase transition-all">Kirim Review</button>
                  )}
                </div>
             </header>

             <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="aspect-video bg-white rounded-3xl md:rounded-[3rem] border-2 border-slate-100 shadow-xl flex flex-col items-center justify-center mb-6 md:mb-10 group overflow-hidden relative">
                   <div className="text-center group-hover:scale-110 transition-transform duration-700 opacity-20 pointer-events-none">
                      {selectedContent.type === 'video' ? <FileVideo size={64} /> : <FileText size={64} />}
                      <p className="text-[10px] font-black uppercase mt-4 tracking-widest italic font-mono">CONTENT PREVIEW v{viewingVersion || selectedContent.version}</p>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent"></div>
                </div>

                <div className="text-left">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3"><History size={16}/> Versi Konten</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedContent.versions.map(v => (
                        <button key={v.v} onClick={() => setViewingVersion(v.v)} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${ (viewingVersion === v.v) || (!viewingVersion && v.v === selectedContent.version) ? 'border-indigo-600 bg-indigo-50/40 shadow-inner' : 'border-white bg-white shadow-sm hover:border-slate-100'}`}>
                           <div className="flex justify-between mb-2">
                              <span className="text-[10px] font-black text-indigo-500 uppercase">{v.v}</span>
                              <span className="text-[9px] font-bold text-slate-300">{v.date}</span>
                           </div>
                           <p className="text-[11px] font-bold text-slate-500 line-clamp-2 italic leading-relaxed">"{v.note}"</p>
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* INTERACTION PANEL */}
          <div className="w-full md:w-96 flex flex-col bg-white h-1/2 md:h-full shrink-0">
             <div className="p-4 md:p-8 border-b border-slate-50 text-left shrink-0">
                <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-3"><MessageSquare size={16} className="text-indigo-500"/> Feedback Panel</h4>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 bg-slate-50/10 custom-scrollbar text-left">
                {selectedContent.versions.find(v => v.v === (viewingVersion || selectedContent.version))?.comments.length === 0 ? (
                  <div className="py-24 text-center opacity-20 grayscale">
                     <MessageSquare size={48} strokeWidth={1.5} className="mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Belum ada diskusi</p>
                  </div>
                ) : (
                  selectedContent.versions.find(v => v.v === (viewingVersion || selectedContent.version))?.comments.map(c => (
                    <div key={c.id} className="space-y-3 animate-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-black shadow-sm ${c.user === 'Client' ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white'}`}>{c.user.charAt(0)}</div>
                          <span className="text-[10px] font-black text-slate-700 uppercase">{c.user}</span>
                       </div>
                       <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm">
                          <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed">"{c.text}"</p>
                       </div>
                    </div>
                  ))
                )}
             </div>

             <div className="p-8 border-t border-slate-50">
                <div className="relative">
                   <textarea 
                     value={commentInput}
                     onChange={(e) => setCommentInput(e.target.value)}
                     placeholder="Beri masukan..." 
                     className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-50 focus:bg-white rounded-3xl p-5 pr-14 text-xs font-bold outline-none h-28 resize-none transition-all"
                   />
                   <button onClick={handlePostComment} className="absolute bottom-4 right-4 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-600 active:scale-90 transition-all"><Send size={16}/></button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
