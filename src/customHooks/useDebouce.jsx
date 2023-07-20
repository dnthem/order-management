import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce the value
 * @param {string} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {string} - The debounced value
 */
export function useDebounce (value, delay = 250) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(timeout);
      }
    }, [value, delay]);
    return debouncedValue;
  }
