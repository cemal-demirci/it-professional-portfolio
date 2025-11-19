import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { method, query, body } = req
    const { slug } = query

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug is required'
      })
    }

    const postIds = await kv.smembers('blog:posts') || []
    let foundPost = null
    let foundId = null

    for (const id of postIds) {
      const post = await kv.get(`blog:post:${id}`)
      if (post && post.slug === slug) {
        foundPost = post
        foundId = id
        break
      }
    }

    // GET - Get post by slug
    if (method === 'GET') {
      if (!foundPost) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      return res.status(200).json({
        success: true,
        post: foundPost
      })
    }

    // PUT - Update post by slug (admin only)
    if (method === 'PUT') {
      if (!foundPost) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      const { title, content, excerpt, category, tags, featuredImage, published } = body

      // Calculate new reading time if content changed
      let readingTime = foundPost.readingTime
      if (content && content !== foundPost.content) {
        const words = content.split(/\s+/).length
        readingTime = Math.ceil(words / 200)
      }

      const updatedPost = {
        ...foundPost,
        title: title || foundPost.title,
        content: content || foundPost.content,
        excerpt: excerpt || foundPost.excerpt,
        category: category || foundPost.category,
        tags: tags !== undefined ? tags : foundPost.tags,
        featuredImage: featuredImage !== undefined ? featuredImage : foundPost.featuredImage,
        published: published !== undefined ? published : foundPost.published,
        readingTime,
        updatedAt: new Date().toISOString()
      }

      await kv.set(`blog:post:${foundId}`, updatedPost)

      return res.status(200).json({
        success: true,
        post: updatedPost
      })
    }

    // DELETE - Delete post by slug (admin only)
    if (method === 'DELETE') {
      if (!foundPost) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      await kv.del(`blog:post:${foundId}`)
      await kv.srem('blog:posts', foundId)

      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Blog API error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
