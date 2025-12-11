import { ArrowLeft, RotateCcw, AlertCircle, CheckCircle, Package, Clock } from 'lucide-react';

interface ReturnsPageProps {
  onBack: () => void;
}

export function ReturnsPage({ onBack }: ReturnsPageProps) {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchange Policy</h1>
          <p className="text-xl text-muted-foreground">
            We want you to love your KhudSakht outfit. If you're not satisfied, we're here to help.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">7 Days</h3>
              <p className="text-sm text-muted-foreground">Return window for eligible items</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Free Exchange</h3>
              <p className="text-sm text-muted-foreground">On manufacturing defects</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Easy Process</h3>
              <p className="text-sm text-muted-foreground">Simple return steps</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Ready-to-Wear Returns */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready-to-Wear Items</h2>
                <p className="text-muted-foreground">Returns accepted within 7 days of delivery</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Eligibility Criteria:</h3>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Items must be unworn, unwashed, and in original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All original tags, labels, and packaging must be intact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>No signs of wear, alterations, or damage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Return initiated within 7 days of delivery date</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <p className="text-sm">
                  <strong>Refund Method:</strong> Full refund to original payment method within 7-10 business days after item inspection.
                </p>
              </div>
            </div>
          </div>

          {/* Custom-Made Returns */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Custom-Made Items</h2>
                <p className="text-muted-foreground">Limited returns - only for manufacturing defects</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Returns Accepted For:</h3>
              <ul className="space-y-2 text-muted-foreground ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Wrong Item:</strong> You received a different design than ordered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Defective Stitching:</strong> Poor quality workmanship or loose stitching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Fabric Issues:</strong> Damaged, torn, or significantly different from preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Measurement Errors:</strong> We made a mistake in cutting/stitching your measurements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Color Mismatch:</strong> Significantly different from what was shown in your design</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>Important:</strong> Custom items made to your specifications cannot be returned due to:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Change of mind or style preference</li>
                  <li>• Incorrect measurements provided by customer</li>
                  <li>• Minor color variations due to screen/lighting</li>
                  <li>• Normal fabric characteristics (texture, drape)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Exchange Policy</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We offer exchanges for size or fitting issues on custom-made items:
              </p>
              <ul className="space-y-3 text-muted-foreground ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>One Free Alteration:</strong> Within 30 days of delivery for measurement issues on our end</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Size Exchange:</strong> Ready-to-wear items can be exchanged for different size (subject to availability)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Partner Tailors:</strong> Visit our partner locations for quick alterations</span>
                </li>
              </ul>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Lahore</h4>
                  <p className="text-sm text-muted-foreground">MM Alam Road, Gulberg III</p>
                </div>
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Karachi</h4>
                  <p className="text-sm text-muted-foreground">Tariq Road, PECHS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Customer Service</h3>
                  <p className="text-muted-foreground text-sm">
                    Email returns@khudsakht.pk or call +92 300 1234567 within 7 days of delivery. Provide your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Get Return Authorization</h3>
                  <p className="text-muted-foreground text-sm">
                    Our team will review your request and provide a Return Authorization (RA) number and return instructions via email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Package Your Item</h3>
                  <p className="text-muted-foreground text-sm">
                    Pack the item securely in original packaging if possible. Include the RA number and original invoice inside the package.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ship or Drop Off</h3>
                  <p className="text-muted-foreground text-sm">
                    Use our prepaid return label (for defects) or ship at your cost. You can also drop off at our Lahore or Karachi locations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">5</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Receive Refund</h3>
                  <p className="text-muted-foreground text-sm">
                    Once we receive and inspect your return, refund will be processed within 7-10 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Non-Returnable Items</h2>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <span>Items marked as "Final Sale" or purchased during clearance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <span>Gift cards and digital products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <span>Items that have been worn, washed, altered, or damaged by customer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <span>Items without original tags or packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <span>Custom embroidery or special personalization</span>
              </li>
            </ul>
          </div>

          {/* Refund Timeline */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Refund Timeline</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Item Received & Inspected</span>
                <span className="text-muted-foreground">1-2 days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Refund Initiated</span>
                <span className="text-muted-foreground">1-2 days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-medium">Bank Processing (Card/Online)</span>
                <span className="text-muted-foreground">5-7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">JazzCash/Easypaisa Refund</span>
                <span className="text-muted-foreground">1-3 days</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> COD orders will be refunded via bank transfer. Please provide your bank details when initiating the return.
              </p>
            </div>
          </div>

        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Returns?</h2>
          <p className="text-muted-foreground mb-6">
            Our customer service team is ready to assist you with any return or exchange queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:returns@khudsakht.pk"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email Returns Team
            </a>
            <a
              href="tel:+923001234567"
              className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Call: +92 300 1234567
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Available Mon-Sat, 9:00 AM - 6:00 PM PKT
          </p>
        </div>
      </div>
    </div>
  );
}
