import React, { useState } from 'react';
import { Trash2, UserPlus, Pencil, ShieldCheck, UserCheck, X } from 'lucide-react';

export default function Settings({
  teamsData,
  assignments,
  handleDeleteTeam,
  setIsModalUserOpen,
  handleEditTeam,
  handleAssign,
  handleRemoveAssign
}) {
  const [selectedClient, setSelectedClient] = useState(null);

  const clients = teamsData.filter(u => u.role.toLowerCase().includes('client'));
  const nonClients = teamsData.filter(u => !u.role.toLowerCase().includes('client') && u.role !== 'Super Admin');

  // Dapatkan assigned CC untuk client terpilih
  const assignedCCIds = selectedClient
    ? assignments.filter(a => a.client_id === selectedClient.id).map(a => a.cc_id)
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left animate-in fade-in pb-10">

      <div className="bg-indigo-600 rounded-[1.5rem] p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck size={32} />
          <h2 className="text-2xl font-black uppercase tracking-tight">Super Admin Settings</h2>
        </div>
        <p className="text-indigo-200 font-medium text-sm">Kelola pengguna, akses, dan pembagian pendelegasian Klien kepada Tim Kreatif.</p>
      </div>

      {/* MANAJEMEN PENUGASAN KLIEN <-> TIM */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
          <UserCheck size={20} className="text-indigo-500" /> Alokasi Tim Klien
        </h3>
        <p className="text-xs font-bold text-slate-400 mb-6">Pilih seorang klien untuk mengatur siapa saja tim (CC) yang ditugaskan menangani request mereka.</p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-3">
            {clients.map(client => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedClient?.id === client.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
              >
                <p className="font-black text-sm uppercase">{client.name}</p>
                <p className="text-[10px] font-bold opacity-70">@{client.username}</p>
              </button>
            ))}
            {clients.length === 0 && <p className="text-xs text-slate-400">Belum ada user Klien.</p>}
          </div>

          <div className="md:w-2/3 border border-slate-100 rounded-3xl p-6 bg-slate-50">
            {!selectedClient ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                Pilih Klien di sebelah kiri terlebih dahulu
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-4 uppercase">Tim yang bertugas untuk {selectedClient.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nonClients.map(cc => {
                    const isAssigned = assignedCCIds.includes(cc.id);
                    return (
                      <div key={cc.id} className={`flex items-center justify-between p-3 rounded-xl border ${isAssigned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                        <div>
                          <p className="text-xs font-black text-slate-800">{cc.name}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">{cc.role}</p>
                        </div>
                        <button
                          onClick={() => isAssigned ? handleRemoveAssign(selectedClient.id, cc.id) : handleAssign(selectedClient.id, cc.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAssigned ? 'bg-emerald-500 text-white hover:bg-rose-500' : 'bg-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white'}`}
                          title={isAssigned ? 'Hapus tugas' : 'Tugaskan'}
                        >
                          {isAssigned ? <X size={14} strokeWidth={3} className={isAssigned ? "hover:scale-110" : ""} /> : <UserPlus size={14} strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANAJEMEN PENGGUNA */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Database Pengguna</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Daftar semua akun yang terdaftar dalam sistem.</p>
          </div>
          <button onClick={() => setIsModalUserOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl text-[10px] font-black flex items-center gap-3 transition-all active:scale-95">
            <UserPlus size={16} strokeWidth={3} /> TAMBAH PENGGUNA
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamsData.map((tm, idx) => (
              <div key={tm.id} className="border border-slate-100 p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 text-sm italic uppercase">{tm.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight">{tm.name}</h4>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{tm.role}</p>
                    <p className="text-[9px] font-medium text-slate-400 truncate">@{tm.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEditTeam(idx)} className="w-8 h-8 text-slate-300 hover:text-indigo-500 bg-slate-50 hover:bg-indigo-50 rounded-lg flex items-center justify-center transition-all">
                    <Pencil size={14} />
                  </button>
                  {tm.role !== 'Super Admin' && (
                    <button onClick={() => handleDeleteTeam(idx)} className="w-8 h-8 text-slate-300 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg flex items-center justify-center transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
