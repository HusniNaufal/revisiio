import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// P5: 5.0 Notification & Reminder (Cek Deadline)
export async function GET() {
  try {
    // Simulasi mengecek semua project yang belum selesai (Belum Approved)
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, deadline, status, author_name')
      .neq('status', 'Approved')
      .order('deadline', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Bangkitkan pesan notifikasi sederhana berdasarkan data
    const notifications = data.map(proj => {
      const isOverdue = new Date(proj.deadline) < new Date();
      return {
        project_id: proj.id,
        to: proj.author_name,
        type: isOverdue ? 'URGENT' : 'REMINDER',
        message: isOverdue 
          ? `DEADLINE TERLEWATI! Project "${proj.title}" sudah lewat batas waktu.` 
          : `Reminder: Project "${proj.title}" masih berada di tahap ${proj.status}.`
      };
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Berhasil generate notifikasi berdasarkan deadline konten',
      total_notifications: notifications.length,
      data: notifications 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
