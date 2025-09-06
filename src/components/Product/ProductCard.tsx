import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image_url: string;
    user_id: string;
    created_at: string;
  };
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard = ({ product, showActions = false, onEdit, onDelete }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sellerRating, setSellerRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSellerRating();
  }, [product.user_id]);

  const fetchSellerRating = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', product.user_id);

    if (data && data.length > 0) {
      const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
      setSellerRating(avgRating);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (user.id === product.user_id) {
      toast({
        title: "Cannot add own product",
        description: "You cannot add your own product to cart",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('cart')
      .insert({
        user_id: user.id,
        product_id: product.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Added to cart! 🌱",
        description: "Item successfully added to your cart",
      });
    }
    
    setLoading(false);
  };

  const getCO2Savings = () => {
    // Fake calculation based on product price
    const savings = Math.floor(product.price * 0.1 + Math.random() * 2);
    return Math.max(1, savings);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-eco hover:-translate-y-1 animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-eco-secondary/90 text-eco-forest">
            {product.category}
          </Badge>
        </div>
        {sellerRating > 0 && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-card/90 rounded-full px-2 py-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs font-medium">{sellerRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <div className="flex items-center space-x-1 text-eco-secondary">
            <Leaf className="h-4 w-4" />
            <span className="text-xs font-medium">{getCO2Savings()}kg CO₂ saved</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {showActions ? (
          <div className="flex w-full space-x-2">
            <Button onClick={onEdit} variant="outline" className="flex-1">
              Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" className="flex-1">
              Delete
            </Button>
          </div>
        ) : (
          <Button 
            onClick={addToCart} 
            className="w-full" 
            disabled={loading || user?.id === product.user_id}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : user?.id === product.user_id ? 'Your Product' : 'Add to Cart'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;