import { useState, useEffect } from 'react';
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
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ShippingInfoPage } from './pages/ShippingInfoPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { auth, db } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, orderBy, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth' | 'about' | 'faq' | 'shipping' | 'returns' | 'sizeguide';

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

export interface SavedDesign {
  id: string;
  name: string;
  image: string;
  date: string;
  customDetails?: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ page: Page; productId?: string }>>([{ page: 'home' }]);
  const [pageBeforeAuth, setPageBeforeAuth] = useState<{ page: Page; productId?: string } | null>(null);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        setCurrentUser({
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        });
        
        // Load user's orders, cart, saved designs, and addresses from Firestore
        await loadUserOrders(user.uid);
        await loadUserCart(user.uid);
        await loadSavedDesigns(user.uid);
        await loadAddresses(user.uid);
        
        // If on auth page after login, go back to page before auth
        if (currentPage === 'auth' && pageBeforeAuth) {
          setCurrentPage(pageBeforeAuth.page);
          if (pageBeforeAuth.productId) {
            setSelectedProductId(pageBeforeAuth.productId);
          }
          setPageBeforeAuth(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setCurrentUser(null);
        setOrders([]);
        setCartItems([]);
        setSavedDesigns([]);
        setAddresses([]);
      }
    });

    return () => unsubscribe();
  }, [currentPage, pageBeforeAuth]);

  // Load orders from Firestore
  const loadUserOrders = async (uid: string) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userOrders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userOrders.push({
          id: data.orderId,
          date: data.date,
          status: data.status,
          total: data.total,
          items: data.items,
          shippingInfo: data.shippingInfo,
          paymentMethod: data.paymentMethod,
        });
      });
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Load cart from Firestore
  const loadUserCart = async (uid: string) => {
    try {
      const cartDocRef = doc(db, 'carts', uid);
      const cartDoc = await getDoc(cartDocRef);
      
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        setCartItems(cartData.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Save cart to Firestore
  const saveCartToFirestore = async (items: CartItem[]) => {
    if (!userId) return;
    
    try {
      const cartDocRef = doc(db, 'carts', userId);
      await setDoc(cartDocRef, {
        items,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Clear cart from Firestore
  const clearCartFromFirestore = async () => {
    if (!userId) return;
    
    try {
      const cartDocRef = doc(db, 'carts', userId);
      await deleteDoc(cartDocRef);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Load saved designs from Firestore
  const loadSavedDesigns = async (uid: string) => {
    try {
      const designsRef = collection(db, 'savedDesigns');
      const q = query(
        designsRef,
        where('userId', '==', uid)
      );
      
      const querySnapshot = await getDocs(q);
      const designs: SavedDesign[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        designs.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          date: data.date,
          customDetails: data.customDetails,
        });
      });
      
      // Sort in memory instead of Firestore
      designs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSavedDesigns(designs);
    } catch (error) {
      console.error('Error loading saved designs:', error);
    }
  };

  // Edit saved design
  const handleEditDesign = (design: SavedDesign) => {
    setSelectedDesign(design);
    navigate('customize');
  };

  // Order saved design
  const handleOrderSavedDesign = (design: SavedDesign) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: design.name,
      price: 4500, // Base price for custom design
      quantity: 1,
      size: 'Custom Fit',
      fabric: design.customDetails || 'Custom Fabric',
      customDetails: design.customDetails,
      image: design.image,
      customized: true,
    };
    
    setCartItems(prev => {
      const updatedCart = [...prev, newItem];
      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
    toast.success('Added to cart!', {
      description: 'Saved design added to your shopping cart.',
    });
    navigate('cart');
  };

  // Save design to Firestore
  const handleSaveDesign = async (design: { name: string; image: string; customDetails?: string }) => {
    if (!userId || !isLoggedIn) {
      toast.error('Please login to save designs');
      return;
    }

    try {
      const designData = {
        userId,
        name: design.name,
        image: design.image,
        customDetails: design.customDetails || '',
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'savedDesigns'), designData);
      
      const newDesign: SavedDesign = {
        id: docRef.id,
        name: design.name,
        image: design.image,
        date: designData.date,
        customDetails: design.customDetails,
      };

      setSavedDesigns(prev => [newDesign, ...prev]);
      
      toast.success('Design saved!', {
        description: 'Your custom design has been saved to your dashboard.',
      });
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save design', {
        description: 'Please try again.',
      });
    }
  };

  // Load addresses from Firestore
  const loadAddresses = async (uid: string) => {
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', uid));
      
      const querySnapshot = await getDocs(q);
      const userAddresses: Address[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userAddresses.push({
          id: doc.id,
          label: data.label,
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          isDefault: data.isDefault || false,
        });
      });
      
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  // Save address to Firestore
  const handleSaveAddress = async (address: Omit<Address, 'id'>) => {
    if (!userId) return;

    try {
      const addressData = {
        userId,
        ...address,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'addresses'), addressData);
      
      const newAddress: Address = {
        id: docRef.id,
        ...address,
      };

      setAddresses(prev => [...prev, newAddress]);
      
      toast.success('Address saved!', {
        description: 'Your address has been added successfully.',
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address', {
        description: 'Please try again.',
      });
    }
  };

  // Delete address from Firestore
  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'addresses', id));
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      
      toast.success('Address deleted', {
        description: 'Address has been removed.',
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  // Update user profile in Firestore
  const handleUpdateProfile = async (data: { name: string; phone: string }) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        name: data.name,
        phone: data.phone,
        updatedAt: new Date(),
      }, { merge: true });

      setCurrentUser(prev => prev ? { ...prev, name: data.name } : null);
      
      toast.success('Profile updated!', {
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again.',
      });
    }
  };

  const navigate = (page: Page, productId?: string) => {
    // Handle footer navigation - map string to Page type
    const pageMap: Record<string, Page> = {
      'about': 'about',
      'faq': 'faq',
      'shipping': 'shipping',
      'returns': 'returns',
      'sizeguide': 'sizeguide',
    };
    
    const targetPage = typeof page === 'string' && pageMap[page] ? pageMap[page] : page;
    
    if ((targetPage === 'dashboard' || targetPage === 'checkout') && !isLoggedIn) {
      // Save current page before showing auth
      setPageBeforeAuth({ page: currentPage, productId: selectedProductId });
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(targetPage);
    if (productId) {
      setSelectedProductId(productId);
    }
    
    // Add to navigation history (exclude auth page)
    if (targetPage !== 'auth') {
      setNavigationHistory(prev => [...prev, { page: targetPage, productId }]);
    }
    
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      // Remove current page
      const newHistory = [...navigationHistory];
      newHistory.pop();
      
      // Get previous page
      const previousPage = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage.page);
      
      if (previousPage.productId) {
        setSelectedProductId(previousPage.productId);
      }
      
      window.scrollTo(0, 0);
    }
  };

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setCartItems(prev => {
      const updatedCart = [...prev, newItem];
      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
    toast.success('Added to cart!', {
      description: `${item.quantity} item(s) added to your shopping cart.`,
    });
  };
  
  const updateCartItemQuantity = (id: string, change: number) => {
    setCartItems(items => {
      const updatedItems = items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
      saveCartToFirestore(updatedItems);
      return updatedItems;
    });
  };
  
  const removeCartItem = (id: string) => {
    setCartItems(items => {
      const updatedItems = items.filter(item => item.id !== id);
      saveCartToFirestore(updatedItems);
      return updatedItems;
    });
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

  const handleLogout = async () => {
    try {
      // Don't clear cart - it should persist in Firestore
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserId(null);
      setCartItems([]); // Clear from local state only
      setOrders([]);
      setSavedDesigns([]);
      setAddresses([]);
      setCurrentPage('home');
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout', {
        description: 'Please try again.',
      });
    }
  };

  const handlePlaceOrder = async (shippingInfo: Order['shippingInfo'], paymentMethod: string) => {
    if (!currentUser || !userId) {
      toast.error('Please login to place an order');
      return;
    }

    const orderId = `KS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 
             (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 3000 ? 0 : 200),
      items: [...cartItems],
      shippingInfo,
      paymentMethod,
    };

    try {
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        orderId,
        userId,
        userEmail: currentUser.email,
        date: newOrder.date,
        status: newOrder.status,
        total: newOrder.total,
        items: newOrder.items,
        shippingInfo: newOrder.shippingInfo,
        paymentMethod: newOrder.paymentMethod,
        createdAt: new Date(),
      });

      setOrders(prev => [newOrder, ...prev]);
      
      // Clear cart from both local state and Firestore after successful checkout
      setCartItems([]);
      await clearCartFromFirestore();
      
      toast.success('Order placed successfully!', {
        description: `Order #${newOrder.id} has been placed.`,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order', {
        description: 'Please try again later.',
      });
    }
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
          <HomePage onNavigate={navigate} isAuthenticated={isLoggedIn} />
        )}
        {currentPage === 'products' && (
          <ProductListingPage onNavigate={navigate} onBack={goBack} />
        )}
        {currentPage === 'product' && (
          <ProductDetailPage 
            productId={selectedProductId}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onBack={goBack}
          />
        )}
        {currentPage === 'customize' && (
          <CustomizationCanvas 
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onSaveDesign={handleSaveDesign}
            selectedDesign={selectedDesign}
            onBack={goBack}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage 
            onNavigate={navigate}
            cartItems={cartItems}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeCartItem}
            onBack={goBack}
          />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage 
            onNavigate={navigate}
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
            onBack={goBack}
          />
        )}
        {currentPage === 'dashboard' && (
          <UserDashboard 
            onNavigate={navigate}
            user={currentUser}
            orders={orders}
            savedDesigns={savedDesigns}
            addresses={addresses}
            onEditDesign={handleEditDesign}
            onOrderDesign={handleOrderSavedDesign}
            onSaveAddress={handleSaveAddress}
            onDeleteAddress={handleDeleteAddress}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onBack={goBack}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage onBack={goBack} />
        )}
        {currentPage === 'faq' && (
          <FAQPage onBack={goBack} />
        )}
        {currentPage === 'shipping' && (
          <ShippingInfoPage onBack={goBack} />
        )}
        {currentPage === 'returns' && (
          <ReturnsPage onBack={goBack} />
        )}
        {currentPage === 'sizeguide' && (
          <SizeGuidePage onBack={goBack} />
        )}
      </main>

      <Footer onNavigate={navigate} />
      <Toaster />
    </div>
  );
}
