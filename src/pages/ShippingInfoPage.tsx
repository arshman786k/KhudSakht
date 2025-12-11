import { ArrowLeft, Package, Truck, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface ShippingInfoPageProps {
  onBack: () => void;
}

export function ShippingInfoPage({ onBack }: ShippingInfoPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about KhudSakht's delivery services
          </p>
        </div>

        {/* Shipping Overview */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Standard Delivery</h3>
              <p className="text-2xl font-bold text-primary mb-1">10-14 Days</p>
              <p className="text-sm text-muted-foreground">For custom orders</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Rush Delivery</h3>
              <p className="text-2xl font-bold text-primary mb-1">7-10 Days</p>
              <p className="text-sm text-muted-foreground">Extra PKR 1,000</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Ready-to-Wear</h3>
              <p className="text-2xl font-bold text-primary mb-1">3-5 Days</p>
              <p className="text-sm text-muted-foreground">In-stock items</p>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Delivery Timeline */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Delivery Timeline</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Processing (1-2 Days)</h3>
                  <p className="text-muted-foreground text-sm">
                    Your order is confirmed, payment is verified, and design specifications are sent to our master tailors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tailoring (5-7 Days)</h3>
                  <p className="text-muted-foreground text-sm">
                    Our skilled craftsmen carefully cut, stitch, and assemble your custom outfit with attention to every detail.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quality Check (1-2 Days)</h3>
                  <p className="text-muted-foreground text-sm">
                    Each garment undergoes rigorous inspection for stitching quality, measurements, and finishing before packaging.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Shipping (3-5 Days)</h3>
                  <p className="text-muted-foreground text-sm">
                    Your order is packaged securely and shipped via our trusted courier partners with real-time tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Locations */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Delivery Locations
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Major Cities (3-4 Days)</h3>
                <p className="text-muted-foreground text-sm">
                  Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Other Cities (4-5 Days)</h3>
                <p className="text-muted-foreground text-sm">
                  We deliver to all cities and towns across Pakistan through our courier network.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Remote Areas (5-7 Days)</h3>
                <p className="text-muted-foreground text-sm">
                  Additional time may be required for remote locations. Contact us for specific delivery estimates.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Costs */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Shipping Costs</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Orders above PKR 5,000</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Orders below PKR 5,000</span>
                <span>PKR 200</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Rush Delivery (7-10 days)</span>
                <span>+ PKR 1,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Remote Areas Surcharge</span>
                <span>PKR 300</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Free shipping applies automatically at checkout when your order qualifies. Rush delivery must be selected during checkout.
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
            <p className="text-muted-foreground mb-4">
              Once your order is shipped, you'll receive:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Email notification with tracking number and courier details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>SMS updates on order status and estimated delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Real-time tracking in your Dashboard under "My Orders"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Call from courier before delivery attempt</span>
              </li>
            </ul>
          </div>

          {/* Delivery Partners */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Courier Partners</h2>
            <p className="text-muted-foreground mb-4">
              We work with Pakistan's most reliable courier services to ensure safe and timely delivery:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="font-semibold">TCS</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="font-semibold">Leopards</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="font-semibold">M&P</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="font-semibold">Swyft</p>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Packaging</h2>
            <p className="text-muted-foreground mb-4">
              Your custom outfit deserves premium packaging:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Garments are steam-pressed and wrapped in tissue paper</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Packed in sturdy, weather-resistant boxes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Includes care instructions and thank you note</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Premium gift wrapping available for PKR 300</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Shipping Questions?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground">+92 300 1234567</p>
                <p className="text-xs text-muted-foreground">Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground">shipping@khudsakht.pk</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
