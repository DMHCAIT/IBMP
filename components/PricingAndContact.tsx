'use client';

import { useContent } from '@/lib/content-context';
import { Phone, Mail, DollarSign, ShoppingCart, MessageCircle } from 'lucide-react';
import { Course } from '@/lib/content-data';

interface PricingDisplayProps {
  price?: {
    amount: number;
    currency: string;
    displayPrice: string;
    installments?: {
      available: boolean;
      plans: { months: number; monthlyAmount: number }[];
    };
  };
  courseName?: string;
  className?: string;
}

interface CounselorContactProps {
  counselor?: {
    enabled: boolean;
    phone?: string;
    email?: string;
    whatsapp?: string;
    buttonText: string;
  };
  courseName?: string;
  className?: string;
  variant?: 'button' | 'card' | 'floating';
}

export function PricingDisplay({ price, courseName, className = '' }: PricingDisplayProps) {
  const { content } = useContent();
  

  // Use global settings if no specific price provided
  const shouldShowPrices = content.globalSettings.pricing.showPricesGlobally;

  const handlePayNow = () => {
    // This would redirect to your payment gateway
    // For now, redirect to admission page with course info
    const params = new URLSearchParams({
      course: courseName || 'Fellowship Program',
      amount: price?.amount.toString() || '0'
    });
    window.location.href = `/admission?${params.toString()}`;
  };
  
  if (!shouldShowPrices && !price) {
    return null;
  }

  // Provide default pricing structure if missing
  const defaultPrice = {
    amount: 0,
    currency: 'USD',
    displayPrice: 'Contact for Price',
    installments: {
      available: false,
      plans: []
    }
  };

  const finalPrice = price || defaultPrice;
  const displayPrice = finalPrice.displayPrice;
  

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Course Investment</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-1">{displayPrice}</div>
          {finalPrice.amount > 0 && (
            <p className="text-gray-600 text-sm">Complete program fee</p>
          )}
        </div>

        {/* Apply Now Button */}
        {finalPrice.amount > 0 && (
          <button
            onClick={handlePayNow}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}

export function CounselorContact({ counselor, courseName, className = '', variant = 'card' }: CounselorContactProps) {
  const { content } = useContent();
  
  // Use counselor-specific settings or fall back to global settings
  const globalSettings = content.globalSettings.counselor;
  
  // Provide defaults for counselor settings
  const defaultCounselor = {
    enabled: true,
    phone: globalSettings.globalPhone,
    email: globalSettings.globalEmail,
    whatsapp: globalSettings.globalWhatsapp,
    buttonText: globalSettings.defaultButtonText
  };
  
  const settings = counselor || defaultCounselor;
  
  if (!settings.enabled) {
    return null;
  }

  const handleContact = (method: 'phone' | 'email' | 'whatsapp') => {
    const courseText = courseName ? ` regarding ${courseName}` : '';
    const message = `Hello! I'm interested in learning more about IBMP Fellowship programs${courseText}. Could you please provide me with more information?`;
    
    switch (method) {
      case 'phone':
        window.open(`tel:${settings.phone || globalSettings.globalPhone}`, '_self');
        break;
      case 'email':
        const emailSubject = `Inquiry about IBMP Fellowship${courseText}`;
        window.open(`mailto:${settings.email || globalSettings.globalEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`, '_self');
        break;
      case 'whatsapp':
        const whatsappNumber = (settings.whatsapp || globalSettings.globalWhatsapp).replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        break;
    }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="flex flex-col gap-3">
          {content.globalSettings.counselor.contactMethods.includes('whatsapp') && (
            <button
              onClick={() => handleContact('whatsapp')}
              className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
              title="Chat on WhatsApp"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 .01 5.373.01 12 0 13.99.467 15.9 1.36 17.62L0 24l6.55-1.36A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.8c-1.6 0-3.17-.42-4.53-1.21l-.32-.18-3.89.81.83-3.79-.21-.33A9.8 9.8 0 012.2 12c0-5.43 4.41-9.84 9.84-9.84 2.63 0 5.1 1.03 6.96 2.9A9.8 9.8 0 0121.8 12c0 5.43-4.41 9.8-9.8 9.8zm5.36-7.04c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.16-.2.31-.77 1.02-.95 1.22-.18.2-.36.22-.65.08-.28-.14-1.19-.43-2.29-1.37-.83-.74-1.39-1.66-1.55-1.95-.16-.29-.02-.45.12-.59.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.03-.5-.08-.14-.72-1.74-1-2.39-.27-.62-.55-.54-.75-.55-.2-.01-.38-.01-.58-.01-.19 0-.5.07-.76.36-.26.29-1.01 1-1.01 2.43 0 1.42 1.01 2.8 1.15 3 .14.2 2 3.05 4.84 4.28.68.29 1.23.46 1.65.59.69.22 1.32.19 1.82.11.55-.08 1.7-.69 1.94-1.36.23-.67.23-1.25.16-1.37-.08-.13-.29-.21-.59-.36z" />
              </svg>
            </button>
          )}
          
          {content.globalSettings.counselor.contactMethods.includes('phone') && (
            <button
              onClick={() => handleContact('phone')}
              className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              title="Call Us"
            >
              <Phone className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {content.globalSettings.counselor.contactMethods.map((method) => (
          <button
            key={method}
            onClick={() => handleContact(method)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-600 transition-colors"
          >
            {method === 'phone' && <Phone className="w-4 h-4" />}
            {method === 'email' && <Mail className="w-4 h-4" />}
            {method === 'whatsapp' && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 .01 5.373.01 12 0 13.99.467 15.9 1.36 17.62L0 24l6.55-1.36A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.8c-1.6 0-3.17-.42-4.53-1.21l-.32-.18-3.89.81.83-3.79-.21-.33A9.8 9.8 0 012.2 12c0-5.43 4.41-9.84 9.84-9.84 2.63 0 5.1 1.03 6.96 2.9A9.8 9.8 0 0121.8 12c0 5.43-4.41 9.8-9.8 9.8zm5.36-7.04c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.16-.2.31-.77 1.02-.95 1.22-.18.2-.36.22-.65.08-.28-.14-1.19-.43-2.29-1.37-.83-.74-1.39-1.66-1.55-1.95-.16-.29-.02-.45.12-.59.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.03-.5-.08-.14-.72-1.74-1-2.39-.27-.62-.55-.54-.75-.55-.2-.01-.38-.01-.58-.01-.19 0-.5.07-.76.36-.26.29-1.01 1-1.01 2.43 0 1.42 1.01 2.8 1.15 3 .14.2 2 3.05 4.84 4.28.68.29 1.23.46 1.65.59.69.22 1.32.19 1.82.11.55-.08 1.7-.69 1.94-1.36.23-.67.23-1.25.16-1.37-.08-.13-.29-.21-.59-.36z" />
              </svg>
            )}
            {settings.buttonText || globalSettings.defaultButtonText}
          </button>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-gradient-to-br from-secondary to-primary text-white rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Phone className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold">Need Guidance?</h3>
      </div>
      
      <p className="text-white/90 mb-4">
        Speak with our education counselor for personalized program guidance and enrollment support.
      </p>
      
      <div className="space-y-2">
        {content.globalSettings.counselor.contactMethods.includes('phone') && (
          <button
            onClick={() => handleContact('phone')}
            className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {settings.phone || globalSettings.globalPhone}</span>
          </button>
        )}
        
        {content.globalSettings.counselor.contactMethods.includes('email') && (
          <button
            onClick={() => handleContact('email')}
            className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email: {settings.email || globalSettings.globalEmail}</span>
          </button>
        )}
        
        {content.globalSettings.counselor.contactMethods.includes('whatsapp') && (
          <button
            onClick={() => handleContact('whatsapp')}
            className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp: {settings.whatsapp || globalSettings.globalWhatsapp}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Combined component for course pages
export function CoursePricingAndContact({ course }: { course: Course }) {
  return (
    <div className="space-y-6">
      <PricingDisplay price={course.pricing} courseName={course.name} />
      <CounselorContact counselor={course.counselorContact} courseName={course.name} />
    </div>
  );
}