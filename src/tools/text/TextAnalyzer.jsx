import { useState, useEffect } from 'react'
import { Brain, BarChart3, TrendingUp, FileText, Key, Sparkles, AlertCircle, Zap } from 'lucide-react'
import { analyzeWithGemini, getRemainingRequests, SARCASTIC_MESSAGES, getRandomMessage } from '../../services/geminiService'

const TextAnalyzer = () => {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [remainingRequests, setRemainingRequests] = useState(null)

  useEffect(() => {
    setIsVisible(true)
    updateRemainingRequests()
  }, [])

  const updateRemainingRequests = async () => {
    const remaining = await getRemainingRequests()
    setRemainingRequests(remaining)
  }

  const analyzeText = async () => {
    if (!text.trim()) {
      setError(getRandomMessage(SARCASTIC_MESSAGES.noInput()))
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      // Basic statistics (instant)
      const words = text.trim().split(/\s+/)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)
      const characters = text.length
      const charactersNoSpaces = text.replace(/\s/g, '').length

      // Average calculations
      const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length || 0
      const avgSentenceLength = words.length / sentences.length || 0

      // Reading time (assuming 200 words per minute)
      const readingTime = Math.ceil(words.length / 200)

      // Simple sentiment (instant, before AI)
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'best', 'awesome']
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing', 'useless']

      const lowerText = text.toLowerCase()
      const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
      const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length

      let quickSentiment = 'Neutral'
      if (positiveCount > negativeCount) quickSentiment = 'Positive'
      else if (negativeCount > positiveCount) quickSentiment = 'Negative'

      // Readability Score (Flesch Reading Ease)
      const syllables = words.reduce((sum, word) => {
        return sum + Math.max(1, word.match(/[aeiouy]+/gi)?.length || 1)
      }, 0)
      const readabilityScore = Math.max(0, Math.min(100,
        206.835 - 1.015 * avgSentenceLength - 84.6 * (syllables / words.length)
      ))

      let readabilityLevel = 'Very Easy'
      if (readabilityScore < 30) readabilityLevel = 'Very Difficult'
      else if (readabilityScore < 50) readabilityLevel = 'Difficult'
      else if (readabilityScore < 60) readabilityLevel = 'Fairly Difficult'
      else if (readabilityScore < 70) readabilityLevel = 'Standard'
      else if (readabilityScore < 80) readabilityLevel = 'Fairly Easy'
      else if (readabilityScore < 90) readabilityLevel = 'Easy'

      // Keywords (instant)
      const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were']
      const wordFreq = {}
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (cleanWord.length > 3 && !stopWords.includes(cleanWord)) {
          wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
        }
      })

      const keywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

      setAnalysis({
        statistics: {
          words: words.length,
          characters,
          charactersNoSpaces,
          sentences: sentences.length,
          paragraphs: paragraphs.length,
          avgWordLength: avgWordLength.toFixed(2),
          avgSentenceLength: avgSentenceLength.toFixed(2),
          readingTime
        },
        quickSentiment,
        readability: {
          score: readabilityScore.toFixed(1),
          level: readabilityLevel
        },
        keywords
      })

      // AI Analysis (uses quota)
      const systemInstruction = `You are an expert text analyst and writing coach. Analyze the provided text and return a JSON response with this EXACT structure:

{
  "sentiment": {
    "overall": "Positive/Negative/Neutral/Mixed",
    "confidence": 85,
    "tone": ["professional", "formal", "enthusiastic"],
    "emotions": ["joy", "confidence", "optimism"],
    "explanation": "Brief explanation of the sentiment analysis"
  },
  "quality": {
    "clarity": 8,
    "coherence": 9,
    "engagement": 7,
    "overallScore": 8,
    "strengths": ["Clear arguments", "Good structure"],
    "weaknesses": ["Could use more examples", "Some repetition"]
  },
  "suggestions": [
    "Consider adding more concrete examples to support your arguments",
    "Vary sentence length for better rhythm",
    "The conclusion could be stronger"
  ],
  "keyThemes": ["technology", "innovation", "future"],
  "writingStyle": "Academic and informative with a forward-looking perspective",
  "targetAudience": "Technical professionals and business leaders"
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no extra text.`

      const aiResponse = await analyzeWithGemini(
        `Analyze this text:\n\n${text}`,
        systemInstruction
      )

      // Parse AI response
      try {
        const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsedAI = JSON.parse(cleanedResponse)
        setAiAnalysis(parsedAI)
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        setAiAnalysis({
          sentiment: {
            overall: quickSentiment,
            confidence: 70,
            tone: ['standard'],
            emotions: [],
            explanation: aiResponse.substring(0, 200) + '...'
          },
          quality: {
            clarity: 7,
            coherence: 7,
            engagement: 7,
            overallScore: 7,
            strengths: ['Readable content'],
            weaknesses: []
          },
          suggestions: [aiResponse],
          keyThemes: keywords.slice(0, 5).map(k => k.word),
          writingStyle: 'General',
          targetAudience: 'General audience'
        })
      }

      await updateRemainingRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    const colors = {
      'Positive': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
      'Negative': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
      'Neutral': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50',
      'Mixed': 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
    }
    return colors[sentiment] || colors['Neutral']
  }

  const exampleText = `Artificial Intelligence is transforming the world as we know it. This revolutionary technology has the potential to solve complex problems and improve countless aspects of our daily lives. From healthcare to transportation, AI is making significant impacts.

However, it's important to approach this technology responsibly. We must ensure that AI systems are developed ethically and with proper oversight. The future of AI depends on how we manage its development today.

Overall, the prospects are exciting and full of promise. With careful planning and execution, AI can help create a better world for everyone.`

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className={`text-center space-y-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse-slow" />
          AI Text Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced AI-powered text analysis with sentiment, quality assessment, and writing suggestions
        </p>
        {remainingRequests !== null && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ⚡ {remainingRequests} AI analyses remaining today
          </div>
        )}
      </div>

      {/* Quota Warning */}
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-600 p-4 rounded-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-800 dark:text-purple-300">
            <strong>AI-Powered Analysis:</strong> This tool uses Cemal AI for advanced sentiment analysis, quality scoring, and personalized writing suggestions. Each analysis counts toward your daily quota.
          </div>
        </div>
      </div>

      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Analyze
          </label>
          <button
            onClick={() => setText(exampleText)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Load Example
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="textarea-field min-h-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        <button
          onClick={analyzeText}
          disabled={!text.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Zap className="w-5 h-5 animate-pulse" />
              Analyzing with AI... ⚡
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Analyze with AI
            </>
          )}
        </button>

        {analysis && (
          <div className="space-y-6 pt-4">
            {/* Basic Statistics */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Text Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(analysis.statistics).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Sentiment Analysis */}
            {aiAnalysis && (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Sentiment Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${getSentimentColor(aiAnalysis.sentiment.overall)}`}>
                      <div className="text-sm mb-1">Overall Sentiment</div>
                      <div className="text-2xl font-bold">{aiAnalysis.sentiment.overall}</div>
                      <div className="text-sm mt-2">Confidence: {aiAnalysis.sentiment.confidence}%</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">Detected Tone</div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.sentiment.tone.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {aiAnalysis.sentiment.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{aiAnalysis.sentiment.explanation}</p>
                    </div>
                  )}
                </div>

                {/* AI Quality Assessment */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Quality Assessment
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Clarity</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{aiAnalysis.quality.clarity}/10</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="text-xs text-green-600 dark:text-green-400 mb-1">Coherence</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">{aiAnalysis.quality.coherence}/10</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Engagement</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{aiAnalysis.quality.engagement}/10</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg">
                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Overall</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{aiAnalysis.quality.overallScore}/10</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">✓ Strengths</div>
                      <ul className="space-y-1">
                        {aiAnalysis.quality.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-green-600 dark:text-green-400">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                      <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-2">⚠ Areas to Improve</div>
                      <ul className="space-y-1">
                        {aiAnalysis.quality.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-yellow-600 dark:text-yellow-400">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Writing Suggestions
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.suggestions.map((suggestion, i) => (
                      <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-start gap-3">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">{i + 1}.</span>
                        <p className="text-sm text-purple-800 dark:text-purple-200">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Themes & Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Key Themes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.keyThemes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Writing Style
                    </h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{aiAnalysis.writingStyle}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Target Audience:</strong> {aiAnalysis.targetAudience}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Readability */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Readability Score
              </h3>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Flesch Reading Ease</div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {analysis.readability.score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Difficulty Level</div>
                    <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      {analysis.readability.level}
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.readability.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Top Keywords (Frequency)
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((kw, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {kw.word}
                    </span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      ({kw.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About This Tool</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-purple-600 dark:text-purple-400">🤖 AI-Powered Analysis:</strong> Uses Cemal AI to provide advanced sentiment analysis, quality scoring, and personalized writing suggestions.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Sentiment Analysis:</strong> AI identifies emotional tone, confidence level, and writing emotions.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Quality Assessment:</strong> Evaluates clarity, coherence, engagement, and provides actionable feedback.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Writing Suggestions:</strong> AI-generated recommendations to improve your writing.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Readability Score:</strong> Based on Flesch Reading Ease formula.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TextAnalyzer
