import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: Mengambil daftar project dari database
export async function GET(request) {
  try {
    // Jalankan query ke supabase
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // Jika database mengembalikan error
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Berhasil mengembalikan data
    return NextResponse.json({ 
      success: true, 
      message: 'Berhasil mengambil data project',
      total_data: data.length,
      data: data 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST: Membuat project baru via API
export async function POST(request) {
  try {
    // Membaca data body yang dikirimkan dari Postman
    const body = await request.json();

    // Validasi data sederhana
    if (!body.title || !body.type || !body.priority) {
      return NextResponse.json(
        { success: false, message: 'Title, type, dan priority wajib diisi!' }, 
        { status: 400 } // 400 Bad Request
      );
    }

    // Insert ke database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        type: body.type,
        status: body.status || 'Draft',
        current_version: 'v1.0',
        author_name: body.author_name || 'API User',
        priority: body.priority,
        deadline: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Project berhasil dibuat!',
      data: data
    }, { status: 201 }); // 201 Created

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Gagal memproses data atau format JSON salah' }, { status: 500 });
  }
}
