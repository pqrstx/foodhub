import { useEffect, useMemo, useState } from "react";
import { CartProvider, useCart } from "@/hooks/useCart";
import { CartSidebar } from "@/components/reservation/CartSidebar";
import { MenuList } from "@/components/reservation/MenuList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, Users, Phone, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatKsh } from "@/data/menu";

// Step 1: Reservation form with lifted state
const ReservationForm = ({ formData, setFormData, onNext }: { formData: any; setFormData: (d: any) => void; onNext: () => void }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user && !formData.email) {
      setFormData({ ...formData, email: user.email || "" });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => setFormData({ ...formData, [field]: value });

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl text-brown">Book Your Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Full Name
              </Label>
              <Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Number of Guests
              </Label>
              <Select value={formData.guests} onValueChange={(v) => handleInputChange("guests", v)}>
                <SelectTrigger id="guests">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? "Person" : "People"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Date
              </Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Time
              </Label>
              <Select value={formData.time} onValueChange={(v) => handleInputChange("time", v)}>
                <SelectTrigger id="time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["11:00","11:30","12:00","12:30","13:00","13:30","14:00","18:00","18:30","19:00","19:30","20:00","20:30","21:00"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea id="specialRequests" value={formData.specialRequests} onChange={(e) => handleInputChange("specialRequests", e.target.value)} rows={4} />
          </div>

          <div className="flex justify-end">
            <Button onClick={onNext} className="rounded-full">Next: Select Menu</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewAndCheckout = ({ formData, onBack }: { formData: any; onBack: () => void }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentOption, setPaymentOption] = useState<"pay_now" | "pay_later">("pay_later");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => !!formData.fullName && !!formData.email && !!formData.phone && !!formData.date && !!formData.time, [formData]);

  const handleConfirm = async () => {
    if (!canSubmit) return;
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your reservation and order.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Please add at least one item to your order.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      // 1) Create reservation
      const { data: reservationInsert, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          guest_name: formData.fullName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests || "1", 10),
          special_requests: formData.specialRequests || null,
        })
        .select("id")
        .single();

      if (reservationError) throw reservationError;
      const reservationId = reservationInsert!.id as string;

      // 2) Create order linked to reservation
      const { data: orderInsert, error: orderError } = await supabase
        .from("reservation_orders")
        .insert({
          reservation_id: reservationId,
          user_id: user.id,
          total_amount: total,
          payment_option: paymentOption,
          payment_status: "pending",
          notes: null,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;
      const orderId = orderInsert!.id as string;

      // 3) Insert order items
      const orderItemsPayload = items.map((i) => ({
        order_id: orderId,
        menu_item_id: typeof i.menuItemId === "number" ? null : i.menuItemId, // local ids are numbers; DB ids may exist later
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        special_requests: i.specialRequests || null,
        subtotal: i.price * i.quantity,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      clearCart();
      toast({ title: "Reservation Confirmed", description: "Your table and pre-order have been saved. See you soon!" });
      // Optionally redirect or reset form; keep simple here
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Could not complete reservation. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl text-brown">Review & Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Reservation Details</h4>
            <p className="text-sm text-muted-foreground">Name: {formData.fullName}</p>
            <p className="text-sm text-muted-foreground">Email: {formData.email}</p>
            <p className="text-sm text-muted-foreground">Phone: {formData.phone}</p>
            <p className="text-sm text-muted-foreground">Guests: {formData.guests}</p>
            <p className="text-sm text-muted-foreground">Date: {formData.date}</p>
            <p className="text-sm text-muted-foreground">Time: {formData.time}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Payment Option</h4>
            <RadioGroup value={paymentOption} onValueChange={(v) => setPaymentOption(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="pay_later" value="pay_later" />
                <Label htmlFor="pay_later">Pay later at the table</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="pay_now" value="pay_now" />
                <Label htmlFor="pay_now">Pre-pay for food (coming soon)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Order Summary</h4>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.key} className="flex justify-between text-sm">
                <span className="text-foreground">{i.name} x {i.quantity}</span>
                <span className="text-foreground">{formatKsh(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total</span>
            <span>{formatKsh(total)}</span>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack} className="rounded-full">Back</Button>
          <Button onClick={handleConfirm} disabled={!canSubmit || submitting} className="rounded-full">
            {submitting ? "Processing..." : "Confirm Reservation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReservationWithMenuInner = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    guests: "1",
    date: "",
    time: "12:00",
    specialRequests: "",
  });

  const handleToMenu = () => {
    // Read values from form by refs? Simpler: we pass setter via custom event; For brevity, keep in parent state
    // We will store the form in component-level state by intercepting DOM? To keep simple, we wrap form component and lift state via a callback on blur.
    // Here, we just switch tab and rely on user to fill review later.
    setActiveTab("menu");
  };

  return (
    <section id="reservations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4">Reserve & Pre-Order</h2>
          <p className="text-muted-foreground">Book your table and select your dishes in one seamless flow.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">1. Details</TabsTrigger>
                <TabsTrigger value="menu">2. Menu</TabsTrigger>
                <TabsTrigger value="review">3. Review</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                {/* Reservation form with lifted state */}
                <ReservationForm formData={formData} setFormData={setFormData} onNext={() => setActiveTab("menu")} />
              </TabsContent>

              <TabsContent value="menu">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-brown">Select Dishes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MenuList />
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setActiveTab("review")} className="rounded-full">Next: Review</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review">
                {/* Review uses lifted state */}
                <ReviewAndCheckout formData={formData} onBack={() => setActiveTab("menu")} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <CartSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper to collect values from the first form in the DOM within this section (keeps code minimal without complex lifting)
const ReviewProxy = ({ onBack }: { onBack: () => void }) => {
  // Read inputs by id
  const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value || "";
  const data = {
    fullName: getVal("fullName"),
    email: getVal("email"),
    phone: getVal("phone"),
    guests: getVal("guests") || "1",
    date: getVal("date"),
    time: getVal("time"),
    specialRequests: (document.getElementById("specialRequests") as HTMLTextAreaElement | null)?.value || "",
  };
  return <ReviewAndCheckout formData={data} onBack={onBack} />;
};

const ReservationWithMenu = () => {
  return (
    <CartProvider>
      <ReservationWithMenuInner />
    </CartProvider>
  );
};

export default ReservationWithMenu;
