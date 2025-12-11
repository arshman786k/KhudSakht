import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, Sparkles, Star, Truck, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import type { CartItem } from '../App';

interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number;
  reviews?: number;
  images: string[];
  description: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  customizable: boolean;
  category?: string;
}

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

interface ProductDetailPageProps {
  productId?: string;
  onNavigate?: (page: Page) => void;
  onAddToCart?: (item: Omit<CartItem, 'id'>) => void;
  onBack?: () => void;
}

export function ProductDetailPage({ productId, onNavigate, onAddToCart, onBack }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock products data with Cloudinary images
  const mockProducts: Record<string, Product> = {
    '1': {
      id: '1',
      name: 'Elegant Formal Dress',
      price: 4500,
      rating: 4.8,
      reviews: 127,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/elegant-formal-dress',
      ],
      description: 'Step into sophistication with our Elegant Formal Dress, designed for the modern woman who values both style and grace. This exquisite piece features a timeless silhouette crafted from premium cotton silk blend that drapes beautifully. The dress showcases delicate embroidery details along the neckline and sleeves, adding a touch of refinement. Perfect for weddings, formal dinners, and special occasions where you want to make a lasting impression. The breathable fabric ensures all-day comfort while maintaining an elegant appearance.',
      fabric: 'Premium Cotton Silk',
      colors: ['Cream', 'Rose Pink', 'Light Brown', 'Ivory'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      customizable: true,
      category: 'Formal',
    },
    '2': {
      id: '2',
      name: 'Traditional Embroidered Suit',
      price: 6200,
      rating: 4.9,
      reviews: 93,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/traditional-embroidered-suit',
      ],
      description: 'Embrace your cultural heritage with our Traditional Embroidered Suit, a masterpiece of intricate craftsmanship. This stunning three-piece ensemble features elaborate embroidery work with traditional motifs that celebrate our rich textile heritage. Hand-embellished with thread work, sequins, and beadwork, each piece tells a story of skilled artistry. The premium lawn fabric ensures comfort even during long festivities. Ideal for weddings, Eid celebrations, and traditional gatherings. The dupatta features delicate border work that complements the kameez beautifully.',
      fabric: 'Premium Lawn',
      colors: ['Red', 'Pink', 'Maroon', 'Orange'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      customizable: true,
      category: 'Traditional',
    },
    '3': {
      id: '3',
      name: 'Premium Fabric Collection',
      price: 3800,
      rating: 4.7,
      reviews: 156,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/premium-fabric-collection',
      ],
      description: 'Discover our Premium Fabric Collection, perfect for those who appreciate quality textiles and want to create their own custom pieces. This exclusive collection features high-grade cotton with unique geometric and traditional patterns woven into the fabric. The material is pre-washed and treated for colorfastness, ensuring lasting beauty. With a soft hand-feel and excellent drape, this fabric is ideal for creating both casual wear and semi-formal outfits. Each piece is carefully selected for its superior quality and timeless design. Bring your creative vision to life with this versatile fabric.',
      fabric: 'Premium Cotton',
      colors: ['Black', 'Grey', 'Navy', 'Brown'],
      sizes: ['One Size'],
      customizable: true,
      category: 'Casual',
    },
    '4': {
      id: '4',
      name: 'Embroidery Special',
      price: 5500,
      rating: 4.8,
      reviews: 84,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/embroidery-special',
      ],
      description: 'Our Embroidery Special is a celebration of fine needlework and artistic expression. This luxurious outfit features an all-over embroidered pattern with delicate threadwork that creates a mesmerizing visual effect. The premium chiffon fabric provides an ethereal flow while maintaining structure. Intricate floral and paisley motifs are carefully embroidered using premium threads, creating depth and texture. The neckline is adorned with additional embellishment for added glamour. Perfect for festive occasions, mehendi ceremonies, and evening events where you want to showcase traditional elegance with contemporary flair.',
      fabric: 'Premium Chiffon',
      colors: ['Purple', 'Wine', 'Plum', 'Lavender'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      customizable: true,
      category: 'Traditional',
    },
    '5': {
      id: '5',
      name: 'Summer Cotton Dress',
      price: 2900,
      rating: 4.6,
      reviews: 201,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/summer-cotton-dress',
      ],
      description: 'Beat the heat in style with our Summer Cotton Dress, designed for ultimate comfort during warm days. Made from 100% pure cotton, this dress offers exceptional breathability and moisture-wicking properties. The relaxed fit ensures easy movement while the minimalist design makes it perfect for everyday wear. Features a flattering A-line silhouette with subtle gathering at the waist. The dress includes practical side pockets and a comfortable neckline. Machine washable and easy to care for, this is your go-to piece for casual outings, shopping trips, or relaxed home wear.',
      fabric: 'Pure Cotton',
      colors: ['White', 'Sky Blue', 'Mint', 'Peach'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      customizable: false,
      category: 'Casual',
    },
    '6': {
      id: '6',
      name: 'Party Wear Collection',
      price: 7800,
      rating: 4.9,
      reviews: 67,
      images: [
        'https://res.cloudinary.com/dmqcpclos/image/upload/c_limit,w_600,f_auto,q_auto/party-wear-collection',
      ],
      description: 'Make an unforgettable entrance with our Party Wear Collection, where luxury meets contemporary design. This opulent ensemble features rich velvet fabric that exudes sophistication and glamour. The outfit is adorned with premium embellishments including crystals, sequins, and beadwork that catch the light beautifully. The structured silhouette flatters all body types while the plush fabric provides both comfort and elegance. Intricate embroidery patterns add depth and visual interest. Perfect for cocktail parties, wedding receptions, and high-profile events. Comes with a matching embellished dupatta to complete the look.',
      fabric: 'Premium Velvet',
      colors: ['Black', 'Navy', 'Emerald', 'Royal Blue'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      customizable: true,
      category: 'Party Wear',
    },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      // Immediately load from mock data (instant)
      const mockProduct = mockProducts[productId];
      if (mockProduct) {
        setProduct(mockProduct);
        setSelectedColor(mockProduct.colors[0] || '');
        setLoading(false);
      } else {
        // If not in mock data, try Firestore
        try {
          const productRef = doc(db, 'products', productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
            const data = productDoc.data() as Product;
            setProduct({ ...data, id: productDoc.id });
            setSelectedColor(data.colors[0] || '');
          } else {
            toast.error('Product not found');
            onNavigate?.('products');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Product not found</p>
          <Button onClick={() => onNavigate?.('products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mb-6 -ml-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        )}
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
                        i < Math.floor(product.rating || 0)
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
                  <Badge 
                    key={color} 
                    variant="outline" 
                    className={`cursor-pointer transition-colors ${
                      selectedColor === color 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
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
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </Button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(999, Math.max(1, val)));
                  }}
                  className="w-20 px-3 py-2 text-center border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(999, quantity + 1))}
                  disabled={quantity >= 999}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Button>
              </div>
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
                    color: selectedColor,
                    image: product.images[0],
                    customized: false,
                    quantity: quantity,
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
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="fabric" className="mt-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.fabric.includes('Cotton') && (
                    <>
                      <li>• Machine wash cold with similar colors</li>
                      <li>• Use mild detergent</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low or line dry</li>
                      <li>• Iron on medium heat if needed</li>
                    </>
                  )}
                  {product.fabric.includes('Silk') && (
                    <>
                      <li>• Dry clean recommended for best results</li>
                      <li>• Hand wash in cold water if needed</li>
                      <li>• Use silk-friendly detergent</li>
                      <li>• Do not wring or twist</li>
                      <li>• Iron on low heat with cloth barrier</li>
                      <li>• Store in breathable garment bag</li>
                    </>
                  )}
                  {product.fabric.includes('Lawn') && (
                    <>
                      <li>• Machine wash on gentle cycle</li>
                      <li>• Wash with similar colors</li>
                      <li>• Do not bleach</li>
                      <li>• Line dry in shade to prevent fading</li>
                      <li>• Iron while slightly damp for best results</li>
                      <li>• Dry clean for heavy embroidery</li>
                    </>
                  )}
                  {product.fabric.includes('Chiffon') && (
                    <>
                      <li>• Dry clean only recommended</li>
                      <li>• Hand wash gently if absolutely needed</li>
                      <li>• Use cold water and mild detergent</li>
                      <li>• Do not wring, press between towels</li>
                      <li>• Hang dry away from direct sunlight</li>
                      <li>• Steam iron on lowest setting</li>
                    </>
                  )}
                  {product.fabric.includes('Velvet') && (
                    <>
                      <li>• Professional dry cleaning strongly recommended</li>
                      <li>• Do not wash at home</li>
                      <li>• Brush gently with soft brush to maintain pile</li>
                      <li>• Steam to remove wrinkles, do not iron directly</li>
                      <li>• Store hanging to prevent crushing</li>
                      <li>• Keep away from moisture and humidity</li>
                    </>
                  )}
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
