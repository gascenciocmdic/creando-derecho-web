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
    const customPath = formData.get('path') as string | null;
    const customBucket = formData.get('bucket') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bucket = customBucket || 'pdfs';
    const filePath = customPath || 'lead-magnet.pdf';

    // Validate mime types
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF files and common images (JPEG, PNG, WEBP) are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json({ error: `Error en Supabase: ${error.message}` }, { status: 500 });
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      message: 'Archivo subido correctamente a Supabase',
      path: data.path,
      url: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
