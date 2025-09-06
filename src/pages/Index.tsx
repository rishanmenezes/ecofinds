import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, ShoppingCart, Users, Heart, Star, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-eco-secondary/20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-eco shadow-eco animate-bounce-gentle">
                <Leaf className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                EcoFinds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              The sustainable second-hand marketplace where every purchase helps save the planet 🌍
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              {user ? (
                <Link to="/feed">
                  <Button size="lg" className="text-lg px-8 py-4">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Join the Movement
                  </Button>
                </Link>
              )}
              <Link to="/feed">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose EcoFinds?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a community of eco-conscious shoppers making a real difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-gentle hover:shadow-eco transition-shadow animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-eco-secondary/20">
                  <Leaf className="h-8 w-8 text-eco-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground">
                Give pre-loved items a second chance and reduce landfill waste
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card shadow-gentle hover:shadow-eco transition-shadow animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-eco-secondary/20">
                  <TrendingUp className="h-8 w-8 text-eco-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-muted-foreground">
                Find quality items at fraction of retail prices
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card shadow-gentle hover:shadow-eco transition-shadow animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-eco-secondary/20">
                  <Users className="h-8 w-8 text-eco-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-muted-foreground">
                Shop with confidence using our rating and review system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Together, We're Making an Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6">
                <div className="text-4xl font-bold text-eco-secondary mb-2">2,540kg</div>
                <p className="text-muted-foreground">CO₂ Emissions Saved</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-eco-secondary mb-2">1,250+</div>
                <p className="text-muted-foreground">Items Given New Life</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-eco-secondary mb-2">850+</div>
                <p className="text-muted-foreground">Happy Eco-Warriors</p>
              </div>
            </div>
            <div className="bg-gradient-eco rounded-lg p-8 text-primary-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Every Purchase Makes a Difference
              </h3>
              <p className="text-lg opacity-90">
                When you buy second-hand, you're not just saving money – you're helping reduce manufacturing demand, 
                saving natural resources, and creating a more sustainable future for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
