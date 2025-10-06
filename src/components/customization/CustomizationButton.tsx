import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CustomizationHub } from "./CustomizationHub";
import { useSettings } from "@/contexts/SettingsContext";

export const CustomizationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { animationsEnabled } = useSettings();

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(true)}
        className={`
          fixed left-1/2 -translate-x-1/2 bottom-6 z-40
          bg-gradient-to-r from-purple-500 to-pink-600 border-2 border-purple-400/50 
          backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.5)]
          hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all duration-300
          text-white font-bold text-lg px-8 py-6
          ${animationsEnabled ? 'hover:scale-110 animate-glow-pulse' : ''}
        `}
      >
        <Sparkles className="w-6 h-6 mr-2" />
        Customize
      </Button>
      
      <CustomizationHub 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};