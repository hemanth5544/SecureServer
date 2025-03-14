import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Shield, Settings as SettingsIcon } from 'lucide-react';
import { ProfileSection } from '../components/SettingComponets/ProfileSection';
import { SecuritySection } from '../components/SettingComponets/SecuritySection';
import { ThemeToggle } from '../components/ThemeToggle';
import { Navbar } from '../components/Navbar';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* <div className="px-4 sm:px-0 mb-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div> */}

        {/* Settings Navigation Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === 'profile' && <ProfileSection user={user} />}
          {activeTab === 'security' && <SecuritySection user={user} logout={logout} />}
        </div>
      </div>
    </div>
  );
}