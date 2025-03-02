import React from "react";
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NotificationStatus } from "./NotificationDashboard";
import { SecurityStatus } from "./SecurityStatus";
import { Shield} from "lucide-react";

export const UserProfileCard = () => {
  const { user } = useAuth();

  return (
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-accent flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={`http://localhost:3000${user.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {user?.name || "Welcome!"}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            {/* 2FA Disabled Badge */}
          {!user?.twoFactorEnabled && (
            <div className="mt-2 inline-flex items-center space-x-2 bg-gray-400 text-white px-2 py-1 rounded-full text-xs">
              <Shield className="w-4 h-4" />
              <span>2FA Disabled</span>
            </div>
          )}

          </div>
        </div>
      </div>
     
  
  );
};
