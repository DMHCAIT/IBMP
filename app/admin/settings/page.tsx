'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import EditorLayout, { SectionCard, InputField } from '@/components/admin/EditorLayout';
import { DollarSign, Phone, MessageCircle } from 'lucide-react';

export default function GlobalSettingsPage() {
  const { content, updateContent } = useContent();
  const [localContent, setLocalContent] = useState(content.globalSettings);

  const handleSave = () => {
    updateContent('globalSettings', localContent);
  };

  const handleReset = () => {
    setLocalContent(content.globalSettings);
  };

  const handleCoursesPricingUpdate = () => {
    // Update all courses with default pricing structure based on existing invoice prices
    const coursePricing: Record<string, number> = {
      'Emergency Medicine': 2500,
      'Internal Medicine': 2300,
      'Family Medicine / General Practice': 2000,
      'Pediatrics': 2200,
      'Surgery': 2800,
      'Obstetrics & Gynecology': 2700,
      'Psychiatry': 2100,
      'Anesthesiology': 2800,
      'Radiology': 2600,
      'Pathology': 2400,
      'Diabetology': 2200,
      'Critical Care': 3000,
      'Endocrinology': 2400,
      'Reproductive Medicine': 3200,
      'Neonatology': 2900,
      'Interventional Radiology': 2800,
    };

    const updatedCourses = { ...content.courses };

    // Update medical specialties
    updatedCourses.medicalSpecialties = content.courses.medicalSpecialties.map(course => ({
      ...course,
      pricing: {
        amount: coursePricing[course.name] || 2000,
        currency: 'USD',
        displayPrice: `$${(coursePricing[course.name] || 2000).toLocaleString()}`,
        installments: {
          available: true,
          plans: [
            { months: 3, monthlyAmount: Math.ceil((coursePricing[course.name] || 2000) / 3) },
            { months: 6, monthlyAmount: Math.ceil((coursePricing[course.name] || 2000) / 6) },
            { months: 12, monthlyAmount: Math.ceil((coursePricing[course.name] || 2000) / 12) }
          ]
        }
      },
      counselorContact: {
        enabled: localContent.counselor.enabled,
        phone: localContent.counselor.globalPhone,
        email: localContent.counselor.globalEmail,
        whatsapp: localContent.counselor.globalWhatsapp,
        buttonText: localContent.counselor.defaultButtonText
      }
    }));

    // Update super specialties
    updatedCourses.superSpecialties = content.courses.superSpecialties.map(course => ({
      ...course,
      pricing: {
        amount: coursePricing[course.name] || 2500,
        currency: 'USD',
        displayPrice: `$${(coursePricing[course.name] || 2500).toLocaleString()}`,
        installments: {
          available: true,
          plans: [
            { months: 3, monthlyAmount: Math.ceil((coursePricing[course.name] || 2500) / 3) },
            { months: 6, monthlyAmount: Math.ceil((coursePricing[course.name] || 2500) / 6) },
            { months: 12, monthlyAmount: Math.ceil((coursePricing[course.name] || 2500) / 12) }
          ]
        }
      },
      counselorContact: {
        enabled: localContent.counselor.enabled,
        phone: localContent.counselor.globalPhone,
        email: localContent.counselor.globalEmail,
        whatsapp: localContent.counselor.globalWhatsapp,
        buttonText: localContent.counselor.defaultButtonText
      }
    }));

    // Honorary fellowships remain free/contact for price
    updatedCourses.honoraryFellowship = content.courses.honoraryFellowship.map(course => ({
      ...course,
      pricing: {
        amount: 0,
        currency: 'USD',
        displayPrice: 'Contact for Details',
        installments: {
          available: false,
          plans: []
        }
      },
      counselorContact: {
        enabled: localContent.counselor.enabled,
        phone: localContent.counselor.globalPhone,
        email: localContent.counselor.globalEmail,
        whatsapp: localContent.counselor.globalWhatsapp,
        buttonText: 'Contact for Details'
      }
    }));

    updateContent('courses', updatedCourses);
    alert('All courses have been updated with pricing and counselor contact information!');
  };

  return (
    <EditorLayout
      title="Global Settings"
      description="Configure global pricing and counselor contact settings for all pages and courses"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Pricing Settings */}
      <SectionCard title="Global Pricing Settings" icon={<DollarSign className="w-5 h-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Default Currency"
            value={localContent.pricing.currency}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                pricing: { ...localContent.pricing, currency: value },
              })
            }
            placeholder="USD"
          />
          
          <InputField
            label="Currency Symbol"
            value={localContent.pricing.defaultCurrency}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                pricing: { ...localContent.pricing, defaultCurrency: value },
              })
            }
            placeholder="$"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Show Prices Globally</label>
            <select
              value={localContent.pricing.showPricesGlobally ? 'true' : 'false'}
              onChange={(e) =>
                setLocalContent({
                  ...localContent,
                  pricing: { ...localContent.pricing, showPricesGlobally: e.target.value === 'true' },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="true">Yes, show prices on all course pages</option>
              <option value="false">No, hide prices globally</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Display Format</label>
            <select
              value={localContent.pricing.priceDisplayFormat}
              onChange={(e) =>
                setLocalContent({
                  ...localContent,
                  pricing: { ...localContent.pricing, priceDisplayFormat: e.target.value as 'full' | 'starting-from' | 'contact-for-price' },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="full">Full price (e.g., $2,300)</option>
              <option value="starting-from">Starting from (e.g., Starting from $2,300)</option>
              <option value="contact-for-price">Contact for price</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Counselor Contact Settings */}
      <SectionCard title="Global Counselor Contact Settings" icon={<Phone className="w-5 h-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enable Counselor Contact</label>
            <select
              value={localContent.counselor.enabled ? 'true' : 'false'}
              onChange={(e) =>
                setLocalContent({
                  ...localContent,
                  counselor: { ...localContent.counselor, enabled: e.target.value === 'true' },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="true">Yes, show counselor contact options</option>
              <option value="false">No, hide counselor contact options</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Show on All Pages</label>
            <select
              value={localContent.counselor.showOnAllPages ? 'true' : 'false'}
              onChange={(e) =>
                setLocalContent({
                  ...localContent,
                  counselor: { ...localContent.counselor, showOnAllPages: e.target.value === 'true' },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="true">Yes, show on all pages</option>
              <option value="false">No, show only on course pages</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <InputField
            label="Global Phone Number"
            value={localContent.counselor.globalPhone}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                counselor: { ...localContent.counselor, globalPhone: value },
              })
            }
            placeholder="+1 3023020293"
          />
          
          <InputField
            label="Global Email"
            value={localContent.counselor.globalEmail}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                counselor: { ...localContent.counselor, globalEmail: value },
              })
            }
            placeholder="info@ibmpractitioner.us"
          />

          <InputField
            label="WhatsApp Number"
            value={localContent.counselor.globalWhatsapp}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                counselor: { ...localContent.counselor, globalWhatsapp: value },
              })
            }
            placeholder="+1 3023020293"
          />
        </div>

        <InputField
          label="Default Button Text"
          value={localContent.counselor.defaultButtonText}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              counselor: { ...localContent.counselor, defaultButtonText: value },
            })
          }
          placeholder="Talk to Counselor"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Contact Methods</label>
          <div className="flex flex-wrap gap-3">
            {['phone', 'email', 'whatsapp'].map((method) => (
              <label key={method} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={localContent.counselor.contactMethods.includes(method as 'phone' | 'email' | 'whatsapp')}
                  onChange={(e) => {
                    const methods = [...localContent.counselor.contactMethods];
                    if (e.target.checked) {
                      if (!methods.includes(method as 'phone' | 'email' | 'whatsapp')) {
                        methods.push(method as 'phone' | 'email' | 'whatsapp');
                      }
                    } else {
                      const index = methods.indexOf(method as 'phone' | 'email' | 'whatsapp');
                      if (index > -1) {
                        methods.splice(index, 1);
                      }
                    }
                    setLocalContent({
                      ...localContent,
                      counselor: { ...localContent.counselor, contactMethods: methods },
                    });
                  }}
                  className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Course Update Actions */}
      <SectionCard title="Apply Settings to All Courses" icon={<MessageCircle className="w-5 h-5" />}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Update All Course Pricing & Contact Info</h3>
          <p className="text-blue-700 mb-4">
            Click the button below to automatically apply current global settings to all courses. 
            This will update pricing information and counselor contact details for all medical specialties, 
            super specialties, and honorary fellowships.
          </p>
          <button
            onClick={handleCoursesPricingUpdate}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update All Courses Now
          </button>
        </div>
      </SectionCard>
    </EditorLayout>
  );
}