import { Utensils } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brown-dark text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FoodHub</span>
            <span className="text-sm opacity-70 ml-4">Authentic Kenyan Cuisine</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm opacity-70">
            <span>© 2023 FoodHub. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;