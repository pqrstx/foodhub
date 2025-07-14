import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, Coffee, Wine } from "lucide-react";

const MenuSection = () => {
  const menuItems = {
    starters: [
      {
        name: "Samosas",
        price: "KSh 250",
        description: "Crispy pastry filled with spiced minced meat or vegetables"
      },
      {
        name: "Kachumbari",
        price: "KSh 180",
        description: "Fresh tomato and onion salad with coriander and lime"
      },
      {
        name: "Bhajia",
        price: "KSh 220",
        description: "Spiced potato fritters served with tamarind chutney"
      }
    ],
    mains: [
      {
        name: "Nyama Choma",
        price: "KSh 850",
        description: "Grilled goat meat served with kachumbari and ugali"
      },
      {
        name: "Pilau",
        price: "KSh 650",
        description: "Fragrant spiced rice with tender beef or chicken"
      },
      {
        name: "Ugali & Sukuma Wiki",
        price: "KSh 450",
        description: "Maize flour staple with sautéed collard greens"
      }
    ],
    drinks: [
      {
        name: "Dawa Cocktail",
        price: "KSh 550",
        description: "Kenyan specialty with vodka, honey, lime and sugar"
      },
      {
        name: "Tusker Lager",
        price: "KSh 350",
        description: "Kenya's famous beer, served chilled"
      },
      {
        name: "Mandazi",
        price: "KSh 280",
        description: "Sweet fried dough, perfect with tea or coffee"
      }
    ]
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Our Menu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starters */}
          <Card className="bg-card shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Utensils className="h-8 w-8 text-primary mr-2" />
                <CardTitle className="text-2xl text-brown">Starters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {menuItems.starters.map((item, index) => (
                <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {item.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Courses */}
          <Card className="bg-card shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Wine className="h-8 w-8 text-primary mr-2" />
                <CardTitle className="text-2xl text-brown">Main Courses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {menuItems.mains.map((item, index) => (
                <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {item.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Drinks & Desserts */}
          <Card className="bg-card shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Coffee className="h-8 w-8 text-primary mr-2" />
                <CardTitle className="text-2xl text-brown">Drinks & Desserts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {menuItems.drinks.map((item, index) => (
                <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {item.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-brown mb-6">View Our Full Menu</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-medium hover:shadow-soft transition-all duration-300"
            >
              View Online
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full transition-all duration-300"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;