import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordModalProps {
  onClose: () => void;
  user: any;
  logout: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, user, logout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordStrengthText = ['Weak', 'Fair', 'Good', 'Strong'];
  const passwordStrengthColor = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ];

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Please use a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const sessionId = localStorage.getItem("sessionId");

      await axios.post(
        "http://localhost:3000/api/updatePass",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
        }
      );

      toast.success("Password changed successfully. Please log in again.");
      setIsLoading(false);
      logout();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error("Password change error:", error);
      setIsLoading(false);
      toast.error("Failed to change password. Please check your current password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border animate-in fade-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground flex items-center">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Change Password
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-card-foreground rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-card-foreground">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-card-foreground">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Password strength:</span>
                  <span className={passwordStrength >= 3 ? "text-green-500" : passwordStrength >= 2 ? "text-blue-500" : passwordStrength >= 1 ? "text-yellow-500" : "text-red-500"}>
                    {passwordStrengthText[passwordStrength]}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrengthColor[passwordStrength]}`} 
                    style={{ width: `${(passwordStrength + 1) * 25}%` }}
                  ></div>
                </div>
                <ul className="text-xs space-y-1 text-muted-foreground mt-2">
                  <li className="flex items-center">
                    {newPassword.length >= 8 ? 
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-red-500 mr-1" />}
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    {/[A-Z]/.test(newPassword) ? 
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-red-500 mr-1" />}
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    {/[0-9]/.test(newPassword) ? 
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-red-500 mr-1" />}
                    At least one number
                  </li>
                  <li className="flex items-center">
                    {/[^A-Za-z0-9]/.test(newPassword) ? 
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-red-500 mr-1" />}
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-card-foreground">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border bg-background text-foreground pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500"
                    : "border-input"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> Passwords do not match
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};