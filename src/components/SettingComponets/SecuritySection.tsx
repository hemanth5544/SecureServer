import React, { useState, useEffect } from 'react';
import { Shield, Lock, LogOut, Home } from 'lucide-react';
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
    //   toast.error('Failed to fetch active sessions');
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
      } else{

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
      // fetchActiveSessions();
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
      <div className="p-6">
        <h2 className="text-lg font-medium text-card-foreground mb-4">Security Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-card-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={user?.twoFactorEnabled ? disable2FA : enable2FA}
              className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground ${
                user?.twoFactorEnabled ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              <Shield className="h-5 w-5 mr-2" />
              {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-card-foreground">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Lock className="h-5 w-5 mr-2" />
              Change Password
            </button>
          </div>
       <EnableNotifications/>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-card-foreground">Active Devices</h3>
              <button
                onClick={logoutAll}
                className="w-25 h-8 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout All
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {activeSessions.map((session) => {
                const isCurrentSession = session.sessionId == localStorage.getItem('sessionId');
                console.log(localStorage.getItem('sessionId'))
                return (
                  <div key={session.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        <p>{session.browser_info}</p>
                        <p>{session.ip_address}</p>
                      </div>
                      {isCurrentSession && <Home className="h-4 w-4 text-primary" />}
                    </div>
                    <button
                      onClick={() => handleSessionLogout(session.sessionId)}
                      className="w-25 h-9 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
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