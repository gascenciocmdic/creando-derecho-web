import type { TriageStep } from '@/lib/types';

interface ProgressBarProps {
  currentStep: TriageStep;
}

const steps = [
  { num: 1 as TriageStep, label: 'Identificación' },
  { num: 2 as TriageStep, label: 'Perfil Institucional' },
  { num: 3 as TriageStep, label: 'Detalles del Caso' },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-snow-dark" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
        
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;
          
          return (
            <div key={step.num} className="relative flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg shadow-gold/30'
                    : isCurrent
                    ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg shadow-gold/30 ring-4 ring-gold/20'
                    : 'bg-snow-dark text-oxford border-2 border-snow-dark'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`mt-2 text-xs font-montserrat font-medium transition-colors ${
                  isCurrent || isCompleted ? 'text-navy' : 'text-oxford'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
