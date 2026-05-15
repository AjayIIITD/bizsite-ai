"use client"

import { cn } from "@/lib/utils"

interface OnboardingStepProps {
  step: number
  currentStep: number
  children: React.ReactNode
  className?: string
}

export default function OnboardingStep({
  step,
  currentStep,
  children,
  className,
}: OnboardingStepProps) {
  if (step !== currentStep) return null
  return <div className={cn("space-y-6", className)}>{children}</div>
}
