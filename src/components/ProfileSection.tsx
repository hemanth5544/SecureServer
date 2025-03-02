import React, { useRef, useState } from 'react';
import { User, Camera, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface ProfileSectionProps {
  user: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      await axios.post('http://localhost:3000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-session-id': sessionId,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden border max-w-sm ml-auto">
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
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Display Name</label>
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
  );
};