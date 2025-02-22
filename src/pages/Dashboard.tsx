import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  LogOut,
  Shield,
  User,
  Clock,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const { user, lastActivity, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
      toast.success("Logged out from the device successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-card-foreground">
                Dashboard
              </h1>
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
                      {user?.name || "Welcome!"}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
              <div className="p-6">
                {/* Security Status Section */}
                <div className="flex items-start space-x-4">
                  {/* Shield Icon */}
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  {/* Security Status Content */}
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">
                      Security Status
                    </h2>
                    <p className="text-muted-foreground">
                      2FA is {user?.twoFactorEnabled ? "enabled" : "disabled"}
                    </p>
                  </div>
                </div>

                {/* Last Activity Section */}
                <div className="mt-4 flex items-start space-x-4">
                  {/* Clock Icon */}
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  {/* Last Activity Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Last Activity
                    </h3>
                    <p className="text-muted-foreground">
                      {lastActivity ? (
                        <>
                          <strong>Browser Info:</strong>{" "}
                          {lastActivity.browser_info} <br />
                          <strong>Status:</strong> {lastActivity.status}<br/>
                          <strong>Ip:</strong>{lastActivity.ip_address}
                        </>
                      ) : (
                        "No activity found"
                      )}
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