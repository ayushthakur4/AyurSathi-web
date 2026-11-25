import { useCallback, useEffect, useRef, useState } from "react";
import { searchCondition } from "../services/api";

const RECENT_STORAGE_KEY = "ayursathi_recent_searches";
const MAX_RECENT_SEARCHES = 5;

/**
 * Safely read the last 5 searches from localStorage.
 * @returns {string[]}
 */
function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

/**
 * Persist recent searches list to localStorage.
 * @param {string[]} items
 */
function persistRecentSearches(items) {
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or private-browsing errors gracefully
  }
}

/**
 * Custom hook encapsulating AyurSathi search state, API calls,
 * request cancellation, retry handling, and recent search history.
 */
export function useSearch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => loadRecentSearches());

  const abortControllerRef = useRef(null);
  const lastQueryRef = useRef("");

  const saveRecentSearch = useCallback((term) => {
    const cleaned = term.trim();
    if (!cleaned) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (existing) => existing.toLowerCase() !== cleaned.toLowerCase()
      );
      const updated = [cleaned, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      persistRecentSearches(updated);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const executeSearch = useCallback(
    async (rawQuery) => {
      const trimmed = typeof rawQuery === "string" ? rawQuery.trim() : "";

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!trimmed) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      lastQueryRef.current = trimmed;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await searchCondition(trimmed, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setData(result);
          saveRecentSearch(trimmed);
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        setData(null);
        setError(
          err?.message || "Unable to load Ayurvedic guidance. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [saveRecentSearch]
  );

  const retry = useCallback(() => {
    if (lastQueryRef.current) {
      executeSearch(lastQueryRef.current);
    }
  }, [executeSearch]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    recentSearches,
    executeSearch,
    retry,
    clearRecentSearches,
  };
}
