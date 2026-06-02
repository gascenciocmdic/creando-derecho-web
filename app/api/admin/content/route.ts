import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';


const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

// Default initial content structure
const DEFAULT_CONTENT = {
  heroHeadline: "Defensa Legal Estratégica para el Sector Público",
  heroSubheadline: "Soluciones jurídicas de alta complejidad para funcionarios públicos y organismos estatales en Chile. Protegemos sus derechos con excelencia y confidencialidad.",
  aboutText1: "En Creando Derecho, somos una empresa de consultoría legal dedicada a fortalecer la gestión del sector público en Chile. Contamos con un equipo multidisciplinario experto en la defensa de funcionarios y la asesoría estratégica de organismos estatales.",
  aboutText2: "Nuestra misión es proporcionar soluciones jurídicas de alta complejidad, garantizando el cumplimiento normativo y la protección de los derechos en el ámbito administrativo.",
  stat1Num: "15+", stat1Label: "Años de Experiencia",
  stat2Num: "500+", stat2Label: "Casos Exitosos",
  stat3Num: "50+", stat3Label: "Instituciones",
  services: [
    { id: 'service-1', title: "Defensa en Sumarios Administrativos", description: "Foco en investigaciones sumarias, formulación de cargos y defensas por licencias médicas ante la Contraloría General de la República.", icon: 'shield' },
    { id: 'service-2', title: "Consultoría Ley Karin", description: "Implementación de protocolos, capacitaciones y diagnósticos de cumplimiento normativo de acoso y maltrato en el ámbito laboral público.", icon: 'scale' },
    { id: 'service-3', title: "Capacitación Estatal", description: "Charlas y talleres sobre responsabilidad administrativa y probidad para equipos municipales y del sector público.", icon: 'graduation' },
  ],
  contactEmail: "contacto@creandoderecho.cl",
  contactPhone: "+56 4 4561 5390",
  contactAddress: "Av. Apoquindo 4501, Las Condes",
  contactWhatsApp: "+5644561539",
  contactInstagram: "https://instagram.com/creandoderecho",
  footerAbout: "Firma legal especializada en Alta Gestión Pública, Derecho Administrativo y Ley Karin. Defendemos a quienes sirven al país.",
  team: [
    {
      id: "member-1",
      name: "Juan Pérez",
      role: "Socio Fundador - Especialista Administrativo",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
      description: "Abogado con más de 15 años de trayectoria en defensas disciplinarias y asesoría a municipalidades."
    },
    {
      id: "member-2",
      name: "María Fernanda Rojas",
      role: "Asociada Senior - Experta Ley Karin",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
      description: "Especialista en derecho laboral público e implementación de protocolos de prevención de acoso y maltrato."
    }
  ],
  documents: [
    {
      id: "doc-1",
      title: "Guía Práctica: Sumarios Administrativos",
      description: "Manual paso a paso sobre los derechos y garantías del funcionario público durante una investigación sumaria.",
      url: "https://cebohxzcuooiszruwowq.supabase.co/storage/v1/object/public/pdfs/lead-magnet.pdf"
    },
    {
      id: "doc-2",
      title: "Protocolo de Prevención - Ley Karin",
      description: "Estructura obligatoria para la implementación de protocolos contra el acoso laboral en organismos públicos chilenos.",
      url: "https://cebohxzcuooiszruwowq.supabase.co/storage/v1/object/public/pdfs/lead-magnet.pdf"
    }
  ]
};

// Migration helper to convert old flat structure to new array structure
function migrateContent(content: any) {
  if (content && !content.services) {
    const services = [];
    if (content.service1Title) services.push({ id: 's1', title: content.service1Title, description: content.service1Desc || '', icon: 'shield' });
    if (content.service2Title) services.push({ id: 's2', title: content.service2Title, description: content.service2Desc || '', icon: 'scale' });
    if (content.service3Title) services.push({ id: 's3', title: content.service3Title, description: content.service3Desc || '', icon: 'graduation' });
    
    const { 
      service1Title, service1Desc, 
      service2Title, service2Desc, 
      service3Title, service3Desc, 
      ...rest 
    } = content;
    
    return { ...rest, services };
  }
  return content;
}

// Ensure data folder and file exist
async function ensureFile() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try {
      await fs.access(CONTENT_FILE_PATH);
    } catch {
      await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error("Error setting up content file", error);
  }
}

export async function GET() {
  try {
    if (supabase) {
      const { data: dbData, error } = await supabase
        .from('website_content')
        .select('data')
        .eq('id', 1)
        .single();
        
      if (!error && dbData?.data && Object.keys(dbData.data).length > 0) {
        return NextResponse.json(migrateContent(dbData.data));
      }
    }
  } catch (err) {
    console.warn('Supabase GET failed, falling back to local file');
  }

  await ensureFile();
  try {
    const data = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    return NextResponse.json(migrateContent(JSON.parse(data)));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newContent = await request.json();
    
    // Attempt saving to Supabase
    if (supabase) {
      const { error } = await supabase.from('website_content').upsert({ id: 1, data: newContent });
      if (error) {
        console.error('Failed to save to Supabase:', error);
      }
    }

    // Always fallback/sync local file
    await ensureFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(newContent, null, 2), 'utf-8');
    
    revalidatePath('/');
    
    return NextResponse.json({ success: true, message: 'Content updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

