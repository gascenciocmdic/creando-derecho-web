'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  institutionType: string;
  serviceName: string;
  legalQuality: string;
  caseSubjects: string[];
  caseDescription: string;
  createdAt: string;
}

// Demo data for display purposes
const demoLeads: Lead[] = [
  {
    id: 1,
    fullName: 'María Fernanda González',
    email: 'maria.gonzalez@ejemplo.cl',
    phone: '+56 9 1234 5678',
    institutionType: 'Municipalidad / Corporación Municipal',
    serviceName: 'Municipalidad de Santiago',
    legalQuality: 'Planta',
    caseSubjects: ['Sumario Administrativo'],
    caseDescription: 'Consulta sobre procedimiento sumario por inasistencia.',
    createdAt: '2026-03-20T10:30:00Z',
  },
  {
    id: 2,
    fullName: 'Carlos Andrés Rojas',
    email: 'carlos.rojas@ejemplo.cl',
    phone: '+56 9 8765 4321',
    institutionType: 'Servicio de Salud / Hospital',
    serviceName: 'Hospital San Juan de Dios',
    legalQuality: 'Contrata',
    caseSubjects: ['Caso Ley Karin', 'Investigación Sumaria'],
    caseDescription: 'Situación de acoso laboral con solicitud de investigación.',
    createdAt: '2026-03-19T14:15:00Z',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [savingContent, setSavingContent] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    // Fetch content
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setContent(data);
      })
      .catch(console.error);

    // Fetch leads
    fetch('/api/admin/leads')
      .then(res => res.json())
      .then(data => {
        if (data.leads) {
          setLeads(data.leads.length > 0 ? data.leads : []);
        } else if (data.error === 'Supabase no configurado') {
          setLeads(demoLeads);
        }
      })
      .catch(() => setLeads(demoLeads))
      .finally(() => setLoadingLeads(false));
  }, []);

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContent(true);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      alert('Contenido actualizado correctamente.');
    } catch {
      alert('Error al actualizar contenido.');
    } finally {
      setSavingContent(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadMessage('Solo se permiten archivos PDF');
      return;
    }

    setUploadingPdf(true);
    setUploadMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMessage('¡PDF actualizado con éxito!');
      } else {
        setUploadMessage(data.error || 'Error al subir el archivo');
      }
    } catch {
      setUploadMessage('Error de conexión');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-snow-dark">
      {/* Admin Top Bar */}
      <div className="bg-navy border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <span className="text-snow font-playfair font-bold text-sm">Creando Derecho</span>
              <span className="block text-oxford-light text-xs">Panel Administrativo</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-snow/60 hover:text-snow text-sm font-montserrat flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-navy">Dashboard</h1>
          <p className="text-oxford text-sm mt-1">Gestión de consultas y leads del Triage Legal</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-snow-dark">
            <div className="text-3xl font-playfair font-bold text-gold">{leads.length}</div>
            <div className="text-xs font-montserrat text-oxford uppercase tracking-wider mt-1">Consultas Totales</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-snow-dark">
            <div className="text-3xl font-playfair font-bold text-gold">1</div>
            <div className="text-xs font-montserrat text-oxford uppercase tracking-wider mt-1">Nuevas Hoy</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-snow-dark">
            <div className="text-3xl font-playfair font-bold text-gold">2</div>
            <div className="text-xs font-montserrat text-oxford uppercase tracking-wider mt-1">Pendientes</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-snow-dark overflow-hidden">
          <div className="px-6 py-4 border-b border-snow-dark flex items-center justify-between">
            <h2 className="font-playfair text-lg font-bold text-navy">Consultas Recibidas</h2>
            <span className="text-xs text-oxford font-montserrat">Modo Demo — Datos de ejemplo</span>
          </div>

          <div className="divide-y divide-snow-dark">
            {loadingLeads ? (
              <div className="p-6 text-center text-oxford font-montserrat text-sm border-t border-snow-dark">Cargando consultas...</div>
            ) : leads.length === 0 ? (
              <div className="p-6 text-center text-oxford font-montserrat text-sm border-t border-snow-dark">No hay consultas registradas aún.</div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id}>
                {/* Row */}
                <button
                  onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-snow/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-semibold text-navy text-sm">{lead.fullName}</div>
                    <div className="text-oxford text-xs mt-0.5">{lead.email}</div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-xs font-montserrat text-oxford bg-snow px-3 py-1 rounded-full">
                      {lead.institutionType}
                    </span>
                  </div>
                  <div className="hidden md:block text-xs text-oxford font-montserrat">
                    {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                  </div>
                  <svg
                    className={`w-4 h-4 text-oxford transition-transform ${expandedLead === lead.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Detail */}
                {expandedLead === lead.id && (
                  <div className="px-6 py-5 bg-snow/50 border-t border-snow-dark">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-oxford text-xs uppercase tracking-wider">Teléfono</span>
                        <p className="font-montserrat text-navy font-medium mt-0.5">{lead.phone}</p>
                      </div>
                      <div>
                        <span className="text-oxford text-xs uppercase tracking-wider">Calidad Jurídica</span>
                        <p className="font-montserrat text-navy font-medium mt-0.5">{lead.legalQuality}</p>
                      </div>
                      <div>
                        <span className="text-oxford text-xs uppercase tracking-wider">Servicio</span>
                        <p className="font-montserrat text-navy font-medium mt-0.5">{lead.serviceName}</p>
                      </div>
                      <div>
                        <span className="text-oxford text-xs uppercase tracking-wider">Materias</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.caseSubjects.map((s) => (
                            <span key={s} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-montserrat">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-oxford text-xs uppercase tracking-wider">Descripción</span>
                        <p className="font-montserrat text-navy mt-0.5">{lead.caseDescription}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )))}
          </div>
        </div>

        {/* CMS Implementation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Editor */}
          <div className="bg-white rounded-xl p-6 border border-snow-dark">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="font-playfair text-lg font-bold text-navy">Editar Contenido (Landing Page)</h3>
            </div>
            
            {content ? (
              <div>
                {/* Tabs */}
                <div className="flex bg-snow-dark rounded-lg p-1 gap-1 mb-6 overflow-x-auto">
                  {['hero', 'nosotros', 'servicios', 'contacto'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 px-3 text-xs font-montserrat font-semibold rounded-md transition-colors capitalize whitespace-nowrap ${
                        activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-oxford hover:text-navy hover:bg-white/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSaveContent} className="space-y-4">
                  {/* HERO TAB */}
                  {activeTab === 'hero' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Título Principal</label>
                        <input 
                          type="text" 
                          value={content.heroHeadline || ''}
                          onChange={e => setContent({...content, heroHeadline: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Subtítulo</label>
                        <textarea 
                          rows={3}
                          value={content.heroSubheadline || ''}
                          onChange={e => setContent({...content, heroSubheadline: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                    </div>
                  )}

                  {/* NOSOTROS TAB */}
                  {activeTab === 'nosotros' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Párrafo Principal</label>
                        <textarea 
                          rows={3}
                          value={content.aboutText1 || ''}
                          onChange={e => setContent({...content, aboutText1: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Párrafo Secundario</label>
                        <textarea 
                          rows={3}
                          value={content.aboutText2 || ''}
                          onChange={e => setContent({...content, aboutText2: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Estadística 1</label>
                          <input 
                            type="text" placeholder="Ej: 15+"
                            value={content.stat1Num || ''} onChange={e => setContent({...content, stat1Num: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy mb-2"
                          />
                          <input 
                            type="text" placeholder="Ej: Años de Experiencia"
                            value={content.stat1Label || ''} onChange={e => setContent({...content, stat1Label: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Estadística 2</label>
                          <input 
                            type="text" placeholder="Ej: 500+"
                            value={content.stat2Num || ''} onChange={e => setContent({...content, stat2Num: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy mb-2"
                          />
                          <input 
                            type="text" placeholder="Ej: Casos Exitosos"
                            value={content.stat2Label || ''} onChange={e => setContent({...content, stat2Label: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SERVICIOS TAB */}
                  {activeTab === 'servicios' && (
                    <div className="space-y-6 animate-fade-in-up max-h-[400px] overflow-y-auto pr-2 pb-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-snow/50 p-4 rounded-xl border border-snow-dark">
                          <label className="block text-xs font-montserrat text-navy font-bold uppercase tracking-wide mb-3">Servicio {i}</label>
                          <input 
                            type="text" placeholder="Título del servicio"
                            value={content[`service${i}Title`] || ''} 
                            onChange={e => setContent({...content, [`service${i}Title`]: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy mb-2 focus:border-gold focus:ring-0"
                          />
                          <textarea 
                            rows={2} placeholder="Descripción del servicio"
                            value={content[`service${i}Desc`] || ''} 
                            onChange={e => setContent({...content, [`service${i}Desc`]: e.target.value})}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONTACTO TAB */}
                  {activeTab === 'contacto' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Email de Contacto</label>
                        <input 
                          type="email" 
                          value={content.contactEmail || ''}
                          onChange={e => setContent({...content, contactEmail: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Teléfono</label>
                        <input 
                          type="text" 
                          value={content.contactPhone || ''}
                          onChange={e => setContent({...content, contactPhone: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">WhatsApp (Número con código de país)</label>
                        <input 
                          type="text" 
                          placeholder="+56912345678"
                          value={content.contactWhatsApp || ''}
                          onChange={e => setContent({...content, contactWhatsApp: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Enlace de Instagram</label>
                        <input 
                          type="url" 
                          placeholder="https://instagram.com/tu_cuenta"
                          value={content.contactInstagram || ''}
                          onChange={e => setContent({...content, contactInstagram: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Dirección Física</label>
                        <input 
                          type="text" 
                          value={content.contactAddress || ''}
                          onChange={e => setContent({...content, contactAddress: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-montserrat text-oxford uppercase tracking-wide mb-1">Texto Pie de Página (Acerca de)</label>
                        <textarea 
                          rows={2}
                          value={content.footerAbout || ''}
                          onChange={e => setContent({...content, footerAbout: e.target.value})}
                          className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={savingContent}
                    className="w-full btn-primary justify-center py-2.5 text-sm disabled:opacity-50 mt-4"
                  >
                    {savingContent ? 'Guardando...' : 'Guardar Todos los Cambios'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div className="bg-white rounded-xl p-6 border border-snow-dark">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="font-playfair text-lg font-bold text-navy">Lead Magnet (PDF)</h3>
            </div>
            
            <p className="text-oxford text-sm mb-6">
              Suba o reemplace la guía gratuita descargable. El archivo será accesible públicamente en la ruta <code>/lead-magnet.pdf</code>.
            </p>

            <div className="border-2 border-dashed border-snow-dark rounded-xl p-8 text-center hover:bg-snow/30 transition-colors relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={uploadingPdf}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <svg className="w-10 h-10 text-gold mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="font-montserrat text-navy font-semibold">
                {uploadingPdf ? 'Subiendo archivo...' : 'Haz clic o arrastra un PDF aquí'}
              </p>
              <p className="text-xs text-oxford mt-2">Solo archivos .pdf (Máx. 10MB)</p>
            </div>

            {uploadMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-montserrat text-center ${
                uploadMessage.includes('éxito') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {uploadMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
