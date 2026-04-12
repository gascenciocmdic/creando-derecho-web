import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    // Upload to Supabase Storage in 'pdfs' bucket
    // Upsert: true allows overwriting the existing lead-magnet.pdf
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload('lead-magnet.pdf', buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json({ error: `Error en Supabase: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'PDF subido correctamente a Supabase',
      path: data.path 
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
