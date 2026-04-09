import React from 'react';
import { Layers, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard({ kontenData, setSelectedContent, setActiveNav }) {
  const activeCount = Object.values(kontenData).flat().length - kontenData.Approved.length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-left animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <StatCard icon={<Layers size={20} />} label="Aktif" value={activeCount} color="indigo" />
         <StatCard icon={<CheckCircle2 size={20} />} label="Selesai" value={kontenData.Approved.length} color="emerald" />
         <StatCard icon={<TrendingUp size={20} />} label="Efisiensi" value="94%" color="violet" />
         <StatCard icon={<Clock size={20} />} label="Pending" value={kontenData.Review.length} color="amber" />
      </div>

      <div className="bg-[#020617] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-indigo-600/20 rounded-full blur-[60px] md:blur-[100px]"></div>
         <div className="relative z-10 text-center md:text-left">
           <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tighter uppercase italic">Optimalkan Alur Approval.</h3>
           <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto md:mx-0">Semua komunikasi antara Client dan Creator kini terpusat pada satu sistem version control yang presisi.</p>
         </div>
      </div>

      <div className="space-y-6">
         <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest px-4">Watchlist Deadline</h4>
         <div className="grid grid-cols-1 gap-4">
            {Object.entries(kontenData)
              .flatMap(([status, items]) => items.map(i => ({...i, status})))
              .filter(x => x.status !== 'Approved')
              .slice(0, 3)
              .map(item => (
               <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{item.version}</div>
                     <div>
                        <h5 className="font-black text-slate-800 text-[13px] uppercase">{item.title}</h5>
                        <p className="text-[9px] font-bold text-slate-300 uppercase mt-1 tracking-widest">{item.status} • {item.author}</p>
                     </div>
                  </div>
                  <button onClick={() => { setSelectedContent({...item, currentStatus: item.status}); setActiveNav('Workflow'); }} className="text-[9px] font-black bg-slate-900 text-white px-6 py-3 rounded-xl uppercase hover:bg-indigo-600 transition-colors">Detail</button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
