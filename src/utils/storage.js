/**
 * Production-safe localStorage utilities
 * Handles localStorage with proper error handling and fallbacks
 */

const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

const isProduction = () => {
  return import.meta.env.PROD || window.location.hostname !== 'localhost'
}

export const storage = {
  /**
   * Get item from localStorage with error handling
   * @param {string} key - The key to retrieve
   * @param {any} defaultValue - Default value if key doesn't exist or error occurs
   * @returns {any} The parsed value or default value
   */
  getItem: (key, defaultValue = null) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Using default value.')
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Set item in localStorage with error handling
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {boolean} Success status
   */
  setItem: (key, value) => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Changes won\'t be persisted.')
      return false
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Remove item from localStorage with error handling
   * @param {string} key - The key to remove
   * @returns {boolean} Success status
   */
  removeItem: (key) => {
    if (!isLocalStorageAvailable()) {
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all localStorage with error handling
   * @returns {boolean} Success status
   */
  clear: () => {
    if (!isLocalStorageAvailable()) {
      return false
    }

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  isAvailable: isLocalStorageAvailable,

  /**
   * Check if running in production
   * @returns {boolean}
   */
  isProduction
}

export default storage
