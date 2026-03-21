import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    const formattedData = data.map((lead: any) => ({
      id: lead.id,
      fullName: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      institutionType: lead.institution_type,
      serviceName: lead.service_name,
      legalQuality: lead.legal_quality,
      caseSubjects: lead.case_subjects,
      caseDescription: lead.case_description,
      createdAt: lead.created_at,
    }));

    return NextResponse.json({ leads: formattedData });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
