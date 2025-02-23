import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowLeft, Camera, User, Loader2, X } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut} from 'lucide-react';
import { Home } from 'lucide-react';
//FIXME: add a location feature by hitting ipai 
export default function Settings() {
  const navigate = useNavigate();
  const { user ,logout} = useAuth();
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchActiveSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const sessionId = localStorage.getItem("sessionId");

      const response = await axios.post(
        "http://localhost:3000/api/activeSessions",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
        }
      );
      setActiveSessions(response.data.activeSessions);
    } catch (error) {
      // toast.error("Failed to fetch active sessions");
    }
  };

  const logoutAll = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/api/logoutAll",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Logged out from all devices");
      navigate('/login')
      fetchActiveSessions();
    } catch (error) {
      toast.error("No user logged in");
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const handleSessionLogout = async (sessionId: string) => {
    try {
      const currentSession = localStorage.getItem('sessionId');
      console.log(currentSession,sessionId,"afteeeeeee");
      
      if (sessionId == currentSession) {
        logout();
        navigate('/login');
      }

      await axios.post(
        `http://localhost:3000/api/logout/`,
        { sessionId }
      );

      toast.success("Logged out from the device successfully");
      fetchActiveSessions();
    } catch (error) {
      toast.error("Failed to log out from the device");
    }
  };

  const enable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const response = await axios.post(
        'http://localhost:3000/api/2fa/enable',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
          },
        }
      );
      setQrCode(response.data.qrCode);
      setIsEnabling2FA(true);
    } catch (error) {
      toast.error('Failed to enable 2FA');
    }
  };

  const verify2FA = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      await axios.post(
        'http://localhost:3000/api/2fa/verify',
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'x-session-id': sessionId,
          },
        }
      );
      toast.success('2FA enabled successfully');
      setIsEnabling2FA(false);
      window.location.reload();
    } catch (error) {
      toast.error('Invalid token');
    }
  };

  const disable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      await axios.post(
        'http://localhost:3000/api/2fa/disable',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
          },
        }
      );
      toast.success('2FA disabled successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to disable 2FA');
    }
  };

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const formData = new FormData();
      if (name) {
        formData.append('name', name);
      }
      if (fileInputRef.current?.files?.[0]) {
        formData.append('profileImage', fileInputRef.current.files[0]);
      }

      await axios.post(
        'http://localhost:3000/api/user/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
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
                onClick={logout}
                className="text-muted-foreground hover:text-card-foreground p-2 rounded-md hover:bg-accent transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
            <div className="p-6">
              <h2 className="text-lg font-medium text-card-foreground mb-4">
                Profile Settings
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                      {user?.profileImage ? (
                        <img
                          src={`http://localhost:3000${user.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
                    placeholder="Enter your name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
            <div className="p-6">
              <h2 className="text-lg font-medium text-card-foreground mb-4">
                Security Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-card-foreground">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={user?.twoFactorEnabled ? disable2FA : enable2FA}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground ${
                      user?.twoFactorEnabled
                        ? "bg-destructive hover:bg-destructive/90"
                        : "bg-primary hover:bg-primary/90"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    {user?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>

                {/* Active Devices Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    {/* Active Devices Heading */}
                    <h3 className="text-md font-medium text-card-foreground">
                      Active Devices
                    </h3>

                    {/* Logout All Button */}
                    <button
                      onClick={logoutAll}
                      className="w-25 h-8 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> {/* Logout icon */}
                      Logout All
                    </button>
                  </div>

                  {/* Active Sessions List */}
                  <div className="space-y-4 mt-4">
                    {activeSessions.map((session) => {
                      const isCurrentSession =
                        session.id == localStorage.getItem("sessionId");
                      return (
                        <div
                          key={session.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            
                            <div className="text-sm text-muted-foreground">
                              <p>{session.browser_info}</p>
                              <p>{session.ip_address}</p>
                            </div>
                            {isCurrentSession && (
                              <Home className="h-4 w-4 text-primary" /> // Home icon for the current session
                            )}
                          </div>
                          {/* Log Out Button */}
                          <button
                            onClick={() => handleSessionLogout(session.id)}
                            className="w-25 h-9 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <LogOut className="h-4 w-4 mr-2" />{" "}
                            {/* Logout icon */}
                            Log Out
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {isEnabling2FA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-card-foreground">
                Enable Two-Factor Authentication
              </h2>
              <button
                onClick={() => setIsEnabling2FA(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Scan this QR code with your authenticator app:
                </p>
                <img src={qrCode} alt="2FA QR Code" className="mb-4" />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Enter verification code:
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
                  />
                </div>
              </div>

              <button
                onClick={verify2FA}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Verify and Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}