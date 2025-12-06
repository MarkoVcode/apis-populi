import { StorageStatus } from '@/components/StorageStatus';

const apis = [
  {
    name: 'Flights',
    path: '/api/flights',
    icon: '✈️',
    description: 'Aviation API with airports, airlines, flights, and bookings. Features async booking confirmation with polling pattern.',
    auth: ['JWT Bearer', 'OAuth2'],
    endpoints: 15,
    color: 'from-blue-500 to-cyan-500',
    features: ['Real IATA codes', 'Async booking', 'OAuth2 flow'],
    example: `curl -X POST /api/flights/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"username":"demo","password":"demo123"}'`,
  },
  {
    name: 'Books',
    path: '/api/books',
    icon: '📚',
    description: 'Library API with classic literature, authors, publishers, and reviews. Search across the entire catalog.',
    auth: ['API Key'],
    endpoints: 14,
    color: 'from-amber-500 to-orange-500',
    features: ['200+ books', 'Full-text search', 'Reviews'],
    example: `curl /api/books/books \\
  -H "X-API-Key: test-api-key-1"`,
  },
  {
    name: 'Warehouse',
    path: '/api/warehouse',
    icon: '📦',
    description: 'Inventory management with polymorphic items (electronics, furniture, clothing, food, tools). Webhook-based async orders.',
    auth: ['Basic Auth', 'Custom Header'],
    endpoints: 12,
    color: 'from-emerald-500 to-teal-500',
    features: ['Polymorphic items', 'Webhook async', 'Inventory tracking'],
    example: `curl /api/warehouse/items \\
  -u warehouse_user:warehouse_pass`,
  },
  {
    name: 'School',
    path: '/api/school',
    icon: '🎓',
    description: 'Education management with students, teachers, classes, grades, and attendance. Session-based authentication.',
    auth: ['Session Cookie', 'API Key'],
    endpoints: 18,
    color: 'from-purple-500 to-pink-500',
    features: ['GPA reports', 'Attendance tracking', 'Grade management'],
    example: `curl -X POST /api/school/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"school123"}' \\
  -c cookies.txt`,
  },
  {
    name: 'Space',
    path: '/api/space',
    icon: '🚀',
    description: 'Cosmic database with planets, stars, galaxies, constellations, space missions, and astronauts.',
    auth: ['JWT Bearer', 'Basic Auth'],
    endpoints: 16,
    color: 'from-indigo-500 to-violet-500',
    features: ['Real astronomical data', 'Distance calculator', 'Celestial events'],
    example: `curl /api/space/planets \\
  -u space_user:space_pass`,
  },
];

const features = [
  {
    title: 'Multiple Auth Methods',
    description: 'JWT, OAuth2, API Key, Basic Auth, Session Cookies, and Custom Headers',
    icon: '🔐',
  },
  {
    title: 'Real-World Data',
    description: 'Authentic data: real airports, classic books, actual planets and stars',
    icon: '🌍',
  },
  {
    title: 'Async Processing',
    description: 'Learn async patterns with polling (Flights) and webhooks (Warehouse)',
    icon: '⏳',
  },
  {
    title: 'OpenAPI Specs',
    description: 'Complete OpenAPI 3.0 documentation for every API endpoint',
    icon: '📋',
  },
  {
    title: 'Rate Limiting',
    description: 'Built-in rate limits with standard X-RateLimit headers',
    icon: '🚦',
  },
  {
    title: 'Pagination & Filtering',
    description: 'Consistent pagination, sorting, and powerful filtering options',
    icon: '🔍',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              APIs Populi
            </h1>
            <p className="mt-4 text-2xl text-gray-300">
              REST APIs for Everyone
            </p>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
              A collection of 5 fully-featured RESTful APIs for testing, learning, and development.
              Real-world data, multiple authentication methods, and comprehensive documentation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="https://github.com/MarkoVcode/apis-populi"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
              >
                View on GitHub
              </a>
              <a
                href="#apis"
                className="rounded-full border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
              >
                Explore APIs
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Start Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">$</span> cURL
              </h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`curl /api/books/books \\
  -H "X-API-Key: test-api-key-1"`}</code>
              </pre>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">JS</span> JavaScript
              </h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`const res = await fetch('/api/books/books', {
  headers: { 'X-API-Key': 'test-api-key-1' }
});
const data = await res.json();`}</code>
              </pre>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">PY</span> Python
              </h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`import requests

res = requests.get('/api/books/books',
  headers={'X-API-Key': 'test-api-key-1'})
data = res.json()`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* APIs Section */}
      <section id="apis" className="py-16 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Available APIs</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Each API is fully documented with OpenAPI specs. Use <code className="text-blue-400">GET /api/&#123;name&#125;/openapi.yaml</code> to get the spec,
            or <code className="text-blue-400">POST /api/&#123;name&#125;/reset</code> to restore default data.
          </p>
          <div className="grid gap-8 lg:grid-cols-2">
            {apis.map((api) => (
              <div
                key={api.name}
                className="group relative bg-gray-800/30 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{api.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{api.name}</h3>
                      <code className="text-sm text-gray-400">{api.path}</code>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{api.endpoints} endpoints</span>
                </div>
                <p className="text-gray-300 mb-4">{api.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {api.auth.map((auth) => (
                    <span
                      key={auth}
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${api.color} text-white`}
                    >
                      {auth}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {api.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 rounded bg-gray-700/50 text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Try it:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{api.example}</code>
                  </pre>
                </div>
                <div className="mt-4 flex gap-4">
                  <a
                    href={`${api.path}/openapi.yaml`}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    OpenAPI Spec &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Reference */}
      <section className="py-16 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Authentication Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-4 text-gray-400 font-medium">API</th>
                  <th className="py-4 px-4 text-gray-400 font-medium">Primary Auth</th>
                  <th className="py-4 px-4 text-gray-400 font-medium">Secondary Auth</th>
                  <th className="py-4 px-4 text-gray-400 font-medium">Demo Credentials</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 font-medium">Flights</td>
                  <td className="py-4 px-4 text-gray-300">JWT Bearer</td>
                  <td className="py-4 px-4 text-gray-300">OAuth2</td>
                  <td className="py-4 px-4 text-gray-400">
                    <code>demo / demo123</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 font-medium">Books</td>
                  <td className="py-4 px-4 text-gray-300">API Key (header)</td>
                  <td className="py-4 px-4 text-gray-300">API Key (query)</td>
                  <td className="py-4 px-4 text-gray-400">
                    <code>test-api-key-1</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 font-medium">Warehouse</td>
                  <td className="py-4 px-4 text-gray-300">Basic Auth</td>
                  <td className="py-4 px-4 text-gray-300">X-Warehouse-Token</td>
                  <td className="py-4 px-4 text-gray-400">
                    <code>warehouse_user / warehouse_pass</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 font-medium">School</td>
                  <td className="py-4 px-4 text-gray-300">Session Cookie</td>
                  <td className="py-4 px-4 text-gray-300">API Key</td>
                  <td className="py-4 px-4 text-gray-400">
                    <code>admin / school123</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 font-medium">Space</td>
                  <td className="py-4 px-4 text-gray-300">JWT Bearer</td>
                  <td className="py-4 px-4 text-gray-300">Basic Auth</td>
                  <td className="py-4 px-4 text-gray-400">
                    <code>space_user / space_pass</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                APIs Populi
              </p>
              <p className="text-sm text-gray-500 mt-1">REST APIs for Everyone</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a
                href="https://github.com/MarkoVcode/apis-populi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/MarkoVcode/apis-populi/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                MIT License
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-xs text-gray-600">
              Made with care for developers, testers, and learners everywhere.
            </p>
            <StorageStatus />
          </div>
        </div>
      </footer>
    </div>
  );
}
