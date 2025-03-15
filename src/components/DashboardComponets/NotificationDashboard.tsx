import { Bell } from "lucide-react";

export const NotificationStatus = () => {
  return (
    <div className="ml-5 mt-3">
      <div className="space-y-4">
        <div className="flex items-start space-x-5">
          <div className="p-3 flex bg-green-100 rounded-full">
            <Bell className="h-6 w-6 text-green-600 space-x-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Notifications
            </h3>
            <p className="text-muted-foreground h-10">
              You can get alerts on login and signups
            </p>
          </div>
        </div>

       </div>
      </div>
  );
};
