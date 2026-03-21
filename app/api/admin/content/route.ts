import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

// Ensure data folder and file exist
async function ensureFile() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try {
      await fs.access(CONTENT_FILE_PATH);
    } catch {
      // Default content
      const defaultContent = {
        heroHeadline: "Defensa Legal Estratégica para el Sector Público",
        heroSubheadline: "Soluciones jurídicas de alta complejidad para funcionarios públicos y organismos estatales en Chile. Protegemos sus derechos con excelencia y confidencialidad.",
        aboutText1: "En Creando Derecho, somos una empresa de consultoría legal dedicada a fortalecer la gestión del sector público en Chile. Contamos con un equipo multidisciplinario experto en la defensa de funcionarios y la asesoría estratégica de organismos estatales.",
        aboutText2: "Nuestra misión es proporcionar soluciones jurídicas de alta complejidad, garantizando el cumplimiento normativo y la protección de los derechos en el ámbito administrativo.",
        stat1Num: "15+", stat1Label: "Años de Experiencia",
        stat2Num: "500+", stat2Label: "Casos Exitosos",
        stat3Num: "50+", stat3Label: "Instituciones",
        service1Title: "Defensa en Sumarios Administrativos",
        service1Desc: "Foco en investigaciones sumarias, formulación de cargos y defensas por licencias médicas ante la Contraloría General de la República.",
        service2Title: "Consultoría Ley Karin",
        service2Desc: "Implementación de protocolos, capacitaciones y diagnósticos de cumplimiento normativo de acoso y maltrato en el ámbito laboral público.",
        service3Title: "Capacitación Estatal",
        service3Desc: "Charlas y talleres sobre responsabilidad administrativa y probidad para equipos municipales y del sector público.",
        contactEmail: "contacto@creandoderecho.cl",
        contactPhone: "+56 4 4561 5390",
        contactAddress: "Av. Apoquindo 4501, Las Condes",
        contactWhatsApp: "+5644561539",
        contactInstagram: "https://instagram.com/creandoderecho",
        footerAbout: "Firma legal especializada en Alta Gestión Pública, Derecho Administrativo y Ley Karin. Defendemos a quienes sirven al país."
      };
      await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(defaultContent, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error("Error setting up content file", error);
  }
}

export async function GET() {
  await ensureFile();
  try {
    const data = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify admin session manually for API routes outside middleware protection or as double-check
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newContent = await request.json();
    await ensureFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(newContent, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Content updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
