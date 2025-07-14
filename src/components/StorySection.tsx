import restaurantImage from "@/assets/restaurant-interior.jpg";

const StorySection = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-brown mb-6">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded in 2010, FoodHub brings the rich culinary heritage of Kenya to Nairobi's 
              vibrant food scene. Our chefs combine traditional techniques with fresh, locally-sourced 
              ingredients to create unforgettable dining experiences.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From our famous Nyama Choma to our signature Ugali dishes, every bite tells a 
              story of Kenyan culture and hospitality.
            </p>
          </div>
          <div className="relative">
            <img 
              src={restaurantImage} 
              alt="Kenyan cuisine" 
              className="rounded-lg shadow-medium hover:shadow-soft transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;