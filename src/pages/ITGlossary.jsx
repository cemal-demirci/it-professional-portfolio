import { useState, useEffect } from 'react'
import { BookOpen, Search, Code, Network, Shield, Server, Cloud, Zap, AlertTriangle, Database, HardDrive, Terminal, Globe, Mail, Activity, Cpu, Folder, Lock, Wrench } from 'lucide-react'

const ITGlossary = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stats, setStats] = useState({ categories: 0, terms: 0 })

  useEffect(() => {
    setIsVisible(true)
    const totalCategories = glossary.length
    const totalTerms = glossary.reduce((acc, cat) => acc + cat.terms.length, 0)
    setStats({ categories: totalCategories, terms: totalTerms })
  }, [])

  const glossary = [
    {
      category: 'network',
      icon: Network,
      color: 'from-blue-600 to-cyan-600',
      title: '🌐 Ağ (Networking)',
      terms: [
        {
          term: 'IP Address',
          aka: 'Internet Protocol Address',
          definition: 'Bilgisayarının internetteki ev adresi 🏠 Tıpkı gerçek hayattaki adresin gibi, ama burada posta yerine paketler geliyor.',
          example: '192.168.1.1 - En sevdiğin router\'ın adresi. "No place like 127.0.0.1" (home sweet home)',
          funFact: 'IPv4\'te 4.3 milyar adres var ama dünya nüfusu 8 milyar... matematik tutmadı, IPv6 geldi 😅',
          interview: 'Mülakatta sorarlar: IPv4 vs IPv6 farkı nedir? Cevap: Adres uzunluğu (32 bit vs 128 bit)'
        },
        {
          term: 'DNS',
          aka: 'Domain Name System',
          definition: 'İnternetin rehberi 📖 google.com yazdığında IP adresine çeviren magic sistem. DNS olmadan her siteye 142.250.185.206 yazman gerekirdi!',
          example: 'google.com → 142.250.185.206. DNS down olunca "internet çöktü" sanırsın ama aslında sadece rehber kayıp 🤷',
          funFact: 'DNS cache zehirlenmesi = Rehbere yanlış adres yazmak gibi. Kötü niyetli biri seni fake sitelere yönlendirebilir 😈',
          interview: 'DNS port numarası? 53! Unutma bunu, çok sorarlar'
        },
        {
          term: 'Subnet Mask',
          aka: 'Ağ Maskesi',
          definition: 'Network\'ünün komşularını belirleyen duvar 🧱 Hangi IP\'lerin aynı mahallede olduğunu söyler.',
          example: '255.255.255.0 = /24 = 254 host. Subnet hesabı bilmeyen IT admin olmaz!',
          funFact: 'CIDR notation ile /24, /25, /26 yazarsın. Kolay yol! 🎯',
          interview: '192.168.1.0/26 kaç host? Cevap: 62 usable host (64 - network - broadcast)'
        },
        {
          term: 'Gateway',
          aka: 'Default Gateway',
          definition: 'Mahalleden dışarıya çıkış kapısı 🚪 Dış dünya ile konuşmak isteyen herkes buradan geçer.',
          example: 'Router\'ın IP adresi genelde gateway\'dir. 192.168.1.1 klasiktir',
          funFact: 'Gateway down = Mahalle karantinada. İnternet yok 😢',
          interview: 'Default gateway nedir? Cevap: Local network dışına çıkmak için kullanılan IP adresi'
        },
        {
          term: 'DHCP',
          aka: 'Dynamic Host Configuration Protocol',
          definition: 'Otomatik IP dağıtım servisi 🎰 Cihazına IP, subnet, gateway, DNS hepsini otomatik verir.',
          example: 'DHCP server olmasa her cihaza elle IP yazacaksın. 1000 cihaz = 1000 kere IP yazma 💀',
          funFact: 'DHCP lease süresi bitince IP geri alınır. Evden atılırsın! 🏠',
          interview: 'DHCP hangi portları kullanır? 67 (server) ve 68 (client)'
        },
        {
          term: 'MAC Address',
          aka: 'Media Access Control Address',
          definition: 'Cihazının doğuştan gelen kimlik numarası 🆔 Her network kartının unique MAC\'i var.',
          example: '00:1A:2B:3C:4D:5E - Bu formatta 6 oktetlik hex değer',
          funFact: 'MAC spoofing ile değiştirebilirsin. Ama illegal işlere karışma! 🚫',
          interview: 'MAC adresi hangi OSI katmanında? Layer 2 (Data Link)'
        },
        {
          term: 'OSI Model',
          aka: '7 Katmanlı Model',
          definition: 'Networkin 7 katlı döneri 🌯 Her katman bir iş yapar. Physical\'dan Application\'a kadar!',
          example: 'L1: Kablolar → L2: Switch → L3: Router → L4: TCP/UDP → L5-6-7: Session, Presentation, Application',
          funFact: 'Please Do Not Throw Sausage Pizza Away - Katmanları ezberle! 🍕',
          interview: 'Router hangi katmanda? Layer 3. Switch? Layer 2. Hub? Layer 1.'
        },
        {
          term: 'TCP/IP',
          aka: 'Transmission Control Protocol',
          definition: 'İnternetin omurgası 🦴 Güvenilir veri iletimi sağlar. Paket kaybolursa tekrar gönderir.',
          example: '3-way handshake: SYN → SYN-ACK → ACK. Tanışma protokolü! 👋',
          funFact: 'TCP = Güvenilir ama yavaş. UDP = Hızlı ama güvensiz. Senin seçimin! 🎯',
          interview: 'TCP vs UDP farkı? TCP connection-oriented, UDP connectionless'
        },
        {
          term: 'Firewall',
          aka: 'Güvenlik Duvarı',
          definition: 'Network\'ün kapı görevlisi 💂 İstenmeyen trafiği engelleyen koruma kalkanı.',
          example: 'Inbound/Outbound rules. Allow, Block, Log - Üç ana aksiyon',
          funFact: 'Next-Gen Firewall (NGFW) = Artık sadece port değil, uygulama bazlı kontrol! 🚀',
          interview: 'Stateful vs Stateless firewall? Stateful connection\'ları hatırlar'
        },
        {
          term: 'VPN',
          aka: 'Virtual Private Network',
          definition: 'İnternette gizli tünel 🕵️ Şifreli bağlantı ile güvenli iletişim sağlar.',
          example: 'Site-to-Site VPN = Ofisler arası. Client VPN = Kullanıcı bağlantısı',
          funFact: 'Split tunneling = Sadece ofis trafiği VPN\'den, internet direkt. Hız için! ⚡',
          interview: 'VPN protokolleri? IPsec, OpenVPN, WireGuard, PPTP (eski, kullanma!)'
        },
        {
          term: 'NAT',
          aka: 'Network Address Translation',
          definition: 'Private IP\'yi Public IP\'ye çeviren magic 🎩 IPv4\'ün hayat kurtaranı!',
          example: '192.168.1.x → 85.123.x.x dönüşümü. İçerideki tüm cihazlar tek public IP kullanır',
          funFact: 'PAT (Port Address Translation) = NAT\'ın advanced versiyonu. Port numarasıyla ayırt eder 🔢',
          interview: 'NAT türleri? Static NAT, Dynamic NAT, PAT (NAT Overload)'
        },
        {
          term: 'Port Forwarding',
          aka: 'Port Yönlendirme',
          definition: 'Dışarıdan içeri giriş kapısı 🚪 Belirli port\'u içerideki cihaza yönlendir!',
          example: 'Port 80\'i web server\'a, 3389\'u RDP server\'a yönlendir',
          funFact: 'Port forwarding = Security risk! Gerekmedikçe açma 🔒',
          interview: 'Hangi portlar en yaygın? 80 (HTTP), 443 (HTTPS), 22 (SSH), 3389 (RDP), 21 (FTP)'
        },
        {
          term: 'VLAN',
          aka: 'Virtual LAN',
          definition: 'Mantıksal network bölme 🗂️ Tek switch\'te birden fazla network oluştur!',
          example: 'VLAN 10 = Muhasebe, VLAN 20 = IT, VLAN 30 = Misafir. Segregation! 🏢',
          funFact: 'Trunk port = VLAN\'lar arası geçiş. Access port = Tek VLAN',
          interview: 'VLAN tagging hangi protokol? 802.1Q (Dot1Q)'
        },
        {
          term: 'Routing',
          aka: 'Yönlendirme',
          definition: 'Paketlerin yol bulma sistemi 🗺️ Hangi yoldan gidilecek? Routing table söyler!',
          example: 'Static routing = Elle tanımla. Dynamic routing = OSPF, EIGRP otomatik yap',
          funFact: 'Default route = 0.0.0.0/0. "Bilmiyorsan buraya gönder" demek 🎯',
          interview: 'Routing metric nedir? Path\'leri karşılaştırmak için kullanılan değer (hop count, bandwidth vs)'
        },
        {
          term: 'ARP',
          aka: 'Address Resolution Protocol',
          definition: 'IP\'den MAC bulma protokolü 🔍 Layer 3\'ten Layer 2\'ye köprü!',
          example: '"192.168.1.5\'in MAC\'i ne?" diye broadcast yapar. Cevap gelir: "00:1A:2B..."',
          funFact: 'ARP spoofing = Man-in-the-middle saldırısı. Fake ARP reply gönder! 😈',
          interview: 'arp -a komutu ne yapar? ARP cache\'i gösterir'
        },
        {
          term: 'QoS',
          aka: 'Quality of Service',
          definition: 'Traffic önceliklendirme ⭐ Önemli trafiğe öncelik ver! VoIP > Email mesela',
          example: 'Voice paketleri önce geçer, file download bekler. Adil değil ama etkili! 📞',
          funFact: 'Traffic shaping ile bandwidth limitle. Herkes eşit kullanamaz! 🚦',
          interview: 'QoS class türleri? Real-time (voice), Priority (video), Best-effort (data)'
        },
        {
          term: 'Proxy Server',
          aka: 'Vekil Sunucu',
          definition: 'Aracı server 🕴️ Client ile internet arasında durur. Filtreleme, caching yapar',
          example: 'Squid, Blue Coat - Popüler proxy\'ler. Ofiste facebook engelli? Proxy sayesinde! 🚫',
          funFact: 'Transparent proxy = Kullanıcı bilmez. Explicit proxy = Manuel ayar gerekir',
          interview: 'Forward vs Reverse proxy? Forward: Client için çalışır, Reverse: Server için'
        },
        {
          term: 'Load Balancer',
          aka: 'Yük Dengeleyici',
          definition: 'Traffic dağıtıcı ⚖️ Birden fazla server\'a yükü böl, high availability sağla!',
          example: 'Round-robin, least connection, IP hash - Farklı algoritmalar var',
          funFact: 'Layer 4 vs Layer 7 LB. L4 = TCP/UDP seviyesi, L7 = HTTP seviyesi 🎚️',
          interview: 'Health check nedir? Backend server\'ların sağlığını kontrol etme'
        },
        {
          term: 'BGP',
          aka: 'Border Gateway Protocol',
          definition: 'İnternetin routing protokolü 🌍 ISP\'ler arası routing. En büyük routing protocol!',
          example: 'AS (Autonomous System) numaraları kullanır. Türk Telekom, Türknet hepsi ayrı AS',
          funFact: 'BGP hijacking = Route\'ları çal, trafiği kendine yönlendir. 2008\'de Pakistan YouTube\'u kapattı! 💀',
          interview: 'eBGP vs iBGP? External (ISP arası) vs Internal (aynı AS içi)'
        },
        {
          term: 'MPLS',
          aka: 'Multiprotocol Label Switching',
          definition: 'Hızlı routing teknolojisi 🏎️ Label\'lar ile hızlı yönlendirme. Enterprise sevdalısı!',
          example: 'IP routing yerine label switching. Çok daha hızlı! ⚡',
          funFact: 'MPLS VPN = Site-to-Site VPN\'in pro versiyonu. Pahalı ama hızlı!',
          interview: 'MPLS hangi OSI katmanında? Layer 2.5 (Layer 2 ile 3 arası)'
        },
        {
          term: 'OSPF',
          aka: 'Open Shortest Path First',
          definition: 'Açık kaynak routing protokolü 🛣️ Karmaşık networklerde kendi yolunu bulan akıllı sistem!',
          example: 'Link-state algorithm kullanır. Her router tüm topolojiyi bilir',
          funFact: 'OSPF = Ücretsiz! RIP kadar eski değil, EIGRP kadar kapalı da değil 🎯',
          interview: '🎯 OSPF metric nedir? Bandwidth bazlı hesaplanır (referans 100Mbps)'
        },
        {
          term: 'Latency',
          aka: 'Gecikme Süresi',
          definition: 'Veri gönderme ile alma arasındaki zaman farkı ⏱️ Ping le ölçülür!',
          example: '1ms gecikme = çok iyi. 100ms+ = lag hissedersin 😒',
          funFact: 'Gaming için <50ms hedeflenmiştir. Fiber ağlar daha düşük latency sağlar 🚀',
          interview: '🎯 Latency ve bandwidth farkı nedir? Latency: hız, Bandwidth: kapasite'
        },
        {
          term: 'Bandwidth',
          aka: 'Bant Genişliği',
          definition: 'Network\'ün verebileceği maksimum veri miktarı 📊 Boru kalınlığı gibi düşün!',
          example: '10Mbps = iyice eski, 100Mbps = normal, 1Gbps = modern, 10Gbps = harika! 🤩',
          funFact: 'Bandwidth ≠ Speed. Bandwidth tüm trafiğin paylaştığı kaynaktır',
          interview: '🎯 Bandwidth nasıl ölçülür? Mbps (Megabit per second) cinsinden'
        },
        {
          term: 'Throughput',
          aka: 'Gerçek İşlem Kapasitesi',
          definition: 'Teoriye karşı pratikte aktarılan veri miktarı 📈 Bandwidth\'in gerçek hali!',
          example: '100Mbps bandwidth = 80-95Mbps throughput. Gerisi overhead!',
          funFact: 'Throughput her zaman bandwidth\'e eşit değildir. Protokol overhead, paket kaybı etkiler 🤔',
          interview: '🎯 Bandwidth ve throughput ilişkisi? Bandwidth teorik, throughput pratiktir'
        },
        {
          term: 'Packet Loss',
          aka: 'Paket Kaybı',
          definition: 'Gönderilen paketlerin ağlama yolu kaybı 💔 Network sıkışmasının işareti!',
          example: '%1 paket kaybı = sorun başlıyor, %5+ = harita kalite düşer 📉',
          funFact: 'TCP paketleri tekrar gönderilir ama UDP\'nin üzüntüsü kalır 😢',
          interview: '🎯 Paket kaybı nasıl test edilir? Ping, iperf, mtr komutlarıyla'
        },
        {
          term: 'Traceroute',
          aka: 'Rota İzleme',
          definition: 'Paketin attığı her hop\'u gösteren harita 🗺️ A\'dan B\'ye gidişin tüm durağını görürsün!',
          example: 'Windows: tracert google.com, Linux: traceroute google.com',
          funFact: 'Yolda kaybolan hop varsa * * * görürsün. Firewall engeli demek! 🚫',
          interview: '🎯 Traceroute nasıl çalışır? TTL değerini arttırarak her router\'tan response alır'
        },
        {
          term: 'Ping',
          aka: 'Sonar Ping',
          definition: 'Network dünyasının duydum mu? sesi 📢 Bağlantı var mı diye kontrol eder!',
          example: 'ping google.com - 50ms yanıt = sağlıklı. Reply timeout = sorun var 🚨',
          funFact: 'Ping = ICMP Echo Request. Hacker\'ların en sevdiği network testi!',
          interview: '🎯 Ping komutu hangi protokol kullanır? ICMP (Internet Control Message Protocol)'
        },
        {
          term: 'SSH',
          aka: 'Secure Shell',
          definition: 'Şifreli uzaktan erişim 🔐 Telnet\'in güvenli versiyonu. Server\'a güvenle bağlan!',
          example: 'ssh user@192.168.1.100 - Terminal üzerinden server kontrol et',
          funFact: 'SSH key = Şifreden daha güvenli. Public-private key çifti! 🔑',
          interview: '🎯 SSH hangi port kullanır? 22 numaralı port (değiştirebilirsin ama 22 standart)'
        },
        {
          term: 'FTP',
          aka: 'File Transfer Protocol',
          definition: 'Eski zamanlı dosya transferi 🗂️ Şifresiz ve yavaş ama basit!',
          example: 'Günümüzde kullanılmıyor. SFTP\'ye geç! 👻',
          funFact: 'FTP = Port 20 (data) ve 21 (kontrol). Aktif/Pasif mode var 📡',
          interview: '🎯 FTP neden güvenli değil? Şifresi plaintext, hacker sniff edebilir'
        },
        {
          term: 'SFTP',
          aka: 'SSH File Transfer Protocol',
          definition: 'SSH üzerinden güvenli dosya transferi 🔒 FTP\'nin modern, iyi yapılmış versiyonu!',
          example: 'sftp user@server.com - Dosya transferi şifrelenerek yapılır',
          funFact: 'SFTP = SSH tunnel içinde çalışır. SSH kapalıysa SFTP de kapalıdır 🔐',
          interview: '🎯 SFTP vs FTPS farkı? SFTP: SSH tabanlı, FTPS: SSL/TLS tabanlı'
        },
        {
          term: 'HTTP',
          aka: 'HyperText Transfer Protocol',
          definition: 'Websitesi iletişimi (şifresiz) 🌐 Günümüzde kullanma! Çok tehlikeli!',
          example: 'HTTP = Port 80. Herkes paketleri okuyabilir 👀',
          funFact: 'HTTP/2 daha hızlı, HTTP/3 daha modern ama hepsi şifresiz! 🚫',
          interview: '🎯 HTTP request metodları nelerdir? GET, POST, PUT, DELETE, PATCH vb.'
        },
        {
          term: 'HTTPS',
          aka: 'HTTP Secure',
          definition: 'Websitesi iletişimi (şifreli) 🔒 HTTP\'nin güvenli versiyonu. Hep bunu kullan!',
          example: 'HTTPS = Port 443. TLS/SSL şifrelemesi ile güvenli 🛡️',
          funFact: 'Green lock = Sertifika geçerli. Red warning = Sahte sertifika! 🚨',
          interview: '🎯 HTTPS sertifikasının süresi biter mi? Evet! Genelde 1 yıllık. Yenilemeyi unutma'
        },
        {
          term: 'SNMP',
          aka: 'Simple Network Management Protocol',
          definition: 'Network cihazlarının sağlık kontrolü 🏥 Router, switch, printer\'ı monitör et!',
          example: 'SNMP ile CPU, memory, disk kullanımı öğrenirsin. Nagios kullananlar biliyor! 📊',
          funFact: 'SNMP v3 = Güvenli. SNMPv1 ve v2 = Herkese açık 🔓',
          interview: '🎯 SNMP portu ve versiyonları? Port 161 (agent), Port 162 (trap). v1, v2c, v3'
        },
        {
          term: 'NTP',
          aka: 'Network Time Protocol',
          definition: 'Tüm cihazların saati eşitleyen sistem ⏰ Saniye farkı bile önemli!',
          example: 'Firewall\'ın saati yanlışsa traffic drop olabilir. 1 saat yanlış = kaos! 😱',
          funFact: 'NTP = Port 123 UDP. Stratum 0 = Atom saati, Stratum 15 = Senkronize değil',
          interview: '🎯 NTP neden önemli? Sertifika validation, log timestamps için gerekli'
        },
        {
          term: 'RADIUS',
          aka: 'Remote Authentication Dial In User Service',
          definition: 'Merkezi kimlik doğrulama servisi 🔑 Tüm network cihazları bunu sorgula!',
          example: 'WiFi login = RADIUS server sorgular. Active Directory ile bağlantılı',
          funFact: 'RADIUS = Port 1812 (auth) ve 1813 (accounting). Parollı protokol! 🔐',
          interview: '🎯 RADIUS vs TACACS+ farkı? RADIUS: UDP, TACACS+: TCP (daha güvenli)'
        },
        {
          term: 'SD-WAN',
          aka: 'Software-Defined WAN',
          definition: 'Yazılım tabanlı WAN kontrol 🎮 Eski WAN routerlerine veda et!',
          example: 'Internet + MPLS trafiğini dinamik kontrol et. Cost-effective! 💰',
          funFact: 'SD-WAN = Cloud first. Branch\'lerin buluta direkt bağlanması',
          interview: '🎯 SD-WAN avantajları nelerdir? Flexibility, cost reduction, easy management'
        },
        {
          term: 'Proxy',
          aka: 'İnternet Vekili',
          definition: 'Aracı sunucu 🕴️ Client ile server arasında oturur. Gizliliği koruyan şey!',
          example: 'Browser proxy ayarlarına IP:PORT yazarsan o adresten geçer tüm traffic',
          funFact: 'Proxy = Caching. Aynı siteyi 1000 kişi ziyaret ederse cache\'den gelir! ⚡',
          interview: '🎯 Web proxy ve VPN farkı? Proxy: uygulama seviyesi, VPN: sistem seviyesi'
        },
        {
          term: 'Load Balancing',
          aka: 'Yük Dengeleme',
          definition: 'Sunucular arasında trafiği eşit dağıtma ⚖️ Tek sunucu çökmesini önle!',
          example: 'Round robin: 1-2-3-1-2-3. Least conn: En boş sunucuya gönder',
          funFact: 'Session affinity = Aynı user her zaman aynı sunucuya. Hatırlamak için 🧠',
          interview: '🎯 Health check başarısız olunca ne olur? O sunucu pool\'dan çıkarılır'
        },
        {
          term: 'Peering',
          aka: 'Bağlantı Anlaşması',
          definition: 'İnternet sağlayıcıların birbirlerinin trafiğini taşıması 🤝 Ücretsiz veya ücretli!',
          example: 'Türk Telekom = Türknet ile peering yapabilir. Direkt bağlantı = daha hızlı 🚀',
          funFact: 'IXP (Internet Exchange Point) = Peering için fiziksel yer. İstanbul\'da HAMNetworks var',
          interview: '🎯 Private vs public peering farkı? Private: dedicated link, Public: shared port'
        },
        {
          term: 'IPv6',
          aka: 'Internet Protocol version 6',
          definition: '128 bitlik adresleme sistemi 🌌 IPv4\'ün halef. Sonsuz adres alanı!',
          example: '2001:db8::1 - Çok uzun ama daha güvenli. IPv4\'e kıyasla daha modern',
          funFact: 'IPv6 adoption = %30 civarında. Çin ve ABD öncü! 🌏',
          interview: '🎯 IPv6 adresi kaç bölüme ayrılır? 8 grup, her grup 4 hex karakter'
        },
        {
          term: 'Multicast',
          aka: 'Çok Noktaya Yayın',
          definition: 'Bir paket birden fazla hedefe gider 📢 Verimli yayın sistemi!',
          example: 'IPTV, online konferans = Multicast kullanır. Bandwidth\'i kurtarır! 🎬',
          funFact: 'Multicast = 224.0.0.0 - 239.255.255.255 arası. Reserved address! 🎯',
          interview: '🎯 Unicast vs Multicast vs Broadcast farkı? Uni: 1-1, Multi: 1-grup, Broad: 1-hepsi'
        },
        {
          term: 'Anycast',
          aka: 'Herhangi Bir Noktaya Gönderme',
          definition: 'Birden fazla server\'dan en yakını seçer 🎯 DNS root servers\'ın sırrı!',
          example: 'Aynı IP adresine birden fazla server yanıt verir. En yakın cevaplar!',
          funFact: 'Anycast = CDN\'nin arkasındaki magic! Cloudflare\'in stratejisi',
          interview: '🎯 Anycast nasıl çalışır? BGP routing ile en yakın sunucuyu bulur'
        },
        {
          term: 'Tunnel',
          aka: 'Tünel Protokolü',
          definition: 'Bir protokolü başka protokol içinde taşımak 🚇 Encapsulation demek!',
          example: 'IPv6 over IPv4 tunnel. GRE tunnel. İçteki protokol korunmuş olur',
          funFact: 'Tunnel = Birden fazla protokolü taşıyabilir. VPN de tunnel kullanır 🔒',
          interview: '🎯 Tunnel neden gerekli? Eski ve yeni protokolleri beraber kullanmak için'
        },
        {
          term: 'Congestion Control',
          aka: 'Sıkışma Kontrol',
          definition: 'Network dolu olunca hız düşürme 🚦 Kaos yaşanmasını önleyen mekanizma!',
          example: 'TCP slow start, congestion avoidance. Paket kaybı olunca hız azal 📉',
          funFact: 'BBR, CUBIC algoritmaları var. Modern algoritmalar daha akıllı 🧠',
          interview: '🎯 TCP congestion window nedir? Bir seferde gönderilebilecek paket sayısı'
        },
        {
          term: 'Path MTU Discovery',
          aka: 'Maksimum Transmission Unit Bulma',
          definition: 'Rota üzerindeki en küçük MTU\'yu bul 🔍 Fragmentation\'dan kaç!',
          example: 'Ethernet MTU = 1500. Tunnel olunca küçül. Optimal MTU bulman gerekir',
          funFact: 'MTU çok küçükse = Fragmentasyon + yavaş. Çok büyükse = Drop. Balans gerekli! ⚖️',
          interview: '🎯 MTU eksikliği ne gibi sorunlar yaratır? Bağlantı kesilme, dosya upload hatası'
        }
      ]
    },
    {
      category: 'windows',
      icon: Server,
      color: 'from-purple-600 to-pink-600',
      title: '🪟 Windows Dünyası',
      terms: [
        {
          term: 'Active Directory',
          aka: 'AD / Domain',
          definition: 'Windows\'un kullanıcı ve bilgisayar veritabanı 👥 Merkezi yönetim için şart!',
          example: 'Domain Controller = AD\'nin beyni. Burası çökerse kimse login olamaz 🧠',
          funFact: 'AD neden önemli? 10,000 kullanıcıyı tek yerden yönet! Password policy, login scripts hepsi buradan 🎯',
          interview: 'AD database dosyası? NTDS.dit (C:\\Windows\\NTDS\\)'
        },
        {
          term: 'Group Policy (GPO)',
          aka: 'Grup İlkesi',
          definition: 'Toplu ayar yapma tool\'u ⚙️ Bir ayarı 1000 bilgisayara tek tuşla uygula!',
          example: 'Wallpaper değiştir, yazılım kur, USB\'yi devre dışı bırak - hepsi GPO ile!',
          funFact: 'gpupdate /force = "Şimdi uygula lan!" demek 🔄',
          interview: 'GPO apply sırası? LSDOU (Local, Site, Domain, OU). Son kazanır!'
        },
        {
          term: 'PowerShell',
          aka: 'PS / The Blue One',
          definition: 'Windows\'un süper güçlü command line\'ı 💪 CMD\'nin steroidli versiyonu!',
          example: 'Get-Service, Start-Process, New-Item - Verb-Noun formatı her zaman',
          funFact: 'PowerShell 7 cross-platform! Linux\'ta da çalışır 🐧',
          interview: 'Pipeline nedir? | (pipe) ile komutları zincirleme. Get-Process | Stop-Process'
        },
        {
          term: 'Event Viewer',
          aka: 'Olay Görüntüleyicisi',
          definition: 'Windows\'un günlüğü 📔 Her olay kayıt altında. Sorun çözmenin ilk durağı!',
          example: 'Application, System, Security logs - Üç main kategori',
          funFact: 'Event ID 4624 = Login success. 4625 = Login fail. Ezberle! 🔐',
          interview: 'Critical > Error > Warning > Information. Log seviyeleri!'
        },
        {
          term: 'Domain Controller',
          aka: 'DC',
          definition: 'Active Directory\'nin kalbi ❤️ Auth, authorization hepsi buradan!',
          example: 'DC down = Kimse login olamaz. Yedek DC şart! 🆘',
          funFact: 'FSMO roles (5 tane): Schema Master, Domain Naming Master, RID Master, PDC Emulator, Infrastructure Master',
          interview: 'PDC Emulator ne işe yarar? Time sync, password changes, legacy support'
        },
        {
          term: 'NTFS',
          aka: 'New Technology File System',
          definition: 'Windows\'un dosya sistemi 📁 Permission, encryption, compression built-in!',
          example: 'FAT32 max 4GB file. NTFS limit yok (teorik). Modern şeyler! 💾',
          funFact: 'NTFS permissions vs Share permissions. İkisi farklı, en kısıtlayıcı kazanır 🏆',
          interview: 'NTFS permissions? Full Control, Modify, Read & Execute, List, Read, Write'
        },
        {
          term: 'RDP',
          aka: 'Remote Desktop Protocol',
          definition: 'Uzaktan masaüstü 🖥️ Windows\'un remote access yolu. Port 3389!',
          example: 'mstsc.exe = RDP client. IP yaz, login ol, boom! 💥',
          funFact: 'RDP brute-force saldırıları çok yaygın! Şifre güçlü + NLA açık olsun 🔒',
          interview: 'NLA nedir? Network Level Authentication. Login screen\'den önce auth ister'
        },
        {
          term: 'WSUS',
          aka: 'Windows Server Update Services',
          definition: 'Windows Update\'in local versiyonu 🔄 Update\'leri control et, approve et!',
          example: 'Patch Tuesday = Ayın 2. Salısı. Microsoft\'un patch günü 📅',
          funFact: 'WSUS olmadan 1000 PC internetten update çeker. Bandwidth patlama! 💥',
          interview: 'WSUS approval süreçleri? Auto-approve critical, manuel approve optional'
        },
        {
          term: 'Hyper-V',
          aka: 'Windows Hypervisor',
          definition: 'Windows\'un VM motoru 🖥️ Type-1 hypervisor, doğrudan hardware üstünde!',
          example: 'Generation 1 vs Gen 2 VM. Gen2 daha yeni, UEFI + Secure Boot destekler',
          funFact: 'Hyper-V açıkken VMware/VirtualBox yavaşlar. Nested virtualization conflict! ⚡',
          interview: 'Dynamic vs Fixed disk? Dynamic grows, Fixed pre-allocated (faster)'
        },
        {
          term: 'Windows Defender',
          aka: 'Microsoft Defender',
          definition: 'Windows\'un built-in antivirus\'ü 🛡️ Artık çok iyi, ücretsiz!',
          example: 'Real-time protection, Cloud-delivered protection, Tamper protection - Hepsi var',
          funFact: 'Defender ATP (Advanced Threat Protection) = Enterprise seviye koruma. Pahalı ama güçlü! 💪',
          interview: 'Exclusion nedir? Belirli file/folder\'ı scan\'den çıkar (performance için)'
        },
        {
          term: 'WMI',
          aka: 'Windows Management Instrumentation',
          definition: 'Windows\'un yönetim altyapısı 🔧 Sistem bilgisi sorgu ve yönetim için!',
          example: 'PowerShell\'le WMI query: Get-WmiObject Win32_ComputerSystem',
          funFact: 'WMI olmadan remote management çok zor! SCCM, monitoring tool\'lar WMI kullanır 📊',
          interview: 'WMI namespace? root\\CIMV2 (en yaygın)'
        },
        {
          term: 'DNS Server',
          aka: 'Domain Name System Server',
          definition: 'Domain isimlerini IP\'ye çeviren Windows rolü 🔄 AD için şart!',
          example: 'Forward lookup zone = Name → IP. Reverse = IP → Name',
          funFact: 'AD-integrated DNS = DNS zone\'ları AD\'de saklanır. Replication otomatik! 🔄',
          interview: 'Primary vs Secondary zone? Primary = Read/Write, Secondary = Read-only copy'
        },
        {
          term: 'DHCP Server',
          aka: 'Dynamic Host Configuration Protocol Server',
          definition: 'IP dağıtım server\'ı 🎲 Otomatik IP, subnet, gateway, DNS verir!',
          example: 'Scope = IP pool. Reservation = Belirli MAC\'e hep aynı IP ver',
          funFact: 'DHCP failover = İki DHCP server birlikte çalışır. Yedeklilik! 🔄',
          interview: 'DORA process? Discover, Offer, Request, Acknowledge'
        },
        {
          term: 'File Server',
          aka: 'Dosya Sunucusu',
          definition: 'Merkezi dosya depolama 📂 Herkes buradan dosyalara erişir!',
          example: 'SMB/CIFS protokolü kullanır. \\\\server\\share şeklinde erişim',
          funFact: 'DFS (Distributed File System) = Dosyaları dağıt, tek namespace altında topla! 🗂️',
          interview: 'Share permissions vs NTFS permissions? Share = Network access, NTFS = Local + Network'
        },
        {
          term: 'Print Server',
          aka: 'Yazıcı Sunucusu',
          definition: 'Merkezi yazıcı yönetimi 🖨️ Tüm yazıcılar buradan kontrol edilir!',
          example: 'Driver management, print queue, user permissions - Hepsi buradan',
          funFact: 'Follow-me printing = Herhangi bir yazıcıdan kartla bas! Modern ofisler böyle 📇',
          interview: 'Print queue stuck? Stop spooler service, delete files from C:\\Windows\\System32\\spool\\PRINTERS'
        },
        {
          term: 'DFS',
          aka: 'Distributed File System',
          definition: 'Dağıtık dosya sistemi 🌳 Birden fazla file server\'ı tek namespace altında!',
          example: '\\\\domain\\shared → Arka planda 5 farklı server olabilir, kullanıcı bilmez',
          funFact: 'DFS replication = Auto sync between servers. Disaster recovery için mükemmel! 🔄',
          interview: 'DFS namespace türleri? Domain-based (AD integrated) vs Stand-alone'
        },
        {
          term: 'Certificate Services',
          aka: 'AD CS / PKI',
          definition: 'Sertifika yönetimi 🔐 Internal CA, SSL certificate management!',
          example: 'Web server SSL, VPN authentication, email encryption - Hepsi certificate kullanır',
          funFact: 'Auto-enrollment = Bilgisayarlar otomatik certificate alır. Süper pratik! ✨',
          interview: 'Certificate template nedir? Certificate özellikleri için şablon (validity, key size vs)'
        },
        {
          term: 'IIS',
          aka: 'Internet Information Services',
          definition: 'Windows web server 🌐 Apache/Nginx\'in Windows versiyonu!',
          example: 'Application pool = Web app isolation. Her app ayrı pool\'da çalışır',
          funFact: 'URL Rewrite module ile SEO-friendly URL\'ler yap! 🔗',
          interview: 'Default port? 80 (HTTP), 443 (HTTPS)'
        },
        {
          term: 'Windows Server Backup',
          aka: 'WSB',
          definition: 'Windows\'un built-in backup tool\'u 💾 System state, files, volumes!',
          example: 'Bare metal recovery = Tüm server\'ı restore et. Disaster recovery! 🆘',
          funFact: 'VSS (Volume Shadow Copy) kullanır. Açık dosyaları bile backup\'lar! 📸',
          interview: 'System State backup nedir? AD database, Registry, boot files, COM+ database'
        },
        {
          term: 'Remote Server Administration Tools',
          aka: 'RSAT',
          definition: 'Windows 10/11\'de server yönetim tool\'ları 🛠️ Uzaktan server yönet!',
          example: 'AD Users & Computers, DNS Manager, DHCP - Hepsi RSAT ile',
          funFact: 'RSAT ile sunucu odasına girmene gerek yok. Masandan yönet! 🪑',
          interview: 'RSAT nasıl kurulur? Windows Features → RSAT tools seç'
        },
        {
          term: 'Registry',
          aka: 'Windows Registry / Regedit',
          definition: 'Windows\'un ayarlar veritabanı 📚 Sistem, app, user config\'leri burda!',
          example: 'HKEY_LOCAL_MACHINE, HKEY_CURRENT_USER - Ana hive\'ler. Yanlış düzenleme = Sistem çöker! ⚠️',
          funFact: 'Registry yedekle! Restore point yok mu, Registry backup sayesinde kurtar 💾',
          interview: 'Registry key türleri? Root key (HKEY_*), Subkey, Value (String, DWORD, Binary) 🎯'
        },
        {
          term: 'Group Policy',
          aka: 'GPO / Group Policy Object',
          definition: 'Toplu ayar yapma tool\'u ⚙️ Bin bilgisayarı bir ayarla yönet!',
          example: 'Wallpaper değiştir, yazılım kur, USB devre dışı - Hepsi GPO ile 🔧',
          funFact: 'gpupdate /force = "Hemen uygula!" Reboot gerekmeyebilir! 🔄',
          interview: 'GPO application order? LSDOU (Local → Site → Domain → OU). Son kazanır! 🎯'
        },
        {
          term: 'Domain Controller',
          aka: 'DC / Domain Master',
          definition: 'Active Directory\'nin kalbi ❤️ Auth, authorization hepsi buradan!',
          example: 'DC down = Kimse login olamaz. Yedek DC şart! 🆘',
          funFact: 'FSMO roles: Schema Master, Domain Naming Master, RID Master, PDC Emulator, Infrastructure Master 👑',
          interview: 'PDC Emulator nedir? Time sync, password changes, legacy support sağlar 🎯'
        },
        {
          term: 'NTFS',
          aka: 'New Technology File System',
          definition: 'Windows\'un modern dosya sistemi 📁 Permission, encryption, compression built-in!',
          example: 'FAT32 max 4GB file. NTFS = Sınırsız. Alternate Data Streams de var! 💾',
          funFact: 'NTFS vs Share permissions. İkisi de var = En kısıtlayıcı kazanır! 🏆',
          interview: 'NTFS permission türleri? Full Control, Modify, Read & Execute, Read, Write, Special 🎯'
        },
        {
          term: 'PowerShell',
          aka: 'PS / PowerShell ISE',
          definition: 'Windows\'un süper güçlü command line\'ı 💪 CMD\'nin steroidli versiyonu!',
          example: 'Get-Service, Start-Process, New-Item - Verb-Noun formatı. Objects ile çalış! 🔧',
          funFact: 'PowerShell 7+ cross-platform! Linux, macOS\'ta da çalışır. .NET Core sayesinde! 🐧',
          interview: 'Pipeline nedir? | (pipe) ile komutları zincirleme. Get-Process | Stop-Process 🎯'
        },
        {
          term: 'CMD',
          aka: 'Command Prompt / cmd.exe',
          definition: 'Windows\'un legacy command line\'ı 🖥️ PowerShell zamanı geldi ama hala kullanılır!',
          example: 'dir, copy, ipconfig - Eski komutlar. Batch script\'ler (.bat) ile otomasyon',
          funFact: 'CMD 50+ yıllık! DOS zamanından kalma. Hala çok işe yarıyor! 🦴',
          interview: 'CMD vs PowerShell? CMD = String-based, PowerShell = Object-based. PS daha güçlü 🎯'
        },
        {
          term: 'Task Scheduler',
          aka: 'Zamanlanmış Görevler',
          definition: 'İş otomasyonu 🤖 Script/program\'ı belirli zamanda/olayda çalıştır!',
          example: 'Her gün 3 sabah backup, login sırasında update, sistem reboot\'dan sonra script çalıştır',
          funFact: 'Task Scheduler PS ile de yönetilir: New-ScheduledTask, Register-ScheduledTask 📅',
          interview: 'Trigger türleri? On schedule, At logon, At startup, On idle, On event 🎯'
        },
        {
          term: 'Event Viewer',
          aka: 'Olay Görüntüleyicisi',
          definition: 'Windows\'un günlüğü 📔 Her olay kayıt altında. Sorun çözmenin ilk durağı!',
          example: 'Application, System, Security logs. Event ID 4624 = Login success, 4625 = Fail 🔐',
          funFact: 'Forwarded Events = Uzak sunucudan log topla. Merkezi monitoring! 📊',
          interview: 'Log seviyeleri? Critical → Error → Warning → Information → Verbose 🎯'
        },
        {
          term: 'Services',
          aka: 'Windows Services / svc',
          definition: 'Arka planda çalışan programlar 🔄 Background process\'ler, kullanıcı interaction yok!',
          example: 'DHCP, DNS, IIS, SQL - Hepsi service. services.msc ile yönet 🛠️',
          funFact: 'Service account kullan! Local System/Network Service ya da gMSA (Group Managed Service Account) 🔐',
          interview: 'Service startup type? Automatic, Automatic (delayed), Manual, Disabled 🎯'
        },
        {
          term: 'IIS',
          aka: 'Internet Information Services',
          definition: 'Windows web server 🌐 Apache/Nginx\'in Windows versiyonu!',
          example: 'Application pool = Web app isolation. Her app ayrı pool\'da, crash edilmez 💪',
          funFact: 'URL Rewrite module ile SEO-friendly URL yap. Performance tuning da yapabildim! 🚀',
          interview: 'Application pool recycle? Worker process yeniden başla. Memory leak temizle 🎯'
        },
        {
          term: 'WSUS',
          aka: 'Windows Server Update Services',
          definition: 'Windows Update\'in local versiyonu 🔄 Update control + bandwidth tasarrufu!',
          example: 'Patch Tuesday = 2. Salı. WSUS onay sonrası deploy et 📅',
          funFact: 'WSUS olmadan 1000 PC internet\'ten update çeker. Bandwidth patlama! 💥',
          interview: 'WSUS approval stratejisi? Auto-approve critical, manuel approve optional 🎯'
        },
        {
          term: 'Hyper-V',
          aka: 'Windows Hypervisor',
          definition: 'Windows\'un VM motoru 🖥️ Type-1 hypervisor, hardware üstünde doğrudan!',
          example: 'Gen 1 vs Gen 2 VM. Gen2 = UEFI, Secure Boot, Nested VM desteği! ⚡',
          funFact: 'Hyper-V açıkken VMware/VirtualBox yavaşlar. Kernel mode collision! 💥',
          interview: 'Dynamic vs Fixed VHD? Dynamic = Büyür gerektiğinde, Fixed = Pre-allocated, daha hızlı 🎯'
        },
        {
          term: 'RDP',
          aka: 'Remote Desktop Protocol',
          definition: 'Uzaktan masaüstü 🖥️ Port 3389. Windows remote access yolu!',
          example: 'mstsc.exe = RDP client. IP gir, login ol, desktop\'i uzaktan kontrol et 💥',
          funFact: 'RDP brute-force çok yaygın! NLA (Network Level Auth) + güçlü şifre = MUST 🔒',
          interview: 'RDP security? NLA açık, non-admin account kullan, VPN üstünde RDP 🎯'
        },
        {
          term: 'SMB',
          aka: 'Server Message Block',
          definition: 'Windows file sharing protokolü 📂 SMB3 = hızlı, secure!',
          example: '\\\\server\\share ile dosya erişimi. Printer sharing de SMB ile 🖨️',
          funFact: 'SMB signing = Tamper detection. WannaCry SMB açığından korundu! 🛡️',
          interview: 'SMB versions? 1 (deprecated), 2, 2.1, 3. SMB3 encryption + signing var 🎯'
        },
        {
          term: 'NTLM',
          aka: 'NT Lan Manager',
          definition: 'Windows authentication protokolü 🔐 Eski ama hala kullanılır!',
          example: 'NTLM vs Kerberos. Kerberos daha güvenli ama NTLM yedek! 🔄',
          funFact: 'NTLM hash crack\'lenebilir. Rainbow table ile hızlı! Kerberos use et 💪',
          interview: 'NTLM handshake? Challenge-response. Client şifre göndermiyor! 🎯'
        },
        {
          term: 'Kerberos',
          aka: 'Kerberos Authentication',
          definition: 'Modern Windows authentication 👑 Ticket-based, çok güvenli!',
          example: 'TGT (Ticket Granting Ticket), ST (Service Ticket). Domain gerekli! 🎫',
          funFact: 'Pass-the-ticket attack = TGT çalıp başka user gibi davran. Golden ticket! 👑',
          interview: 'Kerberos flow? User → KDC (TGT al) → Service (ST al) → Access 🎯'
        },
        {
          term: 'UAC',
          aka: 'User Account Control',
          definition: 'Admin hareket kontrolü ⚠️ Yönetici işlemi onay ister!',
          example: 'UAC prompt = "Admin access lazım, izin veriyor musun?". Malware blocker! 🛡️',
          funFact: 'UAC bypass var ama modern OS\'de zor. Ring3 → Ring0 escalation Block 🔒',
          interview: 'UAC levels? Never, Only apps (domain), Apps all (default), Always 🎯'
        },
        {
          term: 'BitLocker',
          aka: 'Disk Encryption',
          definition: 'Disk encryption tool\'u 🔐 Çalınan drive\'dan veri kurtarılamaz!',
          example: 'Full disk encryption. PIN + TPM 2.0 = Güvenli boot! 🚀',
          funFact: 'BitLocker suspended = Password olmadan boot. Work in progress mode! ⚠️',
          interview: 'BitLocker recovery key? Backup et! Şifre unutulursa key gerekir 🎯'
        },
        {
          term: 'Shadow Copy',
          aka: 'Volume Shadow Copy Service / VSS',
          definition: 'Dosya versiyonları 📸 Eski versiyon geri al! Ransomware çözümü!',
          example: 'Properties → Previous Versions. 1 hafta öncesini restore et! 🔄',
          funFact: 'VSS = Backup, versioning, disaster recovery. Açık dosyaları bile copy\'lar 💪',
          interview: 'Shadow Copy vs Backup? Shadow = Local snapshots, Backup = Off-site 🎯'
        },
        {
          term: 'WinRM',
          aka: 'Windows Remote Management',
          definition: 'PowerShell remoting protokolü 🛠️ SSH gibi ama Windows-native!',
          example: 'Enable-PSRemoting. Invoke-Command -ComputerName server1 {Get-Service} 🔧',
          funFact: 'WinRM = HTTP(S) üstünde SOAP. Port 5985 (HTTP), 5986 (HTTPS)! 📡',
          interview: 'PSRemoting security? WinRM over HTTPS + Kerberos auth gerekli 🎯'
        },
        {
          term: 'DISM',
          aka: 'Deployment Image Servicing and Management',
          definition: 'Windows image yönetimi 🖼️ Repair, customize, deploy Windows!',
          example: 'DISM /Online /Cleanup-Image /RestoreHealth = Sistem tamir et! 🔧',
          funFact: 'DISM + SFC = Dinamik duo! OS file corruption çözümü 🛡️',
          interview: 'DISM vs SFC? DISM = Component store, SFC = System files 🎯'
        },
        {
          term: 'SFC',
          aka: 'System File Checker',
          definition: 'System file integrity check 🔍 Bozuk dosya tamir et!',
          example: 'sfc /scannow = "Tüm system file\'ları kontrol et!" Admin prompt lazım 🔐',
          funFact: 'SFC stuck? Safe Mode\'de çalıştır. Reboot sonrası iyidir genelde 💪',
          interview: 'SFC repair level? /scannow, /scanfile, /verifyonly. Zaman gerekir! 🎯'
        },
        {
          term: 'Robocopy',
          aka: 'Robust File Copy',
          definition: 'Advanced file copy tool\'u 📁 Dosyaları resume\'le, attribute koru!',
          example: 'Robocopy C:\\Source D:\\Dest /MIR = Mirror copy. Hızlı, güvenilir! 🚀',
          funFact: 'Robocopy = Multi-threaded. Paralel copy ile super hızlı transfer! 💨',
          interview: 'Robocopy parametreleri? /MIR (mirror), /COPY:DAT (attributes), /RETRY:N 🎯'
        },
        {
          term: 'WMI',
          aka: 'Windows Management Instrumentation',
          definition: 'Windows yönetim altyapısı 🔧 Sistem sorgu ve yönetim!',
          example: 'Get-WmiObject Win32_ComputerSystem. WMI classes = Sistem resource abstract 📊',
          funFact: 'WMI = Remote management backbone. SCCM, monitoring tools WMI kullanır 📡',
          interview: 'WMI namespace? root\\CIMV2 (en yaygın). WMI query language = WQL (SQL-like) 🎯'
        },
        {
          term: 'Performance Monitor',
          aka: 'Perfmon / Performance Monitor',
          definition: 'Sistem performance monitoring 📊 CPU, RAM, Disk, Network real-time!',
          example: 'Bottleneck bul! CPU > 80% = upgrade gerekli. RAM sızıntı? Process killer! 🔍',
          funFact: 'Perfmon = Counter-based. Custom log + alert çok işe yarıyor! ⚡',
          interview: 'Önemli counter\'lar? Processor\\%CPU, Memory\\Available MB, Disk\\%Disk Time 🎯'
        }
      ]
    },
    {
      category: 'security',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      title: '🔒 Güvenlik (Security)',
      terms: [
        {
          term: 'Zero Trust',
          aka: 'Sıfır Güven Modeli',
          definition: 'Kimseye güvenme! 🚫 Her erişimi doğrula, internal/external fark etmez',
          example: 'Old model: Inside = Trusted. Zero Trust: Trust no one, verify everything!',
          funFact: 'Google BeyondCorp = Zero Trust\'ın öncüsü. VPN bile yok! 🚀',
          interview: 'Zero Trust prensipleri? Verify explicitly, Least privilege access, Assume breach'
        },
        {
          term: 'MFA / 2FA',
          aka: 'Multi-Factor Authentication',
          definition: 'Çift kilitli güvenlik 🔑🔑 Şifre + Başka bir şey (SMS, App, Biometric)',
          example: 'Microsoft Authenticator, Google Authenticator, YubiKey - Hepsi 2FA tool',
          funFact: 'SMS 2FA < App 2FA < Hardware key. Güvenlik seviyeleri! 📈',
          interview: 'Authentication factors? Something you know, have, are (Knowledge, Possession, Inherence)'
        },
        {
          term: 'Encryption',
          aka: 'Şifreleme',
          definition: 'Veriyi okunamaz hale getirme 🔐 Key olmadan açamazsın!',
          example: 'AES-256 = Military-grade encryption. Brute-force milyarlarca yıl sürer 💪',
          funFact: 'Symmetric (AES) vs Asymmetric (RSA). Symmetric hızlı, Asymmetric güvenli!',
          interview: 'Encryption at rest vs in transit? Rest = Disk\'te, Transit = Network\'te şifreli'
        },
        {
          term: 'SSL/TLS',
          aka: 'Secure Sockets Layer / Transport Layer Security',
          definition: 'Web trafiğini şifreleyen protokol 🌐 HTTPS\'in sırrı!',
          example: 'TLS 1.2 minimum olmalı. TLS 1.3 en yeni ve hızlı! ⚡',
          funFact: 'SSL artık deprecated ama herkes hala "SSL certificate" diyor. Alışkanlık! 😅',
          interview: 'TLS handshake adımları? ClientHello, ServerHello, Certificate, Key Exchange, Finished'
        },
        {
          term: 'Phishing',
          aka: 'Oltalama',
          definition: 'Fake email/site ile kandırma 🎣 "Şifreni ver bana" tarzı dolandırıcılık!',
          example: 'PayPal\'dan geldi sandın, p4ypa1.com\'dan gelmiş. URL\'ye dikkat! 👀',
          funFact: 'Spear phishing = Hedef odaklı. "Cemal Bey, ASIL mesaj bu!" 🎯',
          interview: 'Phishing tespiti? Check sender, hover links, look for urgency, grammar errors'
        },
        {
          term: 'Ransomware',
          aka: 'Fidye Yazılımı',
          definition: 'Dosyaları şifreleyen malware 🦠 Para iste, yoksa data kayıp!',
          example: 'WannaCry, CryptoLocker - Ünlü ransomware\'ler. Milyarlarca $ hasar!',
          funFact: 'RaaS (Ransomware as a Service) var artık. Kiralık ransomware! 💀',
          interview: 'Ransomware korunma? Backup, patch, user training, email filtering, EDR'
        },
        {
          term: 'Zero-Day',
          aka: 'Sıfırıncı Gün Açığı',
          definition: 'Henüz bilinmeyen güvenlik açığı 🕳️ Vendor bile bilmiyor, patch yok!',
          example: 'Zero-day exploit kullanılırsa savunma yok. Ertesi gün patch çıkar',
          funFact: 'Zero-day market var! Exploit\'ler milyonlarca dolara satılır 💸',
          interview: 'Zero-day vs N-day? Zero = Bilinmiyor, N-day = Patch var ama apply edilmemiş'
        },
        {
          term: 'Penetration Testing',
          aka: 'Pentest / Ethical Hacking',
          definition: 'Yasal hacking 🎩 Sistemdeki açıkları bul, raporla!',
          example: 'Red team (attack) vs Blue team (defend). Purple team = İkisi birlikte! ⚔️',
          funFact: 'Bug bounty = Açık bulana para ver. HackerOne, Bugcrowd platformları var 💰',
          interview: 'Pentest türleri? Black box (bilgi yok), White box (full bilgi), Gray box (kısmi bilgi)'
        },
        {
          term: 'SIEM',
          aka: 'Security Information and Event Management',
          definition: 'Merkezi security monitoring 👀 Tüm log\'ları topla, analiz et, alarm ver!',
          example: 'Splunk, QRadar, ArcSight - Enterprise SIEM\'ler. Pahalı ama güçlü!',
          funFact: 'SIEM + SOAR = Otomatik response. Alarm + Action! 🤖',
          interview: 'SIEM use case? Brute-force detection, data exfiltration, privilege escalation'
        },
        {
          term: 'EDR',
          aka: 'Endpoint Detection and Response',
          definition: 'Endpoint\'lerde threat detection 🔍 Antivirus\'ün gelişmiş versiyonu!',
          example: 'CrowdStrike, Carbon Black, Microsoft Defender ATP - Modern EDR\'ler',
          funFact: 'Behavioral analysis yapar. "Bu dosya şüpheli davranıyor!" 🤖',
          interview: 'EDR vs Antivirus? AV = Signature-based, EDR = Behavior + AI-based'
        },
        {
          term: 'DLP',
          aka: 'Data Loss Prevention',
          definition: 'Veri sızmasını önle! 🚫 Hassas data dışarı çıkmasın diye kontrol et',
          example: 'Kredi kartı numarası email\'le gönderiliyor? DLP engelle! 💳',
          funFact: 'USB block, email filtering, clipboard control - DLP çok şey yapar! 🛡️',
          interview: 'DLP policy örnekleri? Block PII in email, prevent USB file copy, watermark documents'
        },
        {
          term: 'WAF',
          aka: 'Web Application Firewall',
          definition: 'Web uygulaması koruması 🌐 SQL injection, XSS gibi web saldırılarını engelle!',
          example: 'Cloudflare WAF, AWS WAF, Azure WAF - Cloud-based popüler',
          funFact: 'OWASP Top 10\'u bilmek şart! SQL injection, XSS, CSRF... 📋',
          interview: 'WAF vs Network Firewall? WAF = Layer 7 (HTTP), Firewall = Layer 3-4 (IP/Port)'
        },
        {
          term: 'IDS/IPS',
          aka: 'Intrusion Detection/Prevention System',
          definition: 'Saldırı tespit/engelleme 🚨 IDS = Tespit et, IPS = Engelle!',
          example: 'Snort, Suricata - Open source IDS/IPS. Port scan detected? Alarm! 🔔',
          funFact: 'False positive çok çıkar. Tuning gerekir sürekli! 🎛️',
          interview: 'IDS vs IPS farkı? IDS = Passive (alert only), IPS = Active (block)'
        },
        {
          term: 'Vulnerability Scanning',
          aka: 'Zafiyet Taraması',
          definition: 'Sistemdeki açıkları tara 🔍 Patch eksikleri, misconfig\'ler bul!',
          example: 'Nessus, OpenVAS, Qualys - Vulnerability scanner\'lar',
          funFact: 'CVSS score = Açığın ciddiyeti. 9.0+ = Critical, hemen patch! 🚨',
          interview: 'Authenticated vs Unauthenticated scan? Auth = Daha detaylı (credential ile login olur)'
        },
        {
          term: 'Privilege Escalation',
          aka: 'Yetki Yükseltme',
          definition: 'Normal kullanıcıdan admin olmak 👑 Saldırganın ana hedefi!',
          example: 'Unpatched kernel, misconfigured service, weak password - Yollar var!',
          funFact: 'UAC bypass = Windows\'ta privilege escalation. Admin onayını atla! 🪟',
          interview: 'Horizontal vs Vertical escalation? Horizontal = Aynı seviye başka user, Vertical = Üst yetki'
        },
        {
          term: 'Social Engineering',
          aka: 'Sosyal Mühendislik',
          definition: 'İnsan manipülasyonu 🎭 Teknoloji değil, insanı hack\'le!',
          example: 'IT support gibi davran, şifre iste. "Ben network admin\'im, şifreni söyle" 📞',
          funFact: 'Tailgating = Birinin arkasından binaya gir. Kart okutmaya gerek yok! 🚪',
          interview: 'Social engineering türleri? Phishing, Pretexting, Baiting, Quid pro quo, Tailgating'
        },
        {
          term: 'Incident Response',
          aka: 'Olay Müdahalesi',
          definition: 'Security olayına müdahale planı 🚨 Breach oldu, ne yapacaksın?',
          example: 'Preparation → Detection → Containment → Eradication → Recovery → Lessons learned',
          funFact: 'IR playbook = Her senaryo için plan. Ransomware? Playbook 5\'i uygula! 📖',
          interview: 'NIST framework? Identify, Protect, Detect, Respond, Recover'
        },
        {
          term: 'Honeypot',
          aka: 'Bal Küpü',
          definition: 'Saldırganları tuzağa düşür 🍯 Fake system kur, saldırganı analiz et!',
          example: 'Canary token, fake database, decoy server - Hepsi honeypot çeşidi',
          funFact: 'Production network\'e honeypot koy. Saldırgan oraya takılsın! 🎯',
          interview: 'Low vs High interaction honeypot? Low = Basit, High = Gerçekçi (full OS)'
        },
        {
          term: 'Certificate Pinning',
          aka: 'Sertifika Sabitleme',
          definition: 'SSL certificate\'i uygulamaya göm 📌 Man-in-the-middle\'ı engelle!',
          example: 'Mobile app sadece belirli certificate\'i kabul eder. Fake cert = Bağlantı yok',
          funFact: 'Charles Proxy ile app traffic\'i göremezsin. Pinning sayesinde! 🔒',
          interview: 'Pinning bypass nasıl yapılır? Root cert install + Frida/Objection'
        },
        {
          term: 'Security Baseline',
          aka: 'Güvenlik Temeli',
          definition: 'Minimum security standartı 📏 Her sistem bu kurallara uymalı!',
          example: 'CIS Benchmarks, Microsoft Security Baselines - Industry standards',
          funFact: 'Hardening = Security baseline uygulama. Gereksiz servisleri kapat! 🔧',
          interview: 'Baseline examples? Disable guest account, enable firewall, enforce password policy, disable SMBv1'
        },
        {
          term: 'Hashing',
          aka: 'Karma Fonksiyonu',
          definition: 'One-way şifreleme 🔐 Hash\'i gördün mü veriyi kurtaramaz!',
          example: 'MD5, SHA-256, bcrypt - Hash algoritmaları. Şifreler hash olarak saklanır 🔒',
          funFact: 'Rainbow table = Hash database. Precomputed hashes ile cracking! 🌈',
          interview: 'Hash vs Encryption? Hash = one-way (irreversible), Encryption = reversible (with key)'
        },
        {
          term: 'PKI',
          aka: 'Public Key Infrastructure',
          definition: 'Public-private key sistemi 🔑 Asymmetric encryption\'ın altyapısı!',
          example: 'Certificate authority, registration authority, repository - PKI bileşenleri',
          funFact: 'Your public key = Herkes görebilir. Private key = Sen sakla! 🤫',
          interview: 'PKI use case? Digital signatures, SSL/TLS certificates, email encryption'
        },
        {
          term: 'SOAR',
          aka: 'Security Orchestration, Automation and Response',
          definition: 'Security otomasyonu 🤖 Playbook çalıştır, threats\'e otomatik cevap ver!',
          example: 'Splunk SOAR, Palo Alto Cortex XSOAR - Enterprise SOAR solutions',
          funFact: 'SIEM + SOAR = Otomatik güvenlik. Alarm geldi mi action çalışır! ⚙️',
          interview: 'SOAR playbook örneği? Phishing alert → Email block → User notify → Incident create'
        },
        {
          term: 'IDS',
          aka: 'Intrusion Detection System',
          definition: 'Saldırı tespit sistemi 🚨 Ağda şüpheli aktivite gördü mü alarm ver!',
          example: 'Snort, Zeek, Suricata - Network-based IDS\'ler',
          funFact: 'Signature-based + Anomaly-based = İki detection yöntemi! 🎯',
          interview: 'IDS placement? NIDS (network) vs HIDS (host-based). Network daha popüler'
        },
        {
          term: 'IPS',
          aka: 'Intrusion Prevention System',
          definition: 'Saldırı engelleme sistemi 🛑 IDS gibi ama aktif olarak saldırıyı bloklar!',
          example: 'Palo Alto Networks, Fortinet FortiGate - Advanced IPS solutions',
          funFact: 'Inline placement = Traffic aradan geçer. Real-time blocking! ⚡',
          interview: 'IPS etkili mi? False positive = Legitimate traffic bloklamak = Bad! ⚠️'
        },
        {
          term: 'DDoS',
          aka: 'Distributed Denial of Service',
          definition: 'Dağıtık hizmet engelleme 💥 Milyonlarca request gönder, server çök!',
          example: 'Botnet attack, CloudFlare DDoS protection - Mitigasyon var!',
          funFact: 'Volumetric DDoS = Bandwidth flood. Protocol DDoS = Resource abuse! 📊',
          interview: 'DDoS mitigation? Rate limiting, traffic filtering, CDN, anycast network'
        },
        {
          term: 'Malware',
          aka: 'Kötü Amaçlı Yazılım',
          definition: 'Zararlı software ☠️ Virus, worm, trojan, spyware hepsi malware!',
          example: 'Emotet, Lazarus group - Ünlü malware\'ler. Milyarlarca zarar verdi!',
          funFact: 'Polymorphic malware = Kendini değiştirir. AV yakalamak zor! 🧬',
          interview: 'Malware detection methods? Signature, heuristic, behavioral, sandboxing'
        },
        {
          term: 'Antivirus',
          aka: 'Virüs Aşısı',
          definition: 'Malware koruması 🛡️ Zararlı yazılımı tanı ve kaldır!',
          example: 'Norton, McAfee, AVG, Kaspersky - Antivirus solutions',
          funFact: 'Antivirus artık yetmiyor. EDR/XDR lazım modern threats için! 🔄',
          interview: 'Antivirus components? Real-time scanning, quarantine, update mechanism'
        },
        {
          term: 'XDR',
          aka: 'Extended Detection and Response',
          definition: 'EDR\'nin üst seviyesi 🚀 Email, endpoint, network hepsinde visibility!',
          example: 'Microsoft Defender XDR, Palo Alto Cortex XDR - Next-gen solutions',
          funFact: 'EDR + Email + Network = XDR. Tüm datalı bakış! 👁️',
          interview: 'XDR vs EDR? EDR = Endpoint focused, XDR = Cross-platform unified view'
        },
        {
          term: 'Vulnerability Scan',
          aka: 'Zafiyet Taraması',
          definition: 'Security açıklarını otomatik bul 🔍 Patch eksikleri, misconfigurations\'ı tespit et!',
          example: 'Nessus, OpenVAS, Qualys - Vulnerability scanners. Weekly scan şart! 📅',
          funFact: 'False positive çok çıkar. Manual verification gerekir! ⚠️',
          interview: 'Scan types? Credentialed vs Non-credentialed, Internal vs External'
        },
        {
          term: 'CVE',
          aka: 'Common Vulnerabilities and Exposures',
          definition: 'Security açığı database! 📚 CVE-2021-12345 diye numaralandırılır',
          example: 'Log4Shell = CVE-2021-44228. NVD.NIST.GOV\'ta bilgileri var',
          funFact: 'Her açık bir CVE ID alır. Tarih kalıcı olur! 📆',
          interview: 'CVE bilgileri nerden? NVD, CVE.org, vendor advisory\'ler'
        },
        {
          term: 'CVSS',
          aka: 'Common Vulnerability Scoring System',
          definition: 'Açığın ciddiyetini puanla! 1-10 scale. 9+ = Critical! 🚨',
          example: 'CVSS 3.1 = Güncel standard. BaseScore, TemporalScore, EnvironmentalScore var',
          funFact: '0.0 = No impact. 10.0 = Maximum impact! Her açık score alır 📊',
          interview: 'CVSS factors? Attack vector, complexity, privileges required, user interaction'
        },
        {
          term: 'Patch Management',
          aka: 'Yama Yönetimi',
          definition: 'Security updates\'i organize et! 🔧 Yamaları timeline\'a uygun uygula',
          example: 'Patch Tuesday (Microsoft) - İkinci salı günü patch gönderilir',
          funFact: '"Turn it off and on" değil; testing ve planning lazım! 📋',
          interview: 'Patch strategy? Zero-day = ASAP, Critical = Günler, Standard = Aylar'
        },
        {
          term: 'MFA',
          aka: 'Multi-Factor Authentication',
          definition: 'Çok-faktörlü kimlik doğrulama 🔐 Password + Phone + Face gibi 🚀',
          example: 'Microsoft Authenticator, YubiKey, Google Authenticator - 2FA tools',
          funFact: 'SMS 2FA < App 2FA < Hardware key. Güvenlik hiyerarşisi! 📈',
          interview: 'Authentication factors? Knowledge (password), Possession (token), Inherence (biometric)'
        },
        {
          term: 'SSO',
          aka: 'Single Sign-On',
          definition: 'Bir kere login, heryerde giriş! 🔓 Tüm uygulamalara erişim',
          example: 'Azure AD, Okta, Google Workspace - SSO providers',
          funFact: 'Şifre yönetimi rahatlar. Merkezi kontrol! 🎛️',
          interview: 'SSO benefits? Improved UX, reduced password reuse, easier MFA enforcement'
        },
        {
          term: 'OAuth',
          aka: 'Open Authorization',
          definition: 'Third-party access iznini ver! 🔑 Şifreni vermeden erişim sağla',
          example: '"Google ile giriş yap" = OAuth. Google hesap şifresi vermiyor!',
          funFact: 'OAuth 2.0 = Standard protocol. Access token + Refresh token var 🎫',
          interview: 'OAuth flow? Authorization Code, Client Credentials, Implicit, Resource Owner Password'
        },
        {
          term: 'SAML',
          aka: 'Security Assertion Markup Language',
          definition: 'XML-based authentication 📄 Enterprise SSO\'nun kalbi!',
          example: 'Office 365, Salesforce, Slack - SAML destekliyor',
          funFact: 'SAML assertion = Kimlik kanıtı. XML formatında encrypted! 🔒',
          interview: 'SAML vs OAuth? SAML = Authentication (ki sen misin?), OAuth = Authorization (ne yapabilirsin?)'
        },
        {
          term: 'Penetration Testing',
          aka: 'Pentest / Ethical Hacking',
          definition: 'Yasal hacking 🎩 Sistemdeki açıkları bul, raporla, exploit et!',
          example: 'Red team vs Blue team. Purple team = Ikisi birlikte! ⚔️',
          funFact: 'Bug bounty = Açık bulana para ver. HackerOne, Bugcrowd! 💰',
          interview: 'Pentest scope? Black-box (no info), White-box (full info), Gray-box (partial info)'
        },
        {
          term: 'Encryption at Rest',
          aka: 'Sabit Verileri Şifreleme',
          definition: 'Disk\'teki veriyi şifrele! 💾 Bilgisayar çalınsa güvenli!',
          example: 'BitLocker (Windows), FileVault (macOS), dm-crypt (Linux) - Disk encryption',
          funFact: 'Full disk encryption = İşletim sistemi başlayamaz şifre olmadan 🔐',
          interview: 'Encryption at rest vs in transit? Rest = Storage, Transit = Network communication'
        },
        {
          term: 'Encryption in Transit',
          aka: 'İletimde Şifreleme',
          definition: 'Ağda transfer edilen veriyi şifrele! 🌐 HTTPS, TLS, VPN kullan',
          example: 'SSL/TLS = Web traffic için. IPsec = Network level! 🔒',
          funFact: 'Man-in-the-middle attack\'e karşı koruma! ⚔️',
          interview: 'Transit encryption methods? TLS, IPsec, SSH, VPN'
        },
        {
          term: 'Defense in Depth',
          aka: 'Katmanlı Savunma',
          definition: 'Bir savunma yetmez, çok katman koy! 🛡️ Layer upon layer!',
          example: 'Firewall → IPS → Antivirus → EDR → SIEM - Security layers!',
          funFact: 'Bir savunma düşerse başka durur! 🏰',
          interview: 'Defense in depth örneği? Perimeter + Host + Network + Application + Data layer'
        }
      ]
    },
    {
      category: 'cloud',
      icon: Cloud,
      color: 'from-cyan-600 to-blue-600',
      title: '☁️ Cloud (Bulut)',
      terms: [
        {
          term: 'IaaS',
          aka: 'Infrastructure as a Service',
          definition: 'Altyapı hizmeti 🏗️ VM, storage, network kirala. Hardware yok!',
          example: 'AWS EC2, Azure VM, Google Compute Engine - Hepsi IaaS',
          funFact: 'Pay-as-you-go = Kullandığın kadar öde. Netflix aboneliği gibi! 💳',
          interview: 'IaaS sorumluluğu? You: OS, app, data. Cloud: Hardware, network, virtualization'
        },
        {
          term: 'PaaS',
          aka: 'Platform as a Service',
          definition: 'Platform hizmeti 🚀 Sadece code yaz, infrastructure cloud\'un!',
          example: 'Azure App Service, Heroku, Google App Engine - Deploy et git!',
          funFact: 'Developer\'lar için cennet. Sadece kod yaz! ✨',
          interview: 'PaaS sorumluluğu? You: Code, data. Cloud: OS, runtime, middleware, infrastructure'
        },
        {
          term: 'SaaS',
          aka: 'Software as a Service',
          definition: 'Yazılım hizmeti 📧 Browser\'dan kullan, kurulum yok!',
          example: 'Gmail, Office 365, Salesforce, Zoom - Hepsi SaaS',
          funFact: 'Update, maintenance, scaling - Hiçbiri senin derdin değil! 😎',
          interview: 'SaaS sorumluluğu? You: Data only. Cloud: Everything else'
        },
        {
          term: 'AWS',
          aka: 'Amazon Web Services',
          definition: 'Amazon\'un cloud platformu 🚀 Market leader, en büyük!',
          example: 'EC2 (VM), S3 (storage), Lambda (serverless), RDS (database) - 200+ servis',
          funFact: 'AWS revenue > Amazon retail! Cloud business king 👑',
          interview: 'AWS regions vs availability zones? Region = Geographic area, AZ = Data center in region'
        },
        {
          term: 'Azure',
          aka: 'Microsoft Azure',
          definition: 'Microsoft\'un cloud platformu ☁️ Enterprise sevdalısı!',
          example: 'Azure AD, Azure VMs, Functions, Cosmos DB - Her şey var',
          funFact: 'Hybrid cloud = On-prem + Azure. Azure Arc ile yönet! 🔄',
          interview: 'Azure subscription vs Resource Group? Subscription = Billing unit, RG = Logical container'
        },
        {
          term: 'Serverless',
          aka: 'FaaS (Function as a Service)',
          definition: 'Server yönetme yok! 🎉 Sadece function yaz, cloud çalıştırır',
          example: 'AWS Lambda, Azure Functions, Google Cloud Functions - Serverless compute',
          funFact: 'Cold start problem = İlk çalışma yavaş. Warm olunca hızlı! ⚡',
          interview: 'Serverless pricing? Execution time + memory. İdeal for bursty workloads'
        },
        {
          term: 'S3',
          aka: 'Simple Storage Service',
          definition: 'AWS\'nin object storage\'ı 💾 Sınırsız storage, pay-as-you-go!',
          example: 'Bucket = Container. Object = File. 99.999999999% (11 nine\'s) durability! 🎯',
          funFact: 'S3 Glacier = Arşiv için. Çok ucuz ama yavaş! Retrieval saatler sürer ❄️',
          interview: 'S3 storage classes? Standard, Intelligent-Tiering, Glacier, Deep Archive'
        },
        {
          term: 'CDN',
          aka: 'Content Delivery Network',
          definition: 'İçerik dağıtım ağı 🌍 Static content\'i worldwide cache\'le!',
          example: 'Cloudflare, AWS CloudFront, Azure CDN - Edge location\'larda cache',
          funFact: 'Latency düşer, bandwidth tasarrufu! Video streaming için şart 🎬',
          interview: 'CDN benefit? Reduced latency, DDoS protection, reduced origin load'
        },
        {
          term: 'Load Balancer',
          aka: 'Yük Dengeleyici',
          definition: 'Traffic\'i dağıt ⚖️ Tek server overload olmasın!',
          example: 'ALB (Application), NLB (Network), CLB (Classic) - AWS load balancer\'ları',
          funFact: 'Health check yapar. Unhealthy server? Traffic gönderme! ❤️‍🩹',
          interview: 'Layer 4 vs Layer 7 LB? L4 = TCP/UDP, L7 = HTTP/HTTPS'
        },
        {
          term: 'Auto Scaling',
          aka: 'Otomatik Ölçeklendirme',
          definition: 'Yük arttı mı? Server ekle! 📈 Azaldı mı? Kaldır! Otomatik!',
          example: 'CPU > %80? 2 server daha ekle. CPU < %30? 1 server kaldır',
          funFact: 'Black Friday? Auto-scaling seni kurtarır! 🛒',
          interview: 'Scale up vs Scale out? Up = Bigger machine, Out = More machines'
        },
        {
          term: 'VPC',
          aka: 'Virtual Private Cloud',
          definition: 'Cloud\'da private network 🏠 Senin özel network\'ün!',
          example: 'Subnet, route table, security group - Hepsi VPC içinde',
          funFact: 'VPC peering = İki VPC\'yi bağla. Private communication! 🔗',
          interview: 'Public vs Private subnet? Public = Internet gateway var, Private = NAT gateway kullanır'
        },
        {
          term: 'Container',
          aka: 'Konteyner',
          definition: 'Lightweight VM 📦 App + dependencies hepsi bir arada!',
          example: 'Docker = Container engine. Kubernetes = Container orchestration',
          funFact: '"Works on my machine" problem solved! 🎉',
          interview: 'Container vs VM? Container = OS-level, VM = Hardware-level. Container daha hafif'
        },
        {
          term: 'Kubernetes',
          aka: 'K8s',
          definition: 'Container orchestration 🎼 Container\'ları yönet, scale et!',
          example: 'Pod, Service, Deployment, ReplicaSet - K8s terimleri çok!',
          funFact: 'K8s = Kubernetes (8 harf ortada). Yunanca "dümenci" demek ⚓',
          interview: 'Kubernetes components? Master (API server, scheduler, controller) + Node (kubelet, kube-proxy)'
        },
        {
          term: 'Docker',
          aka: 'Container Platform',
          definition: 'Container teknolojisi 🐳 Image build et, container run et!',
          example: 'Dockerfile → docker build → docker run. Üç adım! 🔢',
          funFact: 'Docker Hub = Container registry. Public image\'lar buradan! 📦',
          interview: 'Docker architecture? Client → Docker daemon → containerd → runc'
        },
        {
          term: 'CI/CD',
          aka: 'Continuous Integration/Deployment',
          definition: 'Otomatik build & deploy 🤖 Code push → Test → Deploy. Otomatik!',
          example: 'Jenkins, GitHub Actions, GitLab CI, Azure DevOps - CI/CD tool\'ları',
          funFact: 'Blue-green deployment = İki environment. Zero downtime! 🔵🟢',
          interview: 'CI vs CD? CI = Build + Test, CD = Deploy to production'
        },
        {
          term: 'Infrastructure as Code',
          aka: 'IaC',
          definition: 'Altyapıyı kod ile yönet 📝 Manual click yok, script her şeyi yapar!',
          example: 'Terraform, CloudFormation, ARM templates - IaC tool\'ları',
          funFact: 'Idempotent = Kaç kere çalıştırsan aynı sonuç! 🔁',
          interview: 'Declarative vs Imperative? Declarative = "Ne istiyorum", Imperative = "Nasıl yapılır"'
        },
        {
          term: 'Microservices',
          aka: 'Mikro Servisler',
          definition: 'Uygulamayı küçük servislere böl 🧩 Her servis bağımsız!',
          example: 'Monolith = Tek devasa app. Microservices = 50 küçük servis',
          funFact: 'Netflix = Microservices champion. 700+ microservices! 📺',
          interview: 'Microservices challenges? Service discovery, data consistency, debugging, monitoring'
        },
        {
          term: 'API Gateway',
          aka: 'API Ağ Geçidi',
          definition: 'API\'lerin giriş kapısı 🚪 Routing, auth, rate limiting yapar!',
          example: 'AWS API Gateway, Kong, Apigee - API management platform\'ları',
          funFact: 'Backend for Frontend (BFF) pattern = Her platform için ayrı gateway! 📱💻',
          interview: 'API Gateway benefits? Single entry point, auth, rate limiting, caching, monitoring'
        },
        {
          term: 'Service Mesh',
          aka: 'Servis Ağı',
          definition: 'Microservices arası iletişim yönetimi 🕸️ Istio, Linkerd gibi!',
          example: 'Traffic management, security, observability - Service mesh sağlar',
          funFact: 'Sidecar pattern = Her pod\'a proxy ekle. Istio böyle çalışır! 📦',
          interview: 'Service mesh features? Load balancing, service discovery, encryption, observability'
        },
        {
          term: 'Cloud Storage Tiers',
          aka: 'Depolama Katmanları',
          definition: 'Sık erişilen = Pahalı, nadir = Ucuz 💰 Kullanıma göre seç!',
          example: 'Hot tier = Sık erişim. Cool = Nadir. Archive = Çok nadir (yıllık)',
          funFact: 'Lifecycle policy = Otomatik tier değiştir. 90 gün sonra archive\'a taşı! 🔄',
          interview: 'Storage pricing factors? Capacity, transactions, data transfer, durability'
        },
        {
          term: 'Multi-Cloud',
          aka: 'Çok Bulut',
          definition: 'Birden fazla cloud provider kullan 🌐 Vendor lock-in riskini azalt!',
          example: 'AWS + Azure + GCP. Hepsi beraber çalışsın. Flexibility max! 💪',
          funFact: 'Multi-cloud = Karmaşık ama güçlü. Yönetmek zor, ama bağımsız kalırsın! 🎯',
          interview: 'Multi-cloud challenges? Complexity, management, cost tracking, data consistency'
        },
        {
          term: 'Hybrid Cloud',
          aka: 'Melez Bulut',
          definition: 'On-premise + Cloud beraber 🏢☁️ En iyi ikisinin kombinasyonu!',
          example: 'Sensitive data = On-prem, Scaling = Cloud. Perfect balance! ⚖️',
          funFact: 'Azure Arc, AWS Outposts = Hybrid cloud enablers. Your data stays, cloud power comes! 🚀',
          interview: 'Hybrid cloud benefits? Flexibility, security, cost optimization, compliance'
        },
        {
          term: 'VM',
          aka: 'Virtual Machine',
          definition: 'Sanal makine 🖥️ Yazılım ile bilgisayar simülasyonu. Hosting\'in temeli!',
          example: 'EC2, Azure VM, Google Compute = VM services. OS + App hepsi virtual!',
          funFact: 'Hypervisor = VM manager. Type-1 (bare metal) vs Type-2 (hosted) var! 🎛️',
          interview: 'VM advantages? Cost-effective, scalable, isolated, flexible OS support'
        },
        {
          term: 'Lambda',
          aka: 'AWS Lambda',
          definition: 'AWS\'nin serverless compute servisi ⚡ Fonksiyon yaz, çalışsın!',
          example: 'Node.js, Python, Java, Go - 15+ runtime. Trigger = Event!',
          funFact: 'Cold start = 100-1000ms ilk invoke yavaş. Warm = Hızlı! ❄️→⚡',
          interview: 'Lambda pricing? Per-invocation + memory + execution time. Duration = billed per 100ms'
        },
        {
          term: 'EC2',
          aka: 'Elastic Compute Cloud',
          definition: 'AWS\'nin VM servisi 🚀 Scale up/down kolay. Pay-as-you-go!',
          example: 't2.micro (free tier), m5.large (general), c5.xlarge (compute) - Instance types',
          funFact: 'Spot instance = 90% discount! Ama terminate edilebilir. Risk var! 💸',
          interview: 'EC2 instance lifecycle? Pending → Running → Stopping → Stopped → Terminated'
        },
        {
          term: 'Docker',
          aka: 'Container Platform',
          definition: 'Konteyner teknolojisi 🐳 Image build et, run et, everywhere çalışsın!',
          example: 'Dockerfile = Recipe. Image = Snapshot. Container = Running instance. Easy!',
          funFact: 'Docker = LXC wrapper\'ı. Namespaces + Cgroups = Lightweight VM! 🎁',
          interview: 'Docker vs VM? VM = Full OS, Docker = Shared kernel. Docker daha hafif ve hızlı! ⚡'
        },
        {
          term: 'Kubernetes',
          aka: 'K8s',
          definition: 'Container orchestration 🎼 Docker containers\'ı yönet, scale, self-heal!',
          example: 'Pod, Service, Deployment, StatefulSet - K8s objects çok sayıda!',
          funFact: 'K8s = 8 letter ("ubernete"). Google\'dan geldi, CNCF\'ye bağışladı! 🎁',
          interview: 'Kubernetes components? API Server, Scheduler, Controller Manager, etcd (on master)'
        },
        {
          term: 'Serverless',
          aka: 'Sunucusuz',
          definition: 'Server yönetme yok! 🎉 Code yaz, cloud çalıştırır, scale otomatik!',
          example: 'Lambda, Azure Functions, Google Cloud Functions - FaaS providers',
          funFact: 'Billing = Invocations + memory + duration. Kullanmadığın zaman = Free! 💰',
          interview: 'When NOT to use serverless? Long-running tasks, constant load, strict performance needs'
        },
        {
          term: 'Terraform',
          aka: 'Infrastructure as Code Tool',
          definition: 'IaC tool 📝 HCL syntax ile infrastructure define et. Idempotent!',
          example: 'terraform init → terraform plan → terraform apply → terraform destroy. 4 adım!',
          funFact: 'State file = Important! S3\'de sakla, lock yap. Corruption = Disaster! 🔒',
          interview: 'Terraform vs CloudFormation? Terraform = Multi-cloud, CF = AWS only'
        },
        {
          term: 'CloudFormation',
          aka: 'AWS Infrastructure as Code',
          definition: 'AWS\'nin IaC servisi ☁️ JSON/YAML ile infrastructure template yaz!',
          example: 'Template → Stack → Resources. Nested stacks ile complex architectures!',
          funFact: 'Change sets = Preview önce görmek. Deploy = Zero-downtime possible! 🎯',
          interview: 'CloudFormation benefits? Version control, reproducible, automated rollback'
        },
        {
          term: 'GCP',
          aka: 'Google Cloud Platform',
          definition: 'Google\'un cloud platformu 🔍 Data analytics ve ML için süper!',
          example: 'Compute Engine, Cloud Run, BigQuery, Vertex AI - GCP services',
          funFact: 'GCP = Best for data science. BigQuery = SQL warehouse behemoth! 📊',
          interview: 'GCP vs AWS vs Azure? GCP = Data/ML, AWS = Broadest, Azure = Enterprise'
        },
        {
          term: 'Auto Scaling',
          aka: 'Otomatik Ölçekleme',
          definition: 'Yük arttı = Server ekle, azaldı = Kaldır 📈 Otomatik capacity management!',
          example: 'CPU >75%? 2 server ekle. Memory >80%? 1 server ekle. Custom metrics de possible!',
          funFact: 'Black Friday mı? Auto-scaling = Your hero! Peak load = Handle easily! 🛒',
          interview: 'Scaling policies? Target tracking, step scaling, scheduled scaling'
        },
        {
          term: 'Load Balancing',
          aka: 'Yük Dengeleme',
          definition: 'Traffic\'i servers arasında dağıt ⚖️ Single point of failure olmaz!',
          example: 'Round robin, least connections, IP hash, weighted round robin - Algorithms',
          funFact: 'Health checks = Ölü servers hariç. Auto-remove + recovery! 💚',
          interview: 'L4 vs L7 load balancing? L4 = TCP/UDP (fast), L7 = HTTP (smart routing)'
        },
        {
          term: 'CloudWatch',
          aka: 'AWS Monitoring',
          definition: 'AWS\'nin monitoring servisi 👀 Logs, metrics, alarms hepsi bir yerde!',
          example: 'Dashboards, MetricAlarms, LogGroups, Events - CloudWatch features',
          funFact: 'X-Ray = Distributed tracing. Microservices debugging = Easy! 🔍',
          interview: 'CloudWatch pricing? Metrics = $0.10, Logs = $0.50/GB ingestion'
        },
        {
          term: 'Elastic IP',
          aka: 'Esnek IP Adresi',
          definition: 'EC2 instance\'a sabit IP ataması 🎯 Instance restart = IP aynı kalır!',
          example: 'Production server\'a Elastic IP at. Fail-over = IP\'yi başka instance\'a taşı!',
          funFact: 'Elastic IP = Aylık charge varsa allocated ama kullanılmıyorsa! 💸',
          interview: 'When to use Elastic IP? Static IP needed, failover scenarios, DNS stability'
        },
        {
          term: 'VPC',
          aka: 'Virtual Private Cloud',
          definition: 'Cloud\'da senin özel network 🏠 Isolated, configurable, secure!',
          example: 'Subnets, route tables, security groups, NACLs - VPC components',
          funFact: 'VPC peering = İki VPC bağla. Transit gateway = Hub-spoke topology! 🌟',
          interview: 'VPC isolation? Network-level isolation. Completely separate unless you peer/connect'
        },
        {
          term: 'IAM',
          aka: 'Identity and Access Management',
          definition: 'Cloud resource access control 🔐 User, role, permission management!',
          example: 'Policy = JSON. Effect (Allow/Deny), Principal, Action, Resource',
          funFact: 'Principle of least privilege = Default deny, minimum permissions grant! 🎯',
          interview: 'IAM best practices? Enable MFA, use roles (not access keys), audit logs'
        },
        {
          term: 'Cost Optimization',
          aka: 'Maliyet Optimizasyonu',
          definition: 'Cloud bills düşür 💰 RI, Savings Plans, Spot instances = Money saver!',
          example: 'AWS Cost Explorer, RI planner, right-sizing recommendations - Cost tools',
          funFact: 'Reserved instances = 72% discount! 3-year vs 1-year options. Commitment gerekir! 📉',
          interview: 'Cost optimization strategies? Reserved instances, spot, savings plans, right-sizing'
        },
        {
          term: 'Cloud Migration',
          aka: 'Buluta Göç',
          definition: 'On-prem → Cloud transfer 🚀 Lift-and-shift ya da rearchitect?',
          example: '6Rs: Rehost, Replatform, Refactor, Repurchase, Retire, Retain',
          funFact: 'Lift-and-shift = Fastest but no optimization. Refactor = Slow but best! ⚖️',
          interview: 'Migration challenges? Downtime, data consistency, skill gaps, cost planning'
        },
        {
          term: 'Container Registry',
          aka: 'Konteyner Deposu',
          definition: 'Docker images sakla ve paylaş 📦 Public/private repositories!',
          example: 'Docker Hub, ECR (AWS), ACR (Azure), GCR (Google) - Container registries',
          funFact: 'Image tagging = Version control. latest = Bad practice! Use specific tags! ⚠️',
          interview: 'Registry security? Image scanning, access control, signing, vulnerability management'
        },
        {
          term: 'API Gateway',
          aka: 'API Ağ Geçidi',
          definition: 'API management giriş kapısı 🚪 Rate limiting, auth, routing, caching!',
          example: 'AWS API Gateway, Kong, Apigee - Popular API gateway solutions',
          funFact: 'Rate limiting = DDoS protection. Request throttling = Fair usage! 🛡️',
          interview: 'API Gateway features? Authentication, throttling, caching, transformation, logging'
        },
        {
          term: 'Cloud Monitoring',
          aka: 'Bulut İzlemesi',
          definition: 'Real-time system health check 👀 Metrics, logs, traces all in one!',
          example: 'Prometheus, Grafana, Datadog, New Relic - Monitoring solutions',
          funFact: 'Alert fatigue = Too many false alerts. Fine-tune threshold! 🔔',
          interview: 'Monitoring pillars? Metrics, logs, traces (observability). The 3 golden signals!'
        },
        {
          term: 'Container Orchestration',
          aka: 'Konteyner Yönetimi',
          definition: 'Containers deploy, schedule, scale, manage 🎼 Kubernetes king!',
          example: 'Kubernetes, Docker Swarm, Nomad - Orchestration platforms',
          funFact: 'Self-healing = Pod died? Auto restart. Node died? Pod reschedule! ⚕️',
          interview: 'Container orchestration benefits? High availability, auto-scaling, rolling updates'
        }
      ]
    },
    {
      category: 'database',
      icon: Database,
      color: 'from-green-600 to-emerald-600',
      title: '🗄️ Veritabanı (Database)',
      terms: [
        {
          term: 'SQL',
          aka: 'Structured Query Language',
          definition: 'Veritabanı sorgulama dili 📊 SELECT, INSERT, UPDATE, DELETE - CRUD!',
          example: 'SELECT * FROM users WHERE age > 18; - Basit sorgu',
          funFact: 'SQL = "sequel" diye okunur. Structured Query Language! 🗣️',
          interview: 'JOIN types? INNER, LEFT, RIGHT, FULL OUTER, CROSS'
        },
        {
          term: 'NoSQL',
          aka: 'Not Only SQL',
          definition: 'SQL olmayan veritabanları 🆕 Schema-less, flexible!',
          example: 'MongoDB (document), Redis (key-value), Cassandra (column), Neo4j (graph)',
          funFact: 'ACID vs BASE. SQL = ACID, NoSQL = BASE. Trade-off! ⚖️',
          interview: 'When to use NoSQL? Unstructured data, high scalability, flexible schema'
        },
        {
          term: 'Index',
          aka: 'İndeks',
          definition: 'Veritabanı hızlandırıcı 🚀 Kitabın index\'i gibi, hızlı bulma!',
          example: 'WHERE email = "..." → Index varsa microsecond, yoksa scan tüm tablo (yavaş!)',
          funFact: 'Too many indexes = INSERT/UPDATE yavaşlar. Balance lazım! ⚖️',
          interview: 'Clustered vs Non-clustered index? Clustered = Physical sort, Non-clustered = Separate structure'
        },
        {
          term: 'Primary Key',
          aka: 'Birincil Anahtar',
          definition: 'Satırın unique ID\'si 🆔 Her satır farklı primary key\'e sahip!',
          example: 'UserID = Primary key. Duplicate olamaz, NULL olamaz',
          funFact: 'Auto-increment = Database otomatik arttırır. 1, 2, 3, 4... 📈',
          interview: 'Primary key vs Unique key? Primary = NULL yok + 1 tane, Unique = NULL olabilir + birden fazla'
        },
        {
          term: 'Foreign Key',
          aka: 'Yabancı Anahtar',
          definition: 'Tablolar arası bağlantı 🔗 Referential integrity sağlar!',
          example: 'Orders.UserID → Users.UserID. Orphan record olmasın!',
          funFact: 'CASCADE delete = Parent silinince child\'lar da silinir! Dikkatli kullan ⚠️',
          interview: 'Referential integrity nedir? Foreign key ile parent-child relationship tutarlılığı'
        },
        {
          term: 'Transaction',
          aka: 'İşlem',
          definition: 'All or nothing! 💥 Tüm işlemler başarılı olmalı ya da hiçbiri!',
          example: 'Para transferi: Hesaptan çık + Hesaba ekle. İkisi de olmalı!',
          funFact: 'ACID = Atomicity, Consistency, Isolation, Durability. Transaction garantileri! 🔒',
          interview: 'ROLLBACK vs COMMIT? ROLLBACK = İptal et, COMMIT = Kaydet'
        },
        {
          term: 'Normalization',
          aka: 'Normalleştirme',
          definition: 'Veritabanını düzenleme 🧹 Redundancy azalt, consistency arttır!',
          example: '1NF, 2NF, 3NF, BCNF - Normalization seviyeleri',
          funFact: 'Denormalization = Bazen performance için normalize etme! Trade-off ⚖️',
          interview: '3NF nedir? No transitive dependency. A → B → C yok!'
        },
        {
          term: 'Stored Procedure',
          aka: 'Saklı Yordam',
          definition: 'Database\'de kayıtlı SQL kodu 📜 Bir kere yaz, çok kere çağır!',
          example: 'CREATE PROCEDURE GetUserOrders ... EXEC GetUserOrders @UserID',
          funFact: 'Compiled ve cached. Her seferinde parse yok, hızlı! ⚡',
          interview: 'Stored procedure benefits? Reusability, security, performance, maintainability'
        },
        {
          term: 'View',
          aka: 'Görünüm',
          definition: 'Virtual table 👻 Sorgu sonucu table gibi görünür!',
          example: 'CREATE VIEW ActiveUsers AS SELECT * FROM Users WHERE status = \'active\'',
          funFact: 'Materialized view = Cached result. Normal view = Her seferinde query! 🔄',
          interview: 'View vs Table? View = Virtual (query), Table = Physical (data)'
        },
        {
          term: 'Trigger',
          aka: 'Tetikleyici',
          definition: 'Otomatik çalışan kod 🤖 INSERT/UPDATE/DELETE olunca tetiklenir!',
          example: 'AFTER INSERT trigger = Yeni kayıt gelince log tablosuna yaz',
          funFact: 'Trigger chain = Trigger başka trigger\'ı tetikler. Dikkat, infinite loop! ♾️',
          interview: 'BEFORE vs AFTER trigger? BEFORE = Önce çalış (validation), AFTER = Sonra çalış (logging)'
        },
        {
          term: 'Replication',
          aka: 'Çoğaltma',
          definition: 'Database\'i kopyala 📋 Master-Slave, yedeklilik + read scaling!',
          example: 'Master = Write, Slave = Read. Read load dağıt!',
          funFact: 'Async vs Sync replication. Async = Hızlı ama lag var, Sync = Yavaş ama consistent 🔄',
          interview: 'Replication lag nedir? Master ile slave arasındaki gecikme (seconds)'
        },
        {
          term: 'Sharding',
          aka: 'Parçalama',
          definition: 'Database\'i horizontal böl ✂️ User 1-1000 shard1, 1001-2000 shard2!',
          example: 'Horizontal scaling için. Single DB limit var, shard ile aş!',
          funFact: 'Shard key seçimi kritik! Yanlış key = Unbalanced shards 🎯',
          interview: 'Vertical vs Horizontal partitioning? Vertical = Column, Horizontal = Row'
        },
        {
          term: 'Connection Pool',
          aka: 'Bağlantı Havuzu',
          definition: 'DB connection\'ları önceden aç 🏊 Her seferinde yeni connection açma!',
          example: 'Pool size = 50. App başladı, 50 connection açık bekliyor',
          funFact: 'Connection açma pahalı! Pool kullan, reuse et ♻️',
          interview: 'Pool exhaustion nedir? Tüm connection\'lar kullanımda, yeni request bekliyor'
        },
        {
          term: 'ACID',
          aka: 'Atomicity, Consistency, Isolation, Durability',
          definition: 'Transaction garantileri 🔒 Database reliability prensipleri!',
          example: 'Atomicity = All or nothing. Consistency = Valid state. Isolation = Concurrent safe. Durability = Persist!',
          funFact: 'NoSQL genelde ACID yok. BASE var: Basically Available, Soft state, Eventually consistent',
          interview: 'Isolation levels? Read uncommitted, Read committed, Repeatable read, Serializable'
        },
        {
          term: 'ORM',
          aka: 'Object-Relational Mapping',
          definition: 'SQL yazmadan DB kullan 🎩 Object → Table mapping otomatik!',
          example: 'Entity Framework, Hibernate, Sequelize - Popüler ORM\'ler',
          funFact: 'N+1 problem = ORM\'nin korkulu rüyası. 1 query + N query (yavaş!) 🐌',
          interview: 'ORM pros/cons? Pro: Fast dev, Con: Performance (complex queries), Vendor lock-in'
        },
        {
          term: 'Cursor',
          aka: 'İmleç',
          definition: 'Satır satır işleme 👆 Büyük result set\'i tek tek oku!',
          example: 'DECLARE cursor, OPEN, FETCH, CLOSE - Cursor lifecycle',
          funFact: 'Cursor = Yavaş! Mümkünse set-based operation kullan 🚀',
          interview: 'When to use cursor? Complex row-by-row logic, unavoidable sequential processing'
        },
        {
          term: 'Deadlock',
          aka: 'Kilitlenme',
          definition: 'İki transaction birbirini bekliyor 🔒🔒 Sonsuza kadar!',
          example: 'T1 locks A, wants B. T2 locks B, wants A. Deadlock! 💀',
          funFact: 'Deadlock detection = DB otomatik tespit eder, birini ROLLBACK yapar 🔄',
          interview: 'Deadlock prevention? Consistent lock order, timeout, minimize lock duration'
        },
        {
          term: 'Backup & Restore',
          aka: 'Yedekleme & Geri Yükleme',
          definition: 'Data kaybına karşı korunma 💾 Full, Differential, Transaction log backup!',
          example: 'Full backup Pazar. Differential Çarşamba. T-log her 15dk. Recovery strategy! 🔄',
          funFact: 'Test your backups! Untested backup = No backup 🆘',
          interview: 'RPO vs RTO? RPO = Recovery Point Objective (data loss), RTO = Recovery Time Objective (downtime)'
        },
        {
          term: 'Query Optimization',
          aka: 'Sorgu Optimizasyonu',
          definition: 'Yavaş query\'yi hızlandır 🚀 Index, rewrite, analyze!',
          example: 'EXPLAIN/EXECUTION PLAN ile query analiz et. Index missing? Ekle!',
          funFact: 'SELECT * = Kötü! Sadece ihtiyacın olanları seç 🎯',
          interview: 'Query optimization techniques? Add index, avoid SELECT *, use WHERE, limit result, avoid subqueries'
        },
        {
          term: 'Database Schema',
          aka: 'Veritabanı Şeması',
          definition: 'Database yapısı 🏗️ Table, column, relationship tanımları!',
          example: 'CREATE TABLE users (id INT, name VARCHAR, email VARCHAR) - Schema definition',
          funFact: 'Schema migration = Schema değişikliği. Flyway, Liquibase tool\'ları var 🔄',
          interview: 'Schema evolution strategies? Versioning, migration scripts, backward compatibility'
        },
        {
          term: 'MySQL',
          aka: 'MySQL RDBMS',
          definition: 'En popüler SQL database 🌍 Open-source, web\'te kullanılır!',
          example: 'WordPress, Laravel, PHP uygulamaları MySQL kullanır',
          funFact: 'MySQL = My + SQL. Michael Widenius\'un kızının adından! 👧',
          interview: 'MySQL vs PostgreSQL? MySQL = Hızlı, basit. PostgreSQL = Advanced features'
        },
        {
          term: 'PostgreSQL',
          aka: 'Postgres',
          definition: 'Enterprise-grade SQL database 💪 Advanced features, reliability!',
          example: 'JSON support, Window functions, Full-text search - PostgreSQL specialties',
          funFact: 'PostgreSQL = Açık kaynak ama MySQL\'den daha powerful! 🚀',
          interview: 'PostgreSQL strengths? ACID compliant, complex queries, extensibility, reliability'
        },
        {
          term: 'MongoDB',
          aka: 'NoSQL Document DB',
          definition: 'Document-based NoSQL database 📄 JSON benzeri BSON format!',
          example: 'Collections ve documents. Schema-less, flexible veri yapısı',
          funFact: 'MongoDB = "humongous". Huge amounts of data! 💾',
          interview: 'MongoDB pros/cons? Pro: Flexible, scalable. Con: No ACID (5.0+), memory hungry'
        },
        {
          term: 'Redis',
          aka: 'Remote Dictionary Server',
          definition: 'In-memory cache/datastore ⚡ Super hızlı, key-value store!',
          example: 'Cache, session store, real-time leaderboards, messaging',
          funFact: 'Redis = Hafızada. Hız için trade-off yaparsın - data persist yok default! 💨',
          interview: 'Redis use cases? Caching, sessions, queues, real-time analytics, rate limiting'
        },
        {
          term: 'Cassandra',
          aka: 'Distributed NoSQL',
          definition: 'Massive scalability için 📊 Distributed, fault-tolerant database!',
          example: 'Facebook, Netflix, Instagram - Huge scale applications',
          funFact: 'Cassandra = Eventually consistent. High availability focus! 🌐',
          interview: 'Cassandra advantages? Horizontal scaling, fault-tolerance, high write throughput'
        },
        {
          term: 'Oracle',
          aka: 'Oracle Database',
          definition: 'Enterprise database king 👑 Ücretli, powerfull, complex!',
          example: 'Banking, Fortune 500 companies - Oracle dominant',
          funFact: 'Oracle = En pahalı database! Ama enterprise features zengin 💰',
          interview: 'Oracle vs MySQL? Oracle = Enterprise, expensive, advanced. MySQL = Web-focused, cheap'
        },
        {
          term: 'MSSQL',
          aka: 'Microsoft SQL Server',
          definition: 'Microsoft\'in database ⊞ Windows ecosystem\'te popüler!',
          example: '.NET applications, Windows Server environments',
          funFact: 'MSSQL vs Oracle = Enterprise arenası. MSSQL daha erişilebilir! 🆚',
          interview: 'MSSQL features? T-SQL language, Integration Services, Reporting Services, Analysis Services'
        },
        {
          term: 'JOIN',
          aka: 'Tablo Birleştirme',
          definition: 'İki tablo birleştir 🔗 INNER, LEFT, RIGHT, FULL OUTER, CROSS!',
          example: 'SELECT u.name, o.order_date FROM users u INNER JOIN orders o ON u.id = o.user_id',
          funFact: 'INNER = Ortak kayıtlar. LEFT = Left tüm kayıtlar + sağ match. RIGHT = Opposite!',
          interview: 'JOIN complexity? O(n*m). Yanlış kullanırsan query çok yavaş! ⚠️'
        },
        {
          term: 'Denormalization',
          aka: 'Kaldırma',
          definition: 'Normalize etme tersi 🔄 Redundancy ekle, performance arttır!',
          example: 'User order count → User tablosuna redundant column ekle vs query for every order',
          funFact: 'Denormalization = Trade-off. Write expensive, read cheap! ⚖️',
          interview: 'When to denormalize? High read traffic, low write traffic, performance critical'
        },
        {
          term: 'Sharding vs Partitioning',
          aka: 'Parçalama vs Bölümleme',
          definition: 'İki farklı scaling tekniği 📐 Sharding = Horizontal, Partitioning = Vertical!',
          example: 'Sharding: User 1-1000 DB1, 1001-2000 DB2. Partitioning: Hot data SSD, Cold data HDD',
          funFact: 'Sharding = Cross-machine. Partitioning = Same machine!',
          interview: 'Shard key selection critical? Bad shard key = Unbalanced, hotspots! 🎯'
        },
        {
          term: 'Replication vs Backup',
          aka: 'Çoğaltma vs Yedekleme',
          definition: 'Farklı purposes 🔄 Replication = HA, Backup = Disaster recovery!',
          example: 'Replication = Live copy. Backup = Point-in-time snapshot',
          funFact: 'Backup = Disaster. Replication = HA. Donu ikisine ihtiyacın var! 🛡️',
          interview: 'Backup + Replication strategy? Master + Slave (HA) + Daily backup (DR)'
        },
        {
          term: 'Migration',
          aka: 'Göç',
          definition: 'Database taşı veya upgrade et 🚚 MySQL → PostgreSQL gibi',
          example: 'Schema migration, data migration, cutover planning',
          funFact: 'Migration = Zero-downtime migration yapmazsan insanlar kızar! 😠',
          interview: 'Migration strategies? Full dump, incremental sync, dual-write, feature toggles'
        },
        {
          term: 'Stored Procedure vs Function',
          aka: 'Yordam vs Fonksiyon',
          definition: 'İkisi de database kodı 📜 Procedure = Multiple SQL, Function = Return value!',
          example: 'PROCEDURE exec mühtemel. FUNCTION daha lightweight, composable',
          funFact: 'Function = Pure function (side effect yok ideal). Procedure = Anything goes!',
          interview: 'When to use each? Procedure = Complex logic. Function = Reusable calculation'
        },
        {
          term: 'Trigger Use Cases',
          aka: 'Tetikleyici Kullanımı',
          definition: 'Tetikleyici ne zaman kullanılır 🤖 Logging, validation, audit trail!',
          example: 'AFTER INSERT → Log table, BEFORE UPDATE → Validate data, AFTER DELETE → Archive',
          funFact: 'Trigger = Hidden logic. Debug hard! Use sparingly! 🐛',
          interview: 'Trigger anti-patterns? Cascading logic, implicit behavior, performance impact'
        },
        {
          term: 'Replication Lag',
          aka: 'Çoğaltma Gecikmesi',
          definition: 'Master → Slave gecikme ⏱️ Eventual consistency!',
          example: 'Write master, immediate read slave = Stale data! Eventually consistent!',
          funFact: 'Replication lag = Milliseconds-seconds. Sometimes minutes! 🐌',
          interview: 'Handle replication lag? Read from master after write, caching, client-side logic'
        },
        {
          term: 'Connection Pooling',
          aka: 'Bağlantı Havuzu',
          definition: 'Connection reuse 🏊 DB bağlantıları expensive, reuse et!',
          example: 'HikariCP (Java), sqlalchemy (Python) - Popular pool libraries',
          funFact: 'No pool = Connection per request. Slow! Pool = 50 connections, all reuse! ♻️',
          interview: 'Pool sizing? Start small (10-20), monitor, scale based on load'
        },
        {
          term: 'ACID Properties Deep Dive',
          aka: 'ACID Derinlemesine',
          definition: 'Transaction guarantileri detaylı 🔒 Nasıl çalışır?',
          example: 'Atomicity = Undo logs. Consistency = Constraints. Isolation = Locks. Durability = Write-ahead log',
          funFact: 'ACID = Database\'in sorumluluk alanı. Application\'a güven edebilirsin! 🛡️',
          interview: 'Implementing ACID? Write-ahead logging (WAL), locks, constraints, recovery mechanism'
        },
        {
          term: 'Database Indexing Strategy',
          aka: 'İndeks Stratejisi',
          definition: 'Index optimization 📊 Neye index ekle, neye ekleme?',
          example: 'WHERE, JOIN, ORDER BY columnları. High cardinality. Avoid low cardinality!',
          funFact: 'Too many indexes = INSERT/UPDATE slow. Index = Overhead! ⚠️',
          interview: 'Index monitoring? EXPLAIN PLAN, slow query log, index fragmentation'
        },
        {
          term: 'Database Scaling',
          aka: 'Ölçekleme',
          definition: 'Database büyütsün! Vertical vs Horizontal 📈',
          example: 'Vertical = Bigger server. Horizontal = More servers (sharding)',
          funFact: 'Vertical = Simple ama limit var. Horizontal = Complex ama unlimited! ∞',
          interview: 'Scaling bottleneck? CPU, Memory, Disk I/O, Network. Profiling gerekli!'
        },
        {
          term: 'Database Locking',
          aka: 'Database Kilitleme',
          definition: 'Concurrent access control 🔒 Pessimistic vs Optimistic!',
          example: 'Pessimistic = Lock hemen. Optimistic = Lock on write, check if changed',
          funFact: 'Lock = Performance impact. Minimize lock duration! ⚡',
          interview: 'Lock escalation? Row → Page → Table lock. Automatic, database decides'
        },
        {
          term: 'Query Execution Plan',
          aka: 'Sorgu Yürütme Planı',
          definition: 'Query nasıl çalışır gösterir 📋 EXPLAIN/ANALYZE kullan!',
          example: 'EXPLAIN SELECT ... → Sequential scan, Index scan, Hash join decisions gösterir',
          funFact: 'Execution plan = Database wizard! Optimize etmen sağlar 🧙',
          interview: 'Plan optimization? Add index, rewrite query, update statistics'
        },
        {
          term: 'Consistency Models',
          aka: 'Tutarlılık Modelleri',
          definition: 'Strong vs Eventual consistency 🤝 Trade-off!',
          example: 'SQL = Strong. NoSQL = Eventual. CAP theorem! ⚖️',
          funFact: 'Strong consistency = Slow. Eventual consistency = Fast ama complicated logic! 💭',
          interview: 'CAP theorem? Consistency, Availability, Partition tolerance. Choose 2!'
        },
        {
          term: 'Database Monitoring',
          aka: 'Veritabanı İzleme',
          definition: 'Database health check 💓 CPU, memory, queries, slowness!',
          example: 'Prometheus, DataDog, New Relic - Monitoring tools',
          funFact: 'Monitoring = Pain prevention. Proactive > Reactive! 🚨',
          interview: 'Key metrics? CPU, Memory, Disk I/O, Query latency, Connection count, Cache hit rate'
        },
        {
          term: 'Data Warehouse vs OLTP',
          aka: 'Data Warehouse vs İşlemsel DB',
          definition: 'İki farklı database design 📊 OLTP = Transactional, DW = Analytical!',
          example: 'OLTP = Production DB (MySQL). DW = Analytics (Snowflake, BigQuery)',
          funFact: 'OLTP = Yazma optimized. DW = Okuma optimized. Opposite! 🔄',
          interview: 'Why separate? Different access patterns, schemas, scale requirements'
        },
        {
          term: 'Database Encryption',
          aka: 'Veritabanı Şifreleme',
          definition: 'Data security 🔐 Encryption at rest ve in transit!',
          example: 'TDE (Transparent Data Encryption), SSL/TLS for connections, field-level encryption',
          funFact: 'Encryption = Performance cost. Cryptography hard! Use libraries! 🔑',
          interview: 'Encryption strategy? At-rest, in-transit, key management, compliance (HIPAA, PCI)'
        }
      ]
    },
    {
      category: 'linux',
      icon: Terminal,
      color: 'from-gray-700 to-gray-900',
      title: '🐧 Linux/Unix',
      terms: [
        {
          term: 'SSH',
          aka: 'Secure Shell',
          definition: 'Güvenli uzak bağlantı 🔐 Linux server\'lara bağlanmanın yolu!',
          example: 'ssh user@server -p 22. Key-based auth kullan, passwordless! 🗝️',
          funFact: 'SSH tunneling ile port forwarding yap. VPN gibi! ✨',
          interview: 'SSH default port? 22. Değiştir security için!'
        },
        {
          term: 'sudo',
          aka: 'Superuser Do',
          definition: 'Root yetkisiyle komut çalıştır 👑 "Ben admin\'im" demek!',
          example: 'sudo apt update - Root permission gerekir, sudo ile çalıştır',
          funFact: 'sudo !! = Son komutu sudo ile tekrar çalıştır. Pratik! 🔄',
          interview: 'sudoers file nedir? /etc/sudoers - Kim sudo yapabilir tanımlar'
        },
        {
          term: 'chmod',
          aka: 'Change Mode',
          definition: 'Dosya izinlerini değiştir 🔐 Read, Write, Execute!',
          example: 'chmod 755 file.sh - Owner: rwx, Group: rx, Others: rx',
          funFact: '777 = Full permission. 666 = rw for all. 755 = Executable for owner 🔢',
          interview: 'Permission format? rwx = 4+2+1 = 7. r-- = 4. rw- = 6'
        },
        {
          term: 'cron',
          aka: 'Zamanlanmış Görev',
          definition: 'Otomatik task scheduler ⏰ Belirli zamanda komut çalıştır!',
          example: '0 2 * * * /backup.sh - Her gece 2:00\'de backup çalıştır',
          funFact: 'crontab -e ile düzenle. * * * * * = Dakika, Saat, Gün, Ay, Hafta 📅',
          interview: 'Cron format? Minute Hour Day Month Weekday Command'
        },
        {
          term: 'systemd',
          aka: 'System Daemon',
          definition: 'Linux init system 🔄 Servisleri yönet, başlat, durdur!',
          example: 'systemctl start nginx, systemctl enable apache2 - Service management',
          funFact: 'systemd vs init.d. systemd yeni, paralel başlatma yapar! ⚡',
          interview: 'systemctl commands? start, stop, restart, enable, disable, status'
        },
        {
          term: 'Package Manager',
          aka: 'Paket Yöneticisi',
          definition: 'Yazılım kurma aracı 📦 apt, yum, dnf - Distro\'ya göre değişir!',
          example: 'apt install nginx - Debian/Ubuntu. yum install nginx - RHEL/CentOS',
          funFact: 'apt vs apt-get. apt daha modern, user-friendly! 🆕',
          interview: 'Package manager türleri? apt (Debian), yum/dnf (RHEL), pacman (Arch), zypper (SUSE)'
        },
        {
          term: 'grep',
          aka: 'Global Regular Expression Print',
          definition: 'Text arama tool\'u 🔍 File içinde pattern ara!',
          example: 'grep "error" /var/log/syslog - Log\'da error ara',
          funFact: 'grep + regex = Süper güç! grep -r "pattern" . = Recursive search 🚀',
          interview: 'Useful grep flags? -i (case insensitive), -r (recursive), -v (invert), -n (line number)'
        },
        {
          term: 'pipe',
          aka: 'Boru',
          definition: 'Komutları zincirle | ⛓️ Bir komutun output\'u diğerinin input\'u!',
          example: 'ps aux | grep nginx - Process listesi → Nginx\'i filtrele',
          funFact: 'Pipeline = UNIX\'in en güçlü özelliği. Komut kombine et! 💪',
          interview: 'Redirect vs Pipe? Redirect (>) = File\'a, Pipe (|) = Başka komuta'
        },
        {
          term: 'iptables',
          aka: 'Linux Firewall',
          definition: 'Packet filtering firewall 🔥 Port aç/kapa, rule ekle!',
          example: 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT - Port 80 aç',
          funFact: 'nftables = iptables\'ın yeni hali. Daha hızlı! ⚡',
          interview: 'iptables chains? INPUT, OUTPUT, FORWARD. Policies: ACCEPT, DROP, REJECT'
        },
        {
          term: 'systemctl',
          aka: 'System Control',
          definition: 'Systemd komut aracı 🎮 Service yönetimi için!',
          example: 'systemctl status nginx - Nginx durumu. systemctl restart apache2 - Restart',
          funFact: 'systemctl enable = Boot\'ta otomatik başlat. disable = Başlatma 🔄',
          interview: 'Service states? active, inactive, failed, enabled, disabled'
        },
        {
          term: 'top/htop',
          aka: 'Process Monitor',
          definition: 'Real-time process viewer 📊 CPU, RAM, process listesi!',
          example: 'top = Built-in. htop = Daha renkli, user-friendly. Kill process\'i htop\'tan yap',
          funFact: 'Load average = 1.0 (1 CPU), 2.0 (2 CPU). Düşük olmalı! 📈',
          interview: 'Load average meaning? 1min, 5min, 15min averages. Higher = More loaded'
        },
        {
          term: 'SELinux',
          aka: 'Security-Enhanced Linux',
          definition: 'Mandatory Access Control 🔒 Extra security layer!',
          example: 'getenforce - SELinux durumu. Enforcing, Permissive, Disabled',
          funFact: 'SELinux = Red Hat\'in güvenlik sistemi. Karmaşık ama güçlü! 💪',
          interview: 'SELinux modes? Enforcing (active), Permissive (log only), Disabled'
        },
        {
          term: 'tar',
          aka: 'Tape Archive',
          definition: 'Arşivleme tool\'u 📦 Dosyaları sıkıştır, birleştir!',
          example: 'tar -czvf backup.tar.gz /data - Create gzip archive',
          funFact: 'tar flags ezberle: c (create), x (extract), v (verbose), f (file), z (gzip) 🎯',
          interview: 'Common tar operations? Create: -czf, Extract: -xzf, List: -tzf'
        },
        {
          term: 'rsync',
          aka: 'Remote Sync',
          definition: 'Dosya senkronizasyonu 🔄 Değişen dosyaları kopyala!',
          example: 'rsync -avz /source user@server:/dest - Backup için ideal',
          funFact: 'Delta transfer = Sadece değişen kısımları gönder. Hızlı! ⚡',
          interview: 'rsync flags? -a (archive), -v (verbose), -z (compress), -r (recursive), --delete'
        },
        {
          term: 'Docker',
          aka: 'Container Platform',
          definition: 'Container teknolojisi 🐳 Uygulamayı izole et, portable yap!',
          example: 'docker run nginx - Nginx container çalıştır. docker ps - Container listesi',
          funFact: 'Dockerfile = Container tarifi. FROM, RUN, COPY, CMD 📜',
          interview: 'Docker vs VM? Docker = OS-level, shared kernel. VM = Hardware-level, separate OS'
        },
        {
          term: 'Kernel',
          aka: 'Çekirdek',
          definition: 'OS\'nin kalbi ❤️ Hardware ile software arası köprü!',
          example: 'uname -r - Kernel versiyonu. Linux kernel sürekli update gerekir',
          funFact: 'Linus Torvalds 1991\'de Linux kernel\'i yarattı. Open source! 🐧',
          interview: 'Kernel space vs User space? Kernel = Privileged, User = Restricted'
        },
        {
          term: 'Log Files',
          aka: 'Günlük Dosyaları',
          definition: 'Sistem olayları kaydı 📔 /var/log altında hepsi!',
          example: '/var/log/syslog, /var/log/auth.log, /var/log/nginx/ - Log dosyaları',
          funFact: 'tail -f /var/log/syslog = Real-time log izleme! 👀',
          interview: 'Common log files? syslog (system), auth.log (authentication), kern.log (kernel), dmesg (boot)'
        },
        {
          term: 'Process',
          aka: 'İşlem',
          definition: 'Çalışan program 🏃 Her process PID (Process ID) var!',
          example: 'ps aux - Tüm process\'ler. kill -9 PID - Force kill',
          funFact: 'Zombie process = Ölü ama hala listelenmiyor. Parent temizlemeli! 👻',
          interview: 'Process states? Running, Sleeping, Stopped, Zombie'
        },
        {
          term: 'Bash',
          aka: 'Bourne Again Shell',
          definition: 'Linux command shell 💻 Komut satırı arayüzü!',
          example: 'Bash script = .sh dosyası. #!/bin/bash ile başla',
          funFact: 'Bash = En yaygın shell. Zsh, Fish alternatifleri var 🐚',
          interview: 'Shebang nedir? #!/bin/bash - Script\'in hangi shell ile çalışacağı'
        },
        {
          term: 'Environment Variables',
          aka: 'Ortam Değişkenleri',
          definition: 'System-wide ayarlar 🌍 PATH, HOME, USER gibi!',
          example: 'echo $PATH - PATH variable\'ı göster. export VAR=value - Ayarla',
          funFact: '.bashrc vs .bash_profile. bashrc = Interactive, profile = Login shell 🔄',
          interview: 'How to make permanent? Add to ~/.bashrc or /etc/environment'
        },
        {
          term: 'Shell',
          aka: 'Kabuk',
          definition: 'Komut satırı arayüzü 🖥️ Kullanıcı ile kernel arasındaki köprü!',
          example: 'bash, zsh, ksh - Farklı shell türleri. which bash - Nerede kurulu?',
          funFact: 'sh = Original shell. Bash = sh\'in improved hali. Zsh = Bash\'in daha iyi versiyonu ⚡',
          interview: 'Shell scripting? Başında #!/bin/bash. Komut satırında çalışan her şey script olabilir 🎯'
        },
        {
          term: 'Distribution',
          aka: 'Dağıtım / Distro',
          definition: 'Linux kernel + tools + package manager = Dağıtım 📦 Farklı kombinasyonlar!',
          example: 'Ubuntu, Debian, CentOS, RHEL, Fedora - Popüler distro\'lar',
          funFact: 'Debian = Temel! Ubuntu, Linux Mint hepsi Debian tabanlı 🌳',
          interview: 'Distro seçimi? Desktop: Ubuntu. Server: CentOS/RHEL. Custom: Alpine'
        },
        {
          term: 'Ubuntu',
          aka: 'Canonical',
          definition: 'Popüler Linux dağıtımı 🟠 Desktop ve server için!',
          example: '20.04 LTS, 22.04 LTS - Stable versions. apt package manager',
          funFact: 'Ubuntu = "İnsanlık diğerine karşı" anlamındaki Zulu sözcüğü 🌍',
          interview: 'Ubuntu vs Debian? Ubuntu = Debian tabanlı. Debian = Community, Ubuntu = Canonical'
        },
        {
          term: 'CentOS',
          aka: 'Community Enterprise OS',
          definition: 'RHEL tabanlı server dağıtımı 🔴 Enterprise kullanım!',
          example: 'CentOS 7, 8 - Versiyonlar. yum package manager. Uzun support süresi',
          funFact: 'CentOS Stream = Rolling release. Daha sık update 🔄',
          interview: 'CentOS vs Ubuntu Server? CentOS = Longer support. Ubuntu = More packages'
        },
        {
          term: 'RHEL',
          aka: 'Red Hat Enterprise Linux',
          definition: 'Enterprise Linux dağıtımı 💎 Ticari destek ile!',
          example: 'RHEL 7, 8, 9 - Seçenekler. Yüksek güvenlik ve stabilite',
          funFact: 'RHEL = Red Hat\'ın ticari ürünü. Lisans gerekir 💰',
          interview: 'RHEL support süresi? 10 yıl! CentOS Stream 5 yıl'
        },
        {
          term: 'Debian',
          aka: 'Universal OS',
          definition: 'En eski ve stabil Linux dağıtımı 🐦 Türevlerin temelı!',
          example: 'Debian 11, 12 - LTS versiyonlar. apt package manager',
          funFact: 'Debian tabanlı 130+ dağıtım var. Ubuntu, Linux Mint, Kali vs 🌳',
          interview: 'Debian stability? Testing, Unstable, Stable branches. Yavaş update'
        },
        {
          term: 'systemd',
          aka: 'System and Service Manager',
          definition: 'Modern Linux init system 🚀 Servis yönetim ve boot process!',
          example: 'systemctl start/stop/restart service. journalctl logs. Timer scripts',
          funFact: 'systemd = Kontroversiyel! Linux community\'de tartışma var 🤔',
          interview: 'systemd vs init.d? systemd = Paralel boot. init.d = Sequential'
        },
        {
          term: 'cron',
          aka: 'Cron Daemon',
          definition: 'Zamanlı görev scheduler ⏰ Belirli zamanda otomatik çalıştır!',
          example: 'crontab -e düzenle. 0 2 * * * /backup.sh = Her gece 2\'de backup',
          funFact: 'Cron format = Dakika Saat Gün Ay HaftaGünü. * = Her zaman ⭐',
          interview: 'Cron vs systemd timer? Cron = Basit ama eski. Timer = Modern'
        },
        {
          term: 'chmod',
          aka: 'Change Mode',
          definition: 'Dosya izinlerini değiştir 🔐 Read(r), Write(w), Execute(x)!',
          example: 'chmod 755 file.sh - rwxr-xr-x. chmod +x script = Execute ekle',
          funFact: '4=Read, 2=Write, 1=Execute. 7=4+2+1=rwx. Kombinleme! 🔢',
          interview: 'chmod numeric vs symbolic? chmod 644 vs chmod u+rw,g-wx,o-wx'
        },
        {
          term: 'chown',
          aka: 'Change Owner',
          definition: 'Dosya sahibini değiştir 👤 User:Group belirleme!',
          example: 'chown user:group file - Sahibi değiştir. chown -R user dir = Recursive',
          funFact: 'Sadece root chown yapabilir (kendi dosyasını hariç)! 👑',
          interview: 'chown vs chmod? chown = Owner/Group değiştirir. chmod = Permission değiştirir'
        },
        {
          term: 'sudo',
          aka: 'Superuser Do (Tekrar)',
          definition: 'Root yetkisiyle komut çalıştır 👑 Admin işler için!',
          example: 'sudo apt update. sudo !! = Son komut admin ile. sudo -i = Root shell',
          funFact: 'sudoers file = /etc/sudoers. visudo ile edit et! 🔐',
          interview: 'SUDO vs su? SUDO = Belirli komut. SU = Tam root shell'
        },
        {
          term: 'root',
          aka: 'Root User / UID 0',
          definition: 'Linux\'in en güçlü hesabı 👑 Tüm yetkiler!',
          example: 'root password ile login. ~ = /root. root user UID = 0',
          funFact: 'root parolasını kaybetmek = Ciddi sorun! Recovery mode gerekli 🚨',
          interview: 'root vs sudo? root = Tam kontrol. sudo = Sınırlı komut'
        },
        {
          term: '/etc',
          aka: 'Configuration Directory',
          definition: 'Sistem konfigürasyon dosyaları 📝 /etc altında!',
          example: '/etc/passwd, /etc/shadow, /etc/sudoers, /etc/hosts - Config files',
          funFact: '/etc/config = Sistem settings. Yanlış edit = Sorun! ⚠️',
          interview: 'Important /etc files? passwd (users), shadow (passwords), fstab (mounts)'
        },
        {
          term: '/var',
          aka: 'Variable Data Directory',
          definition: 'Değişken sistem verileri 📊 Logs, temp, cache!',
          example: '/var/log = Logs. /var/tmp = Temp files. /var/cache = Cache files',
          funFact: '/var dolunca sorun! Log rotation gerekli ⚠️',
          interview: '/var folders? log (logs), tmp (temp), cache (caches), spool (queues)'
        },
        {
          term: '/home',
          aka: 'User Home Directory',
          definition: 'Kullanıcı dizinleri 🏠 Her user kendi alanı!',
          example: '/home/user = User directory. ~ = Home shortcut. /root = Root\'s home',
          funFact: 'Home directory = Private space. chmod 700 (sadece owner okuma)! 🔐',
          interview: '/home permissions? Normally user:user with 700 (drwx------)'
        },
        {
          term: 'apt',
          aka: 'Advanced Package Tool',
          definition: 'Debian/Ubuntu package manager 📦 Yazılım kurma aracı!',
          example: 'apt update (repo sync). apt install nginx. apt remove package. apt upgrade',
          funFact: 'apt = Modern interface. apt-get = Eski. apt daha user-friendly! ✨',
          interview: 'apt commands? update (refresh), install (kurulumu), remove (kaldır), upgrade (güncelle)'
        },
        {
          term: 'yum',
          aka: 'Yellowdog Updater Modified',
          definition: 'RHEL/CentOS package manager 📦 RPM tabanlı!',
          example: 'yum install nginx. yum remove package. yum check-update. yum update',
          funFact: 'yum = RPM tabanlı. CentOS 8+ dnf kullanmaya başladı 🔄',
          interview: 'yum vs dnf? yum = Eski, yavaş. dnf = Yeni, hızlı, Python-based'
        },
        {
          term: 'dnf',
          aka: 'Dandified Yum',
          definition: 'Modern RHEL/CentOS/Fedora package manager 🚀 yum\'un yenisi!',
          example: 'dnf install nginx. dnf remove package. dnf upgrade. dnf autoremove',
          funFact: 'dnf = Python-based. Daha hızlı ve güvenilir! ⚡',
          interview: 'dnf vs yum? Compatibel ama dnf daha iyi. Fedora default!'
        },
        {
          term: 'iptables',
          aka: 'Linux Firewall',
          definition: 'Paket filtreleme firewall\'u 🔥 Port control, rules!',
          example: 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT. iptables-save = Kaydet',
          funFact: 'iptables = Kernel level! nftables = Modern alternatifi ⚡',
          interview: 'iptables chains? INPUT, OUTPUT, FORWARD. Actions: ACCEPT, DROP, REJECT'
        },
        {
          term: 'SELinux',
          aka: 'Security-Enhanced Linux',
          definition: 'Zorunlu erişim kontrolü 🔒 Red Hat\'ın güvenlik katmanı!',
          example: 'getenforce (modu göster). setenforce Enforcing/Permissive. Contexts var',
          funFact: 'SELinux = Karmaşık ama güçlü! Çoğu kişi disable eder 😅',
          interview: 'SELinux modes? Enforcing (strict), Permissive (log), Disabled'
        },
        {
          term: 'AppArmor',
          aka: 'Application Armor',
          definition: 'Mandatory Access Control 🛡️ Uygulamalar için güvenlik!',
          example: 'Debian/Ubuntu default. apparmor_parser ile load. /etc/apparmor.d profiles',
          funFact: 'AppArmor = SELinux\'den daha basit! Path-based access control 📍',
          interview: 'AppArmor vs SELinux? AppArmor = Basit, Debian. SELinux = Güçlü, RHEL'
        },
        {
          term: 'LVM',
          aka: 'Logical Volume Manager',
          definition: 'Disk yönetim sistemi 💾 Dinamik partition resize!',
          example: 'PV (Physical Volume), VG (Volume Group), LV (Logical Volume). lvresize expand',
          funFact: 'LVM = Snapshot yapabilir! Backup almadan test et 📸',
          interview: 'LVM hierarchy? PV → VG → LV. Partition\'dan daha flexible'
        },
        {
          term: 'RAID',
          aka: 'Redundant Array of Independent Disks',
          definition: 'Disk redundancy sistemi ⚙️ Yedekleme ve hız!',
          example: 'RAID 0 (stripe), RAID 1 (mirror), RAID 5 (stripe+parity), RAID 10 (stripe+mirror)',
          funFact: 'RAID 0 = Hızlı ama tehlikeli! RAID 1 = Yedek. RAID 5 = Balance 🎯',
          interview: 'RAID levels? 0 (speed), 1 (mirror), 5 (redundancy+speed), 6 (redundancy+speed+extra), 10 (mirror+stripe)'
        }
      ]
    },
    {
      category: 'devops',
      icon: Zap,
      color: 'from-yellow-600 to-orange-600',
      title: '⚡ DevOps',
      terms: [
        {
          term: 'CI/CD',
          aka: 'Continuous Integration/Continuous Deployment',
          definition: 'Otomatik build, test, deploy 🤖 Code push → Production otomatik!',
          example: 'GitHub Actions, Jenkins, GitLab CI - Pipeline\'lar buradan',
          funFact: 'CI = Build + Test. CD = Deploy. Bazıları Delivery, bazıları Deployment der 🔄',
          interview: 'CI/CD benefits? Fast feedback, reduced risk, automation, consistency'
        },
        {
          term: 'Git',
          aka: 'Version Control',
          definition: 'Kod versiyon kontrolü 📝 Kim, ne, ne zaman değiştirdi?',
          example: 'git commit, git push, git pull, git merge - Daily commands',
          funFact: 'Linus Torvalds Git\'i 2005\'te yarattı. Linux kernel için! 🐧',
          interview: 'Git workflow? Working dir → Staging → Local repo → Remote repo'
        },
        {
          term: 'Docker Compose',
          aka: 'Multi-Container Tool',
          definition: 'Birden fazla container yönet 🐳 docker-compose.yml ile define et!',
          example: 'Web + DB + Redis = 3 container. docker-compose up ile hepsini başlat',
          funFact: 'docker-compose down = Hepsini durdur. Super praktik! 🎯',
          interview: 'docker-compose.yml structure? version, services, networks, volumes'
        },
        {
          term: 'Kubernetes',
          aka: 'K8s / Container Orchestration',
          definition: 'Container orchestrator 🎼 Scale, deploy, manage containers!',
          example: 'Pod, Service, Deployment, Ingress - K8s building blocks',
          funFact: 'K8s = Greek "helmsman" (dümenci). Google\'dan! ☸️',
          interview: 'K8s architecture? Master (API, scheduler, controller) + Worker nodes (kubelet, kube-proxy, pods)'
        },
        {
          term: 'Helm',
          aka: 'Kubernetes Package Manager',
          definition: 'K8s için paket yöneticisi 📦 Chart\'lar ile deploy et!',
          example: 'helm install nginx stable/nginx - Tek komutla nginx deploy',
          funFact: 'Chart = K8s manifest template\'leri. Reusable! ♻️',
          interview: 'Helm components? Chart (package), Release (deployed instance), Repository (chart repo)'
        },
        {
          term: 'Terraform',
          aka: 'Infrastructure as Code',
          definition: 'Altyapıyı kod ile yönet 🏗️ Declarative configuration!',
          example: 'terraform plan → terraform apply. Infrastructure otomatik oluşur',
          funFact: 'State file = Mevcut durum. terraform.tfstate dosyası kritik! 📄',
          interview: 'Terraform workflow? Write → Plan → Apply. Idempotent operations'
        },
        {
          term: 'Ansible',
          aka: 'Configuration Management',
          definition: 'Otomatik konfigürasyon 🤖 Playbook\'lar ile server\'ları ayarla!',
          example: 'ansible-playbook site.yml - 100 server\'a aynı config otomatik',
          funFact: 'Agentless! SSH ile bağlanır, client install gerektirmez 🎯',
          interview: 'Ansible vs Terraform? Ansible = Config management (mutable), Terraform = Infrastructure (immutable)'
        },
        {
          term: 'Monitoring',
          aka: 'İzleme',
          definition: 'Sistem metrikleri toplama 📊 CPU, RAM, disk, network!',
          example: 'Prometheus + Grafana = Golden combo. Metric collection + Visualization',
          funFact: 'Four Golden Signals: Latency, Traffic, Errors, Saturation 🏆',
          interview: 'Monitoring tools? Prometheus, Nagios, Zabbix, DataDog, New Relic'
        },
        {
          term: 'Logging',
          aka: 'Günlük Tutma',
          definition: 'Application log\'ları toplama 📝 Error, warning, info!',
          example: 'ELK Stack = Elasticsearch + Logstash + Kibana. Log central!',
          funFact: 'Structured logging = JSON format. Parse kolay! {"level":"error","msg":"..."}',
          interview: 'Log levels? TRACE, DEBUG, INFO, WARN, ERROR, FATAL'
        },
        {
          term: 'Blue-Green Deployment',
          aka: 'Mavi-Yeşil Dağıtım',
          definition: 'Zero downtime deploy 🔵🟢 İki environment, switch yap!',
          example: 'Blue = Current prod. Green = New version. Test et, switch!',
          funFact: 'Rollback instant! Switch back yaparsın 🔄',
          interview: 'Blue-Green vs Canary? Blue-Green = Full switch, Canary = Gradual rollout'
        },
        {
          term: 'Canary Deployment',
          aka: 'Kanarya Dağıtımı',
          definition: 'Gradual rollout 🐤 %5 kullanıcıya yeni versiyon, test et!',
          example: '%5 → %25 → %50 → %100. Sorun varsa geri al!',
          funFact: 'Kanarya = Madendeki kuş. İlk o ölür, tehlike anlaşılır! 🐦',
          interview: 'Canary benefits? Risk mitigation, gradual rollout, easy rollback, real user testing'
        },
        {
          term: 'Service Discovery',
          aka: 'Servis Keşfi',
          definition: 'Servislerin birbirini bulması 🔍 Dynamic IP\'lerle çalışma!',
          example: 'Consul, etcd, Eureka - Service registry\'ler',
          funFact: 'Microservices must! IP değişiyor, service discovery ile bul 🎯',
          interview: 'Client-side vs Server-side discovery? Client = Client queries registry, Server = Load balancer queries'
        },
        {
          term: 'API Gateway',
          aka: 'API Ağ Geçidi',
          definition: 'Microservices giriş kapısı 🚪 Routing, auth, rate limiting!',
          example: 'Kong, Apigee, AWS API Gateway - Backend for Frontend pattern',
          funFact: 'Single entry point = Kolay yönetim, security, monitoring 🎯',
          interview: 'API Gateway features? Routing, authentication, rate limiting, caching, logging, transformation'
        },
        {
          term: 'Secret Management',
          aka: 'Sır Yönetimi',
          definition: 'Password, API key\'leri güvenle sakla 🔐 Plaintext yok!',
          example: 'HashiCorp Vault, AWS Secrets Manager, Azure Key Vault',
          funFact: 'Never commit secrets to Git! .env dosyası .gitignore\'da olmalı ⚠️',
          interview: 'Secret rotation nedir? Düzenli password/key değiştirme (90 günde bir)'
        },
        {
          term: 'Artifact Repository',
          aka: 'Yapı Deposu',
          definition: 'Build artifact\'leri sakla 📦 JAR, WAR, Docker image vs!',
          example: 'Nexus, Artifactory, Docker Hub - Artifact registry\'ler',
          funFact: 'Versioning ile rollback kolay! v1.2.3\'e dön istersen 🔄',
          interview: 'Artifact types? Binary (JAR, WAR), Container (Docker), Package (npm, pip)'
        },
        {
          term: 'GitOps',
          aka: 'Git-based Operations',
          definition: 'Git = Single source of truth 📝 Git\'te değişiklik = Deploy!',
          example: 'ArgoCD, Flux - GitOps tool\'ları. Git push → K8s auto-deploy',
          funFact: 'Declarative = Git\'te ne varsa o deploy edilir. Drift yok! 🎯',
          interview: 'GitOps principles? Declarative, versioned, pulled automatically, continuously reconciled'
        },
        {
          term: 'Observability',
          aka: 'Gözlemlenebilirlik',
          definition: 'Sistem içini anlama 🔍 Metrics, Logs, Traces - Three pillars!',
          example: 'Prometheus (metrics), ELK (logs), Jaeger (traces) - Full observability',
          funFact: 'Monitoring = Know when broken. Observability = Know why broken! 💡',
          interview: 'Three pillars? Metrics (numbers), Logs (events), Traces (request flow)'
        },
        {
          term: 'Chaos Engineering',
          aka: 'Kaos Mühendisliği',
          definition: 'Sistemi kasıtlı boz, dayanıklılık test et! 💥 Netflix Chaos Monkey!',
          example: 'Random server kill et, network\'ü yavaşlat. Sistem survive edebiliyor mu?',
          funFact: 'Netflix Chaos Monkey = Production\'da random EC2 kill eder! 🐵',
          interview: 'Chaos engineering benefits? Find weaknesses, build confidence, improve resilience'
        },
        {
          term: 'Feature Flag',
          aka: 'Özellik Bayrağı',
          definition: 'Feature\'ı kod değiştirmeden aç/kapa 🎚️ Toggle ile kontrol!',
          example: 'if (featureFlag.newUI) { showNewUI() } else { showOldUI() }',
          funFact: 'A/B testing için ideal! %50 yeni UI, %50 eski UI 🎯',
          interview: 'Feature flag use cases? Gradual rollout, A/B testing, kill switch, trunk-based development'
        },
        {
          term: 'Infrastructure as Code',
          aka: 'IaC / Kod Olarak Altyapı',
          definition: 'Infra\'yı code olarak yönet 📝 Terraform, CloudFormation, ARM!',
          example: 'Git\'e commit et, apply et. Infrastructure version controlled!',
          funFact: 'Immutable infrastructure = Yeni versiyon = Yeni infrastructure. Modify etme! 🔄',
          interview: 'IaC benefits? Version control, reproducibility, consistency, automation, documentation'
        },
        {
          term: 'Jenkins',
          aka: 'CI/CD Server',
          definition: 'Open-source automation server 🤖 Pipeline\'lar burada çalışır!',
          example: 'GitHub hook → Jenkins trigger → Build → Test → Deploy otomatik',
          funFact: 'Java-based! Binlerce plugin var. The original CI/CD king! 👑',
          interview: 'Jenkins architecture? Master (scheduler) + Agents (executors). Distributed builds!'
        },
        {
          term: 'GitLab CI',
          aka: 'GitLab Continuous Integration',
          definition: 'GitLab built-in CI/CD 🚀 .gitlab-ci.yml ile pipeline tanımla!',
          example: '.gitlab-ci.yml → stages: [build, test, deploy]. Runner\'lar çalıştırır',
          funFact: 'GitLab\'ın hepsi birlikte! Repo + CI/CD + Registry + Monitoring',
          interview: 'GitLab CI advantages? Built-in, no separate server, container-native, Kubernetes integration'
        },
        {
          term: 'GitHub Actions',
          aka: 'GitHub Workflows',
          definition: 'GitHub\'ın CI/CD çözümü 🎬 YAML workflow\'lar ile automate et!',
          example: '.github/workflows/deploy.yml → Push → Test → Build → Release otomatik',
          funFact: 'Free minutes hesabı var! 2000 dakika/ay free GitHub-hosted runners 💚',
          interview: 'GitHub Actions components? Workflow, Jobs, Steps, Actions. Matrix builds!'
        },
        {
          term: 'Puppet',
          aka: 'Configuration Management',
          definition: 'Agent-based config management 🎭 Manifest\'ler ile sistem ayarla!',
          example: 'node \'web*.example.com\' { package { \'nginx\': ensure => installed } }',
          funFact: 'Declarative! Ne istersen yaz, Puppet idempotent yaparsın 🎯',
          interview: 'Puppet vs Ansible? Puppet = Agent-based, Ansible = Agentless. Push vs Pull'
        },
        {
          term: 'Chef',
          aka: 'Infrastructure Automation',
          definition: 'Ruby-based config management 👨‍🍳 Cookbook\'lar ile infra pişir!',
          example: 'Cookbook = Recipe + Attribute + Template. Infrastructure tanımla ve version kontrol et',
          funFact: 'Chef terminology = Mutfak metaforu! Cookbook, Recipe, Ingredient 🍳',
          interview: 'Chef architecture? Workstation → Chef Server → Chef Client (Agent)'
        },
        {
          term: 'Microservices',
          aka: 'Microservices Architecture',
          definition: 'Küçük, bağımsız servisler 🔍 Her biri ayrı deploy, scale!',
          example: 'User Service, Product Service, Order Service - Ayrı codebase, ayrı DB',
          funFact: 'Monolith vs Microservices? Micro = Flexibility, Monolith = Simplicity. Trade-off! ⚖️',
          interview: 'Microservices challenges? Distributed systems complexity, network latency, eventual consistency'
        },
        {
          term: 'Prometheus',
          aka: 'Metrics Collection',
          definition: 'Time-series metrics database 📈 Pull-based monitoring! Scrape et!',
          example: 'prometheus.yml → targets → Scrape interval\'de metric\'leri çek ve sakla',
          funFact: 'TSDB = Time Series Database. InfluxDB vs Prometheus, Prometheus daha popüler 📊',
          interview: 'Prometheus scrape process? Scraper → Target /metrics endpoint → TSDB storage'
        },
        {
          term: 'Grafana',
          aka: 'Data Visualization',
          definition: 'Beautiful dashboards 🎨 Prometheus + Grafana = Dashboard bliss!',
          example: 'Query Prometheus → Graph → Alert → Slack notify. Full visibility! 👀',
          funFact: 'Grafana multiverse! Prometheus, Elasticsearch, InfluxDB, CloudWatch hepsine bağlan 🌐',
          interview: 'Grafana components? Data source, Dashboard, Panel, Query, Alerting'
        },
        {
          term: 'ELK Stack',
          aka: 'Elasticsearch Logstash Kibana',
          definition: 'Log aggregation powerhouse 📚 Parse, store, visualize logs!',
          example: 'App logs → Logstash (parse) → Elasticsearch (store) → Kibana (search/visualize)',
          funFact: 'Elastic Stack sekarang! ELK + Beats = Compleet observability 🎯',
          interview: 'ELK data flow? Source → Logstash → Elasticsearch → Kibana. Index rotation!'
        },
        {
          term: 'APM',
          aka: 'Application Performance Monitoring',
          definition: 'Application-level performance tracking 📊 Slow query, latency, trace!',
          example: 'New Relic, Datadog, Elastic APM - Request tracing + Error tracking',
          funFact: 'APM = Know transaction performance! Database, cache, external API, hepsi görülür 🔍',
          interview: 'APM key metrics? Response time, throughput, error rate, Apdex score'
        },
        {
          term: 'SRE',
          aka: 'Site Reliability Engineering',
          definition: 'Reliability focused engineering 🎯 Error budgets, automation, monitoring!',
          example: 'SLO = 99.9% uptime. Error budget = 0.1% downtime allowed. Use wisely!',
          funFact: 'Google\'dan çıkan felsefe! Ops + Dev + Reliability = SRE 👑',
          interview: 'SRE principles? Measure reliability, SLO/SLI, toil automation, blameless postmortems'
        },
        {
          term: 'ArgoCD',
          aka: 'GitOps Deployment',
          definition: 'Kubernetes GitOps tool 🎯 Git repo = Kubernetes source of truth!',
          example: 'Git push → ArgoCD detect → Kubernetes reconcile → Deploy otomatik',
          funFact: 'Declarative Kubernetes deployment! Git driftlenmeyen single source',
          interview: 'ArgoCD workflow? GitHub webhook → Git pull → K8s manifest → kubectl apply'
        },
        {
          term: 'Istio',
          aka: 'Service Mesh',
          definition: 'Microservices networking layer 🕸️ Traffic management, security, observability!',
          example: 'Sidecar proxy (Envoy) har Pod\'a. Network policies, retries, circuit breaking',
          funFact: 'Service Mesh = Kubernetes\'in networking overlay. Transparent! 🎯',
          interview: 'Istio features? Traffic management, security policy, observability, resilience'
        },
        {
          term: 'Service Mesh',
          aka: 'Microservices Networking',
          definition: 'Dedicated infrastructure layer 🕸️ Service-to-service communication!',
          example: 'Istio, Linkerd, Consul Connect - Service mesh implementations',
          funFact: 'Sidecar proxy pattern! Her service\'in yanında kendi proxy\'si 🚀',
          interview: 'Service Mesh benefits? Resilience, security, observability, traffic management'
        },
        {
          term: 'Rolling Update',
          aka: 'Progressive Rollout',
          definition: 'Tüm instance\'ları aynanda update etme, gradual yap! 🔄',
          example: 'Pod 1 → Pod 2 → Pod 3 başarılı mı? Hepsi aynanda değil!',
          funFact: 'Kubernetes default strategy! maxUnavailable = 1, maxSurge = 1 ayarla 🎯',
          interview: 'Rolling Update advantages? No downtime, gradual rollout, easy rollback'
        },
        {
          term: 'Prometheus Alerting',
          aka: 'Alert Manager',
          definition: 'Prometheus rules + AlertManager 🔔 Metric threshold\'ı geçince bildir!',
          example: 'Alert rule: CPU > %80 for 5m → AlertManager → Slack, PagerDuty, Email',
          funFact: 'Grouping = Aynı alert\'leri group et. Deduplication + Silencing mümkün! 🎯',
          interview: 'Alert firing process? PromQL rule → Fire → AlertManager → Route → Notification'
        },
        {
          term: 'Container Registry',
          aka: 'Docker Registry',
          definition: 'Docker image\'leri sakla 📦 Docker Hub, ECR, GCR, ACR!',
          example: 'docker push myapp:1.0 → Registry. docker pull → Çek ve çalıştır',
          funFact: 'Private registry = Güvenli! Harbor, Nexus, Artifactory kullan 🔐',
          interview: 'Container Registry features? Version management, access control, scanning, replication'
        },
        {
          term: 'Load Balancing',
          aka: 'Traffic Distribution',
          definition: 'Trafiği instances\'a dağıt ⚖️ No single point of failure!',
          example: 'L4 (TCP/UDP), L7 (Application) load balancing. Health checks + Round robin',
          funFact: 'Sticky sessions = User aynı server\'e gitsin. Session affinity! 🎯',
          interview: 'Load balancer algorithms? Round robin, Least connections, IP hash, Weighted'
        },
        {
          term: 'Environment Parity',
          aka: 'Dev = Prod',
          definition: 'Dev, Staging, Prod aynı! Docker ile guaranteed 🐳',
          example: 'Dockerfile aynı, network aynı, services aynı. Sürprizler yok!',
          funFact: 'Container\'lar environment parity garantiler. It works on my machine myth died! 💀',
          interview: 'Environment parity importance? Reduce bugs, faster development, confidence in deployment'
        },
        {
          term: 'Automated Testing',
          aka: 'CI Testing',
          definition: 'Her commit\'te test çalıştır! Unit, integration, E2E! ✅',
          example: 'GitHub push → GitHub Actions → pytest/jest/go test → Report. Fast feedback!',
          funFact: 'Test coverage = Kaç satır test covered? %80+ hedefe! 🎯',
          interview: 'Test pyramid? Unit (base), Integration (middle), E2E (top). Unit çok hızlı!'
        },
        {
          term: 'Distributed Tracing',
          aka: 'Request Tracing',
          definition: 'Request akışını trace et 📍 Service A → B → C nerede slow?',
          example: 'Jaeger, Zipkin, Elastic APM - Distributed tracing tools. OpenTelemetry standard!',
          funFact: 'Trace ID = Request\'in unique ID. Service\'ler arasında propagate et! 🎯',
          interview: 'Distributed tracing components? Span (operation), Trace (request), Baggage (metadata)'
        },
        {
          term: 'Immutable Infrastructure',
          aka: 'Snowflake Servers\'ın Tersi',
          definition: 'Server oluştur, hiç modify etme. Version 2? Yeni server! 🔄',
          example: 'Terraform/CloudFormation → Yeni server → Destroy old. Never SSH to patch!',
          funFact: 'Configuration drift yok! Her deploy fresh infrastructure = Reliability ✨',
          interview: 'Immutable benefits? Consistency, reproducibility, easier testing, faster deployment'
        },
        {
          term: 'Deployment Automation',
          aka: 'Zero-Click Deploy',
          definition: 'Deploy otomatik, insan tıklama yok! 🤖 Code push = Production!',
          example: 'Git push → CI runs tests → CD deploys → Slack notification. Hands-free! 👐',
          funFact: 'Deploy frequency artar = Risk azalır. Netflix 10,000+ deploy/gün! 🚀',
          interview: 'Deployment automation benefits? Speed, consistency, reduced human error, faster feedback'
        },
        {
          term: 'Health Checks',
          aka: 'Liveness & Readiness',
          definition: 'Pod/Container sağlıklı mı? Kubernetes auto-restart + no traffic! 🏥',
          example: 'livenessProbe: HTTP GET /health. readinessProbe: TCP port 8080 check',
          funFact: 'Liveness = Live but broken? Restart. Readiness = Not ready? No traffic! 🎯',
          interview: 'Probe types? HTTP (GET path), TCP (port), Exec (command). InitialDelaySeconds önemli!'
        },
        {
          term: 'Cost Optimization',
          aka: 'FinOps',
          definition: 'Cloud costs kontrol et 💰 Right-sizing, reserved instances, spot instances!',
          example: 'Unused resources kill. Auto-scaling = Cost efficiency. Monitoring = Visibility',
          funFact: 'Cloud bill şoku? Başında kontrol et! Prometheus + AlertManager + Budget alarms 🚨',
          interview: 'Cost optimization strategies? Reserved instances, spot instances, autoscaling, monitoring'
        }
      ]
    },
    {
      category: 'hardware',
      icon: Cpu,
      color: 'from-indigo-600 to-purple-600',
      title: '🔧 Hardware (Donanım)',
      terms: [
        {
          term: 'CPU',
          aka: 'Central Processing Unit',
          definition: 'Bilgisayarın beyni 🧠 Tüm işlemleri yapar!',
          example: 'Intel Core i7, AMD Ryzen 7 - Consumer CPU\'lar. Xeon, EPYC - Server CPU\'lar',
          funFact: 'Core sayısı ≠ Performance. Clock speed + architecture önemli! ⚡',
          interview: 'Clock speed nedir? GHz ile ölçülür. 3.5 GHz = Saniyede 3.5 milyar cycle'
        },
        {
          term: 'RAM',
          aka: 'Random Access Memory',
          definition: 'Geçici bellek 💾 Bilgisayar açıkken data tutar!',
          example: 'DDR4, DDR5 - RAM tipleri. 16GB, 32GB, 64GB - Kapasite',
          funFact: 'RAM dolarsa swap kullanılır. Disk = Yavaş! RAM upgrade magic 🚀',
          interview: 'RAM vs ROM? RAM = Volatile (kaybedilir), ROM = Non-volatile (kalıcı)'
        },
        {
          term: 'SSD',
          aka: 'Solid State Drive',
          definition: 'Hızlı disk 💿 HDD\'den 10x hızlı! Hareketli parça yok',
          example: 'SATA SSD < NVMe SSD. NVMe çok daha hızlı! (PCIe üzerinden)',
          funFact: 'SSD ömrü TBW (Terabytes Written) ile ölçülür. Yazma limiti var! ⚠️',
          interview: 'SSD vs HDD? SSD = Fast, silent, durable, expensive. HDD = Slow, noisy, cheap'
        },
        {
          term: 'GPU',
          aka: 'Graphics Processing Unit',
          definition: 'Görüntü işlemci 🎮 Gaming, video editing, AI için!',
          example: 'NVIDIA GeForce (gaming), RTX (ray tracing), Tesla (server AI)',
          funFact: 'CUDA cores = NVIDIA\'nın paralel processing gücü. AI training için must! 🤖',
          interview: 'Integrated vs Dedicated GPU? Integrated = CPU\'da, Dedicated = Ayrı kart (güçlü)'
        },
        {
          term: 'Motherboard',
          aka: 'Anakart',
          definition: 'Her şeyin bağlandığı kart 🖥️ CPU, RAM, GPU hepsi buraya!',
          example: 'ATX, Micro-ATX, Mini-ITX - Form factor\'ler. Chipset = Intel Z690, AMD X570',
          funFact: 'Chipset = Motherboard\'un beyni. USB, SATA, PCIe kontrolü 🧠',
          interview: 'Chipset nedir? Motherboard\'daki controller. I/O, expansion slots yönetir'
        },
        {
          term: 'Power Supply',
          aka: 'PSU / Güç Kaynağı',
          definition: 'Elektriği sağla ⚡ 220V AC → 12V/5V/3.3V DC çevirir!',
          example: '650W, 750W, 850W - Watt rating. 80+ Bronze, Gold, Platinum - Efficiency',
          funFact: 'Modular PSU = Kablo tak-çıkar. Cable management kolay! 🔌',
          interview: 'PSU efficiency ratings? 80+ Bronze (82%), Silver (85%), Gold (87%), Platinum (90%), Titanium (92%)'
        },
        {
          term: 'RAID',
          aka: 'Redundant Array of Independent Disks',
          definition: 'Disk redundancy 💾 Data loss\'a karşı koruma!',
          example: 'RAID 0 = Speed, no redundancy. RAID 1 = Mirror. RAID 5 = Stripe + parity. RAID 10 = Mirror + stripe',
          funFact: 'RAID 0 = "RAID" değil aslında. Redundancy yok! 😅',
          interview: 'RAID levels? 0 (stripe), 1 (mirror), 5 (parity), 6 (double parity), 10 (1+0)'
        },
        {
          term: 'Network Card',
          aka: 'NIC / Ağ Kartı',
          definition: 'Network bağlantısı 🌐 Ethernet, Wi-Fi!',
          example: '1 Gbps, 2.5 Gbps, 10 Gbps - NIC speed\'leri. Server\'lar 10G+ kullanır',
          funFact: 'Dual NIC = Yedeklilik + Load balancing. Teaming! 🔄',
          interview: 'NIC features? Speed (1G, 10G), Offloading (TCP, checksum), Wake-on-LAN'
        },
        {
          term: 'BIOS/UEFI',
          aka: 'Basic Input/Output System',
          definition: 'Bilgisayar başlatma yazılımı 🔧 OS yüklenmeden önce!',
          example: 'BIOS = Eski. UEFI = Yeni, GUI var, hızlı boot',
          funFact: 'Secure Boot = UEFI özelliği. Rootkit engeller! 🔒',
          interview: 'BIOS vs UEFI? UEFI = Faster boot, GUI, >2TB disk support, Secure Boot'
        },
        {
          term: 'Cooling System',
          aka: 'Soğutma Sistemi',
          definition: 'Isıyı at 🌡️ CPU/GPU aşırı ısınmasın!',
          example: 'Air cooling (fan), Liquid cooling (AIO, custom loop), Thermal paste',
          funFact: 'Thermal throttling = Aşırı ısınma → Clock speed düşer. Soğutma önemli! 🔥',
          interview: 'Cooling types? Air (cheap, reliable), Liquid (efficient, quiet), Passive (fanless)'
        },
        {
          term: 'HDD',
          aka: 'Hard Disk Drive',
          definition: 'Eski disk 💿 Hareketli plaka ile data tutar!',
          example: '2TB, 4TB, 8TB - Kapasite. 7200 RPM, 5400 RPM - Hız',
          funFact: 'HDD daha ucuz ama yavaş. SSD\'nin gelişinden beri trend düşüş 📉',
          interview: 'HDD MTBF? Mean Time Between Failures. 100,000+ saat. Mekanik = Kırılabilir'
        },
        {
          term: 'NVMe',
          aka: 'Non-Volatile Memory Express',
          definition: 'Çok hızlı depolama protokolü 🚀 PCIe üzerinden!',
          example: 'NVMe Gen 3 = 3,500 MB/s, Gen 4 = 7,000 MB/s, Gen 5 = 14,000 MB/s',
          funFact: 'NVMe = Direct PCIe bağlantı. SATA aracısına gerek yok! ⚡',
          interview: 'SATA vs NVMe? SATA max 550 MB/s, NVMe binler. NVMe gaming/professionals için'
        },
        {
          term: 'SATA',
          aka: 'Serial ATA',
          definition: 'Disk bağlantı standartı 🔗 Eski ama güvenilir!',
          example: 'SATA 1 = 150 MB/s, SATA 2 = 300 MB/s, SATA 3 = 600 MB/s',
          funFact: 'SATA 2002\'den beri var. Backward compatible! 🔄',
          interview: 'SATA limitasyonu? Max 600 MB/s. AHCI protokolü. Bağlantı kolay ama yavaş'
        },
        {
          term: 'PCIe',
          aka: 'PCI Express',
          definition: 'Genişleme slotu standartı 🖲️ GPU, SSD, NIC bağlanır!',
          example: 'PCIe 3.0 x16 = 16 GB/s, PCIe 4.0 x16 = 32 GB/s, PCIe 5.0 x16 = 64 GB/s',
          funFact: '"x16" = 16 lanes. GPU = x16. NVMe = x4. Backwards compatible! 🎮',
          interview: 'PCIe lanes? Motherboard limitli (32-64 lanes). Sharing = Bottleneck riski'
        },
        {
          term: 'BIOS',
          aka: 'Basic Input Output System',
          definition: 'Eski başlangıç yazılımı 🔧 Firmware düzeyinde!',
          example: 'BIOS setup = F2, Del, F10 tuşu. Hard drive boot order ayarı',
          funFact: 'BIOS = 1980\'lerden beri. Zaman kesinlikle eski arkadaş! 👴',
          interview: 'BIOS functions? Hardware initialization, POST (power-on self test), Boot'
        },
        {
          term: 'UEFI',
          aka: 'Unified Extensible Firmware Interface',
          definition: 'Modern başlangıç yazılımı 🆕 BIOS yerine kullanılır!',
          example: 'UEFI = Grafik arayüz, touchpad support, 2TB+ disk desteği',
          funFact: 'Secure Boot = UEFI özelliği. Rootkit virüs engeller! 🔒',
          interview: 'UEFI vs BIOS? UEFI = GUI, GPT disk, faster boot, Secure Boot'
        },
        {
          term: 'PSU',
          aka: 'Power Supply Unit / Güç Kaynağı',
          definition: 'Elektrik sağlayıcı ⚡ 220V AC → DC çevirir!',
          example: 'Gaming = 750W+. Server = Redundant PSU (2x backup)',
          funFact: '80+ Titanium = %92 verimlilik. Daha iyi = Daha az ısı! 🌡️',
          interview: 'PSU wattage? TDP + headroom. GPU 400W? PSU = min 700W (safety margin)'
        },
        {
          term: 'RAID Controller',
          aka: 'Disk Controller',
          definition: 'RAID yöneticisi 💾 Disk array\'ı kontrol eder!',
          example: 'Hardware RAID = Dedicated card (güçlü). Software RAID = OS içinde',
          funFact: 'Hardware RAID = Cache var. Battery backup = Data güveni! 🔋',
          interview: 'RAID controller cache? Write caching + battery = Durability artırır'
        },
        {
          term: 'Network Card Extended',
          aka: 'NIC Extended / Ağ Kartı Genişletilmiş',
          definition: 'Network kartı 🌐 Ethernet, Wi-Fi bağlantı!',
          example: '1 Gbps consumer, 10 Gbps datacenter. Server\'lar dual/quad NIC',
          funFact: 'NIC teaming = Redundancy + load balancing. Active-active! 🔄',
          interview: 'NIC offloading? TCP/IP segmentation, checksum = CPU yüküne azaltır'
        },
        {
          term: 'Server',
          aka: 'Sunucu',
          definition: 'İstemci servis verici 🖥️ 24/7 çalışır!',
          example: 'Rack server (1U, 2U), Tower server, Blade server - Form factor\'ler',
          funFact: 'Server = Client\'ten daha güçlü CPU, RAM, redundant power, IPMI',
          interview: 'Server vs PC? Server = Reliability, redundancy, 24/7 uptime, remote management'
        },
        {
          term: 'Rack',
          aka: 'Raf / Server Rack',
          definition: 'Server kutusu 📦 19" standart raf!',
          example: '1U = 1.75 inch yükseklik. 42U = 73.5 inch. Full rack!',
          funFact: 'Datacenter = 100\'ler rack. PDU (Power Distribution Unit) = Elektrik dağıtıcı 🔌',
          interview: 'Rack form factors? 1U (thin), 2U (medium), 4U (thick). Network switches = 1U'
        },
        {
          term: 'Blade Server',
          aka: 'Bıçak Sunucu',
          definition: 'Kompakt server kartı 🔪 Blade enclosure\'ye takılır!',
          example: 'HP ProLiant, Dell PowerEdge - Blade modelleri',
          funFact: 'Blade chassis = Shared power, cooling, networking. Yoğun! 🧊',
          interview: 'Blade vs Rack? Blade = Dense, shared resources. Rack = Modular, independent'
        },
        {
          term: 'UPS',
          aka: 'Uninterruptible Power Supply',
          definition: 'Kesintisiz güç kaynağı 🔋 Elektrik kesilince backup!',
          example: 'UPS battery = SLA (Sealed Lead Acid) veya Lithium. 10-30 dakika backup',
          funFact: 'UPS + Shutdown script = Graceful shutdown. Data loss = 0! 🛡️',
          interview: 'UPS types? Offline (basit), Line-Interactive (orta), Online (yüksek-end)'
        },
        {
          term: 'KVM',
          aka: 'Keyboard Video Mouse',
          definition: 'Birden fazla bilgisayar kontrol cihazı 🖱️ Bir klavye, fare, monitor!',
          example: 'KVM switch = 4-port, 8-port. Server room\'da çok kullanılır',
          funFact: 'KVM over IP = Remote access + local control. Administrasyon kolay! 🌐',
          interview: 'KVM switch benefits? Cable reduction, multiple server control, cost savings'
        },
        {
          term: 'IPMI',
          aka: 'Intelligent Platform Management Interface',
          definition: 'Server yönetim protokolü 🔧 Remote access, out-of-band!',
          example: 'IPMI2.0 = Encrypted. /dev/ipmi0 = Linux interface',
          funFact: 'IPMI = Power, boot, monitoring komutları. SSH düşse bile çalışır! 🎯',
          interview: 'IPMI vs SSH? IPMI = Hardware level, out-of-band. SSH = OS level, in-band'
        },
        {
          term: 'BMC',
          aka: 'Baseboard Management Controller',
          definition: 'Server kontrol kartı 🛡️ IPMI protocol\'ü çalıştırır!',
          example: 'Dedicated processor + network interface. iLO (HP), iDRAC (Dell)',
          funFact: 'BMC = Ayrı işlemci. Ana CPU\'dan bağımsız. Always-on! ⚡',
          interview: 'BMC features? Temperature monitoring, power control, serial console, updates'
        },
        {
          term: 'Heat Sink',
          aka: 'Isı emici',
          definition: 'Isıyı alıp dış ortama ver 🌡️ Metalden yapılır!',
          example: 'Aluminum = Ucuz ama yavaş. Copper = Pahalı ama hızlı',
          funFact: 'Fin count = Surface area. Daha çok fin = Daha iyi soğutma! 🌡️',
          interview: 'Heat sink contact? Thermal paste = Microscopic air pockets doldurur'
        },
        {
          term: 'Thermal Paste',
          aka: 'TIM / Termal İletim Malzemesi',
          definition: 'CPU ve heatsink arasını doldur 🧴 Ísı transferi!',
          example: 'MX-4 (iyi), Arctic Silver (premium), Kryonaut (gaming)',
          funFact: 'Çok pasta = Overflow (aşıl) = Elektrik iletim = Koroza! ⚠️',
          interview: 'Thermal paste re-application? 3-5 yıl. Dry out = Performance düşer'
        },
        {
          term: 'DDR4',
          aka: 'Double Data Rate 4',
          definition: 'RAM teknolojisi 💾 DDR3\'ün seridleme!',
          example: 'DDR4-3200 (3200 MHz), DDR4-3600 - Hızlar. 16GB, 32GB kapasite',
          funFact: 'DDR5 gelmesi ile DDR4 ucuzlaştı. Legacy support devam ediyor! 💰',
          interview: 'DDR4 vs DDR5? DDR5 = 2x bandwidth (51 GB/s). Backward incompatible!'
        },
        {
          term: 'Motherboard Extended',
          aka: 'Anakart Genişletilmiş',
          definition: 'Merkez bağlantı kartı 🔌 Hepsi buraya bağlanır!',
          example: 'ATX = Standart (305x244mm). Micro-ATX (244x244mm). Mini-ITX (170x170mm)',
          funFact: 'Chipset = Motherboard\'un beyni. PCH (Platform Controller Hub) = I/O yöneticisi',
          interview: 'Chipset duty? Memory controller, SATA, USB, PCIe lane distribution'
        }
      ]
    },
    {
      category: 'storage',
      icon: HardDrive,
      color: 'from-teal-600 to-cyan-600',
      title: '💾 Storage (Depolama)',
      terms: [
        {
          term: 'SAN',
          aka: 'Storage Area Network',
          definition: 'Merkezi storage network 🏢 Block-level storage!',
          example: 'Fiber Channel, iSCSI - SAN protokolleri. Enterprise storage!',
          funFact: 'LUN = Logical Unit Number. Disk partition gibi 🔢',
          interview: 'SAN vs NAS? SAN = Block-level (iSCSI, FC), NAS = File-level (SMB, NFS)'
        },
        {
          term: 'NAS',
          aka: 'Network Attached Storage',
          definition: 'Network file server 📂 SMB/NFS ile dosya paylaşımı!',
          example: 'Synology, QNAP - Popüler NAS cihazları. Home + SMB kullanımı',
          funFact: 'RAID support = Data protection. Disk failure tolere eder! 💪',
          interview: 'NAS protocols? SMB/CIFS (Windows), NFS (Linux/Unix), AFP (Mac)'
        },
        {
          term: 'Backup',
          aka: 'Yedekleme',
          definition: 'Data kopyalama 💾 Disaster recovery için!',
          example: '3-2-1 rule: 3 kopya, 2 farklı media, 1 offsite',
          funFact: 'Untested backup = No backup! Test et restore\'u 🆘',
          interview: 'Backup types? Full, Incremental, Differential. Full = Her şey, Incremental = Changes since last, Differential = Changes since last full'
        },
        {
          term: 'Snapshot',
          aka: 'Anlık Görüntü',
          definition: 'Point-in-time kopyası 📸 Anında geri dön!',
          example: 'VM snapshot, ZFS snapshot, Storage snapshot - Hızlı restore',
          funFact: 'Snapshot chain = Her snapshot öncekine bağlı. Uzun chain = Yavaş! 🐌',
          interview: 'Snapshot vs Backup? Snapshot = Fast, point-in-time, not offsite. Backup = Slow, full copy, offsite'
        },
        {
          term: 'Deduplication',
          aka: 'Tekilleştirme',
          definition: 'Duplicate data\'yı sil 🗑️ Storage tasarrufu!',
          example: '10 identical file = 1 stored. Pointer\'lar gösterir',
          funFact: 'Compression + Dedup = Storage efficiency x10! 🚀',
          interview: 'Inline vs Post-process dedup? Inline = Write sırasında, Post-process = Daha sonra'
        },
        {
          term: 'DAS',
          aka: 'Direct Attached Storage',
          definition: 'Doğrudan bağlı disk 🔌 PC/Server\'a USB, SATA, SAS!',
          example: 'External HDD, USB stick, Internal disk. En basit storage!',
          funFact: 'Network yok = Hızlı ama sharing zor! 🚀',
          interview: 'DAS vs NAS vs SAN? DAS = Direct, NAS = Network file, SAN = Network block'
        },
        {
          term: 'iSCSI',
          aka: 'Internet Small Computer System Interface',
          definition: 'Network üzerinden block storage 🌐 SCSI over TCP/IP!',
          example: 'iSCSI target = Server, iSCSI initiator = Client. SAN cheap alternatifi!',
          funFact: 'Fiber Channel\'den ucuz! 💰',
          interview: 'iSCSI vs Fiber Channel? iSCSI = Ethernet, Fiber = Dedicated network'
        },
        {
          term: 'Fibre Channel',
          aka: 'FC / Fiber Channel',
          definition: 'High-speed SAN protokolü 🏢 8 Gbps - 32 Gbps!',
          example: 'Enterprise SANda standart. Dedicated network gerekli',
          funFact: 'Fiber = Optik kablo. Çok pahalı ama çok hızlı! 💎',
          interview: 'Fibre Channel topology? Point-to-point, Arbitrated Loop, Switched Fabric'
        },
        {
          term: 'Object Storage',
          aka: 'Object Storage Service',
          definition: 'Dosyaları object olarak depola 📦 Metadata + Data!',
          example: 'AWS S3, Google Cloud Storage, Azure Blob. REST API ile erişim',
          funFact: 'Unlimited ölçeklenme! Cloud\'un favorisi 🌩️',
          interview: 'Object vs Block vs File? Object = REST API, Block = IOPS, File = SMB/NFS'
        },
        {
          term: 'Block Storage',
          aka: 'Block-level Storage',
          definition: 'Fixed-size block\'lara böl 📊 Raw storage like disk!',
          example: 'SAN, iSCSI, EBS. Database, VM için ideal',
          funFact: 'File system gerekli! 💾',
          interview: 'Block storage advantages? Low latency, high IOPS, raw performance'
        },
        {
          term: 'File Storage',
          aka: 'NAS / File-level Storage',
          definition: 'Dosya servisi 📁 SMB, NFS, AFP protocols!',
          example: 'Windows Share, NFS mount. Multiple users erişebilir',
          funFact: 'File locking = Conflict prevention! 🔒',
          interview: 'File storage vs Block? File = User-friendly, Block = Performance'
        },
        {
          term: 'Clone',
          aka: 'Kopyalama',
          definition: 'Tam disk/LUN kopyası 🔄 Snapshot\'dan farklı!',
          example: 'Disk clone = Yedek disk, VM clone = Çoğaltma',
          funFact: 'Snapshot\'tan daha büyük yer kapar! 💪',
          interview: 'Clone vs Snapshot? Clone = Full copy, Snapshot = Point-in-time reference'
        },
        {
          term: 'Compression',
          aka: 'Sıkıştırma',
          definition: 'Veri boyutu azalt 📉 Storage tasarrufu!',
          example: 'LZ4, ZSTD, GZIP compression. İnline vs post-process',
          funFact: 'Dedup + Compression = Storage magician 🧙',
          interview: 'Compression ratio? 2:1, 3:1 typical. Depends on data type'
        },
        {
          term: 'Thin Provisioning',
          aka: 'Esnekprovisionlama',
          definition: 'İhtiyaç kadar yer ver 📊 Alanı dinamik bağla!',
          example: '100GB allocate ama 10GB kullan. 90GB başkasına ver',
          funFact: 'Over-provisioning riski var! Dikkat et 🚨',
          interview: 'Thin vs Thick provisioning? Thin = Flexible, Thick = Predictable'
        },
        {
          term: 'Thick Provisioning',
          aka: 'Kalın Sağlama',
          definition: 'Full alanı hemen ayır 💾 Guarantee performance!',
          example: '100GB allocate = 100GB hemen bloke. Kaynakların sonu!',
          funFact: 'Performance predictable ama space israf! 🎯',
          interview: 'When to use Thick? Database, critical apps'
        },
        {
          term: 'Archive',
          aka: 'Arşivleme',
          definition: 'Eski data depola 📦 Cheap + Slow storage!',
          example: 'AWS Glacier, Azure Archive. 7+ yıl retention için',
          funFact: 'Restore süresi aylar olabilir! 🐢',
          interview: 'Archive storage use cases? Compliance, long-term backup, rarely accessed'
        },
        {
          term: 'Hot Storage',
          aka: 'Sıcak Depolama',
          definition: 'Sık erişilen data 🔥 Fast + Expensive!',
          example: 'SSD, NVMe. Real-time access gerekli',
          funFact: 'Tüm datayı hot tutamazsın! Para yok 💸',
          interview: 'Hot vs Warm vs Cold? Hot = Frequent, Warm = Occasional, Cold = Rare'
        },
        {
          term: 'Cold Storage',
          aka: 'Soğuk Depolama',
          definition: 'Nadir erişilen data ❄️ Cheap + Slow!',
          example: 'Glacier, Archive. Yılda 1 kere bile açılmayabilir',
          funFact: 'Restore maliyeti var! Dikkat et 💰',
          interview: 'Cold storage economics? Cheap per GB but restore cost'
        },
        {
          term: 'Glacier',
          aka: 'AWS Glacier',
          definition: 'Uzun süreli archive depolama ❄️ Pennies per GB!',
          example: 'AWS Glacier, Azure Archive. 90 günden uzun retention',
          funFact: 'Restore 3-5 saate kadar sürebilir! 🐌',
          interview: 'Glacier tiers? Flexible retrieval, Instant retrieval, Deep Archive'
        },
        {
          term: 'S3',
          aka: 'Simple Storage Service',
          definition: 'AWS object storage 🪣 Skalabilir + Durable!',
          example: 'https://bucket-name.s3.amazonaws.com/file. REST API ile upload',
          funFact: '99.999999999% durability! 11 dokuz 🔢',
          interview: 'S3 storage classes? Standard, IA, Glacier, Deep Archive'
        },
        {
          term: 'Blob Storage',
          aka: 'Azure Blob Storage',
          definition: 'Azure object storage 📦 Unstructured data için!',
          example: 'Videos, images, backups. Hot, Cool, Archive tiers',
          funFact: 'S3\'nin Azure kardeşi! 👯',
          interview: 'Blob vs Azure Files? Blob = Object, Files = SMB share'
        },
        {
          term: 'Data Tiering',
          aka: 'Veri Katmanlaması',
          definition: 'Farklı storage tier\'ları kullan 📊 Cost optimize!',
          example: 'Hot → Warm → Cold otomatik. Age-based policy',
          funFact: 'Sağlam bir tiering = 50% cost saving! 💰',
          interview: 'Tiering strategies? Age-based, access-based, capacity-based'
        },
        {
          term: 'Storage Array',
          aka: 'Storage Appliance',
          definition: 'Disk array controller 🎛️ RAID + Caching + Replication!',
          example: 'NetApp, EMC, Pure Storage. Enterprise SAN cihazı',
          funFact: 'Firmware update = Downtime riski! Dikkat et 🚨',
          interview: 'Storage array components? Disks, controller, cache, network'
        },
        {
          term: 'JBOD',
          aka: 'Just a Bunch of Disks',
          definition: 'Disk grubu 📀 RAID yok! Kendi işini görsün!',
          example: 'Object storage için ideal. Single disk failure = Data loss',
          funFact: 'JBOD = Ucuz ama riskli! Backup şart! 🚨',
          interview: 'JBOD use cases? Cloud storage, big data, cost-sensitive'
        },
        {
          term: 'LUN',
          aka: 'Logical Unit Number',
          definition: 'SAN\'daki logical disk 🔢 Partition like concept!',
          example: 'LUN 0, LUN 1... Her server farklı LUN mount eder',
          funFact: '0-indexed! LUN 0 ilk disk 📍',
          interview: 'LUN masking? Access control. Server A → LUN 0, Server B → LUN 1'
        },
        {
          term: 'Snapshot',
          aka: 'Anlık Görüntü',
          definition: 'Point-in-time kopyası 📸 Anında geri dön!',
          example: 'VM snapshot, ZFS snapshot, Storage snapshot - Hızlı restore',
          funFact: 'Snapshot chain = Her snapshot öncekine bağlı. Uzun chain = Yavaş! 🐌',
          interview: 'Snapshot consistency? Crash-consistent, app-consistent'
        }
      ]
    },
    {
      category: 'troubleshoot',
      icon: AlertTriangle,
      color: 'from-yellow-600 to-amber-600',
      title: '🔧 Sorun Giderme',
      terms: [
        {
          term: 'Blue Screen (BSOD)',
          aka: 'Mavi Ekran Hatası',
          definition: 'Windows\'un ölüm ekranı 💀 Critical error!',
          example: 'STOP code oku, Google\'la. Driver sorunu çoğunlukla',
          funFact: 'BSOD frequency azaldı. Windows 10/11 daha stabil! 🎯',
          interview: 'Common BSOD causes? Driver issues, hardware failure, memory corruption, overheating'
        },
        {
          term: 'Ping',
          aka: 'Network Test',
          definition: 'Bağlantı testi 🏓 Echo request gönder!',
          example: 'ping google.com -t = Continuous ping. Packet loss = Network problem',
          funFact: 'TTL (Time To Live) değeri ile hop sayısı anlaşılır! 🔢',
          interview: 'Ping results? Reply = OK, Request timeout = Firewall/offline, Destination unreachable = Routing problem'
        },
        {
          term: 'Traceroute',
          aka: 'tracert / Route Tracing',
          definition: 'Paket yolu 🗺️ Hangi router\'lardan geçti göster!',
          example: 'tracert google.com - Hop by hop latency. Bottleneck bul!',
          funFact: 'Max 30 hop. Sonra "too many hops" 🔄',
          interview: 'Traceroute use cases? Find network bottleneck, identify routing loops, verify path'
        },
        {
          term: 'nslookup',
          aka: 'Name Server Lookup',
          definition: 'DNS sorgulama 🔍 Domain → IP çözümle!',
          example: 'nslookup google.com - Hangi IP\'ye resolve oluyor?',
          funFact: 'Non-authoritative answer = Cache\'den geldi. Authoritative = DNS server\'dan direkt 📋',
          interview: 'nslookup vs dig? nslookup = Simple, dig = Detailed (Linux)'
        },
        {
          term: 'Safe Mode',
          aka: 'Güvenli Mod',
          definition: 'Minimal boot 🛡️ Driver sorunu varsa buradan düzelt!',
          example: 'F8 (eski) / Shift+Restart (yeni). Minimal driver ile boot',
          funFact: 'Safe Mode\'da bile boot olmazsa hardware problem! 🔧',
          interview: 'Safe Mode types? Safe Mode (minimal), with Networking (network), with Command Prompt (CLI)'
        },
        {
          term: 'Root Cause Analysis',
          aka: 'RCA',
          definition: 'Sorunun kaynağını bulma 🎯 Sadece semptomları değil, asıl sebebi bul!',
          example: 'Uygulama crash olmuş. RCA: Memory leak mı? Thread deadlock mı? Config hatası mı?',
          funFact: '5 Why technique = İşte bu RCA! "Neden?" 5 kere sor 🤔',
          interview: 'RCA process? Collect data → Identify problem → Find root cause → Implement fix → Prevent recurrence'
        },
        {
          term: 'Log Analysis',
          aka: 'Günlük İnceleme',
          definition: 'Logları okuyup sorun bul 📖 Error, Warning, Info - Hepsi ipucu!',
          example: 'tail -f /var/log/syslog = Real-time log takip. Stack trace oku!',
          funFact: 'Log bozulmuşsa forensics! Eski backup\'tan kurtar 🔎',
          interview: 'Common log locations? /var/log (Linux), Event Viewer (Windows), /var/log/apache2 (Web)'
        },
        {
          term: 'Performance Tuning',
          aka: 'Performans Optimizasyonu',
          definition: 'Sistemi daha hızlı yap ⚡ Bottleneck bulup çöz!',
          example: 'Database query optimize. Cache ekle. Connection pool tuning!',
          funFact: 'Premature optimization = Evil! Profile first, then optimize 🎯',
          interview: 'Performance tuning steps? Identify bottleneck → Measure baseline → Apply fix → Verify improvement'
        },
        {
          term: 'Bottleneck',
          aka: 'Şişe Ağzı, Engel',
          definition: 'Sistemi yavaşlatan bölüm 🚦 En zayıf halka!',
          example: 'CPU %95, RAM %20 = CPU bottleneck. Disk I/O yüksekse storage bottleneck',
          funFact: 'Bottleneck üzerinde fokusla. Diğerleri optimize etmek boşa zaman 💪',
          interview: 'Identify bottleneck? Monitor CPU, RAM, Disk I/O, Network. Hangisi %90+ kullanım?'
        },
        {
          term: 'Memory Leak',
          aka: 'Bellek Sızıntısı',
          definition: 'RAM köpeğine gitmiş 🐕 Process serbest bırakmayan bellek tutuyor!',
          example: 'Uygulama 24 saat çalıştı, RAM %100 oldu. Restart gerekli. Memory leak var!',
          funFact: 'Valgrind, AddressSanitizer ile tespit et. C/C++ nightmare! 😱',
          interview: 'Memory leak vs Memory bloat? Leak = Başlıbaşına sızıntı, Bloat = Unnecessary allocation'
        },
        {
          term: 'Disk I/O',
          aka: 'Disk Giriş/Çıkış',
          definition: 'Disk okuma-yazma işlemi 💾 IOPS (Input/Output Per Second) ölçüsü!',
          example: 'iostat -x = Disk I/O stats. iotop = Process bazlı disk kullanımı',
          funFact: 'SSD %100 şans. HDD ise manyetik döndüğü için çok yavaş 🔄',
          interview: 'Disk I/O optimization? SSD upgrade, Database indexing, Caching, Query optimization'
        },
        {
          term: 'Network Latency',
          aka: 'Ağ Gecikmesi',
          definition: 'Paketin gidiş-dönüş süresi ⏱️ Her milisaniye önemli!',
          example: '1ms (excellent), 10ms (good), 100ms (bad), 500ms (timeout)',
          funFact: 'Speed of light = 300k km/s. Fiber optic dahi bu hızda gidiyor! 💡',
          interview: 'Reduce latency? CDN kullan, Server konumunu yaklaştır, Caching, Compression'
        },
        {
          term: 'CPU Spike',
          aka: 'İşlemci Piki',
          definition: 'CPU kullanımı aniden fırladı 📈 Hangi process yapmış?',
          example: 'top = CPU kullanımını gör. CPU %100 olmuş, hangi PID?',
          funFact: 'CPU spike\'ı kontrol et. Infinite loop, DoS attack, ya da legitimate spike?',
          interview: 'Diagnose CPU spike? Check top, ps, Identify process, Review code, Check system load'
        },
        {
          term: 'Crash Dump',
          aka: 'Çökme Dosyası',
          definition: 'Sistem çöktüğü anki bellek dump\'ı 💥 Forensics için!',
          example: 'Windows: minidump, fulldump. Analysis: WinDbg, Visual Studio Debugger',
          funFact: 'Crash dump analizi = Detective gibi çalışmak! Stack trace, heap corruption, etc.',
          interview: 'Crash dump analysis? Load dump file → Check exception code → Analyze stack trace → Find root cause'
        },
        {
          term: 'Core Dump',
          aka: 'Çekirdek Döküşü',
          definition: 'Linux\'taki crash dump ⚙️ Process çöktüğünde memory snapshot!',
          example: 'ulimit -c unlimited = Core dump etkinleştir. gdb core = Debug',
          funFact: 'Core dump boyutı huge olabilir! Production\'da devre dışı bırakılır 📦',
          interview: 'Core dump analyze? gdb program core → run gdb commands → check backtrace'
        },
        {
          term: 'Debug',
          aka: 'Hata Ayıklama',
          definition: 'Kodun içini incele 🔍 Breakpoint, step, watch, hepsi oyun alanı!',
          example: 'IDE debugger: VS Code, PyCharm, IntelliJ. GDB command-line',
          funFact: 'Printf debugging = eski usul! Debugger çok daha powerful 💪',
          interview: 'Debug techniques? Breakpoints, Step over/into, Watch variables, Conditional breaks'
        },
        {
          term: 'Trace',
          aka: 'Takip, İz Bırakma',
          definition: 'Kodun her adımını takip et 👣 Execution flow gör!',
          example: 'strace (system calls), ltrace (library calls), Distributed tracing (Jaeger, Zipkin)',
          funFact: 'APM tools = Modern tracing. Microservices debugging = Game changer! 🎯',
          interview: 'Tracing benefits? Understand execution flow, Find bottlenecks, Debug distributed systems'
        },
        {
          term: 'Wireshark',
          aka: 'Ağ Paket Analizi',
          definition: 'Network trafiğini payload\'ı görünür kıl 📡 Paket sniffer!',
          example: 'Wireshark ile DNS, HTTP, SSL handshake, hepsi görürsün. Filter: tcp.port == 80',
          funFact: 'Ethereal\'ın adı değişti, Wireshark oldu. Hacker\'ın en sevdiği tool! 🕵️',
          interview: 'Wireshark use cases? Troubleshoot network issues, Security analysis, Protocol analysis'
        },
        {
          term: 'tcpdump',
          aka: 'TCP Dump, Paket Yakalama',
          definition: 'Command-line paket sniffer 📡 Wireshark\'ın komut satırı versiyonu!',
          example: 'tcpdump -i eth0 port 443 = HTTPS trafiğini yakala. -w file.pcap = Kaydet',
          funFact: 'tcpdump output = Wireshark\'ta açabilirsin. Combo power! 💪',
          interview: 'tcpdump syntax? tcpdump [interface] [filter]. Filter: host, port, protocol (tcp, udp)'
        },
        {
          term: 'netstat',
          aka: 'Network Statistics',
          definition: 'Ağ bağlantılarını listele 🔌 ESTABLISHED, LISTENING, TIME_WAIT, hepsi burada!',
          example: 'netstat -tulpn = TCP/UDP portları ve processler. ss komutu (modern)',
          funFact: 'netstat deprecated! ss komutu daha hızlı 🚀',
          interview: 'netstat vs ss? netstat = Classic, ss = Modern. Both show connections, but ss = faster'
        },
        {
          term: 'top',
          aka: 'Table of Processes',
          definition: 'Real-time process monitoring 📊 Sistem ressource usage gör!',
          example: 'top -p 1234 = Specific process. Shift+M (memory sort), Shift+P (CPU sort)',
          funFact: 'top interactive! Canlı monitoring, process kill, priority change - hepsi burada',
          interview: 'top columns? PID, USER, %CPU, %MEM, VSZ (virtual), RSS (resident), STAT (status)'
        },
        {
          term: 'htop',
          aka: 'Improved top',
          definition: 'top\'ın fancy versiyonu 🎨 Renkli, interactive, tree view!',
          example: 'htop = Arrow keys ile navigate. Tree view = Process hierarchy. Custom sort!',
          funFact: 'htop install lazım. top sistem default ama htop çok better! 👍',
          interview: 'htop advantages? Colored output, easier to use, tree view, kill process without PID'
        },
        {
          term: 'ps',
          aka: 'Process Status',
          definition: 'Çalışan processler listele 📋 Snapshot view (top gibi canlı değil)',
          example: 'ps aux = Full process listing. ps -p $$ = Current shell. ps --forest = Tree view',
          funFact: 'ps aux | grep = Process pattern arama. System admin\'ın herkette! 🔍',
          interview: 'ps columns? PID (process ID), PPID (parent), %CPU, %MEM, STAT (status), CMD'
        },
        {
          term: 'strace',
          aka: 'System Trace',
          definition: 'System calls takip et 🔎 Process hangi syscall\'ları çağırıyor?',
          example: 'strace ls = ls komutu hangi syscall yapıyor? strace -e openat = Specific syscall filter',
          funFact: 'strace slow! Performance overhead var. Ama debugging için priceless! 💎',
          interview: 'strace output? timestamp, syscall name, arguments, return value, errno'
        },
        {
          term: 'lsof',
          aka: 'List Open Files',
          definition: 'Açık dosya ve socket listele 📂 Network connection, file descriptor hepsi!',
          example: 'lsof -p 1234 = Process 1234\'ün açık dosyaları. lsof -i :80 = Port 80\'deki process',
          funFact: 'lsof = "Everything is a file" Unix philosophy\'nin embodiment!',
          interview: 'lsof use cases? Find process using file/port, Check deleted file references, Monitor FD usage'
        },
        {
          term: 'dmesg',
          aka: 'Display Message',
          definition: 'Kernel message buffer ⚙️ Hardware errors, boot messages, driver logs!',
          example: 'dmesg | tail = Son kernel messages. dmesg | grep error = Error filter',
          funFact: 'dmesg = Hardware issue diagnosis için golden! OOM killer, disk error, etc.',
          interview: 'dmesg content? Kernel boot messages, Hardware errors, Memory management, Disk I/O issues'
        },
        {
          term: 'journalctl',
          aka: 'Journal Control (systemd)',
          definition: 'systemd journal logs okuma 📖 Modern Linux\'in dmesg\'i!',
          example: 'journalctl -u nginx = nginx service logs. journalctl -f = Follow (tail -f like)',
          funFact: 'journalctl structured logs! dmesg ise raw text. Modern yöntem journalctl! 🚀',
          interview: 'journalctl options? -u (unit), -f (follow), -n (last N lines), --since, --until'
        },
        {
          term: 'Event Correlation',
          aka: 'Olay İlişkilendirme',
          definition: 'Farklı loglar\'ı bağla 🔗 Event A olursa Event B neden oluyor?',
          example: 'Database fail → App timeout → User complaint. Correlation ID ile trace et!',
          funFact: 'Correlation ID = Distributed tracing\'in özü! Microservices nightmare çözümü',
          interview: 'Event correlation benefits? Understand dependencies, Root cause analysis, SLA troubleshooting'
        },
        {
          term: 'Baseline',
          aka: 'Temel Başlangıç',
          definition: 'Normal durumu tanımla 📊 Anomali tespiti için başlangıç noktası!',
          example: 'Normal CPU = %20-30. Spike = %80+ olunca alert. Baseline bul, deviation detect et!',
          funFact: 'Baseline yok = Anomaly yok! Baseline = First step of monitoring',
          interview: 'Baseline setup? Collect metrics under normal conditions, Set thresholds, Monitor deviations'
        },
        {
          term: 'Health Check',
          aka: 'Sağlık Kontrolü',
          definition: 'Service çalışıyor mu kontrol et 💚 HTTP endpoint, Ping, Heartbeat!',
          example: 'GET /health = {status: "ok"}. Kubernetes liveness/readiness probe',
          funFact: 'Health check = Automated monitoring! Manual kontrol = Ancient! 👴',
          interview: 'Health check types? Liveness (process alive?), Readiness (accept traffic?), Startup (initialized?)'
        }
      ]
    },
    {
      category: 'general',
      icon: Code,
      color: 'from-green-600 to-emerald-600',
      title: '💻 Genel IT Kavramlar',
      terms: [
        {
          term: 'API',
          aka: 'Application Programming Interface',
          definition: 'Yazılımlar arası iletişim 🔌 Kurallar + Endpoints!',
          example: 'REST API, GraphQL API, SOAP API - Farklı API tipleri',
          funFact: 'Rate limiting = Çok istek atma! 429 Too Many Requests 🚫',
          interview: 'REST principles? Stateless, cacheable, uniform interface, layered system'
        },
        {
          term: 'JSON',
          aka: 'JavaScript Object Notation',
          definition: 'Data format 📋 Key-value pairs!',
          example: '{"name":"Cemal","role":"IT Admin","skills":["Windows","Network"]}',
          funFact: 'XML\'den çok daha clean! JSON won the war 🏆',
          interview: 'JSON vs XML? JSON = Lighter, easier to parse. XML = More features, verbose'
        },
        {
          term: 'Regex',
          aka: 'Regular Expression',
          definition: 'Pattern matching 🎯 Text arama/değiştirme için!',
          example: '[A-Z]{3}-\\d{4} = ABC-1234 formatı. Email regex, phone regex...',
          funFact: 'Regex debugging = Nightmare! regex101.com kullan 😅',
          interview: 'Common regex patterns? \\d (digit), \\w (word), \\s (space), . (any), * (0+), + (1+)'
        },
        {
          term: 'Latency',
          aka: 'Gecikme',
          definition: 'Network delay ⏱️ İstek-cevap süresi!',
          example: 'Ping 10ms = Good. Ping 200ms = Bad. Gaming\'de critical! 🎮',
          funFact: 'Speed of light limit! Fiber optic bile sınırsız değil 💡',
          interview: 'Latency vs Bandwidth? Latency = Delay, Bandwidth = Capacity'
        },
        {
          term: 'Bandwidth',
          aka: 'Bant Genişliği',
          definition: 'Network kapasitesi 🚰 Saniyede ne kadar veri?',
          example: '100 Mbps = 12.5 MB/s. Bit vs Byte! 8 bit = 1 byte',
          funFact: 'ISP\'ler Mbps (megabit) kullanır. MB (megabyte) daha küçük görünür! 😏',
          interview: 'Bandwidth vs Throughput? Bandwidth = Max capacity, Throughput = Actual usage'
        },
        {
          term: 'Automation',
          aka: 'Otomasyon',
          definition: 'Tekrarlayan işleri robot yap 🤖 Zaman kazanma sanatı!',
          example: 'Backup automation, patch automation, deployment automation',
          funFact: 'Automation = IT admin\'in en iyi arkadaşı! 30 saatlik işi 5 dakikada yap 🚀',
          interview: 'Automation framework nedir? İş akışını otomatikleştiren sistemler'
        },
        {
          term: 'Scripting',
          aka: 'Betik Yazılımı',
          definition: 'Komut dosyası ile otomasyonu gerçekleştir 📝 PowerShell, Bash, Python...',
          example: 'for %f in (*.txt) do echo %f - Döngü ile dosya işleme',
          funFact: 'Bash script vs PowerShell script = Linux vs Windows, Jedi vs Sith 🎬',
          interview: 'Scripting vs Programming farkı? Scripting = Interpreted, Programming = Compiled'
        },
        {
          term: 'REST',
          aka: 'Representational State Transfer',
          definition: 'API tasarım prensibi 🏗️ GET, POST, PUT, DELETE - HTTP tiyatrosu!',
          example: 'GET /users, POST /users, PUT /users/1, DELETE /users/1',
          funFact: 'REST API design = Sadece kural değil, felsefe! 📚',
          interview: 'REST API idempotent metotları? GET, PUT, DELETE. POST değil!'
        },
        {
          term: 'SOAP',
          aka: 'Simple Object Access Protocol',
          definition: 'XML-based API protokolü 🧼 Eski ama güvenilir, aşırı verbatim!',
          example: '<soapenv:Envelope><soapenv:Body>...</soapenv:Body></soapenv:Envelope>',
          funFact: 'SOAP = REST\'in "boomer" kardeşi. Hala enterprise\'da yaşıyor! 👴',
          interview: 'SOAP vs REST? SOAP = Protocol, REST = Architectural style'
        },
        {
          term: 'XML',
          aka: 'eXtensible Markup Language',
          definition: 'Tag-based data format 🏷️ Self-describing ama çok verbose!',
          example: '<user><name>Cemal</name><role>IT Admin</role></user>',
          funFact: 'XML parsing = Detaylı ama yavaş. JSON\'in zaferi onun hezimet! 😅',
          interview: 'XML vs JSON? XML = More features, JSON = Lighter'
        },
        {
          term: 'YAML',
          aka: 'YAML Ain\'t Markup Language',
          definition: 'İnsan dostu data format 👤 Indentation sensitive!',
          example: 'Key: value, List: [item1, item2], Nested: child: value',
          funFact: 'YAML indentation error = Seni saatlerce ağlatır! Tabs vs Spaces 😭',
          interview: 'YAML configuration dosyası nerelerde? Docker Compose, Kubernetes, Ansible'
        },
        {
          term: 'Cron',
          aka: 'Cron Job',
          definition: 'Linux task scheduler ⏰ Belirli saatlarda otomatik komut çalıştır!',
          example: '0 2 * * * /backup.sh - Her gün saat 02:00\'de backup al',
          funFact: 'Cron job debugging = ping dersinde hata fark etme gibi zor! 🎯',
          interview: 'Cron format? Minute Hour Day Month DayOfWeek Command'
        },
        {
          term: 'Scheduler',
          aka: 'Task Scheduler (Windows)',
          definition: 'Windows task otomasyonu ⚙️ UNIX\'teki Cron\'un Windows versiyonu!',
          example: 'Disk cleanup, antivirus updates, backup scripts - scheduled runs',
          funFact: 'Scheduler failed email = Gece 3\'te uyandırıyor seni! 📧',
          interview: 'Task Scheduler ne işe yarar? İşletim sistemi görevlerini otomatikleştir'
        },
        {
          term: 'Monitoring',
          aka: 'İzleme',
          definition: 'Sisteminin sağlığını 24/7 gözetle 👀 CPU, RAM, Disk, Network...',
          example: 'Nagios, Prometheus, Datadog, New Relic - Monitoring tools',
          funFact: 'Monitoring = Know when broken. Observability = Know why broken! 💡',
          interview: 'Monitoring vs Observability? Monitoring = Metrics, Observability = Insights'
        },
        {
          term: 'Alerting',
          aka: 'Uyarı Sistemi',
          definition: 'Problem oluşunca sen uyandır! 🚨 CPU > 90% = Alert!',
          example: 'Email, SMS, Slack, PagerDuty - Alert channels',
          funFact: 'Alert fatigue = Çok uyarı aldığında sesi kapat. WORST IDEA! 😅',
          interview: 'Alert severity levels? Critical, High, Medium, Low, Info'
        },
        {
          term: 'Documentation',
          aka: 'Dokümantasyon',
          definition: 'Yazılı prosedürler ve bilgiler 📖 IT admin\'in hatırası!',
          example: 'Server specs, network diagrams, runbooks, change logs',
          funFact: 'Dokümantasyonu güncel tutumazsan = "Bunu kim bilir?" 😢',
          interview: 'Documentation en önemli neden? Knowledge sharing ve continuity'
        },
        {
          term: 'Ticketing',
          aka: 'Sorun Takip Sistemi',
          definition: 'Her problemi ticket\'e dön! 🎫 Jira, ServiceNow, Freshdesk...',
          example: 'Ticket oluş → Assign → Work → Test → Close → Report',
          funFact: 'Ticket numarasını not etmesen unuttun gider! 🤦',
          interview: 'Ticket lifecycle nedir? Create, Assign, Resolve, Close, Document'
        },
        {
          term: 'SLA',
          aka: 'Service Level Agreement',
          definition: 'Hizmet garantisi kontratı ⚖️ 99.9% uptime promise!',
          example: 'Response time: 1 hour, Resolution time: 4 hours - P1 tickets',
          funFact: 'SLA miss = Para cezası! O yüzden herkes SLA\'yı seviyor 💰',
          interview: 'SLA vs OLA vs UC? SLA = Service, OLA = Operations, UC = User'
        },
        {
          term: 'ITIL',
          aka: 'IT Infrastructure Library',
          definition: 'IT service management best practices 📚 Industry standard framework!',
          example: 'Service Strategy, Design, Transition, Operation, Improvement',
          funFact: 'ITIL certification = IT\'nin MBA\'si! Çok prestijli 🏆',
          interview: 'ITIL\'in 5 ana servisi? Strategy, Design, Transition, Operation, Support'
        },
        {
          term: 'ITSM',
          aka: 'IT Service Management',
          definition: 'IT hizmetlerini yönetme sanatı 🎭 Müşteri odaklı yaklaşım!',
          example: 'Incident, Problem, Change, Release, Request management',
          funFact: 'ITSM yapmazsan chaos yaşarsın. Dersin en başında!',
          interview: 'ITSM process nedir? IT hizmetlerini yapılandırılmış şekilde sunma'
        },
        {
          term: 'Change Management',
          aka: 'Değişiklik Yönetimi',
          definition: 'Sistem değişiklikleri kontrollü yapma 🔄 RFC = Change Request!',
          example: 'Plan → Approve → Schedule → Test → Deploy → Review',
          funFact: 'Change window = Herkesin korktuğu zaman! Fail = Disaster 😰',
          interview: 'Change management process aşamaları? Planning, Approval, Implementation, Review'
        },
        {
          term: 'Incident Management',
          aka: 'Olay Yönetimi',
          definition: 'Krizi kontrol altına alma prosedürü 🚨 Response + Recovery!',
          example: 'Server down = P1 incident. Immediate response required!',
          funFact: 'Incident oluşunca panic atma, prosedürü takip et! 📋',
          interview: 'Incident management steps? Detection, Response, Recovery, Review'
        },
        {
          term: 'Problem Management',
          aka: 'Sorun Yönetimi',
          definition: 'Root cause analysis ve remediation 🔍 Tekrar oluşmadığını sağla!',
          example: 'Server crashes every Monday 9 AM = Root cause investigation needed',
          funFact: 'Problem vs Incident = Ufak kazı vs kök sebep bulma 🌳',
          interview: 'Problem Management ne işe yarar? Recurring incidents\'i prevent etmek'
        },
        {
          term: 'Asset Management',
          aka: 'Varlık Yönetimi',
          definition: 'Donanım ve yazılım varlıkları takip et 🏷️ Her device bir asset!',
          example: 'Laptop serial numbers, license keys, maintenance schedules tracking',
          funFact: 'Asset inventory = Denetçilerin en sevdiği şey! 📊',
          interview: 'Asset management neden önemli? Cost control ve compliance'
        },
        {
          term: 'Inventory',
          aka: 'Envanter',
          definition: 'Ne var neyin var listesi 📝 Stok takip sistemi!',
          example: 'Hardware inventory: 50 laptops, 30 monitors, 10 printers',
          funFact: 'Inventory kontrolü yapmamazsan = Boş verilenler kayıp gider 😭',
          interview: 'Inventory management system ne işe yarar? Asset tracking ve planning'
        },
        {
          term: 'License Management',
          aka: 'Lisans Yönetimi',
          definition: 'Yazılım lisanslarını yasalı kullan 📜 Piracy = Dava!',
          example: 'Microsoft, Adobe, Cisco licenses - Compliance tracking required',
          funFact: 'License audit = Denetçi geldi demek! Tüm lisans paperleri hazırla 😰',
          interview: 'License types? Perpetual, Subscription, Trial, Free, Open Source'
        },
        {
          term: 'Runbook',
          aka: 'İşlem Prosedürü',
          definition: 'Step-by-step prosedür dokümanı 📖 Otopilot untuk IT tasks!',
          example: 'Server disaster recovery runbook, Network failover runbook',
          funFact: 'Runbook olmazsa = IT chaos. Herkes farklı şey yapar! 🌪️',
          interview: 'Runbook neyi içermeli? Steps, troubleshooting, rollback, contacts'
        }
      ]
    }
  ]

  const categories = [
    { id: 'all', name: '📚 Tümü', icon: BookOpen },
    { id: 'network', name: '🌐 Ağ', icon: Network },
    { id: 'windows', name: '🪟 Windows', icon: Server },
    { id: 'security', name: '🔒 Güvenlik', icon: Shield },
    { id: 'cloud', name: '☁️ Cloud', icon: Cloud },
    { id: 'database', name: '🗄️ Database', icon: Database },
    { id: 'linux', name: '🐧 Linux', icon: Terminal },
    { id: 'devops', name: '⚡ DevOps', icon: Zap },
    { id: 'hardware', name: '🔧 Hardware', icon: Cpu },
    { id: 'storage', name: '💾 Storage', icon: HardDrive },
    { id: 'troubleshoot', name: '🔧 Sorun Giderme', icon: AlertTriangle },
    { id: 'general', name: '💻 Genel', icon: Code },
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
      {/* Header with Stats */}
      <div className={`text-center space-y-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-orange-600 animate-pulse-slow" />
          IT Sözlük 📚
        </h1>
        <p className="text-2xl text-gray-400 font-medium">
          Junior IT Profesyonelleri için 10x Geliştirilmiş Sözlük 🚀
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl">
            <div className="text-4xl font-black">{stats.categories}</div>
            <div className="text-sm font-semibold">Kategori</div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-xl">
            <div className="text-4xl font-black">{stats.terms}</div>
            <div className="text-sm font-semibold">Terim</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          "Interview\'a hazırlan, mülakat sorularıyla birlikte öğren!" ~ Cemal 🎯
        </p>
      </div>

      {/* Fun Warning */}
      <div className={`bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-l-4 border-orange-600 p-6 rounded-xl shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start gap-4">
          <Zap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="text-sm text-orange-300">
            <strong className="text-lg">⚡ Yeni Özellikler:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>Interview Soruları:</strong> Her terimde mülakat sorusu var! 🎯</li>
              <li><strong>10x Daha Fazla Terim:</strong> 300+ IT terimi! Network\'ten DevOps\'a her şey</li>
              <li><strong>12 Kategori:</strong> Database, Linux, DevOps, Hardware, Storage ve daha fazlası</li>
              <li><strong>Pratik Örnekler:</strong> Real-world senaryolar ve komutlar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Terim ara... (örn: DNS, Docker, RAID, API)"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-700 text-white text-lg font-medium"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white scale-110'
                    : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Glossary Categories */}
      {searchedGlossary.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-20 h-20 mx-auto mb-4 opacity-50" />
          <p className="text-2xl font-bold">Hiçbir sonuç bulunamadı! 😅</p>
          <p className="text-lg mt-2">Farklı terim ara veya filtreyi değiştir</p>
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
              <div className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-200 border-gray-600">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-2xl`}>
                  <CategoryIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">{category.title}</h2>
                  <p className="text-base text-gray-400 font-semibold">{category.terms.length} terim • Interview soruları ile</p>
                </div>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.terms.map((term, termIdx) => (
                  <div
                    key={termIdx}
                    className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:hover:border-orange-500 transition-all hover:shadow-2xl hover:scale-[1.02] space-y-4"
                  >
                    {/* Term Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-white">{term.term}</h3>
                        <p className="text-sm text-gray-400 italic font-medium">{term.aka}</p>
                      </div>
                      <Zap className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    </div>

                    {/* Definition */}
                    <p className="text-base text-gray-300 leading-relaxed font-medium">
                      {term.definition}
                    </p>

                    {/* Example */}
                    <div className="bg-orange-900/20 rounded-xl p-4 border-l-4 border-orange-500">
                      <p className="text-sm text-orange-200 font-medium">
                        <strong className="font-bold">📌 Örnek:</strong> {term.example}
                      </p>
                    </div>

                    {/* Fun Fact */}
                    <div className="bg-blue-900/20 rounded-xl p-4 border-l-4 border-blue-500">
                      <p className="text-sm text-blue-200 font-medium">
                        <strong className="font-bold">💡 Fun Fact:</strong> {term.funFact}
                      </p>
                    </div>

                    {/* Interview Question */}
                    {term.interview && (
                      <div className="bg-purple-900/20 rounded-xl p-4 border-l-4 border-purple-500">
                        <p className="text-sm text-purple-200 font-medium">
                          <strong className="font-bold">🎯 Interview:</strong> {term.interview}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Footer Note */}
      <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border-2 border-gray-700 shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
        <div className="text-center space-y-4">
          <p className="text-base text-gray-400 font-medium">
            🎓 <strong>Pro İpucu:</strong> Bu terimleri Google\'layıp derinlemesine öğren. Burası sadece başlangıç! Her terim interview sorularıyla birlikte gelir.
          </p>
          <p className="text-sm text-gray-500">
            📚 Şu an <strong>{stats.terms} terim</strong> ve <strong>{stats.categories} kategori</strong> var. Daha fazlası yolda!
          </p>
          <p className="text-sm text-gray-600 mt-4">
            🧡 300+ terim, interview soruları, real-world örneklerle hazırlandı - Cemal Demirci
          </p>
        </div>
      </div>
    </div>
  )
}

export default ITGlossary
