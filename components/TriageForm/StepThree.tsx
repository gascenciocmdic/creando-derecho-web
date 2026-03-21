import type { LeadData } from '@/lib/types';
import { CASE_SUBJECTS, CONFIDENTIALITY_TEXT } from '@/lib/constants';

interface StepThreeProps {
  data: LeadData;
  onChange: (field: keyof LeadData, value: string | string[] | boolean) => void;
  errors: Record<string, string>;
}

export default function StepThree({ data, onChange, errors }: StepThreeProps) {
  const maxChars = 500;

  const handleSubjectToggle = (subject: string) => {
    const current = data.caseSubjects || [];
    if (current.includes(subject)) {
      onChange('caseSubjects', current.filter((s) => s !== subject));
    } else {
      onChange('caseSubjects', [...current, subject]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-bold text-navy">Detalles del Caso</h2>
        <p className="text-oxford text-sm mt-2">Describa brevemente su situación para una evaluación preliminar.</p>
      </div>

      {/* Materia */}
      <div>
        <label className="form-label">
          Materia de Consulta <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 mt-2">
          {CASE_SUBJECTS.map((subject) => {
            const isChecked = (data.caseSubjects || []).includes(subject);
            return (
              <label
                key={subject}
                className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                  isChecked
                    ? 'border-gold bg-gold/5'
                    : 'border-snow-dark hover:border-gold/40'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                    isChecked
                      ? 'bg-gold border-gold'
                      : 'border-oxford/30'
                  }`}
                >
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSubjectToggle(subject)}
                  className="sr-only"
                />
                <span className="text-sm font-montserrat font-medium text-navy">{subject}</span>
              </label>
            );
          })}
        </div>
        {errors.caseSubjects && (
          <p className="text-red-500 text-xs mt-2 font-montserrat">{errors.caseSubjects}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="caseDescription" className="form-label">
          Descripción del Caso <span className="text-red-500">*</span>
        </label>
        <textarea
          id="caseDescription"
          className={`form-input min-h-[120px] resize-none ${errors.caseDescription ? 'border-red-400' : ''}`}
          placeholder="Describa brevemente su situación o consulta legal..."
          maxLength={maxChars}
          value={data.caseDescription}
          onChange={(e) => onChange('caseDescription', e.target.value)}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.caseDescription ? (
            <p className="text-red-500 text-xs font-montserrat">{errors.caseDescription}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs font-montserrat ${
            data.caseDescription.length > maxChars * 0.9 ? 'text-red-500' : 'text-oxford'
          }`}>
            {data.caseDescription.length}/{maxChars}
          </span>
        </div>
      </div>

      {/* Honeypot — invisible to users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website_url">Website</label>
        <input
          id="website_url"
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Confidencialidad */}
      <div className="bg-navy/5 rounded-xl p-5 border border-navy/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
              data.acceptedConfidentiality
                ? 'bg-gold border-gold'
                : errors.acceptedConfidentiality
                ? 'border-red-400'
                : 'border-oxford/30'
            }`}
          >
            {data.acceptedConfidentiality && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={data.acceptedConfidentiality}
            onChange={(e) => onChange('acceptedConfidentiality', e.target.checked)}
            className="sr-only"
          />
          <div>
            <span className="text-sm font-montserrat text-navy leading-relaxed">
              {CONFIDENTIALITY_TEXT} <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-oxford">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sus datos están protegidos según la Ley 19.628
            </div>
          </div>
        </label>
        {errors.acceptedConfidentiality && (
          <p className="text-red-500 text-xs mt-2 font-montserrat ml-8">{errors.acceptedConfidentiality}</p>
        )}
      </div>
    </div>
  );
}
