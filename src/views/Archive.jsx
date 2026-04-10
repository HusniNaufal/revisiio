import React from 'react';
import { Archive as ArchiveIcon, CheckCircle2 } from 'lucide-react';

export default function Archive({ kontenData, setSelectedContent, setViewingVersion }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in">
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-10 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase">Konten Selesai</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Data store untuk semua aset yang telah disetujui client.</p>
        </div>
        <ArchiveIcon className="text-slate-200" size={40} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {kontenData.Approved.length === 0 ? (
          <div className="py-20 text-center opacity-30">Belum ada konten yang disetujui.</div>
        ) : (
          kontenData.Approved.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center transition-transform group-hover:rotate-12"><CheckCircle2 size={24} /></div>
                <h4 className="font-black text-slate-700 uppercase tracking-tight text-sm">{item.title}</h4>
              </div>
              <button onClick={() => { setSelectedContent({ ...item, currentStatus: 'Approved' }); setViewingVersion(null); }} className="text-[10px] font-black px-6 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors uppercase">Detail Archive</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
