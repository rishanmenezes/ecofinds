import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Star, Award, Leaf } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  email: string;
}

interface Stats {
  totalSales: number;
  totalPurchases: number;
  avgRating: number;
  totalReviews: number;
  co2Saved: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalPurchases: 0,
    avgRating: 0,
    totalReviews: 0,
    co2Saved: 0,
  });
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    // Fetch sales (products sold)
    const { count: salesCount } = await supabase
      .from('purchases')
      .select('products!inner(*)', { count: 'exact', head: true })
      .eq('products.user_id', user.id);

    // Fetch purchases
    const { count: purchasesCount, data: purchasesData } = await supabase
      .from('purchases')
      .select('products(*)', { count: 'exact' })
      .eq('user_id', user.id);

    // Fetch reviews for this seller
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', user.id);

    // Calculate CO2 savings from purchases
    const co2Saved = (purchasesData || []).reduce((total, purchase) => {
      return total + Math.floor(purchase.products.price * 0.1 + Math.random() * 2);
    }, 0);

    const avgRating = reviewsData && reviewsData.length > 0
      ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
      : 0;

    setStats({
      totalSales: salesCount || 0,
      totalPurchases: purchasesCount || 0,
      avgRating,
      totalReviews: reviewsData?.length || 0,
      co2Saved,
    });
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        email,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      setProfile({ ...profile, username, email });
      setEditing(false);
      toast({
        title: "Profile updated! ✨",
        description: "Your profile has been successfully updated",
      });
    }

    setSaving(false);
  };

  const getEcoBadge = () => {
    if (stats.avgRating >= 4.5 && stats.totalSales >= 5) {
      return { name: "Eco Champion", icon: "🏆", color: "bg-gradient-eco" };
    } else if (stats.avgRating >= 4.0 && stats.totalSales >= 3) {
      return { name: "Green Seller", icon: "🌟", color: "bg-eco-secondary" };
    } else if (stats.totalSales >= 1) {
      return { name: "Eco Starter", icon: "🌱", color: "bg-eco-tertiary" };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="bg-muted rounded-lg h-48"></div>
          <div className="bg-muted rounded-lg h-32"></div>
        </div>
      </div>
    );
  }

  const ecoBadge = getEcoBadge();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-eco">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-eco">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">{profile?.username}</CardTitle>
              {ecoBadge && (
                <Badge className={`mt-2 ${ecoBadge.color} text-white`}>
                  {ecoBadge.icon} {ecoBadge.name}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <p className="font-medium">{profile?.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  <Button onClick={() => setEditing(true)} className="w-full">
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Stats */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-eco-secondary" />
                <span>Environmental Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-eco-secondary mb-2">
                  {stats.co2Saved}kg
                </div>
                <p className="text-muted-foreground">
                  CO₂ saved by buying second-hand! 🌍
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stats.totalSales}
                  </div>
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stats.totalPurchases}
                  </div>
                  <p className="text-sm text-muted-foreground">Items Purchased</p>
                </div>
                {stats.totalReviews > 0 && (
                  <>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="text-2xl font-bold text-primary">
                          {stats.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {stats.totalReviews}
                      </div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-accent" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.totalPurchases > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <p className="font-medium">Eco Shopper</p>
                      <p className="text-sm text-muted-foreground">
                        Made your first sustainable purchase
                      </p>
                    </div>
                  </div>
                )}
                {stats.totalSales > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💚</span>
                    <div>
                      <p className="font-medium">Sustainability Advocate</p>
                      <p className="text-sm text-muted-foreground">
                        Started selling sustainable products
                      </p>
                    </div>
                  </div>
                )}
                {stats.co2Saved >= 10 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-medium">Planet Protector</p>
                      <p className="text-sm text-muted-foreground">
                        Saved 10kg+ of CO₂ emissions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;