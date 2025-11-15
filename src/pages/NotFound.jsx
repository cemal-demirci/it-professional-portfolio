import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const NotFound = () => {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-10 -z-10" />

      {/* Noise texture */}
      <div className="fixed inset-0 noise-texture -z-10" />

      {/* Banksy graffiti */}
      <div className="absolute top-20 right-12 transform rotate-12 opacity-10">
        <p className="text-8xl font-black text-white stencil-text">404</p>
      </div>
      <div className="absolute bottom-20 left-12 transform -rotate-6 opacity-10">
        <p className="text-6xl font-black text-white stencil-text">LOST</p>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Lost Map - Only shows "You are here" marker, surroundings are blurred/hidden */}
        <div className="mb-12 relative inline-block">
          <div className="w-64 h-64 bg-zinc-900 border-4 border-zinc-800 rounded-lg relative overflow-hidden">
            {/* Blurred/obscured background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-80"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)',
            }}></div>

            {/* "You are here" marker in the center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Pin */}
                <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <div className="w-1 h-6 bg-red-500 mx-auto"></div>

                {/* Label */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white text-black px-3 py-1 rounded text-sm font-bold">
                    {language === 'en' ? 'You are here' : 'Buradasınız'}
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Question marks scattered around (representing unknown surroundings) */}
            <div className="absolute top-4 left-4 text-zinc-700 text-3xl opacity-50">?</div>
            <div className="absolute top-8 right-6 text-zinc-700 text-2xl opacity-40">?</div>
            <div className="absolute bottom-6 left-8 text-zinc-700 text-4xl opacity-30">?</div>
            <div className="absolute bottom-4 right-4 text-zinc-700 text-3xl opacity-50">?</div>
          </div>

          {/* Map label */}
          <div className="mt-4 text-gray-500 text-sm italic">
            {language === 'en' ? '(Surroundings unknown)' : '(Çevre bilinmiyor)'}
          </div>
        </div>

        {/* 404 Content */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4">404</h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {language === 'en'
            ? 'Lost? Google Maps doesn\'t track you here'
            : 'Kayboldu mu? Google Maps burada seni takip etmiyor'}
        </h2>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          {language === 'en'
            ? 'This page doesn\'t exist. Unlike Big Tech, we don\'t track your every move, so we can\'t tell you where you went wrong. But hey, at least your privacy is intact! 🎉'
            : 'Bu sayfa yok. Big Tech\'in aksine her hareketini takip etmiyoruz, bu yüzden nerede hata yaptığını söyleyemeyiz. Ama hey, en azından gizliliğin bozulmamış! 🎉'}
        </p>

        {/* Satirical suggestions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-white font-bold mb-4">
            {language === 'en' ? 'Random Suggestions:' : 'Rastgele Öneriler:'}
          </h3>
          <ul className="space-y-2 text-left text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-white">→</span>
              <span>{language === 'en' ? 'Check if you\'re still being tracked by Google (spoiler: you are)' : 'Hala Google tarafından izlenip izlenmediğini kontrol et (spoiler: izleniyorsun)'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white">→</span>
              <span>{language === 'en' ? 'Try typing the URL correctly (radical idea, I know)' : 'URL\'yi doğru yazmayı dene (radikal fikir, biliyorum)'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white">→</span>
              <span>{language === 'en' ? 'Accept that not everything needs to exist' : 'Her şeyin var olması gerekmediğini kabul et'}</span>
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all duration-150"
          >
            <Home className="w-5 h-5" />
            {language === 'en' ? 'Go Home' : 'Ana Sayfaya Dön'}
          </Link>

          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white rounded-lg font-semibold border border-zinc-800 hover:border-zinc-600 transition-all duration-150"
          >
            <Search className="w-5 h-5" />
            {language === 'en' ? 'Browse Tools' : 'Araçlara Göz At'}
          </Link>
        </div>

        {/* Footer sarcasm */}
        <div className="mt-12 text-gray-600 text-sm italic">
          {language === 'en'
            ? 'P.S. We would track this 404 error, but we respect your privacy. Weird, right?'
            : 'Not: Bu 404 hatasını takip ederdik ama gizliliğine saygı duyuyoruz. Garip değil mi?'}
        </div>
      </div>
    </div>
  )
}

export default NotFound
