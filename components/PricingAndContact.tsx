'use client';

import { useContent } from '@/lib/content-context';
import { Phone, Mail, MessageCircle, DollarSign, CreditCard, Clock } from 'lucide-react';
import { useState } from 'react';

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
  const [showInstallments, setShowInstallments] = useState(false);

  // Use global settings if no specific price provided
  const shouldShowPrices = content.globalSettings.pricing.showPricesGlobally;
  
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
  const hasInstallments = finalPrice.installments?.available && finalPrice.installments?.plans.length > 0;

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

        {hasInstallments && (
          <div>
            <button
              onClick={() => setShowInstallments(!showInstallments)}
              className="flex items-center gap-2 text-secondary font-semibold hover:underline"
            >
              <CreditCard className="w-4 h-4" />
              View Payment Plans
            </button>
            
            {showInstallments && (
              <div className="mt-3 space-y-2">
                {finalPrice.installments?.plans.map((plan, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {plan.months} months
                    </span>
                    <span className="font-semibold text-primary">
                      ${plan.monthlyAmount}/month
                    </span>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  Payment plans available upon enrollment. Contact us for more details.
                </p>
              </div>
            )}
          </div>
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
        window.open(`tel:${settings.phone || settings.globalPhone}`, '_self');
        break;
      case 'email':
        const emailSubject = `Inquiry about IBMP Fellowship${courseText}`;
        window.open(`mailto:${settings.email || settings.globalEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`, '_self');
        break;
      case 'whatsapp':
        const whatsappNumber = (settings.whatsapp || settings.globalWhatsapp).replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        break;
    }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="flex flex-col gap-2">
          {content.globalSettings.counselor.contactMethods.includes('whatsapp') && (
            <button
              onClick={() => handleContact('whatsapp')}
              className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
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
            {method === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
            {settings.buttonText || settings.defaultButtonText}
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
            <span>Call: {settings.phone || settings.globalPhone}</span>
          </button>
        )}
        
        {content.globalSettings.counselor.contactMethods.includes('email') && (
          <button
            onClick={() => handleContact('email')}
            className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email: {settings.email || settings.globalEmail}</span>
          </button>
        )}
        
        {content.globalSettings.counselor.contactMethods.includes('whatsapp') && (
          <button
            onClick={() => handleContact('whatsapp')}
            className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp: {settings.whatsapp || settings.globalWhatsapp}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Combined component for course pages
export function CoursePricingAndContact({ course }: { course: any }) {
  return (
    <div className="space-y-6">
      <PricingDisplay price={course.pricing} courseName={course.name} />
      <CounselorContact counselor={course.counselorContact} courseName={course.name} />
    </div>
  );
}