import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Filter, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  fabric?: string;
  image: string;
  customizable: boolean;
  description?: string;
  createdAt?: Date;
}

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

interface ProductListingPageProps {
  onNavigate?: (page: Page, productId?: string) => void;
  onBack?: () => void;
}

export function ProductListingPage({ onNavigate, onBack }: ProductListingPageProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Formal', 'Traditional', 'Casual', 'Party Wear'];
  const fabrics = ['Cotton', 'Silk', 'Lawn', 'Chiffon', 'Velvet'];

  // Load mock data immediately for fast initial render
  useEffect(() => {
    // Immediately set mock data (optimized Cloudinary URLs with smaller size)
    const mockProducts: Product[] = [
      { id: '1', name: 'Elegant Formal Dress', price: 4500, category: 'Formal', fabric: 'Silk', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/elegant-formal-dress', customizable: true },
      { id: '2', name: 'Traditional Embroidered Suit', price: 6200, category: 'Traditional', fabric: 'Lawn', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/traditional-embroidered-suit', customizable: true },
      { id: '3', name: 'Premium Fabric Collection', price: 3800, category: 'Casual', fabric: 'Cotton', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/premium-fabric-collection', customizable: true },
      { id: '4', name: 'Embroidery Special', price: 5500, category: 'Traditional', fabric: 'Chiffon', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/embroidery-special', customizable: true },
      { id: '5', name: 'Summer Cotton Dress', price: 2900, category: 'Casual', fabric: 'Cotton', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/summer-cotton-dress', customizable: false },
      { id: '6', name: 'Party Wear Collection', price: 7800, category: 'Party Wear', fabric: 'Velvet', image: 'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_400,f_auto,q_auto/party-wear-collection', customizable: true },
    ];
    
    setProducts(mockProducts);
    setLoading(false);

    // Optionally fetch from Firestore in background (non-blocking)
    const fetchFromFirestore = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        if (!snapshot.empty) {
          const fetchedProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
        // Keep using mock data on error
      }
    };

    // Fetch in background without blocking UI
    fetchFromFirestore();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Fabric filter
    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Customizable only filter
    if (customizableOnly) {
      filtered = filtered.filter(p => p.customizable);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategories, selectedFabrics, priceRange, customizableOnly, sortBy]);

  // Handle category change
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (category === 'All') {
      setSelectedCategories(checked ? ['All'] : []);
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(c => c !== 'All');
        return checked 
          ? [...filtered, category]
          : filtered.filter(c => c !== category);
      });
    }
  };

  // Handle fabric change
  const handleFabricChange = (fabric: string, checked: boolean) => {
    setSelectedFabrics(prev => 
      checked 
        ? [...prev, fabric]
        : prev.filter(f => f !== fabric)
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setPriceRange([0, 10000]);
    setCustomizableOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="mb-4 -ml-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Button>
          )}
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
                          <Checkbox 
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked: boolean) => handleCategoryChange(category, checked)}
                          />
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
                          <Checkbox 
                            id={fabric}
                            checked={selectedFabrics.includes(fabric)}
                            onCheckedChange={(checked: boolean) => handleFabricChange(fabric, checked)}
                          />
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
                      <Checkbox 
                        id="customizable"
                        checked={customizableOnly}
                        onCheckedChange={(checked: boolean) => setCustomizableOnly(checked)}
                      />
                      <span className="text-sm">Customizable Only</span>
                    </label>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={resetFilters}
                  >
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
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <Button onClick={resetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                          onClick={(e: React.MouseEvent) => {
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
                        onClick={(e: React.MouseEvent) => {
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
