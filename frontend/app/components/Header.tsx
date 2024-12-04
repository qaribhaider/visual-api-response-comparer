import { FaGithub } from 'react-icons/fa';

export function Header() {
  return (
    <header className="border-b border-slate-300 mb-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-700">
              API Response Comparer
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/qaribhaider/visual-api-response-comparer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="View source on GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
