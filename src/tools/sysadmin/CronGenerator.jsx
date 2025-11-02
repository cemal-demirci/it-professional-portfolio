import { useState } from 'react'

const CronGenerator = () => {
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')

  const expression = `${minute} ${hour} ${day} ${month} ${weekday}`

  const examples = [
    { expr: '* * * * *', desc: 'Every minute' },
    { expr: '0 * * * *', desc: 'Every hour' },
    { expr: '0 0 * * *', desc: 'Every day at midnight' },
    { expr: '0 0 * * 0', desc: 'Every Sunday at midnight' },
    { expr: '*/5 * * * *', desc: 'Every 5 minutes' }
  ]

  const loadExample = (expr) => {
    const parts = expr.split(' ')
    setMinute(parts[0])
    setHour(parts[1])
    setDay(parts[2])
    setMonth(parts[3])
    setWeekday(parts[4])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cron Expression Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate cron job expressions</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Minute', value: minute, set: setMinute },
            { label: 'Hour', value: hour, set: setHour },
            { label: 'Day', value: day, set: setDay },
            { label: 'Month', value: month, set: setMonth },
            { label: 'Weekday', value: weekday, set: setWeekday }
          ].map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
              <input type="text" value={field.value} onChange={(e) => field.set(e.target.value)} className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-center" />
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-900 dark:bg-black rounded-lg text-center">
          <code className="text-2xl text-green-400 font-mono">{expression}</code>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Examples</h3>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <button key={i} onClick={() => loadExample(ex.expr)} className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <code className="font-mono text-sm text-primary-600 dark:text-primary-400">{ex.expr}</code>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CronGenerator
