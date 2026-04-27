import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

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
