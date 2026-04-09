import React from 'react';
import { Trash2, UserPlus, Pencil } from 'lucide-react';

export default function Teams({ teamsData, role, handleDeleteTeam, setIsModalUserOpen, handleEditTeam }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in">
       
       {role === 'Super Admin' && (
         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Kelola Pengguna</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Super Admin Access: Anda memiliki hak untuk menambah, mengubah, dan menghapus tim.</p>
            </div>
            <button onClick={() => setIsModalUserOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl text-[10px] font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95">
               <UserPlus size={16} strokeWidth={3} /> TAMBAH ANGGOTA
            </button>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {teamsData.map((tm, idx) => (
           <div key={tm.id || idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-4px] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-lg italic uppercase">{tm.name.charAt(0)}</div>
                <div>
                   <h4 className="font-black text-slate-900 uppercase tracking-tight">{tm.name}</h4>
                   <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{tm.role}</p>
                   {tm.username && (
                     <p className="text-[9px] font-bold text-slate-400 mt-0.5">@{tm.username}</p>
                   )}
                   <div className="flex items-center gap-2 mt-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tm.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase">{tm.status}</span>
                   </div>
                </div>
              </div>
              
              {role === 'Super Admin' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEditTeam(idx)} className="w-10 h-10 bg-slate-50 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-all active:scale-90">
                     <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteTeam(idx)} className="w-10 h-10 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl flex items-center justify-center transition-all active:scale-90">
                     <Trash2 size={16} />
                  </button>
                </div>
              )}
           </div>
         ))}
       </div>
    </div>
  );
}
