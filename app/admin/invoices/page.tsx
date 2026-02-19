'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceListItem {
  applicationId: string;
  invoiceNumber: string;
  invoiceDate: string;
  courseName: string;
  studentName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (applicationId: string, invoiceNumber: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) return;
    
    try {
      const response = await fetch(`/api/admin/invoices/${applicationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        loadInvoices();
      } else {
        alert('Error deleting invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">{invoices.length} invoice(s) generated</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {invoices.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-lg mb-2">No invoices generated yet</p>
              <p className="text-gray-400 text-sm">Go to Applications → select an application → click &quot;Generate Invoice&quot;</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Due</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.studentName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {invoice.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        ${(invoice.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                        ${(invoice.paidAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                        ${(invoice.dueAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {(invoice.dueAmount || 0) <= 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                        ) : (invoice.paidAmount || 0) > 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Partial</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Unpaid</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => router.push(`/admin/invoices/${invoice.applicationId}/view`)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/admin/invoices/${invoice.applicationId}`)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteInvoice(invoice.applicationId, invoice.invoiceNumber)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
