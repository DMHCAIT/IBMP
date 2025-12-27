'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteContent, defaultContent } from './content-data';

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: SiteContent[keyof SiteContent]) => void;
  saveContent: () => Promise<void>;
  resetContent: () => void;
  resetSection: (section: keyof SiteContent) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'ibmp-site-content';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load content from API on mount, fallback to localStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load from API first
        const response = await fetch('/api/content');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent({ ...defaultContent, ...result.data });
            // Sync to localStorage for offline access
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to load from API, falling back to localStorage:', error);
      }

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setContent({ ...defaultContent, ...parsed });
        }
      } catch (error) {
        console.error('Error loading content from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateContent = (section: keyof SiteContent, data: SiteContent[keyof SiteContent]) => {
    setContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      // Save to API
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to API');
      }

      // Also save to localStorage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Error saving content to API:', error);
      // Fallback: save to localStorage only
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetContent = async () => {
    setIsSaving(true);
    try {
      // Reset via API
      const response = await fetch('/api/content', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setContent(result.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
          return;
        }
      }
    } catch (error) {
      console.error('Error resetting content via API:', error);
    } finally {
      setIsSaving(false);
    }

    // Fallback: reset locally
    setContent(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetSection = async (section: keyof SiteContent) => {
    setIsSaving(true);
    try {
      // Reset section via API
      const response = await fetch(`/api/content/${section}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setContent((prev) => ({
            ...prev,
            [section]: result.data,
          }));
          return;
        }
      }
    } catch (error) {
      console.error(`Error resetting section ${section} via API:`, error);
    } finally {
      setIsSaving(false);
    }

    // Fallback: reset locally
    setContent((prev) => ({
      ...prev,
      [section]: defaultContent[section],
    }));
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        saveContent,
        resetContent,
        resetSection,
        isLoading,
        isSaving,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Hook to get specific section content
export function useSectionContent<K extends keyof SiteContent>(section: K): SiteContent[K] {
  const { content } = useContent();
  return content[section];
}
