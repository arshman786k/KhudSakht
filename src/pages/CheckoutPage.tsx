import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CheckCircle2, CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { CartItem, Order } from '../App';

interface CheckoutPageProps {
  onNavigate?: (page: string) => void;
  cartItems: CartItem[];
  onPlaceOrder: (shippingInfo: Order['shippingInfo'], paymentMethod: string) => void;
}

export function CheckoutPage({ onNavigate, cartItems, onPlaceOrder }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Shipping form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shipping;

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      toast.error('First Name is required');
      return false;
    }
    if (!lastName.trim()) {
      toast.error('Last Name is required');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid Email is required');
      return false;
    }
    if (!phone.trim()) {
      toast.error('Phone Number is required');
      return false;
    }
    if (!address.trim()) {
      toast.error('Street Address is required');
      return false;
    }
    if (!city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!postal.trim()) {
      toast.error('Postal Code is required');
      return false;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }
    
    onPlaceOrder(
      {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postal,
      },
      paymentMethod
    );
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onNavigate?.('dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      className="mt-1" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      className="mt-1" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="mt-1" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+92 300 1234567" 
                      className="mt-1" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      placeholder="House # 123, Street Name" 
                      className="mt-1" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Lahore" 
                      className="mt-1" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input 
                      id="postal" 
                      placeholder="54000" 
                      className="mt-1" 
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Payment Method</h3>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <label 
                      htmlFor="jazzcash"
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'jazzcash' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="jazzcash" id="jazzcash" />
                      <Smartphone className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p>JazzCash</p>
                        <p className="text-sm text-muted-foreground">Pay with JazzCash mobile wallet</p>
                      </div>
                    </label>

                    <label 
                      htmlFor="easypaisa"
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'easypaisa' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="easypaisa" id="easypaisa" />
                      <Smartphone className="w-6 h-6 text-secondary" />
                      <div className="flex-1">
                        <p>Easypaisa</p>
                        <p className="text-sm text-muted-foreground">Pay with Easypaisa mobile wallet</p>
                      </div>
                    </label>

                    <label 
                      htmlFor="cod"
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p>Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                {/* Payment Details */}
                {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <Tabs defaultValue="account" className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="account" className="flex-1">Mobile Account</TabsTrigger>
                        <TabsTrigger value="card" className="flex-1">Card</TabsTrigger>
                      </TabsList>
                      <TabsContent value="account" className="mt-4">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input 
                          id="mobile" 
                          placeholder="03XX XXXXXXX" 
                          className="mt-1 bg-input-background"
                        />
                        <Label htmlFor="pin" className="mt-3 block">MPIN</Label>
                        <Input 
                          id="pin" 
                          type="password" 
                          placeholder="Enter your MPIN" 
                          className="mt-1 bg-input-background"
                        />
                      </TabsContent>
                      <TabsContent value="card" className="mt-4">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="XXXX XXXX XXXX XXXX" 
                          className="mt-1 bg-input-background"
                        />
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              className="mt-1 bg-input-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              placeholder="XXX" 
                              className="mt-1 bg-input-background"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between text-sm">
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p>PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">{shipping === 0 ? 'Free' : `PKR ${shipping}`}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="text-primary">
                        PKR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 rounded-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              Order Placed Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <p>
              Order ID: <span className="text-primary">KS-{Math.floor(Math.random() * 10000)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
