'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceData {
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
  studentName: string;
}

interface Application {
  applicationNumber: string;
  fullName: string;
  emailId: string;
  mobileNumber: string;
  courseName: string;
  courseType: string;
  correspondenceAddress: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  sessionYear: string;
  studyMode: string;
}

export default function InvoiceGeneratorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    courseName: '',
    courseAmount: 2000,
    discount: 0,
    taxRate: 0,
    paidAmount: 0,
    dueAmount: 0,
    notes: '',
    studentName: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const coursePrices: Record<string, number> = {
    'Fellowship in Emergency Medicine': 2500,
    'Fellowship in Diabetology': 2200,
    'Fellowship in Family Medicine': 2000,
    'Fellowship in Anesthesiology': 2800,
    'Fellowship in Critical Care': 3000,
    'Fellowship in Internal Medicine': 2300,
    'Fellowship in Endocrinology': 2400,
    'Fellowship in Obstetrics & Gynecology': 2700,
    'Fellowship in Reproductive Medicine': 3200,
    'Fellowship in Neonatology': 2900,
  };

  useEffect(() => {
    loadApplication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateAmounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.courseAmount, invoice.discount, invoice.taxRate, invoice.paidAmount]);

  const loadApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setApplication(data.application);

        // Check if invoice already exists
        const invoiceResponse = await fetch(`/api/admin/invoices/${params.id}`);
        const invoiceData = await invoiceResponse.json();

        if (invoiceData.success && invoiceData.invoice) {
          setInvoice(invoiceData.invoice);
          setIsEditing(true);
        } else {
          const invoiceNumber = `IBMP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
          const courseAmount = coursePrices[data.application.courseName] || 2000;

          setInvoice(prev => ({
            ...prev,
            invoiceNumber,
            courseName: data.application.courseName,
            courseAmount,
            studentName: data.application.fullName,
          }));
        }
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAmounts = () => {
    const subtotal = invoice.courseAmount - invoice.discount;
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const finalAmount = subtotal + taxAmount;
    const dueAmount = Math.max(0, finalAmount - invoice.paidAmount);

    setInvoice(prev => ({ ...prev, dueAmount }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(`/api/admin/invoices/${params.id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoice,
          studentName: application?.fullName || invoice.studentName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(isEditing ? 'Invoice updated successfully!' : 'Invoice created successfully!');
        router.push(`/admin/invoices/${params.id}/view`);
      } else {
        alert(result.message || 'Error saving invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Application not found</div>
      </div>
    );
  }

  const subtotal = invoice.courseAmount - invoice.discount;
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const finalAmount = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            {isEditing ? 'Edit Invoice' : 'Generate Invoice'}
          </h1>
          <p className="text-purple-100">International Board of Medical Practitioners</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Application Details (read-only) */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-purple-600">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold text-gray-600">Application No:</span> <span className="text-gray-900">{application.applicationNumber}</span></div>
                <div><span className="font-semibold text-gray-600">Student Name:</span> <span className="text-gray-900">{application.fullName}</span></div>
                <div><span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-900">{application.emailId}</span></div>
                <div><span className="font-semibold text-gray-600">Mobile:</span> <span className="text-gray-900">{application.mobileNumber}</span></div>
                <div><span className="font-semibold text-gray-600">Course Type:</span> <span className="text-gray-900">{application.courseType}</span></div>
                <div><span className="font-semibold text-gray-600">Course Name:</span> <span className="text-gray-900">{application.courseName}</span></div>
                <div><span className="font-semibold text-gray-600">Session:</span> <span className="text-gray-900">{application.sessionYear}</span></div>
                <div><span className="font-semibold text-gray-600">Study Mode:</span> <span className="text-gray-900">{application.studyMode}</span></div>
              </div>
            </div>

            {/* Invoice Details (editable) */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Details</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number *</label>
                  <input type="text" value={invoice.invoiceNumber} onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date *</label>
                  <input type="date" value={invoice.invoiceDate} onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
                  <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course / Description *</label>
                <input type="text" value={invoice.courseName} onChange={(e) => setInvoice({ ...invoice, courseName: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
              </div>
            </div>

            {/* Financial Details (editable) */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Amount ($) *</label>
                  <input type="number" step="0.01" value={invoice.courseAmount} onChange={(e) => setInvoice({ ...invoice, courseAmount: parseFloat(e.target.value) || 0 })} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount ($)</label>
                  <input type="number" step="0.01" value={invoice.discount} onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                  <input type="number" step="0.01" value={invoice.taxRate} onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paid Amount ($)</label>
                  <input type="number" step="0.01" value={invoice.paidAmount} onChange={(e) => setInvoice({ ...invoice, paidAmount: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
                </div>
              </div>

              {/* Live Calculation */}
              <div className="mt-6 bg-white rounded-lg p-4 border-2 border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">CALCULATION SUMMARY</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Course Amount:</span><span className="font-semibold">${invoice.courseAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Discount:</span><span className="font-semibold">-${invoice.discount.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t pt-2"><span>Subtotal:</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax ({invoice.taxRate}%):</span><span className="font-semibold">${taxAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold text-purple-600"><span>Total Amount:</span><span>${finalAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-green-600"><span>Paid:</span><span className="font-semibold">${invoice.paidAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold text-red-600"><span>Due Amount:</span><span>${invoice.dueAmount.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-yellow-600">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <textarea value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} rows={4} placeholder="Add any additional notes, payment terms, or special instructions..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none" />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold">Cancel</button>
              {isEditing && (
                <button type="button" onClick={() => router.push(`/admin/invoices/${params.id}/view`)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">View Invoice</button>
              )}
              <button type="submit" disabled={saving} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400">
                {saving ? 'Saving...' : isEditing ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
