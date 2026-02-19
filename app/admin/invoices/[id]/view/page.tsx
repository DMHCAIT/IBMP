'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  courseName: string;
  courseAmount: number;
  discount: number;
  taxRate: number;
  paidAmount: number;
  dueAmount: number;
  notes: string;
}

interface Application {
  applicationNumber: string;
  fullName: string;
  emailId: string;
  mobileNumber: string;
  correspondenceAddress: string;
}

export default function ViewInvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [invoiceRes, appRes] = await Promise.all([
        fetch(`/api/admin/invoices/${params.id}`),
        fetch(`/api/admin/applications/${params.id}`),
      ]);

      const invoiceData = await invoiceRes.json();
      const appData = await appRes.json();

      if (invoiceData.success) setInvoice(invoiceData.invoice);
      if (appData.success) setApplication(appData.application);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!invoice || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Invoice not found</div>
      </div>
    );
  }

  const subtotal = invoice.courseAmount - invoice.discount;
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Print Actions */}
        <div className="mb-6 flex gap-4 print:hidden">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Print / Save PDF
          </button>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">International Board of Medical Practitioners</p>
                <p className="text-sm text-gray-500">600 N Broad Street Suite 5 #3695</p>
                <p className="text-sm text-gray-500">Middletown, DE 19709, USA</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{invoice.invoiceNumber}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
                  <div>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h2>
            <div className="text-gray-900">
              <div className="font-semibold text-lg">{application.fullName}</div>
              <div className="text-sm mt-1">{application.emailId}</div>
              <div className="text-sm">{application.mobileNumber}</div>
              <div className="text-sm mt-1 whitespace-pre-line">{application.correspondenceAddress}</div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-sm font-semibold text-gray-600">DESCRIPTION</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-600">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-gray-900">{invoice.courseName}</td>
                <td className="py-4 text-right text-gray-900">${invoice.courseAmount.toFixed(2)}</td>
              </tr>
              {invoice.discount > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-4 text-red-600">Discount</td>
                  <td className="py-4 text-right text-red-600">-${invoice.discount.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="text-gray-900">${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b-2 border-gray-300 font-bold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200 text-green-600">
                  <span>Paid:</span>
                  <span>${invoice.paidAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 font-bold text-xl text-red-600">
                <span>Amount Due:</span>
                <span>${invoice.dueAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">NOTES:</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>Thank you for your enrollment!</p>
            <p className="mt-2">For questions regarding this invoice, please contact info@ibmpractitioner.us</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
