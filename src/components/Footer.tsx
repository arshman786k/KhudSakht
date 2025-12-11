import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth' | 'about' | 'faq' | 'shipping' | 'returns' | 'sizeguide';

interface FooterProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">KS</span>
              </div>
              <span>KhudSakht</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Design your dream outfit with our custom fashion platform. Quality fabrics, expert craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('products')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('customize')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Customize
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('faq')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shipping')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('returns')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('sizeguide')} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@khudsakht.pk</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 KhudSakht. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
