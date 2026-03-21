import fs from 'fs/promises';
import path from 'path';
import { supabase } from './supabase';

export async function getContent() {
  try {
    if (supabase) {
      const { data: dbData, error } = await supabase
        .from('website_content')
        .select('data')
        .eq('id', 1)
        .single();
        
      if (!error && dbData?.data) {
        return dbData.data;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local file');
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return fallback defaults if the file cannot be read
    return {
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
  }
}
