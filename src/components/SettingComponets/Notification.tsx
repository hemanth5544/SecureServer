import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
const apiUrl = import.meta.env.VITE_API_URL;

const EnableNotifications = ({ userId }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const sessionId = localStorage.getItem('sessionId');
        const response = await axios.get(`${apiUrl}/notifyStatus`, {
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

      const enableNotifications = !isNotificationsEnabled;
      await axios.post(
        `${apiUrl}/notify`,
        { userId, enableNotifications },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'x-session-id': sessionId,
          },
        }
      );

      toast.success(enableNotifications ? 'Notifications enabled successfully' : 'Notifications disabled successfully');
      setIsNotificationsEnabled(enableNotifications);
    } catch (error) {
      toast.error('Error updating notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleNotifications}
      disabled={isLoading}
      className="px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {isNotificationsEnabled ? 'Disable' : 'Enable'}
    </button>
  );
};

export default EnableNotifications;