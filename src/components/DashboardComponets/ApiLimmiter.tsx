import React from "react";
import { Gauge } from "lucide-react"; 
export const RateLimitingStatus = () => {
  return (
    <div className="ml-5">
      <div className="space-y-4">
        <div className="flex items-start space-x-5">
          <div className="p-3 flex bg-blue-100 rounded-full">
            <Gauge className="h-6 w-6 text-blue-600 space-x-5" /> 
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              API Rate Limiting Enabled
            </h3>
            <p className="text-muted-foreground">
              Your application is protected against abuse by limiting
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};