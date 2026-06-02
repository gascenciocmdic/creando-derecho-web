import { getContent } from '@/lib/getContent';

export default async function DocumentsSection() {
  const content = await getContent();
  
  if (!content.documents || content.documents.length === 0) {
    return null;
  }

  return (
    <section id="documentos" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-gold/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy/5 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="block text-gold font-montserrat font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Biblioteca Digital
          </span>
          <h2 className="section-heading mx-auto after:mx-auto after:left-0 after:right-0">
            Documentos de Interés
          </h2>
          <p className="max-w-2xl mx-auto text-oxford text-lg mt-10">
            Descargue guías prácticas, manuales y normativas preparadas por nuestro equipo de consultores legales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.documents.map((doc: any) => (
            <div 
              key={doc.id} 
              className="bg-snow/30 p-8 rounded-2xl border border-snow-dark hover:border-gold/30 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* PDF Icon */}
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300">
                  {doc.title}
                </h3>

                {/* Description */}
                <p className="text-oxford text-sm leading-relaxed mb-6 font-montserrat">
                  {doc.description}
                </p>
              </div>

              {/* Download Button */}
              <div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gold/40 text-gold-dark hover:bg-gold hover:text-white hover:border-gold font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
