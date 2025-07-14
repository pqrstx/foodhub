import heroImage from "@/assets/hero-kenyan-cuisine.jpg";
import samosasImage from "@/assets/samosas.jpg";
import ugaliImage from "@/assets/ugali-sukuma.jpg";
import restaurantImage from "@/assets/restaurant-interior.jpg";

const GallerySection = () => {
  const galleryImages = [
    { src: heroImage, alt: "Kenyan grilled meat platter" },
    { src: samosasImage, alt: "Traditional samosas" },
    { src: ugaliImage, alt: "Ugali with sukuma wiki" },
    { src: restaurantImage, alt: "Restaurant interior" },
    { src: heroImage, alt: "Nyama choma presentation" },
    { src: samosasImage, alt: "Food presentation" },
  ];

  return (
    <section id="gallery" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Photo Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-medium text-lg">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;