import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/Product/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  user_id: string;
  created_at: string;
}

const MyListings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } else {
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "Your product has been removed from the marketplace",
      });
    }
  };

  const handleEdit = (productId: string) => {
    // For now, just show a toast. In a full implementation, you'd navigate to an edit page
    toast({
      title: "Edit feature",
      description: "Edit functionality coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your sustainable products
          </p>
        </div>
        <Link to="/add-product">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
          <p className="text-muted-foreground mb-6">
            Start listing your pre-loved items to help create a sustainable marketplace!
          </p>
          <Link to="/add-product">
            <Button>List Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              onEdit={() => handleEdit(product.id)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;