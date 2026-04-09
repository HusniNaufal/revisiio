import React from 'react';

export default function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${active ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
      <span className={active ? 'text-indigo-400' : ''}>{icon}</span>
      {label}
    </button>
  );
}
