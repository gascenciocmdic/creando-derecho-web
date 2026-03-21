import Link from 'next/link';
import { getContent } from '@/lib/getContent';

function ServiceIcon({ icon }: { icon: string }) {
  const iconClass = "w-8 h-8 text-gold";
  
  if (icon === 'shield') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  
  if (icon === 'scale') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    );
  }
  
  // graduation
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
    </svg>
  );
}

export default async function ServicesSection() {
  const content = await getContent();

  const dynamicServices = [
    { id: '1', title: content.service1Title, description: content.service1Desc, icon: 'shield' },
    { id: '2', title: content.service2Title, description: content.service2Desc, icon: 'scale' },
    { id: '3', title: content.service3Title, description: content.service3Desc, icon: 'graduation' },
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="block text-gold font-montserrat font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Áreas de Práctica
          </span>
          <h2 className="section-heading mx-auto after:mx-auto after:left-0 after:right-0">
            Nuestros Servicios
          </h2>
          <p className="max-w-2xl mx-auto text-oxford text-lg mt-10">
            Proveemos soluciones jurídicas especializadas para las necesidades más complejas del sector público chileno.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicServices.map((service, index) => (
            <div
              key={service.id}
              className="service-card group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <ServiceIcon icon={service.icon} />
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl font-bold text-navy mb-4 group-hover:text-gold transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-oxford text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Link */}
              <Link
                href="/triage"
                className="inline-flex items-center gap-2 text-gold font-montserrat font-semibold text-sm group-hover:gap-3 transition-all"
              >
                Consultar
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/triage" className="btn-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Iniciar Triage Legal
          </Link>
        </div>
      </div>
    </section>
  );
}
