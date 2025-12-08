import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Filter, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ProductListingPageProps {
  onNavigate?: (page: string, productId?: string) => void;
}

export function ProductListingPage({ onNavigate }: ProductListingPageProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const products = [
    { id: '1', name: 'Elegant Formal Dress', price: 4500, category: 'Formal', image: 'https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', customizable: true },
    { id: '2', name: 'Traditional Embroidered Suit', price: 6200, category: 'Traditional', image: 'https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', customizable: true },
    { id: '3', name: 'Premium Fabric Collection', price: 3800, category: 'Casual', image: 'https://images.unsplash.com/photo-1701964619775-b18422290cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjB0ZXh0aWxlJTIwcGF0dGVybnxlbnwxfHx8fDE3NjAyMzk4NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', customizable: true },
    { id: '4', name: 'Embroidery Special', price: 5500, category: 'Traditional', image: 'https://images.unsplash.com/photo-1720982892111-5e78b01b3ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJ5JTIwZGV0YWlsfGVufDF8fHx8MTc2MDI2MjQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080', customizable: true },
    { id: '5', name: 'Summer Cotton Dress', price: 2900, category: 'Casual', image: 'https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', customizable: false },
    { id: '6', name: 'Party Wear Collection', price: 7800, category: 'Formal', image: 'https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', customizable: true },
  ];

  const categories = ['All', 'Formal', 'Traditional', 'Casual', 'Party Wear'];
  const fabrics = ['Cotton', 'Silk', 'Lawn', 'Chiffon', 'Velvet'];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Shop Collection</h1>
          <p className="text-muted-foreground">Browse our complete range of customizable fashion</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3>Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox id={category} />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Fabric Type */}
                  <div>
                    <h4 className="mb-3">Fabric Type</h4>
                    <div className="space-y-2">
                      {fabrics.map((fabric) => (
                        <label key={fabric} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox id={fabric} />
                          <span className="text-sm">{fabric}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="mb-3">Price Range</h4>
                    <Slider
                      min={0}
                      max={10000}
                      step={500}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>PKR {priceRange[0]}</span>
                      <span>PKR {priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Customizable Only */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox id="customizable" />
                      <span className="text-sm">Customizable Only</span>
                    </label>
                  </div>

                  <Button variant="outline" className="w-full">
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <p className="text-muted-foreground text-sm">
                Showing {products.length} products
              </p>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                  onClick={() => onNavigate?.('product', product.id)}
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-base mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <p className="text-primary">PKR {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {product.customizable && (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate?.('customize');
                          }}
                        >
                          Customize
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`${product.customizable ? 'flex-1' : 'w-full'} rounded-full`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.('product', product.id);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
