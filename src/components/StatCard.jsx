import React from 'react';

export default function StatCard({ icon, label, value, color }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:translate-y-[-5px] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorMap[color]}`}>{icon}</div>
       <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">{label}</p>
       <p className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">{value}</p>
    </div>
  );
}
