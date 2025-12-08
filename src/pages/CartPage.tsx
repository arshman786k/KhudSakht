import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { CartItem } from '../App';

interface CartPageProps {
  onNavigate?: (page: string) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartPage({ onNavigate, cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) {

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some items to get started
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-full"
              onClick={() => onNavigate?.('products')}
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        {item.customized && item.image.startsWith('data:image') ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-base mb-1">{item.name}</h3>
                            {item.customized && (
                              <Badge variant="outline" className="text-xs mb-2">
                                Custom Design
                              </Badge>
                            )}
                            {item.customized ? (
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Size: {item.size || 'Custom Fit'}</p>
                                {item.fabric && <p>Fabric: {item.fabric}</p>}
                                {item.customDetails && (
                                  <p className="text-xs">{item.customDetails}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Size: {item.size} | Color: {item.color}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-primary">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        ) : (
                          `PKR ${shipping}`
                        )}
                      </span>
                    </div>
                    {subtotal < 3000 && (
                      <p className="text-xs text-muted-foreground">
                        Add PKR {(3000 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-3">
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
                    className="w-full bg-primary hover:bg-primary/90 rounded-full mb-3"
                    onClick={() => onNavigate?.('checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => onNavigate?.('products')}
                  >
                    Continue Shopping
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>✓ Secure Payment</p>
                      <p>✓ Easy Returns</p>
                      <p>✓ Fast Delivery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
