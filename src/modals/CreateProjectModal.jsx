import React from 'react';
import { X } from 'lucide-react';

export default function CreateProjectModal({ setIsModalCreateOpen, handleCreateContent, newContent, setNewContent }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
       <div className="bg-white w-full max-w-xl rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 text-left shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Baru</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 italic">Daftarkan konten ke Data Store</p>
             </div>
             <button onClick={() => setIsModalCreateOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
          </div>
          <form onSubmit={handleCreateContent} className="space-y-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Projek</label>
                <input required type="text" placeholder="Contoh: TikTok Ad Ramadhan" value={newContent.title} onChange={(e) => setNewContent({...newContent, title: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Jenis</label>
                   <select value={newContent.type} onChange={(e) => setNewContent({...newContent, type: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="doc">DOCUMENT</option>
                      <option value="video">VIDEO</option>
                      <option value="design">DESIGN</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Priority</label>
                   <select value={newContent.priority} onChange={(e) => setNewContent({...newContent, priority: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="Medium">MEDIUM</option>
                      <option value="High">HIGH</option>
                      <option value="Urgent">URGENT</option>
                   </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Batas Waktu</label>
                <input required type="date" min={new Date().toISOString().split('T')[0]} value={newContent.deadline} onChange={(e) => setNewContent({...newContent, deadline: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all" />
             </div>
             <button type="submit" className="w-full py-5 bg-[#020617] text-white rounded-[1.8rem] font-black text-[11px] tracking-[0.2em] uppercase shadow-2xl hover:bg-indigo-600 transition-all transform active:scale-95">Simpan Data Projek</button>
          </form>
       </div>
    </div>
  );
}
