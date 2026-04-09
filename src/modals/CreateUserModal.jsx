import React from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';

export default function CreateUserModal({ setIsModalUserOpen, handleAddTeam, newUser, setNewUser, editMode, errorMsg }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
       <div className="bg-white w-full max-w-xl rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 text-left shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
                  {editMode ? 'Edit' : 'Baru'}
                </h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 italic">
                  {editMode ? 'Ubah Data Pengguna' : 'Tambahkan Tim Akses'}
                </p>
             </div>
             <button onClick={() => setIsModalUserOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-2xl flex items-center gap-2 mb-6 animate-in fade-in">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddTeam} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Lengkap</label>
                <input required type="text" placeholder="Contoh: Budi Santoso" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Username (Login)</label>
                   <input required type="text" placeholder="contoh: budi" value={newUser.username || ''} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                     {editMode ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                   </label>
                   <input 
                     type="password" 
                     placeholder={editMode ? '••••••' : 'min. 4 karakter'} 
                     required={!editMode}
                     value={newUser.password || ''} 
                     onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                     className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none transition-all" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Peran (Role)</label>
                   <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="Creator">CREATOR</option>
                      <option value="Client">CLIENT</option>
                      <option value="Reviewer">REVIEWER</option>
                      <option value="Super Admin">SUPER ADMIN</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Status</label>
                   <select value={newUser.status} onChange={(e) => setNewUser({...newUser, status: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="Active">ACTIVE</option>
                      <option value="On Leave">ON LEAVE</option>
                   </select>
                </div>
             </div>

             <button type="submit" className="w-full py-5 bg-[#020617] text-white rounded-[1.8rem] font-black text-[11px] tracking-[0.2em] uppercase shadow-2xl hover:bg-indigo-600 transition-all transform active:scale-95 flex items-center justify-center gap-3">
               <UserPlus size={16} /> {editMode ? 'SIMPAN PERUBAHAN' : 'SIMPAN ANGGOTA'}
             </button>
          </form>
       </div>
    </div>
  );
}
