import { useState } from 'react'
import { Users, Download, Copy, Check } from 'lucide-react'

const ADGroupManager = () => {
  const [action, setAction] = useState('add') // add, remove, create
  const [groupName, setGroupName] = useState('')
  const [users, setUsers] = useState([''])
  const [groupSettings, setGroupSettings] = useState({
    scope: 'Global',
    category: 'Security',
    description: '',
    ou: 'CN=Users,DC=domain,DC=com'
  })
  const [copied, setCopied] = useState(false)

  const generateScript = () => {
    if (action === 'create') {
      return `# Create AD Group
Import-Module ActiveDirectory

$groupName = "${groupName}"
$description = "${groupSettings.description}"
$scope = "${groupSettings.scope}"
$category = "${groupSettings.category}"
$ou = "${groupSettings.ou}"

try {
    New-ADGroup -Name $groupName \\
        -GroupScope $scope \\
        -GroupCategory $category \\
        -Description $description \\
        -Path $ou
    Write-Host "✓ Group created: $groupName" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}
pause`
    }

    const validUsers = users.filter(u => u.trim())
    const actionCmd = action === 'add' ? 'Add-ADGroupMember' : 'Remove-ADGroupMember'
    const actionText = action === 'add' ? 'Adding users to' : 'Removing users from'

    return `# ${actionText} AD Group
Import-Module ActiveDirectory

$groupName = "${groupName}"
$users = @(${validUsers.map(u => `"${u}"`).join(', ')})

Write-Host "${actionText} group: $groupName" -ForegroundColor Green

foreach ($username in $users) {
    try {
        ${actionCmd} -Identity $groupName -Members $username
        Write-Host "✓ ${action === 'add' ? 'Added' : 'Removed'}: $username" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed for $username: $_" -ForegroundColor Red
    }
}

Write-Host "Operation completed!" -ForegroundColor Cyan
pause`
  }

  const copyScript = () => {
    navigator.clipboard.writeText(generateScript())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Users className="w-8 h-8" />
          AD Group Manager
        </h1>
        <p className="text-gray-400">Manage Active Directory groups and memberships</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="flex gap-2">
          {['add', 'remove', 'create'].map(act => (
            <button
              key={act}
              onClick={() => setAction(act)}
              className={`px-4 py-2 rounded-lg font-medium ${action === act ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              {act === 'add' ? 'Add Users' : act === 'remove' ? 'Remove Users' : 'Create Group'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Domain Admins"
              className="input-field bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {action === 'create' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scope</label>
                  <select
                    value={groupSettings.scope}
                    onChange={(e) => setGroupSettings({...groupSettings, scope: e.target.value})}
                    className="input-field bg-gray-700 border-gray-600 text-white"
                  >
                    <option>Global</option>
                    <option>Universal</option>
                    <option>DomainLocal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={groupSettings.category}
                    onChange={(e) => setGroupSettings({...groupSettings, category: e.target.value})}
                    className="input-field bg-gray-700 border-gray-600 text-white"
                  >
                    <option>Security</option>
                    <option>Distribution</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={groupSettings.description}
                  onChange={(e) => setGroupSettings({...groupSettings, description: e.target.value})}
                  className="input-field bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </>
          )}

          {action !== 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Users (one per line)</label>
              <textarea
                value={users.join('\n')}
                onChange={(e) => setUsers(e.target.value.split('\n'))}
                placeholder="jdoe&#10;jsmith&#10;awhite"
                className="textarea-field min-h-[150px] bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={copyScript} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy Script'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ADGroupManager
