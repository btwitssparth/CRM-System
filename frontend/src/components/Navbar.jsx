import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Ticket, User, Plus } from 'lucide-react'; // <-- Imported Plus icon
import { Button } from './ui/Button'; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              DataStraw
            </span>
          </Link>

          {/* User Profile & Actions Section */}
          {user && (
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* NEW: Create Ticket Button */}
              <Link to="/create">
                <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Ticket</span>
                </Button>
              </Link>
              
              {/* Divider (Optional, looks nice) */}
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full mt-0.5">
                    {user.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
              
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}