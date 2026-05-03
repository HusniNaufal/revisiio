import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: Mengambil seluruh data user (Untuk Admin Monitor User)
export async function GET() {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true, total: data.length, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Kesalahan Server' }, { status: 500 });
  }
}

// P1: 1.0 Auth & User Management
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Cek kecocokan di database Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role, username')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Username atau password salah' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Login berhasil', 
      data: data 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Format JSON salah' }, { status: 400 });
  }
}
