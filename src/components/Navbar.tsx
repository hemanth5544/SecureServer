import { Link, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";


export const Navbar = () => {
   const { user, lastActivity, logout } = useAuth();
    const navigate = useNavigate(); 
  

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
    toast.success("Logged out from the device successfully!!")
  };

  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-card-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/settings"
              className="text-muted-foreground hover:text-card-foreground p-2 rounded-md hover:bg-accent transition-colors duration-200"
            >
              <SettingsIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-card-foreground p-2 rounded-md hover:bg-accent transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};