import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Campos de identificación incompletos' },
        { status: 400 }
      );
    }
    if (!data.institutionType || !data.serviceName || !data.legalQuality) {
      return NextResponse.json(
        { error: 'Perfil institucional incompleto' },
        { status: 400 }
      );
    }
    if (!data.caseSubjects?.length || !data.caseDescription || !data.acceptedConfidentiality) {
      return NextResponse.json(
        { error: 'Detalles del caso incompletos' },
        { status: 400 }
      );
    }

    // Honeypot check
    if (data.website_url) {
      return NextResponse.json({ success: true }); // Silently succeed for bots
    }

    // ===== SUPABASE INTEGRATION =====
    if (supabase) {
      const { error } = await supabase.from('leads').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        institution_type: data.institutionType,
        service_name: data.serviceName,
        legal_quality: data.legalQuality,
        case_subjects: data.caseSubjects,
        case_description: data.caseDescription,
        accepted_confidentiality: data.acceptedConfidentiality,
        created_at: data.createdAt,
      });

      if (error) {
        console.error('Supabase insert error:', error);
      } else {
        console.log('Successfully inserted lead into Supabase');
      }
    } else {
      console.log('⚠️ Supabase client not initialized. Skipping database insertion.');
    }

    // ===== EMAIL NOTIFICATION (placeholder) =====
    // Uncomment and configure with Resend or SendGrid:
    //
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@creandoderecho.cl',
    //     to: 'contacto@creandoderecho.cl',
    //     subject: `Nueva Consulta Legal: ${data.fullName}`,
    //     html: `<h2>Nueva consulta de Triage Legal</h2>
    //       <p><strong>Nombre:</strong> ${data.fullName}</p>
    //       <p><strong>Email:</strong> ${data.email}</p>
    //       <p><strong>Teléfono:</strong> ${data.phone}</p>
    //       <p><strong>Institución:</strong> ${data.institutionType} — ${data.serviceName}</p>
    //       <p><strong>Calidad Jurídica:</strong> ${data.legalQuality}</p>
    //       <p><strong>Materias:</strong> ${data.caseSubjects.join(', ')}</p>
    //       <p><strong>Descripción:</strong> ${data.caseDescription}</p>`,
    //   }),
    // });

    // Demo mode: log to console
    console.log('═══════════════════════════════════════');
    console.log('📩 NUEVO LEAD DE TRIAGE LEGAL');
    console.log('═══════════════════════════════════════');
    console.log('Nombre:', data.fullName);
    console.log('Email:', data.email);
    console.log('Teléfono:', data.phone);
    console.log('Institución:', data.institutionType);
    console.log('Servicio:', data.serviceName);
    console.log('Calidad Jurídica:', data.legalQuality);
    console.log('Materias:', data.caseSubjects.join(', '));
    console.log('Descripción:', data.caseDescription);
    console.log('Fecha:', data.createdAt);
    console.log('═══════════════════════════════════════');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing triage submission:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
