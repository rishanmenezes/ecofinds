import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, ShoppingCart, User, Package, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;
    
    const { count } = await supabase
      .from('cart')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    setCartCount(count || 0);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="bg-gradient-eco bg-clip-text text-transparent">EcoFinds</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/feed"
                className={`transition-colors hover:text-primary ${
                  isActive('/feed') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Feed
              </Link>
              <Link
                to="/add-product"
                className={`transition-colors hover:text-primary ${
                  isActive('/add-product') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Add Product
              </Link>
              <Link
                to="/my-listings"
                className={`flex items-center space-x-1 transition-colors hover:text-primary ${
                  isActive('/my-listings') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>My Listings</span>
              </Link>
              <Link
                to="/cart"
                className={`relative flex items-center space-x-1 transition-colors hover:text-primary ${
                  isActive('/cart') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span>Cart</span>
              </Link>
              <Link
                to="/purchases"
                className={`flex items-center space-x-1 transition-colors hover:text-primary ${
                  isActive('/purchases') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <History className="h-4 w-4" />
                <span>Purchases</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center space-x-1 transition-colors hover:text-primary ${
                  isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Button onClick={signOut} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;