// Gold Credit Service - Privacy-First with Passport ID
// Now integrated with Digital Passport for unified Gold management
import {
  getOrCreatePassport,
  getUserGoldBalance,
  updateGoldBalance as updatePassportGoldBalance
} from '../utils/digitalPassport'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cemal2026'

// Helper: Get Passport ID from localStorage
const getPassportId = () => {
  const passport = getOrCreatePassport()
  return passport.id
}

// ==================== USER FUNCTIONS ====================

// Get user's current Gold balance from Digital Passport
export const getUserGold = async () => {
  // Read directly from Digital Passport (unified source of truth)
  return getUserGoldBalance()
}

// Reward Gold to user (called by game, streak, etc.)
export const rewardGold = async (amount, reason = 'Reward') => {
  // Update Digital Passport directly
  updatePassportGoldBalance(amount)
  const newBalance = getUserGoldBalance()

  return {
    success: true,
    amount,
    newBalance,
    message: `+${amount} Gold kazandınız!`
  }
}

// Transfer Gold to another user
export const transferGold = async (toPassportId, amount) => {
  try {
    const passportId = getPassportId()
    const response = await fetch(`${API_BASE}/api/gold?action=transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Passport-ID': passportId
      },
      body: JSON.stringify({ toPassportId, amount })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to transfer gold')
    }

    return {
      success: true,
      amount: data.amount,
      newBalance: data.newBalance,
      recipientBalance: data.recipientBalance
    }
  } catch (error) {
    throw error
  }
}

// Check and update login streak
export const checkLoginStreak = async () => {
  try {
    const passportId = getPassportId()
    const response = await fetch(`${API_BASE}/api/gold?action=check-streak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Passport-ID': passportId
      }
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to check streak')
    }

    return {
      success: true,
      newStrike: data.newStrike,
      goldRewarded: data.goldRewarded,
      streak: data.streak
    }
  } catch (error) {
    console.warn('API unavailable for streak check')
    return {
      success: false,
      newStrike: false,
      goldRewarded: 0,
      streak: {
        strikes: 0,
        timeUntilNextStrike: 0,
        totalGoldEarned: 0,
        streakCount: 0
      }
    }
  }
}

// Get streak info
export const getStreakInfo = async () => {
  try {
    const passportId = getPassportId()
    const response = await fetch(`${API_BASE}/api/gold?action=streak`, {
      headers: {
        'X-Passport-ID': passportId
      }
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to get streak')
    }

    return data.streak
  } catch (error) {
    console.warn('API unavailable for streak info')
    return {
      strikes: 0,
      lastStrike: 0,
      timeUntilNextStrike: 0,
      canClaimStrike: true,
      totalGoldEarned: 0,
      streakCount: 0
    }
  }
}

// Redeem Gold code
export const redeemGoldCode = async (code) => {
  try {
    const passportId = getPassportId()
    const response = await fetch(`${API_BASE}/api/gold?action=redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Passport-ID': passportId
      },
      body: JSON.stringify({ code })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to redeem code')
    }

    return {
      success: true,
      amount: data.amount,
      newBalance: data.newBalance
    }
  } catch (error) {
    throw error
  }
}

// ==================== ADMIN FUNCTIONS ====================

// Generate Gold codes (admin only)
export const generateGoldCodes = async (amount, count = 1) => {
  try {
    const response = await fetch(`${API_BASE}/api/gold?action=generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ amount, count })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate codes')
    }

    return data.codes
  } catch (error) {
    throw error
  }
}

// Get all generated Gold codes (admin only)
export const getGeneratedGoldCodes = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/gold?action=list`, {
      method: 'GET',
      headers: {
        'X-Admin-Password': ADMIN_PASSWORD
      }
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch codes')
    }

    return data.codes || []
  } catch (error) {
    throw error
  }
}

// Get Gold code statistics (admin only)
export const getGoldCodeStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/gold?action=list`, {
      method: 'GET',
      headers: {
        'X-Admin-Password': ADMIN_PASSWORD
      }
    })

    const data = await response.json()

    if (!data.success) {
      return null
    }

    return data.stats
  } catch (error) {
    return null
  }
}

// Delete a Gold code (admin only)
export const deleteGoldCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/api/gold?action=delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ code })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to delete code')
    }

    return true
  } catch (error) {
    throw error
  }
}

// Invalidate a Gold code (admin only)
export const invalidateGoldCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/api/gold?action=invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ code })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to invalidate code')
    }

    return true
  } catch (error) {
    throw error
  }
}

// Helper: Format time remaining
export const formatTimeRemaining = (ms) => {
  if (ms <= 0) return 'Hazır!'

  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))

  if (hours > 0) {
    return `${hours}s ${minutes}dk`
  }
  return `${minutes}dk`
}
