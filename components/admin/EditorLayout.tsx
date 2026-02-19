'use client';

import { ReactNode } from 'react';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/lib/content-context';

interface EditorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
  onReset: () => void;
}

export default function EditorLayout({
  title,
  description,
  children,
  onSave,
  onReset,
}: EditorLayoutProps) {
  const { isSaving } = useContent();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-bold text-primary">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'url';
  rows?: number;
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows = 3,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      )}
    </div>
  );
}

interface ArrayEditorProps<T> {
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T, index: number, updateItem: (updated: T) => void) => ReactNode;
  createNew: () => T;
  addButtonText?: string;
}

export function ArrayEditor<T>({
  items,
  onUpdate,
  renderItem,
  createNew,
  addButtonText = 'Add Item',
}: ArrayEditorProps<T>) {
  const updateItem = (index: number, updated: T) => {
    const newItems = [...items];
    newItems[index] = updated;
    onUpdate(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  const addItem = () => {
    onUpdate([...items, createNew()]);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative p-4 bg-gray-50 rounded-xl border border-gray-200">
          <button
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {renderItem(item, index, (updated) => updateItem(index, updated))}
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 font-medium rounded-xl hover:border-primary hover:text-primary transition-all"
      >
        + {addButtonText}
      </button>
    </div>
  );
}
