import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Tag, User, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import DOMPurify from 'dompurify'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()
      if (data.success) {
        setPost(data.post)
      } else {
        navigate('/blog')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      navigate('/blog')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = (platform) => {
    const url = window.location.href
    const title = post.title
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">404</h1>
          <p className="text-gray-400 mb-8">Blog post not found</p>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}
      </Link>

      {/* Article */}
      <article className="max-w-4xl mx-auto">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          {/* Category */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-gray-300">
              <Tag className="w-3 h-3 inline mr-1" />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Cemal Demirci
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime} {language === 'tr' ? 'dakika okuma' : 'min read'}
              </span>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
            <span className="text-sm text-gray-500">
              {language === 'tr' ? 'Paylaş:' : 'Share:'}
            </span>
            <button
              onClick={() => sharePost('twitter')}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => sharePost('linkedin')}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => sharePost('facebook')}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-zinc max-w-none
                     prose-headings:font-black prose-headings:text-white
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-white prose-a:underline prose-a:decoration-zinc-700 hover:prose-a:decoration-white
                     prose-strong:text-white prose-strong:font-bold
                     prose-code:text-white prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
                     prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
                     prose-blockquote:border-l-4 prose-blockquote:border-zinc-700 prose-blockquote:text-gray-400
                     prose-img:rounded-lg prose-img:border prose-img:border-zinc-800
                     prose-hr:border-zinc-800
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-li:marker:text-gray-500"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">
                {language === 'tr' ? 'Etiketler:' : 'Tags:'}
              </span>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

export default BlogPost
