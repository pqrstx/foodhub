export type MenuItem = {
  id: number;
  name: string;
  category: "starters" | "mains" | "drinks" | "desserts";
  price: number; // in KSh
  description: string;
  tags?: string[];
  spicy?: boolean;
  vegetarian?: boolean;
};

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: "Samosas",
    category: "starters",
    price: 250,
    description:
      "Golden crispy pastries filled with aromatic spiced minced meat or fresh vegetables, served with mint and tamarind chutney",
    tags: ["Popular", "Traditional"],
    spicy: true,
    vegetarian: false,
  },
  {
    id: 2,
    name: "Kachumbari",
    category: "starters",
    price: 180,
    description:
      "Refreshing traditional Kenyan salad with diced tomatoes, onions, fresh coriander, and tangy lime dressing",
    tags: ["Vegetarian", "Fresh"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 3,
    name: "Bhajia",
    category: "starters",
    price: 220,
    description:
      "Crispy gram flour fritters with tender spiced potatoes, served with sweet and sour tamarind chutney",
    tags: ["Vegetarian", "Spicy"],
    spicy: true,
    vegetarian: true,
  },
  {
    id: 4,
    name: "Mutura",
    category: "starters",
    price: 320,
    description:
      "Traditional Kenyan sausage made with beef, goat meat, and spices, grilled to perfection and served with kachumbari",
    tags: ["Traditional", "Popular"],
    spicy: true,
    vegetarian: false,
  },

  // Mains
  {
    id: 5,
    name: "Nyama Choma",
    category: "mains",
    price: 850,
    description:
      "Tender grilled goat meat marinated in traditional spices, served with fresh kachumbari and warm ugali",
    tags: ["Popular", "Traditional"],
    spicy: false,
    vegetarian: false,
  },
  {
    id: 6,
    name: "Pilau",
    category: "mains",
    price: 650,
    description:
      "Fragrant basmati rice cooked with aromatic spices, tender beef or chicken, and caramelized onions",
    tags: ["Traditional", "Popular"],
    spicy: true,
    vegetarian: false,
  },
  {
    id: 7,
    name: "Ugali & Sukuma Wiki",
    category: "mains",
    price: 450,
    description:
      "Kenya's beloved staple - smooth maize flour ugali paired with sautéed collard greens in garlic and onions",
    tags: ["Traditional", "Vegetarian"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 8,
    name: "Matoke",
    category: "mains",
    price: 520,
    description:
      "Green bananas slow-cooked in rich tomato sauce with beef, onions, and traditional Kenyan spices",
    tags: ["Traditional", "Comfort Food"],
    spicy: false,
    vegetarian: false,
  },
  {
    id: 9,
    name: "Githeri",
    category: "mains",
    price: 380,
    description:
      "Hearty mix of boiled maize and beans, simmered with vegetables, tomatoes, and aromatic spices",
    tags: ["Traditional", "Vegetarian"],
    spicy: false,
    vegetarian: true,
  },

  // Drinks
  {
    id: 10,
    name: "Dawa Cocktail",
    category: "drinks",
    price: 550,
    description:
      "Kenya's signature cocktail with premium vodka, natural honey, fresh lime juice, and brown sugar",
    tags: ["Popular", "Signature"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 11,
    name: "Tusker Lager",
    category: "drinks",
    price: 350,
    description:
      "Kenya's iconic premium lager beer, crisp and refreshing, served ice-cold",
    tags: ["Popular", "Local"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 12,
    name: "Kenyan Chai",
    category: "drinks",
    price: 180,
    description:
      "Traditional spiced tea brewed with fresh milk, cardamom, cinnamon, and ginger",
    tags: ["Traditional", "Hot"],
    spicy: true,
    vegetarian: true,
  },
  {
    id: 13,
    name: "Tamarind Juice",
    category: "drinks",
    price: 250,
    description:
      "Refreshing sweet and tangy drink made from fresh tamarind pulp, perfectly chilled",
    tags: ["Fresh", "Traditional"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 14,
    name: "Passion Fruit Juice",
    category: "drinks",
    price: 280,
    description:
      "Fresh tropical passion fruit juice, naturally sweet with a delightful aromatic flavor",
    tags: ["Fresh", "Tropical"],
    spicy: false,
    vegetarian: true,
  },

  // Desserts
  {
    id: 15,
    name: "Mandazi",
    category: "desserts",
    price: 200,
    description:
      "Sweet fried doughnuts spiced with cardamom and coconut, perfect with Kenyan chai or coffee",
    tags: ["Traditional", "Sweet"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 16,
    name: "Coconut Rice Pudding",
    category: "desserts",
    price: 320,
    description:
      "Creamy rice pudding cooked in coconut milk, sweetened with brown sugar and topped with toasted coconut flakes",
    tags: ["Creamy", "Tropical"],
    spicy: false,
    vegetarian: true,
  },
  {
    id: 17,
    name: "Tropical Fruit Salad",
    category: "desserts",
    price: 380,
    description:
      "Fresh seasonal tropical fruits including mangoes, pineapples, passion fruit, and papaya with lime zest",
    tags: ["Fresh", "Healthy"],
    spicy: false,
    vegetarian: true,
  },
];

export const formatKsh = (amount: number) => `KSh ${amount.toLocaleString()}`;
