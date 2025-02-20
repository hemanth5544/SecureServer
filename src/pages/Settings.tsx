import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowLeft, Camera, User, Loader2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut} from 'lucide-react';


export default function Settings() {
  const navigate = useNavigate();
  const { user ,logout} = useAuth();
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);  
  console.log(user);

  const enable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/2fa/enable',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
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
      await axios.post(
        'http://localhost:3000/api/2fa/verify',
        { token },
        {
          headers: { Authorization: `Bearer ${authToken}` }
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
      await axios.post(
        'http://localhost:3000/api/2fa/disable',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
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
console.log(user.profileImage);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (name) {
        formData.append('name', name);
      }
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('profileImage', fileInputRef.current.files[0]);
      }

      const response = await axios.post(
        'http://localhost:3000/api/user/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      toast.success('Profile updated successfully');
      window.location.reload();
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-4">
          <button
            onClick={() => navigate('/')}
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
              <h2 className="text-lg font-medium text-card-foreground mb-4">Profile Settings</h2>
              
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
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
            <div className="p-6">
              <h2 className="text-lg font-medium text-card-foreground mb-4">Security Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-card-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  {!isEnabling2FA && (
                    <button
                      onClick={user?.twoFactorEnabled ? disable2FA : enable2FA}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground ${
                        user?.twoFactorEnabled
                          ? 'bg-destructive hover:bg-destructive/90'
                          : 'bg-primary hover:bg-primary/90'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  )}
                </div>

                {isEnabling2FA && (
                  <div className="mt-4 space-y-4">
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
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Verify and Enable 2FA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}