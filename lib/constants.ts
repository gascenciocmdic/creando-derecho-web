// Color palette
export const COLORS = {
  navy: '#1B263B',
  navyLight: '#243352',
  navyDark: '#111827',
  gold: '#C5A059',
  goldLight: '#D4B87A',
  goldDark: '#A88640',
  oxford: '#415A77',
  oxfordLight: '#5C7A9A',
  snow: '#F8F9FA',
  snowDark: '#E9ECEF',
} as const;

// Contact info
export const CONTACT = {
  email: 'contacto@creandoderecho.cl',
  domain: 'www.creandoderecho.cl',
  phone: '+56 9 0000 0000',
  companyName: 'Creando Derecho Consultores',
} as const;

// About text
export const ABOUT_TEXT = 
  'En Creando Derecho, somos una empresa de consultoría legal dedicada a fortalecer la gestión del sector público en Chile. Contamos con un equipo multidisciplinario experto en la defensa de funcionarios y la asesoría estratégica de organismos estatales. Nuestra misión es proporcionar soluciones jurídicas de alta complejidad, garantizando el cumplimiento normativo y la protección de los derechos en el ámbito administrativo.';

// Services
export const SERVICES = [
  {
    id: 'sumarios',
    title: 'Defensa en Sumarios Administrativos',
    description: 'Foco en investigaciones sumarias, formulación de cargos y defensas por licencias médicas ante la Contraloría General de la República.',
    icon: 'shield',
  },
  {
    id: 'ley-karin',
    title: 'Consultoría Ley Karin',
    description: 'Implementación de protocolos, capacitaciones y diagnósticos de cumplimiento normativo de acoso y maltrato en el ámbito laboral público.',
    icon: 'scale',
  },
  {
    id: 'capacitacion',
    title: 'Capacitación Estatal',
    description: 'Charlas y talleres sobre responsabilidad administrativa y probidad para equipos municipales y del sector público.',
    icon: 'graduation',
  },
] as const;

// Triage form options
export const INSTITUTION_TYPES = [
  'Municipalidad / Corporación Municipal',
  'Ministerio',
  'SEREMI',
  'Servicio de Salud / Hospital',
  'Gobierno Regional (GORE)',
  'Institución Autónoma',
  'Servicio Público Descentralizado',
  'SLEP',
  'FF.AA.',
] as const;

export const LEGAL_QUALITIES = [
  'Planta',
  'Contrata',
  'Código del Trabajo',
  'Honorarios',
] as const;

export const CASE_SUBJECTS = [
  'Sumario Administrativo',
  'Investigación Sumaria',
  'Cuestionamiento Licencia Médica',
  'Caso Ley Karin',
  'Otros',
] as const;

export const CONFIDENTIALITY_TEXT = 
  'Entiendo que la información ingresada es de estricta confidencialidad entre el cliente y la empresa de servicio.';
