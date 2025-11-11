import { Link } from 'react-router-dom'
import { Home, Search, AlertTriangle } from 'lucide-react'
import CemalLogo from '../components/CemalLogo'
import { useLanguage } from '../contexts/LanguageContext'

const NotFound = () => {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <CemalLogo size="medium" showDecorations={false} />

        {/* Error Code */}
        <div className="relative">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </div>

        {/* Message */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white mb-4">
            {language === 'tr' ? 'Burası Bile Çalışıyor, Senin Link mi Bozuk?' : 'This Page Works, Is Your Link Broken?'}
          </h2>
          <p className="text-xl text-blue-100/70 mb-6">
            {language === 'tr'
              ? 'Aradığın sayfa bulunamadı. Ya yanlış yazdın, ya ben sildim, ya da evrenin bir planı var.'
              : 'Page not found. Either you typed it wrong, I deleted it, or the universe has a plan.'}
          </p>

          <div className="space-y-3">
            <p className="text-sm text-blue-100/60 italic">
              {language === 'tr'
                ? '"Ben production\'da bile 404 almamıştım..." - Siz, muhtemelen'
                : '"I never got a 404 even in production..." - You, probably'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            <Search className="w-5 h-5" />
            {language === 'tr' ? 'Araçlara Bak' : 'Browse Tools'}
          </Link>
        </div>

        {/* Fun Fact */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <p className="text-sm text-blue-200">
            <strong>{language === 'tr' ? 'Fun Fact:' : 'Fun Fact:'}</strong> {language === 'tr'
              ? 'Bu 404 sayfasını görmek için özel link oluşturdum. Yani bu bile bir feature. Profesyonelliğimin seviyesine bak.'
              : 'I created a special link to see this 404 page. So this is also a feature. Look at my level of professionalism.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
