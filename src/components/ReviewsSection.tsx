import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const ReviewsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    review: ""
  });
  const [isOpen, setIsOpen] = useState(false);

  const reviews = [
    {
      name: "James Mwangi",
      rating: 5,
      review: "The Nyama Choma at FoodHub is the best I've ever had! Perfectly grilled with amazing flavor. The service was excellent too.",
      avatar: "JM"
    },
    {
      name: "Sarah Njoroge",
      rating: 4,
      review: "I ordered the Pilau for delivery and it arrived hot and fresh. The portion was generous and tasted just like my grandmother makes it!",
      avatar: "SN"
    },
    {
      name: "David Kimani",
      rating: 5,
      review: "The atmosphere at FoodHub is wonderful. We celebrated my wife's birthday there and the staff went above and beyond to make it special.",
      avatar: "DK"
    },
    {
      name: "Grace Wanjiku",
      rating: 5,
      review: "The Githeri here reminds me of home! Perfectly cooked and seasoned. The staff is so friendly and the prices are very reasonable.",
      avatar: "GW"
    },
    {
      name: "Peter Ochieng",
      rating: 4,
      review: "I tried the Mutura for the first time and it was incredible! The spice level was perfect and the portion size was generous.",
      avatar: "PO"
    },
    {
      name: "Mary Akinyi",
      rating: 5,
      review: "Best traditional Kenyan food in town! The Ugali and Sukuma Wiki combination is divine. Definitely coming back with family!",
      avatar: "MA"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    console.log("Review submitted:", formData);
    setIsOpen(false);
    setFormData({ name: "", rating: 5, review: "" });
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="bg-card shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4 transition-transform duration-300 group-hover:scale-110 shadow-glow">
                    {review.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{review.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="h-6 w-6 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-muted-foreground italic group-hover:text-foreground transition-colors duration-300">{review.review}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary hover:shadow-glow text-primary-foreground px-8 py-3 rounded-full shadow-elegant hover:scale-105 transition-all duration-300"
              >
                Leave a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-primary">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground">Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                          i < formData.rating ? 'fill-primary text-primary' : 'text-gray-300 hover:text-primary'
                        }`}
                        onClick={() => handleStarClick(i + 1)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="review" className="text-sm font-medium text-foreground">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience..."
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    required
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Submit Review
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;