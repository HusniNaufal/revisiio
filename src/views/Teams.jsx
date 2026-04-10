import React from 'react';
import { Users2, Network } from 'lucide-react';

export default function Teams({ teamsData, assignments, currentUser }) {
  
  // Filter visibility based on role
  let visibleUsers = [];

  if (currentUser.role === 'Super Admin') {
    visibleUsers = teamsData;
  } else if (currentUser.role.toLowerCase().includes('client')) {
    // Client sees themselves and all CCs assigned to them
    const assignedIds = assignments.filter(a => a.client_id === currentUser.id).map(a => a.cc_id);
    visibleUsers = teamsData.filter(u => u.id === currentUser.id || assignedIds.includes(u.id));
  } else {
    // CC sees themselves, their assigned Clients, and fellow CCs for those clients
    const clientIds = assignments.filter(a => a.cc_id === currentUser.id).map(a => a.client_id);
    const fellowCCIds = assignments.filter(a => clientIds.includes(a.client_id)).map(a => a.cc_id);
    
    // Merge unique IDs
    const allVisibleIds = [...new Set([...clientIds, ...fellowCCIds, currentUser.id])];
    visibleUsers = teamsData.filter(u => allVisibleIds.includes(u.id));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in pb-10">
       
       <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Circle Kerja Anda</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Daftar klien dan kolega yang terhubung langsung dengan Anda.</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Network size={20} className="opacity-80" />
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {visibleUsers.map((tm, idx) => (
           <div key={tm.id || idx} className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-all ${tm.id === currentUser.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg italic uppercase ${tm.role.toLowerCase().includes('client') ? 'bg-orange-50 text-orange-500' : 'bg-indigo-50 text-indigo-600'}`}>
                  {tm.name.charAt(0)}
                </div>
                <div>
                   <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight flex items-center gap-2">
                     {tm.name}
                     {tm.id === currentUser.id && <span className="text-[8px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">YOU</span>}
                   </h4>
                   <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${tm.role.toLowerCase().includes('client') ? 'text-orange-500' : 'text-indigo-500'}`}>
                     {tm.role}
                   </p>
                   {tm.username && (
                     <p className="text-[9px] font-medium text-slate-400 mt-0.5">@{tm.username}</p>
                   )}
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
}
