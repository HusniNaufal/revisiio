"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Layers, 
  Search,
  Users,
  Settings as SettingsIcon,
  Archive as ArchiveIcon,
  Menu
} from 'lucide-react';

// Supabase Helpers
import {
  fetchKontenData,
  fetchTeamsData,
  createProject,
  updateProjectStatus,
  uploadNewVersion,
  postComment,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  fetchAssignments,
  assignTeamMember,
  removeTeamAssignment
} from '../lib/supabaseHelpers';

// Components
import SidebarLink from '../components/SidebarLink';

// Views
import Login from '../views/Login';
import Dashboard from '../views/Dashboard';
import Workflow from '../views/Workflow';
import Archive from '../views/Archive';
import Teams from '../views/Teams';
import Settings from '../views/Settings';

// Modals
import ContentDetailModal from '../modals/ContentDetailModal';
import CreateProjectModal from '../modals/CreateProjectModal';
import CreateUserModal from '../modals/CreateUserModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('Creator');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedContent, setSelectedContent] = useState(null);
  
  const [kontenData, setKontenData] = useState({ Draft: [], Review: [], Revisi: [], Approved: [] });
  const [teamsData, setTeamsData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [viewingVersion, setViewingVersion] = useState(null);
  
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', type: 'doc', deadline: '', priority: 'Medium', clientId: '' });
  
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'Creator', status: 'Active', username: '', password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [userModalError, setUserModalError] = useState('');

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper untuk notifikasi
  const notify = (msg) => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  // Refresh hanya data konten
  const refreshKonten = useCallback(async () => {
    if (!currentUser) return;
    const konten = await fetchKontenData(currentUser);
    setKontenData(konten);
  }, [currentUser]);

  // Refresh hanya data tim & assignment
  const refreshTeams = useCallback(async () => {
    if (!currentUser) return;
    const [teams, asg] = await Promise.all([
      fetchTeamsData(currentUser),
      fetchAssignments()
    ]);
    setTeamsData(teams);
    setAssignments(asg || []);
  }, [currentUser]);

  // Refresh semua data dari Supabase (untuk initial load)
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    const [konten, teams, asg] = await Promise.all([
      fetchKontenData(currentUser),
      fetchTeamsData(currentUser),
      fetchAssignments()
    ]);
    setKontenData(konten);
    setTeamsData(teams);
    setAssignments(asg || []);
    setIsLoading(false);
  }, [currentUser]);

  // Load data saat login
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      refreshData();
    }
  }, [isLoggedIn, currentUser, refreshData]);

  const handleLogin = (userData) => {
    setRole(userData.role);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    notify(`Selamat datang, ${userData.name}!`);
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    if (!newContent.clientId) {
      notify("Pilih klien terlebih dahulu!");
      return;
    }
    const authorName = currentUser?.name || 'Unknown';
    const authorInitial = authorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const result = await createProject({
      title: newContent.title,
      type: newContent.type,
      deadline: newContent.deadline,
      priority: newContent.priority,
      authorName,
      authorInitial,
      userRole: role,
      clientId: newContent.clientId
    });

    if (result) {
      await refreshData();
      setIsModalCreateOpen(false);
      setNewContent({ title: '', type: 'doc', deadline: '', priority: 'Medium', clientId: '' });
      notify("Projek baru berhasil dibuat.");
    }
  };

  const handleUpdateStatus = async (contentId, currentStatus, newStatus) => {
    const success = await updateProjectStatus(contentId, currentStatus, newStatus, role);
    if (success) {
      await refreshKonten();
      setSelectedContent(null);
      setViewingVersion(null);
      notify(`Konten dipindahkan ke status: ${newStatus}`);
    }
  };

  const handleUploadVersion = async (contentId, note) => {
    const success = await uploadNewVersion(contentId, role, note);
    if (success) {
      await refreshKonten();
      setSelectedContent(null);
      setViewingVersion(null);
      notify('Versi baru berhasil diunggah.');
    }
  };

  const handlePostComment = async () => {
    if (!commentInput.trim() || !selectedContent) return;
    
    const targetVersionStr = viewingVersion || selectedContent.version;
    
    const result = await postComment(
      selectedContent.id,
      targetVersionStr,
      role,
      commentInput
    );

    if (result) {
      await refreshKonten();
      setCommentInput("");
      notify("Feedback berhasil disimpan.");
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    setUserModalError('');

    if (editingUserId) {
      // Mode Edit
      const result = await updateTeamMember(editingUserId, newUser);
      if (result?.error) {
        setUserModalError(result.error.includes('unique') ? 'Username sudah dipakai pengguna lain.' : result.error);
        return;
      }
      await refreshTeams();
      setIsModalUserOpen(false);
      setEditingUserId(null);
      setNewUser({ name: '', role: 'Creator', status: 'Active', username: '', password: '' });
      notify("Data anggota berhasil diperbarui.");
    } else {
      // Mode Tambah
      const result = await addTeamMember(newUser);
      if (result?.error) {
        setUserModalError(result.error.includes('unique') ? 'Username sudah dipakai.' : result.error);
        return;
      }
      await refreshTeams();
      setIsModalUserOpen(false);
      setNewUser({ name: '', role: 'Creator', status: 'Active', username: '', password: '' });
      notify("Anggota tim berhasil ditambahkan.");
    }
  };

  const handleEditTeam = (idx) => {
    const member = teamsData[idx];
    if (!member) return;
    setEditingUserId(member.id);
    setNewUser({ name: member.name, role: member.role, status: member.status, username: member.username || '', password: '' });
    setUserModalError('');
    setIsModalUserOpen(true);
  };

  const handleDeleteTeam = async (idx) => {
    const member = teamsData[idx];
    if (!member?.id) return;
    
    const success = await deleteTeamMember(member.id);
    if (success) {
      await refreshTeams();
      notify("Anggota tim berhasil dihapus.");
    }
  };

  const handleAssign = async (clientId, ccId) => {
    const res = await assignTeamMember(clientId, ccId);
    if (!res.error) {
      await refreshTeams();
      notify('Anggota berhasil ditugaskan ke klien.');
    } else {
      notify(res.error);
    }
  };

  const handleRemoveAssign = async (clientId, ccId) => {
    const res = await removeTeamAssignment(clientId, ccId);
    if (res) {
      await refreshTeams();
      notify('Tugas dibatalkan.');
    }
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.keys(kontenData).forEach(key => {
      result[key] = kontenData[key].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return result;
  }, [kontenData, searchQuery]);

  // View: Login
  if (!isLoggedIn) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFBFF] font-sans overflow-hidden">
      
      {/* NOTIFICATIONS UI */}
      <div className="fixed top-8 right-8 z-[300] space-y-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-white border border-slate-100 shadow-2xl p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-right-10 pointer-events-auto">
             <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-200"></div>
             <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{n.msg}</p>
          </div>
        ))}
      </div>

      {/* SIDEBAR NAVIGATION */}
      {/* Overlay Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[150] bg-slate-900/50 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-[200] w-80 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-16 px-2 cursor-pointer" onClick={() => setActiveNav('Dashboard')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-100 transition-transform active:scale-90">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase text-slate-900">revisi.io</span>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeNav === 'Dashboard'} onClick={() => setActiveNav('Dashboard')} />
            <SidebarLink icon={<Layers size={18} />} label="Pipeline" active={activeNav === 'Workflow'} onClick={() => setActiveNav('Workflow')} />
            <SidebarLink icon={<ArchiveIcon size={18} />} label="Archive" active={activeNav === 'Archive'} onClick={() => setActiveNav('Archive')} />
            <SidebarLink icon={<Users size={18} />} label="Teams" active={activeNav === 'Teams'} onClick={() => setActiveNav('Teams')} />
          </nav>

          <div className="pt-10 border-t border-slate-50 space-y-2">
             {role === 'Super Admin' && (
               <SidebarLink icon={<SettingsIcon size={18} />} label="Pengaturan" active={activeNav === 'Settings'} onClick={() => setActiveNav('Settings')} />
             )}
          </div>
        </div>

        <div className="p-8">
          <div className="bg-slate-50 rounded-[2rem] p-5 flex items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-[10px] uppercase shadow-lg">
              {currentUser?.name?.charAt(0) || role.charAt(0)}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[10px] font-black text-slate-900 truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">{role}</p>
            </div>
            <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} className="text-slate-300 hover:text-rose-500 p-2 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 md:h-24 px-6 md:px-12 flex items-center justify-between border-b border-slate-50 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50">
           <div className="flex items-center gap-4 md:gap-6 text-left">
             <button 
               onClick={() => setIsMobileMenuOpen(true)} 
               className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
             >
               <Menu size={24} />
             </button>
             <div className="flex flex-col">
               <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">{activeNav}</h2>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden md:block">Operational Environment</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3 md:gap-6">
              <div className="relative group hidden lg:block">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
                 <input 
                   type="text" 
                   placeholder="Cari draf atau aset..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-[11px] font-bold outline-none focus:bg-white focus:border-indigo-100 w-64 transition-all"
                 />
              </div>

              {((!role.toLowerCase().includes('client') && role !== 'Reviewer') || role === 'Super Admin') && (
                <button onClick={() => setIsModalCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 md:px-8 md:py-4 rounded-2xl text-[10px] font-black flex items-center gap-2 md:gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                  <Plus size={16} strokeWidth={3} /> <span className="hidden md:inline">UNGGAH BARU</span><span className="md:hidden">BARU</span>
                </button>
              )}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          {activeNav === 'Dashboard' && (
            <Dashboard 
              kontenData={kontenData} 
              setSelectedContent={setSelectedContent} 
              setActiveNav={setActiveNav} 
            />
          )}

          {activeNav === 'Workflow' && (
            <Workflow 
              filteredData={filteredData} 
              setSelectedContent={setSelectedContent} 
              setViewingVersion={setViewingVersion} 
            />
          )}

          {activeNav === 'Archive' && (
            <Archive 
              kontenData={kontenData} 
              setSelectedContent={setSelectedContent} 
              setViewingVersion={setViewingVersion} 
            />
          )}

          {activeNav === 'Teams' && (
            <Teams 
              teamsData={teamsData} 
              assignments={assignments}
              currentUser={currentUser}
            />
          )}

          {activeNav === 'Settings' && role === 'Super Admin' && (
            <Settings 
              teamsData={teamsData} 
              assignments={assignments}
              handleDeleteTeam={handleDeleteTeam} 
              handleEditTeam={handleEditTeam}
              handleAssign={handleAssign}
              handleRemoveAssign={handleRemoveAssign}
              setIsModalUserOpen={() => {
                setEditingUserId(null);
                setNewUser({ name: '', role: 'Creator', status: 'Active', username: '', password: '' });
                setUserModalError('');
                setIsModalUserOpen(true);
              }}
            />
          )}
        </div>

        {/* MODAL: DETAIL & FEEDBACK OVERLAY */}
        {selectedContent && (
          <ContentDetailModal 
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            role={role}
            viewingVersion={viewingVersion}
            setViewingVersion={setViewingVersion}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleUpdateStatus={handleUpdateStatus}
            handlePostComment={handlePostComment}
            handleUploadVersion={handleUploadVersion}
          />
        )}

        {/* MODAL: CREATE PROJECT */}
        {isModalCreateOpen && (
          <CreateProjectModal 
            setIsModalCreateOpen={setIsModalCreateOpen}
            handleCreateContent={handleCreateContent}
            newContent={newContent}
            setNewContent={setNewContent}
            teamsData={teamsData}
            assignments={assignments}
            currentUser={currentUser}
          />
        )}

        {/* MODAL: CREATE / EDIT USER */}
        {isModalUserOpen && (
          <CreateUserModal
            setIsModalUserOpen={(v) => { setIsModalUserOpen(v); if (!v) { setEditingUserId(null); setUserModalError(''); } }}
            handleAddTeam={handleAddTeam}
            newUser={newUser}
            setNewUser={setNewUser}
            editMode={!!editingUserId}
            errorMsg={userModalError}
          />
        )}
      </main>

      {/* Global CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; background: #FAFBFF; color: #1e293b; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        * { letter-spacing: -0.01em; scroll-behavior: smooth; }
        ::selection { background: #EEF2FF; color: #4F46E5; }
        
        /* Pulse Animation for Priority Urgent */
        .urgent-border { border-color: #f43f5e; animation: pulse-border 2s infinite; }
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
      `}} />
    </div>
  );
}

