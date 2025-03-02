import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { ProfileSection } from '../components/ProfileSection';
import { SecuritySection } from '../components/SecuritySection';
import { ThemeToggle } from '../components/ThemeToggle';
import { Navbar } from '../components/Navbar';



export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
         <Navbar/>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
         
        <ProfileSection user={user} /> 
          <SecuritySection user={user} logout={logout} />
         
        </div>
      
      </div>
    </div>
  );
}