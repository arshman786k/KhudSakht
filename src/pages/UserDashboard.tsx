import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Package, Heart, User, MapPin, Clock, CheckCircle2, Truck, LogOut } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { User as UserType, Order, SavedDesign } from '../App';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface UserDashboardProps {
  onNavigate?: (page: Page) => void;
  user: UserType | null;
  orders: Order[];
  savedDesigns: SavedDesign[];
  addresses: Address[];
  onEditDesign?: (design: SavedDesign) => void;
  onOrderDesign?: (design: SavedDesign) => void;
  onSaveAddress?: (address: Omit<Address, 'id'>) => Promise<void>;
  onDeleteAddress?: (id: string) => Promise<void>;
  onUpdateProfile?: (data: { name: string; phone: string }) => Promise<void>;
  onLogout: () => void;
  onBack?: () => void;
}

export function UserDashboard({ onNavigate, user, orders, savedDesigns, addresses = [], onEditDesign, onOrderDesign, onSaveAddress, onDeleteAddress, onUpdateProfile, onLogout, onBack }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState('');
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    isDefault: false,
  });

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
                  <Button 
                    variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </Button>
                  <Button 
                    variant={activeTab === 'designs' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('designs')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Saved Designs
                  </Button>
                  <Button 
                    variant={activeTab === 'addresses' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('addresses')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Addresses
                  </Button>
                  <Button 
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-4">
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="designs">Saved Designs</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
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
                {savedDesigns.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl mb-2">No Saved Designs Yet</h3>
                      <p className="text-muted-foreground mb-6">Create and save custom designs to see them here</p>
                      <Button 
                        className="bg-primary hover:bg-primary/90 rounded-full"
                        onClick={() => onNavigate?.('customize')}
                      >
                        Create Design
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
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
                            onClick={() => onEditDesign?.(design)}
                          >
                            Edit Design
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 rounded-full"
                            onClick={() => onOrderDesign?.(design)}
                          >
                            Order Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                )}
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">My Addresses</h2>
                  <Button onClick={() => setIsAddingAddress(true)}>
                    + Add New Address
                  </Button>
                </div>

                {isAddingAddress && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Address Label</Label>
                          <Input 
                            placeholder="Home, Office, etc."
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Full Name</Label>
                          <Input 
                            placeholder="John Doe"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input 
                            placeholder="03XX XXXXXXX"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Street Address</Label>
                          <Input 
                            placeholder="House# Street# Area"
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input 
                            placeholder="Karachi, Lahore, etc."
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Postal Code</Label>
                          <Input 
                            placeholder="75500"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={async () => {
                            if (onSaveAddress) {
                              await onSaveAddress(addressForm);
                              setIsAddingAddress(false);
                              setAddressForm({
                                label: '',
                                fullName: '',
                                phone: '',
                                address: '',
                                city: '',
                                postalCode: '',
                                isDefault: false,
                              });
                            }
                          }}
                        >
                          Save Address
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {addresses.length === 0 && !isAddingAddress ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl mb-2">No Addresses Saved</h3>
                      <p className="text-muted-foreground mb-6">Add your delivery addresses for faster checkout</p>
                      <Button onClick={() => setIsAddingAddress(true)}>
                        Add First Address
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <Card key={addr.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant={addr.isDefault ? 'default' : 'outline'}>
                                {addr.label}
                              </Badge>
                              {addr.isDefault && (
                                <Badge variant="secondary" className="ml-2">Default</Badge>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onDeleteAddress?.(addr.id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <h4 className="font-medium">{addr.fullName}</h4>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {addr.address}, {addr.city} - {addr.postalCode}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input 
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          disabled={!editingProfile}
                        />
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input 
                          value={user?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input 
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          disabled={!editingProfile}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        {!editingProfile ? (
                          <Button onClick={() => setEditingProfile(true)}>
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={async () => {
                                if (onUpdateProfile) {
                                  await onUpdateProfile({
                                    name: profileName,
                                    phone: profilePhone,
                                  });
                                  setEditingProfile(false);
                                }
                              }}
                            >
                              Save Changes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setProfileName(user?.name || '');
                                setEditingProfile(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
