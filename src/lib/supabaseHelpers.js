import { supabase } from './supabase';

// =============================================
// LOGIN: Cek username & password dari database
// =============================================
export async function loginUser(username, password) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .eq('password', password)
    .eq('status', 'Active')
    .single();

  if (error || !data) {
    return { success: false, message: 'Username atau password salah, atau akun tidak aktif.' };
  }

  return {
    success: true,
    user: {
      id: data.id,
      name: data.name,
      role: data.role,
      username: data.username
    }
  };
}

// =============================================
// FETCH: Ambil semua data projects (terfilter)
// =============================================
export async function fetchKontenData(currentUser) {
  if (!currentUser) return { Draft: [], Review: [], Revisi: [], Approved: [] };

  let projQuery = supabase
    .from('projects')
    .select('*, users!client_id(name)')
    .order('created_at', { ascending: false });

  // Filtering berdasarkan Role
  if (currentUser.role === 'Super Admin') {
    // Ambil semua
  } else if (currentUser.role.toLowerCase().includes('client')) {
    projQuery = projQuery.eq('client_id', currentUser.id);
  } else {
    // Creator / CC: Cari Client yang di-assign ke dia
    const { data: assignments } = await supabase
      .from('client_teams')
      .select('client_id')
      .eq('cc_id', currentUser.id);
    
    const clientIds = assignments ? assignments.map(a => a.client_id) : [];
    if (clientIds.length > 0) {
      projQuery = projQuery.in('client_id', clientIds);
    } else {
      return { Draft: [], Review: [], Revisi: [], Approved: [] };
    }
  }

  const { data: projects, error: projErr } = await projQuery;

  if (projErr) {
    console.error('Error fetching projects:', projErr);
    return { Draft: [], Review: [], Revisi: [], Approved: [] };
  }

  if (!projects || projects.length === 0) {
    return { Draft: [], Review: [], Revisi: [], Approved: [] };
  }

  // Ambil versions HANYA untuk project yang sudah di-fetch (bukan semua)
  const projectIds = projects.map(p => p.id);
  const { data: versions, error: verErr } = await supabase
    .from('project_versions')
    .select('*, comments(*)')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  if (verErr) {
    console.error('Error fetching versions:', verErr);
  }

  // Gabungkan & group by status
  const grouped = { Draft: [], Review: [], Revisi: [], Approved: [] };

  for (const proj of projects) {
    const projVersions = (versions || [])
      .filter(v => v.project_id === proj.id)
      .map(v => ({
        v: v.version_num,
        note: v.note,
        date: new Date(v.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        user: v.user_name,
        comments: (v.comments || []).map(c => ({
          id: c.id,
          user: c.user_name,
          text: c.text,
          time: new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }))
      }));

    const item = {
      id: proj.id,
      title: proj.title,
      type: proj.type,
      version: proj.current_version,
      author: proj.author_name, // Ini untuk creator
      client_name: proj.users?.name, // Ini nama client dari relasi
      client_id: proj.client_id,
      initial: proj.author_initial,
      date: new Date(proj.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      deadline: proj.deadline,
      priority: proj.priority,
      versions: projVersions
    };

    if (grouped[proj.status]) {
      grouped[proj.status].push(item);
    }
  }

  return grouped;
}

// =============================================
// FETCH: Ambil semua data teams
// =============================================
export async function fetchTeamsData(currentUser) {
  if (!currentUser) return [];

  let query = supabase.from('users').select('*').order('created_at', { ascending: false });

  if (currentUser.role !== 'Super Admin') {
    // Jika Client, ambil CC miliknya. Jika CC, ambil Client miliknya + CC lain di tim klien tsb.
    // Untuk mempermudah, kita biarkan read-only fetch semua user dulu, 
    // tapi nanti di front-end difilter berdasarkan Assignment.
    // Tapi akan lebih baik mengambil data assignments sekalian.
    // Di sini fetching all users, tapi filter visibility di komponen Teams.
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data.map(u => ({
    id: u.id,
    name: u.name,
    role: u.role,
    status: u.status,
    username: u.username || ''
  }));
}

// =============================================
// CREATE: Buat project baru
// =============================================
export async function createProject({ title, type, deadline, priority, authorName, authorInitial, userRole, clientId }) {
  // Insert project
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .insert({
      title,
      type,
      status: 'Draft',
      current_version: 'v1.0',
      author_name: authorName,
      author_initial: authorInitial,
      priority,
      client_id: clientId,
      deadline: new Date(deadline).toISOString()
    })
    .select()
    .single();

  if (projErr) {
    console.error('Error creating project:', projErr);
    return null;
  }

  // Insert version awal
  await supabase.from('project_versions').insert({
    project_id: project.id,
    version_num: 'v1.0',
    note: 'Draf awal telah diunggah ke sistem.',
    user_name: userRole
  });

  return project;
}

// =============================================
// UPDATE STATUS: Pindahkan project antar status
// =============================================
export async function updateProjectStatus(projectId, currentStatus, newStatus, userRole) {
  // Jika dari Revisi ke Review, naikkan versi
  if (currentStatus === 'Revisi' && newStatus === 'Review') {
    // Ambil current version
    const { data: proj } = await supabase
      .from('projects')
      .select('current_version')
      .eq('id', projectId)
      .single();

    if (proj) {
      const currentVerNum = parseFloat(proj.current_version.replace('v', ''));
      const newVer = `v${(currentVerNum + 0.1).toFixed(1)}`;

      // Update project version
      await supabase
        .from('projects')
        .update({ current_version: newVer, status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      // Insert new version record
      await supabase.from('project_versions').insert({
        project_id: projectId,
        version_num: newVer,
        note: 'Pembaruan berdasarkan feedback revisi.',
        user_name: userRole
      });

      return true;
    }
  }

  // Update status biasa (Bisa dipakai Client untuk Approved/Revisi)
  const { error } = await supabase
    .from('projects')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', projectId);

  if (error) {
    console.error('Error updating status:', error);
    return false;
  }
  return true;
}

// =============================================
// UPLOAD NEW VERSION (CC menangani project Revisi)
// =============================================
export async function uploadNewVersion(projectId, userRole, note = "Pembaruan berdasarkan feedback revisi.") {
  // Ambil current version
  const { data: proj } = await supabase
    .from('projects')
    .select('current_version')
    .eq('id', projectId)
    .single();

  if (!proj) return false;

  // Auto-Version bumping (V1.0 -> V2.0)
  const currentVerNum = parseFloat(proj.current_version.replace('v', ''));
  const newVer = `v${(Math.floor(currentVerNum) + 1).toFixed(1)}`; // Bumps 1.x -> 2.0 -> 3.0

  // Update project version & pindahkan balik ke Review
  await supabase
    .from('projects')
    .update({ current_version: newVer, status: 'Review', updated_at: new Date().toISOString() })
    .eq('id', projectId);

  // Insert new version record
  await supabase.from('project_versions').insert({
    project_id: projectId,
    version_num: newVer,
    note: note,
    user_name: userRole
  });

  return true;
}

// =============================================
// POST COMMENT: Tambah feedback pada versi
// =============================================
export async function postComment(projectId, versionNum, userName, text) {
  // Cari version_id berdasarkan project & version number
  const { data: version } = await supabase
    .from('project_versions')
    .select('id')
    .eq('project_id', projectId)
    .eq('version_num', versionNum)
    .single();

  if (!version) {
    console.error('Version not found');
    return null;
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      version_id: version.id,
      user_name: userName,
      text
    })
    .select()
    .single();

  if (error) {
    console.error('Error posting comment:', error);
    return null;
  }

  return comment;
}

// =============================================
// ADD TEAM: Tambah anggota tim
// =============================================
export async function addTeamMember({ name, role, status, username, password }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, role, status, username: username.toLowerCase().trim(), password })
    .select()
    .single();

  if (error) {
    console.error('Error adding team member:', error);
    return { error: error.message };
  }
  return data;
}

// =============================================
// UPDATE TEAM: Edit anggota tim
// =============================================
export async function updateTeamMember(userId, { name, role, status, username, password }) {
  const updateData = { name, role, status, username: username.toLowerCase().trim() };
  if (password && password.trim() !== '') {
    updateData.password = password;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating team member:', error);
    return { error: error.message };
  }
  return data;
}

// =============================================
// DELETE TEAM: Hapus anggota tim
// =============================================
export async function deleteTeamMember(userId) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting team member:', error);
    return false;
  }
  return true;
}

// =============================================
// ASSIGNMENT: Mapping Klien ke CC
// =============================================
export async function fetchAssignments() {
  const { data, error } = await supabase.from('client_teams').select('*');
  if (error) return [];
  return data;
}

export async function assignTeamMember(clientId, ccId) {
  const { data, error } = await supabase
    .from('client_teams')
    .insert({ client_id: clientId, cc_id: ccId })
    .select()
    .single();
  if (error) return { error: error.message };
  return data;
}

export async function removeTeamAssignment(clientId, ccId) {
  const { error } = await supabase
    .from('client_teams')
    .delete()
    .eq('client_id', clientId)
    .eq('cc_id', ccId);
  if (error) return { error: error.message };
  return true;
}
