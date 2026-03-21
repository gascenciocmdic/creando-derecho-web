import type { LeadData } from '@/lib/types';
import { INSTITUTION_TYPES, LEGAL_QUALITIES } from '@/lib/constants';

interface StepTwoProps {
  data: LeadData;
  onChange: (field: keyof LeadData, value: string) => void;
  errors: Record<string, string>;
}

export default function StepTwo({ data, onChange, errors }: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-bold text-navy">Perfil Institucional</h2>
        <p className="text-oxford text-sm mt-2">Indique su afiliación institucional para orientar mejor su caso.</p>
      </div>

      {/* Tipo de Institución */}
      <div>
        <label htmlFor="institutionType" className="form-label">
          Tipo de Institución <span className="text-red-500">*</span>
        </label>
        <select
          id="institutionType"
          className={`form-input cursor-pointer ${errors.institutionType ? 'border-red-400' : ''}`}
          value={data.institutionType}
          onChange={(e) => onChange('institutionType', e.target.value)}
        >
          <option value="">Seleccione una opción...</option>
          {INSTITUTION_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.institutionType && (
          <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.institutionType}</p>
        )}
      </div>

      {/* Nombre del Servicio */}
      <div>
        <label htmlFor="serviceName" className="form-label">
          Nombre del Servicio <span className="text-red-500">*</span>
        </label>
        <input
          id="serviceName"
          type="text"
          className={`form-input ${errors.serviceName ? 'border-red-400' : ''}`}
          placeholder="Ej: Seremi de Transportes RM"
          value={data.serviceName}
          onChange={(e) => onChange('serviceName', e.target.value)}
        />
        {errors.serviceName && (
          <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.serviceName}</p>
        )}
      </div>

      {/* Calidad Jurídica */}
      <div>
        <label className="form-label">
          Calidad Jurídica <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {LEGAL_QUALITIES.map((quality) => (
            <label
              key={quality}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.legalQuality === quality
                  ? 'border-gold bg-gold/5 shadow-sm'
                  : 'border-snow-dark hover:border-gold/40'
              }`}
            >
              <input
                type="radio"
                name="legalQuality"
                value={quality}
                checked={data.legalQuality === quality}
                onChange={(e) => onChange('legalQuality', e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  data.legalQuality === quality
                    ? 'border-gold'
                    : 'border-oxford/30'
                }`}
              >
                {data.legalQuality === quality && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </div>
              <span className="text-sm font-montserrat font-medium text-navy">{quality}</span>
            </label>
          ))}
        </div>
        {errors.legalQuality && (
          <p className="text-red-500 text-xs mt-2 font-montserrat">{errors.legalQuality}</p>
        )}
      </div>
    </div>
  );
}
