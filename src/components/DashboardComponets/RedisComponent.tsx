import { DatabaseZap } from "lucide-react";

export const RedisStatus = () => {
  return (
    <div className="ml-5">
      <div className="space-y-4">
        <div className="flex items-start space-x-5">
          <div className="p-3 flex bg-green-100 rounded-full">
            <DatabaseZap className="h-6 w-6 text-green-600 space-y-19" /> 
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Redis Cache Enabled
            </h3>
            <p className="text-muted-foreground">
              Your application is using Redis for caching to improve performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};