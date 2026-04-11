import React from 'react';

export default function StatCard({ icon, label, value, color }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-8 rounded-[0.75rem] border border-slate-100 shadow-sm hover:translate-y-[-5px] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex items-center gap-6">
      <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>{icon}</div>
      <div className="flex flex-col">
        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}
