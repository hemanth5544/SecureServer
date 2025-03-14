import React, { useState, useEffect } from 'react';
import { Shield, Lock, LogOut, Home, Bell, ChevronRight, Monitor, Globe, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ChangePasswordModal } from './ChangePasswordModal';
import { TwoFactorAuthModal } from './TwoFactorAuthModal';
import { useNavigate } from 'react-router-dom';
import EnableNotifications from './Notification';
interface SecuritySectionProps {
  user: any;
  logout: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ user, logout }) => {
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();


  const fetchActiveSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const response = await axios.post(
        'http://localhost:3000/api/activeSessions',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
          },
        }
      );
      setActiveSessions(response.data.activeSessions);
    } catch (error) {
      // Silent error handling
    }
  };

  const logoutAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');


      await axios.post(
        'http://localhost:3000/api/logoutAll',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
          },
        }
      );
      toast.success('Logged out from all devices');
      // logout();
      navigate('/login');
    } catch (error) {
      toast.error('No user logged in');
    }
  };

  const handleSessionLogout = async (sessionId: string) => {
    try {
      const currentSession = localStorage.getItem('sessionId');
      const token= localStorage.getItem('token')
      if (sessionId == currentSession) {
        logout();
        navigate('/login');
      } else {
        await axios.post(
          'http://localhost:3000/api/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-session-id': sessionId,
            },
          }
        );
        toast.success('Logged out from the device successfully');
        fetchActiveSessions();
      }
    } catch (error) {
      toast.error('Failed to log out from the device');
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

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
      <div className="bg-primary/10 p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h2>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {/* Security Options */}
          <div className="grid gap-3">
            {/* 2FA Card */}
            <div className="bg-background rounded-lg border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user?.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={user?.twoFactorEnabled ? disable2FA : enable2FA}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    user?.twoFactorEnabled 
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  } transition-colors`}
                >
                  {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Password Card */}
            <div className="bg-background rounded-lg border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                    <div className="mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Last changed: Recently
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-background rounded-lg border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get alerts for account activity</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      </span>
                    </div>
                  </div>
                </div>
                <EnableNotifications />
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-foreground flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-primary" />
                Active Devices
              </h3>
              <button
                onClick={logoutAll}
                className="px-3 py-1 rounded-md text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout All
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {activeSessions.map((session) => {
                const isCurrentSession = session.sessionId == localStorage.getItem('sessionId');
                return (
                  <div key={session.id} className="bg-background rounded-lg border p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium">{session.browser_info}</p>
                          {isCurrentSession && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <p>{session.ip_address}</p>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <p>Last active: Recent</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSessionLogout(session.sessionId)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isEnabling2FA && (
        <TwoFactorAuthModal
          qrCode={qrCode}
          token={token}
          setToken={setToken}
          verify2FA={verify2FA}
          onClose={() => setIsEnabling2FA(false)}
        />
      )}

      {isChangePasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} />
      )}
    </div>
  );
};