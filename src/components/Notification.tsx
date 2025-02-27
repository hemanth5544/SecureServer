import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, BellOff } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const EnableNotifications = ({ userId }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false); // Default state for notifications
  const [isLoading, setIsLoading] = useState(false); // To show loading state during API call

  // Fetch the user's notification status when the component mounts
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const sessionId = localStorage.getItem('sessionId');
        const response = await axios.get(`http://localhost:3000/api/notifyStatus`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'x-session-id': sessionId,
          },
        });

        if (response.data && response.data.email_notifications_enabled !== undefined) {
          setIsNotificationsEnabled(response.data.email_notifications_enabled === 1);
        }
      } catch (error) {
        console.error('Error fetching notification status', error);
      }
    };

    fetchNotificationStatus();
  }, [userId]);

  const handleNotifications = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const enableNotifications = !isNotificationsEnabled; // Toggle notification state
      await axios.post(
        'http://localhost:3000/api/notify',
        { userId, enableNotifications },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'x-session-id': sessionId,
          },
        }
      );

      toast.success(enableNotifications ? 'Notifications enabled successfully' : 'Notifications disabled successfully');
      setIsNotificationsEnabled(enableNotifications); // Update state based on the response
    } catch (error) {
      toast.error('Error updating notification preferences');
    } finally {
      setIsLoading(false); // Stop loading after API call
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-md font-medium text-card-foreground">Enable Notifications</h3>
        <p className="text-sm text-muted-foreground">Get notifications on logins and signups</p>
      </div>
      <button
        onClick={handleNotifications}
        disabled={isLoading} // Disable the button while loading
        className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground ${
          isNotificationsEnabled
            ? 'bg-destructive hover:bg-destructive/90' // Red button for disabling notifications
            : 'bg-primary hover:bg-primary/90' // Blue button for enabling notifications
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
      >
        {isNotificationsEnabled ? (
          <BellOff className="h-5 w-5 mr-2" />
        ) : (
          <Bell className="h-5 w-5 mr-2" />
        )}
        {isNotificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
      </button>
    </div>
  );
};

export default EnableNotifications;
