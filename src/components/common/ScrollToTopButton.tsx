import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down more than 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className={cn(
            "fixed z-50 rounded-full shadow-large border-2 border-primary/20 bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-glow hover:scale-110 transition-all duration-500 ease-out",
            // Responsive positioning and sizing
            "bottom-4 right-4 h-12 w-12 md:bottom-6 md:right-6 md:h-14 md:w-14",
            isVisible 
              ? "opacity-100 translate-x-0 translate-y-0 scale-100 animate-fade-in" 
              : "opacity-0 translate-x-8 translate-y-8 scale-95 pointer-events-none"
          )}
          aria-label="Scroll to top"
        >
          <ChevronUp className={cn(
            "h-5 w-5 md:h-6 md:w-6 group-hover:animate-bounce transition-transform duration-300",
            isVisible && "animate-pulse-glow"
          )} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-primary text-primary-foreground border-primary">
        <p>Scroll la început</p>
      </TooltipContent>
    </Tooltip>
  );
};
