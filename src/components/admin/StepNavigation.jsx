import React, { useState } from 'react';
// Importe um ícone de verificação (check mark) de sua preferência.
// Exemplo: 'lucide-react' ou 'react-icons'
import { Check } from 'lucide-react'; 

// 1. Definição das etapas
const steps = [
  'Crie seus Módulos',
  'Crie seus Submódulos',
  'Crie Campos',
  'Insira Registros',
];

// 2. Componente StepItem
const StepItem = ({ step, index, currentStep }) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;

  // Classes condicionais baseadas no estado da etapa
  const stepCircleClasses = `
    w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
    transition-all duration-300
    ${isCompleted 
      ? 'bg-green-500 text-white' // Etapa completa
      : isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' // Etapa ativa
        : 'bg-gray-200 text-gray-500' // Etapa pendente
    }
  `;

  const stepTextClasses = `
    mt-2 text-center text-sm font-medium whitespace-nowrap
    transition-colors duration-300
    ${isActive ? 'text-gray-800 font-semibold' : 'text-gray-500'}
  `;

  // Linha de conexão entre os círculos das etapas
  const lineClasses = `
    flex-1 h-0.5 mt-4 mx-2 transition-all duration-300
    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
  `;

  return (
    <>
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={stepCircleClasses}>
          {isCompleted ? (
            <Check size={16} /> // Ícone de verificação para etapas completas
          ) : (
            index + 1 // Número para etapas ativas ou pendentes
          )}
        </div>
        <div className={stepTextClasses}>
          {step}
        </div>
      </div>
      {/* Adiciona a linha de conexão, mas não após a última etapa */}
      {index < steps.length - 1 && (
        <div className={lineClasses}></div>
      )}
    </>
  );
};


// 3. Componente Principal
const StepNavigation = () => {
  // Estado para controlar a etapa atual (0-indexado)
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = steps.length;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="p-8 bg-gray-50 ">
      
      {/* Container Principal Estilizado (Imitando o Card da Imagem) */}
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-2xl  border border-gray-100">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient text-center">
            Siga os passos
        </h2>
        {/* Stepper/Navegação Passo a Passo */}
        <div className="flex justify-between items-start  pt-4">
          {steps.map((step, index) => (
            <StepItem
              key={step}
              step={step}
              index={index}
              currentStep={currentStep}
            />
          ))}
        </div>
        
      </div>
     
    </div>
  );
};

export default StepNavigation;