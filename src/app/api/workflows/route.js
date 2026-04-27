import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// P4: 4.0 Workflow & Status Update (Update Status Konten)
export async function PATCH(request) {
  try {
    const { project_id, new_status } = await request.json();

    if (!project_id || !new_status) {
      return NextResponse.json({ success: false, message: 'project_id dan new_status wajib diisi' }, { status: 400 });
    }

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
