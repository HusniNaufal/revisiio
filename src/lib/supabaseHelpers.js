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
// FETCH: Ambil semua data projects (grouped by status)
// =============================================
export async function fetchKontenData() {
  // Ambil semua projects
  const { data: projects, error: projErr } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (projErr) {
    console.error('Error fetching projects:', projErr);
    return { Draft: [], Review: [], Revisi: [], Approved: [] };
  }

  // Ambil semua versions dengan comments
  const { data: versions, error: verErr } = await supabase
    .from('project_versions')
    .select('*, comments(*)')
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
      author: proj.author_name,
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
export async function fetchTeamsData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

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
export async function createProject({ title, type, deadline, priority, authorName, authorInitial, userRole }) {
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

  // Update status biasa
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
