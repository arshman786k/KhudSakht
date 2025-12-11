import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type Page = 'home' | 'products' | 'product' | 'customize' | 'cart' | 'checkout' | 'dashboard' | 'auth';

interface HeaderProps {
  cartCount?: number;
  onNavigate?: (page: Page) => void;
  isLoggedIn?: boolean;
}

export function Header({ cartCount = 0, onNavigate, isLoggedIn = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">KS</span>
            </div>
            <span className="hidden sm:block">KhudSakht</span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search for designs, fabrics..." 
                className="pl-10 bg-input-background rounded-full"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              className="hidden md:flex"
              onClick={() => onNavigate?.(isLoggedIn ? 'products' : 'auth')}
            >
              Shop
            </Button>
            <Button 
              variant="ghost" 
              className="hidden md:flex"
              onClick={() => onNavigate?.(isLoggedIn ? 'customize' : 'auth')}
            >
              Customize
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate?.(isLoggedIn ? 'cart' : 'auth')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary">
                  {cartCount}
                </Badge>
              )}
            </Button>
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onNavigate?.('dashboard')}
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                variant="default"
                className="rounded-full"
                onClick={() => onNavigate?.('auth')}
              >
                Login
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search for designs, fabrics..." 
              className="pl-10 bg-input-background rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
