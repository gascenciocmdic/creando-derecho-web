import { getContent } from '@/lib/getContent';

export default async function AboutSection() {
  const content = await getContent();
  
  return (
    <section id="quienes-somos" className="py-24 bg-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="block text-gold font-montserrat font-semibold text-xs tracking-[0.2em] uppercase mb-3">
              Nuestra Firma
            </span>
            <h2 className="section-heading mb-8">
              Quiénes Somos
            </h2>
            <div className="text-oxford text-lg leading-relaxed mt-10 space-y-4">
              <p>{content.aboutText1}</p>
              {content.aboutText2 && <p>{content.aboutText2}</p>}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center p-4">
                <div className="text-3xl font-playfair font-bold text-gold mb-1">{content.stat1Num}</div>
                <div className="text-xs font-montserrat text-oxford uppercase tracking-wider">{content.stat1Label}</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-playfair font-bold text-gold mb-1">{content.stat2Num}</div>
                <div className="text-xs font-montserrat text-oxford uppercase tracking-wider">{content.stat2Label}</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-playfair font-bold text-gold mb-1">{content.stat3Num}</div>
                <div className="text-xs font-montserrat text-oxford uppercase tracking-wider">{content.stat3Label}</div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-navy to-navy-light rounded-2xl p-12 overflow-hidden">
              {/* Decorative grid */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
              />
              
              <div className="relative z-10 space-y-8">
                {/* Mission Items */}
                {[
                  { icon: 'shield', title: 'Integridad', desc: 'Compromiso ético absoluto con nuestros clientes' },
                  { icon: 'scale', title: 'Excelencia', desc: 'Soluciones jurídicas de la más alta calidad' },
                  { icon: 'lock', title: 'Confidencialidad', desc: 'Protección total de datos e información sensible' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                      {item.icon === 'shield' && (
                        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      {item.icon === 'scale' && (
                        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      )}
                      {item.icon === 'lock' && (
                        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-snow font-playfair font-semibold text-lg">{item.title}</h4>
                      <p className="text-oxford-light text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gold accent line */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-gold-light to-transparent" />
            </div>
          </div>
        </div>

        {/* Dynamic Professional Team Section */}
        {content.team && content.team.length > 0 && (
          <div className="mt-24 border-t border-gold/20 pt-16">
            <div className="text-center mb-16">
              <span className="block text-gold font-montserrat font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                Expertos al Servicio del Público
              </span>
              <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-navy">
                Equipo Profesional
              </h3>
            </div>
            
            <div className={`grid grid-cols-1 gap-12 max-w-5xl mx-auto ${
              content.team.length === 1 
                ? 'max-w-md' 
                : content.team.length === 2 
                  ? 'md:grid-cols-2 max-w-3xl' 
                  : 'md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {content.team.map((member: any) => (
                <div 
                  key={member.id} 
                  className="bg-white p-8 rounded-2xl border border-snow-dark shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Title (Name and Role) */}
                  <div className="mb-6">
                    <h4 className="font-playfair text-xl font-bold text-navy group-hover:text-gold transition-colors duration-300">
                      {member.name}
                    </h4>
                    <span className="block text-gold font-montserrat font-medium text-xs tracking-wider uppercase mt-1">
                      {member.role}
                    </span>
                  </div>

                  {/* Image (below the title) */}
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 border-2 border-gold/30 group-hover:border-gold transition-colors duration-300 shadow-inner">
                    <img 
                      src={member.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256'} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Description (below the image) */}
                  <p className="text-oxford text-sm leading-relaxed max-w-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
