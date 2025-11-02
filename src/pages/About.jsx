import { Mail, Github, Linkedin, Download, Award, Briefcase, GraduationCap, Send, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import storage from '../utils/storage'

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleContactSubmit = async (e) => {
    e.preventDefault()

    try {
      // Send message to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (data.success) {
        // Reset form and show success
        setContactForm({ name: '', email: '', message: '' })
        setFormSubmitted(true)

        // Hide success message after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const skills = [
    'Active Directory', 'Azure', 'Microsoft 365', 'PowerShell', 'Windows Server',
    'Network Security', 'Firewall Management', 'Hyper-V', 'VMware', 'VPN',
    'Fortigate', 'Cisco', 'ISO 27001', 'Endpoint Security', 'Compliance',
    'SMPTE 2110', 'SRT Streaming', 'RTMP', 'Broadcast Engineering', 'IP Broadcasting',
    'Veeam Backup', 'Intune MDM', 'Data Loss Prevention', 'DHCP', 'File Server',
    'Proxy Server', 'SSL VPN', 'Deep Inspection', 'Group Policy', 'MCSE',
    'Virtualization', 'Backup & Recovery', 'IT Auditing', 'Risk Assessment',
    'AWS', 'Cloud Security', 'Zero Trust Architecture', 'Office 365 Admin',
    'System Monitoring', 'Patch Management', 'RMM Tools', 'Jira', 'Atlassian',
    'CDN Management', 'OTT Systems', 'TVOS', 'PTZ Cameras', 'Live Production'
  ]

  const certifications = [
    { name: 'ISO/IEC 42001:2023 Lead Auditor', issuer: 'AI Management System' },
    { name: 'Microsoft Certified Solutions Expert (MCSE)', issuer: 'Microsoft' },
    { name: 'ISO 27001 Lead Implementer', issuer: 'Information Security' },
    { name: 'Fortinet Certified Fortigate 7.4 Operator', issuer: 'Fortinet' },
    { name: 'Fortinet Certified Associate in Cybersecurity', issuer: 'Fortinet' },
    { name: 'Mastering Dark Web Intelligence for Cybersecurity', issuer: 'Cybersecurity Training' },
    { name: 'AWS Certified', issuer: 'Amazon Web Services' },
    { name: 'Cisco Cybersecurity', issuer: 'Cisco Systems' }
  ]

  const experiences = [
    {
      title: 'IT & Security Administrator',
      company: 'Zero Density',
      period: 'August 2024 - Present',
      description: 'Leading IT infrastructure and security operations at a cutting-edge virtual production and real-time graphics company.',
      highlights: [
        'Azure and Cloud Solutions: Microsoft Azure, Azure AD, Intune (MDM & MAM), DLP',
        'Active Directory, DHCP, File Server, Proxy Server, Windows Server management',
        'Network Security: Fortigate, Cisco Stack, SSL VPN, Deep Inspection, firewall management',
        'Virtualization: Hyper-V, VMware, Veeam backup and replication',
        'ISO 27001 compliance, endpoint security, and DLP solutions',
        'Advanced PowerShell & CMD scripting for automation and deployment'
      ]
    },
    {
      title: 'Technical Expert',
      company: 'Zero Density',
      period: 'July 2023 - September 2024',
      description: 'Technical support and system optimization for Zero Density products.',
      highlights: [
        'Product troubleshooting and technical support',
        'System optimization and performance tuning',
        'Customer-facing technical solutions'
      ]
    },
    {
      title: 'Senior Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'January 2023 - July 2023',
      description: 'Server, Storage, and Network Management for major international broadcast projects.',
      highlights: [
        '2023 UEFA Champions League Final (Manchester City vs. Inter, Istanbul)',
        'Mexico Exatlon & Exatlon All Star 2023 - Server and live stream management',
        'Survivor series: Balkan, Czech vs. Slovakia, Greece, Romania, Turkey',
        'IP-based Video Broadcasting: SMPTE 2110, SRT, RTMP streaming technologies',
        'Multi-site server and storage synchronization for live productions'
      ]
    },
    {
      title: 'Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'May 2022 - January 2023',
      description: 'Recording Media & Live Broadcasting for high-profile television productions.',
      highlights: [
        '2022 Survivor Turkey Final - Live broadcast management',
        'Exxen UEFA - Multi-channel live streaming and storage solutions',
        'TV8 O Ses Türkiye - Comprehensive live broadcasting setup',
        'Advanced broadcasting and storage solutions with PTZ camera integration'
      ]
    },
    {
      title: 'Information Technology Specialist',
      company: 'Exxen TR',
      period: 'December 2019 - June 2022',
      description: 'OTT platform management and streaming infrastructure.',
      highlights: [
        'OTT System management',
        'TVOS Application test & management',
        'CDN Media Deployment',
        'SRT Media Broadcast setup and management'
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12 relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header Section */}
      <div className={`text-center space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="relative w-32 h-32 mx-auto group">
          {/* Rotating Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-400 rounded-full blur-md animate-gradient-rotate opacity-75 group-hover:opacity-100 transition-opacity"></div>

          {/* Profile Photo Container */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg animate-pulse-slow border-4 border-white dark:border-gray-800">
            <img
              src="/profile.jpg"
              alt="Cemal Demirci"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
          <span className="inline-block hover:scale-110 transition-transform duration-300">Cemal</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ animationDelay: '100ms' }}>Demirci</span>
        </h1>
        <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
          {t(language, 'about.position')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          IT & Security Administrator
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="mailto:me@cemal.online"
            className="group relative p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-125 hover:-translate-y-2 hover:rotate-6 hover:shadow-xl"
            aria-label="Email"
          >
            <Mail className="w-5 h-5 group-hover:animate-bounce" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
          </a>
          <a
            href="https://github.com/cemal-demirci"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-125 hover:-translate-y-2 hover:rotate-6 hover:shadow-xl"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 group-hover:animate-spin-slow" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
          </a>
          <a
            href="https://www.linkedin.com/in/cemaldemirci/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-125 hover:-translate-y-2 hover:rotate-6 hover:shadow-xl"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 group-hover:animate-bounce" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
          </a>
        </div>
      </div>

      {/* About Section */}
      <div className={`group relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.03] hover:border-primary-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-primary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary-600 group-hover:animate-bounce" />
          <span className="group-hover:text-primary-600 transition-colors">{t(language, 'about.aboutMe')}</span>
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            With over eight years of experience in information technology and broadcast engineering, I serve as an IT & Security Administrator at a leading company in virtual production and real-time graphic solutions.
          </p>
          <p>
            My expertise spans IT systems and media streaming, and I hold certifications from Fortinet, AWS, Microsoft, and Cisco, including Cisco cybersecurity certifications, reflecting my skills in network security, cloud computing, and cybersecurity.
          </p>
          <p>
            I manage on-premises Active Directory, Azure environments, Hyper-V and VMware infrastructures, network and firewall configurations, and system monitoring. Additionally, my experience in video streaming, recording, and broadcast technologies has grown significantly through projects for ACUNMEDYA, a prominent media company both in Turkey and internationally.
          </p>
          <p>
            I have contributed to the production and live broadcasts of high-profile shows such as the UEFA Champions League final, Survivor, Exatlon, and Amor En El Aire. I'm passionate about delivering innovative and high-quality IT solutions tailored to the media and entertainment industry.
          </p>
        </div>
      </div>

      {/* Experience Section */}
      <div className={`group relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.03] hover:border-primary-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary-600 group-hover:animate-spin-slow" />
          <span className="group-hover:text-primary-600 transition-colors">{t(language, 'about.experience')}</span>
        </h2>
        <div className="relative space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="group relative border-l-4 border-primary-500 pl-6 transition-all duration-300 hover:border-primary-700 hover:pl-8 hover:shadow-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/10 rounded-r-lg p-2 -ml-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-600 rounded-full -translate-x-1/2 group-hover:scale-150 group-hover:animate-pulse transition-all"></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{exp.title} • {exp.company}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{exp.period}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{exp.description}</p>
              <ul className="space-y-2">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className={`group relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.03] hover:border-yellow-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-600 group-hover:animate-bounce group-hover:rotate-12 transition-transform" />
          <span className="group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{t(language, 'about.certifications')}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-primary-200 dark:border-gray-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:rotate-2 hover:border-yellow-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{cert.name}</h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className={`group relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.03] hover:border-blue-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary-600 group-hover:animate-bounce" />
          <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(language, 'about.skills')}</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="group relative px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium border border-primary-200 dark:border-primary-800 hover:bg-gradient-to-r hover:from-primary-100 hover:to-blue-100 dark:hover:from-primary-900/50 dark:hover:to-blue-900/50 transition-all duration-300 hover:scale-125 hover:-translate-y-2 hover:rotate-3 hover:shadow-xl cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-blue-400/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <span className="relative">{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className={`group relative bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] hover:border-green-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '450ms' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>

        <h2 className="relative text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary-600 group-hover:animate-bounce" />
          <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{t(language, 'about.contactForm')}</span>
        </h2>
        <p className="relative text-sm text-gray-600 dark:text-gray-400 mb-6 italic">
          {t(language, 'about.contactFormDesc')}
        </p>

        {formSubmitted && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800 dark:text-green-300 font-semibold">
              {t(language, 'about.messageSent')}
            </p>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="relative space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t(language, 'about.yourName')} *
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-primary-400"
                placeholder={t(language, 'about.yourNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t(language, 'about.yourEmail')} *
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-primary-400"
                placeholder={t(language, 'about.yourEmailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t(language, 'about.yourMessage')} *
            </label>
            <textarea
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-primary-400"
              placeholder={t(language, 'about.yourMessagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            className="w-full group relative px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {t(language, 'about.sendMessage')}
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
          </button>
        </form>
      </div>

      {/* CV Download */}
      <div className={`group relative bg-gradient-to-r from-primary-600 via-purple-600 to-primary-400 bg-[length:200%_auto] animate-gradient rounded-xl p-8 text-center text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        {/* Animated sparkles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl top-0 left-0 animate-float"></div>
          <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-3xl bottom-0 right-0 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <h2 className="relative text-2xl font-bold mb-4 group-hover:animate-bounce">{t(language, 'about.downloadResume')}</h2>
        <p className="relative mb-6 text-primary-50">{t(language, 'about.downloadCV')}</p>
        <a
          href="/Cemal-Demirci-CV.pdf"
          download
          className="relative inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-300 font-medium shadow-md hover:shadow-2xl hover:scale-125 hover:rotate-3 group-hover:animate-pulse"
        >
          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          {t(language, 'about.downloadCVButton')}
        </a>
      </div>
    </div>
  )
}

export default About
