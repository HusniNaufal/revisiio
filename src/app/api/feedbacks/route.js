import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// P3: 3.0 Review & Feedback (Simpan Komentar)
export async function POST(request) {
  try {
    const { version_id, user_name, text } = await request.json();

    if (!version_id || !text) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        version_id: version_id,
        user_name: user_name || 'Anonymous',
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
