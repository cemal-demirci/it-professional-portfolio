// Tool Favorites Service
// Manages user's favorite tools using localStorage

const FAVORITES_KEY = 'userFavoriteTools'
const RECENT_TOOLS_KEY = 'recentlyUsedTools'

/**
 * Get all favorite tool IDs
 * @returns {string[]} Array of tool IDs
 */
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Error reading favorites:', error)
    return []
  }
}

/**
 * Check if a tool is favorited
 * @param {string} toolId - The tool identifier
 * @returns {boolean}
 */
export const isFavorite = (toolId) => {
  const favorites = getFavorites()
  return favorites.includes(toolId)
}

/**
 * Toggle favorite status of a tool
 * @param {string} toolId - The tool identifier
 * @returns {boolean} New favorite status
 */
export const toggleFavorite = (toolId) => {
  try {
    const favorites = getFavorites()
    const index = favorites.indexOf(toolId)

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1)
    } else {
      // Add to favorites
      favorites.push(toolId)
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return index === -1 // Returns true if now favorited
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return false
  }
}

/**
 * Get recently used tools
 * @param {number} limit - Maximum number of recent tools to return
 * @returns {Array<{id: string, timestamp: number, name: string}>}
 */
export const getRecentTools = (limit = 10) => {
  try {
    const recent = localStorage.getItem(RECENT_TOOLS_KEY)
    const tools = recent ? JSON.parse(recent) : []
    return tools.slice(0, limit)
  } catch (error) {
    console.error('Error reading recent tools:', error)
    return []
  }
}

/**
 * Add a tool to recently used list
 * @param {string} toolId - The tool identifier
 * @param {string} toolName - The tool name
 */
export const addToRecent = (toolId, toolName) => {
  try {
    const recent = getRecentTools(50) // Keep max 50

    // Remove if already exists
    const filtered = recent.filter(t => t.id !== toolId)

    // Add to beginning
    filtered.unshift({
      id: toolId,
      name: toolName,
      timestamp: Date.now()
    })

    // Keep only last 50
    const limited = filtered.slice(0, 50)

    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(limited))
  } catch (error) {
    console.error('Error adding to recent tools:', error)
  }
}

/**
 * Clear all favorites
 */
export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY)
  } catch (error) {
    console.error('Error clearing favorites:', error)
  }
}

/**
 * Clear recent tools history
 */
export const clearRecentTools = () => {
  try {
    localStorage.removeItem(RECENT_TOOLS_KEY)
  } catch (error) {
    console.error('Error clearing recent tools:', error)
  }
}
