import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  LogOut,
  Shield,
  User,
  Clock,
} from "lucide-react";
import {SecurityStatus} from "../components/SecurityStatus"
import {NotificationStatus} from '../components/NotificationDashboard'
import {Navbar} from '../components/Navbar'
import { UserProfileCard } from "../components/UserProfileCard";
//TODO: Notifications flex in dasboard

export default function Dashboard() {
  const { user, lastActivity, logout } = useAuth();
  const navigate = useNavigate(); 



  return (
    <div className="min-h-screen bg-background">
    <Navbar/>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
            <UserProfileCard/>
            </div>
            

            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
              <div className="p-6">
                {/* Security Status Section */}
                <div className="flex items-start space-x-4">
                  {/* Shield Icon */}
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  {/* Security Status Content */}
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">
                      Security Status
                    </h2>
                    <p className="text-muted-foreground">
                      2FA is {user?.twoFactorEnabled ? "enabled" : "disabled"}
                    </p>
                  </div>
                </div>

                {/* Last Activity Section */}
                <div className="mt-4 flex items-start space-x-4">
                  {/* Clock Icon */}
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  {/* Last Activity Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Last Activity
                    </h3>
                    <p className="text-muted-foreground">
                      {lastActivity ? (
                        <>
                          <strong>Browser Info:</strong>{" "}
                          {lastActivity.browser_info} <br />
                          <strong>Status:</strong> {lastActivity.status}<br/>
                          <strong>Ip:</strong>{lastActivity.ip_address}
                        </>
                      ) : (
                        "No activity found"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}