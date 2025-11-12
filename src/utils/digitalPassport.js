import { v4 as uuidv4 } from 'uuid'

// Generate a unique Digital Passport ID
export const generatePassportId = () => {
  return uuidv4()
}

// Generate funny random username from ID
export const generateUsername = (passportId, customSeed = null) => {
  const adjectives = [
    // Komik sıfatlar
    'Dans Eden', 'Uçan', 'Yüzen', 'Zıplayan', 'Koşan', 'Dönen', 'Parlayan', 'Gülen',
    'Şaşkın', 'Neşeli', 'Tembel', 'Hızlı', 'Yavaş', 'Komik', 'Garip', 'Şirin',
    'Kocaman', 'Minik', 'Sevimli', 'Karizmatik', 'Efsane', 'Süper', 'Mega', 'Ultra'
  ]

  const nouns = [
    // Komik isimler
    'Patates', 'Domates', 'Limon', 'Muz', 'Elma', 'Pizza', 'Börek', 'Tost',
    'Panda', 'Koala', 'Penguen', 'Kedi', 'Köpek', 'Tavşan', 'Sincap', 'Kuş',
    'Robot', 'Roket', 'Yıldız', 'Bulut', 'Şimşek', 'Gökkuşağı', 'Ay', 'Güneş'
  ]

  // Use passport ID + custom seed to deterministically pick adjective and noun
  const idHash = passportId.split('-').join('')
  const seed = customSeed !== null ? customSeed.toString() : ''
  const combinedHash = idHash + seed

  const adjIndex = parseInt(combinedHash.substring(0, 8), 16) % adjectives.length
  const nounIndex = parseInt(combinedHash.substring(8, 16), 16) % nouns.length
  const suffix = combinedHash.substring(16, 20).toUpperCase()

  return `${adjectives[adjIndex]} ${nouns[nounIndex]}#${suffix}`
}

// Generate deterministic avatar color from ID
export const generateAvatarColor = (passportId) => {
  const idHash = passportId.split('-').join('')
  const hue = parseInt(idHash.substring(0, 8), 16) % 360
  const saturation = 70 + (parseInt(idHash.substring(8, 16), 16) % 20)
  const lightness = 50 + (parseInt(idHash.substring(16, 24), 16) % 20)

  return {
    primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness}%)`,
    accent: `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`
  }
}

// Generate deterministic avatar pattern (emoji or geometric)
export const generateAvatarPattern = (passportId) => {
  const emojiSets = [
    ['🤖', '🎮', '⚡', '🔮', '💎'],
    ['🦾', '🧠', '👾', '🎯', '🚀'],
    ['🌟', '💫', '✨', '🔥', '⚡'],
    ['🐉', '🦅', '🦊', '🐺', '🦁'],
    ['🎭', '🎪', '🎨', '🎬', '🎸']
  ]

  const idHash = passportId.split('-').join('')
  const setIndex = parseInt(idHash.substring(0, 8), 16) % emojiSets.length
  const emojiIndex = parseInt(idHash.substring(8, 16), 16) % emojiSets[setIndex].length

  return emojiSets[setIndex][emojiIndex]
}

// Save passport to localStorage
export const savePassport = (passportData) => {
  localStorage.setItem('digital_passport', JSON.stringify(passportData))
}

// Load passport from localStorage
export const loadPassport = () => {
  const saved = localStorage.getItem('digital_passport')
  return saved ? JSON.parse(saved) : null
}

// Create new passport
export const createPassport = () => {
  const id = generatePassportId()
  const usernameSeed = null // No custom seed for new passports
  const passport = {
    id,
    username: generateUsername(id, usernameSeed),
    usernameSeed, // Store seed for consistency
    avatarColor: generateAvatarColor(id),
    avatarPattern: generateAvatarPattern(id),
    credits: 15, // Starting credits
    createdAt: new Date().toISOString(),
    level: 1,
    experience: 0,
    achievements: [],
    stats: {
      totalQuestions: 0,
      favoriteBot: null,
      streak: 0
    },
    conversations: {} // { botId: [{ messages: [...], timestamp: ISO string }] }
  }

  savePassport(passport)
  return passport
}

// Import passport from code (UUID only)
export const importPassport = (passportId) => {
  try {
    // Check for super admin magic codes
    if (passportId.toLowerCase() === 'cemaldemircimarkadır') {
      const superPassport = {
        id: 'SUPER-ADMIN-CEMAL-INFINITY',
        username: 'Muhteşem Cemal ∞',
        usernameSeed: 'super-admin',
        avatarColor: {
          primary: 'hsl(280, 100%, 60%)', // Purple/magenta
          secondary: 'hsl(310, 100%, 60%)',
          accent: 'hsl(340, 100%, 60%)'
        },
        avatarPattern: '👑', // King crown emoji
        credits: Infinity, // Unlimited credits
        createdAt: new Date().toISOString(),
        level: 999,
        experience: Infinity,
        achievements: Object.keys(ACHIEVEMENTS), // All achievements unlocked
        stats: {
          totalQuestions: Infinity,
          favoriteBot: 'All Bots',
          streak: Infinity
        },
        conversations: {},
        isSuperAdmin: true, // Special flag
        goldBalance: Infinity // Unlimited gold
      }

      savePassport(superPassport)
      return superPassport
    }

    if (passportId.toLowerCase() === 'pervobensevgilisiyim') {
      const queenPassport = {
        id: 'SUPER-ADMIN-PERVIN-INFINITY',
        username: 'Kraliçe Pervin 👑',
        usernameSeed: 'super-admin-queen',
        avatarColor: {
          primary: 'hsl(330, 100%, 60%)', // Pink/rose
          secondary: 'hsl(350, 100%, 65%)',
          accent: 'hsl(310, 100%, 70%)'
        },
        avatarPattern: '👸', // Princess/Queen emoji
        credits: Infinity, // Unlimited credits
        createdAt: new Date().toISOString(),
        level: 999,
        experience: Infinity,
        achievements: Object.keys(ACHIEVEMENTS), // All achievements unlocked
        stats: {
          totalQuestions: Infinity,
          favoriteBot: 'All Bots',
          streak: Infinity
        },
        conversations: {},
        isSuperAdmin: true, // Special flag
        goldBalance: Infinity // Unlimited gold
      }

      savePassport(queenPassport)
      return queenPassport
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(passportId)) {
      throw new Error('Invalid passport format')
    }

    const usernameSeed = null
    const passport = {
      id: passportId,
      username: generateUsername(passportId, usernameSeed),
      usernameSeed,
      avatarColor: generateAvatarColor(passportId),
      avatarPattern: generateAvatarPattern(passportId),
      credits: 15, // Reset credits for imported passport
      createdAt: new Date().toISOString(),
      level: 1,
      experience: 0,
      achievements: [],
      stats: {
        totalQuestions: 0,
        favoriteBot: null,
        streak: 0
      },
      conversations: {} // { botId: [{ messages: [...], timestamp: ISO string }] }
    }

    savePassport(passport)
    return passport
  } catch (error) {
    console.error('Failed to import passport:', error)
    return null
  }
}

// Get or create passport
export const getOrCreatePassport = () => {
  const existing = loadPassport()
  if (existing) {
    // Skip username regeneration for super admin accounts
    if (existing.isSuperAdmin) {
      return existing
    }

    // If passport exists but doesn't have usernameSeed property, add it
    if (!existing.hasOwnProperty('usernameSeed')) {
      existing.usernameSeed = null
    }
    // Regenerate username with stored seed to ensure consistency
    if (existing.usernameSeed !== undefined) {
      existing.username = generateUsername(existing.id, existing.usernameSeed)
    }
    return existing
  }
  return createPassport()
}

// Update passport credits
export const updateCredits = (amount) => {
  const passport = loadPassport()
  if (!passport) return null

  passport.credits = Math.max(0, passport.credits + amount)
  savePassport(passport)
  return passport
}

// Add experience and level up
export const addExperience = (amount) => {
  const passport = loadPassport()
  if (!passport) return null

  passport.experience += amount

  // Level up system: 100 XP per level
  const newLevel = Math.floor(passport.experience / 100) + 1
  if (newLevel > passport.level) {
    passport.level = newLevel
    // Bonus credits on level up!
    passport.credits += 10
  }

  savePassport(passport)
  return passport
}

// Record question asked
export const recordQuestion = (botName) => {
  const passport = loadPassport()
  if (!passport) return null

  passport.stats.totalQuestions += 1

  // Track favorite bot
  if (!passport.stats.favoriteBot || passport.stats.favoriteBot === botName) {
    passport.stats.favoriteBot = botName
  }

  // Add experience for asking questions
  addExperience(5)

  savePassport(passport)
  return passport
}

// Achievement types
export const ACHIEVEMENTS = {
  FIRST_QUESTION: { id: 'first_question', name: 'First Steps', emoji: '🎯', description: 'Asked your first question' },
  TEN_QUESTIONS: { id: 'ten_questions', name: 'Curious Mind', emoji: '🧠', description: 'Asked 10 questions' },
  FIFTY_QUESTIONS: { id: 'fifty_questions', name: 'Knowledge Seeker', emoji: '📚', description: 'Asked 50 questions' },
  LEVEL_5: { id: 'level_5', name: 'Rising Star', emoji: '⭐', description: 'Reached level 5' },
  LEVEL_10: { id: 'level_10', name: 'Expert User', emoji: '💎', description: 'Reached level 10' },
  ALL_BOTS: { id: 'all_bots', name: 'Bot Master', emoji: '🎭', description: 'Tried all AI bots' },
  STREAK_7: { id: 'streak_7', name: 'Weekly Warrior', emoji: '🔥', description: '7 day streak' },
  STREAK_30: { id: 'streak_30', name: 'Monthly Legend', emoji: '👑', description: '30 day streak' }
}

// Unlock achievement
export const unlockAchievement = (achievementId) => {
  const passport = loadPassport()
  if (!passport) return null

  if (!passport.achievements.includes(achievementId)) {
    passport.achievements.push(achievementId)
    // Bonus credits for achievements!
    passport.credits += 20
    savePassport(passport)
    return ACHIEVEMENTS[achievementId]
  }

  return null
}

// Check and unlock achievements
export const checkAchievements = () => {
  const passport = loadPassport()
  if (!passport) return []

  const newAchievements = []

  if (passport.stats.totalQuestions >= 1 && !passport.achievements.includes('first_question')) {
    const achievement = unlockAchievement('FIRST_QUESTION')
    if (achievement) newAchievements.push(achievement)
  }

  if (passport.stats.totalQuestions >= 10 && !passport.achievements.includes('ten_questions')) {
    const achievement = unlockAchievement('TEN_QUESTIONS')
    if (achievement) newAchievements.push(achievement)
  }

  if (passport.stats.totalQuestions >= 50 && !passport.achievements.includes('fifty_questions')) {
    const achievement = unlockAchievement('FIFTY_QUESTIONS')
    if (achievement) newAchievements.push(achievement)
  }

  if (passport.level >= 5 && !passport.achievements.includes('level_5')) {
    const achievement = unlockAchievement('LEVEL_5')
    if (achievement) newAchievements.push(achievement)
  }

  if (passport.level >= 10 && !passport.achievements.includes('level_10')) {
    const achievement = unlockAchievement('LEVEL_10')
    if (achievement) newAchievements.push(achievement)
  }

  return newAchievements
}

// Generate recovery phrase (12 words from ID)
export const generateRecoveryPhrase = (passportId) => {
  const words = [
    'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
    'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
    'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray',
    'yankee', 'zulu', 'quantum', 'cyber', 'neural', 'digital', 'binary', 'matrix'
  ]

  const idHash = passportId.split('-').join('')
  const phrase = []

  for (let i = 0; i < 12; i++) {
    const index = parseInt(idHash.substring(i * 2, i * 2 + 2), 16) % words.length
    phrase.push(words[index])
  }

  return phrase.join(' ')
}

// Recover from phrase
export const recoverFromPhrase = (phrase) => {
  // This is a simplified recovery - in production you'd want proper cryptography
  // For now, we'll just validate the format and return null
  const words = phrase.toLowerCase().trim().split(/\s+/)
  if (words.length !== 12) {
    return null
  }

  // For demo purposes, we can't truly recover the UUID from the phrase
  // In a real system, you'd use proper key derivation
  return null
}

// Save conversation to passport
export const saveConversation = (botId, botName, messages) => {
  const passport = loadPassport()
  if (!passport) return null

  // Initialize conversations object if it doesn't exist
  if (!passport.conversations) {
    passport.conversations = {}
  }

  // Initialize bot conversations array if it doesn't exist
  if (!passport.conversations[botId]) {
    passport.conversations[botId] = []
  }

  // Save conversation (keep only last 50 conversations per bot)
  passport.conversations[botId].unshift({
    botName,
    messages,
    timestamp: new Date().toISOString(),
    messageCount: messages.length
  })

  // Keep only last 50 conversations per bot
  if (passport.conversations[botId].length > 50) {
    passport.conversations[botId] = passport.conversations[botId].slice(0, 50)
  }

  savePassport(passport)
  return passport
}

// Get conversations for a bot
export const getBotConversations = (botId) => {
  const passport = loadPassport()
  if (!passport || !passport.conversations) return []
  return passport.conversations[botId] || []
}

// Get all conversations
export const getAllConversations = () => {
  const passport = loadPassport()
  if (!passport || !passport.conversations) return []

  const allConversations = []
  Object.entries(passport.conversations).forEach(([botId, conversations]) => {
    conversations.forEach(conv => {
      allConversations.push({
        botId,
        ...conv
      })
    })
  })

  // Sort by timestamp (most recent first)
  return allConversations.sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  )
}

// Delete a conversation
export const deleteConversation = (botId, timestamp) => {
  const passport = loadPassport()
  if (!passport || !passport.conversations || !passport.conversations[botId]) {
    return null
  }

  passport.conversations[botId] = passport.conversations[botId].filter(
    conv => conv.timestamp !== timestamp
  )

  savePassport(passport)
  return passport
}

// Clear all conversations for a bot
export const clearBotConversations = (botId) => {
  const passport = loadPassport()
  if (!passport || !passport.conversations) return null

  if (passport.conversations[botId]) {
    delete passport.conversations[botId]
  }

  savePassport(passport)
  return passport
}

// Export passport to .cml file (client-side only, no server storage)
export const exportPassportToFile = () => {
  const passport = loadPassport()
  if (!passport) return null

  // Create file content with metadata
  const fileData = {
    version: '1.0',
    type: 'cemal_license',
    exportDate: new Date().toISOString(),
    passport: passport
  }

  // Convert to JSON string
  const jsonString = JSON.stringify(fileData, null, 2)

  // Create blob
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Create download link
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cemal-passport-${passport.username.replace(/[^a-zA-Z0-9]/g, '_')}.cml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return true
}

// Import passport from .cml file
export const importPassportFromFile = (file) => {
  return new Promise((resolve, reject) => {
    // Check file extension
    if (!file.name.endsWith('.cml')) {
      reject(new Error('Invalid file type. Please select a .cml file'))
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const fileData = JSON.parse(event.target.result)

        // Validate file format
        if (fileData.type !== 'cemal_license' || !fileData.passport) {
          reject(new Error('Invalid .cml file format'))
          return
        }

        // Validate passport data
        const importedPassport = fileData.passport
        if (!importedPassport.id || !importedPassport.username) {
          reject(new Error('Invalid passport data'))
          return
        }

        // Save imported passport
        savePassport(importedPassport)
        resolve(importedPassport)
      } catch (error) {
        reject(new Error('Failed to read .cml file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

// Regenerate username with new seed
export const regenerateUsername = () => {
  const passport = loadPassport()
  if (!passport) return null

  // Generate new seed based on current timestamp
  const newSeed = Date.now()
  const newUsername = generateUsername(passport.id, newSeed)

  passport.username = newUsername
  // Store the seed so username stays consistent
  passport.usernameSeed = newSeed

  savePassport(passport)
  return passport
}
