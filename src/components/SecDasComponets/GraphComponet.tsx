import { useEffect,useState}from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const CustomGraph = () => {
const [devices, setDevices] = useState([]); 
useEffect(() => {
  const fetchActiveDevices = async () => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    if (!token || !sessionId) {
      toast.error("Authentication required.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/devices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-session-id": sessionId,
          },
        }
      );
      setDevices(response.data.devices);
    } catch (error) {
      console.error("Error fetching active devices:", error);
      toast.error("Error fetching active devices.");
    }
  };

  fetchActiveDevices();
}, []);

  return (
      <div>
        <h2>Active Devices</h2>
        {devices.length > 0 ? (
          <ul>
            {devices.map((device) => (
              <li key={device.id}>
                <p>Device Name: {device.device_name}</p>
                <p>Successful Attempts: {device.success_attempts}</p>
                <p>Failed Attempts: {device.fail_attempts}</p>
                <p>Last Attempted At: {device.last_attempted_at}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active devices found.</p>
        )}
        </div>
    
  );
};