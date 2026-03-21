import type { LeadData } from '@/lib/types';

interface StepOneProps {
  data: LeadData;
  onChange: (field: keyof LeadData, value: string) => void;
  errors: Record<string, string>;
}

export default function StepOne({ data, onChange, errors }: StepOneProps) {
  // Phone mask: +56 9 XXXX XXXX
  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    let digits = value.replace(/\D/g, '');
    
    // If starts with 56, remove it (we'll add prefix)
    if (digits.startsWith('56')) {
      digits = digits.substring(2);
    }
    // If starts with 9, keep it
    if (digits.startsWith('9')) {
      // keep
    } else if (digits.length > 0 && !digits.startsWith('9')) {
      digits = '9' + digits;
    }
    
    // Limit to 9 digits (9 XXXX XXXX)
    digits = digits.substring(0, 9);
    
    // Format
    let formatted = '+56 ';
    if (digits.length > 0) {
      formatted += digits.substring(0, 1);
    }
    if (digits.length > 1) {
      formatted += ' ' + digits.substring(1, 5);
    }
    if (digits.length > 5) {
      formatted += ' ' + digits.substring(5, 9);
    }
    
    onChange('phone', formatted.trim());
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-bold text-navy">Identificación y Contacto</h2>
        <p className="text-oxford text-sm mt-2">Complete sus datos personales para iniciar el proceso de triage legal.</p>
      </div>

      {/* Nombre Completo */}
      <div>
        <label htmlFor="fullName" className="form-label">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          className={`form-input ${errors.fullName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          placeholder="Ej: María Fernanda González Rojas"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="form-label">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          placeholder="ejemplo@correo.cl"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.email}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="form-label">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          className={`form-input ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          placeholder="+56 9 1234 5678"
          value={data.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.phone}</p>
        )}
        <p className="text-oxford text-xs mt-1">Formato: +56 9 XXXX XXXX</p>
      </div>
    </div>
  );
}
