import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, LogOut, Shield, User } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
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
                onClick={logout}
                className="text-muted-foreground hover:text-card-foreground p-2 rounded-md hover:bg-accent transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                      {user?.profileImage ? (
                        <img
                          src={`http://localhost:3000${user.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">
                      {user?.name || 'Welcome!'}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">Security Status</h2>
                    <p className="text-muted-foreground">
                      2FA is {user?.twoFactorEnabled ? 'enabled' : 'disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}