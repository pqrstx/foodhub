import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatKsh } from "@/data/menu";
import { Minus, Plus, Trash2 } from "lucide-react";

export const CartSidebar = () => {
  const { items, total, updateQuantity, updateSpecialRequests, removeItem, clearCart } = useCart();

  return (
    <aside className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-brown">Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 && (
            <p className="text-muted-foreground text-sm">No items added yet. Browse the menu to add dishes.</p>
          )}

          {items.map((item) => (
            <div key={item.key} className="border border-border rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatKsh(item.price)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.key, parseInt(e.target.value || "1", 10))}
                    className="w-14 text-center"
                    min={1}
                  />
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => removeItem(item.key)} aria-label="Remove item">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Special requests (e.g., no onions)"
                  value={item.specialRequests || ""}
                  onChange={(e) => updateSpecialRequests(item.key, e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-end text-sm text-foreground">
                Subtotal: <span className="font-semibold ml-1">{formatKsh(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">{formatKsh(total)}</span>
              </div>
              <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
