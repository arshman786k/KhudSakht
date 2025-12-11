import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Palette, Truck, Shield } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

interface HomePageProps {
  onNavigate?: (page: Page, productId?: string) => void;
  isAuthenticated?: boolean;
}

export function HomePage({ onNavigate, isAuthenticated }: HomePageProps) {
  const handleAction = (page: Page, productId?: string) => {
    if (!isAuthenticated) {
      onNavigate?.('auth');
    } else {
      onNavigate?.(page, productId);
    }
  };
  const featuredProducts = [
    {
      id: '1',
      name: 'Elegant Formal Dress',
      price: 'PKR 4,500',
      image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_800,f_auto,q_auto/elegant-formal-dress',
      customizable: true,
    },
    {
      id: '2',
      name: 'Traditional Embroidered Suit',
      price: 'PKR 6,200',
      image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_800,f_auto,q_auto/traditional-embroidered-suit',
      customizable: true,
    },
    {
      id: '3',
      name: 'Premium Fabric Collection',
      price: 'PKR 3,800',
      image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_800,f_auto,q_auto/premium-fabric-collection',
      customizable: true,
    },
    {
      id: '4',
      name: 'Embroidery Special',
      price: 'PKR 5,500',
      image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_800,f_auto,q_auto/embroidery-special',
      customizable: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0Q0QTVBNSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/90">New Collection 2025</Badge>
            <h1 className="text-5xl md:text-6xl mb-6">
              Design Your <br />
              <span className="text-primary">Dream Outfit</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Choose from our premium fabrics, customize colors, and add your unique embroidery designs. Make it truly yours.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 rounded-full"
                onClick={() => handleAction('customize')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Customizing
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
                onClick={() => handleAction('products')}
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3>Custom Design</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Personalize every detail of your outfit
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>
              <h3>Premium Fabrics</h3>
              <p className="text-muted-foreground text-sm mt-2">
                High-quality materials for lasting comfort
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3>Fast Delivery</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Quick shipping across Pakistan
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3>Secure Payment</h3>
              <p className="text-muted-foreground text-sm mt-2">
                JazzCash & Easypaisa supported
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Featured Designs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked collection of trending designs. Each piece can be customized to match your style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => handleAction('product', product.id)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.customizable && (
                  <Badge className="absolute top-3 right-3 bg-primary">
                    Customizable
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-base mb-1">{product.name}</h3>
                <p className="text-primary">{product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full"
            onClick={() => handleAction('products')}
          >
            View All Products
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Create Your Unique Style?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust KhudSakht for their custom fashion needs.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 rounded-full"
            onClick={() => handleAction('customize')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Designing Now
          </Button>
        </div>
      </section>
    </div>
  );
}
