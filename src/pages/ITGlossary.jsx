import { useState, useEffect } from 'react'
import { BookOpen, Search, Code, Network, Shield, Server, Cloud, Coffee, Zap, AlertTriangle } from 'lucide-react'

const ITGlossary = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const glossary = [
    {
      category: 'network',
      icon: Network,
      color: 'from-blue-600 to-cyan-600',
      title: 'Ağ (Networking)',
      terms: [
        {
          term: 'IP Address',
          aka: 'Internet Protocol Address',
          definition: 'Bilgisayarının internetteki ev adresi 🏠 Tıpkı gerçek hayattaki adresin gibi, ama burada posta yerine paketler geliyor.',
          example: '192.168.1.1 - En sevdiğin router\'ın adresi. "No place like 127.0.0.1" (home sweet home)',
          funFact: 'IPv4\'te 4.3 milyar adres var ama dünya nüfusu 8 milyar... matematik tutmadı, IPv6 geldi 😅'
        },
        {
          term: 'DNS',
          aka: 'Domain Name System',
          definition: 'İnternetin rehberi 📖 google.com yazdığında IP adresine çeviren magic sistem. DNS olmadan her siteye 142.250.185.206 yazman gerekirdi!',
          example: 'google.com → 142.250.185.206. DNS down olunca "internet çöktü" sanırsın ama aslında sadece rehber kayıp 🤷',
          funFact: 'DNS cache zehirlenmesi = Rehbere yanlış adres yazmak gibi. Kötü niyetli biri seni fake sitelere yönlendirebilir 😈'
        },
        {
          term: 'Subnet Mask',
          aka: 'Ağ Maskesi',
          definition: 'Network\'ünün komşularını belirleyen duvar 🧱 Hangi IP\'lerin aynı mahallede olduğunu söyler.',
          example: '255.255.255.0 - En klasik mask. "Bizim mahallede 254 ev var" demek',
          funFact: 'Subnet hesabı yapabiliyorsan artık junior değilsin, congrats! 🎉'
        },
        {
          term: 'Gateway',
          aka: 'Default Gateway',
          definition: 'Mahalleden dışarıya çıkış kapısı 🚪 Dış dünya ile konuşmak isteyen herkes buradan geçer.',
          example: 'Router\'ın IP adresi genelde gateway\'dir. Mahallenden internete çıkmak? Gateway\'e sor!',
          funFact: 'Gateway down = Mahalle karantinada. İnternet yok 😢'
        },
        {
          term: 'DHCP',
          aka: 'Dynamic Host Configuration Protocol',
          definition: 'Otomatik IP dağıtım servisi 🎰 Cihazına IP, subnet, gateway, DNS hepsini otomatik verir. Manuel IP yazmaktan kurtarır!',
          example: 'Kafede wifi\'ye bağlandın? DHCP sayesinde otomatik IP aldın. DHCP olmasa her cihaza elle IP yazacaktın 💀',
          funFact: 'DHCP lease süresi bitince IP geri alınır. Kira süresi bitti, ev boşalt! 🏠'
        },
        {
          term: 'MAC Address',
          aka: 'Media Access Control Address',
          definition: 'Cihazının doğuştan gelen kimlik numarası 🆔 Değiştirilemez (teoride). Her network kartının unique MAC\'i var.',
          example: '00:1A:2B:3C:4D:5E - Bu formatta 6 oktetlik hex değer. Spoofing yapmazsan değişmez',
          funFact: 'MAC filtering yapan ağlar var. "Sen giremezsin!" diyor MAC adresine bakarak 🚫'
        },
        {
          term: 'OSI Model',
          aka: '7 Katmanlı Model',
          definition: 'Networkin 7 katlı döneri 🌯 Her katman bir iş yapar. Physical\'dan Application\'a kadar layer layer!',
          example: 'Layer 1: Kablolar (fiziksel) → Layer 7: Chrome (uygulama). Mülakatlarda sorarlar, ezberle! 📚',
          funFact: 'Please Do Not Throw Sausage Pizza Away - OSI katmanlarını ezberlemek için mnemonic 🍕'
        },
        {
          term: 'TCP/IP',
          aka: 'Transmission Control Protocol',
          definition: 'İnternetin omurgası 🦴 Güvenilir veri iletimi sağlar. Paket kaybolursa tekrar gönderir.',
          example: 'Email, web browsing = TCP. Video streaming? UDP kullan, hız lazım!',
          funFact: '3-way handshake: SYN → SYN-ACK → ACK. Tanışma protokolü gibi: "Merhaba" → "Merhaba!" → "İyi günler" 👋'
        },
        {
          term: 'Firewall',
          aka: 'Güvenlik Duvarı',
          definition: 'Network\'ün kapı görevlisi 💂 İstenmeyen trafiği engelleyen koruma kalkanı.',
          example: 'Port 80 açık (HTTP), Port 22 kapalı (SSH). Firewall kuralları ile kim geçer kim geçmez belirlersin',
          funFact: 'Windows Firewall her zaman açık olmalı. Kapatma, kafana göre takılma! 🔥'
        },
        {
          term: 'VPN',
          aka: 'Virtual Private Network',
          definition: 'İnternette gizli tünel 🕵️ Şifreli bağlantı ile güvenli iletişim. Remote work\'ün en iyi arkadaşı!',
          example: 'Evden ofis network\'üne VPN ile bağlan. Sanki ofisteymiş gibi kaynaklara eriş',
          funFact: 'VPN kullanınca IP adresin değişir. "Ben Almanya\'dayım" diye Netflix\'i kandırma ama 😏'
        },
        {
          term: 'NAT',
          aka: 'Network Address Translation',
          definition: 'Private IP\'yi Public IP\'ye çeviren magic 🎩 Router\'ın en önemli işi!',
          example: '192.168.1.x → 85.123.x.x dönüşümü. İçerideki tüm cihazlar tek public IP kullanır',
          funFact: 'NAT sayesinde IPv4 hala yaşıyor. 4 milyar adres yetmedi ama NAT kurtardı! 🦸'
        },
        {
          term: 'Port Forwarding',
          aka: 'Port Yönlendirme',
          definition: 'Dışarıdan içeri giriş kapısı 🚪 Belirli port\'u içerideki cihaza yönlendir!',
          example: 'Port 3389\'u içerideki 192.168.1.5\'e forward et. RDP için gerekli!',
          funFact: 'Port forwarding = Güvenlik riski. Gerekmedikçe açma! 🔒'
        },
        {
          term: 'VLAN',
          aka: 'Virtual LAN',
          definition: 'Mantıksal network bölme 🗂️ Tek switch\'te birden fazla network oluştur!',
          example: 'VLAN 10 = Muhasebe, VLAN 20 = IT. Aynı switch ama farklı networkler!',
          funFact: 'VLAN hopping saldırısı var. VLAN\'lar arası atlamak! Dikkat! ⚠️'
        },
      ]
    },
    {
      category: 'windows',
      icon: Server,
      color: 'from-purple-600 to-pink-600',
      title: 'Windows Dünyası',
      terms: [
        {
          term: 'Active Directory',
          aka: 'AD / Domain',
          definition: 'Windows\'un kullanıcı ve bilgisayar veritabanı 👥 Merkezi yönetim için şart. Herkesin hesabı burada!',
          example: 'Domain Controller = AD\'nin beyni 🧠 Burası çökerse kimse login olamaz, panik mode 🚨',
          funFact: 'dcpromo komutu ile DC kurulurdu eskiden. Şimdi GUI var, kolay gelsin! 🎉'
        },
        {
          term: 'Group Policy (GPO)',
          aka: 'Grup İlkesi',
          definition: 'Toplu ayar yapma tool\'u ⚙️ Bir ayarı 1000 bilgisayara tek tuşla uygula. IT Admin\'in sihirli değneği!',
          example: 'Wallpaper değiştir, yazılım kur, USB\'yi devre dışı bırak - hepsi GPO ile!',
          funFact: 'gpupdate /force = "Şimdi uygula lan!" demek. Reboot bekleme 🔄'
        },
        {
          term: 'PowerShell',
          aka: 'PS / The Blue One',
          definition: 'Windows\'un süper güçlü command line\'ı 💪 CMD\'nin steroidli versiyonu. Automation king!',
          example: 'Get-Service, Start-Service, Stop-Service - Verb-Noun formatı. Oku oku ezberle!',
          funFact: 'PowerShell 7 artık cross-platform. Linux\'ta da çalışır, believe it! 🐧'
        },
        {
          term: 'Event Viewer',
          aka: 'Olay Görüntüleyicisi',
          definition: 'Windows\'un günlüğü 📔 Her olay kayıt altına alınır. Sorun çözmenin ilk durağı!',
          example: 'Error, Warning, Information - Log seviyeleri. Kırmızı bad, sarı meh, mavi good',
          funFact: 'Event ID 4624 = Successful login. 4625 = Failed login (şifre yanlış!) 🔐'
        },
        {
          term: 'Domain Controller',
          aka: 'DC',
          definition: 'Active Directory\'nin kalbi ❤️ Authentication, authorization hepsi buradan. En kritik server!',
          example: 'DC down = Kimse login olamaz. Yedek DC olmazsa panic time! 🆘',
          funFact: 'FSMO roles = DC\'nin özel görevleri. 5 tane var, interview\'larda sorarlar! 📝'
        },
        {
          term: 'NTFS',
          aka: 'New Technology File System',
          definition: 'Windows\'un dosya sistemi 📁 Permission\'lar, encryption, compression hepsi var!',
          example: 'FAT32\'den bin kat iyi. 4GB file limit yok, güvenlik var, modern şeyler var',
          funFact: 'NTFS permissions vs Share permissions - İkisi farklı! En kısıtlayıcı olanı kazanır 🏆'
        },
        {
          term: 'RDP',
          aka: 'Remote Desktop Protocol',
          definition: 'Uzaktan masaüstü bağlantısı 🖥️ Evden servera bağlanmanın Windows yolu. Port 3389!',
          example: 'mstsc.exe açarsın, IP yazarsın, login olursun. Boom, remote access! 💥',
          funFact: 'RDP brute-force saldırıları çok yaygın. Şifreni güçlü yap yoksa hack\'lenirsin! 🔓'
        },
        {
          term: 'DNS Server',
          aka: 'Alan Adı Sunucusu',
          definition: 'Domain isimlerini IP\'ye çeviren server 🔄 İnternetin telefon rehberi!',
          example: 'google.com ne IP\'miş? DNS\'e sor! Forward lookup = İsimden IP, Reverse = IP\'den isim',
          funFact: 'DNS cache poisoning ile fake sitelere yönlendirebilirsin. Kötülük yapma ama! 😈'
        },
        {
          term: 'PowerShell',
          aka: 'PS',
          definition: 'Windows\'un command-line süper gücü 💪 CMD\'nin gelişmiş versiyonu. Scripting king!',
          example: 'Get-Process, Get-Service - Verb-Noun formatı. Her şey object based!',
          funFact: 'PowerShell 7 cross-platform! Linux\'ta da çalışır artık 🐧'
        },
        {
          term: 'Windows Update',
          aka: 'WSUS / Update Servisi',
          definition: 'Windows\'un güncelleme sistemi 🔄 Security patch\'ler buradan gelir!',
          example: 'Patch Tuesday = Ayın 2. Salısı. Microsoft\'un patch günü',
          funFact: 'Windows Update kapatma! Ransomware gelir, ağlarsın sonra 😭'
        },
        {
          term: 'Hyper-V',
          aka: 'Windows Hypervisor',
          definition: 'Windows\'un VM motoru 🖥️ Sanal makineler oluştur, Windows Server\'da built-in!',
          example: 'Generation 1 vs Generation 2 VM. Gen2 daha yeni, UEFI destekler',
          funFact: 'Hyper-V açıkken VMware/VirtualBox yavaşlar. Type-1 hypervisor etkisi! ⚡'
        },
      ]
    },
    {
      category: 'security',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      title: 'Güvenlik (Security)',
      terms: [
        {
          term: 'Firewall',
          aka: 'Güvenlik Duvarı',
          definition: 'Network trafiğinin kapıcısı 🚪 İzin verilenler geçer, diğerleri out!',
          example: 'Inbound rules, Outbound rules - Kim gelir, kim gider kuralları',
          funFact: 'Stateful firewall = Akıllı firewall. Connection\'ları hatırlar! 🧠'
        },
        {
          term: 'Encryption',
          aka: 'Şifreleme',
          definition: 'Verileri okunamaz hale getirme 🔐 Key olmadan açamazsın. Güvenliğin temelidir!',
          example: 'AES-256 = Güçlü encryption. Brute-force ile kırılması milyarlarca yıl sürer 💪',
          funFact: 'HTTPS = HTTP + SSL/TLS. Asma kilit görmek istiyoruz browser\'da! 🔒'
        },
        {
          term: 'SSL/TLS',
          aka: 'Secure Sockets Layer',
          definition: 'Web trafiğini şifreleyen protokol 🌐 HTTPS\'in sırrı budur!',
          example: 'Certificate check et, public/private key kullan, encrypted communication yap',
          funFact: 'SSL artık deprecated. TLS 1.3 kullan! SSL demek alışkanlık olmuş ama 😅'
        },
        {
          term: 'Two-Factor Authentication',
          aka: '2FA / MFA',
          definition: 'Çift kilitli güvenlik 🔑🔑 Şifre + SMS/App code. Bir tanesi yetmez!',
          example: 'Microsoft Authenticator, Google Authenticator - OTP code\'lar üretir',
          funFact: 'SMS-based 2FA < App-based 2FA < Hardware key (YubiKey). Güvenlik seviyeleri! 📈'
        },
        {
          term: 'Phishing',
          aka: 'Oltalama',
          definition: 'Fake email/site ile kullanıcıyı kandırma 🎣 "Şifreni ver" tarzı dolandırıcılık!',
          example: 'PayPal\'dan geldi sandın, aslında p4ypa1.com\'dan gelmiş. Dikkat et!',
          funFact: 'Spear phishing = Hedefe özel phishing. "Cemal Bey, ASIL mesaj bu!" tarzı 🎯'
        },
        {
          term: 'Malware',
          aka: 'Kötü Amaçlı Yazılım',
          definition: 'Zararlı software genel adı 🦠 Virus, trojan, ransomware hepsi malware kategorisi!',
          example: 'Antivirus kullan, şüpheli linklere tıklama, update\'leri yap. Prevention is key! 💉',
          funFact: 'Ransomware = Dosyalarını şifreler, para ister. "Pay or cry!" 😭💰'
        },
        {
          term: 'Zero-Day',
          aka: 'Sıfırıncı Gün',
          definition: 'Henüz bilinmeyen güvenlik açığı 🕳️ Vendor bile bilmiyor, patch yok. En tehlikelisi!',
          example: 'Zero-day exploit kullanılırsa savunma yok. Ertesi gün patch çıkar ama late!',
          funFact: 'Zero-day pazarında exploit\'ler milyonlarca dolara satılır 💸'
        },
        {
          term: 'Penetration Testing',
          aka: 'Pentest / Ethical Hacking',
          definition: 'Yasal hacking 🎩 Sistemdeki açıkları bulmak için simüle saldırı yapmak.',
          example: 'Red team (saldırganlar) vs Blue team (savunucular). Savaş oyunu ama gerçek! ⚔️',
          funFact: 'CEH, OSCP = Popüler pentest sertifikaları. Hacker olmak istersen al! 🏅'
        },
      ]
    },
    {
      category: 'cloud',
      icon: Cloud,
      color: 'from-cyan-600 to-blue-600',
      title: 'Cloud (Bulut)',
      terms: [
        {
          term: 'SaaS',
          aka: 'Software as a Service',
          definition: 'Yazılım hizmeti olarak 📧 Kurulum yok, tarayıcıdan kullan. Gmail, Office 365 gibi!',
          example: 'Subscription öde, kullan. Server yönetimi yok, update yok, rahat ol! 😎',
          funFact: 'IaaS < PaaS < SaaS. Sorumluluk azalıyor, kolaylık artıyor! 📊'
        },
        {
          term: 'IaaS',
          aka: 'Infrastructure as a Service',
          definition: 'Altyapı hizmeti 🏗️ VM, storage, network kirala. AWS EC2, Azure VM işte bu!',
          example: 'Fiziksel server almaya gerek yok, cloud\'dan kirala. Scale up/down kolay',
          funFact: 'Pay-as-you-go model. Kullandığın kadar öde, Netflix gibi! 💳'
        },
        {
          term: 'PaaS',
          aka: 'Platform as a Service',
          definition: 'Platform hizmeti 🚀 Sadece code yaz, infrastructure işi cloud\'un!',
          example: 'Azure App Service, Heroku - Deploy et, git. Server config? Not your problem! 🎉',
          funFact: 'Developer\'lar için cennet. Sadece kod yaz, deployment magic! ✨'
        },
        {
          term: 'Virtual Machine',
          aka: 'VM / Sanal Makine',
          definition: 'Bilgisayar içinde bilgisayar 🖥️ Tek fiziksel makinede birden çok OS çalıştır!',
          example: 'VMware, Hyper-V, VirtualBox - Hepsi VM teknolojisi',
          funFact: 'Snapshot al, bozunca geri dön. Time travel gibi! ⏰'
        },
        {
          term: 'Azure',
          aka: 'Microsoft Azure',
          definition: 'Microsoft\'un cloud platformu ☁️ AWS\'nin rakibi. Enterprise\'lar seviyor!',
          example: 'Azure AD, Azure VMs, Azure Functions - Her şey var!',
          funFact: 'Azure certification = Pahalı ama değerli. Az-900\'dan başla! 🎓'
        },
        {
          term: 'AWS',
          aka: 'Amazon Web Services',
          definition: 'Amazon\'un cloud platformu 🚀 Cloud market leader. En büyüğü!',
          example: 'EC2, S3, Lambda - Servisleri sayıyla 200+',
          funFact: 'AWS\'nin geliri Amazon perakende işinden fazla! Cloud business king 👑'
        },
        {
          term: 'Load Balancer',
          aka: 'Yük Dengeleyici',
          definition: 'Traffic\'i dağıtan sistem ⚖️ Tek server overload olmasın diye yükü böler!',
          example: 'Round-robin, least connection - Farklı algoritmalar var',
          funFact: 'High availability için şart. Bir server down olsa diğeri devam eder! 💪'
        },
        {
          term: 'CDN',
          aka: 'Content Delivery Network',
          definition: 'İçerik dağıtım ağı 🌍 Statik dosyaları dünya çapında cache\'leyip hızlı sunar!',
          example: 'Cloudflare, Akamai - Video, resim gibi büyük dosyalar için mükemmel',
          funFact: 'Türkiye\'den siteye girdin ama content İstanbul\'daki CDN node\'dan geldi. Latency azaldı! 🚀'
        },
      ]
    },
    {
      category: 'general',
      icon: Code,
      color: 'from-green-600 to-emerald-600',
      title: 'Genel IT Kavramlar',
      terms: [
        {
          term: 'API',
          aka: 'Application Programming Interface',
          definition: 'Yazılımlar arası iletişim kuralları 🔌 Bir uygulama diğerine nasıl konuşur? API ile!',
          example: 'REST API, GraphQL - Farklı API tipleri. JSON ile data alışverişi yaparlar',
          funFact: 'Rate limiting = API\'ye çok istek atma, ban yersin! 429 Too Many Requests 🚫'
        },
        {
          term: 'JSON',
          aka: 'JavaScript Object Notation',
          definition: 'Veri formatı 📋 Key-value çiftleri ile data taşıma. Human-readable ve machine-friendly!',
          example: '{"name": "Cemal", "role": "IT Admin"} - Bu kadar basit!',
          funFact: 'XML\'den çok daha temiz. JSON kazandı savaşı! 🏆'
        },
        {
          term: 'SSH',
          aka: 'Secure Shell',
          definition: 'Güvenli uzak bağlantı protokolü 🔐 Linux server\'lara bağlanmanın yolu!',
          example: 'ssh user@server - Port 22. Key-based auth kullan, passwordless giriş! 🗝️',
          funFact: 'SSH tunneling ile VPN gibi kullanabilirsin. Port forwarding magic! ✨'
        },
        {
          term: 'Docker',
          aka: 'Container Platform',
          definition: 'Uygulama containerization 📦 VM\'den hafif, dependency hell\'den kurtarır!',
          example: 'Dockerfile yaz, image build et, container run et. "Works on my machine" artık yok!',
          funFact: 'Docker Compose ile multi-container app\'ler çalıştır. Tek komutla! 🐳'
        },
        {
          term: 'Git',
          aka: 'Version Control',
          definition: 'Kod versiyon kontrol sistemi 📝 Kim ne değiştirdi, geri al, merge et!',
          example: 'git commit, git push, git pull - Günlük komutlar. GitHub = Git hosting',
          funFact: 'Linus Torvalds Git\'i 2005\'te yarattı. Linux kernel için! 🐧'
        },
        {
          term: 'CI/CD',
          aka: 'Continuous Integration/Deployment',
          definition: 'Otomatik build & deploy 🤖 Code push et, otomatik test, otomatik deploy!',
          example: 'Jenkins, GitHub Actions, GitLab CI - Pipeline\'lar kur, automation yap',
          funFact: 'Manuel deployment artık eski moda. CI/CD kurulmayan proje yok! 🚀'
        },
        {
          term: 'Database',
          aka: 'Veritabanı / DB',
          definition: 'Veri depolama sistemi 🗄️ Structured data için. SQL ya da NoSQL!',
          example: 'MySQL, PostgreSQL = SQL. MongoDB, Redis = NoSQL. İhtiyaca göre seç',
          funFact: 'SQL injection = En yaygın saldırı. Prepared statements kullan! 💉'
        },
        {
          term: 'Backup',
          aka: 'Yedekleme',
          definition: 'Veri kopyalama 💾 Felaket durumunda kurtarma için. En önemli iş!',
          example: '3-2-1 rule: 3 kopya, 2 farklı medya, 1 offsite. Unutma bunu! 📦',
          funFact: 'Backup\'ın olmadığını production\'da anlarsın. Test et backup\'ları! 🆘'
        },
        {
          term: 'Latency',
          aka: 'Gecikme',
          definition: 'Network gecikmesi ⏱️ İstek-cevap arası süre. Düşük olmalı!',
          example: 'Ping 10ms = Good. Ping 200ms = Bad. Gaming\'de latency kritik! 🎮',
          funFact: 'Fiber optik < DSL < Uydu. Latency sıralaması! 🚀'
        },
        {
          term: 'Bandwidth',
          aka: 'Bant Genişliği',
          definition: 'Network kapasitesi 🚰 Saniyede ne kadar veri geçer? Mbps/Gbps ile ölçülür!',
          example: '100 Mbps internet = Saniyede 12.5 MB download. Matematikkk! 🧮',
          funFact: 'Bandwidth ≠ Speed. Bandwidth = Boru çapı, latency = Su basıncı! 💧'
        },
      ]
    },
    {
      category: 'troubleshoot',
      icon: AlertTriangle,
      color: 'from-yellow-600 to-amber-600',
      title: 'Sorun Giderme (Troubleshooting)',
      terms: [
        {
          term: 'Blue Screen (BSOD)',
          aka: 'Mavi Ekran Hatası',
          definition: 'Windows\'un ölüm ekranı 💀 Critical error olunca çıkar. Restart gerekir!',
          example: 'STOP code\'u oku, Google\'la. Driver sorunu çoğunlukla',
          funFact: 'BSOD çıktığında panik yapma. Error code\'u yaz, araştır! 🔍'
        },
        {
          term: 'Ping',
          aka: 'Network Test',
          definition: 'Bağlantı testi 🏓 Karşı tarafa paket gönder, cevap gelirse network OK!',
          example: 'ping google.com - 4 paket gönderilir. Reply gelirse bağlantı var!',
          funFact: 'Ping flood = Saldırı türü. Çok ping atıp serveri yavaşlatmak! 🚨'
        },
        {
          term: 'Traceroute',
          aka: 'tracert / Route Tracing',
          definition: 'Paket yol haritası 🗺️ Hedefe nasıl gidildiğini gösterir. Hop by hop!',
          example: 'tracert google.com - Hangi router\'lardan geçti gösterir',
          funFact: 'Yavaşlık nerede? Traceroute ile bul! Bottleneck tespit! 🎯'
        },
        {
          term: 'Event Logs',
          aka: 'Sistem Logları',
          definition: 'Windows\'un kayıt defteri 📔 Her olay yazılır. Sorun çözmede ilk bakmak!',
          example: 'Application, System, Security logs - Üç ana kategori',
          funFact: 'Error log\'u yok = Sorun yok. Error var = Debug time! 🐛'
        },
        {
          term: 'Safe Mode',
          aka: 'Güvenli Mod',
          definition: 'Windows\'un minimal başlatma modu 🛡️ Driver sorunu varsa buradan düzelt!',
          example: 'F8 tuşu (eski), Shift+Restart (yeni). Minimal driver ile boot!',
          funFact: 'Safe mode\'da bile boot olmazsa hardware sorunu olabilir! 🔧'
        },
        {
          term: 'Task Manager',
          aka: 'Görev Yöneticisi',
          definition: 'Windows\'un resource monitörü 📊 CPU, RAM, Disk, Network - hepsi burada!',
          example: 'Ctrl+Shift+Esc - Hangi process CPU yiyor? Task Manager\'a bak!',
          funFact: 'Chrome RAM monster? Task Manager açık bırak, monitoring yap! 👀'
        },
        {
          term: 'System Restore',
          aka: 'Sistem Geri Yükleme',
          definition: 'Windows\'un zaman makinesi ⏰ Eski restore point\'e geri dön. Undo button!',
          example: 'Update sonrası sorun mu var? Restore point\'e geri dön!',
          funFact: 'Restore point yoksa yazık! Düzenli oluştur! 💾'
        },
        {
          term: 'CHKDSK',
          aka: 'Check Disk',
          definition: 'Disk kontrol aracı 🔍 Bad sector varsa bul, düzelt. File system repair!',
          example: 'chkdsk /f /r - Full scan & repair. Uzun sürer ama detaylı!',
          funFact: 'SSD\'de CHKDSK dikkatli kullan. Ömrünü kısaltabilir! ⚠️'
        },
      ]
    },
  ]

  const categories = [
    { id: 'all', name: 'Tümü', icon: BookOpen },
    { id: 'network', name: 'Ağ (Networking)', icon: Network },
    { id: 'windows', name: 'Windows', icon: Server },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'cloud', name: 'Bulut', icon: Cloud },
    { id: 'general', name: 'Genel IT', icon: Code },
    { id: 'troubleshoot', name: 'Sorun Giderme', icon: AlertTriangle },
  ]

  const filteredGlossary = glossary.filter(cat =>
    selectedCategory === 'all' || cat.category === selectedCategory
  )

  const searchedGlossary = filteredGlossary.map(cat => ({
    ...cat,
    terms: cat.terms.filter(term =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.aka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.terms.length > 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`text-center space-y-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-orange-600 animate-pulse-slow" />
          IT Sözlük 📖
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Yeni Başlayanlar İçin IT Terimleri - Cemal Edition 😎
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          "Google amca yetmez, buradan da öğren!" ~ Cemal
        </p>
      </div>

      {/* Fun Warning */}
      <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-orange-600 p-4 rounded-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <Coffee className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="text-sm text-orange-800 dark:text-orange-300">
            <strong>Dikkat:</strong> Bu sözlük eğlenceli ve Cemal tarzında yazılmıştır. Ciddi IT dökümanı arıyorsan Microsoft Docs'a git!
            Burası pratik bilgi için ideal.
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Terim ara... (örn: DNS, PowerShell, API)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Glossary Categories */}
      {searchedGlossary.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Hiçbir sonuç bulunamadı! 😅</p>
          <p className="text-sm mt-2">Farklı terim ara veya filtreyi değiştir</p>
        </div>
      ) : (
        searchedGlossary.map((category, catIdx) => {
          const CategoryIcon = category.icon
          return (
            <div
              key={category.category}
              className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${300 + catIdx * 100}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.terms.length} terim</p>
                </div>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.terms.map((term, termIdx) => (
                  <div
                    key={termIdx}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl hover:scale-[1.02] space-y-3"
                  >
                    {/* Term Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{term.term}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{term.aka}</p>
                      </div>
                      <Zap className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    </div>

                    {/* Definition */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {term.definition}
                    </p>

                    {/* Example */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border-l-4 border-orange-500">
                      <p className="text-sm text-orange-900 dark:text-orange-200">
                        <strong>Örnek:</strong> {term.example}
                      </p>
                    </div>

                    {/* Fun Fact */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        <strong>💡 Fun Fact:</strong> {term.funFact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Footer Note */}
      <div className={`bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🎓 <strong>Pro İpucu:</strong> Bu terimleri Google'layıp derinlemesine öğren. Burası sadece giriş!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Eksik terim mi var? Hata mı buldun? GitHub'da PR at bro! 🚀
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
            🧡 Pervo, Redbull ve biraz birşeyler ile yapıldı - Cemal Demirci
          </p>
        </div>
      </div>
    </div>
  )
}

export default ITGlossary
