import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/common/Section';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <Section padding="xl" className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">
            404
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pagina nu a fost găsită
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg" asChild>
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Acasă
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/stoc" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Stoc Auto
              </Link>
            </Button>
          </div>
          
          <div className="mt-8">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi
            </Button>
          </div>
        </div>
      </Section>
      
      <Footer />
    </div>
  );
};

export default NotFound;