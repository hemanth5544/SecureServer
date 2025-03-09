import { Shield, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
export const DashboardStats = () => {
    const {user,lastActivity}=useAuth();
  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
      <div className="p-6">
        {/* Security Status Section */}
        <div className="flex items-start space-x">
          {/* Shield Icon */}
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-6 w-6 text-primary" />
            
          </div>
          <Link
              to="/sec-das"
              className="text-muted-foreground hover:text-card-foreground p-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:opacity-90"
              >
            <h2 className="text-lg font-semibold text-card-foreground">
                Security Dashboard
              </h2>
            </Link>
    
    
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
              Recent Activity
            </h3>
            <p className="text-muted-foreground">
              {lastActivity ? (
                <>
                  <strong>Browser Info:</strong> {lastActivity.browser_info}{" "}
                  <br />
                  <strong>Status:</strong> {lastActivity.status}
                  <br />
                  <strong>Ip:</strong>
                  {lastActivity.ip_address}
                </>
              ) : (
                "No activity found"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
