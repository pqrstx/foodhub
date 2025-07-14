import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kenyan-cuisine.jpg";

const HeroSection = () => {
  return (
    <section 
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImage})`
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          Experience Authentic Kenyan Flavors
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in">
          Traditional recipes with a modern twist
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-medium hover:shadow-soft transition-all duration-300 hover:scale-105"
            onClick={() => document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book a Table
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-brown font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;