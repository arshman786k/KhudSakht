import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPage({ onBack }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does the 3D customization work?",
      answer: "Our 3D customization tool lets you visualize your outfit in real-time. Simply select your preferred garment type (shalwar kameez, kurta, etc.), choose from various fabrics, colors, and design patterns. You can rotate and view the garment from all angles before placing your order. Your design is saved and sent directly to our master tailors."
    },
    {
      question: "What fabrics do you offer?",
      answer: "We offer a premium selection of fabrics including Cotton, Lawn, Silk, Khaddar, Linen, Karandi, Cambric, and Velvet. Each fabric is carefully sourced for quality and comfort. The 3D preview shows you how each fabric drapes and looks, helping you make the perfect choice for any season or occasion."
    },
    {
      question: "How long does it take to receive my custom outfit?",
      answer: "Standard delivery takes 10-14 business days from order confirmation. This includes 5-7 days for expert tailoring and quality checks, plus 3-5 days for delivery across Pakistan. Rush orders (7-10 days) are available for an additional fee. You'll receive tracking information once your order ships."
    },
    {
      question: "Can I save my designs and order later?",
      answer: "Yes! Once you create an account, all your custom designs are automatically saved in your dashboard. You can access them anytime from the 'Saved Designs' section, make modifications, or place an order whenever you're ready. Your designs are stored securely and never expire."
    },
    {
      question: "What sizes are available?",
      answer: "We offer sizes from XS to 3XL for ready-to-wear items. For custom orders, you can provide your exact measurements during checkout. Our Size Guide page has detailed measurement instructions to ensure a perfect fit. If you're unsure, our customer service team can help you determine your size."
    },
    {
      question: "Do you offer custom measurements?",
      answer: "Absolutely! For custom-made outfits, you can provide detailed measurements including chest, waist, hips, shoulder width, arm length, kameez length, and shalwar length. We also offer a video guide on how to take accurate measurements. Our tailors will craft your outfit to your exact specifications."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods for your convenience: Credit/Debit Cards (Visa, Mastercard) through Payfast, JazzCash, Easypaisa, and Cash on Delivery (COD). All online transactions are secured with industry-standard encryption. COD is available for orders under PKR 15,000."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 24 hours of placement at no charge. After 24 hours, once tailoring has begun, cancellation includes a 30% processing fee. Modifications may not be possible once cutting starts. Contact our customer service immediately if you need to make changes."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for ready-to-wear items in unworn, unused condition with original tags. Custom-made items can be returned only if there's a manufacturing defect or error on our part. Please refer to our Returns page for detailed policy information and the return process."
    },
    {
      question: "Do you ship outside Pakistan?",
      answer: "Currently, we only ship within Pakistan to all major cities and rural areas. International shipping is coming soon! Sign up for our newsletter to be notified when we start international deliveries. We're working on bringing KhudSakht to the global Pakistani community."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status anytime from your Dashboard under 'My Orders'. The tracking shows real-time updates including: Order Confirmed, In Tailoring, Quality Check, Shipped, and Delivered."
    },
    {
      question: "Are the colors accurate in the 3D preview?",
      answer: "We strive for maximum color accuracy in our 3D preview. However, actual colors may vary slightly due to screen calibration, lighting, and fabric texture. If color accuracy is critical for your event, we recommend ordering a fabric swatch (available for PKR 200) before placing your full order."
    },
    {
      question: "Can I order matching outfits for family events?",
      answer: "Yes! We specialize in coordinated outfits for weddings, Eid, and family gatherings. You can use the same design across multiple orders or create complementary designs. Contact us for bulk order discounts on 5+ outfits. We ensure all matching pieces are made from the same fabric batch."
    },
    {
      question: "What if my outfit doesn't fit properly?",
      answer: "For custom measurements, we offer one free alteration within 30 days of delivery if the fit isn't perfect. Simply visit one of our partner tailors or return the item to us. If the error is on our end, we'll cover all alteration and shipping costs. Your satisfaction is our priority."
    },
    {
      question: "Do you offer gift wrapping or gift cards?",
      answer: "Yes! We offer premium gift wrapping for PKR 300, which includes an elegant gift box, tissue paper, and a personalized message card. Digital gift cards are available in denominations from PKR 2,000 to PKR 20,000. Gift cards are delivered instantly via email and never expire."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about KhudSakht's custom fashion experience
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-primary/50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-accent/20 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@khudsakht.pk"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email Support
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
