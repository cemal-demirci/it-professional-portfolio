import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Tag, User, Search, ArrowRight, RefreshCw } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Blog = () => {
  const { language } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  useEffect(() => {
    fetchPosts()

    // Auto-refresh every 10 seconds for new posts
    const interval = setInterval(() => {
      fetchPosts(true) // silent refresh (no loading state)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const fetchPosts = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }

      const response = await fetch('/api/blog')
      const data = await response.json()

      if (data.success) {
        const newPosts = data.posts || []

        // Check if there are new posts
        if (silent && newPosts.length !== posts.length) {
          setLastUpdate(Date.now())
        }

        setPosts(newPosts)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const categories = ['all', 'technology', 'security', 'ai', 'tutorial', 'personal']

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory && post.published
  })

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      security: 'bg-red-500/10 text-red-400 border-red-500/20',
      ai: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      tutorial: 'bg-green-500/10 text-green-400 border-green-500/20',
      personal: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    }
    return colors[category] || 'bg-zinc-800 text-gray-300 border-zinc-700'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl md:text-6xl font-black text-white">
            {language === 'tr' ? 'Blog' : 'Blog'}
          </h1>
          <button
            onClick={() => fetchPosts()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all text-gray-400 hover:text-white"
            title={language === 'tr' ? 'Yenile' : 'Refresh'}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">{language === 'tr' ? 'Yenile' : 'Refresh'}</span>
          </button>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl">
          {language === 'tr'
            ? 'Teknoloji, güvenlik, yapay zeka ve hayat üzerine düşünceler.'
            : 'Thoughts on technology, security, AI, and life.'}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          {language === 'tr'
            ? '⚡ Otomatik güncelleme: Her 10 saniyede bir yeni yazılar kontrol edilir'
            : '⚡ Auto-refresh: Checks for new posts every 10 seconds'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={language === 'tr' ? 'Blog yazılarında ara...' : 'Search blog posts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-gray-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {category === 'all' ? (language === 'tr' ? 'Tümü' : 'All') :
               category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {language === 'tr' ? 'Henüz blog yazısı yok.' : 'No blog posts yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-300"
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video bg-zinc-800 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    {post.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} {language === 'tr' ? 'dk' : 'min'}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blog
