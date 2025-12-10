import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Heart, User, MapPin, Clock, CheckCircle2, Truck, LogOut } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { User as UserType, Order } from '../App';

interface UserDashboardProps {
  onNavigate?: (page: string) => void;
  user: UserType | null;
  orders: Order[];
  onLogout?: () => void;
}

export function UserDashboard({ onNavigate, user, orders, onLogout }: UserDashboardProps) {
  const savedDesigns = [
    { id: '1', name: 'My Custom Suit', image: 'https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3N8ZW58MXx8fHwxNzYwMjYyNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', date: '2025-10-08' },
    { id: '2', name: 'Embroidered Design', image: 'https://images.unsplash.com/photo-1720982892111-5e78b01b3ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJ5JTIwZGV0YWlsfGVufDF8fHx8MTc2MDI2MjQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080', date: '2025-10-06' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your orders and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base">{user?.name || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    Saved Designs
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Addresses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  <div className="pt-4 border-t border-border mt-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={onLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="designs">Saved Designs</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                      <Button 
                        className="bg-primary hover:bg-primary/90 rounded-full"
                        onClick={() => onNavigate?.('products')}
                      >
                        Browse Products
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => {
                    const orderDate = new Date(order.date);
                    const trackingSteps = [
                      { status: 'Order Placed', date: orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), completed: true },
                      { status: 'Processing', date: orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), completed: order.status !== 'Processing' || order.status === 'Processing' },
                      { status: 'In Transit', date: order.status === 'In Transit' || order.status === 'Delivered' ? new Date(orderDate.getTime() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending', completed: order.status === 'In Transit' || order.status === 'Delivered' },
                      { status: 'Delivered', date: order.status === 'Delivered' ? new Date(orderDate.getTime() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Expected in 3-5 days', completed: order.status === 'Delivered' },
                    ];
                    
                    return (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                        <div>
                          <h3 className="text-base mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Placed on {orderDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={order.status === 'Delivered' ? 'default' : 'outline'}
                            className={order.status === 'Delivered' ? 'bg-primary' : ''}
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            PKR {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="flex gap-3 mb-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="w-20 h-24 rounded-lg overflow-hidden bg-muted">
                            {item.image.startsWith('data:image') ? (
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
                        ))}
                        <div className="flex-1 flex items-center">
                          <div>
                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm mb-1">
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tracking */}
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="mb-3 flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Order Tracking
                        </h4>
                        <div className="space-y-3">
                          {trackingSteps.map((track, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="relative">
                                {track.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-primary" />
                                ) : (
                                  <Clock className="w-5 h-5 text-muted-foreground" />
                                )}
                                {index < trackingSteps.length - 1 && (
                                  <div 
                                    className={`absolute left-1/2 top-6 w-0.5 h-6 -translate-x-1/2 ${
                                      track.completed ? 'bg-primary' : 'bg-border'
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${track.completed ? '' : 'text-muted-foreground'}`}>
                                  {track.status}
                                </p>
                                <p className="text-xs text-muted-foreground">{track.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 rounded-full">
                          View Details
                        </Button>
                        {order.status === 'Delivered' && (
                          <Button variant="outline" size="sm" className="flex-1 rounded-full">
                            Order Again
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                    );
                  })
                )}
              </TabsContent>

              {/* Saved Designs Tab */}
              <TabsContent value="designs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedDesigns.map((design) => (
                    <Card key={design.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                        <ImageWithFallback
                          src={design.image}
                          alt={design.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-base mb-1">{design.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Saved on {new Date(design.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-primary hover:bg-primary/90 rounded-full"
                            onClick={() => onNavigate?.('customize')}
                          >
                            Edit Design
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 rounded-full"
                          >
                            Order Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
