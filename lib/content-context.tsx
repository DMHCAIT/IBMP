'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { SiteContent, defaultContent } from './content-data';

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: SiteContent[keyof SiteContent]) => void;
  saveContent: (override?: Partial<SiteContent>) => Promise<void>;
  resetContent: () => void;
  resetSection: (section: keyof SiteContent) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'ibmp-site-content';

export function ContentProvider({ children }: { children: ReactNode }) {
  // Seed state from localStorage immediately to avoid blank flash on admin pages
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return { ...defaultContent, ...JSON.parse(stored) };
      } catch {}
    }
    return defaultContent;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Ref that always holds the latest content synchronously (avoids stale closure in saveContent)
  const latestContentRef = useRef<SiteContent>(content);
  // Track when we last successfully fetched from API (for cooldown)
  const lastFetchTime = useRef<number>(0);

  const loadContent = async (force = false) => {
    // Cooldown: skip re-fetch if last fetch was < 30 seconds ago (unless forced)
    const now = Date.now();
    if (!force && lastFetchTime.current > 0 && now - lastFetchTime.current < 30_000) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/content', { cache: 'no-store' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const merged = { ...defaultContent, ...result.data };
          setContent(merged);
          latestContentRef.current = merged;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          lastFetchTime.current = Date.now();
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load from API, using cached content:', error);
    }
    // API failed — content already seeded from localStorage in useState, just stop loading
    setIsLoading(false);
  };

  // Load on mount — always fetch fresh on first load
  useEffect(() => {
    loadContent(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch on visibility change but respect the 30-second cooldown
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadContent(); // cooldown applied inside loadContent
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateContent = (section: keyof SiteContent, data: SiteContent[keyof SiteContent]) => {
    // Update ref synchronously so saveContent always reads the latest value
    latestContentRef.current = { ...latestContentRef.current, [section]: data };
    setContent(latestContentRef.current);
  };

  const saveContent = async (override?: Partial<SiteContent>) => {
    setIsSaving(true);
    // Use override if provided, otherwise use the ref (always up-to-date even with batched state)
    const contentToSave: SiteContent = override
      ? { ...latestContentRef.current, ...override }
      : latestContentRef.current;

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentToSave }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to save to API');
      }

      // Keep ref and state in sync with what was saved
      latestContentRef.current = contentToSave;
      setContent(contentToSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contentToSave));
      // Immediately invalidate cache so next fetch gets fresh data
      lastFetchTime.current = 0;
    } catch (error) {
      console.error('Error saving content to API:', error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contentToSave));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetContent = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/content', { method: 'DELETE' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          latestContentRef.current = result.data;
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
    latestContentRef.current = defaultContent;
    setContent(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetSection = async (section: keyof SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/content/${section}`, { method: 'DELETE' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          latestContentRef.current = { ...latestContentRef.current, [section]: result.data };
          setContent(latestContentRef.current);
          return;
        }
      }
    } catch (error) {
      console.error(`Error resetting section ${section} via API:`, error);
    } finally {
      setIsSaving(false);
    }
    latestContentRef.current = { ...latestContentRef.current, [section]: defaultContent[section] };
    setContent(latestContentRef.current);
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
