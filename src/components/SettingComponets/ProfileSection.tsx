import React, { useRef, useState } from 'react';
import { User, Camera, Loader2, Mail, Edit, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface ProfileSectionProps {
  user: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      await axios.post('http://localhost:3000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-session-id': sessionId,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
      <div className="bg-primary/10 p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile
        </h2>
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center px-3 py-1 text-sm border border-transparent rounded-md shadow-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-colors"
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start">
          {/* Profile image on the left */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-accent flex items-center justify-center border-2 border-background shadow-md">
              {user?.profileImage ? (
                <img
                  src={`http://localhost:3000${user.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {/* User details on the right */}
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-foreground mb-1">{user?.name || 'User'}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Mail className="w-4 h-4 mr-1" />
              <span>{user?.email || 'No email available'}</span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
              Active Account
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-accent flex items-center justify-center border-4 border-background shadow-md">
                      {selectedImage ? (  
                        <img
                          src={URL.createObjectURL(selectedImage)} 
                          alt="Selected Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.profileImage ? (  
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
                      className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-medium">Change photo</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange} 
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Display Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 rounded-md border border-input bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full py-2 px-4 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};