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

  const handleServiceChange = (id: string, field: string, value: string) => {
    const updatedServices = content.services.map((s: any) => 
      s.id === id ? { ...s, [field]: value } : s
    );
    setContent({ ...content, services: updatedServices });
  };

  const addService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      title: 'Nuevo Servicio',
      description: 'Descripción del servicio',
      icon: 'shield'
    };
    setContent({ ...content, services: [...(content.services || []), newService] });
  };

  const deleteService = (id: string) => {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      const updatedServices = content.services.filter((s: any) => s.id !== id);
      setContent({ ...content, services: updatedServices });
    }
  };

  const handleTeamMemberChange = (id: string, field: string, value: string) => {
    const updatedTeam = content.team.map((m: any) => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setContent({ ...content, team: updatedTeam });
  };

  const addTeamMember = () => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: 'Nuevo Profesional',
      role: 'Cargo / Especialidad',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      description: 'Breve descripción de su trayectoria profesional.'
    };
    setContent({ ...content, team: [...(content.team || []), newMember] });
  };

  const deleteTeamMember = (id: string) => {
    if (confirm('¿Está seguro de eliminar este miembro del equipo?')) {
      const updatedTeam = content.team.filter((m: any) => m.id !== id);
      setContent({ ...content, team: updatedTeam });
    }
  };

  const handleTeamImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', `team/member-${id}-${Date.now()}.jpg`);
    formData.append('bucket', 'pdfs');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Direct local update
        const updatedTeam = content.team.map((m: any) => 
          m.id === id ? { ...m, image: data.url } : m
        );
        setContent({ ...content, team: updatedTeam });
        alert('¡Fotografía subida con éxito!');
      } else {
        alert(data.error || 'Error al subir la imagen. Asegúrese de tener el bucket "pdfs" creado en Supabase.');
      }
    } catch {
      alert('Error de conexión al subir la imagen.');
    }
  };

  const handleDocumentChange = (id: string, field: string, value: string) => {
    const updatedDocs = content.documents.map((d: any) => 
      d.id === id ? { ...d, [field]: value } : d
    );
    setContent({ ...content, documents: updatedDocs });
  };

  const addDocumentItem = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: 'Nuevo Documento',
      description: 'Breve descripción de la utilidad o contenido del documento.',
      url: ''
    };
    setContent({ ...content, documents: [...(content.documents || []), newDoc] });
  };

  const deleteDocumentItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar este documento de la lista?')) {
      const updatedDocs = content.documents.filter((d: any) => d.id !== id);
      setContent({ ...content, documents: updatedDocs });
    }
  };

  const handleDocumentPdfUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', `documents/doc-${id}-${Date.now()}.pdf`);
    formData.append('bucket', 'pdfs');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        handleDocumentChange(id, 'url', data.url);
        alert('¡Documento PDF subido con éxito!');
      } else {
        alert(data.error || 'Error al subir el PDF. Verifique la configuración del bucket "pdfs".');
      }
    } catch {
      alert('Error de conexión al subir el PDF.');
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
                  {['hero', 'nosotros', 'equipo', 'servicios', 'documentos', 'contacto'].map(tab => (
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

                  {/* EQUIPO TAB */}
                  {activeTab === 'equipo' && (
                    <div className="space-y-6 animate-fade-in-up max-h-[500px] overflow-y-auto pr-2 pb-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-montserrat text-oxford uppercase font-bold">Equipo Profesional</span>
                        <button 
                          type="button"
                          onClick={addTeamMember}
                          className="text-xs bg-gold/10 text-gold-dark px-3 py-1.5 rounded-lg font-montserrat font-bold flex items-center gap-1 hover:bg-gold/20 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Agregar Integrante
                        </button>
                      </div>

                      {content.team && content.team.map((member: any, index: number) => (
                        <div key={member.id} className="bg-snow/50 p-4 rounded-xl border border-snow-dark relative group">
                          <button
                            type="button"
                            onClick={() => deleteTeamMember(member.id)}
                            className="absolute top-4 right-4 p-1.5 text-oxford hover:text-red-500 transition-colors"
                            title="Eliminar Integrante"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div className="mb-3">
                            <span className="text-xs font-montserrat text-navy font-bold uppercase tracking-wide">Integrante {index + 1}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Nombre Completo</label>
                              <input 
                                type="text" placeholder="Ej: Juan Pérez"
                                value={member.name || ''} 
                                onChange={e => handleTeamMemberChange(member.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Cargo / Especialidad</label>
                              <input 
                                type="text" placeholder="Ej: Socio Fundador - Especialista Administrativo"
                                value={member.role || ''} 
                                onChange={e => handleTeamMemberChange(member.id, 'role', e.target.value)}
                                className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Descripción / Bio</label>
                              <textarea 
                                rows={2} placeholder="Descripción de trayectoria..."
                                value={member.description || ''} 
                                onChange={e => handleTeamMemberChange(member.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Fotografía del Profesional</label>
                              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-1">
                                {member.image && (
                                  <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-12 h-12 rounded-full object-cover border border-gold/30 bg-white"
                                  />
                                )}
                                <div className="flex-1 w-full">
                                  <input 
                                    type="text" placeholder="URL de la imagen o sube un archivo"
                                    value={member.image || ''} 
                                    onChange={e => handleTeamMemberChange(member.id, 'image', e.target.value)}
                                    className="w-full px-3 py-1.5 border border-snow-dark rounded-lg text-xs font-montserrat text-navy mb-2 focus:border-gold focus:ring-0"
                                  />
                                  <div className="relative">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={e => handleTeamImageUpload(member.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button 
                                      type="button" 
                                      className="w-full bg-snow hover:bg-snow-dark text-navy border border-snow-dark py-1.5 px-3 rounded-lg text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                      Subir nueva fotografía
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!content.team || content.team.length === 0) && (
                        <div className="text-center py-8 bg-snow/30 rounded-xl border border-dashed border-snow-dark">
                          <p className="text-oxford text-sm font-montserrat">No hay integrantes configurados en el equipo.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SERVICIOS TAB */}
                  {activeTab === 'servicios' && (
                    <div className="space-y-6 animate-fade-in-up max-h-[500px] overflow-y-auto pr-2 pb-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-montserrat text-oxford uppercase font-bold">Lista de Servicios</span>
                        <button 
                          type="button"
                          onClick={addService}
                          className="text-xs bg-gold/10 text-gold-dark px-3 py-1.5 rounded-lg font-montserrat font-bold flex items-center gap-1 hover:bg-gold/20 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Agregar Servicio
                        </button>
                      </div>

                      {content.services && content.services.map((service: any, index: number) => (
                        <div key={service.id} className="bg-snow/50 p-4 rounded-xl border border-snow-dark relative group">
                          <button
                            type="button"
                            onClick={() => deleteService(service.id)}
                            className="absolute top-4 right-4 p-1.5 text-oxford hover:text-red-500 transition-colors"
                            title="Eliminar Servicio"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-montserrat text-navy font-bold uppercase tracking-wide">Servicio {index + 1}</span>
                            <div className="flex gap-1 ml-4 sm:ml-6">
                              {['shield', 'scale', 'graduation'].map(icon => (
                                <button
                                  key={icon}
                                  type="button"
                                  onClick={() => handleServiceChange(service.id, 'icon', icon)}
                                  className={`p-1 rounded border transition-colors ${service.icon === icon ? 'bg-gold border-gold text-white' : 'bg-white border-snow-dark text-oxford hover:border-gold'}`}
                                >
                                  {icon === 'shield' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                                  {icon === 'scale' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                                  {icon === 'graduation' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>}
                                </button>
                              ))}
                            </div>
                          </div>

                          <input 
                            type="text" placeholder="Título del servicio"
                            value={service.title || ''} 
                            onChange={e => handleServiceChange(service.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy mb-2 focus:border-gold focus:ring-0"
                          />
                          <textarea 
                            rows={2} placeholder="Descripción del servicio"
                            value={service.description || ''} 
                            onChange={e => handleServiceChange(service.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                          />
                        </div>
                      ))}

                      {(!content.services || content.services.length === 0) && (
                        <div className="text-center py-8 bg-snow/30 rounded-xl border border-dashed border-snow-dark">
                          <p className="text-oxford text-sm font-montserrat">No hay servicios configurados.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DOCUMENTOS TAB */}
                  {activeTab === 'documentos' && (
                    <div className="space-y-6 animate-fade-in-up max-h-[500px] overflow-y-auto pr-2 pb-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-montserrat text-oxford uppercase font-bold">Biblioteca de Documentos</span>
                        <button 
                          type="button"
                          onClick={addDocumentItem}
                          className="text-xs bg-gold/10 text-gold-dark px-3 py-1.5 rounded-lg font-montserrat font-bold flex items-center gap-1 hover:bg-gold/20 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Agregar Documento
                        </button>
                      </div>

                      {content.documents && content.documents.map((doc: any, index: number) => (
                        <div key={doc.id} className="bg-snow/50 p-4 rounded-xl border border-snow-dark relative group">
                          <button
                            type="button"
                            onClick={() => deleteDocumentItem(doc.id)}
                            className="absolute top-4 right-4 p-1.5 text-oxford hover:text-red-500 transition-colors"
                            title="Eliminar Documento"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div className="mb-3">
                            <span className="text-xs font-montserrat text-navy font-bold uppercase tracking-wide">Documento {index + 1}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Título del Documento</label>
                              <input 
                                type="text" placeholder="Ej: Guía de Sumarios Administrativos"
                                value={doc.title || ''} 
                                onChange={e => handleDocumentChange(doc.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Descripción corta</label>
                              <textarea 
                                rows={2} placeholder="Explica brevemente de qué se trata..."
                                value={doc.description || ''} 
                                onChange={e => handleDocumentChange(doc.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-snow-dark rounded-lg text-sm font-montserrat text-navy focus:border-gold focus:ring-0"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-montserrat text-oxford uppercase tracking-wide mb-1">Archivo PDF</label>
                              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-1">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1 w-full">
                                  <input 
                                    type="text" placeholder="URL del archivo o sube un archivo"
                                    value={doc.url || ''} 
                                    onChange={e => handleDocumentChange(doc.id, 'url', e.target.value)}
                                    className="w-full px-3 py-1.5 border border-snow-dark rounded-lg text-xs font-montserrat text-navy mb-2 focus:border-gold focus:ring-0"
                                  />
                                  <div className="relative">
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      onChange={e => handleDocumentPdfUpload(doc.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button 
                                      type="button" 
                                      className="w-full bg-snow hover:bg-snow-dark text-navy border border-snow-dark py-1.5 px-3 rounded-lg text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                      Subir archivo PDF
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!content.documents || content.documents.length === 0) && (
                        <div className="text-center py-8 bg-snow/30 rounded-xl border border-dashed border-snow-dark">
                          <p className="text-oxford text-sm font-montserrat">No hay documentos configurados.</p>
                        </div>
                      )}
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
