import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, ShoppingBag, Leaf } from 'lucide-react';

interface CartItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        product_id,
        products (
          id,
          title,
          description,
          price,
          image_url,
          category
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setCartItems(data || []);
    }
    setLoading(false);
  };

  const removeFromCart = async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } else {
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      toast({
        title: "Item removed",
        description: "Item removed from cart",
      });
    }
  };

  const checkout = async () => {
    if (!user || cartItems.length === 0) return;

    setCheckoutLoading(true);

    try {
      // Move cart items to purchases
      const purchaseData = cartItems.map(item => ({
        user_id: user.id,
        product_id: item.product_id,
      }));

      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchaseData);

      if (purchaseError) throw purchaseError;

      // Clear cart
      const { error: cartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      const totalCO2Saved = cartItems.reduce((total, item) => {
        return total + Math.floor(item.products.price * 0.1 + Math.random() * 2);
      }, 0);

      setCartItems([]);
      
      toast({
        title: "Purchase successful! 🎉",
        description: `You've saved ${totalCO2Saved}kg of CO₂ by buying second-hand!`,
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Something went wrong during checkout",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.products.price, 0);
  const totalCO2Savings = cartItems.reduce((total, item) => {
    return total + Math.floor(item.products.price * 0.1 + Math.random() * 2);
  }, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Start shopping for sustainable products to help save the planet!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url}
                      alt={item.products.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.products.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.products.category}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${item.products.price}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-eco">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between text-eco-secondary">
                  <div className="flex items-center space-x-1">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm">CO₂ Savings</span>
                  </div>
                  <span className="text-sm font-medium">{totalCO2Savings}kg</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={checkout}
                  disabled={checkoutLoading}
                  className="w-full"
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  🌍 By shopping second-hand, you're helping reduce waste and carbon emissions!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;