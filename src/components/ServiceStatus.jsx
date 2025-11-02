import { useState, useEffect, useRef } from 'react'
import { Activity, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'

const ServiceStatus = () => {
  const intervalRef = useRef(null)
  const [services, setServices] = useState([
    {
      name: 'Microsoft Azure',
      status: 'loading',
      url: 'https://azure.status.microsoft',
      icon: '☁️',
      color: 'blue'
    },
    {
      name: 'Office 365',
      status: 'loading',
      url: 'https://status.office.com',
      icon: '📧',
      color: 'orange'
    },
    {
      name: 'Cloudflare',
      status: 'loading',
      url: 'https://www.cloudflarestatus.com',
      icon: '🔶',
      color: 'amber'
    },
    {
      name: 'GitHub',
      status: 'loading',
      url: 'https://www.githubstatus.com',
      icon: '🐙',
      color: 'gray'
    },
    {
      name: 'Google Cloud',
      status: 'loading',
      url: 'https://status.cloud.google.com',
      icon: '🌐',
      color: 'green'
    },
    {
      name: 'AWS',
      status: 'loading',
      url: 'https://health.aws.amazon.com',
      icon: '📦',
      color: 'yellow'
    }
  ])

  useEffect(() => {
    // Simulate status check (in production, this would call real APIs)
    const checkStatuses = async () => {
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          try {
            // Simulate API call with random delay
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000))

            // Simulate random status (90% operational, 5% degraded, 5% down)
            const random = Math.random()
            let status = 'operational'
            if (random > 0.95) status = 'down'
            else if (random > 0.90) status = 'degraded'

            return { ...service, status }
          } catch (error) {
            return { ...service, status: 'unknown' }
          }
        })
      )
      setServices(updatedServices)

      // Check if all services are operational
      const allOperational = updatedServices.every(s => s.status === 'operational')

      // If all operational, stop auto-refresh
      if (allOperational && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      // If not all operational and no interval running, start auto-refresh
      else if (!allOperational && !intervalRef.current) {
        intervalRef.current = setInterval(checkStatuses, 15000) // 15 seconds
      }
    }

    checkStatuses()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'down':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'loading':
        return <Clock className="w-5 h-5 text-gray-400 animate-spin" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return { text: 'Operational', color: 'text-green-600 dark:text-green-400' }
      case 'degraded':
        return { text: 'Degraded', color: 'text-yellow-600 dark:text-yellow-400' }
      case 'down':
        return { text: 'Down', color: 'text-red-600 dark:text-red-400' }
      case 'loading':
        return { text: 'Checking...', color: 'text-gray-400' }
      default:
        return { text: 'Unknown', color: 'text-gray-400' }
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
      case 'degraded':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
      case 'down':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
    }
  }

  const operationalCount = services.filter(s => s.status === 'operational').length
  const totalServices = services.length

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-blue-200 dark:border-gray-700 shadow-md">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Service Status
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {operationalCount}/{totalServices} Operational
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {services.map((service, index) => {
          const statusInfo = getStatusText(service.status)
          return (
            <a
              key={index}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${getStatusBadgeColor(service.status)} border rounded-md p-2 hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{service.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-gray-900 dark:text-white truncate group-hover:underline">
                    {service.name}
                  </div>
                  <div className={`text-xs font-medium ${statusInfo.color} flex items-center gap-0.5`}>
                    {getStatusIcon(service.status)}
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Footer - Compact */}
      <div className="mt-3 pt-2 border-t border-blue-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {operationalCount === totalServices
            ? 'All services operational'
            : 'Auto-refreshes every 15s when issues detected'}
        </p>
      </div>
    </div>
  )
}

export default ServiceStatus
