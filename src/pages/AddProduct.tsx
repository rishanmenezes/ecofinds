import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Furniture',
  'Other'
];

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl = '';
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { error } = await supabase
        .from('products')
        .insert({
          title,
          description,
          category,
          price: parseFloat(price),
          image_url: imageUrl,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Product listed! 🌱",
        description: "Your sustainable product is now live on the marketplace",
      });

      navigate('/my-listings');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-eco">
        <CardHeader>
          <CardTitle className="text-2xl">List a Sustainable Product</CardTitle>
          <p className="text-muted-foreground">
            Give your pre-loved items a new life and help reduce waste! 🌍
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product's condition, features, and sustainability story..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {image ? image.name : 'Click to upload image'}
                    </p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Listing Product...' : 'List Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;