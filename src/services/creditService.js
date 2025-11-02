// Credit System Service - Server-side API Version
// Uses Redis via Vercel serverless functions

const API_BASE = import.meta.env.VITE_API_BASE || ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cemal2026' // Fallback for development

// Credit packages available
export const CREDIT_PACKAGES = [
  { amount: 50, label: '50 Credits', color: 'from-cyan-600 to-cyan-500' },
  { amount: 100, label: '100 Credits', color: 'from-blue-600 to-blue-500' },
  { amount: 200, label: '200 Credits', color: 'from-teal-600 to-teal-500' },
  { amount: 1000, label: '1000 Credits', color: 'from-sky-600 to-sky-500' }
]

// ==================== USER FUNCTIONS ====================

// Get user's current credit balance (IP-based)
export const getUserCredits = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=balance`)
    const data = await response.json()

    if (data.success) {
      return data.credits
    }

    // Fallback to localStorage for development
    const localCredits = localStorage.getItem('local_user_credits')
    return localCredits ? parseInt(localCredits) : 15
  } catch (error) {
    console.error('Error fetching credits, using localStorage:', error)
    // Fallback to localStorage for development
    const localCredits = localStorage.getItem('local_user_credits')
    return localCredits ? parseInt(localCredits) : 15
  }
}

// Redeem credit code
export const redeemCreditCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    // Development fallback: Check localStorage codes
    console.warn('API unavailable, checking localStorage codes')
    const localCodes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')
    const codeObj = localCodes.find(c => c.code === code.toUpperCase())

    if (!codeObj) throw new Error('Code not found')
    if (codeObj.usedAt) throw new Error('Code already used')
    if (!codeObj.isValid) throw new Error('Code invalidated')

    // Mark as used in localStorage
    codeObj.usedAt = new Date().toISOString()
    localStorage.setItem('admin_generated_codes', JSON.stringify(localCodes))

    // Add credits
    const currentCredits = parseInt(localStorage.getItem('local_user_credits') || '15')
    const newBalance = currentCredits + codeObj.amount
    localStorage.setItem('local_user_credits', newBalance.toString())

    return {
      success: true,
      amount: codeObj.amount,
      newBalance
    }
  }
}

// Deduct credits (called when using AI features)
export const deductCredits = async (amount = 1) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=deduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to deduct credits')
    }

    return data.newBalance
  } catch (error) {
    // Development fallback: Use localStorage
    console.warn('API unavailable, using localStorage for credits')
    const currentCredits = parseInt(localStorage.getItem('local_user_credits') || '15')

    if (currentCredits < amount) {
      throw new Error('Insufficient credits')
    }

    const newBalance = currentCredits - amount
    localStorage.setItem('local_user_credits', newBalance.toString())
    return newBalance
  }
}

// Send credit request email
export const sendCreditRequest = async (email, name, message, requestedAmount) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        message,
        requestedAmount
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to send request')
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error) {
    console.warn('API unavailable, saving request to localStorage')
    // Development fallback
    const request = {
      email,
      name,
      message,
      requestedAmount,
      timestamp: new Date().toISOString()
    }

    const requests = JSON.parse(localStorage.getItem('credit_requests') || '[]')
    requests.push(request)
    localStorage.setItem('credit_requests', JSON.stringify(requests))

    return {
      success: true,
      message: 'Request saved locally (dev mode)'
    }
  }
}

// ==================== ADMIN FUNCTIONS ====================

// Helper for localStorage code generation
const generateRandomCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate credit codes (admin only)
export const generateMultipleCodes = async (amount, count = 1) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=generate`, {
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
    console.warn('API unavailable, generating codes in localStorage')

    // Development fallback: Generate in localStorage
    const codes = []
    for (let i = 0; i < count; i++) {
      const randomPart = generateRandomCode(8)
      const code = `CEMAL-${amount}-${randomPart}`

      const codeObj = {
        code,
        amount,
        createdAt: new Date().toISOString(),
        usedAt: null,
        usedBy: null,
        isValid: true
      }

      codes.push(codeObj)
    }

    // Save to localStorage
    const existingCodes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')
    const allCodes = [...existingCodes, ...codes]
    localStorage.setItem('admin_generated_codes', JSON.stringify(allCodes))

    return codes
  }
}

// Get all generated codes (admin only)
export const getGeneratedCodes = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=list`, {
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
    console.warn('API unavailable, using localStorage for codes')
    // Development fallback
    const codes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')
    return codes
  }
}

// Get code statistics (admin only)
export const getCodeStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=list`, {
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
    console.warn('API unavailable, calculating stats from localStorage')
    // Development fallback
    const codes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')

    return {
      total: codes.length,
      used: codes.filter(c => c.usedAt).length,
      unused: codes.filter(c => !c.usedAt && c.isValid).length,
      invalid: codes.filter(c => !c.isValid).length,
      totalCreditsGenerated: codes.reduce((sum, c) => sum + c.amount, 0),
      totalCreditsUsed: codes.filter(c => c.usedAt).reduce((sum, c) => sum + c.amount, 0)
    }
  }
}

// Delete a generated code (admin only)
export const deleteGeneratedCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=delete`, {
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
    console.warn('API unavailable, deleting from localStorage')
    // Development fallback
    const codes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')
    const filtered = codes.filter(c => c.code !== code)
    localStorage.setItem('admin_generated_codes', JSON.stringify(filtered))
    return true
  }
}

// Invalidate a code without deleting (admin only)
export const invalidateCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=invalidate`, {
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
    console.warn('API unavailable, invalidating in localStorage')
    // Development fallback
    const codes = JSON.parse(localStorage.getItem('admin_generated_codes') || '[]')
    const codeObj = codes.find(c => c.code === code)
    if (codeObj) {
      codeObj.isValid = false
      localStorage.setItem('admin_generated_codes', JSON.stringify(codes))
    }
    return true
  }
}

// Get all credit requests (admin only)
export const getCreditRequests = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=requests`, {
      method: 'GET',
      headers: {
        'X-Admin-Password': ADMIN_PASSWORD
      }
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch requests')
    }

    return data.requests || []
  } catch (error) {
    console.warn('API unavailable, using localStorage for requests')
    // Development fallback
    const requests = JSON.parse(localStorage.getItem('credit_requests') || '[]')
    return requests
  }
}

// Clear credit request (admin only)
export const clearCreditRequest = async (timestamp) => {
  try {
    const response = await fetch(`${API_BASE}/api/credits?action=clear-request`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': ADMIN_PASSWORD
      },
      body: JSON.stringify({ timestamp })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to clear request')
    }

    return true
  } catch (error) {
    console.warn('API unavailable, clearing from localStorage')
    // Development fallback
    const requests = JSON.parse(localStorage.getItem('credit_requests') || '[]')
    const filtered = requests.filter(r => r.timestamp !== timestamp)
    localStorage.setItem('credit_requests', JSON.stringify(filtered))
    return true
  }
}

// ==================== DEPRECATED FUNCTIONS (for backwards compatibility) ====================
// These functions are no longer used but kept for reference

export const generateCreditCode = () => {
  throw new Error('This function is deprecated. Use generateMultipleCodes instead.')
}

export const saveGeneratedCodes = () => {
  throw new Error('This function is deprecated. Codes are now stored in Redis.')
}

export const addGeneratedCode = () => {
  throw new Error('This function is deprecated. Use generateMultipleCodes instead.')
}

export const validateCodeFormat = (code) => {
  const regex = /^CEMAL-(\d+)-([A-Z0-9]{8})$/
  return regex.test(code)
}

export const parseCodeAmount = (code) => {
  const match = code.match(/^CEMAL-(\d+)-/)
  return match ? parseInt(match[1]) : null
}

export const checkCodeValidity = () => {
  throw new Error('This function is deprecated. Validation happens server-side.')
}

export const setUserCredits = () => {
  throw new Error('This function is deprecated. Credits are managed server-side.')
}

export const getRedeemedCodes = () => {
  throw new Error('This function is deprecated. Redemption history is on server.')
}

export const addRedeemedCode = () => {
  throw new Error('This function is deprecated. Server handles redemptions.')
}
