import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Tools from './pages/Tools'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import ZeroDensity from './pages/ZeroDensity'
import ZeroDensityAuth from './components/ZeroDensityAuth'

// Zero Density Tools
import Evo2EventAnalyzer from './tools/zerodensity/Evo2EventAnalyzer'
import Evo3EventAnalyzer from './tools/zerodensity/Evo3EventAnalyzer'
import AmperEventAnalyzer from './tools/zerodensity/AmperEventAnalyzer'
import HardwareSupportChat from './tools/zerodensity/HardwareSupportChat'

// Code Tools
import JsonFormatter from './tools/code/JsonFormatter'
import Base64Tool from './tools/code/Base64Tool'
import RegexTester from './tools/code/RegexTester'
import CodeMinifier from './tools/code/CodeMinifier'
import CssViewer from './tools/code/CssViewer'
import HtmlViewer from './tools/code/HtmlViewer'

// PDF Tools
import PdfMerger from './tools/pdf/PdfMerger'
import PdfToImage from './tools/pdf/PdfToImage'
import ImageToPdf from './tools/pdf/ImageToPdf'
import PdfOcr from './tools/pdf/PdfOcr'

// Security Tools
import PasswordGenerator from './tools/security/PasswordGenerator'
import HashGenerator from './tools/security/HashGenerator'
import Encryption from './tools/security/Encryption'
import PasswordStrength from './tools/security/PasswordStrength'

// Text Tools
import MarkdownEditor from './tools/text/MarkdownEditor'
import WordCounter from './tools/text/WordCounter'
import TextDiff from './tools/text/TextDiff'
import CaseConverter from './tools/text/CaseConverter'
import TextAnalyzer from './tools/text/TextAnalyzer'

// Design Tools
import ColorPicker from './tools/design/ColorPicker'
import GradientGenerator from './tools/design/GradientGenerator'
import CssGenerator from './tools/design/CssGenerator'

// Network Tools
import UrlEncoder from './tools/network/UrlEncoder'
import IpLookup from './tools/network/IpLookup'
import DnsLookup from './tools/network/DnsLookup'
import WhoisLookup from './tools/network/WhoisLookup'
import SpeedTest from './tools/network/SpeedTest'
import NetworkDiagnostics from './tools/network/NetworkDiagnostics'
import MacLookup from './tools/network/MacLookup'
import SecurityHeaders from './tools/network/SecurityHeaders'
import PortInfo from './tools/network/PortInfo'
import EmailHeaderAnalyzer from './tools/network/EmailHeaderAnalyzer'
import EmailDnsChecker from './tools/network/EmailDnsChecker'
import ServiceStatusMonitor from './tools/network/ServiceStatusMonitor'

// Utility Tools
import QrGenerator from './tools/utility/QrGenerator'
import TimestampConverter from './tools/utility/TimestampConverter'
import UuidGenerator from './tools/utility/UuidGenerator'

// Windows Tools
import GuidGenerator from './tools/windows/GuidGenerator'
import PowerManagement from './tools/windows/PowerManagement'
import BloatwareRemover from './tools/windows/BloatwareRemover'
import GamingOptimizer from './tools/windows/GamingOptimizer'

// Advanced Tools
import JwtDecoder from './tools/advanced/JwtDecoder'
import SubnetCalculator from './tools/advanced/SubnetCalculator'
import BinaryConverter from './tools/advanced/BinaryConverter'

// Data Tools
import YamlJsonConverter from './tools/data/YamlJsonConverter'

// SysAdmin Tools
import CronGenerator from './tools/sysadmin/CronGenerator'

// Active Directory Tools
import ADUserBulkCreator from './tools/activedirectory/ADUserBulkCreator'
import ADPasswordReset from './tools/activedirectory/ADPasswordReset'
import ADGroupManager from './tools/activedirectory/ADGroupManager'

// Advanced Network Tools
import NetworkReset from './tools/network/NetworkReset'
import FirewallRuleGenerator from './tools/network/FirewallRuleGenerator'
import HostsFileManager from './tools/network/HostsFileManager'

// AI-Powered Tools
import PowerShellAnalyzer from './tools/ai/PowerShellAnalyzer'
import LogAnalyzer from './tools/ai/LogAnalyzer'
import SecurityAdvisor from './tools/ai/SecurityAdvisor'
import NetworkTroubleshooter from './tools/ai/NetworkTroubleshooter'
import GpoAnalyzer from './tools/ai/GpoAnalyzer'
import ScriptGenerator from './tools/ai/ScriptGenerator'
import EventCorrelator from './tools/ai/EventCorrelator'
import CertAnalyzer from './tools/ai/CertAnalyzer'
import DrPlanner from './tools/ai/DrPlanner'
import PerfTroubleshooter from './tools/ai/PerfTroubleshooter'
import ProxmoxAssistant from './tools/ai/ProxmoxAssistant'
import ProxmoxTroubleshooter from './tools/ai/ProxmoxTroubleshooter'

// macOS Tools
import MacOsAssistant from './tools/macos/MacOsAssistant'

// Junior IT Pages
import JuniorIT from './pages/JuniorIT'
import ITGlossary from './pages/ITGlossary'

// File Share
import FileShare from './pages/FileShare'
import FileDownload from './pages/FileDownload'

// Remote Desktop
import RemoteDesktop from './pages/RemoteDesktop'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/0d" element={<ZeroDensityAuth><ZeroDensity /></ZeroDensityAuth>} />

          {/* Junior IT Pages */}
          <Route path="/junior-it" element={<JuniorIT />} />
          <Route path="/junior-it/glossary" element={<ITGlossary />} />

          {/* File Share */}
          <Route path="/fileshare" element={<FileShare />} />
          <Route path="/share/:fileId" element={<FileDownload />} />

          {/* Remote Desktop */}
          <Route path="/remote-desktop" element={<RemoteDesktop />} />
          <Route path="/remote/:sessionId" element={<RemoteDesktop />} />

          {/* Zero Density Tools */}
          <Route path="/0d/evo2-events" element={<Evo2EventAnalyzer />} />
          <Route path="/0d/evo3-events" element={<Evo3EventAnalyzer />} />
          <Route path="/0d/amper-events" element={<AmperEventAnalyzer />} />
          <Route path="/0d/hardware-support" element={<HardwareSupportChat />} />

          {/* Code Tools */}
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/base64" element={<Base64Tool />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/code-minifier" element={<CodeMinifier />} />
          <Route path="/tools/css-viewer" element={<CssViewer />} />
          <Route path="/tools/html-viewer" element={<HtmlViewer />} />

          {/* PDF Tools */}
          <Route path="/tools/pdf-merger" element={<PdfMerger />} />
          <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
          <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/tools/pdf-ocr" element={<PdfOcr />} />

          {/* Security Tools */}
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/encryption" element={<Encryption />} />
          <Route path="/tools/password-strength" element={<PasswordStrength />} />

          {/* Text Tools */}
          <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
          <Route path="/tools/word-counter" element={<WordCounter />} />
          <Route path="/tools/text-diff" element={<TextDiff />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/text-analyzer" element={<TextAnalyzer />} />

          {/* Design Tools */}
          <Route path="/tools/color-picker" element={<ColorPicker />} />
          <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
          <Route path="/tools/css-generator" element={<CssGenerator />} />

          {/* Network Tools */}
          <Route path="/tools/url-encoder" element={<UrlEncoder />} />
          <Route path="/tools/ip-lookup" element={<IpLookup />} />
          <Route path="/tools/dns-lookup" element={<DnsLookup />} />
          <Route path="/tools/whois-lookup" element={<WhoisLookup />} />
          <Route path="/tools/speed-test" element={<SpeedTest />} />
          <Route path="/tools/network-diagnostics" element={<NetworkDiagnostics />} />
          <Route path="/tools/mac-lookup" element={<MacLookup />} />
          <Route path="/tools/security-headers" element={<SecurityHeaders />} />
          <Route path="/tools/port-info" element={<PortInfo />} />
          <Route path="/tools/email-headers" element={<EmailHeaderAnalyzer />} />
          <Route path="/tools/email-dns-checker" element={<EmailDnsChecker />} />
          <Route path="/tools/service-status-monitor" element={<ServiceStatusMonitor />} />

          {/* Utility Tools */}
          <Route path="/tools/qr-generator" element={<QrGenerator />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />

          {/* Windows Tools */}
          <Route path="/tools/guid-generator" element={<GuidGenerator />} />
          <Route path="/tools/power-management" element={<PowerManagement />} />
          <Route path="/tools/bloatware-remover" element={<BloatwareRemover />} />
          <Route path="/tools/gaming-optimizer" element={<GamingOptimizer />} />

          {/* Advanced Tools */}
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/subnet-calculator" element={<SubnetCalculator />} />
          <Route path="/tools/binary-converter" element={<BinaryConverter />} />

          {/* Data Tools */}
          <Route path="/tools/yaml-json-converter" element={<YamlJsonConverter />} />

          {/* SysAdmin Tools */}
          <Route path="/tools/cron-generator" element={<CronGenerator />} />

          {/* Active Directory Tools */}
          <Route path="/tools/ad-user-bulk-creator" element={<ADUserBulkCreator />} />
          <Route path="/tools/ad-password-reset" element={<ADPasswordReset />} />
          <Route path="/tools/ad-group-manager" element={<ADGroupManager />} />

          {/* Advanced Network Tools */}
          <Route path="/tools/network-reset" element={<NetworkReset />} />
          <Route path="/tools/firewall-rules" element={<FirewallRuleGenerator />} />
          <Route path="/tools/hosts-manager" element={<HostsFileManager />} />

          {/* AI-Powered Tools */}
          <Route path="/tools/ai-powershell-analyzer" element={<PowerShellAnalyzer />} />
          <Route path="/tools/ai-log-analyzer" element={<LogAnalyzer />} />
          <Route path="/tools/ai-security-advisor" element={<SecurityAdvisor />} />
          <Route path="/tools/ai-network-troubleshooter" element={<NetworkTroubleshooter />} />
          <Route path="/tools/ai-gpo-analyzer" element={<GpoAnalyzer />} />
          <Route path="/tools/ai-script-generator" element={<ScriptGenerator />} />
          <Route path="/tools/ai-event-correlator" element={<EventCorrelator />} />
          <Route path="/tools/ai-cert-analyzer" element={<CertAnalyzer />} />
          <Route path="/tools/ai-dr-planner" element={<DrPlanner />} />
          <Route path="/tools/ai-perf-troubleshooter" element={<PerfTroubleshooter />} />
          <Route path="/tools/proxmox-assistant" element={<ProxmoxAssistant />} />
          <Route path="/tools/proxmox-troubleshooter" element={<ProxmoxTroubleshooter />} />

          {/* macOS Tools */}
          <Route path="/tools/macos-assistant" element={<MacOsAssistant />} />
        </Routes>
      </Layout>
    </Router>
    </LanguageProvider>
  )
}

export default App
