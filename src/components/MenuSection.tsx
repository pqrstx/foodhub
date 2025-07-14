import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Utensils, Coffee, Wine, Search, Salad, Flame, Leaf, Star, MapPin } from "lucide-react";
import { useState, useMemo } from "react";

const MenuSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: Utensils, image: "🍽️" },
    { id: "starters", name: "Starters", icon: Salad, image: "🥗" },
    { id: "mains", name: "Main Courses", icon: Wine, image: "🍖" },
    { id: "drinks", name: "Drinks", icon: Coffee, image: "🍹" },
    { id: "desserts", name: "Desserts", icon: Coffee, image: "🍰" }
  ];

  const menuItems = [
    // Starters
    {
      id: 1,
      name: "Samosas",
      category: "starters",
      price: "KSh 250",
      description: "Golden crispy pastries filled with aromatic spiced minced meat or fresh vegetables, served with mint and tamarind chutney",
      tags: ["Popular", "Traditional"],
      spicy: true,
      vegetarian: false
    },
    {
      id: 2,
      name: "Kachumbari",
      category: "starters",
      price: "KSh 180",
      description: "Refreshing traditional Kenyan salad with diced tomatoes, onions, fresh coriander, and tangy lime dressing",
      tags: ["Vegetarian", "Fresh"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 3,
      name: "Bhajia",
      category: "starters",
      price: "KSh 220",
      description: "Crispy gram flour fritters with tender spiced potatoes, served with sweet and sour tamarind chutney",
      tags: ["Vegetarian", "Spicy"],
      spicy: true,
      vegetarian: true
    },
    {
      id: 4,
      name: "Mutura",
      category: "starters",
      price: "KSh 320",
      description: "Traditional Kenyan sausage made with beef, goat meat, and spices, grilled to perfection and served with kachumbari",
      tags: ["Traditional", "Popular"],
      spicy: true,
      vegetarian: false
    },

    // Main Courses
    {
      id: 5,
      name: "Nyama Choma",
      category: "mains",
      price: "KSh 850",
      description: "Tender grilled goat meat marinated in traditional spices, served with fresh kachumbari and warm ugali",
      tags: ["Popular", "Traditional"],
      spicy: false,
      vegetarian: false
    },
    {
      id: 6,
      name: "Pilau",
      category: "mains",
      price: "KSh 650",
      description: "Fragrant basmati rice cooked with aromatic spices, tender beef or chicken, and caramelized onions",
      tags: ["Traditional", "Popular"],
      spicy: true,
      vegetarian: false
    },
    {
      id: 7,
      name: "Ugali & Sukuma Wiki",
      category: "mains",
      price: "KSh 450",
      description: "Kenya's beloved staple - smooth maize flour ugali paired with sautéed collard greens in garlic and onions",
      tags: ["Traditional", "Vegetarian"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 8,
      name: "Matoke",
      category: "mains",
      price: "KSh 520",
      description: "Green bananas slow-cooked in rich tomato sauce with beef, onions, and traditional Kenyan spices",
      tags: ["Traditional", "Comfort Food"],
      spicy: false,
      vegetarian: false
    },
    {
      id: 9,
      name: "Githeri",
      category: "mains",
      price: "KSh 380",
      description: "Hearty mix of boiled maize and beans, simmered with vegetables, tomatoes, and aromatic spices",
      tags: ["Traditional", "Vegetarian"],
      spicy: false,
      vegetarian: true
    },

    // Drinks
    {
      id: 10,
      name: "Dawa Cocktail",
      category: "drinks",
      price: "KSh 550",
      description: "Kenya's signature cocktail with premium vodka, natural honey, fresh lime juice, and brown sugar",
      tags: ["Popular", "Signature"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 11,
      name: "Tusker Lager",
      category: "drinks",
      price: "KSh 350",
      description: "Kenya's iconic premium lager beer, crisp and refreshing, served ice-cold",
      tags: ["Popular", "Local"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 12,
      name: "Kenyan Chai",
      category: "drinks",
      price: "KSh 180",
      description: "Traditional spiced tea brewed with fresh milk, cardamom, cinnamon, and ginger",
      tags: ["Traditional", "Hot"],
      spicy: true,
      vegetarian: true
    },
    {
      id: 13,
      name: "Tamarind Juice",
      category: "drinks",
      price: "KSh 250",
      description: "Refreshing sweet and tangy drink made from fresh tamarind pulp, perfectly chilled",
      tags: ["Fresh", "Traditional"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 14,
      name: "Passion Fruit Juice",
      category: "drinks",
      price: "KSh 280",
      description: "Fresh tropical passion fruit juice, naturally sweet with a delightful aromatic flavor",
      tags: ["Fresh", "Tropical"],
      spicy: false,
      vegetarian: true
    },

    // Desserts
    {
      id: 15,
      name: "Mandazi",
      category: "desserts",
      price: "KSh 200",
      description: "Sweet fried doughnuts spiced with cardamom and coconut, perfect with Kenyan chai or coffee",
      tags: ["Traditional", "Sweet"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 16,
      name: "Coconut Rice Pudding",
      category: "desserts",
      price: "KSh 320",
      description: "Creamy rice pudding cooked in coconut milk, sweetened with brown sugar and topped with toasted coconut flakes",
      tags: ["Creamy", "Tropical"],
      spicy: false,
      vegetarian: true
    },
    {
      id: 17,
      name: "Tropical Fruit Salad",
      category: "desserts",
      price: "KSh 380",
      description: "Fresh seasonal tropical fruits including mangoes, pineapples, passion fruit, and papaya with lime zest",
      tags: ["Fresh", "Healthy"],
      spicy: false,
      vegetarian: true
    }
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "Spicy": return <Flame className="h-3 w-3" />;
      case "Vegetarian": return <Leaf className="h-3 w-3" />;
      case "Popular": return <Star className="h-3 w-3" />;
      case "Traditional": return <MapPin className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Spicy": return "bg-red-100 text-red-800 border-red-200";
      case "Vegetarian": return "bg-green-100 text-green-800 border-green-200";
      case "Popular": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Traditional": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Kenyan flavors and traditional dishes crafted with love
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search dishes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-2 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 border-2 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary shadow-medium"
                      : "bg-background text-foreground border-border hover:border-primary hover:shadow-soft"
                  }`}
                >
                  <span className="text-xl">{category.image}</span>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group bg-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 border-border/50 hover:border-primary/50"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold px-3 py-1">
                    {item.price}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.spicy && (
                    <Badge variant="outline" className={`text-xs ${getTagColor("Spicy")} border`}>
                      <Flame className="h-3 w-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                  {item.vegetarian && (
                    <Badge variant="outline" className={`text-xs ${getTagColor("Vegetarian")} border`}>
                      <Leaf className="h-3 w-3 mr-1" />
                      Vegetarian
                    </Badge>
                  )}
                  {item.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={`text-xs ${getTagColor(tag)} border`}
                    >
                      {getTagIcon(tag)}
                      {getTagIcon(tag) && <span className="ml-1">{tag}</span>}
                      {!getTagIcon(tag) && tag}
                    </Badge>
                  ))}
                </div>

                {/* Category Badge */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                    {categories.find(cat => cat.id === item.category)?.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No dishes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-brown mb-6">Ready to Order?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-medium hover:shadow-elegant transition-all duration-300 group"
            >
              <span className="group-hover:scale-110 transition-transform">Make Reservation</span>
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full transition-all duration-300"
            >
              Download Menu PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;