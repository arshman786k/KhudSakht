import { ArrowLeft, Award, Users, Sparkles, Heart } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
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

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">About KhudSakht</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Where tradition meets innovation. We bring you the power to design your perfect Pakistani outfit with modern technology and expert craftsmanship.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              KhudSakht empowers you to create custom Pakistani traditional wear that reflects your unique style. We combine cutting-edge 3D customization technology with traditional tailoring excellence to deliver outfits that are truly yours.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              From selecting premium fabrics to choosing intricate designs, every step of your journey with us is crafted to give you complete creative control while ensuring the highest quality standards.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">3D Customization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visualize your design in real-time with our advanced 3D preview technology
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Premium Quality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use only the finest fabrics and materials for lasting comfort and elegance
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Expert Craftsmen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Skilled tailors with decades of experience bring your vision to life
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Customer First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your satisfaction is our priority with hassle-free returns and support
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Founded in Lahore, Pakistan, KhudSakht was born from a simple belief: everyone deserves to wear clothes that are uniquely theirs. We saw how traditional tailoring, while beautiful, often left customers unable to fully visualize their choices until the final product arrived.
              </p>
              <p className="text-lg leading-relaxed">
                That's why we created KhudSakht - meaning "Self-Made" in Urdu. Our platform bridges the gap between imagination and reality, letting you design, customize, and visualize your perfect outfit before a single stitch is made.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve customers across Pakistan, helping them celebrate life's special moments in outfits that truly represent who they are. Every shalwar kameez, every kurta, every dupatta tells a story - and we're honored to help you tell yours.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-bold text-2xl mb-4">Authenticity</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We stay true to traditional Pakistani craftsmanship while embracing modern innovation.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-bold text-2xl mb-4">Excellence</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every garment undergoes rigorous quality checks to meet our high standards.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-bold text-2xl mb-4">Innovation</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We continuously improve our technology to give you the best design experience.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto text-center bg-primary/5 border border-primary/20 rounded-xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Have Questions?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            We'd love to hear from you. Reach out to our team for any inquiries or support.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:info@khudsakht.pk"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              Email Us
            </a>
            <a
              href="tel:+923001234567"
              className="px-8 py-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-lg font-medium"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
