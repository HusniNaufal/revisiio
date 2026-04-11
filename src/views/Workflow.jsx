import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';

export default function Workflow({ filteredData, setSelectedContent, setViewingVersion }) {
  const isDeadlinePassed = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div className="flex flex-col gap-10 pb-10 min-h-[calc(100vh-250px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
       {Object.entries(filteredData).map(([status, cards]) => (
         <div key={status} className="w-full flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between px-4 border-b border-dashed border-slate-200 pb-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{status}</span>
               <span className="bg-slate-100/50 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full">{cards.length} Item</span>
            </div>
            
            <div className="bg-slate-50/30 rounded-[2rem] p-4 border border-slate-100/50 min-h-[160px]">
               {cards.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
                    <Layers className="mx-auto mb-2" size={24} />
                    <p className="text-[9px] font-black uppercase">Kosong</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                 {cards.map(card => (
                   <div key={card.id} onClick={() => { setSelectedContent({...card, currentStatus: status}); setViewingVersion(null); }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-400 cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between mb-4">
                           <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-3 py-1 rounded-lg border border-indigo-100">{card.version}</span>
                           {isDeadlinePassed(card.deadline) && status !== 'Approved' && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                        </div>
                        <h4 className="text-[12px] font-black text-slate-800 mb-6 leading-tight uppercase group-hover:text-indigo-600 transition-colors">{card.title}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black">{card.initial}</div>
                            <span className="text-[9px] font-bold text-slate-400">{card.author.split(' ')[0]}</span>
                         </div>
                         <span className="text-[9px] font-black text-slate-300">{card.date}</span>
                      </div>
                   </div>
                 ))}
                 </div>
               )}
            </div>
         </div>
       ))}
    </div>
  );
}
