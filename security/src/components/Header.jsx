import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="px-0 pt-3 pb-0">
        {/* Logo horizontal */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-purple-600">SECURITY</div>
            <div className="text-sm text-purple-500 font-bold">REPORT</div>
          </div>
        </div>

        {/* Tab navigation below logo */}
        <div className="mt-4 border-b border-gray-200">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center pb-2 transition-all duration-200 ${
                  isActive(item.path) ? 'text-black font-semibold' : 'text-gray-600'
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <div
                  className={`mt-1 h-1 w-6 rounded-full ${
                    isActive(item.path) ? 'bg-purple-600' : 'bg-transparent'
                  }`}
                ></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
