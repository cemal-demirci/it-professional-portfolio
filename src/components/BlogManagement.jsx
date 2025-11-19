import { useState, useEffect } from 'react'
import { Plus, Edit, Trash, Eye, Save, X, Image as ImageIcon, Tag, Calendar, Clock } from 'lucide-react'

const BlogManagement = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'technology',
    tags: [],
    featuredImage: '',
    published: false
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'technology',
      tags: [],
      featuredImage: '',
      published: false
    })
    setShowEditor(true)
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags || [],
      featuredImage: post.featuredImage || '',
      published: post.published
    })
    setShowEditor(true)
  }

  const handleSave = async () => {
    try {
      const url = editingPost ? `/api/blog/${editingPost.slug}` : '/api/blog'
      const method = editingPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        await fetchPosts()
        setShowEditor(false)
        alert(editingPost ? 'Post updated!' : 'Post created!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post')
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchPosts()
        alert('Post deleted!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    }
  }

  const handleTagsChange = (e) => {
    const tagsString = e.target.value
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData({ ...formData, tags: tagsArray })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (showEditor) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={() => setShowEditor(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
              placeholder="Enter post title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown/HTML)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 font-mono text-sm"
              placeholder="Write your post content here... (supports HTML)"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
              placeholder="Short summary of the post..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
              >
                <option value="technology">Technology</option>
                <option value="security">Security</option>
                <option value="ai">AI</option>
                <option value="tutorial">Tutorial</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
              placeholder="javascript, react, tutorial"
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 bg-zinc-900 border-zinc-800 rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-300">
              Publish immediately
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {editingPost ? 'Update Post' : 'Create Post'}
            </button>
            <button
              onClick={() => setShowEditor(false)}
              className="px-6 py-3 bg-zinc-900 text-white border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Blog Posts</h2>
          <p className="text-gray-400 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="text-gray-400">No blog posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.published
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min read
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-gray-600">#{tag}</span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="View Post"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Edit Post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Post"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogManagement
