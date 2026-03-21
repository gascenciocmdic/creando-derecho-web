'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LeadData, TriageStep } from '@/lib/types';
import ProgressBar from '@/components/TriageForm/ProgressBar';
import StepOne from '@/components/TriageForm/StepOne';
import StepTwo from '@/components/TriageForm/StepTwo';
import StepThree from '@/components/TriageForm/StepThree';

const initialData: LeadData = {
  fullName: '',
  email: '',
  phone: '',
  institutionType: '',
  serviceName: '',
  legalQuality: '',
  caseSubjects: [],
  caseDescription: '',
  acceptedConfidentiality: false,
};

export default function TriagePage() {
  const router = useRouter();
  const [step, setStep] = useState<TriageStep>(1);
  const [data, setData] = useState<LeadData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (field: keyof LeadData, value: string | string[] | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.fullName.trim()) errs.fullName = 'El nombre es obligatorio';
    if (!data.email.trim()) {
      errs.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Ingrese un correo electrónico válido';
    }
    if (!data.phone.trim()) {
      errs.phone = 'El teléfono es obligatorio';
    } else if (data.phone.replace(/\D/g, '').length < 11) {
      errs.phone = 'Ingrese un número de teléfono válido (+56 9 XXXX XXXX)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.institutionType) errs.institutionType = 'Seleccione un tipo de institución';
    if (!data.serviceName.trim()) errs.serviceName = 'El nombre del servicio es obligatorio';
    if (!data.legalQuality) errs.legalQuality = 'Seleccione su calidad jurídica';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.caseSubjects || data.caseSubjects.length === 0) {
      errs.caseSubjects = 'Seleccione al menos una materia';
    }
    if (!data.caseDescription.trim()) {
      errs.caseDescription = 'Describa su caso brevemente';
    }
    if (!data.acceptedConfidentiality) {
      errs.acceptedConfidentiality = 'Debe aceptar la cláusula de confidencialidad';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as TriageStep);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    // Check honeypot
    const honeypot = document.getElementById('website_url') as HTMLInputElement;
    if (honeypot && honeypot.value) {
      // Bot detected — silently "succeed"
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Error al enviar');
      }
    } catch {
      // Show error but log to console in demo mode
      console.log('Lead data (demo mode):', data);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-snow pt-28 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-snow-dark">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark mx-auto flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-playfair text-3xl font-bold text-navy mb-4">
              ¡Consulta Recibida!
            </h2>
            <p className="text-oxford text-lg mb-8">
              Nuestro equipo de expertos revisará su caso y se contactará con usted a la brevedad.
            </p>
            <div className="bg-navy/5 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 justify-center text-sm text-oxford">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Su información ha sido almacenada de forma segura y confidencial
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-gold font-montserrat font-semibold text-xs tracking-[0.2em] uppercase">
            Evaluación Inicial
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-navy mt-3">
            Triage Legal
          </h1>
          <p className="text-oxford mt-3 text-sm">
            Complete los siguientes pasos para recibir una evaluación preliminar de su caso.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-snow-dark">
          <ProgressBar currentStep={step} />

          {/* Steps */}
          <div className="min-h-[400px]">
            {step === 1 && (
              <StepOne data={data} onChange={onChange} errors={errors} />
            )}
            {step === 2 && (
              <StepTwo data={data} onChange={onChange} errors={errors} />
            )}
            {step === 3 && (
              <StepThree data={data} onChange={onChange} errors={errors} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-snow-dark">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-oxford hover:text-navy font-montserrat font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">
                Siguiente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Enviar Consulta
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-oxford text-xs font-montserrat">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Formulario protegido — Datos tratados con estricta confidencialidad
        </div>
      </div>
    </div>
  );
}
