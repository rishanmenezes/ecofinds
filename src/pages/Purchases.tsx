import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, Leaf, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Purchase {
  id: string;
  purchased_at: string;
  products: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    user_id: string;
  };
}

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [reviewingProduct, setReviewingProduct] = useState<Purchase | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        purchased_at,
        products (
          id,
          title,
          description,
          price,
          image_url,
          category,
          user_id
        )
      `)
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
    } else {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  const submitReview = async () => {
    if (!user || !reviewingProduct) return;

    const { error } = await supabase
      .from('reviews')
      .insert({
        buyer_id: user.id,
        seller_id: reviewingProduct.products.user_id,
        product_id: reviewingProduct.products.id,
        rating: reviewData.rating,
        review_text: reviewData.review,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already reviewed",
          description: "You've already reviewed this seller for this product",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Review submitted! ⭐",
        description: "Thank you for helping build a trusted community",
      });
      setReviewingProduct(null);
      setReviewData({ rating: 5, review: '' });
    }
  };

  const getCO2Savings = (price: number) => {
    return Math.floor(price * 0.1 + Math.random() * 2);
  };

  const totalCO2Saved = purchases.reduce((total, purchase) => {
    return total + getCO2Savings(purchase.products.price);
  }, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase History</h1>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <span>{purchases.length} items purchased</span>
          <div className="flex items-center space-x-1 text-eco-secondary">
            <Leaf className="h-4 w-4" />
            <span>{totalCO2Saved}kg CO₂ saved total! 🌍</span>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No purchases yet</h2>
            <p className="text-muted-foreground">
              Start shopping for sustainable products to see your impact!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={purchase.products.image_url}
                    alt={purchase.products.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {purchase.products.title}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          {purchase.products.category}
                        </Badge>
                        <p className="text-muted-foreground text-sm mb-2">
                          Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-primary">
                            ${purchase.products.price}
                          </span>
                          <div className="flex items-center space-x-1 text-eco-secondary">
                            <Leaf className="h-4 w-4" />
                            <span className="text-sm">
                              {getCO2Savings(purchase.products.price)}kg CO₂ saved
                            </span>
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReviewingProduct(purchase)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Rate Seller
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rate this seller</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Rating</Label>
                              <div className="flex space-x-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        star <= reviewData.rating
                                          ? 'fill-accent text-accent'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="review">Review (optional)</Label>
                              <Textarea
                                id="review"
                                value={reviewData.review}
                                onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                                placeholder="Share your experience with this seller..."
                                rows={3}
                              />
                            </div>
                            <Button onClick={submitReview} className="w-full">
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;