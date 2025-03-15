import React, { useRef, useState, useEffect } from 'react';
import { User, Camera, Loader2, Mail, Edit, X, Calendar, Shield, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

interface ProfileSectionProps {
  user: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
console.log(user,"userrrrrrr")
  // Create preview URL for selected image
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowEditModal(false);
      }
    };

    if (showEditModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditModal]);

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!name.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const formData = new FormData();
      formData.append('name', name.trim());
      
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      await axios.post(`${apiUrl}/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-session-id': sessionId,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile updated successfully');
      setShowEditModal(false);
      
      // In a real app, you would update the user state here
      // This is just a placeholder
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : '?';
    
  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown';

  return (
    <div className="bg-card shadow-xl rounded-lg overflow-hidden border border-border/30">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Your Profile
        </h2>
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm border border-primary/30 rounded-md shadow-sm font-medium text-primary bg-background hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-all duration-200"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Profile image on the left */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center border-4 border-background shadow-lg">
              {user?.profileImage ? (
                <img
                  src={`http://localhost:3000${user.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary text-3xl font-bold">{userInitials}</span>
              )}
            </div>
          </div>
          
          {/* User details on the right */}
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-foreground mb-2">{user?.name || 'User'}</h3>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Mail className="w-4 h-4 mr-2 text-primary/70" />
              <span>{user?.email || 'No email available'}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center border border-primary/20">
                <Shield className="w-3 h-3 mr-1" />
                Active Account
              </div>
              <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full inline-flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Joined {joinedDate}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Account Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground">Total Logins</div>
                  <div className="text-lg font-semibold text-foreground">{user?.loginCount || 0}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground">Last Active</div>
                  <div className="text-lg font-semibold text-foreground">Today</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/30 hidden md:block">
                  <div className="text-xs text-muted-foreground">Account Type</div>
                  <div className="text-lg font-semibold text-foreground">Standard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div 
            ref={modalRef}
            className="bg-background rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit className="w-4 h-4 mr-2 text-primary" />
                Edit Your Profile
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group cursor-pointer">
                    <div 
                      className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center border-4 border-background shadow-xl transition-all duration-300 group-hover:shadow-primary/20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (  
                        <img
                          src={previewUrl} 
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
                        <span className="text-primary text-4xl font-bold">{userInitials}</span>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    
                    {/* <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <span className="text-white text-sm font-medium px-3 py-1.5 bg-black/50 rounded-full backdrop-blur-sm">Change photo</span>
                    </div>
                     */}
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute -top-1 -right-1 p-1 bg-destructive rounded-full text-destructive-foreground border border-background shadow-md"
                        aria-label="Remove selected image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/jpg"
                    onChange={handleImageChange} 
                  />
                  <p className="text-xs text-muted-foreground">
                    Click the image to upload a new photo (max 5MB)
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      Display Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                      placeholder="Enter your display name"
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 rounded-md border border-input bg-muted text-muted-foreground cursor-not-allowed pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Email address cannot be changed for security reasons
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full py-2.5 px-4 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin mr-2 w-5 h-5" />
                      ) : (
                        'Save Changes'
                      )}
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