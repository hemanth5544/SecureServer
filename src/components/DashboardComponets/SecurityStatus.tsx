import { ShieldCheck } from "lucide-react";

export const SecurityStatus = () => {
  return (
   <div className="ml-5">
      <div className="space-y-4">
        <div className="flex items-start space-x-5">
          <div className="p-3 flex bg-green-100 rounded-full">
            <ShieldCheck className="h-6 w-6 text-green-600 space-x-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Helmet Security Enabled
            </h3>
            <p className="text-muted-foreground">
              Your application is protected against XSS, clickjacking, and other
              common vulnerabilities.
            </p>
          </div>
        </div>

       </div>
      </div>
  );
};

