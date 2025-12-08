import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, Sparkles, Star, Truck, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

import type { CartItem } from '../App';

interface ProductDetailPageProps {
  productId?: string;
  onNavigate?: (page: string) => void;
  onAddToCart?: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

export function ProductDetailPage({ onNavigate, onAddToCart }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: 'Elegant Formal Dress',
    price: 4500,
    rating: 4.8,
    reviews: 127,
    images: [
      'https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1701964619775-b18422290cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjB0ZXh0aWxlJTIwcGF0dGVybnxlbnwxfHx8fDE3NjAyMzk4NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    description: 'Elevate your wardrobe with this stunning formal dress. Crafted from premium fabric with intricate detailing, this piece combines traditional elegance with modern sophistication.',
    fabric: 'Premium Cotton Silk',
    colors: ['Cream', 'Rose Pink', 'Light Brown', 'Ivory'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    customizable: true,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-muted">
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.customizable && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    Customizable
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <p className="text-3xl text-primary mb-6">PKR {product.price.toLocaleString()}</p>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Fabric Info */}
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="mb-2">Fabric Details</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Material:</strong> {product.fabric}
                </p>
                <p className="text-sm text-muted-foreground">
                  Breathable, comfortable, and perfect for all seasons. Easy care and machine washable.
                </p>
              </CardContent>
            </Card>

            {/* Color Selection */}
            <div className="mb-6">
              <h4 className="mb-3">Available Colors</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h4 className="mb-3">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? 'bg-primary' : ''}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h4 className="mb-3">Quantity</h4>
              <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90 rounded-full"
                onClick={() => {
                  onAddToCart?.({
                    name: product.name,
                    price: product.price,
                    size: selectedSize,
                    color: 'Cream',
                    image: product.images[0],
                    customized: false,
                  });
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => onNavigate?.('customize')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Customizing
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders over PKR 3000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Customizable</p>
                  <p className="text-xs text-muted-foreground">Make it yours</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="fabric" className="flex-1">Fabric Care</TabsTrigger>
                <TabsTrigger value="size" className="flex-1">Size Guide</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This elegant formal dress is perfect for special occasions. The premium fabric drapes beautifully and the classic design ensures timeless appeal. Hand-finished details and quality stitching make this a wardrobe essential.
                </p>
              </TabsContent>
              <TabsContent value="fabric" className="mt-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Machine wash cold with similar colors</li>
                  <li>• Do not bleach or tumble dry</li>
                  <li>• Iron on medium heat if needed</li>
                  <li>• Dry clean for best results</li>
                </ul>
              </TabsContent>
              <TabsContent value="size" className="mt-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Measurements in inches:</p>
                  <ul className="space-y-1">
                    <li>• XS: Chest 32" | Waist 26" | Hip 34"</li>
                    <li>• S: Chest 34" | Waist 28" | Hip 36"</li>
                    <li>• M: Chest 36" | Waist 30" | Hip 38"</li>
                    <li>• L: Chest 38" | Waist 32" | Hip 40"</li>
                    <li>• XL: Chest 40" | Waist 34" | Hip 42"</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
