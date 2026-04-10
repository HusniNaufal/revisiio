import React, { useState } from 'react';
import { Zap, LogIn, AlertCircle, Key, Loader2 } from 'lucide-react';
import { loginUser } from '../lib/supabaseHelpers';

export default function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorStr, setErrorStr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorStr("");

    const result = await loginUser(username, password);

    if (result.success) {
      handleLogin(result.user);
    } else {
      setErrorStr(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#ffffff] font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>
      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-12 shadow-2xl text-center relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-xl transform -rotate-6 transition-transform hover:rotate-0">
          <Zap className="text-white w-10 h-10 fill-white" />
        </div>
        <h1 className="text-3xl font-black text-black mb-2 tracking-tighter uppercase italic">revisi.io</h1>
        <p className="text-slate-400 text-sm mb-12">Manajemen Konten & Approval Professional</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {errorStr && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 mb-4 animate-in fade-in">
              <AlertCircle size={14} />
              <span>{errorStr}</span>
            </div>
          )}
          <div className="text-left space-y-3">
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorStr("");
              }}
              required
              disabled={isLoading}
              className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 text-black text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-500 disabled:opacity-50"
            />
            <div className="relative">
              <Key className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                suppressHydrationWarning
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 pr-12 text-black text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-500 disabled:opacity-50"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> MEMPROSES...</>
            ) : (
              <><LogIn size={18} /> MASUK SEKARANG</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
