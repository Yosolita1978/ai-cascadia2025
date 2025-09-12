import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  
  const sessions = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/session-1', label: 'Session 1: Code Review', icon: '🔍' },
    { path: '/session-2', label: 'Session 2: Chat', icon: '💬' },
    { path: '/session-3', label: 'Session 3: Agent', icon: '🤖' },
    { path: '/session-4', label: 'Session 4: Advanced', icon: '🧠' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold">DevMate Workshop</span>
          </div>
          
          <div className="flex space-x-1 text-sm">
            {sessions.map((session) => (
              <Link
                key={session.path}
                href={session.path}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  pathname === session.path
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{session.icon}</span>
                <span className="hidden sm:inline">{session.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}