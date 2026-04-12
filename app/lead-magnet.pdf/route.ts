import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET() {
  if (!supabase) {
    return new NextResponse('Supabase not configured', { status: 500 });
  }

  const { data, error } = await supabase.storage
    .from('pdfs')
    .download('lead-magnet.pdf');

  if (error || !data) {
    console.error('Error downloading PDF from Supabase:', error);
    return new NextResponse('Archivo no encontrado', { status: 404 });
  }

  const response = new NextResponse(data);
  response.headers.set('Content-Type', 'application/pdf');
  response.headers.set('Content-Disposition', 'attachment; filename="guia-creando-derecho.pdf"');

  return response;
}
