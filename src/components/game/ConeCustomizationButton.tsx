import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { ConeCustomization } from "./ConeCustomization";
import { useSettings } from "@/contexts/SettingsContext";

export const ConeCustomizationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { animationsEnabled } = useSettings();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`
          fixed right-4 top-1/2 -translate-y-1/2 z-40 
          bg-gradient-glass border border-primary/30 backdrop-blur-sm 
          hover:border-primary/50 hover:shadow-glow transition-all duration-300
          ${animationsEnabled ? 'hover:scale-110' : ''}
        `}
      >
        <Palette className="w-4 h-4 mr-2" />
        Cones
      </Button>
      
      <ConeCustomization 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};