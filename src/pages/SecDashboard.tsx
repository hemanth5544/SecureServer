import { useEffect,useState}from "react";
import { GlobeComponent } from "../components/SecDasComponets/GlobeComponent";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

export const SecDashboard = () => {
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
        setDevices(response.data.devices); // Update state with the fetched devices
      } catch (error) {
        console.error("Error fetching active devices:", error);
        toast.error("Error fetching active devices.");
      }
    };

    fetchActiveDevices();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const token = localStorage.getItem("token");
          const sessionId = localStorage.getItem("sessionId");
          if (token && sessionId) {
            axios.post(
              "http://localhost:3000/api/geo-locations", 
              {
                latitude,
                longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-session-id": sessionId,
                },
              }
            )
            .then((response) => {
              console.log("Geolocation sent successfully:", response.data);
            })
            .catch((error) => {
              console.error("Error sending geolocation:", error);
              toast.error("Error saving geolocation.");
            });
          } else {
            console.error("No token or sessionId found in localStorage.");
            toast.error("Authentication required.");
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          toast.error("Error retrieving geolocation.");
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
      toast.error("Geolocation is not supported in this browser.");
    }
  }, []);

  return (
 
    <div className="relative h-screen">
    
      <GlobeComponent />
      <Navbar/>
      <h1>Audit Logs</h1>
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
            </div>
  );
};
