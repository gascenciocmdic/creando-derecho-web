import Link from 'next/link';
import Image from 'next/image';
import { getContent } from '@/lib/getContent';

export default async function HeroSection() {
  const content = await getContent();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image: Office Desk */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Oficina Profesional de Abogados"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Dark Gradient Overlay to ensure text readability + slight blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-transparent z-10 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[100px] rounded-full translate-x-1/2 z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-navy-light/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/4 z-10" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-16 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            <span className="text-snow text-xs font-montserrat tracking-widest uppercase">
              Excelencia & Probidad
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight mb-6 animate-fade-in-up whitespace-pre-line" style={{ animationDelay: '0.1s' }}>
            {content.heroHeadline}
          </h1>
          
          <p className="text-lg md:text-xl text-snow/80 font-montserrat leading-relaxed mb-10 max-w-2xl animate-fade-in-up whitespace-pre-line" style={{ animationDelay: '0.2s' }}>
            {content.heroSubheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/triage" className="btn-primary">
              Consulta Gratuita
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a href="#servicios" className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/20 text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              Nuestros Servicios
            </a>
          </div>

          {/* Trust Indicators inside Hero */}
          <div className="mt-16 flex flex-wrap items-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 text-snow/60 text-xs font-montserrat">
              <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Conexión Segura
            </div>
            <div className="flex items-center gap-2 text-snow/60 text-xs font-montserrat">
              <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secreto Profesional
            </div>
            <div className="flex items-center gap-2 text-snow/60 text-xs font-montserrat">
              <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Equipo Multidisciplinario
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-snow to-transparent z-20" />
    </section>
  );
}
