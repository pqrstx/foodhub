import { menuItems, formatKsh, type MenuItem } from "@/data/menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { Flame, Leaf, MapPin, Star, Search } from "lucide-react";

export const MenuList = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});

  const categories = [
    { id: "all", name: "All" },
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Main Courses" },
    { id: "drinks", name: "Drinks" },
    { id: "desserts", name: "Desserts" },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "Spicy":
        return <Flame className="h-3 w-3" />;
      case "Vegetarian":
        return <Leaf className="h-3 w-3" />;
      case "Popular":
        return <Star className="h-3 w-3" />;
      case "Traditional":
        return <MapPin className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getQty = (id: number) => quantities[id] ?? 1;
  const getNotes = (id: number) => notes[id] ?? "";

  const handleAdd = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: getQty(item.id),
      specialRequests: getNotes(item.id),
    });
    setQuantities((q) => ({ ...q, [item.id]: 1 }));
    setNotes((n) => ({ ...n, [item.id]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search dishes or ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          aria-label="Search menu"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={selectedCategory === c.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(c.id)}
          >
            {c.name}
          </Button>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-border/60">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">{item.name}</CardTitle>
                <Badge variant="secondary">{formatKsh(item.price)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.spicy && (
                  <Badge variant="outline" className="text-xs">
                    <Flame className="h-3 w-3 mr-1" /> Spicy
                  </Badge>
                )}
                {item.vegetarian && (
                  <Badge variant="outline" className="text-xs">
                    <Leaf className="h-3 w-3 mr-1" /> Vegetarian
                  </Badge>
                )}
                {item.tags?.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {getTagIcon(t)} {getTagIcon(t) && <span className="ml-1">{t}</span>}
                    {!getTagIcon(t) && t}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                <div>
                  <label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground">
                    Quantity
                  </label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min={1}
                    value={getQty(item.id)}
                    onChange={(e) => setQuantities((q) => ({ ...q, [item.id]: Math.max(1, parseInt(e.target.value || "1", 10)) }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`note-${item.id}`} className="text-xs text-muted-foreground">
                    Special requests
                  </label>
                  <Textarea
                    id={`note-${item.id}`}
                    rows={1}
                    value={getNotes(item.id)}
                    placeholder="e.g., no onions, extra spicy"
                    onChange={(e) => setNotes((n) => ({ ...n, [item.id]: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleAdd(item)} className="rounded-full">Add to cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
