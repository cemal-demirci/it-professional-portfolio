import { useState } from 'react'
import * as yaml from 'js-yaml'

const YamlJsonConverter = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('yamlToJson')

  const convert = () => {
    try {
      if (mode === 'yamlToJson') {
        const obj = yaml.load(input)
        setOutput(JSON.stringify(obj, null, 2))
      } else {
        const obj = JSON.parse(input)
        setOutput(yaml.dump(obj))
      }
    } catch (err) {
      setOutput('Error: ' + err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">YAML ⇄ JSON Converter</h1>
        <p className="text-gray-400">Convert between YAML and JSON formats</p>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => setMode('yamlToJson')} className={mode === 'yamlToJson' ? 'btn-primary' : 'btn-secondary'}>YAML → JSON</button>
        <button onClick={() => setMode('jsonToYaml')} className={mode === 'jsonToYaml' ? 'btn-primary' : 'btn-secondary'}>JSON → YAML</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Input ({mode === 'yamlToJson' ? 'YAML' : 'JSON'})</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="textarea-field bg-gray-700 border-gray-600 text-white" />
          <button onClick={convert} className="btn-primary w-full">Convert</button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Output ({mode === 'yamlToJson' ? 'JSON' : 'YAML'})</label>
          <textarea value={output} readOnly className="textarea-field bg-gray-900 border-gray-600 text-white" />
        </div>
      </div>
    </div>
  )
}

export default YamlJsonConverter
