import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";

const ReviewsSection = () => {
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
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-card shadow-soft hover:shadow-medium transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="h-6 w-6 text-primary mb-2" />
                  <p className="text-muted-foreground italic">{review.review}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-medium hover:shadow-soft transition-all duration-300"
          >
            Leave a Review
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;