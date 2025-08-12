import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import MenuSection from "@/components/MenuSection";
import GallerySection from "@/components/GallerySection";
import ReservationWithMenu from "@/components/ReservationWithMenu";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <HeroSection />
        <StorySection />
        <MenuSection />
        <GallerySection />
        <ReservationWithMenu />
        <ReviewsSection />
        <ContactSection />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
