import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';

export default function Workflow({ filteredData, setSelectedContent, setViewingVersion }) {
  const isDeadlinePassed = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div className="flex gap-8 overflow-x-auto pb-10 min-h-[calc(100vh-250px)] no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
       {Object.entries(filteredData).map(([status, cards]) => (
         <div key={status} className="w-[320px] shrink-0 flex flex-col gap-6 text-left">
            <div className="flex items-center justify-between px-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{status}</span>
               <span className="bg-white border border-slate-100 text-[9px] font-black px-3 py-1 rounded-full">{cards.length}</span>
            </div>
            
            <div className="flex-1 bg-slate-50/50 rounded-[3rem] p-4 space-y-4 border border-slate-200/40">
               {cards.length === 0 ? (
                 <div className="py-20 text-center opacity-20">
                    <Layers className="mx-auto mb-2" size={24} />
                    <p className="text-[9px] font-black uppercase">Kosong</p>
                 </div>
               ) : (
                 cards.map(card => (
                   <div key={card.id} onClick={() => { setSelectedContent({...card, currentStatus: status}); setViewingVersion(null); }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-400 cursor-pointer transition-all active:scale-[0.98] group">
                      <div className="flex justify-between mb-4">
                         <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-3 py-1 rounded-lg border border-indigo-100">{card.version}</span>
                         {isDeadlinePassed(card.deadline) && status !== 'Approved' && <AlertCircle size={14} className="text-rose-500" />}
                      </div>
                      <h4 className="text-[12px] font-black text-slate-800 mb-6 leading-tight uppercase group-hover:text-indigo-600">{card.title}</h4>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black">{card.initial}</div>
                            <span className="text-[9px] font-bold text-slate-400">{card.author.split(' ')[0]}</span>
                         </div>
                         <span className="text-[9px] font-black text-slate-300">{card.date}</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>
       ))}
    </div>
  );
}
