import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: Mengambil daftar komentar/feedback
export async function GET() {
  try {
    const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true, total: data.length, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Kesalahan Server' }, { status: 500 });
  }
}

// P3: 3.0 Review & Feedback (Simpan Komentar)
export async function POST(request) {
  try {
    const { project_id, user_name, text } = await request.json();

    if (!project_id || !text) {
      return NextResponse.json({ success: false, message: 'project_id dan text wajib diisi' }, { status: 400 });
    }

    // 1. Cari project untuk mengetahui current_version nya
    const { data: proj } = await supabase.from('projects').select('current_version').eq('id', project_id).single();
    if (!proj) return NextResponse.json({ success: false, message: 'Project tidak ditemukan' }, { status: 404 });

    // 2. Cari version_id di tabel project_versions berdasarkan project_id dan current_version
    const { data: version } = await supabase
      .from('project_versions')
      .select('id')
      .eq('project_id', project_id)
      .eq('version_num', proj.current_version)
      .single();

    if (!version) {
      return NextResponse.json({ success: false, message: 'Versi project tidak ditemukan, harap buat konten terlebih dahulu' }, { status: 404 });
    }

    // 3. Masukkan komentar menggunakan version_id yang valid
    const { data, error } = await supabase
      .from('comments')
      .insert({
        version_id: version.id,
        user_name: user_name || 'Reviewer/Client',
        text: text
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Komentar/Feedback berhasil dikirim',
      data: data 
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Format JSON salah' }, { status: 400 });
  }
}
