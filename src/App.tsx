import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomizationCanvas } from './pages/CustomizationCanvas';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserDashboard } from './pages/UserDashboard';
import { AuthPage } from './pages/AuthPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  fabric?: string;
  image: string;
  customized: boolean;
  customDetails?: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: CartItem[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal: string;
  };
  paymentMethod: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = (page: Page, productId?: string) => {
    if ((page === 'dashboard' || page === 'checkout') && !isLoggedIn) {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantity: 1,
    };
    
    setCartItems(prev => [...prev, newItem]);
    toast.success('Added to cart!', {
      description: 'Item has been added to your shopping cart.',
    });
  };
  
  const updateCartItemQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };
  
  const removeCartItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success('Item removed', {
      description: 'Item has been removed from your cart.',
    });
  };

  const handleLogin = (email: string, name?: string) => {
    setIsLoggedIn(true);
    setCurrentUser({
      name: name || email.split('@')[0],
      email: email,
    });
    toast.success('Welcome back!', {
      description: 'You have successfully logged in.',
    });
    setCurrentPage('home');
  };

  const handlePlaceOrder = (shippingInfo: Order['shippingInfo'], paymentMethod: string) => {
    const newOrder: Order = {
      id: `KS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'Processing',
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 
             (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 3000 ? 0 : 200),
      items: [...cartItems],
      shippingInfo,
      paymentMethod,
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    
    toast.success('Order placed successfully!', {
      description: `Order #${newOrder.id} has been placed.`,
    });
  };

  if (currentPage === 'auth') {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartCount={cartCount} 
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
      />
      
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigate} />
        )}
        {currentPage === 'products' && (
          <ProductListingPage onNavigate={navigate} />
        )}
        {currentPage === 'product' && (
          <ProductDetailPage 
            productId={selectedProductId}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'customize' && (
          <CustomizationCanvas 
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage 
            onNavigate={navigate}
            cartItems={cartItems}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeCartItem}
          />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage 
            onNavigate={navigate}
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
        {currentPage === 'dashboard' && (
          <UserDashboard 
            onNavigate={navigate}
            user={currentUser}
            orders={orders}
          />
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
