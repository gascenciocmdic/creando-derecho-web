import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TrustBadges from '@/components/TrustBadges';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TrustBadges />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-navy via-navy-light to-navy relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-oxford/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-snow mb-6">
            ¿Necesita Asesoría Legal{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Especializada
            </span>
            ?
          </h2>
          <p className="text-oxford-light text-lg mb-10 max-w-2xl mx-auto">
            Complete nuestro formulario de Triage Legal y reciba una evaluación preliminar de su caso por nuestro equipo de expertos. Proceso confidencial y sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/triage" className="btn-primary text-base px-10 py-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Iniciar Triage Legal
            </Link>
            <a href="mailto:contacto@creandoderecho.cl" className="btn-secondary text-base px-10 py-4">
              Escribir Directamente
            </a>
          </div>

          {/* Security Note */}
          <div className="mt-12 flex items-center justify-center gap-2 text-snow/40 text-xs font-montserrat">
            <svg className="w-4 h-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Toda la información es tratada con estricta confidencialidad bajo secreto profesional
          </div>
        </div>
      </section>
    </>
  );
}
