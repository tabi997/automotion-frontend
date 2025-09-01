import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isComplete?: boolean;
  isRequired?: boolean;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onComplete: (data: any) => void;
  onStepChange?: (currentStep: number, data: any) => void;
  title?: string;
  description?: string;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
  className?: string;
}

export function MultiStepForm({
  steps,
  onComplete,
  onStepChange,
  title = "Formular Multi-Etapă",
  description = "Completează formularul pas cu pas",
  showProgress = true,
  allowBackNavigation = true,
  className = ""
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStepData.isComplete !== false;

  const handleNext = () => {
    if (onStepChange) {
      onStepChange(currentStep, formData);
    }
    
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep && allowBackNavigation) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <span className="text-sm font-medium text-center sm:text-left">
              Pasul {currentStep + 1} din {steps.length}
            </span>
            <span className="text-sm text-muted-foreground text-center sm:text-right">
              {Math.round(progress)}% completat
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Step Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <Badge
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep ? "bg-success text-success-foreground" : ""
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </Badge>
                <span className="text-xs mt-1 text-center max-w-20 hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">{currentStepData.title}</span>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            </div>
            {currentStepData.isRequired && (
              <Badge variant="outline" className="text-xs">
                Obligatoriu
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Clone the component and pass form data and update function */}
          {React.cloneElement(currentStepData.component as React.ReactElement, {
            formData,
            updateFormData,
            isComplete: currentStepData.isComplete
          })}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || !allowBackNavigation}
          className="flex items-center w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Înapoi
        </Button>

        <div className="flex flex-col items-center gap-2 order-first sm:order-none">
          <span className="text-sm text-muted-foreground text-center">
            Pasul {currentStep + 1} din {steps.length}
          </span>
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className="flex items-center w-full sm:w-auto justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Se trimite...
            </>
          ) : isLastStep ? (
            <>
              Finalizează
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Următorul pas
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
