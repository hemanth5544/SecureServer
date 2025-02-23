import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


interface ChangePasswordModalProps {
  onClose: () => void;
  user: any;
  logout: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose , user, logout}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate= useNavigate();
  console.log('logout prop:', logout); // Debugging: Check if logout is a function

  const handleChangePassword = async () => {
    try {
      if (currentPassword == newPassword) {
        toast.error("Pookie both are same");
      } else {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("sessionId");

        const response = await axios.post(
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

        toast.success("Password changed successfully");
        logout();
        onClose();
        navigate('/login');
      }
    } catch (error) {
        console.log(error,"errr")
      toast.error("Please check your current password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-card-foreground">Change Password</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-card-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              placeholder="Enter new password"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};