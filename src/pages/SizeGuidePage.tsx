import { ArrowLeft, Ruler, User } from 'lucide-react';

interface SizeGuidePageProps {
  onBack: () => void;
}

export function SizeGuidePage({ onBack }: SizeGuidePageProps) {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Size Guide</h1>
          <p className="text-xl text-muted-foreground">
            Find your perfect fit with our comprehensive size charts and measurement guide
          </p>
        </div>

        {/* How to Measure Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">How to Take Measurements</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-lg">General Tips</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use a flexible measuring tape, not a metal one</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Wear light clothing while measuring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keep the tape snug but not tight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Stand naturally with good posture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Have someone help you for accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Measure twice to confirm accuracy</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Key Measurements</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Chest/Bust</h4>
                    <p className="text-muted-foreground">Measure around the fullest part of chest, keeping tape level</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Waist</h4>
                    <p className="text-muted-foreground">Measure around natural waistline, just above belly button</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Hips</h4>
                    <p className="text-muted-foreground">Measure around the fullest part of hips and buttocks</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Shoulder Width</h4>
                    <p className="text-muted-foreground">Measure from one shoulder point to the other across back</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Arm Length</h4>
                    <p className="text-muted-foreground">Measure from shoulder to wrist with arm slightly bent</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pro Tip:</strong> If you're between sizes, we recommend going with the larger size for comfort. Our custom orders can be made to exact measurements for a perfect fit.
              </p>
            </div>
          </div>
        </div>

        {/* Men's Shalwar Kameez Size Chart */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Men's Shalwar Kameez</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Chest (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Waist (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Shoulder (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Arm Length (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Kameez Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">XS</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                    <td className="py-3 px-4 text-muted-foreground">28-30</td>
                    <td className="py-3 px-4 text-muted-foreground">16-17</td>
                    <td className="py-3 px-4 text-muted-foreground">23-24</td>
                    <td className="py-3 px-4 text-muted-foreground">37-38</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">30-32</td>
                    <td className="py-3 px-4 text-muted-foreground">17-18</td>
                    <td className="py-3 px-4 text-muted-foreground">24-25</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                    <td className="py-3 px-4 text-muted-foreground">32-34</td>
                    <td className="py-3 px-4 text-muted-foreground">18-19</td>
                    <td className="py-3 px-4 text-muted-foreground">25-26</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                    <td className="py-3 px-4 text-muted-foreground">19-20</td>
                    <td className="py-3 px-4 text-muted-foreground">26-27</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">20-21</td>
                    <td className="py-3 px-4 text-muted-foreground">27-28</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">2XL</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                    <td className="py-3 px-4 text-muted-foreground">21-22</td>
                    <td className="py-3 px-4 text-muted-foreground">28-29</td>
                    <td className="py-3 px-4 text-muted-foreground">46-48</td>
                  </tr>
                  <tr className="hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">3XL</td>
                    <td className="py-3 px-4 text-muted-foreground">46-48</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                    <td className="py-3 px-4 text-muted-foreground">22-23</td>
                    <td className="py-3 px-4 text-muted-foreground">29-30</td>
                    <td className="py-3 px-4 text-muted-foreground">48-50</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Shalwar Measurements (One Size Fits Most)</h4>
              <p className="text-sm text-muted-foreground">
                Standard shalwar includes drawstring waist (adjustable from 28" to 44") and length of 40-42 inches. Custom lengths available upon request.
              </p>
            </div>
          </div>
        </div>

        {/* Women's Shalwar Kameez Size Chart */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Women's Shalwar Kameez</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Bust (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Waist (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Hips (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Shoulder (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Kameez Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">XS</td>
                    <td className="py-3 px-4 text-muted-foreground">32-34</td>
                    <td className="py-3 px-4 text-muted-foreground">24-26</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                    <td className="py-3 px-4 text-muted-foreground">14-15</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                    <td className="py-3 px-4 text-muted-foreground">26-28</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">15-16</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">28-30</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                    <td className="py-3 px-4 text-muted-foreground">16-17</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                    <td className="py-3 px-4 text-muted-foreground">30-32</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                    <td className="py-3 px-4 text-muted-foreground">17-18</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                    <td className="py-3 px-4 text-muted-foreground">32-34</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                    <td className="py-3 px-4 text-muted-foreground">18-19</td>
                    <td className="py-3 px-4 text-muted-foreground">46-48</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">2XL</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                    <td className="py-3 px-4 text-muted-foreground">19-20</td>
                    <td className="py-3 px-4 text-muted-foreground">48-50</td>
                  </tr>
                  <tr className="hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">3XL</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">46-48</td>
                    <td className="py-3 px-4 text-muted-foreground">20-21</td>
                    <td className="py-3 px-4 text-muted-foreground">50-52</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Dupatta</h4>
                <p className="text-sm text-muted-foreground">
                  Standard dupatta dimensions: 2.5 yards length × 1 yard width. Available in matching or contrasting fabrics.
                </p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Shalwar</h4>
                <p className="text-sm text-muted-foreground">
                  Adjustable drawstring waist fits waist sizes 26" to 40". Standard length 38-40 inches. Custom lengths available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kurta Size Chart */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Men's Kurta (Short)</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Chest (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Shoulder (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Arm Length (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Kurta Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">S</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                    <td className="py-3 px-4 text-muted-foreground">17-18</td>
                    <td className="py-3 px-4 text-muted-foreground">24-25</td>
                    <td className="py-3 px-4 text-muted-foreground">28-30</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">M</td>
                    <td className="py-3 px-4 text-muted-foreground">38-40</td>
                    <td className="py-3 px-4 text-muted-foreground">18-19</td>
                    <td className="py-3 px-4 text-muted-foreground">25-26</td>
                    <td className="py-3 px-4 text-muted-foreground">30-32</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">L</td>
                    <td className="py-3 px-4 text-muted-foreground">40-42</td>
                    <td className="py-3 px-4 text-muted-foreground">19-20</td>
                    <td className="py-3 px-4 text-muted-foreground">26-27</td>
                    <td className="py-3 px-4 text-muted-foreground">32-34</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">XL</td>
                    <td className="py-3 px-4 text-muted-foreground">42-44</td>
                    <td className="py-3 px-4 text-muted-foreground">20-21</td>
                    <td className="py-3 px-4 text-muted-foreground">27-28</td>
                    <td className="py-3 px-4 text-muted-foreground">34-36</td>
                  </tr>
                  <tr className="hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">2XL</td>
                    <td className="py-3 px-4 text-muted-foreground">44-46</td>
                    <td className="py-3 px-4 text-muted-foreground">21-22</td>
                    <td className="py-3 px-4 text-muted-foreground">28-29</td>
                    <td className="py-3 px-4 text-muted-foreground">36-38</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Custom Measurements */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Custom Measurements?</h2>
            <p className="text-muted-foreground mb-6">
              For the perfect fit, provide your exact measurements during checkout. Our expert tailors will create a garment specifically for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Watch Measurement Video
              </button>
              <a
                href="mailto:custom@khudsakht.pk"
                className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Ask Our Team
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Sizing FAQs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What if I'm between sizes?</h3>
                <p className="text-sm text-muted-foreground">
                  We recommend choosing the larger size for comfort. For custom orders, you can provide exact measurements for a perfect fit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change measurements after ordering?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can modify measurements within 24 hours of placing your order. After that, tailoring begins and changes cannot be made.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What if my outfit doesn't fit?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer one free alteration within 30 days if there's an error in our tailoring. Visit our Returns page for complete policy details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are sizes consistent across all garments?</h3>
                <p className="text-sm text-muted-foreground">
                  Our sizes follow standard Pakistani sizing. However, fit may vary slightly based on fabric type and style. Always check the specific size chart for each garment type.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
