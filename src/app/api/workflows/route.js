import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// P4: 4.0 Workflow & Status Update (Update Status Konten)
export async function PATCH(request) {
  try {
    const { project_id, new_status, user_name } = await request.json();

    if (!project_id || !new_status) {
      return NextResponse.json({ success: false, message: 'project_id dan new_status wajib diisi' }, { status: 400 });
    }

    // Ambil data project saat ini untuk melihat status dan versi lamanya
    const { data: proj } = await supabase.from('projects').select('status, current_version').eq('id', project_id).single();
    if (!proj) return NextResponse.json({ success: false, message: 'Project tidak ditemukan' }, { status: 404 });

    // Cek apakah transisi status dari Revisi -> Review (yang butuh bump version)
    if (proj.status === 'Revisi' && new_status === 'Review') {
      const currentVerNum = parseFloat(proj.current_version.replace('v', ''));
      const newVer = `v${(currentVerNum + 0.1).toFixed(1)}`; // Bumps v1.0 -> v1.1

      // 1. Update status dan versi di project
      await supabase
        .from('projects')
        .update({ current_version: newVer, status: new_status, updated_at: new Date().toISOString() })
        .eq('id', project_id);

      // 2. Buat record versi baru di project_versions
      const { data: newVersionRecord } = await supabase.from('project_versions').insert({
        project_id: project_id,
        version_num: newVer,
        note: 'Pembaruan versi (Update via API)',
        user_name: user_name || 'API User'
      }).select().single();

      return NextResponse.json({ 
        success: true, 
        message: `Status diupdate ke ${new_status} dan Versi naik menjadi ${newVer}`,
        data: { new_version: newVersionRecord }
      }, { status: 200 });
    }

    // Jika update status biasa (misal Review -> Approved)
    const { data, error } = await supabase
      .from('projects')
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq('id', project_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Status project berhasil diubah menjadi ${new_status}`,
      data: data 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Format JSON salah' }, { status: 400 });
  }
}
