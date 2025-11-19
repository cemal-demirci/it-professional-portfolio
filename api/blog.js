import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { method, query, body } = req
    const { slug } = query

    // GET /api/blog - List all posts
    if (method === 'GET' && !slug) {
      const postIds = await kv.smembers('blog:posts') || []
      const posts = []

      for (const id of postIds) {
        const post = await kv.get(`blog:post:${id}`)
        if (post) {
          posts.push(post)
        }
      }

      // Sort by creation date, newest first
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return res.status(200).json({
        success: true,
        posts
      })
    }

    // GET /api/blog/[slug] - Get single post
    if (method === 'GET' && slug) {
      const postIds = await kv.smembers('blog:posts') || []

      for (const id of postIds) {
        const post = await kv.get(`blog:post:${id}`)
        if (post && post.slug === slug) {
          return res.status(200).json({
            success: true,
            post
          })
        }
      }

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    // POST /api/blog - Create new post (admin only)
    if (method === 'POST') {
      const { title, content, excerpt, category, tags, featuredImage, published } = body

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        })
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Generate unique ID
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Calculate reading time (rough estimate: 200 words per minute)
      const words = content.split(/\s+/).length
      const readingTime = Math.ceil(words / 200)

      const post = {
        id,
        slug,
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        category: category || 'general',
        tags: tags || [],
        featuredImage: featuredImage || null,
        published: published !== undefined ? published : false,
        readingTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save post
      await kv.set(`blog:post:${id}`, post)
      await kv.sadd('blog:posts', id)

      return res.status(201).json({
        success: true,
        post
      })
    }

    // PUT /api/blog/[slug] - Update post (admin only)
    if (method === 'PUT' && slug) {
      const postIds = await kv.smembers('blog:posts') || []

      for (const id of postIds) {
        const post = await kv.get(`blog:post:${id}`)
        if (post && post.slug === slug) {
          const { title, content, excerpt, category, tags, featuredImage, published } = body

          // Calculate new reading time if content changed
          let readingTime = post.readingTime
          if (content && content !== post.content) {
            const words = content.split(/\s+/).length
            readingTime = Math.ceil(words / 200)
          }

          const updatedPost = {
            ...post,
            title: title || post.title,
            content: content || post.content,
            excerpt: excerpt || post.excerpt,
            category: category || post.category,
            tags: tags !== undefined ? tags : post.tags,
            featuredImage: featuredImage !== undefined ? featuredImage : post.featuredImage,
            published: published !== undefined ? published : post.published,
            readingTime,
            updatedAt: new Date().toISOString()
          }

          await kv.set(`blog:post:${id}`, updatedPost)

          return res.status(200).json({
            success: true,
            post: updatedPost
          })
        }
      }

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    // DELETE /api/blog/[slug] - Delete post (admin only)
    if (method === 'DELETE' && slug) {
      const postIds = await kv.smembers('blog:posts') || []

      for (const id of postIds) {
        const post = await kv.get(`blog:post:${id}`)
        if (post && post.slug === slug) {
          await kv.del(`blog:post:${id}`)
          await kv.srem('blog:posts', id)

          return res.status(200).json({
            success: true,
            message: 'Post deleted'
          })
        }
      }

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Blog API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
