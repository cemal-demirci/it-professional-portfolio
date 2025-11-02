import Redis from 'ioredis'

// Redis Cloud connection - MUST set REDIS_URL environment variable
if (!process.env.REDIS_URL) {
  console.error('REDIS_URL environment variable is not set!')
}
const redis = new Redis(process.env.REDIS_URL)

/**
 * Serverless function to handle contact messages
 * GET: List all messages (admin only)
 * POST: Send a new message
 * DELETE: Delete a message (admin only)
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // GET: List all messages
    if (req.method === 'GET') {
      const messagesStr = await redis.get('contact_messages')
      const messages = messagesStr ? JSON.parse(messagesStr) : []
      return res.status(200).json({ success: true, messages })
    }

    // POST: Send new message
    if (req.method === 'POST') {
      const { name, email, message } = req.body

      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, message'
        })
      }

      // Get existing messages
      const messagesStr = await redis.get('contact_messages')
      const existingMessages = messagesStr ? JSON.parse(messagesStr) : []

      // Create new message
      const newMessage = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      }

      // Add to messages array
      existingMessages.unshift(newMessage)

      // Save to Redis (keep last 1000 messages)
      await redis.set('contact_messages', JSON.stringify(existingMessages.slice(0, 1000)))

      return res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: newMessage
      })
    }

    // DELETE: Delete a message
    if (req.method === 'DELETE') {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Missing message ID'
        })
      }

      // Get existing messages
      const messagesStr = await redis.get('contact_messages')
      const existingMessages = messagesStr ? JSON.parse(messagesStr) : []

      // Filter out the message
      const updatedMessages = existingMessages.filter(msg => msg.id !== parseInt(id))

      // Save back to Redis
      await redis.set('contact_messages', JSON.stringify(updatedMessages))

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      })
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
